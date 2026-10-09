# EVENT MODE: BẾP LỬA THÁI HƯ — THỰC KHÁCH LƯỢNG TỬ

> Bản tổng hợp cơ chế để duyệt · V2 · 03/10/2026  
> Thể loại: Quản lý nhà hàng thời gian thực × Thám hiểm × Nấu ăn QTE × Gacha nhân sự  
> Phạm vi: Event Mode bổ sung cho game chính, tách khỏi Story Mode và Endless Mode.

## 0. Cách đọc tài liệu

| Ký hiệu | Ý nghĩa |
|---|---|
| ✅ | Đã có trong demo tương tác hiện tại |
| 🟡 | Demo đã mô phỏng một phần, bản production cần làm sâu hơn |
| ⬜ | Mới nằm trong thiết kế, chưa dựng gameplay |
| ❗ | Có mâu thuẫn hoặc thiếu thông số, cần duyệt |

### Tóm tắt một câu

Người chơi điều khiển Senti mở một nhà hàng trong bong bóng lượng tử, ban ngày săn nguyên liệu và nấu món, ban tối vận hành quán bằng đội hình nhân viên Gacha, đồng thời cân bằng sự hỗn loạn YATTA của Senti với mức Stress ZEN của Fu Hua.

---

## 1. Fantasy, bối cảnh và mục tiêu

Sau khi đập nát sự hoàn hảo của Mnemosyne, Senti mở quán để chứng minh rằng “hương vị thật sự phải lộn xộn và khét lẹt một chút”. Fu Hua trở thành quản lý bất đắc dĩ, chịu trách nhiệm giữ quán sạch sẽ và không để Senti phá sản.

Mục tiêu dài hạn của Event Mode:

1. Mở khóa đủ 20 công thức.
2. Tuyển và nâng cấp đội ngũ nhân viên cho sáu vị trí.
3. Nâng quán từ Quầy Xe Đẩy lên Tửu Lầu Đỉnh Thái Hư.
4. Hoàn thiện các bộ nội thất ZEN/YATTA.
5. Phục vụ đủ bảy khách VIP và lấy vật phẩm kỷ niệm.
6. Tối ưu doanh thu nhưng không để Fu Hua đạt 100 Stress.

Event không có một màn “Game Over” tuyệt đối. Thất bại làm mất tiền, Uy tín hoặc nguyên liệu; người chơi vẫn sang ngày mới để phục hồi.

---

## 2. Vòng lặp gameplay một ngày

```text
BUỔI SÁNG             BUỔI CHIỀU             BUỔI TỐI                 KHUYA
Đi chợ / Thám hiểm → Nghiên cứu / Nấu QTE → Mở quán / Rush Hour → Tổng kết / Meta
      ↑                                                                  ↓
      └──────────── Nhân viên hồi sức, trend và kho được chuẩn bị ───────┘
```

### 2.1. Buổi sáng — Đi chợ và săn bắt ✅/🟡

- Chọn một trong bốn khu vực thu mua.
- Bố trí một nhân viên Thu mua hoặc để Senti tự đi.
- Chạy combat/rút gọn thám hiểm để lấy nguyên liệu.
- Có thể bỏ qua combat và mua nguyên liệu hiếm ở Chợ Đen.
- Có xác suất nhận Mảnh Công Thức hoặc Mảnh Bản Vẽ.

Thông số demo hiện tại:

- Mỗi chuyến nhận `2` đơn vị cho từng loại nguyên liệu của map.
- Durandal nhân `×5` sản lượng.
- Pardofelis đang được demo hóa thành `×2` sản lượng; tài liệu gốc chỉ ghi giảm giá Chợ Đen 30%.
- Mỗi chuyến tiêu hao `18` Stamina của nhân viên Thu mua.
- Xác suất rơi `1 Mảnh Bản Vẽ`: `45%`.
- Chợ Đen giá cơ bản `300 Xu`; có Pardo trực ca còn `210 Xu`.

### 2.2. Buổi chiều — Nghiên cứu và chế biến ✅/🟡

- Chọn món đã mở khóa để nấu.
- Nếu chưa mở khóa, người chơi có thể thử nghiệm mù bằng đúng bộ nguyên liệu.
- Hoàn thành ba QTE: Thái → Xào → Hầm.
- Kết quả thêm một phần món vào khay chờ cho Rush Hour.
- Nấu sai nhiệt sinh ra Bát Cháo Khê.

### 2.3. Buổi tối — Rush Hour ✅/🟡

- Mở cổng, khách đi vào sảnh và xếp hàng.
- Lễ tân nhận khách, khách vào bàn và gọi món.
- Bếp chế biến, phục vụ bưng món, khách ăn và thanh toán.
- Bàn bẩn phải được nhân viên Dọn dẹp xử lý trước khi đón lượt mới.
- Người chơi có thể để nhân viên tự vận hành hoặc can thiệp từng bàn bằng Senti.
- Khách VIP có thể xuất hiện hoặc được gọi trực tiếp trong demo duyệt cơ chế.

### 2.4. Khuya — Dọn dẹp và meta-progression ✅/🟡

- Tổng kết doanh thu, số khách, Uy tín và lượng rác.
- Rửa bát QTE để lấy Mảnh Bản Vẽ.
- Gacha nhân viên bằng Máy Nồi Áp Suất.
- Nâng cấp bàn, bếp, phòng nghỉ hoặc quy mô nhà hàng.
- Chỉnh menu và nội thất cho trend ngày sau.
- Sang ngày mới, Stamina nhân viên hồi đầy trong demo.

---

## 3. Tài nguyên và chỉ số toàn cục

| Tài nguyên | Cách nhận | Cách tiêu | Vai trò |
|---|---|---|---|
| Xu Yatta | Bán món, Tip, VIP, thành tựu | Gacha, mua đồ, sửa bàn, nâng quán | Tiền chính của Event |
| Uy tín | Phục vụ tốt, VIP hài lòng | Khách bỏ đi, Senti đuổi khách, sự cố | Điều kiện mở khách và quán |
| ZEN | Nội thất Fu Hua, món ZEN, Griseo, trà | Bị lấn át bởi YATTA | Tăng Tip, giữ quán ổn định |
| YATTA | Nội thất Senti, món cay/khét, hành động hỗn loạn | Gián tiếp tăng Stress Fu Hua | Tăng tốc độ và lượng order |
| Stress Fu Hua | Rác, YATTA cao, món khê, sự cố | Trà, nội thất ZEN, qua ngày | Thanh hình phạt hệ thống |
| Nộ YATTA Senti | Tự dọn, đuổi khách, sự kiện | Cổ vũ hoặc kỹ năng Senti | Năng lượng hành động đặc biệt |
| Stamina | Nghỉ, qua ngày, Cổ Vũ YATTA | Nhân viên làm nhiệm vụ | Quyết định nhân viên còn làm việc được không |
| Mảnh Công Thức | Boss, thử nghiệm, NPC ẩn | Mở món 4–5 sao | Tiến trình menu |
| Mảnh Bản Vẽ | Thám hiểm, rửa bát, VIP | Ghép 5 mảnh thành nội thất | Tiến trình trang trí |
| Mảnh Đột Phá | Gacha trùng | Nâng sao nhân viên | Tiến trình nhân sự |

### 3.1. Công thức doanh thu trong demo

```text
Giá món sau Trend
× Buff Điềm Tĩnh nếu là món ZEN
× Buff quản lý Aponia nếu có
+ Tip
= Doanh thu bàn
```

- Trend đúng món: `×2` giá món.
- Buff Điềm Tĩnh: món ZEN `×2`.
- Aponia quản lý: tổng giá hiện tại `×3`.
- Tip khi ZEN > YATTA: `35%`.
- Tip khi ZEN ≤ YATTA: `18%`.

❗ Các hệ số có thể nhân chồng rất mạnh; production cần chốt thứ tự nhân và trần doanh thu.

---

## 4. Vai trò tuyệt đối của Senti và Fu Hua

## 4.1. Senti — Avatar người chơi ✅

Senti không phải một nhân viên Gacha thông thường. Cô là nhân vật người chơi dùng để can thiệp vật lý vào hệ thống.

| Hành động | Hiệu ứng hiện tại |
|---|---|
| Cổ Vũ YATTA | Hồi toàn bộ Stamina lên 100%; Stress Fu Hua +18; Nộ Senti −35 |
| Pha trà Fu Hua | Tốn 1 Lá Trà; Stress −38; ZEN +10; mở buff Điềm Tĩnh |
| Tự dọn | Xóa 1 rác; Nộ +10 |
| Đuổi khách | Đưa một khách ra khỏi quán; Uy tín −8; Nộ +50 |

Thiết kế production:

- Senti trực tiếp tham gia thám hiểm, nấu QTE, dọn rác và xử lý VIP.
- Khi thiếu nhân viên, Senti tự lấp vị trí trống nhưng hiệu suất thấp hơn nhân viên chuyên dụng.
- Cổ Vũ YATTA cho nhân viên debuff “Cam chịu” ở ca kế tiếp. ⬜

## 4.2. Fu Hua — AI giám sát hệ thống ✅/🟡

Fu Hua không chạy bàn. Cô đi tuần, theo dõi vệ sinh, nhân viên lười và cán cân ZEN/YATTA.

Stress tăng khi:

- Quán có rác.
- YATTA cao hơn ZEN.
- Senti nấu ra Bát Cháo Khê.
- Tật xấu nhân viên hoặc VIP gây sự cố.
- Nội thất rơi vào trạng thái Thẩm Mỹ Thảm Họa.

Khi Stress đạt `100` trong demo:

1. Fu Hua dùng Edge of Taixuan dọn sạch toàn bộ rác.
2. Tịch thu `50% doanh thu của ca`.
3. Stress trở về `30`.
4. Nộ Senti về `0`.
5. Khóa hành động Cổ Vũ YATTA trong `8 giây demo`.

Tài liệu gốc yêu cầu khóa Nộ trong `1 phút`; đây là thông số production cần giữ hoặc cân lại.

Buff Điềm Tĩnh:

- Được kích hoạt khi Senti pha Trà Cúc cho Fu Hua.
- Món ZEN trả tiền gấp đôi.
- Về fantasy, khách ăn lâu hơn nhưng Tip cao hơn.

---

## 5. Thám hiểm và nguồn nguyên liệu

| Khu vực | Nguyên liệu chính | Tương tác dự kiến |
|---|---|---|
| Phố Nagazora | Cà Chua Nhiễu Sóng, Rong Biển Honkai | Đi qua mưa, chiến đấu và thu hoạch trong thành phố đổ nát |
| Arc City | Thịt Lợn Neon, Gia Vị Công Nghiệp | Dùng Xích kéo vật phẩm trên mái, hack máy bán hàng |
| Babylon | Cá Ngừ Đóng Băng, Đá Bào Parvati | Đập giáp Tử Sĩ Đông Cứng |
| Thái Hư Sơn | Măng Rừng, Gà Thái Hư | Quất cây bằng Xích; có rủi ro rơi tổ ong |

### 5.1. Kho nguyên liệu chuẩn

1. Gà Thái Hư
2. Thịt Lợn Neon
3. Cá Ngừ Đóng Băng
4. Thịt Cua Biển Chết
5. Cà Chua Nhiễu Sóng
6. Nấm Tuyết/Ký Ức
7. Măng Rừng Thái Hư
8. Rong Biển Honkai
9. Lá Trà Ngàn Năm
10. Đá Bào Parvati
11. Gia Vị Công Nghiệp
12. Lõi Heimdall

❗ Cua Biển Chết và Lõi Heimdall chưa có map rơi chính thức trong bảng bốn map; hiện demo cho mua tại Chợ Đen. Cần duyệt đây là nguồn chính hay chỉ nguồn phụ.

---

## 6. Minigame nấu ăn

### 6.1. QTE 1 — Thái ✅

- Nhấn/quẹt đủ 5 nhịp để chém nguyên liệu.
- Bản production có đá/bom lượng tử trộn vào; chém nhầm làm giảm chất lượng. ⬜
- Vũ khí trình diễn: Kiếm Đỏ Mực của Senti.

### 6.2. QTE 2 — Xào ✅

- Kim di chuyển qua thanh lực.
- Chốt gần tâm vùng vàng để có điểm cao.
- Quá tay làm thức ăn dính trần nhà và giảm chất lượng.

### 6.3. QTE 3 — Hầm/Giữ nhiệt ✅

| Vùng nhiệt | Kết quả |
|---|---|
| Mép đen `<12` hoặc `>91` | FAIL, biến thành Bát Cháo Khê |
| Vùng giữa | Món ZEN, ZEN +6, Stress −5 |
| Vùng đỏ từ `68` | Món YATTA, YATTA +6, Nộ +8 |

Nếu cháy khê: Stress +14, Nộ +12.

### 6.4. Xếp hạng chất lượng demo

| Tổng điểm | Xếp hạng |
|---:|---|
| Cháy nhiệt | KHÊ |
| Từ 132 | HOÀN HẢO |
| Từ 100 | NGON |
| Dưới 100 | TẠM ỔN |

Món Hoàn Hảo lần đầu mở thành tựu “Vua Bếp Lượng Tử”.

### 6.5. Mở khóa công thức

- Thử nghiệm mù đúng nguyên liệu.
- Nhặt Mảnh Công Thức từ Boss.
- Mời NPC ẩn ăn đúng món họ thích.
- Nhận công thức qua khách VIP hoặc thành tựu.

---

## 7. Menu 20 món

| Sao | Tên món | Nguyên liệu | Hệ | Giá |
|---:|---|---|---|---:|
| 1 | Bát Cháo Khê | Bất kỳ nguyên liệu + nấu cháy | YATTA | 5 |
| 1 | Nước Lọc Trắng Sạch | Nước/Đá Babylon | ZEN | 10 |
| 1 | Bánh Bao Mưa Arc City | Thịt Lợn Neon + Nấm Ký Ức | Cân bằng | 15 |
| 1 | Chất Thải Lượng Tử | 3 nguyên liệu sai logic | Khủng bố | 0 |
| 2 | Đá Bào Vĩnh Cửu | Đá Bào Parvati + Nước ngọt/Gia vị | YATTA | 45 |
| 2 | Salad Nhiễu Sóng | Cà Chua Nhiễu Sóng + Măng Rừng | ZEN | 50 |
| 2 | Canh Rong Biển Honkai | Rong Biển + Đá Bào + lửa nhỏ | ZEN | 60 |
| 2 | Trà Cúc Bát Gỗ | Lá Trà Ngàn Năm + nước sôi | ZEN | 75 |
| 3 | Gà Quay YATTA | Gà Thái Hư + Gia Vị Công Nghiệp | YATTA | 150 |
| 3 | Pizza Khải Huyền | Thịt Lợn Neon + Cà Chua + Kiana | YATTA | 180 |
| 3 | Cơm Chiên Biển Chết | Cua Biển Chết + Nấm Ký Ức | Cân bằng | 200 |
| 3 | Cá Ngừ Cuộn Rong Biển | Cá Ngừ Đóng Băng + Rong Biển | ZEN | 220 |
| 4 | Thịt Xông Khói Vị Trà | Thịt Lợn Neon + Lá Trà | Cân bằng | 450 |
| 4 | Súp Nấm Ký Ức Hầm Gà | Gà Thái Hư + Nấm Tuyết | ZEN | 500 |
| 4 | Mì Gói Băng Giá | Mì + Cá Ngừ + Đá Bào + Kevin | YATTA | 550 |
| 4 | Xiên Nướng Lõi Máy | Lõi Heimdall + Cà Chua + Gia Vị | YATTA | 600 |
| 5 | Lẩu Tứ Xuyên Lượng Tử | Cua + Thịt Lợn + 3 Gia Vị + Senti | YATTA MAX | 2.000 |
| 5 | Canh Trầm Luân | Gà + Măng + Nấm + Lá Trà | ZEN MAX | 2.500 |
| 5 | Đại Tiệc Mười Ba Anh Kiệt | Tất cả nguyên liệu cao cấp + Mei | Cân bằng | 4.000 |
| 5 | Tráng Miệng “Chân Lý Kiana” | Cá Ngừ + Trà + Cà Chua + Kiana | ??? | 5.000 |

### 7.1. Hiệu ứng món nổi bật

- Cháo Khê: khách rời bàn rất nhanh; Stress Fu Hua tăng.
- Nước Lọc: khách kiên nhẫn cao, ngồi lâu.
- Đá Bào: được khách nhí yêu thích.
- Trà Cúc: khách ngồi lâu, Tip ×2.
- Gà Quay YATTA: lan hiệu ứng phấn khích sang bàn bên.
- Cá Ngừ Cuộn: Yae Sakura tăng sản lượng ×3.
- Mì Băng Giá: Kevin để lại Băng Lượng Tử.
- Lẩu Tứ Xuyên: Kalpas phun lửa, gây hư hại nội thất.
- Canh Trầm Luân: đưa ZEN quán lên tối đa.
- Đại Tiệc Mười Ba Anh Kiệt: dọn 13 món qua Portal, doanh thu bùng nổ.
- Chân Lý Kiana: chỉ Kiana thích và sẵn sàng trả 5.000 Xu.

❗ Tài liệu VIP ghi “Mì Gói Khải Huyền”, còn menu ghi “Mì Gói Băng Giá”. Đề xuất giữ tên **Mì Gói Băng Giá** để đồng nhất.

---

## 8. Vận hành nhà hàng và state machine của khách

```text
Xuất hiện ở cổng
→ Xếp hàng
→ Lễ tân xếp bàn
→ Gọi món
→ Bếp nấu
→ Chờ phục vụ
→ Ăn
→ Thanh toán + Tip
→ Bàn bẩn
→ Dọn bàn
→ Bàn trống
```

### 8.1. Nhiệm vụ từng vị trí

| Vị trí | Chuyển trạng thái |
|---|---|
| Lễ tân | Chờ/Gọi món → gửi order vào bếp |
| Đầu bếp | Đang nấu → món sẵn sàng |
| Phục vụ | Món sẵn sàng → khách ăn |
| Dọn dẹp | Bàn bẩn → bàn trống |
| Thu mua | Tạo nguyên liệu trước giờ mở quán |
| Quản lý | Buff/debuff toàn cục |

### 8.2. Thông số Rush Hour trong demo

- Thời lượng: `60 giây`.
- Cứ `4 giây`, hệ thống tự tiến một bước phục vụ nếu vị trí tương ứng còn Stamina.
- Cứ `7 giây`, thử sinh khách mới vào bàn trống.
- Cứ `10 giây`, thử kích hoạt một Tật xấu nhân viên.
- Tỷ lệ Tật xấu demo: `45%` tại mỗi lần kiểm tra.
- Stamina giảm `0,7/giây`; nếu Aponia quản lý thì giảm gấp đôi.
- Kiên nhẫn giảm `1,1/giây`; khi Thẩm Mỹ Thảm Họa giảm `2,1/giây`.
- Khách hết kiên nhẫn: Uy tín −3, để lại một bàn bẩn.

Các số trên là thông số kiểm thử, chưa phải balance cuối.

### 8.3. Bàn ăn

| Cấp bàn | Sức chứa | Khách/món | Yêu cầu |
|---|---:|---|---|
| Lv.1 | 1–2 | 1–2 món đơn giản, ăn nhanh | Nhân viên A đủ dùng |
| Lv.2 | 4 | Nhóm khách, thêm đồ uống/phụ | Nên có nhân viên S |
| Lv.3 VIP | 6–8 | Đại tiệc, món đắt, dọn đồng thời, Tip ×3 | Bắt buộc SR/SSR |

---

## 9. Hệ thống nhân sự Gacha

### 9.1. Máy Nồi Áp Suất ✅

- Giá demo: `500 Xu/lượt`.
- Lần quay đầu demo bảo đảm Pardofelis để duyệt tính năng.
- Thẻ mới mở nhân viên.
- Thẻ trùng chuyển thành `1 Mảnh Đột Phá` của nhân viên đó.
- Gacha được truy cập cố định từ tab **NHÂN SỰ — GACHA**, không cần chờ đến Khuya.

❗ Demo hiện chọn ngẫu nhiên đều trong 25 nhân viên sau lượt đầu, chưa có tỷ lệ theo hạng và chưa có pity production.

### 9.2. Danh sách 25 nhân viên

#### Lễ tân

| Hạng | Nhân viên | Skill | Tật xấu |
|---|---|---|---|
| A | Rozaliya | Khách +5% kiên nhẫn | Hát mic làm giảm ZEN |
| S | Susannah | Đón khách nhanh, thân thiện | Xếp nhầm khách vào bàn bẩn |
| SR | Mobius | Khóa thanh kiên nhẫn | 10% khách sợ và bỏ đi |
| SSR | Elysia | Khách tự động u mê | Combo Eden có thể bỏ trực |
| SSR | Eden | Tip rơi ngay từ cửa | Rủ Elysia uống rượu |

#### Phục vụ

| Hạng | Nhân viên | Skill | Tật xấu |
|---|---|---|---|
| A | Liliya | Di chuyển nhanh bằng ván kiếm | Ngủ giữa đường |
| S | Carole | Bưng 8 đĩa cùng lúc | Đi chậm, có thể làm hỏng sàn |
| SSR | Seele/Veliona | Seele Tip ×3; Veliona xoay bàn ×4 | Thấp Stamina thì mất Tip |
| SSR | Sirin | Portal giao món tức thì | Có thể úp đĩa lên đầu khách |

#### Dọn dẹp

| Hạng | Nhân viên | Skill | Tật xấu |
|---|---|---|---|
| A | Klein | Dọn rất nhanh | Dọn 3 bàn thì ngất |
| S | Griseo | Biến rác thành +50 ZEN | Tranh có thể chắn lối |
| SR | Senti phân thân | Ván trượt gom rác | Tạt nước trúng khách |
| SSR | Bronya | Project Bunny hút rác toàn map | Thua game thì giảm 50% tốc độ |

#### Đầu bếp

| Hạng | Nhân viên | Skill | Tật xấu |
|---|---|---|---|
| A | Kiana Bạch Luyện | Nấu nhanh, đặc sản Pizza | 80% tỷ lệ khét |
| S | Yae Sakura | Sơ chế ×3 | Không có tật xấu lớn |
| SSR | Raiden Mei | 100% món Hoàn Hảo | Không có |
| SSR | Vill-V | Nấu 5 món cùng lúc | 10% nổ bếp, gây Stun |

#### Thu mua

| Hạng | Nhân viên | Skill | Tật xấu |
|---|---|---|---|
| A | Shigure Kira | Hát ru quái để mua rẻ | Có thể phá hỏng nguyên liệu |
| S | Li Sushang | Phi kiếm thu thập nhanh | Mù đường, về trễ |
| SSR | Pardofelis | Chợ Đen giảm 30% | Chôm đồ trang trí |
| SSR | Durandal | Sản lượng ×5 | Mang quái sống vào quán |

#### Quản lý

| Hạng | Nhân viên | Skill | Tật xấu |
|---|---|---|---|
| A | Amber | Nhân viên A giảm 50% tỷ lệ Tật xấu | Báo cáo che màn hình |
| S | Theresa | Giảm 20% hao mòn | Ngủ quầy để khách quỵt bill |
| SR | Himeko | Hồi 30% Stamina toàn quán | Moi két mua bia |
| SSR | Aponia | Khách ăn nhanh, Tip ×3, không rác | Stamina toàn đội tụt ×2 |

### 9.3. Stamina và phòng nghỉ 🟡

- Nhân viên về 0 Stamina sẽ dừng làm việc và ngồi bệt xuống.
- Người chơi kéo nhân viên vào Phòng Nghỉ Lượng Tử để hồi sức. ⬜
- Cấp quán quyết định sức chứa Phòng Nghỉ.
- Cổ Vũ YATTA hồi tức thì nhưng tạo debuff ca sau. 🟡

### 9.4. Đột phá nhân viên ⬜

- Mảnh trùng dùng để tăng sao.
- Tăng sao nâng chỉ số Skill và giảm Tật xấu.
- Ví dụ cuối cây: Kiana A → Kiana Flamescion SSR, xóa tỷ lệ khét và nướng tại bàn.

---

## 10. ZEN vs. YATTA và nội thất

### 10.1. Hệ ZEN

- Vật phẩm: bàn gỗ, bonsai, chuông gió, tranh thủy mặc, gốm men ngọc.
- Khách yên tĩnh, Tip cao nhưng ghét chờ lâu.
- Bếp ZEN giảm tỷ lệ món khét.
- Nếu ZEN quá cao, Senti chán và có thể vẽ bậy.

### 10.2. Hệ YATTA

- Vật phẩm: neon, sofa da báo, loa Rock, đèn đỏ, chảo lửa.
- Khách gọi nhiều món, chờ lâu tốt nhưng tạo nhiều rác.
- Bếp YATTA tăng tốc độ nấu nhưng có nguy cơ phát nổ.
- Nếu YATTA quá cao, Stress Fu Hua tăng liên tục.

### 10.3. Thẩm Mỹ Thảm Họa ✅

Khi đặt đồ ZEN và YATTA đối nghịch với tổng điểm quá gần nhau:

- Khách hiện dấu `???`.
- Thời gian gọi món tăng 3 giây theo tài liệu.
- Trong demo, tốc độ tụt Kiên nhẫn tăng từ `1,1` lên `2,1/giây`.
- Stress Fu Hua tăng khi đặt đồ.

### 10.4. Vật phẩm nội thất nổi bật

| Nội thất | Hệ | Hiệu ứng |
|---|---|---|
| Sa Bàn Gà Cãi Lộn | Cân bằng | Sinh Tip tự động; Senti/Fu Hua đổi điểm khi gõ gà |
| Oath of Judah | ZEN MAX | Giá treo đồ; Kiên nhẫn giảm chậm 30% |
| Tượng Teri-Derp | YATTA MAX | Khách gọi thêm tráng miệng; đánh thức nhân viên |
| Tủ Lạnh Phong Ấn Kaslana | YATTA | Bếp lấy đồ nhanh; Kiana có thể ăn vụng và bị đông cứng |
| Ổ Mèo Can | ZEN | Khách chịu ghép bàn; Can có thể giấu đồ |
| Tranh Mười Ba Anh Kiệt | YATTA +100 | VIP Elysian Realm đứng xem trước khi gọi món |
| Bông Hoa Thủy Tinh | ZEN | Đổi BGM; khách nữ trả thêm 20% |
| Arahato giới hạn | Công nghệ | Giữ khách nhí không quậy |
| Bảng Eden Bao | YATTA | Giờ Vàng 2 phút, mọi món được trả ×5 |

### 10.5. Bản vẽ ✅/🟡

- Ghép `5 Mảnh Bản Vẽ` để mở một nội thất hiếm.
- Demo hiện ghép thẳng thành Lò Nướng Hỏa Ngục.
- Production cần danh sách công thức bản vẽ và quyền chọn món muốn chế.

---

## 11. Nâng cấp bàn và mở rộng nhà hàng

### 11.1. Ba cấp nhà hàng

| Cấp | Tên | Sức chứa thiết kế | Mở khóa | Giá tài liệu gốc |
|---:|---|---|---|---|
| 1 | Quầy Xe Đẩy | 3 ô bàn, 1 bếp, 1 lễ tân | Gameplay cơ bản | Khởi đầu |
| 2 | Quán Cơm Heliopolis | 6 ô bàn, 2 bếp, phòng nghỉ 2 người | VIP, dọn dẹp | 10.000 Xu + 50 Sắt Arc City |
| 3 | Tửu Lầu Đỉnh Thái Hư | 10 bàn, 4 bếp, sảnh chờ, phòng nghỉ 5 | Sân khấu, sân vườn, doanh thu ×3 | 50.000 Xu + Lõi Heimdall + Đá Parvati |

Demo duyệt hiện dùng `4 bàn cố định`, bắt đầu ở Lv.2 và giá nâng quán là `3.000/10.000 Xu` không cần vật liệu.

### 11.2. Ba cây nâng cấp bàn

#### Thái Hư — ZEN

1. Thùng Gỗ Sứt Mẻ.
2. Bàn Trà Thanh Ngọc: khách không xả rác, +20 ZEN.
3. Bàn Tròn Hội Cung: ăn lâu, Tip lớn, +100 ZEN.

#### Arc City — YATTA

1. Thùng Phuy Gỉ Sét: +10 YATTA.
2. Bàn Nhựa Xanh Đỏ: gọi thêm món nhậu, +50 YATTA.
3. Sàn Đấu Trường Bỏ Túi: +150 YATTA, 5% hỏng bàn.

#### Schicksal — Tốc độ

1. Bàn Gấp Inox.
2. Bàn Kính Cảm Ứng: tự order, không cần lấy order.
3. Bàn Điều Khiển Hyperion: đồ ăn đi lên từ thang máy, thời gian dọn món bằng 0.

Demo hiện nâng bàn thấp nhất với giá cố định `800 Xu`, chưa có nhánh công nghệ.

---

## 12. Bảy khách VIP

| VIP | Yêu cầu | Gameplay chính | Thưởng/Phạt demo |
|---|---|---|---|
| Thất Kiếm Ảo Ảnh | Trà Cúc thật đắng | Phục vụ trà hoặc đuổi ra | Đúng: +2 Bản Vẽ, +2 Uy tín; đuổi: −10 Uy tín, +50 Nộ |
| Mnemosyne | Đĩa ăn 100% | Perfect hoặc hất đĩa | Perfect: +800 Xu, +6 Uy tín; hất: danh hiệu ẩn |
| Glitch Chariot | Nguyên liệu sống | Bắn 3 bánh bao chặn mõm | +900 Xu, +4 Uy tín, +1 Bản Vẽ |
| Kevin | Mì Băng Giá siêu cay | Đập băng 3 lần | +2.800 Xu, +5 Uy tín |
| Nữ Vương Hư Không | Cupcake và phục tùng | Ném 3 cupcake vào hố đen | +1.800 Xu, +5 Uy tín |
| Kalpas | YATTA MAX | Phục vụ lẩu cay hoặc món ZEN | Đúng: −50 sửa bàn, +5.000 Xu, +4 Uy tín; sai: −9 Uy tín |
| Jizo Mitama | Đòi Lõi Ký Ức #0 | Xiên Lõi Máy hoặc chiến đấu | Đúng: +1.200 Xu, +5 Uy tín; sai: −500 Xu, −8 Uy tín |

Quà VIP production:

- Kalpas: Lò Nướng Hỏa Ngục.
- Thất Kiếm: Bức Hoành Phi Thái Hư.
- Phục vụ hoàn hảo 3 lần liên tiếp mở Món Đồ Kỷ Vật.

---

## 13. Trend ngày và chiến lược menu

Mỗi ngày có một Bản Tin Quán thay đổi meta:

- Trời lạnh: một món súp được giá ×2.
- Trend cay: món YATTA giảm thời gian nấu.
- Khách nhí: Đá Bào và món ngọt tăng nhu cầu.
- Ngày thanh tịnh: món ZEN tăng Tip.
- VIP Night: tăng tỷ lệ khách VIP nhưng yêu cầu bàn cao cấp.

Thiết kế gốc cho phép bán đủ 20 món nếu đủ nhân sự, hoặc khóa bớt để tập trung món lời cao. Demo hiện giới hạn `8 món/ngày`.

Đề xuất production: số ô menu tăng theo cấp quán (`4 → 6 → 8`) để giữ quyết định chiến thuật và tránh bếp bị loãng order.

---

## 14. Thành tựu và mở khóa

| Thành tựu | Điều kiện | Phần thưởng |
|---|---|---|
| Vua Bếp Lượng Tử | Nấu món Hoàn Hảo đầu tiên | Danh hiệu/demo |
| Bố Đời Lượng Tử | Hất đĩa vào Mnemosyne | Danh hiệu ẩn |
| Xạ Thủ Cupcake | Đóng đủ ba hố đen | Danh hiệu |
| Đầu Bếp Bóng Tối | Nấu hỏng 100 lần | Tượng Đá Cục Than |
| Tư Bản Bóc Lột | Làm nhân viên ngất 50 lần | Bảng Nhân Viên Xấu Số |
| Khách Hàng Là Thượng Đế Cuồng Nộ | Phục vụ đúng Kalpas | Lò Nướng Hỏa Ngục |

---

## 15. Yêu cầu trình bày hình ảnh trong gameplay

- Góc nhìn nhà hàng: isometric/2.5D cố định như game quản lý quán ăn.
- Nhân vật: chibi dựng nổi, nhỏ hơn bàn nhưng vẫn đọc được tóc, màu và phụ kiện HI3.
- Đầu bếp phải có hành động nấu thật trong khu bếp: đảo chảo, cắt, hầm.
- Lễ tân phải đứng sau quầy, được quầy che phần chân; không đứng đè lên mặt kệ.
- Khách có pose đi, chờ, ngồi, ăn, tức giận và thanh toán.
- Senti và Fu Hua luôn xuất hiện trong sảnh, có nhãn vai trò và animation trạng thái.
- Nhân viên di chuyển theo lối đi; không xuyên bàn, quầy hoặc khách.
- Các trạng thái order/nấu/bưng/ăn/trả tiền phải đọc được bằng animation, không chỉ icon UI.

---

## 16. Save và cấu trúc một lượt chơi

Dữ liệu cần lưu:

- Ngày hiện tại và trend.
- Xu, Uy tín, ZEN, YATTA.
- Stress Fu Hua, Nộ Senti.
- Kho nguyên liệu.
- Công thức đã mở và menu đang chọn.
- Nhân viên sở hữu, mảnh trùng, cấp sao, Stamina.
- Nhân viên đang bố trí theo sáu vị trí.
- Nội thất sở hữu/đã đặt, Mảnh Bản Vẽ.
- Cấp nhà hàng, cấp và nhánh từng bàn/bếp.
- VIP, thành tựu và vật phẩm kỷ niệm đã hoàn thành.

Trạng thái Rush Hour không nên tiếp tục chạy khi tải lại trang. Demo hiện chủ động reset Rush, bàn và timer về trạng thái an toàn.

---

## 17. Phạm vi MVP đề xuất

### MVP chơi được

- 4 map thu mua dạng rút gọn.
- 12 nguyên liệu.
- 20 món và 3 QTE nấu.
- 4 bàn, 6 vai trò nhân viên.
- 25 nhân viên Gacha, Skill/Tật xấu cơ bản.
- Senti/Fu Hua đầy đủ thanh trạng thái.
- ZEN/YATTA, rác, Stamina, Uy tín và Tip.
- 7 VIP dưới dạng event modal/minigame ngắn.
- 3 cấp bàn cơ bản, 3 cấp quán.
- Save cục bộ.

### Sau MVP

- Kéo thả nội thất tự do trên grid.
- Phòng nghỉ kéo thả nhân viên.
- Cây nâng cấp ba hệ cho từng bàn.
- Map thám hiểm combat đầy đủ.
- Animation nhiều hướng và va chạm nhân vật thật.
- Hội thoại đời thường Khuya.
- Daily shop, pity Gacha, lịch Event và leaderboard.

---

## 18. Các điểm cần chị duyệt

### A. Tiến trình nhà hàng ❗

- **Tài liệu gốc:** Lv.1 có 3 bàn, Lv.2 có 6, Lv.3 có 10.
- **Demo:** luôn có 4 bàn và bắt đầu ở Lv.2.
- **Đề xuất:** production theo tài liệu gốc; demo giữ 4 bàn chỉ để duyệt nhanh.

### B. Giá nâng quán ❗

- **Tài liệu gốc:** 10.000 Xu + 50 Sắt; sau đó 50.000 Xu + Lõi + Đá.
- **Demo:** 3.000 rồi 10.000 Xu, không cần vật liệu.
- **Đề xuất:** production dùng giá tài liệu gốc.

### C. Giới hạn menu ❗

- **Tài liệu bổ sung:** có thể bán cả 20 món nếu đủ người.
- **Demo:** tối đa 8 món.
- **Đề xuất:** `4/6/8` ô theo cấp quán; không cho 20 món cùng lúc để giữ chiến thuật.

### D. Pardo và Li Sushang trong sảnh ❗

- **Vai trò thiết kế:** cả hai thuộc Thu mua.
- **Hình ảnh demo:** Pardo đang đứng lễ tân, Li Sushang đang chạy bàn để minh họa hoạt ảnh.
- **Đề xuất:** bản production phải hiển thị đúng nhân viên đang được bố trí; không hard-code Pardo/Li Sushang sai vị trí.

### E. Gacha ❗

- Chưa có tỷ lệ A/S/SR/SSR, pity và giá nhiều lượt.
- Đề xuất để duyệt: `A 50% · S 30% · SR 15% · SSR 5%`, bảo hiểm ít nhất S mỗi 10 lượt và SSR mỗi 50 lượt.

### F. Tên món Kevin ❗

- Chọn một tên duy nhất giữa “Mì Gói Khải Huyền” và “Mì Gói Băng Giá”.
- Đề xuất: **Mì Gói Băng Giá**.

### G. Fu Hua nổi giận ❗

- Tài liệu: khóa Nộ Senti 1 phút.
- Demo: khóa 8 giây để test.
- Đề xuất production: 20–30 giây trong Rush 90–120 giây; 1 phút có nguy cơ biến thành hình phạt quá nặng.

### H. Rush Hour ❗

- Demo dùng 60 giây.
- Cần chốt production: đề xuất 90 giây ở Lv.1, 120 giây ở Lv.2, 150 giây ở Lv.3.

### I. Rank nhân viên ❗

- Hệ hiện tại dùng A/S/SR/SSR nhưng thứ tự trực giác chưa rõ.
- Cần chốt thứ tự sức mạnh chính thức: đề xuất `A < S < SR < SSR` hoặc đổi `SR` thành `SS`.

### J. Nguồn Cua và Lõi Heimdall ❗

- Chưa gắn map rơi chính thức.
- Đề xuất Cua rơi ở Nagazora/biển phụ; Lõi Heimdall rơi từ Boss Babylon và Chợ Đen.

---

## 19. Kết luận thiết kế hiện tại

Core loop đã rõ và có đủ ba lớp:

1. **Chuẩn bị:** săn nguyên liệu, xây menu, nấu món.
2. **Vận hành:** điều phối nhân viên và khách trong Rush Hour.
3. **Meta:** Gacha, nâng cấp, nội thất, VIP và sưu tập.

Điểm khác biệt mạnh nhất của Event là Senti/Fu Hua không chỉ làm mascot mà trực tiếp tạo hai áp lực đối nghịch: **YATTA tối ưu doanh thu và tốc độ**, còn **ZEN giữ chất lượng, vệ sinh và tránh hình phạt**.

Các mục ở phần 18 cần được duyệt trước khi chuyển từ prototype sang balance production.
