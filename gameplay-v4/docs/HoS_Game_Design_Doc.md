# GAME DESIGN DOCUMENT — SENTIENCE: SHATTERED MEMORIES
### Boss Pattern, Combat Mechanics, Endless Mode & Extras

---

## PHẦN 1: COMBAT SYSTEM CHI TIẾT

### 1A. HoS Moveset (Hệ thống Vũ khí)

| Vũ khí | Chi tiết cơ chế | Damage Tier |
|---|---|---|
| **Kiếm** | **Combo chains:** 3-hit (nhanh, đánh trúng 3 mục tiêu hẹp), 5-hit (chỉ kích hoạt sau khi né đòn, cú chém cuối kèm sóng âm).<br>**Phản đòn (Parry):** Timing window 0.25s ngay trước khi trúng đòn. Thành công x2 damage đòn tiếp theo và vô hiệu hóa sát thương.<br>**Cắt chướng ngại:** Chém đứt cành cây, bảng neon vỡ, tảng đá nhỏ. | Medium |
| **Thương** | **Combo chains:** Đâm 3 nhịp liên tục, đẩy lùi kẻ địch.<br>**Phá giáp:** Đánh trúng 3 hit liên tục vào quái có khiên/giáp sẽ làm vỡ giáp (Armor Break).<br>**Đánh quái bay:** Range chéo lên 45 độ, đánh rớt quái bay xuống đất.<br>**Charge attack:** Giữ nút đánh 1.5s, lướt về phía trước 1 màn hình, xuyên qua mọi kẻ địch. | High |
| **Xích nhận** | **Quét diện rộng:** Hình cung (arc) 180 độ phía trước, trúng tối đa 5 quái.<br>**Kéo kẻ địch:** Range 1/2 màn hình. Tốc độ kéo cực nhanh (0.3s). Không áp dụng cho quái siêu nặng.<br>**Di chuyển:** Bấm nút nhảy + đánh giữa không trung để móc vào điểm bám (hook point), đu qua vực sâu.<br>**Kéo vật thể:** Kéo các khối đá, thùng hàng để giải đố/phá chướng ngại. | Low |
| **Weapon Switch** | **Thời gian chuyển:** 0.1s (gần như tức thời).<br>**Cancel:** Có thể cancel animation đánh của vũ khí này bằng cách switch sang vũ khí khác.<br>**Combo bridge:** Đang đánh kiếm hit 2 -> Switch -> Đâm thương (hit 3) -> Switch -> Quét xích nhận. Tăng 10% damage cho mỗi lần switch thành công trong một chuỗi combo. | N/A |

### 1B. Fu Hua Assist System

- **Thanh Assist (Assist Gauge):** Nạp bằng 3 cách: Đánh trúng kẻ địch (nhanh nhất), Thu thập mảnh ký ức (hồi 50% thanh), Thời gian tự động (chậm, 2% mỗi giây). Thanh có 3 charge (sạc).
- **3 Loại Assist:**
  - **Edge of Taixuan (Tấn công):** Tiêu hao 1 charge. Bấm nút Assist. Fu Hua lướt tới, tung một đòn chưởng diện rộng phá nát đội hình địch trước mặt. Cooldown: 5 giây. Visual: Bóng rồng mờ ảo vàng kim, hạt particle phát sáng.
  - **Đỡ đòn (Parry/Block):** Tiêu hao 1 charge. Bấm Assist khi sắp bị đánh (nếu HoS đang hụt parry kiếm). Fu Hua xuất hiện với khiên năng lượng chặn đòn hoàn toàn và đẩy lùi địch. Cooldown: 8 giây. Visual: Hexagon shield.
  - **Cứu viện (Anti-death):** Tự động kích hoạt khi HoS nhận đòn chí mạng. Tiêu hao toàn bộ charge (ít nhất 2 charge). Fu Hua ôm HoS lao ra xa khỏi vụ nổ/sát thương. Cooldown: 60 giây. Visual: Màn hình nháy đỏ rồi đóng băng nhẹ.

### 1C. Fu Hua Playable (Chương 6)

- **3 Combo Quyền Pháp:**
  - **Liên hoàn quyền (Jab-jab-hook):** Nhấp 3 lần. Hitbox hẹp ngay trước mặt. Tốc độ xuất chiêu cực nhanh (0.15s/hit). Damage: Medium.
  - **Đá xoay (Sweep kick):** Nhấn giữ + Đánh. Hitbox quét dưới chân, khiến địch mất đà/ngã. Damage: Low.
  - **Thượng câu quyền (Uppercut launcher):** Nhấn Lên + Đánh. Hitbox dọc, hất quái nhỏ và vừa lên không. Damage: High.
- **Edge of Taixuan (Gauge):** Thanh nạp riêng của Fu Hua (tối đa 100%). Khi đầy, bấm chiêu cuối tung chưởng lực thẳng tới trước. Damage: Extreme. Visual: Ánh sáng trắng/vàng kim phủ kín màn hình trong 0.5s.
- **Khác biệt gameplay:** Senti thiên về *Weapon switch, diện rộng, hỗn loạn*, Fu Hua thiên về *chính xác, né tránh hoàn hảo (I-frames 0.2s), đánh cận chiến đơn mục tiêu sát thương cao*.

### 1D. Dual Combo

- **Điều kiện kích hoạt:** Thanh Dual Combo (góc dưới màn hình) đầy bằng cách cả HoS và Fu Hua Assist tạo ra 30 hit không bị gián đoạn.
- **Input:** Khi prompt "DUAL!" nhấp nháy, nhấn cùng lúc 2 nút (Tấn công + Assist).
- **Hiệu ứng:** Senti và Fu Hua tung đòn đồng thời. HoS dùng kiếm chém ngang, Fu Hua đấm thẳng.
- **Damage Multiplier:** x3 tổng lượng damage cơ bản. Đòn đánh có tỷ lệ xuyên giáp 100%.
- **Visual/SFX:** Màn hình làm chậm 0.5 giây (Slow-motion), chớp sáng âm bản (Invert colors 1 khung hình), tiếng "KANG" rền vang.

### 1E. Ultimate Combo (Chỉ dùng Chương 7)

- **Chuỗi Input:** Hiện prompt trên màn hình khi Mnemosyne còn ≤ 25% HP. Sequence: **↑ → ↓ ← + ATTACK**.
- **Chi tiết từng Input:**
  1. **↑ (Lên):** Senti vung Xích nhận quấn chặt lấy Boss (Timing: 1.5s). Visual: Dây xích đỏ chằng chịt khóa mục tiêu.
  2. **→ (Phải):** Fu Hua lao vào dùng Edge of Taixuan (Timing: 1.5s). Visual: Rồng vàng phá vỡ lớp giáp phòng thủ.
  3. **↓ (Xuống):** Senti phi Thương xuyên thẳng từ trên xuống (Timing: 1.5s). Visual: Mũi thương đỏ khoan thủng mặt đất.
  4. **← (Trái):** Senti rút Kiếm chém một nhát cắt ngang không gian (Timing: 1.5s). Visual: Vết nứt đỏ/đen trên màn hình.
  5. **ATTACK:** Cả hai cùng vung quyền/kiếm cuối cùng (Timing: 1.5s). Visual: Màn hình bùng nổ, tan biến mọi dữ liệu ký ức.

---

## PHẦN 2: BOSS PATTERN CHI TIẾT

### 1. Nagazora Husk (Ch1)
- **HP Bar:** 1 thanh.
- **Attack Pattern:**
  - *Slam:* Đập tay xuống đất. Telegraph: Vươn cao 2 tay (1.2s). Hitbox: Hình tròn nhỏ quanh boss. Damage: Low.
  - *Charge:* Lao tới phía trước. Telegraph: Cúi thấp, mắt sáng đỏ (1s). Hitbox: Đường thẳng. Damage: Medium.
- **Cách khai thác:** Dùng Kiếm để chém, parry đòn Charge để làm boss choáng.
- **Phase Transition:** Không có.
- **Hội thoại:** HoS: *"Thấy chưa? Chưa cần đủ đồ ta đã mạnh thế này rồi!"*

### 2. Glitch Chariot (Ch2)
- **HP Bar:** 1 thanh (có thêm giáp ảo).
- **Attack Pattern:**
  - *Leap:* Nhảy lên và rơi xuống. Telegraph: Nhún chân (1s). Hitbox: Diện rộng khi đáp. Damage: High.
  - *Glitch Dash:* Lướt nhanh với bóng mờ. Telegraph: Người chớp giật xanh/đỏ (0.8s). Damage: Medium.
- **Cách khai thác:** Dùng Thương đâm 3 hit liên tiếp để phá giáp ảo, sau đó đổi Kiếm chém dồn sát thương.
- **Phase Transition:** Không có.

### 3. Aesir Heimdall (Ch3)
- **HP Bar:** 2 thanh.
- **Attack Pattern (Phase 1):**
  - *Shield Bash:* Dùng khiên đẩy tới. Telegraph: Đưa khiên lên trước (0.5s). Damage: Medium.
  - *Hammer Swing:* Quét búa. Telegraph: Kéo búa về sau (1s). Damage: High.
- **Attack Pattern (Phase 2 - Aesir Mode):**
  - *Overdrive:* Đỏ rực, tốc độ đánh x1.5. Tung chuỗi 3 hit (Chém, Đập, Bắn tên lửa). Damage: High.
- **Cách khai thác:** Phase 1 dùng Thương đâm xuyên khiên. Phase 2 gọi Fu Hua Assist chặn combo 3 hit, tạo sơ hở cho HoS lao vào.
- **Phase Transition:** Chuyển sang Phase 2 khi hết thanh 1. Kích hoạt phản lực đẩy HoS ra xa, gầm lên và đổi màu đỏ.
- **Hội thoại:** Senti: *"Này Heimdall! Bà cụ phía sau ta đánh mạnh hơn ông đấy!"*

### 4. Parvati (Ch4)
- **HP Bar:** 2 thanh.
- **Attack Pattern (Phase 1):**
  - *Ice Breath:* Phun băng liên tục 3s. Telegraph: Hít hơi sâu (1.2s). Hitbox: Hình nón rộng. Damage: Medium + Slow.
  - *Rolling Attack:* Cuộn tròn lăn tới. Telegraph: Thu mình (0.8s). Damage: High.
- **Attack Pattern (Phase 2):**
  - *Absolute Zero:* Đóng băng một nửa phòng. Telegraph: Dậm chân rít gào (2s).
  - *Ice Spikes:* Gai băng mọc từ đất lên theo vị trí của người chơi.
- **Cách khai thác:** Dùng Xích nhận kéo bay lách qua Ice Breath. Phase 2 Fu Hua Assist sẽ phá vỡ tường băng.
- **Phase Transition:** Khi hết thanh 1, Parvati gầm lên, sương mù lạnh bao phủ, nhạc đổi nhịp trầm.

### 5. Hư Ảnh Fu Hua / Assaka-style (Ch5)
- **HP Bar:** 2 thanh.
- **Attack Pattern (Phase 1 - Taixuan):**
  - *Ki Blast:* Chưởng lực xa. Telegraph: Thu tay tụ khí (0.5s). Damage: Medium.
  - *Palm Strike Combo:* Lao tới đấm 4 nhịp. Telegraph: Khóa mục tiêu (0.3s). Damage: High.
- **Attack Pattern (Phase 2 - HoS Copy):**
  - *Fake Chains:* Quăng xích kéo Senti. Telegraph: Vung xích trên đầu (0.6s).
  - *Fake Spear:* Lao xuống từ không trung bằng thương. Telegraph: Biến mất lên trời (1s). Damage: Extreme.
- **Cách khai thác:** Phải học pattern. Khi boss dùng xích, Senti dùng thương chặn lại. Khi boss dùng thương lao xuống, dùng kiếm parry hoàn hảo. Kết liễu bằng Dual Combo.
- **Phase Transition:** Boss thu nạp dữ liệu Taixuan, tạo lốc xoáy ảo ảnh hất Senti văng ra.
- **Hội thoại:** Hư Ảnh: *"Ta là phiên bản không có sai lầm..."* Senti: *"Đồ giả! Đánh giống ta mà thiếu cái hay nhất... Phong cách!"*

### 6. Jizo Mitama biến thể (Ch6)
- **HP Bar:** 1 thanh siêu dài.
- **Attack Pattern:**
  - *Cursed Wave:* Phóng 3 vòng sóng âm từ trung tâm. Telegraph: Giơ kiếm lên cao, tụ năng lượng tím (1.5s). Damage: High.
  - *Phantom Slashes:* Tạo ảo ảnh chém chéo bản đồ. Telegraph: Biến mất và xuất hiện 3 bóng (1s). Damage: Medium.
- **Cách khai thác:** Cần sự nhịp nhàng. HoS nhảy qua/kéo xích, Fu Hua dùng Edge of Taixuan cắt ngang con sóng lớn nhất.
- **Phase Transition:** Mini-boss không có phase transition.

### 7. Mnemosyne (Ch7)
- **HP Bar:** 3 thanh.
- **Phase 1 (Dạng Dữ Liệu):**
  - *Memory Bullets:* Bắn hàng trăm mảnh vỡ như đạn mạc (Bullet Hell). Damage: Low nhưng spam.
  - *Cách đánh:* Dùng Xích nhận kéo các mảng ký ức to ném ngược lại boss.
- **Phase 2 (Dạng Bóng Dáng):**
  - *Copycat:* Xài luân phiên Edge of Taixuan (phạm vi rộng) và Bão Thương của HoS. Damage: High.
  - *Cách đánh:* Dùng Thương liên tục phá giáp phòng ngự dữ liệu của boss, gọi Assist liên tục. Chuyển phase khi gọi Dual Combo.
- **Phase 3 (Fu Hua Hoàn Hảo):**
  - *Absolute Strike:* Một đòn kiếm tốc độ ánh sáng ngang màn hình. Telegraph: Sáng lóe (0.2s). Damage: Extreme.
  - *Cách đánh:* Buộc phải dùng Kiếm để parry hoàn hảo (không parry được = chết). Khi máu boss còn 25%, kích hoạt chuỗi Ultimate Combo.
- **Hội thoại:** Khi Mnemosyne hỏi tại sao không biến mất, Senti: *"Và đặc biệt — ta là đứa duy nhất dám gọi Fu Hua là bà cụ ngay trước mặt cổ."*

### 8. Benares (Boss Endless Milestone)
- **HP Bar:** 2 thanh.
- **Attack Pattern (Phase 1 - Bay):**
  - *Lightning Breath:* Phun sét từ trên xuống thành luồng dài. Damage: High + Tê liệt.
  - *Cách đánh:* Phải dùng Thương ném lên phá cánh hoặc Xích đu lên đánh trên không.
- **Attack Pattern (Phase 2 - Rơi xuống đất):**
  - *Tornado Spin:* Xoay vòng cắn xé. Damage: Extreme.
  - *Cách đánh:* Kiếm parry kết hợp Assist Fu Hua để chặn đứng vòng xoay.
- **Hội thoại:** HoS: *"Benares! Lâu lắm rồi nhỉ!"* / Fu Hua: *"Cẩn thận. Nó không vui khi gặp lại cậu."*

---

## PHẦN 3: ENDLESS MODE DESIGN

- **Wave Structure:** Mỗi segment (màn chơi) tương đương 10 wave. Mỗi wave gồm việc chạy và tiêu diệt lượng quái chỉ định (hoặc sống sót trong X giây). Khi xong 10 wave sẽ có hiệu ứng chuyển map (Glitch transition). Cứ mỗi 50 wave gặp 1 Boss Milestone (ví dụ Benares).
- **Scaling Formula:**
  - Quái vật: +5% HP, +5% ATK mỗi 10 wave.
  - Tốc độ chạy của HoS: +2% mỗi 10 wave (tăng độ khó phản xạ).
- **Map Rotation:**
  - Thứ tự ngẫu nhiên giữa: Nagazora -> Arc City -> Helheim -> Babylon -> Taixuan.
  - Chuyển cảnh: Màn hình nhiễu hạt (glitch) 1 giây, nhạc nền mix mượt sang bài của map tiếp theo.

### Hệ Thống Upgrade (20+ thẻ, xuất hiện mỗi 10 wave hoặc sau mini-boss)

| Upgrade Tên | Tier | Hiệu ứng | Stack Rules |
|---|---|---|---|
| Kiếm Sắc | Common | Kiếm +15% damage. | Max 5 stacks |
| Thương Xuyên Thấu | Common | Thương xuyên thêm 1 mục tiêu. | Max 3 stacks |
| Xích Dài | Common | Xích nhận tăng 20% tầm với. | Max 3 stacks |
| Tốc Đánh | Common | Tăng 10% tốc độ xuất chiêu vũ khí. | Max 5 stacks |
| Hồi Máu Nhẹ | Common | Nhặt đồng xu ký ức hồi 1 HP. | Max 1 stack |
| Mắt Phản Xạ | Rare | Cửa sổ Parry Kiếm tăng thêm 0.05s. | Max 3 stacks |
| Thương Phá Giáp | Rare | Đâm thương 2 hit là phá giáp thay vì 3. | Max 1 stack |
| Bão Xích | Rare | Quét xích trúng tối đa 8 quái. | Max 1 stack |
| Đồng Bộ | Rare | Thanh Dual Combo nạp nhanh hơn 20%. | Max 3 stacks |
| Taixuan Khí | Rare | Edge of Taixuan damage +30%. | Max 5 stacks |
| Khiên Bền | Rare | Fu Hua Parry có cooldown giảm 2 giây. | Max 3 stacks |
| Tốc Độ Phản Ứng | Rare | Sau khi Weapon Switch, damage hit kế +20%. | Max 3 stacks |
| Đâm Đôi | Rare | Charge Thương nổ x2 sát thương ở điểm cuối. | Max 1 stack |
| Nam Châm Ký ỨC | Rare | Hút các mảnh ký ức tiền tệ từ xa. | Max 1 stack |
| Lướt Không Chạm | Rare | Nhảy đôi được I-frame 0.1s. | Max 1 stack |
| Hồi Huyết Đỉnh | Epic | Mỗi lần Dual Combo hồi 10% HP tối đa. | Max 1 stack |
| Hồi Sinh (Phượng Hoàng) | Epic | Hồi sinh 1 lần với 50% HP. | Max 1 stack |
| Bậc Thầy Đổi Vũ Khí | Epic | Switch vũ khí tạo ra sóng xung kích gây damage. | Max 1 stack |
| Vô Ảnh Quyền | Epic | Fu Hua Assist không tốn charge (Cooldown nội tại 15s). | Max 1 stack |
| Đòn Phạt Sét | Epic | Cứ đánh trúng 10 hit liên tục sẽ gọi 1 tia sét giật. | Max 1 stack |

### Leaderboard Metrics
- **Distance:** Quãng đường chạy được (m).
- **Kills:** Tổng số quái bị hạ.
- **Waves:** Số wave sống sót tối đa.
- **Time:** Tổng thời gian trụ lại của Run.

### Hội Thoại Ngẫu Nhiên (Trích 15 đoạn xuất hiện lúc chạy Endless)
1. S: "Chạy mãi thế này mỏi chân không bà cụ?" / F: "Ta không biết mỏi."
2. S: "Lần sau gặp quái nhớ nhường ta hit cuối!" / F: "...Ta sẽ cố."
3. S: "Đói quá, chạy xong đi ăn bánh bao nhé!"
4. S: "Đừng chạy chậm lại đấy, ta không đợi đâu!" / F: "Cậu vừa mới vấp đá mà."
5. F: "Chú ý nhịp thở." / S: "Herrscher không cần thở!"
6. F: "Bên trái có hố sâu." / S: "Đã thấy!"
7. S: "Ê, nãy ta chém đẹp không?" / F: "Cũng được."
8. S: "Này, bao giờ rảnh đấu võ một trận tử tế không?" / F: "Tùy cậu."
9. S: "Bụi vào mắt ta rồi!" / F: "Nhắm mắt lại." / S: "Nhắm thì chạy kiểu gì?!"
10. F: "Tăng tốc lên." / S: "Không cần bà nhắc!"
11. S: "Quái hôm nay trông có vẻ yếu."
12. F: "Vũ khí của cậu mòn rồi kìa." / S: "Nó làm từ ký ức, làm sao mòn được!"
13. S: "Nhạc nền khúc này hay ghê." / F: "...Nhạc nào?"
14. S: "Kỷ lục cũ của ta là bao nhiêu nhỉ?"
15. F: "Lưng cậu có mạng nhện." / S: "CÁI GÌ? LẤY RA NGAY!"

---

## PHẦN 4: 14 MẢNH KÝ ỨC ẨN

Mỗi chương có 2 mảnh ẩn. Thu thập đủ sẽ mở khóa kết thúc bí mật và trang phục Origin.

| Chương | Phân đoạn chứa | Vị trí / Cách tìm | Nội dung ký ức |
|---|---|---|---|
| Ch1 | Tòa nhà sụp | Phá vỡ một bức tường bằng Kiếm có vết nứt phát sáng. | *Fu Hua dạy võ cho một môn sinh nhỏ tuổi.* (Pixel art: Fu Hua đang nắm tay chỉnh thế đứng cho học trò). |
| Ch1 | Đường phố Nagazora | Đu xích nhận qua ngọn đèn đường cao nhất bị gãy. | *Senti lần đầu chạm vào nước mưa.* (Pixel art: Senti ngửa mặt, giơ tay đón giọt mưa với vẻ ngạc nhiên). |
| Ch2 | Mái nhà Arc City | Giữa khoảng trống lớn, rớt xuống 1 gờ nhỏ phía dưới trước khi đu lên. | *Fu Hua nấu món súp bị khét.* (Pixel art: Khói bốc mù mịt từ bếp, Fu Hua ho sặc sụa). |
| Ch2 | Heliopolis Hầm | Đâm Thương phá vỡ cánh cửa thép khóa kín số "04". | *Senti mua kính râm đỏ bảnh chọe.* (Pixel art: Senti đeo kính râm, cười tự mãn trước gương). |
| Ch3 | Khu lưu trữ ký ức | Không phá sai bất kỳ bể bẫy nào trong khu vực (Flawless). | *Cả hai cùng ăn chung một bát mì.* (Pixel art: Senti và Fu Hua ngồi vỉa hè ăn mì nóng). |
| Ch3 | Thang máy hỏng | Nhảy bám vào rìa mép thang máy đang rớt xuống, có hốc bí mật. | *Fu Hua đọc sách dưới gốc cây đào.* (Pixel art: Gió thổi cánh hoa đào rơi lên trang sách). |
| Ch4 | Đồng tuyết | Đánh bại 3 quái băng trong bão tuyết bằng đúng đòn đánh của Fu Hua Assist. | *Senti vẽ bậy lên áo choàng của Schicksal.* (Pixel art: Senti cầm bút lông vẽ mặt cười nham nhở). |
| Ch4 | Bên trong Babylon | Dùng Xích kéo một chiếc hộp sắt ra khỏi tường tuyết để mở lối. | *Fu Hua mua lồng đèn đỏ đầu năm.* (Pixel art: Fu Hua cầm lồng đèn nhỏ mỉm cười). |
| Ch5 | Taixuan Steps | Đi sai đường trong "Ảo vs Thật" 3 lần liên tiếp, game sẽ thả vào hầm nhỏ chứa mảnh. | *Senti lén chải tóc cho Fu Hua khi ngủ.* (Pixel art: Senti rón rén chải tóc, mặt toát mồ hôi hột). |
| Ch5 | Ảo vs Thật | Chém 10 bông hoa giả ở lớp map "hoàn hảo". | *Fu Hua uống trà nóng và nhắm mắt thư giãn.* (Pixel art: Hơi sương bốc lên từ tách trà). |
| Ch6 | Bong bóng Senti | Chờ ở bong bóng đầu tiên 30 giây không di chuyển. | *Senti tức giận vì bị máy gắp thú cắn đồng xu.* (Pixel art: Senti đập tay vào máy gắp thú bông). |
| Ch6 | Kolosten (Fu Hua) | Phá vỡ 5 cột thu lôi liên tiếp bằng đòn Thượng Câu Quyền. | *Fu Hua được tặng một cành hoa nhỏ.* (Pixel art: Một bàn tay giấu mặt đưa cành hoa cho Fu Hua). |
| Ch7 | Nhánh cây Imaginary | Chạy ngược lại 2 màn hình lúc mới bắt đầu map. | *Hai người cãi nhau xem ai ngáy to hơn.* (Pixel art: Speech bubble cãi vã tung tóe quanh hai cái đầu đang ngủ). |
| Ch7 | Ký ức cuối cùng | Sử dụng Dual Combo trúng đích 3 lần trong khu vực buff trước thềm Boss. | *Senti và Fu Hua cùng ngắm bình minh trên đỉnh núi.* (Pixel art: Hai cái bóng đổ dài dưới ánh cam). |

---

## PHẦN 5: 6 IDLE ANIMATIONS

Chạy trên màn hình chờ/menu chính.

| # | Tên Animation | Chi tiết Frame-by-frame | Duration | Trigger | Điểm đáng yêu |
|---|---|---|---|---|---|
| 1 | **Cãi nhau** | Senti (10 frame chỉ tay, miệng mấp máy), Fu Hua (khoanh tay đứng im). Senti giậm chân (5 frames). Lặp lại loop. | Loop | Xảy ra ngẫu nhiên khi nhàn rỗi ở Menu. | Senti hăng hái nói một mình, Fu Hua mặt lạnh te không quan tâm. |
| 2 | **Chỉnh tóc** | Senti rút gương nhỏ (3 frame), chải tóc (15 frame). Chọc cùi chỏ Fu Hua (4 frame). Fu Hua lắc đầu dán mắt vào sách. | 4 giây | Mở menu "Loadout". | Sự điệu đà bất ngờ của "Ta đây vô địch" và sự phũ phàng của Fu Hua. |
| 3 | **Ngủ gật** | Cả hai ngồi xổm dựa lưng. Đầu Senti gật gù (10 frame), ngả bộp sang vai Fu Hua. Fu Hua rùng mình (2 frame) rồi hơi ngả vai ra đón (5 frame). | Loop | Màn hình chờ > 30 giây. | Khoảnh khắc bình yên và sự dịu dàng thầm lặng của Fu Hua. |
| 4 | **Tranh đứng trước** | Senti bước lên 1 bước lấn hình (5 frame). Fu Hua bước lên cân bằng (5 frame). Lặp lại 3 lần cho đến khi cả 2 dính sát vào màn hình. | 6 giây | Trigger khi quay về Menu từ trận Endless thua. | Tính trẻ con ăn thua từng chút một của cả hai. |
| 5 | **Khoe** | Senti tung thanh kiếm lên quay tít, chộp lấy pose dáng siêu ngầu (20 frames). Fu Hua vỗ tay đôm đốp chậm rãi (10 frames). Senti mặt đỏ tự hào. | 5 giây | Hoàn thành Achievement mới. | Fu Hua cổ vũ kiểu "có lệ" nhưng Senti vẫn khoái chí. |
| 6 | **Trêu ngược** | Bọt thoại "..." hiện trên Fu Hua (5 frames). Senti hóa đá, mặt đỏ bừng pixel (10 frames). Senti quay ngoắt 180 độ giấu mặt. Fu Hua nhếch môi 1 pixel. | 5 giây | Click chuột nhiều lần vào Fu Hua ở Menu. | Fu Hua hiếm hoi chủ động trêu chọc làm Senti "tắt điện". |

---

## PHẦN 6: TRANG PHỤC

Người chơi có thể đổi trang phục. Khi đổi của Senti, Fu Hua sẽ tự động đổi sang bộ tương ứng theo chủ đề.

| Trang phục HoS | Trang phục Fu Hua tương ứng | Mô tả Visual Pixel Art (HoS) | Hiệu ứng đặc biệt |
|---|---|---|---|
| **Default** | **Azure Empyrea (Default)** | Áo trắng đen, quần bó xám, tóc ngắn xám tro búi lệch, kính râm đỏ nhỏ. | N/A |
| **Origin** | **Fenghuang Down** | Tóc xõa dài không kẹp, không mũ/kính. Bộ đồ đơn giản tông trắng, mờ ảo viền đỏ. Có vệt sáng nhỏ bốc lên từ vai. | Trail di chuyển màu trắng đỏ, chớp sáng lúc lướt. |
| **Neon Runner** | **Cybernet Hacker** | Áo khoác dạ quang xanh lá/tím, kính điện tử pixel. Đeo tai nghe bự. | Các đòn chém Kiếm có tia lửa Neon (hồng/xanh lam). Âm thanh chém mang phong cách Synthwave. |
| **Frostborn** | **Snowy Taixuan** | Áo choàng trắng tuyết viền lông dày. Tóc ám màu bạc băng giá. Hơi thở ra khói. | Thương đâm tạo ra particle bông tuyết vỡ. Chạm đất sinh ra lớp băng mỏng. |
