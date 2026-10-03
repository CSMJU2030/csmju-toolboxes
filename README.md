# csmju-toolboxes

CS Toolboxes — ระบบย่อยของโครงการ CSMJU2030

มาตรฐานกลางอยู่ใน `standards/` (submodule ของ CSMJU2030/csmju2030-standards)

## เริ่มทำงาน

```powershell
git submodule update --init --remote standards/
pnpm install
git checkout -b feature/toolboxes/<เรื่องที่ทำ>
```

ก่อนเปิด PR อ่าน `standards/docs/github-workflow.md` ข้อ 1

## PostgreSQL ผ่าน Docker

ระบบใช้ PostgreSQL 16 แยกฐานข้อมูลของตัวเองชื่อ `toolboxes_db` และเชื่อมผ่าน NestJS/Prisma เท่านั้น ไม่เชื่อม Core Hub database ตรง ๆ ข้อมูล PostgreSQL เก็บใน Docker volume `toolboxes-postgres-data` ส่วนพอร์ตที่เปิดให้เครื่องนี้คือ `localhost:5434` เพื่อหลีกเลี่ยง PostgreSQL เดิมที่อาจใช้พอร์ต 5432 ไฟล์รูปประวัติแยกเก็บใน Docker volume `toolboxes-image-history-data` และลบอัตโนมัติเมื่อครบ 30 วัน

### เริ่มใช้งานครั้งแรก

1. ติดตั้งและเปิด Docker Desktop
2. คัดลอก `.env.example` เป็น `.env.local` หากยังไม่มี แล้วตั้ง `POSTGRES_PASSWORD` เป็นรหัสผ่านสุ่มที่เดายาก และให้ `DATABASE_URL` ใช้รหัสผ่านเดียวกัน (ห้าม commit `.env.local`)
3. เปิด PowerShell ที่โฟลเดอร์รากแล้วรัน:

   ```powershell
   docker compose --env-file .env.local up -d --build
   ```

   Compose จะเริ่ม PostgreSQL, รอ health check, สร้าง backend และรัน `prisma migrate deploy` ก่อนเริ่ม API
4. ตรวจสถานะด้วย `docker compose --env-file .env.local ps` และดู log ด้วย `docker compose --env-file .env.local logs -f backend`
5. เปิด frontend อีกหน้าต่างด้วย `pnpm dev:frontend` แล้วเข้า `http://localhost:3237`

API backend ใน Docker เปิดที่ `http://localhost:4237` ส่วน PostgreSQL เปิดรับการเชื่อมต่อจากเครื่องนี้ที่ `localhost:5434` เท่านั้น

### โหมดพัฒนา backend บนเครื่อง

ถ้าต้องการใช้ watch mode แทน backend container ให้ปิด backend container ก่อน แล้วรัน:

```powershell
docker compose --env-file .env.local stop backend
docker compose --env-file .env.local up -d postgres
pnpm --dir backend prisma migrate deploy
pnpm dev:backend
```

`.env.local` ตั้ง `DATABASE_URL` ให้ชี้ไปยังพอร์ตของ Docker ที่ `5434` แล้ว

### หยุดและลบข้อมูล

หยุด containers โดยเก็บข้อมูลฐานข้อมูลไว้:

```powershell
docker compose --env-file .env.local down
```

ลบฐานข้อมูลใน Docker volume ด้วย (ข้อมูลทั้งหมดจะหาย):

```powershell
docker compose --env-file .env.local down -v
```

คำสั่งนี้ลบทั้งข้อมูล PostgreSQL และไฟล์รูปประวัติ อย่าใช้หากยังต้องการเก็บข้อมูล

### Image history API

API เก็บรูปต้นฉบับและรูปที่บีบอัดใน volume โดยบันทึก metadata และ `coreUserId` จาก access token ที่ตรวจแล้วลง PostgreSQL เท่านั้น ไม่รับตัวตนจาก request body

- `POST /api/v1/image-history` — multipart fields `original` และ `compressed` (JPG/PNG/WebP, ไม่เกิน 25 MB ต่อไฟล์)
- `GET /api/v1/image-history` — รายการของผู้ใช้ปัจจุบันที่ยังไม่หมดอายุ
- `GET /api/v1/image-history/:id/original` และ `/:id/compressed` — ดาวน์โหลดไฟล์ของเจ้าของรายการ
- `DELETE /api/v1/image-history/:id` — ลบรายการและไฟล์ก่อนครบกำหนด

ทุก endpoint ต้องมี Bearer token ตาม Core Hub SSO การลบหมดอายุทำทุกวันเวลา 03:00 น. เวลาไทย การเชื่อมหน้าเว็บเข้ากับ API จะทำหลังมี session/token จาก SSO เพื่อไม่สร้างระบบยืนยันตัวตนแยก
