# Luật làm việc - Sentience Web Game

Đây là repository riêng của web game **Sentience: Shattered Memories**. Không dùng remote hoặc repository của `Aurora-education/aurora-website`.

## Bắt đầu mỗi phiên

1. Đọc `BAT-DAU-TU-DAY.md`, `DESIGN.md` và `docs/PROGRESS.md`.
2. Chạy `git status`, `git branch --show-current` và `git remote -v`.
3. Luôn `git fetch origin`, rồi tạo nhánh mới từ `origin/main`.

## Luật Git

- Một việc = một nhánh = một Pull Request.
- Không push thẳng `main`; owner là người duyệt và bấm Merge.
- Nhánh dùng `feat/`, `fix/`, `content/` hoặc `docs/`.
- Không tự xóa hay ghi đè thay đổi chưa commit của người dùng.
- Không commit `web-dist/`, QA screenshots, video demo, ZIP hoặc các build cũ.

## Nguồn và build

- Nguồn đang phát triển: `gameplay-v4/`.
- Story, Endless và Event phải cùng tồn tại; không được sửa một mode bằng cách làm hỏng mode khác.
- `npm run build` tạo bản GitHub Pages tại `web-dist/`.
- `npm run dev` build rồi chạy `http://127.0.0.1:4321/`.
- `npm run test:smoke` kiểm tra Story, Endless, Event, nút về menu và assets.
- Tổng website phải nhỏ hơn 1 GiB và không tệp Git nào vượt 100 MiB.

## Triển khai

- GitHub Actions chạy `.github/workflows/pages.yml`.
- Pull Request chỉ build để kiểm tra; không phát hành.
- Merge vào `main` sẽ build và deploy GitHub Pages.
- Repository phải Public nếu dùng GitHub Free và muốn mọi người mở link chơi.
- Chỉ Merge PR sau khi bản local và smoke test đã kiểm tra xong.
