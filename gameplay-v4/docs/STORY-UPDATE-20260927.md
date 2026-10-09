# Bàn giao cập nhật Story

Các module mới: `story-environment.js`, `environment-runtime.js`, `boss-husk.js`, `story-crafting.js`, `story-sessions.js`, `story-panels.js`, `audio-system.js`.

Giữ save version 4 và khóa lưu cũ. Các phiên có chỉ mục riêng, bản snapshot riêng, backup riêng và ô manual riêng. Hành trình đầu tiên kế thừa dữ liệu v4 cùng ba ô manual cũ. Bản lưu tự động diễn ra tại checkpoint; thùng phụ tùng, bình HP và vàng dùng tập ID đã thu gom để không nhân đôi phần thưởng sau khi tải checkpoint.

Boss: hai mạng với thanh máu đầy riêng (4200 và 5400 HP). Mạng đầu không thể bị kết liễu tức thời: tại 1 HP boss tích nộ 3,4 giây rồi hồi đầy thanh thứ hai. Fu Hua lao vào giữa cảnh chuyển dạng và hỗ trợ đánh/làm yếu hộ vệ theo nhịp trong mạng hai. Khi gọi lính, khiên chặn sát thương; ngoài khoảng hở, giáp giảm sát thương còn 30%; trong khoảng hở, sát thương nhận x1.25. Năm chiêu: wave, rush, rain, beam, double; chuỗi chiêu mạng hai nhanh và đau hơn. Có thể cúi né hoặc phản tia bằng K; phản đòn tạo khoảng hở. Không cần trang bị rèn để thắng nếu thực hiện kỹ thuật đúng.

Fu Hua dùng các khung võ thuật `hua.0`–`hua.9` đã có trong atlas: lao từ phía sau Senti đến boss khi vào mạng hai, tạo dư ảnh và chuyển thế đấm/quét/chưởng, sau đó bám theo người chơi và lặp lại đòn hỗ trợ theo nhịp. Đòn hỗ trợ vẫn chịu quy tắc khiên/giáp boss, không gây sát thương xuyên cơ chế.

Mỗi arena Story thắng sẽ chuyển sang hoạt ảnh Yatta trước khi tiếp tục chạy. Tư thế giơ tay dùng một sprite duy nhất với hai tay cũ được loại khỏi vùng thân khi dựng hoạt ảnh, tránh hiện bốn tay. Nhạc boss dùng widget SoundCloud theo URL do người chơi đưa; nhạc tổng hợp sẽ thay thế khi stream không khả dụng.

Không thay đổi phần phát sinh nội dung Endless trong đợt này. Các module môi trường và AI boss mới chỉ chạy trong Story. Có kiểm tra hồi quy để chắc save Story không bị thay đổi khi chơi Endless.

Kiểm tra so sánh ở `qa/boss-tactics.json`: điều khiển chỉ áp sát/chém chết ở mạng 1; điều khiển biết nhảy/cúi/phản đòn thắng cả hai mạng và hạ 4 lính hỗ trợ. Đây là bot dùng cùng đầu vào bàn phím, không tăng HP hoặc dịch chuyển nhân vật.

Kiểm tra phiên và âm thanh: `qa/journeys-audio.json`. Đã kiểm tra bằng Edge; các mẫu audio giải mã được và nhạc/hiệu ứng có phát. Chưa khẳng định âm thanh đã được nghe đánh giá chủ quan trên mọi thiết bị.

Các tài liệu lore bàn giao gốc vẫn giữ nguyên. Lời thoại đang chạy nằm trong `level-chapter-1.json` và `gameplay-v2.js`; tên “Old Timer” trong nhật ký cũ được chuẩn hóa khi đọc save.
