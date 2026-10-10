# Sentience: Shattered Memories

Web game gồm Story Mode, Endless Mode và event **Bếp Lửa Thái Hư**. Repository này tách riêng khỏi Aurora Website và được phát hành bằng GitHub Pages.

Hướng dẫn đầy đủ cho người vận hành: [Sổ tay web game và Pull Request](docs/SO-TAY-WEB-GAME-VA-PULL-REQUEST.md).

## Quy trình bắt buộc khi bổ sung hoặc sửa game

Mọi thay đổi, dù nhỏ, đều phải đi theo luồng:

`main → nhánh riêng → Pull Request → kiểm tra → duyệt → merge main → GitHub Pages cập nhật`

Không sửa và không push thẳng vào `main`.

### 1. Lấy bản mới nhất

```powershell
git switch main
git pull origin main
```

### 2. Tạo nhánh mới

Chọn tiền tố đúng loại công việc:

- `feat/ten-tinh-nang`: thêm tính năng hoặc nội dung.
- `fix/ten-loi`: sửa lỗi.
- `assets/ten-bo-asset`: thêm hoặc thay asset.
- `docs/ten-tai-lieu`: chỉ sửa tài liệu.

Ví dụ:

```powershell
git switch -c feat/them-nhan-vien-moi
```

### 3. Sửa đúng nguồn

- Game đang chạy: `gameplay-v4/`
- Cơ chế Event ưu tiên: `gameplay-v4/docs/EVENT-BEP-LUA-V3-CO-CHE-CHO-GPT.md`
- Asset brief Event: `gameplay-v4/docs/EVENT-BEP-LUA-V3-ASSET-BRIEF.md`
- Không sửa trực tiếp `web-dist/`; đây là thư mục build tự sinh.
- Không xóa file hoặc thay asset cũ nếu chưa được duyệt.

### 4. Chạy thử trước khi đưa lên GitHub

```powershell
npm install
npm run build
npm run test:smoke
```

Phải kiểm tra được Story, Endless, Event, chuyển gian trong nhà hàng và quay lại menu chính.

### 5. Commit và đẩy nhánh

```powershell
git add -A
git commit -m "feat: mô tả ngắn phần vừa làm"
git push -u origin feat/them-nhan-vien-moi
```

Hook `.githooks/pre-push` sẽ chặn push thẳng vào `main`.

### 6. Tạo Pull Request

```powershell
gh pr create --fill
```

Trong Pull Request phải ghi:

- Đã thay đổi gì.
- Đã kiểm tra màn nào.
- Có thay đổi asset, save data hoặc cân bằng game không.
- Ảnh/video kiểm tra nếu thay đổi giao diện.

Chỉ merge khi phần kiểm tra tự động đã đạt và người duyệt đồng ý.

### 7. Sau khi merge

Workflow `.github/workflows/pages.yml` tự build và phát hành bản mới lên GitHub Pages. Mở tab **Actions** để xem trạng thái, sau đó kiểm tra lại link chơi trên desktop và mobile.

## Quy tắc an toàn

- Không dùng `git push --force` trên nhánh dùng chung.
- Không đưa mật khẩu, token hoặc file `.env` lên GitHub.
- Không commit `web-dist/`, `node_modules/`, video QA hoặc gói build cũ.
- Giữ mỗi Pull Request tập trung vào một nhóm thay đổi để dễ duyệt và hoàn tác.

## Lệnh chạy local

```powershell
npm run dev
```

Mở `http://127.0.0.1:4321/` để chơi bản trên máy.

