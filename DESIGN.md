# Bản đồ thiết kế và kiến trúc

## Sản phẩm

`Sentience: Shattered Memories` là fan game HTML5/Canvas với ba mode trên cùng menu:

- **Story**: bảy chương, save theo hành trình.
- **Endless**: lượt chơi độc lập, không ghi đè tiến trình Story.
- **Event - Bếp Lửa Thái Hư**: game quản lý nhà hàng Canvas có hai gian, nhân viên, gacha, KTX và nội thất.

## Cấu trúc nguồn

- `gameplay-v4/index.html`: menu và entry Story/Endless.
- `gameplay-v4/gameplay-v2.js`: runtime chính.
- `gameplay-v4/event-v3.html`: entry Event.
- `gameplay-v4/event-v3-greybox.js`: runtime Event Canvas.
- `gameplay-v4/assets/`: toàn bộ assets chạy thật.
- `gameplay-v4/data/`: map Event.
- `gameplay-v4/docs/`: cơ chế, lore và tài liệu nghiệm thu.
- `scripts/build-web-game.mjs`: đóng gói nguồn chạy thật vào `web-dist/` cho GitHub Pages.

## Luật giao diện

- Giữ phong cách pixel/chibi HI3 và nhận diện từng nhân vật.
- Không thay ảnh nhân vật bằng ký hiệu hoặc khối placeholder trong bản duyệt.
- Chữ quản lý phải đọc được ở màn hình 1280px; không dùng chữ 7-8px cho nội dung chính.
- Event dùng Canvas cho Rush Hour, lưới ô, A*, y-sort và job board.

## Luật dữ liệu

- Story và Endless tách save; test phải xác nhận Endless không ghi đè Story.
- Event có trạng thái riêng, không sửa khóa save Story.
- Không thay số cân bằng chưa có trong tài liệu bằng số tự đặt mà không ghi rõ là test.

## Luật phát hành

- Source of truth là `gameplay-v4/`, không phải `web-dist/`.
- `web-dist/` luôn được tạo lại bằng `npm run build` và không commit.
- GitHub Pages phát hành static assets từ `web-dist/` thông qua GitHub Actions.
