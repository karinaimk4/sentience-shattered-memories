# Sentience: Shattered Memories — Story Chương 1–7

### Event Mode · Bếp Lửa Thái Hư V3 · 06/10/2026

Bản chơi chính `build-assets-v4/` có ba lối vào ở menu: Story, Endless và **Bếp Lửa Thái Hư · Event**. Nút Event mở `event-v3.html` ngay trong cùng bản build; nút **Về menu game** quay về Story/Endless. Event dùng Canvas Rush, bản đồ hai gian quán, nhân viên tự nhận việc, nâng cấp từng gian, trang trí và bàn di chuyển/cất kho, gacha nhân sự và KTX. Bộ ảnh nằm ở `assets/event-v3/`, dữ liệu map ở `data/restaurant-lv1.json` và `data/restaurant-lv2.json`.

Mở bản chơi: `http://127.0.0.1:4192/build-assets-v4/`. Mở kiểm thử đủ tài nguyên Gian 2: `http://127.0.0.1:4192/build-assets-v4/event-v3.html?test=full`. Smoke test tích hợp: `node tools/test-event-v3-main-build.cjs`.

### Story update · 02/10/2026 · Chương cuối

Chương 7 — **Gốc Cây Tưởng Tượng** — đã chơi được trọn tuyến. Map có Rễ Cây Khả Năng, Nhánh Ký Ức, Dòng Thời Gian Hoàn Hảo, Tầng Hiệu Đính và Ngai Mnemosyne; sáu Bàn thờ Ký ức làm mạnh cả Senti lẫn Phù Hoa. Ba side story gồm **Bữa Cơm Khét Lẹt**, **Ảo Cảnh Nghịch Đảo — Bát Nước Đã Đổ** và **Lời Cám Dỗ Ngược**, mỗi tuyến có minigame, vật chứng, art và thẻ Album riêng.

Mnemosyne có ba phase và mười một bài kiểm tra: phản mảnh đúng màu, phá lăng kính theo vũ khí, sống sót mưa dữ liệu, né trễ nửa phách, đổi vũ khí giữa combo, tìm giọng nói thật, Dual Combo phá Ultimate giả, phản quyền, dùng Xích cắt neo giữ Phù Hoa, Force Assist ở ngưỡng nguy hiểm và phá ba vết nứt. Thanh Cảm Xúc có **Fake Ending** cần chém vỡ UI; sau đó người chơi điều khiển Phù Hoa tiến lên kéo Senti khỏi tự xóa và hoàn thành Ultimate QTE năm nhịp. Kết thúc chính mở Endless cùng vật liệu rèn bậc cuối; đủ 7 ký ức chính và 14 ký ức ẩn sẽ mở Ký ức #0 cùng kết thúc bí mật. Xem `docs/CHAPTER-7.md`.

### Story update · 02/10/2026

Chương 6 — **Hai đường, một điểm đến** — đã chơi được trọn tuyến. Người chơi luân phiên điều khiển Senti trong Biển Lượng Tử và Phù Hoa tại Kolosten; Assist bị ngắt khi hai người còn tách rời và trở lại ở cảnh tái hợp. Hai side story có vật chứng pixel riêng. Bão sét có vùng báo trước. Jizo Mitama dùng bốn turn với Thiên Lôi, Vạn Kiếm, Địa Hỏa và lính triệu hồi: né mỗi loại hai lần để bóc giáp ảo, dụ sét nạp ba cột trước khi gọi Phù Hoa, phản Giao Kiếm rồi dùng Xích kéo ba lõi, cuối cùng vượt ba chu kỳ giáp có thứ tự vũ khí khác nhau và cửa sổ sát thương giới hạn. Sáu Bản khắc Lãng Quên nằm trên đường, hai bản còn lại ở side story; hạ Jizo mở công thức Keys of Oblivion. Xem `docs/CHAPTER-6.md`.

### Story update · 30/09/2026

Chương 3 được mở rộng bằng hai side story có đội hộ vệ riêng và ba arena phối hợp nhiều loại quái. Chương 4 — Babylon — mở Xích Nhận, có bão tuyết, bẫy băng, hai side story và Parvati hai mạng. Chương 5 — Mount Taixuan — mở Dual Combo, có đường thật/giả, quyền kình môi trường, hai side story và Hư Ảnh Fu Hua hai mạng. Xem `docs/CHAPTER-3.md` và `docs/CHAPTER-4-5.md`.

### Story update · 28/09/2026

Chương 2 — **Thành phố không ngủ, ký ức không dừng** — chơi tiếp ngay sau khi hạ Nagazora Husk. Fu Hua chạy cùng trên mái Arc City, qua phố neon bị lặp, Heliopolis và nóc tàu Schicksal. Năm cảnh cốt truyện bắt buộc dẫn dần tới bí mật Helheim; giữa chương nhận Thương để đánh quái bay. Glitch Chariot có hai mạng, ba trụ cấp khiên phải giải bằng Kiếm/Lướt/Thương trước khi phá giáp và phản lao vào lõi. Hai mảnh ẩn #3–4, lời thoại, checkpoint, Yatta và kết Chương 2 đều lưu theo từng Hành trình. Xem `docs/CHAPTER-2.md`.

### Story update · 27/09/2026

- Nagazora Husk có **hai mạng với hai thanh máu đầy riêng**. Sau mạng đầu, boss tích nộ, gọi hộ vệ và dùng chuỗi đòn nhanh hơn; Fu Hua lao vào với hoạt ảnh riêng và hỗ trợ bằng đấm, quét, chưởng ở mạng hai. Năm kiểu chiêu có báo trước và khoảng hở phản công. K phản lao hoặc tia, L né, Space vượt sóng, S cúi dưới tia quét.
- Story có ba vùng mưa đá dài hơn với hai điểm rơi mỗi đợt, hai vùng bão tuyết, năm khe dung nham có hoạt ảnh sôi, bốn miệng phun hơi nóng và chín bình hồi 25% HP. Bình không biến mất khi đang đầy máu. Chướng ngại ngừng chạy trong hội thoại/tạm dừng.
- Sửa 29 vị trí vàng xuyên khối hoặc nằm dưới sàn quá thấp. Giữ ID vàng để tương thích save cũ.
- Các lần nhận trang bị có đoạn ký ức riêng. Attila M/B phải tìm bản thiết kế; CAS-II Namiko cần thêm 4 Cuộn mạch riêng từ thùng phụ tùng. Bàn rèn hiển thị công thức 4★/5★ dùng mảnh riêng theo từng vũ khí, còn viên gạch là vật phẩm đặc biệt cho chương sau. Hình nguyên liệu và tiến độ ở `docs/FORGE-PROGRESSION.md`.
- Nút **Hành trình · Tạo mới / Chọn phiên** tạo các lượt Story độc lập. Có thể đổi tên, chuyển phiên, giữ ba ô lưu thủ công riêng từng phiên. Bản v4 cũ được giữ thành “Hành trình đầu tiên”.
- Senti gọi Fu Hua là **Old Timer**; toàn bộ đại từ cũ được chuẩn hóa thành “cô ấy”, kể cả trong nhật ký save cũ.
- Ngoài trận dùng nhạc từ website HI3 chính thức; khi vào boss, bảng nhạc phát HoS Trailer từ SoundCloud theo liên kết người chơi đưa. Nếu stream không phát, game dùng nhịp chiến đấu tổng hợp sẵn. Sau mỗi boss Story, HoS nhảy “YATTA!” với hai tay giơ và giấy màu. Ba thanh âm lượng riêng; mẫu voice/hiệu ứng chiến đấu lấy từ clip kỹ năng HoS và Azure Empyrea. Nguồn ở `docs/AUDIO-SOURCES.md`.

Fan game HTML5/Canvas. Bản này chơi được đủ **7 chương Story** và **Endless độc lập**. Endless trao nguyên liệu ngẫu nhiên theo mốc quãng đường; sau khi hoàn thành các chương tương ứng, pool có thêm Ấn quyết Taixuan, Bản khắc Lãng Quên, Lăng kính Ý Thức, Phù văn Cục Gạch và Ấn Đỏ Mực để rèn trang bị 4★–5★.

## Chơi

Phục vụ thư mục `build` qua HTTP bằng bất kỳ static server nào. Mở `index.html` trực tiếp bằng file:// sẽ không tải được các tệp dữ liệu. Bản xem trước trên máy phát triển: http://127.0.0.1:4181/build/.

**Thử Glitch Chariot ngay:** bấm “THỬ BOSS CHƯƠNG 2” ở màn hình chính, hoặc mở `http://127.0.0.1:4181/build/?boss-demo=1`. Demo đưa người chơi thẳng vào lời dẫn trước boss với Kiếm và Thương, đánh lại từ đầu trận khi thua, và không ghi đè bất kỳ phiên Story nào. Sau khi thắng, về màn hình chính để chơi tiếp save thật.

A/D: đi; Space: nhảy; S: trượt; J: đánh; K: phản đòn; L: né/dash; E: tương tác; 1/2: Kiếm/Thương sau khi mở; R: kỹ năng CAS-II Namiko khi đã trang bị; Enter: hiện hết/tiếp hội thoại; Tab: nhật ký; Esc: tạm dừng. Có nút cảm ứng. Chương 1 mở Kiếm, Chương 2 mở Thương; Endless cho dùng tạm cả ba hình thái.

## Nội dung đã làm

- Mở đầu có dàn cảnh: quái không nhận ra Senti, cô chạm khối ký ức mới có thể chiến đấu. Nhặt kiếm bằng E.
- Nagazora có 53 bố cục địa hình, sáu khu vực, mái sập, bẫy, đạn, giao tranh và truy đuổi. Giữ các map đẹp của bản bàn giao.
- Điều tra dấu vết bằng E, lời thoại theo địa điểm, vòng lặp Fu Hua, phá nút ký ức, hai ký ức ẩn và cảnh kết Chương 1 theo tài liệu lore.
- Chương 2 có năm đoạn bối cảnh khác nhau từ Arc City tới tàu Schicksal, bản đồ/đồ họa gốc được giữ, thời tiết và bẫy mới, Fu Hua hoạt ảnh chạy cùng, quái bay, hai mảnh ẩn, năm cảnh truyện bắt buộc và Glitch Chariot hai mạng với ba trụ cấp khiên, lính phụ, tia, xích, cú đáp và phản lao.
- Chương 3 đi qua Helheim Labs và sân bay Schicksal, có bể ký ức xanh/đỏ, đường tách, cơ chế phá kính/ống/tường theo đúng vũ khí, hai side story, đội hình quái khó hơn, mở Fu Hua Assist và Heimdall hai mạng.
- Chương 4 đi qua Siberia và Babylon Labs, mở Xích Nhận, có máy chiếu ký ức, băng nhọn, hai side story và Parvati hai mạng với giáp băng, cú lăn cần Xích chặn cùng lính phụ.
- Chương 5 đi qua Mount Taixuan thật/giả, mở Dual Combo, có quyền kình môi trường, hai side story và Hư Ảnh Fu Hua hai mạng; mạng đầu bắt buộc phá thế thủ rồi phản quyền, mạng hai dùng Dual Combo kết liễu.
- Chương 6 đổi góc nhìn giữa Senti và Phù Hoa, có Biển Lượng Tử, bão sét Kolosten, hai side story, vật chứng riêng, tám Bản khắc Lãng Quên và Jizo bốn turn với giáp ảo ba chu kỳ.
- Chương 7 đi xuyên Imaginary Tree, có sáu Bàn thờ Ký ức, ba side story tương tác, năm Nhật ký Báo lỗi, tượng người thân bị đóng băng, Mnemosyne ba phase, Fake Ending, cảnh `TIẾN LÊN`, Ultimate QTE, kết thúc chính và kết thúc bí mật Ký ức #0.
- Trang chuẩn bị: nhân vật, một vũ khí Gauntlets, ba ô T/M/B, nâng cấp/đột phá, kỹ năng, bốn preset, ba ô lưu và xuất/nhập save. Bàn rèn tách riêng Vũ khí và Vết Thánh; Attila, Dirac, Shattered Swords và Pericles có công thức T/M/B theo tiến độ chương.
- Tên vũ khí/Vết Thánh đối chiếu wiki; hình vẽ lại trong `assets/wiki-redraws`. Bộ ảnh bàn giao vẫn còn nguyên trong `assets/original-library`.
- Endless đổi cảnh, tăng độ khó và cho chọn nâng cấp mỗi 30 giây. Chỉ kỷ lục được lưu; không ghi đè tiến trình hoặc vật phẩm Story.

## Phạm vi và chuyển thể

Đây là bản 2D chuyển thể, không mô phỏng đầy đủ combat HI3. Chưa có SP, hệ đội ba người, Herrscher burst đầy đủ, lồng tiếng toàn bộ hội thoại hay phim cắt cảnh dựng riêng. Armored Bracers, CAS-II Namiko, Attila và Marco Polo có thể nhận/rèn trong Story Chương 1–2; trang bị cao cấp có hình/mô tả tham khảo nhưng bị khóa. Chỉ số theo cấp, giá nâng cấp và nơi nhận thuộc fan game. Xem `docs/WIKI-EQUIPMENT.md` để biết nguồn và khác biệt.

Save v4 tự chuyển các ID trang bị cũ đã sở hữu sang danh mục mới, không tự tặng món chưa nhận. Có bản lưu dự phòng; không xóa bản game v3.

## Kiểm tra / đóng gói

- `node tools/test-systems.mjs`: sở hữu, nâng cấp, set theo combo, CRT, preset, nhập save và địa hình.
- `node tools/test-expansion.mjs`: vị trí vàng, thời tiết, bình HP, nguyên liệu rèn, phiên lưu độc lập, ngưỡng chuyển giai đoạn và khiên boss.
- `node tools/test-forge-ui.cjs`: mảnh riêng Namiko, chuyển save cũ, rèn thật trong UI và khóa vũ khí chương sau.
- `node tools/test-boss-tactics.cjs`: chỉ chém thất bại; chơi né/nhảy/phản đòn thắng cả hai mạng, đủ năm kỹ năng và bốn lính.
- `node tools/capture-boss-polish.cjs`: chụp Fu Hua lao vào, tung đòn hỗ trợ và các hiệu ứng boss.
- `node tools/test-journeys-audio.cjs`: tạo/chuyển/tải lại phiên, tách ô lưu thủ công, giải mã sáu mẫu âm thanh và phát nhạc/hiệu ứng.
- `node tools/test-weather-route.cjs`: chơi qua tuyến môi trường và chụp từng loại chướng ngại.
- `node tools/test-v4.cjs`: đi hết Story bằng điều khiển, kiểm tra arena/nút ký ức/phần thưởng.
- `node tools/test-chapter-2-route.cjs`: đi hết Chương 2 qua cả năm cảnh, nhặt Thương và hai ký ức ẩn, hạ Glitch Chariot, kiểm tra phần thưởng và checkpoint cuối.
- `node tools/test-chapter-3-route.cjs`: đi hết Helheim, hoàn thành hai side story, phá ba vật cản đúng vũ khí, mở Assist, vượt bốn arena và hạ cả hai mạng Heimdall.
- `node tools/test-chapter-4-5-route.cjs`: đi hết Babylon và Taixuan, hoàn thành bốn side story, kiểm tra Xích/Dual Combo và hai boss hai mạng.
- `node tools/test-chapter-6-route.cjs`: đi hết hai tuyến Senti/Phù Hoa, hoàn thành hai side story, gom đủ tám Bản khắc, hạ Jizo qua bốn turn, ba chu kỳ giáp ảo và mở Keys of Oblivion.
- `node tools/test-chapter-7-route.cjs`: đi hết Imaginary Tree, kích hoạt sáu Bàn thờ, hoàn thành ba side story, vượt đủ ba phase Mnemosyne, phá Fake Ending, hoàn thành Ultimate QTE và kiểm tra phần thưởng cuối game.
- `node tools/test-chariot.cjs`: chạy riêng trận boss từ checkpoint trước cửa để kiểm tra ba lớp giáp và chuyển Kiếm phản lao.
- `node tools/test-battle-music-yatta.cjs`: nhạc boss và tư thế Yatta sau trận đầu.
- `node tools/test-narrative.cjs`: hai ký ức ẩn, cứu Fu Hua và cảnh kết.
- `node tools/test-ui-modes.cjs`: trang bị, preset, ô lưu, màn hình nhỏ, Endless và cách ly save.
- `python tools/package_build.py`: xuất `build/` và `sentience-v4-story-endless-static.zip`, loại API QA.
- `node tools/smoke-build.cjs`: mở bản phát hành, điều khiển thật để nhặt kiếm và kiểm tra mọi tệp tải được.
- `node tools/smoke-chapter-2-build.cjs`: dùng save hoàn thành Chương 1 để mở Arc City trong bản phát hành.
- `node tools/smoke-chapter-7-build.cjs`: dùng save hoàn thành Chương 6 để mở Imaginary Tree trong bản phát hành và xác nhận không còn QA hook.

Các kiểm tra trình duyệt dùng máy chủ port 4181 và Microsoft Edge. Hình/chỉ số kiểm tra ở `qa/`. Tài liệu lore gốc ở `docs/`.
