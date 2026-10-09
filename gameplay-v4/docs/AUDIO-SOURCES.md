# Nguồn âm thanh — 27/09/2026

Nhạc nền thường và các clip kỹ năng được tải từ máy chủ công khai của trang Honkai Impact 3rd chính thức. Nhạc đánh boss phát trực tiếp qua trình phát SoundCloud theo liên kết người chơi cung cấp, không đóng gói tệp nhạc đó. Không sử dụng voice AI hoặc giả giọng diễn viên.

- Nhạc nền: https://honkaiimpact3.hoyoverse.com/global/en-us/home
- Clip kỹ năng Herrscher of Sentience / Azure Empyrea: https://honkaiimpact3.hoyoverse.com/global/en-us/valkyries
- Dữ liệu nhạc của trang: https://webstatic.hoyoverse.com/admin/mi18n/bh3_global/m20230317hy14h0glc0/m20230317hy14h0glc0-en-us.json
- Danh mục kỹ năng: https://sg-public-api-static.hoyoverse.com/content_v2_user/app/5fcd2aa439ca4aea/getContentList?iPageSize=200&iPage=1&sLangKey=en-us&iChanId=521&isPreview=0
- Nhạc giao tranh theo yêu cầu người chơi: https://soundcloud.com/albedo_simp/honkai-impact-3rd-hos-trailer

Đường dẫn CDN, nhân vật và clip nguồn: `audio-research/official-sources.json`. Điểm bắt đầu/thời lượng từng đoạn cắt: `../audio-manifest.json`. Nhạc giữ nguyên tệp nguồn; đoạn kỹ năng cắt ngắn, fade đầu/cuối, cân âm lượng và mã hóa OGG.

Voice HoS/Fu Hua là mẫu chiến đấu từ bản mix của clip kỹ năng, có thể đi kèm tiếng hiệu ứng. Chúng không phải bản voice tách riêng, cũng không đọc các câu thoại Việt trong fan game. Kịch bản Story vẫn dùng phụ đề; không gắn mẫu voice thành bản dịch chính xác của lời thoại.

Nhạc giảm âm lượng trong hội thoại hoặc khi phát voice. Âm thanh dừng/tắt theo trạng thái game và điều khiển người chơi. Có thanh âm lượng Nhạc / Hiệu ứng / Voice riêng.

Trình phát SoundCloud cần kết nối mạng. Nếu nó chưa tải hoặc bị trình duyệt chặn, nhịp giao tranh tổng hợp trong game sẽ thay thế. Hiệu ứng Yatta hiện dùng tiếng báo mừng và chữ/hoạt ảnh, chưa có bản thu riêng câu “Yatta” của HoS.

Quyền đối với âm thanh và nhân vật gốc thuộc các chủ sở hữu của Honkai Impact 3rd; game này là bản fan game cá nhân.
