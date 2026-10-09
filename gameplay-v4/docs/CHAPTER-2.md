# Chương 2 — Thành phố không ngủ, ký ức không dừng

Nguồn: `HoS_Script_Ch1-4.md` (phần Chương 2), `HoS_Story_Bible.md` (Arc City/Heliopolis), `HoS_Game_Design_Doc.md` (Glitch Chariot). Cách xưng hô trong game theo quyết định sau cùng: Senti gọi Fu Hua là **Old Timer**.

| Đoạn | Gameplay và cốt truyện |
|---|---|
| 2.1 Mái nhà Arc City | Mưa neon, mái nhà và khoảng trống. Fu Hua chạy phía sau; đánh chốt chặn trên mái. Cảnh bảng bánh bao giữ đoạn đối đáp giữa hai người. |
| 2.2 Phố bị lặp | Cùng bảng hiệu và cửa hàng xuất hiện lại. Dùng Kiếm chém bảng hiệu nhiễu để mở đường. Mảnh ẩn #3 ở phía sau: Fu Hua dọn đống đồ Senti bày rồi mỉm cười. |
| 2.3 Ký ức trên không | Cây Thương rơi từ mảnh ký ức. Nhấn E nhận Thương; phím 2 chọn Thương. Kiếm không đánh tới bầy quái bay, Thương có hitbox cao/tầm xa hơn. |
| 2.4 Heliopolis | Đường hầm khác hẳn Arc City: hơi nóng, laser theo nhịp đèn, quái cơ giới có giáp. Có nhật ký hàng hóa mang dấu Mnemosyne. |
| 2.5 Nóc tàu | Gió làm giảm tốc chạy, dash để giữ đà, nhảy qua thùng hàng trượt. Mảnh ẩn #4 ở đuôi tàu cần dash đúng vị trí, hé lộ Fu Hua từng dạy Senti dùng Thương. |

Năm cảnh hội thoại bắt buộc nối các chặng chơi: Fu Hua nhận ra mái nhà nhưng không nhớ Senti; bảng đèn lặp gạch tên Senti khỏi bản ghi; cơ thể Fu Hua tự nhớ cách dạy Thương; lệnh vận chuyển mang chữ ký giả của cô; và hai người cùng quyết định ở lại trên chuyến tàu tới Helheim. Các manh mối nhấn E vẫn là lớp khám phá thêm. Cảnh boss giữa trận giữ đúng nhịp Senti ngỡ Chariot sống lại, rồi Fu Hua lao vào giúp.

Glitch Chariot giờ có **hai thanh máu**. Mỗi mạng dựng ba trụ cấp khiên: trụ đỏ cần Kiếm, trụ tím cần lướt L, trụ xanh cần Thương. Khi cả ba tắt, Thương mới xuyên được các lớp giáp trên thân. Lõi chỉ nhận sát thương khi đang mở; Kiếm phản đúng cú lao tạo cửa sổ cho đòn đánh. Mạng hai tái lập trụ, gọi thêm ba lính và mở chiêu tia ngang (S trượt dưới tia), xích khóa vị trí (L né), cùng cú đáp và quét đuôi nhanh hơn. Fu Hua cứu ở chuyển pha, có hoạt ảnh và hồi một phần máu, nhưng không thể đánh thay người chơi. Thắng trận có Yatta, lời cảm ơn, ký ức chính #2 và tàu đổi hướng tới Helheim Labs.

Nút **Thử boss Chương 2** ở trang chủ và URL `?boss-demo=1` mở thẳng lời dẫn rồi vào Chariot. Bản thử dùng trang bị cố định, không lưu thưởng hay thay đổi Hành trình hiện tại; thua sẽ thử lại từ đầu trận.

Địa hình có 26 vị trí thiết kế, mỗi vị trí được kiểm tra giới hạn nhảy/arena/checkpoint; vị trí không an toàn bị bỏ qua. Hình nền Arc City và đoạn chuyển Heliopolis dùng nguyên bản từ `assets/original-library`; các lớp neon, ống hơi, laser, thùng hàng và mặt sàn được vẽ trong game để phân biệt từng khu. Sprite quái bay, Templar và Chariot cũng dùng bộ assets gốc, không ghi đè lên file bàn giao.

Tiến độ Chương 2 tiếp tục trong cùng phiên lưu Chương 1. Sau boss Nagazora, trang chủ chuyển sang Arc City; các checkpoint Chương 2 giữ vũ khí, ký ức ẩn, vật liệu và nhật ký. Fu Hua chạy cùng ở Chương 2 nhưng **Assist chủ động** vẫn dành cho Chương 3 theo Story Bible. Thùng phụ tùng Chương 2 cho Hợp kim/Tinh thể, không phát mảnh rèn 4★ hoặc viên gạch trước chương của chúng.
