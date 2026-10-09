# Tiến độ web game

Cập nhật: 08/10/2026.

## Đã hoàn thành

- Story đủ 7 chương.
- Endless độc lập với save Story.
- Event Bếp Lửa Thái Hư V3 đã nối vào menu game chính.
- Có build tĩnh riêng cho GitHub Pages bằng `npm run build`.
- Có local preview tại `localhost:4321`.
- Có hook chặn push thẳng `main`.
- Có Pull Request template và tài liệu quy trình.
- Build tự kiểm tra giới hạn website 1 GiB và giới hạn 100 MiB cho từng tệp GitHub.

## Chờ kết nối ngoài

- Chưa gắn GitHub remote; repository game phải tách khỏi Aurora Website.
- GitHub CLI trên máy đang mất phiên đăng nhập của tài khoản cũ.
- Chưa bật GitHub Pages vì repository online chưa được tạo.
- Chưa có URL GitHub Pages chính thức.

## Cần owner chốt

- GitHub owner/organization dùng cho game.
- Tên repository cuối cùng.
- Repository Public hay tài khoản GitHub có gói trả phí cho Pages private.

## Kiểm tra bắt buộc trước mỗi PR

1. `npm run build`
2. `npm run test:smoke`
3. Mở Story và Endless.
4. Mở Event, vào Gian 2 và quay về menu.
5. Sau khi merge, kiểm tra URL GitHub Pages trên desktop và mobile.
