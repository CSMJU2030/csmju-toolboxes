INSERT INTO "tools" (
  "id",
  "name",
  "description",
  "category",
  "is_active",
  "created_at",
  "updated_at"
)
VALUES (
  '61a454f9-1c52-4d0e-882f-7f16d3cdff01',
  'ลดขนาดรูปภาพ',
  'บีบอัดและปรับขนาดรูปภาพในเบราว์เซอร์ แล้วดาวน์โหลดไฟล์ที่เล็กลง',
  'IMAGE',
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "category" = EXCLUDED."category",
  "is_active" = TRUE,
  "updated_at" = CURRENT_TIMESTAMP;
