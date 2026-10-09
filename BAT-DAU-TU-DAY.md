# Bắt đầu từ đây - Web game Sentience

Web game này dùng quy trình giống Aurora Website nhưng ở **GitHub repository riêng**.

## Ba nơi, ba việc

| Nơi | Làm gì |
| --- | --- |
| Máy bạn | Sửa `gameplay-v4/`, chạy `npm run dev`, xem ở `localhost:4321` |
| GitHub game | Lưu code, mở Pull Request, owner duyệt và Merge |
| GitHub Pages | GitHub Actions kiểm tra Pull Request; merge `main` thì tự cập nhật link chơi |

## Chạy trên máy

```powershell
npm install
npm run dev
```

Mở `http://127.0.0.1:4321/`. Dừng bằng `Ctrl + C`.

Kiểm tra trước khi đẩy:

```powershell
npm run build
npm run test:smoke
```

## Quy trình mỗi lần sửa

```powershell
git fetch origin
git switch -c feat/ten-viec origin/main

# sửa và test
npm run dev
npm run build
npm run test:smoke

git add -A
git commit -m "feat: mo ta ngan viec vua lam"
git push -u origin feat/ten-viec
gh pr create --fill
```

Không push thẳng `main`. Hook trong `.githooks/pre-push` sẽ chặn thao tác đó.

## Nối GitHub riêng cho game

Repository phải khác `Aurora-education/aurora-website`. Tên đề xuất:

`<github-owner>/sentience-shattered-memories`

Sau khi đăng nhập đúng tài khoản GitHub:

```powershell
gh auth login
gh repo create <github-owner>/sentience-shattered-memories --public --source .
git remote -v
```

Lần đầu repository còn rỗng, tạo commit khởi tạo rồi mới đẩy `main`. Đây là lần duy nhất được phép bỏ qua hook. Từ lần sau bắt buộc dùng nhánh và Pull Request.

## Bật GitHub Pages

Repository nên để **Public** nếu dùng GitHub Free. Workflow `.github/workflows/pages.yml` đã có sẵn và sẽ tự build.

Sau khi merge Pull Request đầu tiên:

1. GitHub repository → **Settings** → **Pages**.
2. Ở **Build and deployment**, chọn nguồn **GitHub Actions** nếu GitHub chưa tự chọn.
3. Mở tab **Actions** và chờ workflow `Build and deploy web game` hoàn tất.
4. Link chơi có dạng `https://<github-owner>.github.io/sentience-shattered-memories/`.

## Xong khi

- Push nhánh → Pull Request tự build kiểm tra.
- Merge vào `main` → GitHub Pages cập nhật link chơi.
- Push thẳng `main` → hook chặn.
- Story, Endless và Event đều chạy trên link GitHub Pages.
