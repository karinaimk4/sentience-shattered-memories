# DESIGN DECISIONS — SENTIENCE: SHATTERED MEMORIES
### Chốt toàn bộ 15 quyết định thiết kế

---

## 1. SỐ LƯỢNG MẢNH KÝ ỨC

| Loại | Số lượng | Chi tiết |
|---|---|---|
| **Mảnh chính (bắt buộc)** | 7 | 1 mảnh/chương, nhận tự động qua cốt truyện. |
| **Mảnh ẩn** | 14 | 2 mảnh/chương, giấu trong gameplay. Cần khám phá (đường tắt, phá tường ẩn, đánh boss trong điều kiện đặc biệt). |
| **Tổng** | **21** | Thu đủ 21/21 → mở kết thúc bí mật "Ký ức #0". |

**Nội dung mảnh ẩn:** Mỗi mảnh ẩn là một đoạn ký ức ngắn (1–2 câu + hình pixel art nhỏ) cho thấy những khoảnh khắc bình thường — không phải chiến đấu hay đau đớn. Ví dụ: Fu Hua dạy học trò ở Taixuan, Senti lần đầu thấy mưa, Fu Hua nấu ăn và cháy bếp. Mục đích: cho thấy ký ức không chỉ có đau khổ.

---

## 2. ĐỘ DÀI MỖI CHƯƠNG

| Chương | Thời lượng | Ghi chú |
|---|---|---|
| Ch1 — Nagazora | ~8 phút | Tutorial, nhịp nhanh. |
| Ch2 — Arc City & Heliopolis | ~8 phút | Giới thiệu Fu Hua đồng hành + Thương. |
| Ch3 — Helheim & Schicksal HQ | ~10 phút | Mở khóa Assist, boss Heimdall. |
| Ch4 — Babylon | ~10 phút | Mở khóa Xích nhận, cảm xúc chậm lại. |
| Ch5 — Mount Taixuan | ~10 phút | Climax đầu tiên, Dual Combo. |
| Ch6 — Sea of Quanta & Kolosten | ~12 phút | Dài nhất, hai góc nhìn. |
| Ch7 — Imaginary Tree | ~12 phút | Boss 3 giai đoạn + kết thúc. |
| **Tổng Story Mode** | **~70 phút** | Không tính cutscene. |

---

## 3. FU HUA PLAYABLE (CHƯƠNG 6)

| Yếu tố | Chi tiết |
|---|---|
| **Thời lượng chơi** | 2 đoạn × ~90 giây = ~3 phút |
| **Moveset** | 3 combo quyền pháp: Liên hoàn quyền (jab-jab-hook), Đá xoay (sweep kick), Thượng câu quyền (uppercut launcher). |
| **Đặc biệt** | Edge of Taixuan — đòn mạnh, cooldown dài. Dùng khi gauge đầy. |
| **Khác biệt với Senti** | Không có weapon switch. Nhanh hơn, hitbox nhỏ hơn, damage ổn định. Gameplay cảm giác "chính xác và kiểm soát" thay vì "hỗn loạn và mạnh mẽ" như Senti. |
| **Mục đích thiết kế** | Cho người chơi cảm nhận rõ hai nhân vật KHÁC nhau → hiểu vì sao cả hai cần nhau. |

---

## 4. HỆ THỐNG UPGRADE ENDLESS MODE

**Mô hình: Roguelike-lite (upgrade tạm thời trong run)**

| Yếu tố | Chi tiết |
|---|---|
| **Currency** | Mảnh ký ức nhỏ (khác mảnh Story) — rơi từ quái và chướng ngại. |
| **Thời điểm chọn** | Mỗi 30 giây hoặc sau mỗi mini-boss wave. |
| **Lựa chọn** | Chọn 1 trong 3 upgrade ngẫu nhiên. |
| **Ví dụ upgrade** | Kiếm +20% tốc độ đánh, Thương xuyên 2 mục tiêu, Xích nhận kéo xa hơn, Assist nạp nhanh +30%, Hồi HP nhỏ, Dual Combo cooldown giảm, Tốc độ chạy +10%. |
| **Reset** | Mọi upgrade reset khi run kết thúc. |
| **Permanent unlock** | Mảnh ký ức tích lũy qua nhiều run để mua trang phục và idle animation mới. |

---

## 5. IDLE ANIMATIONS MÀN HÌNH CHỜ

| # | Tên | Mô tả |
|---|---|---|
| 1 | **Cãi nhau** | Senti chỉ tay vào Fu Hua, nói liên tục. Fu Hua khoanh tay, không phản ứng. Senti bực hơn. |
| 2 | **Chỉnh tóc** | Senti soi gương nhỏ, chỉnh tóc. Fu Hua ngồi cạnh đọc sách. Senti cố kéo Fu Hua soi cùng. Fu Hua từ chối mà không ngẩng đầu. |
| 3 | **Ngủ gật** | Cả hai ngồi dựa lưng vào nhau, ngủ gật. Senti ngả đầu sang vai Fu Hua. Fu Hua hơi nghiêng để Senti tựa thoải mái hơn, mắt vẫn nhắm. |
| 4 | **Tranh đứng trước** | Senti đẩy Fu Hua ra sau, pose trước camera. Fu Hua bình tĩnh bước lên trước. Lặp lại 3 lần. Cuối cùng cả hai đứng ngang nhau. |
| 5 | **Khoe** | Senti tung kiếm, bắt lại, pose. Fu Hua vỗ tay chậm (có thể châm biếm, có thể thật — không rõ). Senti vui. |
| 6 | **Trêu ngược** | Fu Hua nói gì đó (speech bubble nhỏ). Senti đứng im 2 giây, rồi đỏ mặt pixel, rồi quay đi. Fu Hua mỉm cười rất nhẹ. |

---

## 6. BENARES

**Quyết định: Boss milestone trong Endless Mode.**

| Chi tiết | Giá trị |
|---|---|
| Xuất hiện | Mỗi 50 wave |
| Mechanics | Bay trên không → Thương là vũ khí chính. Phun lightning → né hoặc xích nhận đu tránh. Landing phase → kiếm phản đòn. |
| Phần thưởng | x5 mảnh ký ức, 1 upgrade hiếm (Epic tier). |
| Hội thoại | *Senti: "Benares! Lâu lắm rồi nhỉ!"* / *Fu Hua: "Cẩn thận. Nó không vui khi gặp lại cậu."* |

---

## 7. NIHILIUS

**Quyết định: Cameo ảo ảnh, không đánh.**

Tại Sea of Quanta (Ch6, phân đoạn Senti), khi chạy qua bong bóng ký ức, một bong bóng bị đen hoàn toàn. Bên trong, hình bóng Husk – Nihilius xuất hiện 3 giây — đứng im, nhìn thẳng vào camera, rồi biến mất.

> *Senti (chạy qua):* "...Cái gì đó vừa nhìn ta."
> *Senti:* "Kệ. Ta nhìn lại đáng sợ hơn."

Không có tương tác gameplay. Chỉ tạo không khí.

---

## 8. NHẠC NỀN

| # | Track | Phong cách |
|---|---|---|
| 1 | Ch1 — Nagazora | Industrial ambient + rising drums. Bắt đầu yên tĩnh, dần mạnh khi kiếm được rút. |
| 2 | Ch2 — Arc City | Synthwave / cyberpunk, bass nặng, nhịp nhanh. Mưa và neon. |
| 3 | Ch3 — Helheim / Schicksal | Dark orchestral, tiếng chuông kim loại, echo trong hành lang. |
| 4 | Ch4 — Babylon | Piano chậm + strings u buồn. Tuyết rơi. Chuyển mạnh khi boss. |
| 5 | Ch5 — Mount Taixuan | Nhạc cụ truyền thống Trung Hoa (erhu, guzheng) + electronic fusion. Tĩnh lặng → intense. |
| 6 | Ch6 — Sea of Quanta / Kolosten | Ambient glitch + distorted piano. Hai version: Senti = chaos, Fu Hua = melancholic. |
| 7 | Ch7 — Imaginary Tree | Epic orchestral. Layered — thêm instrument mỗi giai đoạn boss. |
| B1 | Boss — Heimdall | Norse metal / war drums. |
| B2 | Boss — Parvati | Choral + ice SFX ambient. |
| B3 | Boss — Hư Ảnh | Mirror của Ch5 theme nhưng minor key, nhanh hơn, sai nhịp nhẹ. |
| B4 | Boss — Mnemosyne (3 phase) | Phase 1: Glitch ambient. Phase 2: Orchestral tension. Phase 3: Full orchestra + choir + silence khi dialogue. |
| E1 | Endless Mode | Remix tổng hợp tất cả chapter theme, chuyển đổi theo map. |

---

## 9. TRANG PHỤC

| # | Tên | Cách mở khóa | Mô tả |
|---|---|---|---|
| 1 | **Default** | Có sẵn | HoS trang phục tiêu chuẩn. |
| 2 | **Origin** | Kết thúc bí mật (21/21 mảnh ký ức) | Tóc xõa, không mũ, phát sáng nhẹ. Thiết kế "nguyên thủy" — trước khi Senti chọn ngoại hình hiện tại. |
| 3 | **Neon Runner** | Endless Mode — sống sót 100 wave | Áo khoác neon xanh, kính pixel, phong cách cyberpunk Arc City. |
| 4 | **Frostborn** | Endless Mode — sống sót 200 wave | Áo choàng trắng viền băng, tóc bạc nhẹ, lấy cảm hứng từ Babylon. |

**Fu Hua** cũng có trang phục thay đổi tương ứng (palette swap + chi tiết nhỏ).

---

## 10. NGÔN NGỮ

| Ngôn ngữ | Vai trò |
|---|---|
| **Tiếng Việt** | Ngôn ngữ chính. Mọi hội thoại viết bằng tiếng Việt trước. |
| **Tiếng Anh** | Bản dịch phụ. Dịch sau khi kịch bản tiếng Việt hoàn tất. |

Hệ thống text đủ nhỏ để dịch hai ngôn ngữ không tốn quá nhiều công — game ưu tiên hội thoại ngắn.

---

## 11. VOICE ACTING

**Quyết định: Text + SFX + Voice Clips ngắn.**

| Loại | Chi tiết |
|---|---|
| **Text** | Mọi hội thoại hiển thị dưới dạng text box / speech bubble. |
| **SFX** | Hiệu ứng âm thanh chiến đấu, chướng ngại vật, môi trường. |
| **Voice clips** | Các clip ngắn 1–3 giây: hét chiêu thức ("Ha!"), cười, kêu đau, Senti nói "Ta đây vô địch!" khi combo dài, Fu Hua nói "Cẩn thận" khi Assist kích hoạt. Không voice full dialogue. |

---

## 12. COMBO SYSTEM

### Dual Combo
| Yếu tố | Chi tiết |
|---|---|
| Kích hoạt | Thanh Dual Combo đầy (nạp qua đánh liên tục không miss). Nhấn **1 nút** khi prompt "DUAL!" xuất hiện. |
| Hiệu ứng | Senti + Fu Hua tấn công đồng thời. Slow-motion 0.5 giây, pixel art flash, damage x3. |
| Cooldown | 15 giây sau khi dùng. |

### Ultimate Combo (chỉ dùng trong boss cuối Ch7)
| Yếu tố | Chi tiết |
|---|---|
| Kích hoạt | Tự động trigger khi boss HP ≤ 25%. |
| Chuỗi QTE | 5 input: **↑ → ↓ ← + ATTACK**. Mỗi input tương ứng một đòn: Xích giữ → Edge of Taixuan → Thương xuyên → Kiếm chém → Đòn cuối đồng thời. |
| Thời gian mỗi input | 1.5 giây (thoải mái, không quá khó). |
| Nếu miss | Combo không fail hoàn toàn — chỉ giảm damage. Đảm bảo mọi người chơi đều trải nghiệm được cảnh kết. |

---

## 13. DIFFICULTY

| Mode | Cách xử lý |
|---|---|
| **Story Mode** | Một mức cố định, thiên về dễ tiếp cận. Nếu chết 3 lần ở cùng phân đoạn, game tự giảm damage quái 20% (không thông báo, để không làm người chơi xấu hổ). |
| **Endless Mode** | Auto-scale: Quái +5% HP/ATK mỗi 10 wave. Tốc độ chạy +2% mỗi 10 wave. Boss milestone mỗi 50 wave. |

---

## 14. CUTSCENE FORMAT

| Loại | Số lượng | Sử dụng |
|---|---|---|
| **In-game speech bubble** | ~90% hội thoại | Mặc định. Text box nhỏ dưới màn hình hoặc bubble trên đầu nhân vật. Không dừng gameplay trừ trước/sau boss. |
| **Pixel art cutscene animation** | 5 cảnh | Cảnh đặc biệt, có animation riêng, tạm dừng gameplay. |

### 5 Pixel Art Cutscene:

| # | Vị trí | Nội dung |
|---|---|---|
| 1 | Ch1 — Opening | Senti tỉnh dậy giữa Nagazora. Mắt mở, nhìn quanh, bàn tay nhòe. |
| 2 | Ch1 — Gặp Fu Hua | Senti phá vòng lặp. Fu Hua thoát ra, hai người nhìn nhau. |
| 3 | Ch5 — Fu Hua chọn | Fu Hua quay lưng lại Hư Ảnh, bước về phía Senti. |
| 4 | Ch6 — Tái hợp | Senti phá bong bóng, lao qua, thấy Fu Hua giữa bão. Hai người đứng cạnh nhau. |
| 5 | Ch7 — Kết thúc | Hai người đi dọc nhánh Imaginary Tree. Camera zoom ra. |

---

## 15. HOS XƯNG HÔ

| Ngữ cảnh | Cách xưng |
|---|---|
| **Mặc định** | "Ta" — tự tin, hơi kiêu ngạo, đúng chất Senti. |
| **Khi nghiêm túc** | Vẫn "ta" nhưng giọng thay đổi — ngắn hơn, ít đùa hơn. |
| **Ký ức #0 (kết bí mật)** | Dùng "tôi" **một lần duy nhất**: *"...Tôi muốn sống."* Đây là giọng nói đầu tiên của ý thức, trước khi Senti chọn persona "ta đây vô địch". Ngay sau đó quay lại "ta". |
| **Hiệu ứng** | Việc đổi xưng hô tạo contrast cảm xúc rất mạnh vì người chơi đã quen "ta" suốt cả game. Chỉ cần một lần "tôi" là đủ. |

---

> [!IMPORTANT]
> Mọi quyết định trên đã được chốt. Tài liệu tiếp theo sẽ dựa trên các quyết định này:
> - **HoS_Script_Ch1-4.md** — Kịch bản chi tiết Chương 1–4
> - **HoS_Script_Ch5-7_Endings.md** — Kịch bản chi tiết Chương 5–7 + hai kết thúc
> - **HoS_Game_Design_Doc.md** — Boss pattern, combat, Endless Mode, memory fragments, idle animations
