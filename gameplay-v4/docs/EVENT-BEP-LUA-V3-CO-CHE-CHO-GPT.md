# BẾP LỬA THÁI HƯ — ĐẶC TẢ CƠ CHẾ V3 (bản để code)

> 04/10/2026 · Viết lại phần vận hành để GPT code được.
> **Thứ tự ưu tiên nguồn:**
> 1. **Ý tưởng gốc của bơ** — `TÀI LIỆU THIẾT KẾ EVENT MODE_ BẾP LỬA THÁI HƯ - THỰC KHÁCH LƯỢNG TỬ.docx` (V1): quyết định fantasy, tính cách, trò hề của nhân vật.
> 2. **File này (V3)**: quyết định con số, luật chạy, cách code.
> 3. `EVENT-MODE-BEP-LUA-THAI-HU-FULL-GAME-MECHANICS.md` (V2, GPT tổng hợp): chỉ để tra danh sách. Chỗ nào V2 khác V3 thì **bỏ V2**.
>
> Asset đi kèm: `EVENT-BEP-LUA-V3-ASSET-BRIEF.md`.

---

## 0. Đọc cái này trước — demo hiện tại sai ở đâu

| Demo hiện tại | Phải đổi thành |
|---|---|
| `setInterval` 4 giây "tiến một bước phục vụ" cho cả quán | Mỗi bước là một **Job**. Nhân viên phải **đi bộ tới nơi**, **làm đủ thời gian**, xong thì trạng thái mới đổi |
| Nhân vật là `<img>` tĩnh, CSS dịch qua lại | Vẽ trên **Canvas 2D**, sprite sheet có animation đi 3 hướng, đổi hướng theo đường đi |
| Phòng là một ảnh vẽ dính sẵn bàn ghế | Nền (sàn + tường) và **từng món nội thất là sprite riêng**, đặt theo lưới ô |
| Nhân vật đè lên quầy, xuyên bàn | Vẽ theo thứ tự **y của chân** (y-sort); đồ nội thất chặn đường; tìm đường bằng A* trên lưới |
| Pardo đứng lễ tân, Li Sushang chạy bàn (hard-code) | Ai được xếp vào vị trí nào thì người đó xuất hiện ở vị trí đó |
| Demo bắt đầu ở Lv.2 với 4 bàn | Bắt đầu ở **Lv.1 Quầy Xe Đẩy** đúng ý tưởng gốc. Nút debug nhảy Lv.2 để duyệt |
| Hệ số nhân chồng ×2 ×2 ×3 | Mọi buff **cộng** vào một hệ số, có trần (mục 7) |
| Tật xấu chỉ hiện chữ | Tật xấu là **một hành động có animation** trong cảnh (ngủ gật, hát, chơi game...) |

Game tham khảo cảm giác: **My Hotpot Story**, các game quán ăn của **Kairosoft** (Cafeteria Nipponica), góc nhìn và tỉ lệ sprite của **Stardew Valley**. Nhịp **cozy nhưng luôn có việc**: người chơi nhìn một quán nhỏ, nhân viên chibi chạy tới chạy lui làm trò hề, bấm vào chỗ đang tắc để Senti chạy tới gỡ.

**Cốt lõi cảm xúc (từ ý tưởng gốc):** Senti = cày cuốc, bạo lực, bùng nổ doanh thu (YATTA). Fu Hua = chất lượng, sạch sẽ, hình phạt hệ thống (ZEN). Người chơi vừa chiều Senti thích hỗn loạn, vừa giữ Fu Hua không "tức nước vỡ bờ".

---

## 1. Một ngày chơi gồm 4 màn

```text
SÁNG: Thu mua  →  CHIỀU: Nấu mẻ  →  TỐI: Mở quán (Rush)  →  KHUYA: Tổng kết + Gacha + Nâng cấp
 (màn menu)         (QTE)              (màn Canvas chính)        (màn menu)
```

**Màn TỐI chiếm khoảng 80% thời gian chơi và là thứ phải làm đẹp nhất.** Ba màn còn lại có thể là menu/modal.

| Màn | Người chơi làm gì | Kết quả |
|---|---|---|
| Sáng | Chọn 1 trong 4 map, chọn 1 nhân viên Thu mua (hoặc Senti tự đi) → bấm Đi. Hoặc mua ở Chợ Đen | Nguyên liệu vào kho |
| Chiều | Chọn tối đa **3 mẻ**: mỗi mẻ chọn 1 món → chơi 3 QTE (Thái/Xào/Hầm). Hoặc thử nghiệm mù 3 nguyên liệu | Mỗi mẻ cho **3 phần** vào **Tủ Giữ Ấm**, có chất lượng |
| Tối | Lật biển **OPEN**, quan sát và can thiệp bằng Senti trong 90–150 giây | Xu, Uy tín, rác, Stress |
| Khuya | Tổng kết, rửa bát QTE (rơi Mảnh Bản Vẽ), Gacha, mua/đặt nội thất, nâng cấp | Sang ngày mới, Stamina hồi đầy |

**Liên kết Chiều ↔ Tối (V2 bị mơ hồ, chốt như sau):**
- Món có trong **Tủ Giữ Ấm** (nấu buổi chiều): tối chỉ hâm + bày, mất **1,5 giây**, chất lượng = kết quả QTE chiều.
- Món không còn trong tủ nhưng kho còn nguyên liệu: phải nấu từ đầu, chậm hơn (mục 5.3).
- Nấu mẻ buổi chiều tốn **2 bộ nguyên liệu cho 3 phần**; nấu lẻ buổi tối tốn **1 bộ cho 1 phần**. Nấu mẻ vừa nhanh vừa tiết kiệm.
- Khách chỉ gọi những món **đang làm được**. Không có cảnh khách gọi món rồi bếp báo hết.

---

## 2. Bản đồ quán (lưới ô)

- 1 ô = **32×32 px logic**. Mọi cấp quán đều là lưới **20×13 ô** = 640×416 px logic.
- Canvas vẽ ở độ phân giải logic, phóng **số nguyên** (×2 hoặc ×3), `imageSmoothingEnabled = false`.
- Toạ độ ô `(x, y)`: x đếm từ trái, y đếm từ trên.
- **Bản đồ là dữ liệu** (`restaurant-lv1.json`, `restaurant-lv2.json`): mảng 13 chuỗi + bảng `stations` (toạ độ đứng và hướng quay cho từng việc) + `decorSlots`. Không viết toạ độ px trong CSS.

### 2.1. Lv.1 — Quầy Xe Đẩy (ngã tư Nagazora ngập nước, ngoài trời, mưa lất phất)

```text
     x: 01234567890123456789
y 0     ~~~~~~~~~~~~~~~~~~~~
y 1     ~~~~~~~~~~~~~~~~~~~~
y 2     ~~~.....~~~~~~~~~~~~
y 3     ~~~WSPP.~~~~~~~~~~~~
y 4     ~~~.............~~~~
y 5     ~~~..bTTb..bTTb.~~~~
y 6     ~~~.............~~~~
y 7     ~~~..bTTb.......~~~~
y 8     ~~~..r.......F..~~~~
y 9     ~~~.LLL.........~~~~
y10     ~~~..gqqq.......~~~~
y11     ~~~.............~~~~
y12     ~~~~~~~~EE~~~~~~~~~~
```

| Ký hiệu | Vật | Ghi chú |
|---|---|---|
| `~` | Phố đổ nát / vũng nước (nền, không đi vào) | Có mưa và vũng nước gợn sóng |
| `.` | Vỉa hè lát gạch | Đi được |
| `S` | **Bếp chính trên xe đẩy** (4,3) | Chỉ Senti nấu. Senti đứng (4,2), quay mặt xuống |
| `P` | Mặt xe ra món (5–6,3) | Senti đặt món từ phía trên (y2); phục vụ lấy từ phía dưới (y4) |
| `W` | Thau rửa bát (3,3) | Đứng ở (3,2), quay xuống |
| `T`, `b` | 3 bàn **Thùng Gỗ Sứt Mẻ** (khách ngồi xổm trên thùng nhỏ) | Bàn 1 (6–7,5), Bàn 2 (12–13,5), Bàn 3 (6–7,7) |
| `L`, `r` | Quầy tạm 3 ô (4–6,9); lễ tân đứng (5,8) | Đứng sau quầy, quầy che chân |
| `g`, `q` | Đầu hàng (5,10), hàng chờ (6–8,10) | |
| `F` | Ghế đẩu + ấm trà của Fu Hua (13,8) | Fu Hua đứng (13,7) |
| `E` | Lối vào từ vỉa hè (8–9,12) | Khách sinh ở (8,13) ngoài mép dưới |

Luật riêng Lv.1:
- **Không thuê được Đầu bếp và Dọn dẹp**. Chỉ xếp được **Lễ tân** và **Phục vụ**. Senti tự nấu, tự dọn.
- **Gió thổi bay giấy ăn**: mỗi 20 s có 30% sinh 1 rác ở ô vỉa hè ngẫu nhiên.
- Không có phòng nghỉ. Nhân viên kiệt sức ngồi bệt tại chỗ, hồi 3/s tới 50 thì tự dậy.

### 2.2. Lv.2 — Quán Cơm Heliopolis (hẻm neon Arc City, có mái, có tường)

```text
     x: 01234567890123456789
y 0     ####################
y 1     #........#WWW.NNNN.#
y 2     #SSSccPP.#.........#
y 3     #..................#
y 4     #..................#
y 5     #.bTTb....bTTbbTTb.#
y 6     #..................#
y 7     #.bTTb....bTTbbTTb.#
y 8     #..................#
y 9     #..r...............#
y10     #.LLL...........F..#
y11     #..gqqq............#
y12     #######GG###########
```

| Ký hiệu | Vật | Ghi chú |
|---|---|---|
| `#` | Tường | Hàng y0 là tường trên, treo được đồ trang trí, cửa sổ nhìn ra hẻm neon |
| `S` | 3 bếp (1–3,2): **(1,2) bếp chính của Senti**, (2,2) và (3,2) là **bếp phụ** cho đầu bếp Gacha | Người nấu đứng ở y1 phía trên, quay xuống; bếp che nửa dưới người |
| `c` | Thớt sơ chế (4–5,2) | Senti lấy trà ở đây |
| `P` | Quầy ra món (6–7,2), mỗi ô chứa 2 đĩa | Đầu bếp đặt từ y1; phục vụ lấy từ y3 |
| y1 x1–8 | Lối đi trong bếp | Lối vào bếp duy nhất là ô (8,2) |
| `W` | Bồn rửa (10–12,1) | Dọn dẹp đứng (11,2), quay lên |
| `N` | **Phòng Nghỉ Lượng Tử** (14–17,1), 2 chỗ | Nhân viên nghỉ ngồi ở hàng y2 |
| `T`, `b` | 6 bàn: (3–4,5) (11–12,5) (15–16,5) (3–4,7) (11–12,7) (15–16,7) | Ghế trái quay phải, ghế phải quay trái |
| `L`, `r`, `g`, `q` | Như Lv.1, toạ độ theo lưới | |
| `F` | Bàn trà Fu Hua (16,10) | Fu Hua đứng (16,9) |
| `G` | Cửa (7–8,12) | Khách sinh ở (7,13) |

### 2.3. Lv.3 — Tửu Lầu Đỉnh Thái Hư (backlog)
Biển mây đỉnh núi, 10 bàn, 4 bếp, sảnh chờ, phòng nghỉ 5, sân khấu, sân vườn. Bản đồ rộng hơn màn hình → **camera kéo qua lại (pan)**. Làm sau MVP.

---

## 3. Kiến trúc code (bắt buộc)

```text
Game loop (requestAnimationFrame, update bước cố định 1/60 s)
 ├─ World: grid, furniture[], characters[], jobs[], floorItems[] (rác, xu, vết vẽ bậy)
 ├─ update(dt):
 │    spawner → guests AI → job board → staff AI → Senti (lệnh người chơi) → Fu Hua AI → meters
 └─ render():
      nền → [nội thất + nhân vật + vật trên sàn: sắp theo y chân] → mưa/hiệu ứng → bong bóng trạng thái
UI (DOM, ngoài canvas): Xu, Uy tín, thanh Khí quán, Stress Fu Hua, Nộ Senti, nút kỹ năng, giờ còn lại
```

### 3.1. Di chuyển
- A* 4 hướng trên lưới. Tốc độ tính bằng **ô/giây**.
- Nhân vật đi **từ tâm ô sang tâm ô**, nội suy mượt từng frame. Hướng sprite theo bước đang đi: xuống / lên / phải / trái (trái = lật ngang sprite phải).
- Đang di chuyển → animation `walk_<hướng>`. Đứng yên → `idle_<hướng>`. **Cấm** dịch vị trí khi animation đang là idle.
- Nhân vật không chặn nhau (cho đi xuyên nhau trong MVP), nhưng **điểm đứng làm việc được giữ chỗ**: hai người không bao giờ đứng chồng lên cùng một ô đích.

### 3.2. Y-sort
- Mỗi vật có `sortY` = y px của **chân** (nhân vật) hoặc **mép dưới footprint** (nội thất).
- Vẽ tăng dần theo `sortY`. Nhờ vậy quầy che chân lễ tân, bếp che chân người nấu.

### 3.3. Job Board — trái tim của Rush

```ts
type JobType = 'SEAT' | 'COOK' | 'SERVE' | 'CLEAN_TABLE' | 'PICK_TRASH' | 'REPAIR_TABLE';
interface Job {
  id: string;
  type: JobType;
  role: 'reception' | 'chef' | 'server' | 'cleaner' | 'senti';  // 'senti' = chỉ Senti làm
  standTile: [number, number];
  facing: 'down' | 'up' | 'left' | 'right';
  duration: number;              // giây làm tại chỗ (chưa tính đường đi)
  priority: number;              // VIP 3 · SERVE/SEAT/COOK 2 · CLEAN/TRASH/REPAIR 1
  claimedBy: string | null;
  createdAt: number;
  payload: any;                  // tableId, guestId, dishId...
  onDone(world): void;
}
```

Vòng nghĩ của nhân viên (mỗi tick):

```text
if exhausted → ngồi bệt tại chỗ, bong bóng "zzz", không nhận job
elif đang trong tật xấu (ngủ gật, hát...) → chạy animation tật xấu đến hết thời gian
elif idle và có job cùng role chưa ai nhận:
     chọn job: priority cao nhất → gần nhất (độ dài đường A*) → cũ nhất
     claim → tìm đường tới standTile → WALK → tới nơi → quay mặt theo facing
     → WORK (animation làm việc đúng role trong `duration` giây, thanh tiến độ nhỏ trên đầu)
     → job.onDone() → trừ Stamina → idle
elif idle → về chỗ đứng chờ của role
```

**Vị trí nào chưa có người (hoặc ở Lv.1 không cho thuê) thì job của vị trí đó có role `'senti'`**: hiện icon nhấp nháy, chỉ Senti làm được. Đúng ý gốc: "khi chưa có nhân viên, Senti phải tự thân vận động".

---

## 4. Khách hàng — state machine

```text
SPAWN (ngoài lối vào)
 → WALK_IN ............ tới ô trống cuối hàng q; hàng đầy → bỏ đi (không phạt)
 → CONFUSED (3 s) ..... chỉ khi quán đang Thẩm Mỹ Thảm Họa: đứng ở lối vào nhìn quanh, bong bóng "???"
 → QUEUING ............ tiến lên khi phía trước trống; Kiên nhẫn giảm
 → AT_FRONT (ô g) ..... chọn món (4.2); tạo Job SEAT khi có ghế sạch trống
 → FOLLOW_TO_SEAT ..... đi theo lễ tân (cách 0,4 s) tới ghế được gán
 → SEATED_WAITING ..... đã tạo Job COOK; Kiên nhẫn giảm; bong bóng hình món gọi trên đầu
 → EATING ............. khi Job SERVE xong; ăn `eatTime` giây
 → PAY_AND_LEAVE ...... để lại cọc xu trên bàn (cộng tiền ngay, số bay lên), bàn → DIRTY, đi ra
 → DESPAWN
Kiên nhẫn = 0 ở bất kỳ trạng thái chờ nào → ANGRY_LEAVE (💢 dậm chân, Uy tín −3; nếu đã ngồi: bàn → DIRTY, 50% rơi 1 rác)
```

### 4.1. Số liệu khách

| Thông số | Giá trị |
|---|---|
| Tốc độ đi | 3 ô/s |
| Khoảng cách sinh khách | 7 s × hệ số Khí quán (mục 6.3) × `(1 − Uy tín/400)`, tối thiểu 3 s |
| Số khách mỗi lượt | Lv.1: luôn 1 người. Lv.2: 1 (75%) hoặc nhóm 2 (25%) ngồi chung một bàn |
| Kiên nhẫn ban đầu | 100 |
| Giảm khi xếp hàng | 2/s |
| Giảm khi ngồi chờ món | 1,5/s |
| Thời gian ăn | 1★–2★: 4 s · 3★: 5 s · 4★–5★: 6 s |

### 4.2. Chọn món
- Lấy các món trong **menu hôm nay** mà **đang làm được** (còn trong Tủ Giữ Ấm, hoặc kho đủ 1 bộ nguyên liệu).
- Trọng số: mặc định 1; đúng Trend ×3; còn trong tủ ×2; món ZEN ×2 khi quán ở vùng ZEN; món YATTA ×2 khi ở vùng YATTA.
- Không có món nào làm được → khách bỏ về, Uy tín −1, hiện "Hết món!".
- **Giữ chỗ ngay khi gọi**: trừ 1 phần trong tủ hoặc 1 bộ nguyên liệu lúc khách chọn món.

---

## 5. Các vị trí làm việc trong Rush

### 5.1. Lễ tân — Job `SEAT`
- Tạo khi khách ở ô `g` **và** có ghế sạch trống (cả bàn trống nếu là nhóm 2).
- Lễ tân đi từ `r` vòng qua đầu quầy tới cạnh ô `g` → cúi chào 0,6 s → **đi trước dẫn đường** tới ô cạnh bàn → khách đi theo và ngồi xuống → lễ tân quay về `r`.
- `onDone`: khách → SEATED_WAITING, tạo Job `COOK`. Stamina −3.

### 5.2. Phục vụ — Job `SERVE`
- Tạo khi có đĩa trên `P`.
- Đi tới ô ngay dưới đĩa → quay lên nhấc đĩa 0,3 s → **đi với khay trên tay** (sprite khay gắn vào tay) → tới ô cạnh bàn → đặt đĩa 0,3 s.
- `onDone`: khách → EATING. Stamina −3.

### 5.3. Đầu bếp — Job `COOK`
- Mỗi người nấu giữ một bếp `S`, đứng phía trên bếp, quay mặt xuống.
- Thời gian: món trong Tủ Giữ Ấm **1,5 s** · nấu từ đầu 1★ 3 s · 2★ 5 s · 3★ 7 s · 4★ 9 s · 5★ 12 s.
- Xong → đi dọc lối bếp tới ô phía trên `P` còn chỗ → đặt đĩa 0,3 s → tạo Job `SERVE`. `P` đầy thì đứng chờ.
- Chất lượng món nấu từ đầu: hạng A = Tạm ổn, S trở lên = Ngon, Raiden Mei = Hoàn hảo.
- Stamina −5.
- **Senti nấu** (ở bếp chính): mỗi lần nấu từ đầu hiện **QTE nhanh 1,5 s** ngay trên đầu Senti, đúng ý gốc "phục vụ bằng chuỗi QTE tốc độ cao". Kim chạy qua thanh: bấm vùng vàng = Hoàn hảo (ZEN), vùng đỏ mực = Ngon + món thành YATTA, trượt = **Bát Cháo Khê**. Không bấm thì tự ra Tạm ổn.

### 5.4. Dọn dẹp — Job `CLEAN_TABLE`, `PICK_TRASH`, `REPAIR_TABLE`
- `CLEAN_TABLE`: tạo khi bàn → DIRTY. Đi tới bàn → lau 1,5 s (bàn → CLEAN, ngồi được ngay) → bưng chồng bát tới bồn/thau rửa → thả 0,3 s.
- `PICK_TRASH`: đi tới ô có rác → nhặt 0,8 s.
- `REPAIR_TABLE`: bàn bị Kalpas đập → sửa 3 s, tốn 50 xu.
- Stamina −4 / −2 / −4.

### 5.5. Stamina, kiệt sức, phòng nghỉ
- Tối đa 100. Chỉ trừ khi **xong một job**. Bỏ kiểu trừ 0,7/s của V2.
- Về 0 → **ngồi bệt xuống đất biểu tình** (animation), bong bóng "zzz", không làm việc.
- Lv.1: hồi 3/s tại chỗ, tới 50 thì tự dậy.
- Lv.2+: người chơi **bấm giữ nhân viên để "gắp"**. Nhân viên bị nhấc lơ lửng (animation chân đạp đạp), kéo con trỏ thả vào Phòng Nghỉ → nhân viên ngồi xuống ghế, hồi **10/s**, đủ 80 thì tự đứng dậy đi làm. Đây là thao tác **gắp một nhân vật đang sống**, không phải kéo một tấm ảnh: lúc bị gắp và lúc được thả, nhân vật đều có animation.

---

## 6. Senti, Fu Hua, Khí quán ZEN/YATTA

### 6.1. Senti — Tổng Tài Lươn Lẹo (người chơi điều khiển)
Senti đi lại trong quán như mọi nhân vật khác, tốc độ 4,5 ô/s.

| Người chơi bấm vào | Senti làm gì |
|---|---|
| Ô sàn trống | Đi tới đó |
| Thứ đang có job chưa ai nhận (bàn bẩn, rác, đĩa trên quầy, khách ở `g`, bếp chính có order) | Nhận job, làm với `duration ×0,8`. Nộ +5 |
| Job đã có nhân viên nhận nhưng người đó còn ở xa | Senti giành job, nhân viên kia quay về idle |
| Nhân viên đang **ngủ gật** (tật xấu) | Chạy tới **đá đít** đánh thức (animation), nhân viên làm tiếp. Nộ +3 |
| Khách (khi bật chế độ "Đuổi") | Chạy tới, quăng **Xích Nhận** trói khách rồi lôi quăng ra ngoài. Uy tín −8, Nộ +50 |

Nút kỹ năng (UI):

| Nút | Điều kiện | Diễn ra trên màn |
|---|---|---|
| **Cổ Vũ Cưỡng Chế (kèn YATTA)** | Nộ ≥ 35 | Senti đứng yên thổi kèn 1 s, nhân viên giật mình nhảy dựng → Stamina = 100 cho tất cả, kể cả người đang ngồi bệt. Nộ −35, Stress +18. Ca sau nhân viên mang **"bộ mặt cam chịu"** (sprite mặt xụ), làm chậm hơn 10% |
| **Pha Trà Cúc** | Còn ≥1 Lá Trà | Senti đi tới thớt (1 s pha) → bưng chén tới chỗ Fu Hua → đưa trà. Fu Hua mỉm cười: Stress −38, bật **Điềm Tĩnh** 30 s |
| **Đuổi khách** | Luôn có | Bật chế độ đuổi; bấm khách tiếp theo |

Nộ tối đa 100, không tự giảm.

**Senti chán ZEN:** quán ở vùng ZEN (6.3) và người chơi để Senti đứng yên quá 6 s → Senti ngáp, tự đi tới một ô tường gần nhất **lôi bút vẽ bậy** 2 s → để lại 1 **vết vẽ bậy** trên tường. Vết vẽ bậy tính như rác với Fu Hua (6.2).

### 6.2. Fu Hua — Quản Lý Mẫn Cán Bất Đắc Dĩ (NPC, người chơi không điều khiển)
Vest đen, cầm sổ tay, **không chạy bàn**. Cô đi vòng quanh sảnh.

- **Đi tuần**: cứ 12 s đi một vòng qua 4 điểm tuần tra (khai báo trong `stations` của bản đồ), rồi về bàn trà.
- **Giám sát viên**: thấy nhân viên đang ngủ gật / lười trong tầm 6 ô → đi tới **gõ sổ lên đầu** (animation 0,6 s), nhân viên tỉnh và làm tiếp. Hồi chiêu 30 s.
- **Rác và vết vẽ bậy**: đi tới đứng cạnh, bong bóng 💢. Fu Hua **không nhặt rác**. Riêng **vết vẽ bậy** thì cô tự lau (2 s, animation lau tường), Stress +6.
- **YATTA quá cao** (K ≥ 60): ra góc quán đứng **xoa thái dương thở dài** (animation) thay vì đi tuần.

**Stress** (thanh riêng ở góc UI):
- Tăng mỗi giây: **+0,4 mỗi rác / vết vẽ bậy** trên sàn + theo vùng Khí quán (6.3) + 0,1 mỗi cặp Thẩm Mỹ Thảm Họa.
- Tăng tức thì: Bát Cháo Khê được phục vụ +14, khách bỏ về giận +5.
- Giảm: Trà Cúc −38, vùng ZEN −0,1/s.

**Stress = 100 → Cơn Thịnh Nộ Thái Hư**: BGM chuyển sang giai điệu Thái Hư dồn dập; mọi thứ dừng 2 s; Fu Hua dùng **Edge of Taixuan** lướt chém ngang quán → **toàn bộ rác, vết vẽ bậy và bàn bẩn sạch trong 1 giây**. Hậu quả: tịch thu **50% xu kiếm được trong ca** ("tiền phạt vi phạm nội quy"), Stress về 30, Nộ Senti về 0, khoá Nộ / Cổ Vũ **25 s**.
> Ý tưởng gốc ghi khoá 1 phút. Ca Rush chỉ 90–150 s nên 1 phút gần như mất nửa ca; tạm để 25 s, **chờ bơ chốt**.

### 6.3. Khí quán ZEN ↔ YATTA
- Mỗi món nội thất có điểm `zen` hoặc `yatta`. `zenPts` / `yattaPts` = tổng điểm đồ đang đặt.
- Cộng tạm thời trong ca (30 s): món ZEN được phục vụ zen +2; món YATTA yatta +2; Trà Cúc zen +10; Griseo nhặt rác zen +2; Rozaliya hát yatta +5.
- **Khí quán K = yattaPts − zenPts**, kẹp [−100, +100]. UI là **một thanh**: trái xanh ZEN, phải đỏ YATTA.

| Vùng | Điều kiện | Hiệu ứng (theo ý tưởng gốc) |
|---|---|---|
| ZEN | K ≤ −30 | Khách thích yên tĩnh: **Tip 25%** nhưng **ghét chờ** (Kiên nhẫn giảm ×1,3) · ăn chậm hơn ×1,2 · Stress −0,1/s · Senti dễ chán và vẽ bậy |
| Cân bằng | −30 < K < 30 | Tip 15% |
| YATTA | K ≥ 30 | Khách ồn ào: **chờ giỏi** (Kiên nhẫn giảm ×0,7) · 30% gọi thêm món thứ hai sau khi ăn · 30% rơi 1 rác khi rời bàn · Tip 8% · khách đến dày hơn ×0,8 · Stress +0,3/s |

**Thẩm Mỹ Thảm Họa (theo ý tưởng gốc: tính theo VỊ TRÍ, không theo tổng):**
- Một **cặp xung đột** = một đồ ZEN và một đồ YATTA đặt ở hai ô **kề nhau** (8 ô xung quanh).
- Có ≥ 1 cặp → khách mới vào phải đứng **CONFUSED 3 s** với "???" (đúng ý gốc: "thời gian gọi món lâu hơn 3 giây"), Kiên nhẫn giảm ×1,2, mỗi cặp Stress +0,1/s, và Fu Hua trừ lương Senti: −10 xu mỗi 20 s mỗi cặp (hiện chữ bay trên đầu Fu Hua).
- MVP chưa kéo thả tự do: đồ trang trí đặt vào **`decorSlots`** khai báo sẵn trong bản đồ, độ kề tính theo toạ độ slot.

---

## 7. Tiền (chốt thứ tự tính, có trần)

```text
bonus% = Trend(+50%) + Chất lượng(Hoàn hảo +30% · Ngon +10% · Tạm ổn 0)
        + Điềm Tĩnh(+100%) + Quản lý (vd Aponia +50%) + Skill nhân viên
bonus% tối đa +200%
Giá bán = giá gốc × (1 + bonus%)        (Bát Cháo Khê: luôn 5 xu, không bonus)
Tip     = Giá bán × tỉ lệ Tip theo vùng × (Kiên nhẫn lúc được phục vụ ≥ 50 ? 1 : 0,5)
Xu nhận = Giá bán + Tip   (cộng ngay khi khách đứng dậy, số bay lên từ cọc xu trên bàn)
```

- **Điềm Tĩnh** (ý gốc: "khách ăn lâu hơn nhưng trả tiền gấp đôi"): +100% vào `bonus%`, thời gian ăn ×1,5.
- Mọi skill kiểu "Tip ×3", "giá ×3" trong V1/V2 đổi thành **+%** cộng vào `bonus%` hoặc vào tỉ lệ Tip.

---

## 8. Thông số theo cấp quán

| | Lv.1 Quầy Xe Đẩy | Lv.2 Quán Cơm Heliopolis | Lv.3 Tửu Lầu Đỉnh Thái Hư |
|---|---|---|---|
| Thời lượng Rush | 90 s | 120 s | 150 s |
| Bàn | 3 (Thùng Gỗ, 1 khách) | 6 (2 khách) | 10 |
| Bếp | 1 (Senti) | 1 Senti + 2 phụ | 1 Senti + 3 phụ |
| Vị trí thuê được | Lễ tân, Phục vụ | Cả 6 vị trí | Cả 6 + sân khấu |
| Phòng nghỉ | Không | 2 chỗ | 5 chỗ |
| Ô menu mỗi ngày | 4 | 6 | 8 |
| Khách VIP | Không | Có | Có |
| Giá nâng lên cấp này | — | 10.000 xu + 50 Sắt Arc City | 50.000 xu + 1 Lõi Heimdall + 1 Đá Parvati |

Hết giờ: lật biển CLOSED, không sinh khách mới; khách đang ở trong được phục vụ nốt (tối đa thêm 30 s), rồi sang Khuya.

**Tật xấu**: mỗi nhân viên có `quirkChance` (xác suất mỗi 30 s). Khi xảy ra, tật xấu là **một trạng thái có animation** với thời lượng rõ ràng. Bỏ kiểu tung 45% mỗi 10 s của V2.

---

## 9. Nhân viên MVP (12 người + Senti + Fu Hua)

Nguyên tắc: **nhân viên chưa có sprite đi lại đầy đủ thì không được vào pool Gacha.** 13 người còn lại của V1 nằm ở backlog, giữ nguyên mô tả gốc.

**Bộ khởi đầu** (tặng ngày 1, hợp với Lv.1): **Rozaliya** (Lễ tân) + **Liliya** (Phục vụ). Đầu bếp, Dọn dẹp, Quản lý quay được nhưng chỉ xếp vào làm từ Lv.2 (thẻ hiện "Cần Quán Cơm Heliopolis").

| Nhân viên | Hạng | Vị trí | Tốc độ (ô/s) | Hệ số thời gian làm | Skill | Tật xấu (`quirkChance`/30 s → animation) |
|---|---|---|---|---|---|---|
| Rozaliya | A | Lễ tân | 4 | 1,0 | Đứng cửa làm Idol: khách cô dẫn +10 Kiên nhẫn | 20%: cầm mic **hát tra tấn** 4 s tại chỗ, khách gần đó bịt tai, yatta +5 |
| Elysia | SSR | Lễ tân | 4,5 | 0,8 | "Thiếu Nữ Xinh Đẹp": khách cô dẫn u mê, Kiên nhẫn về 100, +20% bonus | 10%: dừng tạo dáng chụp ảnh với khách 3 s |
| Liliya | A | Phục vụ | 6 | 1,0 | Lướt ván kiếm | 15%: **ngủ rũ giữa đường** đến khi Senti đá hoặc Fu Hua gõ sổ (tối đa 8 s). Khay vẫn trên tay |
| Seele / Veliona | SSR | Phục vụ | 4,5 / 6 | 1,0 | Stamina ≥ 30: Seele dịu dàng, món cô bưng **Tip +100%**. Stamina < 30: đổi sang **Veliona** (đổi sprite) lườm khách, khách ăn nhanh gấp 4 (thời gian ăn ×0,25) nhưng **không Tip** | — |
| Griseo | S | Dọn dẹp | 3,5 | 1,0 | Quét cọ biến rác thành tranh: mỗi rác nhặt zen +2 | 15%: dựng giá vẽ chặn 1 ô 8 s (A* phải đi vòng) |
| Bronya | SSR | Dọn dẹp | 4 | 0,8 | Mỗi 20 s Project Bunny bay ra **hút hết rác toàn map** | 10%: ngồi chơi Switch 5 s; thua thì dỗi, tốc độ −50% 15 s |
| Kiana Bạch Luyện | A | Đầu bếp | 4 | 0,6 | Nấu siêu tốc. **Trùm Pizza Khải Huyền**: Pizza không bao giờ khét | Món khác nấu từ đầu **80% khét** thành Bát Cháo Khê (giữ đúng ý gốc; đặt cô chuyên Pizza mới có lời) |
| Yae Sakura | S | Đầu bếp | 4 | 1,0 | Sơ chế ×3: mẻ buổi chiều +2 phần | Không |
| Raiden Mei | SSR | Đầu bếp | 4 | 1,0 | 100% món Hoàn hảo, mỗi món rơi thêm 20 xu ("mưa tiền") | Không |
| Himeko | SR | Quản lý | 3,5 | — | Mỗi 40 s hô **"Nâng ly!"**: hồi 30 Stamina cả quán | 10%/ca: cuối ca moi két 5% đi mua bia, trừ khi lúc đó cô đang ở phòng nghỉ |
| Pardofelis | SSR | Thu mua | — | — | Chợ Đen −30% | 10%/ngày chôm 1 đồ trang trí, trả lại hôm sau |
| Li Sushang | S | Thu mua | — | — | Phi kiếm: +1 mỗi loại nguyên liệu | 20%: mù đường, hàng về lúc Tối thay vì Sáng |

Quản lý đứng ở góc sảnh, thỉnh thoảng đi một vòng ngắn. Thu mua không xuất hiện trong Rush; buổi sáng có cảnh đi ra / quay về vác giỏ.

**Gacha "Máy Nồi Áp Suất Khổng Lồ"**: 500 xu/lượt · A 50% · S 30% · SR 15% · SSR 5% · đảm bảo ≥S mỗi 10 lượt, SSR mỗi 50 lượt · thẻ trùng → 1 Mảnh Đột Phá. Thứ hạng: **A < S < SR < SSR**.

---

## 10. Menu 20 món (đã sửa nguyên liệu cho khớp kho 12 loại)

V2 có món dùng "Mì", "Nước ngọt", "Nước sôi" nhưng kho không có. V3 chỉ dùng 12 nguyên liệu chuẩn; "+ Kiana" nghĩa là **điều kiện**, không phải nguyên liệu.

| ★ | Món | Nguyên liệu (1 bộ) | Hệ | Giá | Điều kiện / Ghi chú |
|---|---|---|---|---:|---|
| 1 | Bát Cháo Khê | — | YATTA | 5 | Chỉ sinh ra khi nấu hỏng |
| 1 | Nước Lọc Trắng Sạch | Đá Bào | ZEN | 10 | |
| 1 | Bánh Bao Mưa Arc City | Thịt Lợn Neon + Nấm Ký Ức | Cân bằng | 15 | |
| 1 | Chất Thải Lượng Tử | — | — | 0 | Kết quả thử nghiệm sai, không bán |
| 2 | Đá Bào Vĩnh Cửu | Đá Bào + Gia Vị CN | YATTA | 45 | |
| 2 | Salad Nhiễu Sóng | Cà Chua + Măng Rừng | ZEN | 50 | |
| 2 | Canh Rong Biển Honkai | Rong Biển + Đá Bào | ZEN | 60 | |
| 2 | Trà Cúc Bát Gỗ | Lá Trà | ZEN | 75 | |
| 3 | Gà Quay YATTA | Gà Thái Hư + Gia Vị CN | YATTA | 150 | |
| 3 | Pizza Khải Huyền | Thịt Lợn Neon + Cà Chua | YATTA | 180 | Phải có Kiana trong đội bếp |
| 3 | Cơm Chiên Biển Chết | Cua Biển Chết + Nấm Ký Ức | Cân bằng | 200 | |
| 3 | Cá Ngừ Cuộn Rong Biển | Cá Ngừ + Rong Biển | ZEN | 220 | |
| 4 | Thịt Xông Khói Vị Trà | Thịt Lợn Neon + Lá Trà | Cân bằng | 450 | |
| 4 | Súp Nấm Ký Ức Hầm Gà | Gà Thái Hư + Nấm Ký Ức | ZEN | 500 | |
| 4 | Mì Gói **Khải Huyền / Băng Giá** | Cá Ngừ + Đá Bào + Gia Vị CN | YATTA | 550 | Món của VIP Kevin. Ý gốc gọi "Mì Gói Khải Huyền", V2 gọi "Băng Giá" → **chờ bơ chốt tên** |
| 4 | Xiên Nướng Lõi Heimdall | Lõi Heimdall + Cà Chua + Gia Vị CN | YATTA | 600 | Món ẩn để dỗ Jizo Mitama |
| 5 | Lẩu Tứ Xuyên Lượng Tử | Cua + Thịt Lợn + Gia Vị CN ×3 | YATTA | 2.000 | Chỉ Senti nấu được (QTE chiều) |
| 5 | Canh Trầm Luân | Gà + Măng + Nấm + Lá Trà | ZEN | 2.500 | |
| 5 | Đại Tiệc Mười Ba Anh Kiệt | Gà + Lợn + Cá Ngừ + Cua + Nấm + Lõi Heimdall | Cân bằng | 4.000 | Phải có Raiden Mei; chỉ bán ở bàn VIP (Lv.3) |
| 5 | Chân Lý Kiana | Cá Ngừ + Lá Trà + Cà Chua | ??? | 5.000 | Backlog: khi có trong tủ, Kiana bỏ việc 10 s để tự ăn và trả 5.000 |

Nguồn nguyên liệu: theo bảng 4 map của ý tưởng gốc. Chốt thêm: **Cua Biển Chết** rơi ở Nagazora, **Lõi Heimdall** chỉ bán ở Chợ Đen (MVP).

---

## 11. Khách VIP (từ Lv.2; MVP làm 3)

VIP "đạp cửa xông vào": có vương miện trên đầu, **chen lên đầu hàng**, mọi job liên quan VIP có priority 3.

| VIP | Gọi món | Phục vụ đúng | Phục vụ sai / phạt |
|---|---|---|---|
| **Kalpas** — Thực Khách Cuồng Nộ | Món YATTA ★≥3 | Ăn ngấu nghiến → phấn khích **đập nát bàn** (animation) rồi mới đi: quăng lại **5.000 xu Tip**, Uy tín +4. Bàn hỏng → Job `REPAIR_TABLE` (−50 xu) | Món ZEN: hất tung đĩa, gầm rú, Uy tín −9 |
| **Thất Kiếm Ảo Ảnh** | Trà Cúc (phải đắng) | Uống xong **quỵt tiền** nhưng rơi **2 Mảnh Bản Vẽ + 5 Sắt Arc City** | Không có trà: ngồi thiền chặn bàn đến hết ca. Senti đuổi được: Uy tín −10, Nộ +50 |
| **Thanh Tra Mnemosyne** | Món bất kỳ ★≥2 | Hoàn hảo: +800 xu, Uy tín +6 | Không Hoàn hảo: chê bai, hiện nút ẩn **"Hất đĩa"** → Senti chạy tới hất đĩa vào mặt (animation), mở danh hiệu ẩn "Bố Đời Lượng Tử", không có tiền |

Tỉ lệ VIP: 5% mỗi lượt sinh khách, tối đa 1 VIP mỗi ca. Có nút debug "Gọi VIP".

**Backlog VIP (giữ đúng ý gốc, đã quy ra luật để làm sau):**
- **Kevin**: ngồi đâu, các ô trong bán kính 2 ô quanh bàn **đóng băng** (tile băng). Nhân viên đi qua ô băng tốc độ ×0,5 và 20% **trượt té** (animation ngã 1 s). Senti bấm vào ô băng → dùng Thương đập vỡ (0,5 s/ô). Ăn xong trả Tip bằng tảng **Băng Lượng Tử** = 3.000 xu.
- **Nữ Vương Hư Không**: mở 3 Hố Đen lơ lửng di chuyển trong quán, hút dần đồ trang trí. Minigame Senti **ném Cupcake** vào từng hố (có thoại cãi nhau). Lấp đủ 3 → +1.800 xu, mở "Xạ Thủ Cupcake".
- **Glitch Chariot**: đòi nguyên liệu sống; minigame phòng thủ, dùng Xích bắn bánh bao chặn mồm trước khi nó ủi sập quán.
- **Jizo Mitama**: cầm kiếm đòi Lõi Ký Ức #0. Phục vụ Xiên Nướng Lõi Heimdall → nhai rộp rộp, quên đòi nợ, cúi chào đi về (+1.200 xu). Không có món → đánh nhau (−500 xu, Uy tín −8).

---

## 12. Phạm vi MVP

**Làm:**
- Màn Rush trên Canvas: bản đồ Lv.1 và Lv.2, A*, y-sort, job board, các vị trí, Senti điều khiển + QTE nấu nhanh, Fu Hua tuần tra / gõ sổ / lau vết vẽ / Thịnh Nộ, Khí quán, Thẩm Mỹ Thảm Họa theo slot, rác, Stamina, gắp thả vào phòng nghỉ.
- Màn Chiều: 3 QTE như demo hiện tại (giữ logic), xuất ra Tủ Giữ Ấm.
- Sáng / Khuya dạng menu, Gacha 12 người, nâng quán Lv.1 → Lv.2.
- 3 VIP, 20 món dạng dữ liệu, save cục bộ (không lưu giữa ca Rush).

**Backlog (giữ nguyên ý tưởng gốc, làm sau):** Lv.3 + camera pan + sân vườn + sân khấu; kéo thả nội thất tự do; cây nâng cấp bàn ba hệ (Thái Hư / Arc City / Schicksal); combat thám hiểm thật; đột phá sao (Kiana → Flamescion nướng tại bàn); 13 nhân viên còn lại (combo Elysia + Eden bỏ việc uống rượu nhưng khách trả ×3, Vill-V nổ bếp và Senti dùng Xích quăng ra ngoài dập lửa, Durandal quăng quái sống vào quán, Sirin úp đĩa lên đầu khách, Carole lủng sàn, Klein ngất sau 3 bàn, Amber chọi báo cáo che màn hình...); 4 VIP backlog; nội thất tương tác (Sa Bàn Gà Cãi Lộn Senti/Fu Hua gõ đầu gà, Mèo Can tha đồ đi giấu bắt Senti đi tìm, Tượng Teri-Derp bấm liên tục đánh thức nhân viên, Oath of Judah làm Theresa khóc thét, Bàn Bát Quái bốc khói khi gọi nhầm món thịt, Ghế Massage Otto, Sofa Thùng Cát-tông); tường/sàn đổi BGM (Lo-fi ↔ EDM); ghép bàn Kalpas + Aponia; hội thoại Khuya; IKEA Lượng Tử làm mới 3 món hiếm/24 h.

---

## 13. Nghiệm thu — GPT tự kiểm trước khi báo xong

1. Quay màn 30 s: **không nhân vật nào đổi vị trí mà không chạy animation đi đúng hướng**. Không có cảnh trượt.
2. Lễ tân bị quầy che chân; người nấu bị bếp che chân; khách ngồi trên ghế, không đè lên bàn.
3. Không còn `setInterval` điều khiển gameplay. Grep `setInterval` trong code Rush = 0 (trừ đồng hồ UI).
4. Phím `G` bật lớp debug: lưới ô, ô chặn, đường A* của từng nhân vật, danh sách job (ai nhận, còn bao lâu).
5. Script test chạy 1 ca Lv.1 và 1 ca Lv.2 ở tốc độ ×10 bằng Node/Playwright, kiểm:
   - Không job nào chờ quá 20 s game trong khi có nhân viên cùng role đang rảnh và còn Stamina.
   - Không khách nào kẹt quá 60 s ở cùng một trạng thái.
   - Không hai nhân vật cùng đứng yên trên một ô quá 1 s.
6. Đổi người ở vị trí Lễ tân trong menu → vào Rush thấy đúng người đó đứng ở `r`.
7. Liliya ngủ gật → Fu Hua đi tới gõ sổ (hoặc Senti đá) → Liliya đi tiếp với khay trên tay.
8. Đặt một đồ ZEN cạnh một đồ YATTA → khách mới đứng "???" 3 s ở lối vào.
9. Ảnh chụp Rush ở ×2 và ×3: pixel sắc nét, không nhoè, không lẫn ảnh 3D/sticker trong cảnh.
