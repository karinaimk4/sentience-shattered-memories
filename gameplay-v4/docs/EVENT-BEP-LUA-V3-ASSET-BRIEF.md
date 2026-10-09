# BẾP LỬA THÁI HƯ — ASSET BRIEF V3: PIXEL CHIBI 2D

> 04/10/2026 · Đi kèm `EVENT-BEP-LUA-V3-CO-CHE-CHO-GPT.md`. Mọi số đo ở đây khớp lưới 32 px của file cơ chế.

---

## 0. Chốt một style duy nhất — bỏ phần còn lại

Bộ hiện có đang lẫn 4 style, **không được trộn vào cảnh Rush**:

| File hiện có | Style | Dùng thế nào |
|---|---|---|
| `assets/event-demo/FULL-ASSET-OVERVIEW-v3.png`, `food/`, `ingredients/` | Sticker vector phẳng, viền trắng | Tạm để trong **thẻ UI** (menu, kho). Không đặt vào cảnh |
| `*-25d.png`, `*-3d-v2.png`, `restaurant-room-3d-v2.png` | 2.5D / 3D render | **Bỏ**, không dùng nữa (giữ file, đừng xoá) |
| `event-minigame-assets-review-v1/01-senti-fuhua-restaurant-sprites.png` | Pixel chibi, đúng nhân vật | **Ảnh chuẩn nhận diện** cho Senti và Fu Hua (đồng phục quán) |
| `gameplay-v2/assets/characters-alpha.png` | Pixel chibi của game chính | **Ảnh chuẩn nhận diện gốc** cho Senti và Fu Hua |
| `decor/restaurant-room-pixel-empty-v1.png` | Pixel, góc nhìn chéo | Chỉ lấy **tông màu và không khí**. Không dùng làm nền vì bàn ghế vẽ dính sẵn |

**Style chốt:** pixel art chibi 2D, góc nhìn **top-down 3/4** (kiểu RPG Maker / Stardew Valley / Kairosoft). **Không isometric chéo**, vì isometric bắt nhân vật có 8 hướng chéo và máy gen ảnh vẽ hướng chéo rất tệ.

---

## 1. Thông số kỹ thuật chung

| Mục | Giá trị |
|---|---|
| Ô lưới | 32×32 px logic |
| Phóng khi hiển thị | ×2 hoặc ×3, nearest-neighbor |
| Ô sprite nhân vật | **48×64 px** |
| Chiều cao nhân vật trong ô | 52–56 px (chibi **2,3 đầu**, đầu chiếm ~45% chiều cao) |
| Điểm neo (chân) | **(24, 60)** trong ô 48×64. Mọi frame của mọi nhân vật đặt chân đúng điểm này |
| Viền | 1 px, màu tím than `#1e1630`, **không** dùng đen tuyền, **không** viền trắng kiểu sticker |
| Bảng màu | ≤ 24 màu mỗi nhân vật; mỗi chất liệu: 1 màu nền + 1 bóng + 1 sáng |
| Ánh sáng | Từ trên bên trái, cố định cho mọi asset |
| Alpha | Chỉ 0 hoặc 255. Không viền mờ, không khử răng cưa, không gradient, không glow mờ |
| Bóng đổ dưới chân | **Không vẽ vào sprite**; engine vẽ elip `rgba(0,0,0,.25)` 20×6 px tại điểm neo |
| Hướng | Xuống (mặt), Lên (lưng), Phải (nghiêng). **Trái = lật ngang Phải** trong engine |

**Ở 48×64, nhận ra nhân vật nhờ ba thứ:** (1) dáng + màu tóc, (2) **một** phụ kiện đầu đặc trưng, (3) màu áo chủ đạo. Phóng to mấy thứ đó lên (kiểu chibi), lược bớt chi tiết áo. Đừng cố vẽ hoa văn váy.

---

## 2. Bố cục sprite sheet (khoá cứng, script đọc theo đúng thứ tự này)

### 2.1. Nhân viên + Senti + Fu Hua — 4 cột × 9 hàng = 192×576 px

| Hàng | Tên animation | Frame | FPS | Ghi chú |
|---|---|---|---|---|
| 0 | `idle_down` | 4 | 4 | Thở: thân nhún 1 px ở frame 1 và 3 |
| 1 | `walk_down` | 4 | 8 | Chạm-trái, qua, chạm-phải, qua. Đầu nhún 1 px khi "qua" |
| 2 | `walk_up` | 4 | 8 | Nhìn lưng. Tóc dài phải đung đưa |
| 3 | `walk_right` | 4 | 8 | Nghiêng sang phải |
| 4 | `work_a` | 4 | 8 | Việc chính của vị trí (bảng 2.3) |
| 5 | `work_b` | 4 | 8 | Việc phụ của vị trí (bảng 2.3) |
| 6 | `emote` | 4 | 6 | Frame 0–1: vui / YATTA giơ tay · Frame 2–3: mệt, lau mồ hôi |
| 7 | `rest` | 4 | 3 | Frame 0–1: ngồi ghế nghỉ (quay xuống) · Frame 2–3: ngồi bệt dưới sàn biểu tình, kiệt sức |
| 8 | `held_doze` | 4 | 6 | Frame 0–1: **bị gắp** lơ lửng, chân đạp đạp (người chơi gắp thả vào phòng nghỉ) · Frame 2–3: **ngủ gật đứng**, đầu gục (tật xấu, chờ bị gõ/đá) |

`idle_up` và `idle_right` = frame 0 của `walk_up` / `walk_right`. Không cần vẽ riêng.

**Bưng khay** không vẽ riêng: engine vẽ sprite khay 16×12 lên tay theo offset từng hướng (bảng 4.3). Hướng lên: khay vẽ **trước** nhân vật (bị người che).

### 2.2. Khách — 4 cột × 6 hàng = 192×384 px

| Hàng | Animation | Ghi chú |
|---|---|---|
| 0 | `idle_down` | |
| 1 | `walk_down` | |
| 2 | `walk_up` | |
| 3 | `walk_right` | |
| 4 | `sit_right` | Ngồi trên ghế băng quay sang phải. Frame 0–1 chờ (đung đưa chân), 2–3 ăn (gắp, nhai). Ngồi quay trái = lật ngang |
| 5 | `emote` | Frame 0–1 vui, trả tiền · Frame 2–3 giận, dậm chân |

### 2.3. `work_a` / `work_b` theo vị trí

| Vị trí | `work_a` | `work_b` | Hướng |
|---|---|---|---|
| Lễ tân | Cúi chào | Gõ máy tính / ghi sổ | Xuống |
| Đầu bếp | Đảo chảo (lửa là hiệu ứng riêng) | Thái thớt | Xuống |
| Phục vụ | Đặt đĩa xuống bàn | Nhấc đĩa từ quầy | Xuống / Lên |
| Dọn dẹp | Lau bàn bằng khăn | Nhặt rác dưới sàn | Xuống |
| Quản lý | Đặc trưng nhân vật (Himeko: nâng ly) | Khoanh tay nhìn quanh | Xuống |
| **Senti** | Thổi kèn YATTA (Cổ Vũ Cưỡng Chế) | Quăng Xích Nhận trói khách rồi lôi ra (đuổi khách) | Phải |
| **Fu Hua** | Xoa thái dương thở dài (YATTA quá cao) | Gõ sổ tay lên đầu nhân viên ngủ gật | Phải |

**Sheet phụ** (cùng ô 48×64, 4 cột):
- `senti-extra` (4×6): lau bàn · nhặt rác · đảo chảo QTE (quay xuống) · đặt đĩa · **đá đít** đánh thức nhân viên · **ngáp rồi vẽ bậy lên tường** (quay lên).
- `fuhua-extra` (4×3): **Edge of Taixuan** (rút → lướt → chém → thu, quay phải) · lau vết vẽ bậy trên tường (quay lên) · mỉm cười nhận trà (quay xuống).
- Cảnh trò hề nhân viên (nằm trong `work_b` hoặc thêm 1 hàng nếu cần): Rozaliya hát mic, Bronya ngồi chơi Switch, Griseo dựng giá vẽ, Himeko nâng ly, Kiana làm khét (khói đen).
- Seele và Veliona là **hai sheet riêng** cùng dáng; engine đổi sheet khi Stamina < 30.

---

## 3. Thẻ nhận diện nhân vật

**Bắt buộc với mọi nhân vật:** đính kèm ít nhất 1 ảnh chính thức HI3 (wiki Fandom / HoYoLAB) khi gen. Chỗ nào bảng dưới khác ảnh chính thức thì **theo ảnh chính thức**. Đồng phục quán là phần được sáng tạo; tóc, mắt và phụ kiện đầu **không được đổi**.

| Nhân vật | Khoá cứng (lấy từ ảnh chuẩn) | Đồng phục quán |
|---|---|---|
| **Senti** | Đúng sprite game chính: tóc dài xanh lam nhạt, lọn đỏ ở mái, cài tóc hình trăng khuyết/sừng vàng trên đầu, mắt đỏ, cười nhe nanh | Hàng trên ảnh `01-senti-fuhua-restaurant-sprites.png`: áo đen viền vàng, tạp dề trắng viền vàng, dây lưng đỏ |
| **Fu Hua** | Đúng sprite game chính: tóc dài xanh tím, mắt xanh ngọc, khuyên tai tua vàng, mặt lạnh | Hàng dưới ảnh `01`: áo trắng, gilê đen, cầm sổ |
| Kiana | Tóc trắng, sợi tóc dựng (ahoge), mắt xanh dương | Tạp dề trắng có sao cam, như ảnh overview v3 |
| Raiden Mei | Tóc dài tím đậm, mắt tím | Áo đầu bếp tím, tạp dề trắng |
| Yae Sakura | Tóc hồng, tai cáo | Đồ miko đỏ-trắng, tay áo buộc dây |
| Rozaliya | Tóc hồng (đối chiếu wiki kiểu tóc và đuôi) | Váy đồng phục lễ tân hồng, cầm mic |
| Liliya | Tóc xanh nhạt, song sinh với Rozaliya (đối chiếu wiki) | Váy phục vụ xanh |
| Seele / Veliona | Seele: tóc dài xanh, kẹp bướm. Veliona: cùng dáng, tông đỏ-đen | Váy phục vụ đen trắng |
| Griseo | Nhỏ con nhất đội, tóc xanh nhạt, cầm cọ (đối chiếu wiki) | Áo khoác vẽ dính sơn |
| Bronya | Tóc bạc xoăn dài, mặt vô cảm; Project Bunny là sprite riêng 32×32 bay cạnh | Áo dọn dẹp xám, găng tay |
| Himeko | Tóc đỏ dài, mắt đỏ | Áo quản lý đỏ, cầm ly |
| Pardofelis | Mũ trùm tai mèo, tóc nâu nhạt tết, mắt xanh, như ảnh `hi3-pixel-core-sheet-v1.png` | Tạp dề mèo, giỏ đi chợ |
| Li Sushang | Tóc nâu dài, đồ trắng-xanh, như ảnh `hi3-pixel-core-sheet-v1.png` | Đeo gùi |

**Khách thường:** 3 thân gốc (nam lớn, nữ lớn, trẻ em) × đổi màu tóc/áo theo phe: dân Arc City, học viên St. Freya, kỹ thuật viên Schicksal, môn sinh Thái Hư, bà cụ Nagazora. Đổi màu bằng bảng palette trong code, **không gen lại** từng người.

**VIP MVP:** Kalpas (đã có `characters/kalpas.png` làm chuẩn), Thất Kiếm Ảo Ảnh (lấy từ `assets/taixuan/combat-v2/seven-sword-*`), Mnemosyne (lấy từ boss chương 7). VIP dùng sheet khách 4×6, đầu có vương miện là hiệu ứng riêng.

---

## 4. Nội thất, vật phẩm, hiệu ứng

### 4.1. Nền — tách lớp, mỗi cấp quán một bộ (khớp hai bản đồ trong file cơ chế)

**Lv.1 Quầy Xe Đẩy — ngã tư Nagazora ngập nước, ngoài trời, đêm mưa lất phất**
| File | Kích thước | Nội dung |
|---|---|---|
| `lv1-ground.png` | 640×416 | Phố đổ nát + vũng nước ở vùng `~`, vỉa hè lát gạch ở vùng `.`. **Không** có xe đẩy, bàn, quầy |
| `lv1-front.png` | 640×416, trong suốt | Cột đèn, biển báo nghiêng ở mép dưới, vẽ sau cùng |
| `fx-rain.png` | 32×32 × 4 frame | Hạt mưa lặp; `fx-puddle` 32×16 × 4 frame gợn nước; `fx-napkin` 16×16 × 4 frame giấy ăn bay |

**Lv.2 Quán Cơm Heliopolis — hẻm neon Arc City, trong nhà**
| File | Kích thước | Nội dung |
|---|---|---|
| `lv2-floor.png` | 640×416 | Chỉ sàn + thảm. **Không** có bàn, quầy, bếp, cây |
| `lv2-walls.png` | 640×416, trong suốt | Tường trên (hàng y0, cao 64 px, cửa sổ nhìn ra hẻm neon), tường viền, vách bếp |
| `lv2-front.png` | 640×416, trong suốt | Mép tường dưới + khung cửa, vẽ **sau cùng** |

Ảnh `decor/restaurant-room-pixel-empty-v1.png` chỉ dùng để lấy tông màu cho Lv.2.

### 4.2. Nội thất (mỗi món một file, đáy sprite = mép dưới footprint)
| Vật | Footprint (ô) | Sprite (px) | Frame |
|---|---|---|---|
| **Xe đẩy bếp Lv.1** (bếp `S` + mặt ra món `P`) | 3×1 | 96×64 | Bếp tắt / bật (lửa 3 frame), có mái bạt nhỏ |
| **Thau rửa Lv.1** `W` | 1×1 | 32×32 | Trống / đầy bát |
| **Bàn Thùng Gỗ Sứt Mẻ** (Lv.1) + thùng con làm ghế | 2×1 + 1×1 | 64×40 + 32×28 | Sạch / bẩn |
| **Quầy tạm Lv.1** `L` | 3×1 | 96×48 | Thùng gỗ ghép + biển OPEN/CLOSED lật được (2 frame) |
| **Ghế đẩu + ấm trà Fu Hua Lv.1** `F` | 1×1 | 32×40 | 1 |
| Bàn ăn `T` (Lv.2) | 2×1 | 64×48 | Sạch / bẩn (bát chồng, vết) / **bị Kalpas đập nát** → 3 frame |
| Ghế băng `b` | 1×1 | 32×40 | 1 |
| Quầy lễ tân `L` | 3×1 | 96×56 | 1, có chuông + máy tính |
| Bếp `S` | 1×1 | 32×48 | Tắt / bật (lửa 3 frame) |
| Thớt `c` | 1×1 | 32×40 | 1 |
| Quầy ra món `P` | 1×1 | 32×40 | 1 (đĩa là sprite rời đặt lên) |
| Bồn rửa `W` | 3×1 | 96×48 | Trống / có chồng bát |
| Ghế nghỉ `N` | 4×1 | 128×48 | 1 |
| Bàn trà Fu Hua `F` | 1×1 | 32×40 | 1, ấm + chén |
| Cửa `G` | 2×1 | 64×64 | Đóng / mở 3 frame |
| Đồ trang trí ZEN / YATTA | 1×1 hoặc 1×2 | 32×32 / 32×64 | Giữ danh sách vật phẩm V2 mục 10: bonsai, chuông gió, tranh thuỷ mặc, gốm men ngọc / đèn neon, sofa da báo, loa rock, tượng Teri-Derp... |

### 4.3. Vật nhỏ và hiệu ứng
| Vật | Kích thước | Ghi chú |
|---|---|---|
| Đĩa món trong cảnh | 16×16 × 20 món | Bản pixel thu nhỏ từ bộ món v3, nhận ra món qua màu + hình |
| Khay cầm tay | 16×12 | Offset gắn vào điểm neo: xuống (0,−22), phải (+10,−22), lên (0,−26) |
| Rác | 16×16 × 3 kiểu | Vỏ hộp, giấy vò, xương gà |
| Vết vẽ bậy của Senti | 32×32 × 3 kiểu | Vẽ nguệch ngoạc màu đỏ mực lên tường: mặt Fu Hua cau có, chữ "YATTA", hình gà |
| Ô băng (VIP Kevin, backlog) | 32×32 | Băng phủ sàn + 3 frame vỡ |
| QTE nấu nhanh trên đầu Senti | Vẽ bằng code | Thanh 32×6: vùng vàng (ZEN) giữa, vùng đỏ mực (YATTA) bên phải, kim trắng |
| Cọc xu | 16×16 × 4 frame | Lấp lánh |
| Bong bóng trên đầu | 16×16 | `…` chờ, `!` gọi, `♥` vui, `💢` giận, `???` thảm họa, `zzz` kiệt sức, `$` trả tiền, hình món (đĩa 16 px lồng trong bong bóng) |
| Hiệu ứng | 32×32 × 4 frame | Lửa chảo, hơi nóng, lấp lánh món Hoàn Hảo, khói khê, vệt chém Edge of Taixuan (64×32), loa YATTA |
| Thanh tiến độ trên đầu | Vẽ bằng code | 20×3 px |

---

## 5. Quy trình gen (cho GPT/Antigravity làm theo)

**Không gen cả sheet 32 frame trong một ảnh.** Máy gen sẽ vẽ mỗi frame một người khác nhau. Làm từng bước:

1. **Model sheet** (1 ảnh cho mỗi nhân vật): 3 tư thế đứng mặt / lưng / nghiêng phải, cùng kích thước, nền trong suốt. Đính kèm ảnh chuẩn. **Bơ duyệt ảnh này trước** rồi mới làm tiếp.
2. **Từng dải animation**: mỗi ảnh = **1 hàng 4 frame**, đính kèm model sheet đã duyệt. Mỗi nhân vật có 8 dải.
3. **Script hậu kỳ** (Node, chạy trên máy, không cần Python):
   - Tách 4 frame theo bounding box alpha.
   - Thu nhỏ để nhân vật cao 54 px (lọc box rồi lượng tử hoá), đặt chân đúng điểm neo (24,60).
   - Lượng tử về **bảng màu chung lấy từ frame `idle_down`**, ≤ 24 màu; ép alpha về 0/255.
   - Ghép vào sheet 192×576 đúng thứ tự hàng ở mục 2.
   - Xuất kèm `<nhanvat>.json`: `{ cell:[48,64], anchor:[24,60], rows:{ idle_down:0, walk_down:1, ... } }`.
4. **Bảng soát**: ghép mọi sheet thành một ảnh contact sheet, phóng ×3, nhìn bằng mắt. Mỗi nhân vật chạy thử `walk_down` thành GIF để kiểm có đi thật không (chân đổi, đầu nhún).
5. **Sửa tay** những frame lệch (tóc đổi màu, mất phụ kiện) bằng Aseprite / Piskel trước khi đưa vào game.

**Phương án dự phòng nếu dải `walk` gen ra không ăn khớp:** giữ thân trên của frame `idle`, chỉ vẽ lại phần từ thắt lưng xuống (4 frame chân), cộng nhún đầu 1 px và đung đưa tóc 1 px. Với chibi mặc váy dài thì cách này ra bước đi thật và rất ổn định. Đây không phải "ảnh trượt": chân vẫn bước.

**Thứ tự sản xuất:**
1. **Greybox**: 1 thân chibi trống đổi màu cho mọi vai, chỉ để chạy thử cơ chế. Làm song song với code, không đợi art.
2. Senti (cả `senti-extra`) + Fu Hua (cả `fuhua-extra`) + bộ khởi đầu Rozaliya, Liliya + 3 thân khách + toàn bộ nền và đồ Lv.1. **Đủ bước này là chơi được Lv.1.**
3. Nền và nội thất Lv.2 + Kiana, Griseo + 8 nhân viên còn lại + 3 VIP + hiệu ứng.
4. Đĩa 16 px của 20 món, đồ trang trí ZEN/YATTA.

---

## 6. Mẫu prompt (tiếng Anh, máy gen hiểu tốt hơn)

### 6.1. Model sheet
```
Pixel art character model sheet of [NAME] from Honkai Impact 3rd as a cute chibi
(2.3 heads tall, big head, small body). Three poses side by side, same size, same
baseline: front view, back view, right-side profile. Top-down 3/4 RPG camera like
Stardew Valley / Kairosoft games.
Identity locked to the attached reference: [KHOÁ CỨNG trong bảng mục 3, dịch sang tiếng Anh].
Outfit: [ĐỒNG PHỤC QUÁN].
Style: crisp pixel art, 1px dark purple-black outline (#1e1630), flat colors with one
shadow and one highlight tone, light from top-left, max 24 colors, no anti-aliasing,
no gradients, no glow, no blur, no white sticker border. Transparent background, no text.
```

### 6.2. Một dải animation
```
Pixel art sprite strip: exactly 4 frames in ONE horizontal row, evenly spaced, of the
SAME character as the attached model sheet ([NAME], chibi, identical colors and outfit).
Animation: [walk cycle facing the camera / walk cycle seen from behind /
walk cycle in right-side profile / bowing / tossing a wok / wiping a table / ...].
Frames: [ví dụ walk: left foot contact, passing, right foot contact, passing].
Feet on the same baseline in every frame, character the same height in every frame.
Same pixel style: 1px #1e1630 outline, flat shading, no anti-aliasing, transparent
background, no shadow on the ground, no text.
```

### 6.3. Nội thất
```
Pixel art game furniture sprite: [VẬT], top-down 3/4 RPG view (not isometric),
footprint [W]x[H] tiles of 32px, total sprite [w]x[h] px, bottom edge = floor contact.
Chinese teahouse x sci-fi Honkai style, warm wood, jade green, red lacquer accents.
1px #1e1630 outline, flat shading, light from top-left, max 16 colors,
transparent background, no ground shadow, no text.
```

**Từ chối ảnh nếu có:** render 3D, viền trắng sticker, hướng chéo isometric, nhân vật cầm đồ thừa, mỗi frame một cỡ, tóc đổi màu giữa các frame, chữ/watermark.
