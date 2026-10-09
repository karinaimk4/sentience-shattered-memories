# Tiến độ web game

Cập nhật: 09/10/2026.

## Đã hoàn thành

- Story đủ 7 chương.
- Endless độc lập với save Story.
- Event Bếp Lửa Thái Hư V3 đã nối vào menu game chính.
- Có build tĩnh riêng cho GitHub Pages bằng `npm run build`.
- Có local preview tại `localhost:4321`.
- Có hook chặn push thẳng `main`.
- Có Pull Request template và tài liệu quy trình.
- Build tự kiểm tra giới hạn website 1 GiB và giới hạn 100 MiB cho từng tệp GitHub.
- Repository public: `karinaimk4/sentience-shattered-memories`.
- Pull Request khởi tạo đã vượt kiểm tra và được merge vào `main`.
- GitHub Pages đã phát hành tại `https://karinaimk4.github.io/sentience-shattered-memories/`.

## Trạng thái phát hành

- Remote `origin` đã trỏ tới repository game riêng.
- GitHub CLI đang dùng tài khoản `karinaimk4`.
- GitHub Pages dùng nguồn GitHub Actions và HTTPS.
- Mỗi lần merge `main`, workflow tự build và phát hành lại game.

## Quy trình cho thay đổi tiếp theo

- Tạo nhánh `feat/`, `fix/`, `assets/` hoặc `docs/` từ `main` mới nhất.
- Chạy build và smoke test trước khi push.
- Mở Pull Request, chờ kiểm tra đạt và duyệt rồi mới merge.
- Không push thẳng vào `main`.

## Kiểm tra bắt buộc trước mỗi PR

1. `npm run build`
2. `npm run test:smoke`
3. Mở Story và Endless.
4. Mở Event, vào Gian 2 và quay về menu.
5. Sau khi merge, kiểm tra URL GitHub Pages trên desktop và mobile.
