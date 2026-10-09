# Sentience: Shattered Memories — Gear & Combat Numbers v1

## Nền tảng tham khảo

- Vũ khí Honkai Impact 3rd tồn tại từ 1★ đến 5★; PRI-ARM là bậc nâng cao sau 5★.
- Vết Thánh có ba vị trí T/M/B, cộng chỉ số riêng và mở bonus khi mang 2 hoặc 3 món cùng bộ.
- Bản fan-game giữ cấu trúc này nhưng bỏ gacha và giảm số loại nguyên liệu.

## 1. Chỉ số nhân vật

HoS cấp 1:

| Chỉ số | Giá trị | Ý nghĩa |
|---|---:|---|
| HP | 1,000 | Máu tối đa |
| ATK | 100 | Nguồn sát thương chính |
| DEF | 80 | Giảm sát thương vật lý |
| Crit Rate | 5% | Xác suất chí mạng |
| Crit DMG | 150% | Tổng hệ số khi chí mạng |
| Resolve | 100 | Năng lượng cho Herrscher Mode |
| Assist | 100 | Thanh gọi Fu Hua |

Mỗi cấp nhân vật: `HP +35`, `ATK +5`, `DEF +3`. Cấp tối đa ban đầu: 50.

Giới hạn mềm:

- Crit Rate tối đa 75% trong trang bị; buff tạm thời có thể đạt 100%.
- Crit DMG từ trang bị tối đa +100%.
- Tốc đánh tối đa +35%.
- Giảm hồi chiêu tối đa 30%.
- Khiên tối đa bằng 60% HP.

## 2. Công thức sát thương

```text
Base = ATK tổng × hệ số kỹ năng
Offense = (1 + Physical DMG) × (1 + Total DMG)
Defense = 100 / (100 + DEF hiệu dụng của mục tiêu)
Crit = 1 hoặc Crit DMG
Final = Base × Offense × Defense × Crit × Combo × Difficulty
```

- `ATK tổng = ATK nhân vật + ATK vũ khí + ATK Vết Thánh`.
- `Combo = 1 + min(ComboCount, 100) × 0.002`, tối đa +20%.
- Phá giáp làm giảm DEF hiệu dụng, không cộng thẳng sát thương.
- Các nguồn cùng tên cộng với nhau; nhóm Physical, Total, Crit và “mục tiêu nhận thêm” nhân riêng để build có ý nghĩa nhưng không nổ số quá nhanh.
- Damage hiển thị được làm tròn; tính toán bên trong giữ số thập phân.

Hệ số kỹ năng gốc:

| Đòn | Hệ số |
|---|---:|
| Kiếm đánh thường | 0.75 / hit |
| Kiếm phản đòn | 2.20 |
| Thương đâm | 1.10 |
| Thương phá giáp | 2.60 |
| Xích quét | 0.55 × 4 hit |
| Xích kéo | 1.40 |
| Fu Hua Assist | 3.00 |
| Edge of Taixuan | 7.50 |
| Herrscher finisher | 10.00 |

## 3. Cấp trang bị

| Bậc | Màu UI | Cấp tối đa | Vai trò |
|---|---|---:|---|
| 2★ Thường | Đồng | 20 | Đồ hướng dẫn, nâng rẻ |
| 3★ Hiếm | Xanh | 30 | Build đầu Story |
| 4★ Sử thi | Tím | 40 | Build giữa game, bắt đầu có cơ chế riêng |
| 5★ Huyền thoại | Vàng | 50 | Build cuối Story/Endless |
| PRI-ARM 6★ | Đỏ–vàng/prism | 65 | Endgame, thêm hoặc biến đổi kỹ năng |

Đồ thấp cấp không bị vô dụng hoàn toàn: nâng tối đa sẽ hoàn 80% vật liệu khi tái chế và một số nội tại đơn giản vẫn tốt cho thử thách giới hạn trang bị.

## 4. Danh sách Lõi Vũ Khí

| # | Tên | Bậc | ATK tối đa | Crit | Nội tại |
|---|---|---:|---:|---:|---|
| 1 | Cloth-Wrapped Resolve | 2★ | 35 | 2% | Sau khi né hoàn hảo, đòn kế +12% DMG |
| 2 | Schicksal Training Fists | 3★ | 62 | 4% | Đánh thường hồi thêm Resolve |
| 3 | Jade Current Bracers | 3★ | 58 | 6% | Đổi vũ khí tăng tốc chạy/đánh 8% trong 4 giây |
| 4 | Grips of Tai Xuan | 4★ | 96 | 8% | Parry tạo kiếm ảnh và khóa thời gian ngắn |
| 5 | Fenghuang Down | 4★ | 92 | 6% | Fu Hua Assist để lại lông vũ hồi HP/Resolve |
| 6 | Domain of Sentience | 5★ | 132 | 10% | Đổi kiếm–thương–xích giảm hồi chiêu và tăng Resolve |
| 7 | Infinite Intimidator | 5★ | 145 | 8% | Ném “cục gạch” khi combo đạt 30; gây Choáng |
| 8 | Incredibly Infinite Intimidator | 6★ | 182 | 12% | Cục gạch nâng cấp; Herrscher Mode có finisher riêng |
| 9 | Shattered Memory Core | 6★ bí mật | 170 | 10% | HoS và Fu Hua cùng đánh; đổi vũ khí đúng nhịp tăng Assist |

Lõi vũ khí không thay thế ba hình thái kiếm/thương/xích trên sân. Nó cộng stat và thay đổi cách bộ ba hoạt động.

## 5. Bộ Vết Thánh

### Training Memory — 2★

- **T:** ATK +10; đánh thường +5% DMG.
- **M:** HP +100; nhận ít hơn 4% sát thương.
- **B:** DEF +10; tốc chạy +5%.
- **2 món:** Khiên checkpoint tồn tại thêm 3 giây.
- **3 món:** Hồi 15% HP một lần mỗi phân đoạn.

### Nagazora Survivor — 3★

- **T:** ATK +18; Physical DMG +6%.
- **M:** HP +160; kháng Choáng +20%.
- **B:** Crit Rate +4%; né hoàn hảo hồi 8 Resolve.
- **2 món:** Né hoàn hảo gọi một tia sét ký ức gây 80% ATK.
- **3 món:** Sau khi mất HP, +12% tốc chạy và +10% Total DMG trong 6 giây.

### Taixuan Companions — 4★

- **T:** ATK +28; Fu Hua Assist DMG +15%.
- **M:** HP +220; khi Fu Hua xuất hiện nhận khiên bằng 10% HP.
- **B:** Crit Rate +6%; tốc hồi Assist +12%.
- **2 món:** HoS né hoàn hảo giảm 2 giây hồi chiêu Fu Hua.
- **3 món:** Edge of Taixuan để lại vùng Song Hành 8 giây: HoS +15% Physical DMG, Fu Hua đánh phụ mỗi 2 giây.

### Sovereign of Sentience — 5★

- **T:** ATK +42; Physical DMG +12%.
- **M:** HP +280; Herrscher Mode giảm 15% sát thương nhận.
- **B:** Crit Rate +8%; đổi hình thái hồi 6 Resolve.
- **2 món:** Combo Attack khiến mục tiêu nhận thêm 10% Physical DMG trong 8 giây.
- **3 món:** Herrscher Mode +20% Crit DMG; finisher kéo toàn bộ quái thường vào tâm.

### Shattered Memories — 5★ bí mật

- **T:** ATK +38; Total DMG +8%.
- **M:** HP +250; khiên của Fu Hua mạnh hơn 20%.
- **B:** Crit Rate +7%; Assist và Resolve hồi nhanh hơn 8%.
- **2 món:** Mỗi lần HoS/Fu Hua nối đòn đúng nhịp nhận 1 Memory Echo, tối đa 5.
- **3 món:** Ở 5 Echo, combo kế kích hoạt Dual Finisher; hồi 20 Assist và gây 500% ATK, hồi chiêu 18 giây.

## 6. Nâng cấp

### Cường hóa

- Vũ khí/Vết Thánh nhận EXP trang bị và dùng Coin.
- Có nút thêm vật liệu tự động, không bắt bấm từng món.
- EXP dư được giữ lại sau đột phá.

### Đột phá

- 2★/3★ dùng Hợp Kim Honkai.
- 4★/5★ dùng Hợp Kim Honkai + Phase Shard.
- PRI-ARM dùng Torus Fragment từ boss, thử thách chương và mốc Endless.

### Chi phí mục tiêu

| Hành động | Coin | Vật liệu |
|---|---:|---|
| Max 2★ | 4,000 | 8 Alloy |
| Max 3★ | 12,000 | 22 Alloy |
| Max 4★ | 35,000 | 40 Alloy + 8 Phase |
| Max 5★ | 80,000 | 70 Alloy + 24 Phase |
| Mở PRI-ARM | 120,000 | 60 Torus + 40 Phase |

## 7. Difficulty và cân bằng

| Chế độ | HP quái | DMG quái | Phần thưởng |
|---|---:|---:|---:|
| Story | 100% | 100% | 100% |
| Story Casual | 80% | 70% | 90% |
| Memory Hard | 165% | 140% | 150% |
| Endless | tăng 8% mỗi biome | tăng 5% mỗi biome | tăng theo mốc |

- Story thường luôn hoàn thành được bằng bộ 3★ nâng đúng cấp.
- 4★ tạo build rõ ràng; 5★ tối ưu và mở hiệu ứng đẹp hơn, không phải chìa khóa bắt buộc.
- Endless sau biome 10 dùng tăng kháng/AI/hazard nhiều hơn tăng HP để tránh quái “bọt biển”.

## 8. Nguồn rơi

- 2★: tutorial và rương thường.
- 3★: hoàn thành mục tiêu chương.
- 4★: mini-boss, ký ức ẩn và chế tạo.
- 5★: boss chương, thử thách Hard, bộ sưu tập ký ức.
- PRI-ARM: nâng từ 5★, không rơi trực tiếp.
- Shattered Memories: mở bằng ending bí mật/Ký ức #0.

