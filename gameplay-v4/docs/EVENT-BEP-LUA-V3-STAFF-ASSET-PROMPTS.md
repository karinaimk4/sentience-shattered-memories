# Bếp Lửa Thái Hư V3 — Prompt Set Nhân Viên

## Style khóa chung

Cute clean 2D pixel-art chibi game asset, faux-3D volume, crisp clusters, bright neutral lighting, saturated but clean colors, strong readable silhouette, same body proportion and outline weight across the full roster, transparent background, no text, no UI, no extra character.

## Portrait gacha

Vertical full-body character card art, centered pose, recognizable canonical hair silhouette, eye color, signature accessories and costume palette; dark violet studio background with a soft character-colored rim light. Keep the same rendering density, camera distance and body proportion for every employee.

## Model sheet nguồn

Three full-body chibi poses on transparent background in one horizontal row: front, back, right-facing side. Identical scale, baseline and camera; arms separated from torso enough for animation extraction; no cast shadow; no labels; no grid.

## Elysia — Herrscher of Origin

Long pastel-pink hair, violet-pink eyes, large white wing-shaped hair ornaments with gold and pink crystal details, white/lavender/gold Herrscher of Origin dress, translucent petal-like tails, floral pink crystal at chest, white gloves and white thigh-high boots. Warm elegant smile and welcoming receptionist gesture. Do not replace the wing ornaments, do not use a generic pink fantasy dress, and do not change the white-lavender-gold palette.

## Runtime chuẩn hóa

Model sheet nguồn được đưa qua `tools/build-event-v3-staff-animation-sheets.cjs` để xuất sheet 192×576, 4 cột × 9 hàng, cell 48×64. Thứ tự hàng: idle xuống, đi xuống, đi lên, đi phải, làm việc A, làm việc B, biểu cảm, nghỉ, ngủ gục. Đi trái lật từ đi phải trong runtime.
