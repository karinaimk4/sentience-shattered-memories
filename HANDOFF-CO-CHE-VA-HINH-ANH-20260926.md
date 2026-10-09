# Bàn giao cơ chế và hình ảnh sang task xây dựng Chương 1

## Chỉ đạo mới nhất của người dùng

Người dùng yêu cầu: “m gửi md cơ chế, hình ảnh này kia qua cho con xây dựng đi r build bên con xây dựng lun”. Task **Xây dựng lại gameplay Chương 1** chịu trách nhiệm ghép và build bản cuối. Task gửi dừng phát triển gameplay; không build song song. Tiếp tục trong folder đang làm của task nhận (`gameplay-v3-story`), không thay ngược bằng v2.

Hai task dùng chung workspace `D:/Câu cơm/AURORA/pj video/hos-pixel-runner/`, nên các đường dẫn dưới đây đã truy cập được trực tiếp, không cần tải hoặc yêu cầu người dùng gửi lại ảnh.

## Yêu cầu gameplay đã chốt trong hội thoại

- Story là platformer điều khiển chạy kiểu Mario kết hợp đánh quái: mở đầu có cốt truyện/hội thoại, chạy-nhảy khám phá, quái xuất hiện, giao chiến, hội thoại/phần thưởng/checkpoint rồi đi tiếp. Chương phải có nội dung và nhịp chơi đủ sâu, không chạy một đoạn ngắn là hết.
- Endless tự chạy với chuỗi thử thách đa dạng: lên khối, qua vực, trượt dưới cổng, đường trên/dưới, vàng, đổi cảnh và giao chiến. Tránh cách chơi chỉ giữ một nút là qua tất cả.
- Save mới bắt đầu Level 1, tiền/vật liệu bằng 0, không có vũ khí, Vết Thánh hay đồng hành. Từng hệ thống được giới thiệu và mở trong truyện. Không cho sẵn đồ rồi chỉ làm mờ UI.
- Fu Hua chỉ tham gia gameplay sau khi mở Song Hành: trước đó không chạy theo, không đánh hộ hoặc hưởng bonus Assist. UI, phím Q, nút cảm ứng và trạng thái save phải dùng cùng điều kiện mở. Fu Hua vẫn được nói chuyện trong cảnh truyện. Mốc 900 m là mốc bản v2 đã triển khai, không phải yêu cầu cứng của người dùng nếu bản truyện mới cần điều chỉnh hợp lý.
- Checkpoint phải nhìn thấy được, có thông báo đã lưu, chết trở về checkpoint và reload giữ đúng tiến trình. Không nhân đôi phần thưởng. Không xóa save cũ.
- Nhặt vàng trong màn để nâng nhân vật/vũ khí; có trang mặc trang bị và Vết Thánh thấp/cao. Chỉ đồ đã kiếm được mới được sử dụng.
- HoS có Kiếm/Thương/Xích. Đòn đánh phải dùng pose vũ khí thật từ sheet; không thay cây thương bằng một nét màu.
- Run/jump/slide/hurt/attack cần animation đúng động tác, giữ anchor và tỉ lệ. Trượt phải dùng pose cúi/trượt, tuyệt đối không bóp dẹp hình đứng.
- Tầm hố và vị trí platform phải theo physics; player cần nhìn rõ mép xuất phát/điểm đáp. Không dùng kích thước ảnh để tự quyết định gap width.
- Người dùng không cho xóa bản cũ. Thêm phiên bản/folder mới và giữ các thư mục dist/release/cũ cùng ảnh nguồn.
- Người dùng tự upload host: bàn giao folder web tĩnh và ZIP có index.html ở gốc; không tự đăng mạng.

## Các phản ánh đang được task nhận sửa

Cập nhật từ task nhận khi chuẩn bị bàn giao: lore gốc đầy đủ đã được tìm thấy tại `D:/HoS_Story_Bible/`; đọc tài liệu thực tế ở đó để chốt truyện, không suy diễn từ bản tóm tắt cũ. Người dùng yêu cầu quái bám wiki Honkai Impact 3rd, bỏ tạo hình xác ghép kinh dị; task nhận đang dùng mẫu Ranger/Deathly Doom chuyển chibi. Ưu tiên chỉ đạo mới này cho art quái. Link người dùng đã cung cấp: https://honkaiimpact3.fandom.com/wiki/Honkai_Beasts và https://honkaiimpact3.fandom.com/wiki/Memorial_Arena/Bosses .

Theo thông báo phối hợp mới nhất, người dùng phản ánh “không có cốt truyện, map y xì nhau, không có quái xuất hiện, sửa cho đàng hoàng”. Task nhận đang sửa trong `gameplay-v3-story`. Việc ghép terrain ở task gửi KHÔNG giải quyết hoặc xác nhận đã giải quyết các vấn đề này. Ưu tiên bản truyện đang sửa của task nhận.

## Bộ hình terrain mới — có sẵn trên đĩa

- Ảnh sử dụng: `assets/terrain-nagazora-v1/terrain-atlas-alpha-v1.png`.
- Bản ý tưởng giữ nguyên: `assets/terrain-nagazora-v1/terrain-concept-v1.png`.
- Prompt tạo và tách nền: `assets/terrain-nagazora-v1/README.md`.
- Bản copy runtime để tham khảo: `gameplay-v2-terrain/assets/terrain-nagazora-alpha-v1.png` (cùng ảnh sử dụng).

Ảnh 1536 × 1024 RGBA. Đã kiểm tra alpha bằng Pillow: 900.453 pixel alpha=0, các pixel còn lại có alpha mềm 1–254. Nền trống mẫu (0,0), (390,350) có alpha=0. Một số công cụ xem ảnh hiển thị cả RGB của vùng alpha=0 khiến trông như còn nền tối; phải kiểm tra compositing thật trên canvas. Chưa tuyên bố mọi viền mềm đã hoàn hảo. Không dùng raw/concept thay cho atlas alpha.

12 món theo thứ tự trái sang phải, trên xuống dưới: khối bê tông, khối nứt phá được, thùng đồ, bậc thang, sàn đá nổi, sàn máy di chuyển, rào chắn thấp, thanh trượt bên dưới, bờ trái vực, bờ phải vực, lòng vực, gai tinh thể.

## Source rectangles tham khảo

Đơn vị pixel nguồn, định dạng `[x, y, width, height]`. Đây là vùng thủ công của bản ghép đang làm, cần review hình trong bản cuối; không chia sheet đều vì bờ vực bắt đầu phía trên ranh hàng 3.

| ID | Source rect | Cách dùng |
|---|---|---|
| block | [68,109,208,195] | Mặt trước khối, bỏ phần đỉnh phối cảnh để mặt đứng trùng collider |
| breakable | [458,111,207,192] | Khối nứt phá được |
| crate | [837,108,200,192] | Thùng đồ, dự phòng |
| stairs | [1168,85,325,214] | Hình bậc tổng, dự phòng; không dùng với collider chữ nhật đơn |
| floating | [26,410,349,71] | Mặt sàn đá, crop gọn chiều dày |
| moving | [414,430,333,137] | Sàn máy |
| barricade | [815,419,282,184] | Rào chắn, dự phòng |
| gate | [1177,411,321,151] | Thanh trượt dưới; cân đối độ dày/hitbox trước khi chốt |
| pitLeft | [33,695,280,265] | Bờ bên trái, mép hở bên phải |
| pitRight | [460,695,282,269] | Bờ bên phải, mép hở bên trái |
| pitInterior | [841,650,230,325] | Lòng vực, clip trong đúng khoảng hố |
| crystals | [1153,766,365,191] | Gai nguy hiểm, dự phòng, cần collider riêng nếu đưa vào |

## Phần ghép thử đã có — CHƯA hoàn tất kiểm tra hình

Folder `gameplay-v2-terrain/` là bản sao độc lập của v2, không phải build cuối. Task gửi đã dừng theo yêu cầu người dùng.

Các file thay đổi đáng dùng lại:

1. `assets-manifest.json`: thêm khối `terrainArt` (atlas, size, sprites, notes). Chỉ lấy phần này, không ghi đè manifest đang phát triển của v3.
2. `gameplay-v2.js`: thêm `terrainAtlas`, preload ảnh vào Promise.all; hàm `terrainSprite` và `terrainBlock` (nine-slice giữ viền); nhánh art trong `terrainPiece`; thêm bờ trái/phải và lòng vực trong `drawGround`; bỏ icon loot đè lên khối nứt. Lấy các đoạn render tương ứng, không thay toàn bộ runtime v3.
3. `qa/terrain-review.html`: trang dev có iframe và các nút chạy input bot để review. Không đóng gói trang này vào bản chơi. Không có teleport/cấp HP/đồ, nhưng có tiến trình thử nghiệm trong localStorage origin cổng 4179.
4. `serve.cjs`: cổng thử 4179. Không cần dùng nếu v3 có server riêng.
5. `tools/package_build.py`: đã đổi tên ZIP thành `sentience-gameplay-v2-terrain-static.zip`, nhưng CHƯA chạy đóng gói bản ghép.

Các `build/`, ZIP v2 và báo cáo QA cũ được copy cùng folder là bản kế thừa, KHÔNG phải kết quả xác nhận của terrain mới. Đừng gửi chúng như bản cuối.

Hiện ghép art mới cho Nagazora/Arc City (biome 0–1), sàn moving dùng art máy; các biome khác vẫn dùng texture cũ. Bậc thang gameplay dựng từ nhiều block để giữ collision từng bậc. Chưa thêm collider mới cho rào/gai/thùng, nên những hình đó đang dự phòng; không được báo đã tích hợp cả 12 món vào gameplay.

## Kiểm thử đã chạy tại task gửi

- `node --check gameplay-v2.js`: PASS.
- `node tools/test-engine.mjs`: 11 nhóm PASS sau thay renderer; không sửa engine.js, level-chapter-1.json, endless-patterns.json hoặc physics.
- Mở trang review thật trong trình duyệt, preload thành công, input bot đi từ khởi đầu tới khoảng 70 m, HP 120, nhặt 36 vàng. Dừng theo yêu cầu người dùng trước khi kiểm tra toàn bộ hình ở các bậc/hố/cổng và trước khi hoàn thành Chương 1.
- CHƯA chạy full playthrough/regression/build smoke cho bản ghép. Không dùng số liệu 544,95 giây của bản v2 để tuyên bố terrain/v3 đã test xong.

## Nhân vật, vũ khí, quái, map đã có

Giữ pipeline sạch của bản Chương 1: `gameplay-v2/assets/characters-alpha.png`, manifest 109 frame và animation manifest, hoặc các bản kế thừa được task nhận cập nhật trong v3. Bản v2 có 15 sheet đã xử lý. Thương/Xích là 4+3 pose, Kiếm là 3+2+2+2+3, jump 4 pose; không quay lại chia grid đều sai. Frame anchor chung [112,156], cell 256×176. Tham khảo `gameplay-v2/ASSET-AUDIT.md`, `assets-manifest.json`, `animation-manifest.json`.

Các map/transition/nhân vật nguồn nằm trong `assets/`; map manifest `assets/maps-manifest.json`. Tận dụng các cảnh và chuyển cảnh đã có khi xử lý phản ánh map giống nhau. Giữ nguyên ảnh nguồn, làm các bản runtime riêng.

## Bàn giao build cho người dùng tại task nhận

Task nhận tích hợp phần art phù hợp vào bản truyện đang sửa, review hình alpha và mặt đứng/mép hố, chạy kiểm thử tương ứng, rồi build folder tĩnh và ZIP mới ngay tại task nhận. Báo rõ địa chỉ chơi, đường dẫn ZIP và phạm vi nội dung hoàn thành. Giữ các bản cũ; không cần chuyển lại cho task gửi để build lần nữa.
