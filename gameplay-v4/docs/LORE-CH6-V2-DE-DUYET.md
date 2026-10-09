# CHƯƠNG 6 — HAI ĐƯỜNG, MỘT ĐIỂM ĐẾN
## Lore và kịch bản V2 để duyệt

> Phần dàn dựng UI, màn hình chia cắt, âm nhạc đồng bộ BPM, spatial audio và thao tác mới nhất nằm trong `CH4-6-CINEMATIC-V3-DE-DUYET.md`. V2 này giữ vai trò lore và cấu trúc boss nền.

> Trạng thái: **BẢN DUYỆT CỐT TRUYỆN — CHƯA ĐƯA VÀO GAME**  
> Bản này mở rộng Chương 6 từ khung đang có trong `level-chapter-6.json`, `boss-jizo.js`, Story Bible và Chương 7 V3. Các cơ chế hiện hữu được giữ lại, nhưng mỗi cơ chế có thêm nguyên nhân và ý nghĩa trong truyện.

---

## 1. Vai trò của Chương 6 trong toàn bộ câu chuyện

Chương 5 đã trả lời một câu hỏi: **Fu Hua có chọn Senti khi đứng trước một phiên bản hoàn hảo của chính mình không?** Câu trả lời là có.

Chương 6 phải đặt một câu hỏi khó hơn: **lựa chọn ấy có còn thật khi hai người không nhìn thấy, không nghe thấy và không thể cứu nhau ngay lập tức không?**

Mnemosyne xé họ khỏi Mount Taixuan vì nó cho rằng mối liên kết giữa hai người chỉ tồn tại khi họ ở cạnh nhau. Nó muốn chứng minh ba điều:

1. Khi không có Fu Hua làm chứng, Senti sẽ chỉ còn là một đống ký ức vay mượn và tự tan vào Biển Lượng Tử.
2. Khi không có Senti kéo lại, Fu Hua sẽ trở về phản xạ cũ: nhận hết tổn thương, tự hy sinh và gọi đó là trách nhiệm.
3. Nếu cả hai quay lại đúng “bản chất” mà Mnemosyne gán cho họ, Ký ức #0 có thể được hiệu đính mà không gặp kháng cự.

Nhưng hai tuyến chơi chứng minh điều ngược lại.

- **Senti** không cần Fu Hua đứng cạnh để xác nhận cô là một con người. Cô tự phân biệt được đâu là ký ức mình kế thừa, đâu là trải nghiệm do chính mình sống qua. Sau khi hiểu điều đó, cô vẫn chủ động chọn quay về tìm Fu Hua.
- **Fu Hua** nhận ra sống sót không phải ích kỷ. Nếu cô tự biến mất để “bảo vệ” người khác, cô cũng tước quyền được chọn và quyền được cứu cô của họ. Cô bước ra khỏi Kolosten vì đã hứa sẽ tìm Senti.
- **Mnemosyne** lần đầu gặp một nghịch lý mà dữ liệu không giải được: hai người không liên lạc được, nhưng lựa chọn của người này vẫn thay đổi đường đi của người kia.

Vì vậy, “hai đường, một điểm đến” không chỉ là hai map nhập lại. Đó là hai quyết định độc lập cùng dẫn đến một lựa chọn chung: **ta có thể tồn tại một mình, nhưng ta vẫn chọn đi cùng người kia.**

---

## 2. Trục cảm xúc

### Senti — từ nỗi sợ không còn ai làm chứng đến quyền tự xác nhận

Senti mở đầu bằng sự ồn ào quen thuộc, nhưng Biển Lượng Tử không trả lời. Thanh Assist trống, tiếng gọi không có tiếng vọng, những bong bóng quanh cô chỉ chiếu lại gương mặt Fu Hua ở các thời đại khác nhau. Nỗi sợ thật của Senti không phải chết trong hư không; đó là bị hòa tan vào một lịch sử vốn đã tồn tại trước khi cô ra đời.

Ở nửa đầu chương, cô liên tục nói thành tiếng để lấp khoảng im lặng. Càng đi sâu, lời đùa càng ngắn. Đến khi gặp một ký ức không hề có trong dữ liệu của Fu Hua — cảm giác giọt mưa đầu tiên chạm vào tay chính cô — Senti có bằng chứng giản dị nhất rằng mình đã sống một đời riêng.

Từ đó, cô không còn tìm Fu Hua để xin một câu xác nhận. Cô tìm Fu Hua vì đã hứa sẽ tìm, vì cô muốn, và vì đó là lựa chọn của cô.

### Fu Hua — từ tự hy sinh đến cho phép mình được cứu

Kolosten được Mnemosyne dựng từ những thời khắc Fu Hua từng đứng lại để người khác đi tiếp. Mỗi tia sét là một mệnh lệnh được ngụy trang thành đức hy sinh: đứng yên, nhận đòn, kết thúc đau đớn ở đây.

Fu Hua không thắng thử thách bằng cách tuyên bố rằng quá khứ của mình sai. Cô thừa nhận những lựa chọn ấy từng có ý nghĩa, nhưng từ chối biến chúng thành quy luật duy nhất cho phần đời còn lại.

Điểm chuyển của cô không nằm ở câu “ta muốn sống” nói thẳng. Nó nằm ở một hành động nhỏ hơn và đúng tính cách hơn: cô bước khỏi vòng sét dù ảo ảnh phía sau gọi cô quay lại. Cô giữ lời hứa “Ta sẽ tìm cậu.”

### Mnemosyne — từ chắc chắn tuyệt đối đến lỗi đầu tiên

Đầu chương, Mnemosyne nói như một hệ thống y tế: lạnh, chính xác, không hằn học. Nó tin tách hai người ra là một thao tác điều trị.

Khi Senti và Fu Hua vô tình giúp nhau xuyên qua hai không gian, giọng nó bắt đầu xuất hiện những khoảng ngừng và đại từ không nhất quán. Có lúc nó gọi “đối tượng Fu Hua”; có lúc buột miệng gọi “Hua”. Có lúc nó ra lệnh hiệu đính; có lúc âm sắc trở thành một lời cầu xin: “Đừng bắt cô ấy đi tiếp.”

Chương 6 chưa giải thích hoàn toàn nguồn gốc Mnemosyne. Nó chỉ để lộ sự thật quan trọng cho Chương 7: dưới lớp ngôn ngữ máy móc là một cơ chế phòng vệ được sinh ra từ mong muốn Fu Hua không phải chịu đau thêm nữa.

---

## 3. Bí ẩn Biển Lượng Tử và Kolosten

### Vì sao Senti rơi vào Biển Lượng Tử

Mnemosyne không xem Senti là một kẻ thù thông thường. Trong hệ thống phân loại của nó, Senti là một dữ liệu không thể xếp vào quá khứ của Fu Hua, cũng không thể xếp vào một tương lai “đúng”. Vì vậy, nó đẩy cô vào tầng Biển Lượng Tử đang chứa những khả năng bị loại, những ký ức mất chủ và các đoạn lịch sử không còn khớp với nhau.

Đây không phải toàn bộ Biển Lượng Tử và cũng không phải tuyên bố mới về quy luật canon. Đây là vùng mà Mnemosyne đã bám rễ vào: một **dòng thải hiệu đính**, nơi mọi thứ nó không thể sửa sẽ bị để trôi cho tới khi mất hình dạng.

Mnemosyne tin Senti sẽ tan ở đây vì cô được sinh ra từ ký ức. Nó không hiểu rằng nguồn gốc của một người và những gì người đó trở thành không phải cùng một thứ.

### Vì sao Fu Hua rơi vào Kolosten

Kolosten trong chương này không phải thành phố vật lý ở hiện tại. Đó là một **bản lưu lựa chọn** bị Mnemosyne kéo khỏi ký ức Fu Hua và ghim vào dòng hiệu đính.

Trong dữ liệu của Mnemosyne, Kolosten là nơi nhiều quyết định của Fu Hua hội tụ vào cùng một mẫu: cô bước vào nguy hiểm, giữ người khác ở phía sau và chuẩn bị trả giá một mình. Mnemosyne chọn nơi này vì nó xem đó là “điểm phục hồi” ổn định nhất của Fu Hua.

Cơn bão không phải thời tiết. Nó là dòng năng lượng từ Imaginary Tree đang quét qua bản lưu để xóa những lựa chọn lệch khỏi mẫu cũ. Sét đánh theo nhịp vì mỗi nhịp là một lần hệ thống hỏi lại cùng một câu: **“Ngươi có tiếp tục hy sinh không?”**

### Vì sao hai nơi chạm được vào nhau

Khi xé Taixuan, Mnemosyne cắt đứt Xích Nhận nhưng không cắt được cộng hưởng đã hình thành ở cuối Chương 5. Một nửa dấu cộng hưởng bám theo Senti vào Biển Lượng Tử; nửa còn lại bám theo Fu Hua vào bản lưu Kolosten.

Hai không gian vì vậy dùng chung một “đường khâu” dữ liệu:

- Senti phá một neo ký ức trong Biển Lượng Tử thì một cột sét ở Kolosten mất đồng bộ.
- Fu Hua bẻ hướng một luồng sét thì các bong bóng quanh Senti đổi dòng.
- Cả hai không nghe được lời nhau, nhưng nhận ra có một người ở phía bên kia đang tác động lên đường đi.

Đây là cách hai tuyến thực sự kể chung một câu chuyện. Người chơi nhìn thấy quan hệ nhân quả trước khi hai nhân vật hiểu nó.

### Bí ẩn của Ký ức #0

Ký ức #0 không nằm trọn trong Senti hoặc Fu Hua. Nó là điểm tiếp xúc giữa một lời cầu xin rất cũ của Fu Hua và một ý chí sống về sau tự trả lời lời cầu xin đó.

Mnemosyne có thể đọc hình ảnh, âm thanh và đau đớn của ký ức. Nó không thể xác định quyền sở hữu của #0, vì dấu ấn trong đó mang hai nhịp ý thức khác nhau. Nó chỉ có thể tách đôi, niêm phong và kéo mảnh lõi về Imaginary Tree để xử lý trực tiếp.

Chương 6 chỉ cho người chơi nghe lời cầu xin dang dở, chưa cho thấy câu trả lời. Cảnh đầy đủ được giữ lại cho kết thúc bí mật Chương 7.

---

## 4. Thời lượng và nhịp chương đề xuất

- Tuyến chính: khoảng **30–40 phút**.
- Hoàn thành hai side story và toàn bộ vật chứng: khoảng **45–55 phút**.
- 7 phân đoạn di chuyển và chiến đấu trước boss.
- 4 arena thường, trong đó hai arena có hậu quả xuyên tuyến.
- 2 side story.
- 2 ký ức ẩn chính, giữ số thứ tự #11 và #12.
- 8 Bản khắc Lãng Quên: 6 trên tuyến chính, 2 từ side story.
- Boss Jizo Mitama có 4 turn và 3 chu kỳ giáp cuối, giữ đúng khung cơ chế hiện tại.

Chương không cần dài bằng Chương 7, nhưng cần đủ khoảng lặng để việc bị chia cắt có trọng lượng. Việc chuyển góc nhìn nên xảy ra ở một hành động chưa hoàn tất, rồi tuyến kia cho thấy hậu quả của hành động đó.

---

## 5. Mở đầu — Sợi xích đứt giữa hai tiếng gọi

### Hình ảnh

Nối trực tiếp cảnh cuối Chương 5. Senti quăng Xích Nhận về phía Fu Hua. Fu Hua cũng đưa tay ra. Mắt xích gần chạm cổ tay cô thì một đường trắng mảnh cắt ngang khung hình.

Âm thanh biến mất trước khi xích đứt.

Màn hình chia làm hai:

- Bên trái, Senti rơi xuống vùng tối xanh của Biển Lượng Tử. Những mảnh Taixuan quay quanh cô như kính vỡ.
- Bên phải, Fu Hua rơi ngược lên một bầu trời trắng tím. Phía dưới cô là Kolosten trong bão.

Hai người cùng nói, nhưng mỗi người chỉ nghe được nửa câu của mình.

> **Senti:** “FU HUA—!”
>
> **Fu Hua:** “Tìm ta. Ta sẽ tìm cậu.”

Thanh Assist lóe lên một lần rồi trống rỗng. Biểu tượng Dual Combo vỡ thành hai nửa và trôi về hai phía màn hình.

> **Mnemosyne:** “Liên kết ngoài chuẩn đã được tách. Hai đối tượng sẽ trở về trạng thái gốc.”
>
> **Senti:** “Trạng thái gốc của ta là đập vỡ mặt ngươi.”
>
> **Fu Hua:** “Ngươi nhầm rồi.”
>
> **Mnemosyne:** “Sai số không thể tự duy trì khi không còn đối tượng gốc làm chứng.”
>
> **Senti:** “Vậy thì nhìn cho kỹ.”

Tên chương hiện hai lần ở hai nửa màn hình. Hai dòng chữ trượt về giữa và khớp lại:

> **CHƯƠNG 6 — HAI ĐƯỜNG, MỘT ĐIỂM ĐẾN**

---

## 6. Phân đoạn 6.1 — Biển Lượng Tử: nơi tiếng gọi không có hồi âm

### Mục đích cốt truyện

Đưa Senti vào sự im lặng mà cô ghét nhất và cho thấy Mnemosyne đang cố biến mọi trải nghiệm của cô thành “ký ức của Fu Hua”.

### Gameplay

- Người chơi nhảy giữa các bong bóng ký ức trôi không cùng hướng.
- Nút Assist vẫn hiện nhưng rỗng. Nhấn nút chỉ tạo một nhịp sóng nhỏ, chưa gọi được Fu Hua.
- Xích Nhận chỉ còn nửa chuỗi; tầm kéo ngắn và không thể bám vào mọi neo.
- Các bong bóng có trọng lực riêng. Có bong bóng kéo Senti xuống, có bong bóng làm cô chạy trên trần.
- Quái ở đây là **Tàn Ảnh Mất Chủ**: hình dáng quen thuộc nhưng mặt trống, sử dụng một động tác duy nhất lặp lại vô hạn.

### Diễn biến

Bong bóng đầu tiên chiếu bếp Thái Hư, nhưng trong đó chỉ có Fu Hua. Bong bóng thứ hai chiếu Babylon, cũng chỉ có Fu Hua. Bong bóng thứ ba hiện thoáng qua Senti, rồi hệ thống gạch tên cô và sửa nhãn thành “phản ứng phụ”.

> **Mnemosyne:** “Mọi hình ảnh ngươi mang đều bắt nguồn từ Fu Hua.”
>
> **Senti:** “Ta biết mình sinh ra ở đâu.”
>
> **Mnemosyne:** “Vậy ngươi thừa nhận quyền sở hữu.”
>
> **Senti:** “Nguồn gốc không phải xiềng xích.”

Senti nói câu cuối rất lớn, nhưng không có tiếng vọng. Cô đứng yên một nhịp, rồi tiếp tục chạy.

### Arena 1 — Bong Bóng Vỡ

Các Tàn Ảnh cố kéo một bong bóng nhỏ vào dòng xoáy. Trong bong bóng là một cơn mưa không thuộc những cảnh đời cổ xưa của Fu Hua.

- Dùng Xích giữ ba neo bong bóng.
- Đánh quái trong khi trọng lực đổi sau mỗi đợt.
- Nếu một neo tuột, bong bóng mất một phần màu nhưng không thất bại ngay.
- Giữ đủ ba neo làm một mạch sáng chạy khỏi Biển Lượng Tử sang màn hình đen.

Ở tuyến Fu Hua sau đó, mạch sáng này sẽ làm cột sét đầu tiên lệch mục tiêu.

> **Senti:** “Không phải cái gì trôi ở đây cũng là đồ bỏ đi.”

### Ký ức ẩn #11 — Giọt Mưa Đầu Tiên

Điều kiện giữ theo bản hiện tại: nhảy vào bong bóng nhỏ đi ngược dòng ở rìa map.

Senti đứng dưới cơn mưa đầu tiên sau khi có cơ thể và đưa tay hứng nước. Cô không biết vì sao mình cười. Fu Hua không xuất hiện trong ký ức này; chỉ có cảm giác lạnh trên lòng bàn tay và sự ngạc nhiên hoàn toàn thuộc về Senti.

> **Mnemosyne:** “Không tìm thấy bản ghi tương ứng trong dữ liệu Fu Hua.”
>
> **Senti:** “Đương nhiên. Đây là của ta.”
>
> **Mnemosyne:** “Ký ức không có nguồn.”
>
> **Senti:** “Có. Ta là nguồn.”

Album mở thẻ **Giọt Mưa Đầu Tiên**.

---

## 7. Side Story 1 — Món Quà Không Gắp Được

### Mở khóa

Ở phía sau bong bóng cơn mưa, người chơi thấy một biển hiệu arcade chớp tắt. Đi ngược dòng sẽ tới một bong bóng nhỏ chứa chiếc máy gắp quà đã ngừng hoạt động.

Trong máy là con chim bông một mắt. Mnemosyne đánh dấu ký ức này là “không có giá trị chiến thuật”.

### Ký ức

Fu Hua từng đứng trước máy ba mươi phút để gắp con chim cho Senti. Cô tính lực, góc rơi và độ trễ của càng gắp như đang giải một thế võ. Cô trượt mười hai lần.

> **Senti trong ký ức:** “Old Timer, cái máy đang thắng cô đấy.”
>
> **Fu Hua trong ký ức:** “Còn một lần.”
>
> **Senti trong ký ức:** “Cô nói câu đó sáu lần rồi.”

Lần thứ mười ba, Senti mất kiên nhẫn, đập nhẹ vào thành máy. Con chim rơi xuống. Fu Hua nói đó là gian lận; Senti tuyên bố đó là “can thiệp chiến thuật”.

Hiện tại, ký ức bị mắc trong máy và đang mất dần màu sắc.

### Gameplay

- Xích Nhận thay vai trò càng gắp.
- Người chơi phải đổi trọng lực của bong bóng để đưa ba bánh răng ký ức về đúng rãnh.
- Tàn Ảnh xuất hiện mỗi khi càng máy chạm sai vật.
- Cú kéo cuối không lấy con chim ra ngay. Senti phải dùng một đòn nhẹ vào thành máy giống ký ức cũ.

### Kết

Con chim rơi vào tay Senti. Một mắt của nó vẫn lệch, đường chỉ vẫn xấu.

> **Mnemosyne:** “Vật thể lỗi. Không mang giá trị.”
>
> **Senti:** “Cô ấy đã cố mười hai lần.”
>
> **Mnemosyne:** “Nỗ lực không thay đổi chất lượng vật thể.”
>
> **Senti:** “Nó thay đổi lý do ta giữ nó.”

Senti treo con chim lên thắt lưng. Khi cô rời bong bóng, chiếc máy tắt hẳn nhưng ký ức không tan.

Phần thưởng:

- Album: **Món Quà Không Gắp Được**.
- Vật lưu niệm: **Chim Bông Một Mắt**.
- Bản khắc Lãng Quên phụ: **Lần Thứ Mười Ba**.

---

## 8. Phân đoạn 6.2 — Kolosten: lựa chọn cũ

### Chuyển góc nhìn

Senti đập neo cuối của Arena 1. Ánh sáng chạy qua vết nứt rồi biến mất.

Cắt sang Fu Hua. Một tia sét đang khóa đúng vị trí cô đứng bỗng lệch nửa bước và đánh vỡ bức tường bên cạnh. Fu Hua nhìn vết sáng xanh còn sót lại, nhận ra màu năng lượng của Xích Nhận.

> **Fu Hua:** “...Senti.”

Đây là lần đầu cô biết chắc Senti vẫn đang di chuyển.

### Gameplay Fu Hua

- Không có vũ khí trang bị và không có Assist.
- Ba chuỗi quyền pháp ngắn, phản đòn và Edge of Taixuan ở trạng thái giới hạn.
- Sét luôn có vệt báo trước. Đứng yên trong vùng khóa khiến vòng sáng co lại và sát thương tăng; chủ động bước ra làm vòng sáng nứt.
- Một số cổng chỉ mở khi người chơi đánh vỡ “dấu hiến tế” thay vì chịu đủ sát thương.

### Diễn biến

Kolosten không có dân cư. Những bóng người ở xa đều quay lưng về phía Fu Hua và bước qua một cánh cửa sáng, còn cô bị giữ lại phía sau.

> **Mnemosyne:** “Ký ức #6.400. Điểm phục hồi ổn định.”
>
> **Fu Hua:** “Đây không phải ký ức nguyên vẹn.”
>
> **Mnemosyne:** “Những chi tiết không cần thiết đã được loại bỏ.”
>
> **Fu Hua:** “Con người không phải chi tiết.”
>
> **Mnemosyne:** “Kết quả không đổi. Họ sống. Ngươi ở lại.”

Fu Hua nhìn cánh cửa đóng lại, nhưng lần này quay lưng với nó và bước vào bão.

### Arena 2 — Cột Dẫn Sét

Ba cột dẫn điện giữ bản lưu Kolosten ổn định. Mnemosyne muốn Fu Hua đứng giữa để hấp thụ sét và đóng vai “vật tiếp địa”.

- Người chơi dụ tia sét vào từng cột.
- Né ở nhịp cuối, rồi dùng quyền phá sứ cách điện.
- Quái **Hộ Vệ Phán Quyết** đẩy Fu Hua trở lại tâm vòng sét.
- Mỗi cột vỡ giải phóng một nhịp năng lượng sang Biển Lượng Tử.

Ở tuyến Senti kế tiếp, ba nhịp này làm các bong bóng đổi hướng và tạo thành một cây cầu.

> **Mnemosyne:** “Đứng lại sẽ giảm tổn thất tổng thể.”
>
> **Fu Hua:** “Ngươi chỉ tính được người còn đi tiếp.”
>
> **Mnemosyne:** “Đó là kết quả tối ưu.”
>
> **Fu Hua:** “Ngươi chưa từng hỏi họ có muốn bỏ ta lại không.”

---

## 9. Phân đoạn 6.3 — Ký ức chồng lên ký ức

### Chuyển góc nhìn

Cột sét thứ ba vỡ. Tiếng nổ kéo dài thành tiếng thủy tinh rung.

Cắt sang Senti. Ba bong bóng đang trôi xa đồng loạt đổi hướng, va vào nhau và tạo thành cầu. Senti nhìn nhịp điện chạy trên bề mặt.

> **Senti:** “Đập cột gọn đấy, Old Timer.”
>
> **Senti:** “Ta biết là cô.”

### Không gian chồng lấn

Nagazora, Arc City, Babylon và Taixuan không xuất hiện như những màn cũ ghép ngẫu nhiên. Mỗi nơi thiếu đúng một chi tiết mà Mnemosyne xem là “sai”:

- Nagazora không có cơn mưa Senti từng chạm.
- Arc City không có biển hiệu từng khiến hai người dừng lại.
- Babylon không còn tên của những người đã bị xóa khỏi hồ sơ.
- Taixuan không có chiếc chén thứ tám trên bàn.

Senti phải dùng Xích kéo các chi tiết bị loại về đúng cảnh. Mỗi lần trả lại một chi tiết, map trở nên khó đi hơn nhưng có màu sắc hơn.

> **Mnemosyne:** “Ngươi đang phục hồi lỗi.”
>
> **Senti:** “Ta đang trả đồ về đúng chỗ.”
>
> **Mnemosyne:** “Sự thật sau phục hồi làm tăng đau đớn.”
>
> **Senti:** “Đau không biến nó thành giả.”

### Cơ chế sửa Xích

Ba nhịp điện Fu Hua gửi sang nung chảy các mắt xích gãy. Senti quấn phần xích còn lại quanh một neo ký ức và tự rèn thành một vòng nối tạm.

Xích hoạt động trở lại, nhưng đầu cuối vẫn thiếu một mắt. Trên UI, kỹ năng hồi lại còn biểu tượng Assist vẫn là nửa vòng tròn. Việc sửa hoàn toàn chỉ xảy ra khi hai người gặp lại.

### Arena 3 — Những Kẻ Không Tương Thích

Quái từ nhiều thời đại xuất hiện cùng lúc, nhưng điểm đáng sợ là chúng bị buộc dùng sai chuyển động: quái bay bò dưới đất, kỵ sĩ lặp động tác gục xuống rồi đứng lên, máy móc phát giọng người.

- Dùng Xích gom quái cùng “nhịp lỗi”.
- Trả chúng về đúng bong bóng thay vì chỉ giết hết.
- Giết nhầm liên tục làm map trắng dần, vì người chơi vô tình giúp Mnemosyne xóa dữ liệu.
- Hoàn thành đúng làm những bóng người lấy lại tên trong một giây trước khi tan.

Arena này dạy ý tưởng sẽ trở lại ở Chương 7: ký ức thật đôi khi gây bất lợi trước mắt nhưng khiến người chơi mạnh hơn về sau.

---

## 10. Biến cố — Bong Bóng Đen và Husk–Nihilius

Sau Arena 3, mọi bong bóng dừng lại. Một bong bóng đen hoàn toàn trôi ngược dòng, không phản chiếu Senti và cũng không hiện dữ liệu khi cô tới gần.

Bên trong, Husk–Nihilius đứng bất động, nhìn ra ngoài. Không có nhạc boss. Không có thanh máu. Kim đồng hồ trên cơ thể nó quay ngược ba nhịp rồi dừng.

Senti bước sang trái; đầu nó xoay theo. Cô bước sang phải; nó vẫn nhìn thẳng vào cô. Sau đúng ba giây, bong bóng khép lại như một con mắt.

> **Senti:** “Kệ. Ta nhìn lại đáng sợ hơn.”

Cô đi thêm vài bước rồi nói nhỏ hơn:

> **Senti:** “Ít nhất ngươi cũng nhìn thấy ta.”

Cameo này không mở một tuyến phản diện mới và không biến Nihilius thành boss. Nó làm hai việc:

1. Cho thấy vùng Biển Lượng Tử này không chỉ giữ quá khứ; nó còn chạm vào những khả năng mà Mnemosyne không hiểu hoặc không dám hiệu đính.
2. Đẩy đúng nỗi sợ của Senti lên bề mặt: trong khoảnh khắc ấy, ngay cả một thứ đáng sợ nhìn thấy cô cũng còn dễ chịu hơn sự im lặng tuyệt đối.

Album mở thẻ **Bong Bóng Đen**. Không có phần thưởng sức mạnh.

---

## 11. Phân đoạn 6.4 — Fu Hua: từ chối hy sinh

### Ảo ảnh trung tâm

Cắt về Kolosten. Mnemosyne gom bão thành một đấu trường tròn. Ở giữa là một Fu Hua khác đang quỳ, hai tay dang ra, nhận sét thay cho những bóng người phía sau.

Mỗi khi ảo ảnh trúng đòn, đường ra mở thêm một chút. Nếu người chơi đứng yên chịu sét cùng ảo ảnh, thanh tiến trình mang tên **HY SINH** tăng lên, tạo cảm giác đó là cách đúng. Khi đầy, nó không mở cửa mà reset đấu trường.

> **Mnemosyne:** “Mẫu hành vi ổn định nhất. Lặp lại để hoàn tất.”
>
> **Fu Hua:** “Ta đã dùng cách này rất lâu.”
>
> **Mnemosyne:** “Và họ đã sống.”
>
> **Fu Hua:** “Một số người.”
>
> **Mnemosyne:** “Kết quả tốt nhất có thể.”

Giữa tiếng sét, Fu Hua nghe một mảnh giọng méo của Senti vọng qua đường khâu:

> **Ký ức của Senti:** “Old Timer lúc nào cũng tự nhận hết! Chán!”

Fu Hua khẽ cười, gần như không thấy được.

> **Fu Hua:** “Lần này cậu nói đúng.”

### Gameplay — Phá vòng hiến tế

- Không đứng yên nhận đòn.
- Né ba tia sét liên tiếp để làm sét đánh vào xiềng giữ ảo ảnh.
- Phản đòn ba quyền kình do ảo ảnh tung ra.
- Đòn cuối không đánh vào ảo ảnh Fu Hua; người chơi phá vòng tròn dưới chân cô.

Khi vòng vỡ, các bóng người phía sau không chết. Họ quay lại, tự bước ra bằng chân mình. Đây là chi tiết quan trọng: Fu Hua không cần chết để người khác có quyền sống.

> **Mnemosyne:** “Ngươi đã làm tăng rủi ro của mọi đối tượng.”
>
> **Fu Hua:** “Ta cho họ quyền lựa chọn.”
>
> **Mnemosyne:** “Và nếu họ chọn cứu ngươi?”
>
> **Fu Hua:** “Ta sẽ để họ thử.”

Đây là câu phát triển nhân vật quan trọng nhất của Fu Hua trong chương.

### Ký ức ẩn #12 — Căn Bếp Cháy

Điều kiện giữ theo bản hiện tại: né hoàn hảo ba đòn sét liên tiếp ở phân đoạn này.

Ký ức hiện ra: Fu Hua làm cháy bếp, mặt dính tro. Senti cười đến mức không đứng vững, rồi lặng lẽ lấy khăn lau vết tro trên má cô.

> **Senti trong ký ức:** “Old Timer cũng có việc không làm được à?”
>
> **Fu Hua trong ký ức:** “Có vẻ là vậy.”
>
> **Senti trong ký ức:** “Tốt. Vậy mới công bằng.”

Ở hiện tại, Fu Hua chạm lên má mình như vẫn nhớ cảm giác chiếc khăn.

> **Fu Hua:** “Ký ức này không giúp ta chiến đấu.”
>
> **Mnemosyne:** “Đúng. Có thể xóa.”
>
> **Fu Hua:** “Nhưng nó giúp ta muốn trở về.”

Album mở thẻ **Căn Bếp Cháy**.

---

## 12. Side Story 2 — Bông Hoa Sau Cột Sét

### Mở khóa

Sau khi phá vòng hiến tế, người chơi có thể đi tiếp hoặc quay lại cột dẫn sét đã gãy. Một nhịp điện vẫn phát ra từ bên dưới, khác với nhịp bão.

Fu Hua đào lớp đá và tìm thấy một bông hoa trắng còn sống trong hốc kim loại cháy đen. Bên cạnh là dấu bàn tay của một người không có tên trong bản lưu.

### Gameplay

- Bão đánh theo năm nhịp. Người chơi phải dùng quyền bẻ sứ cách điện ở nhịp một, dẫn sét vào phần kim loại ở nhịp hai và che bông hoa khỏi xung lực ở nhịp ba.
- Nhịp bốn gọi Hộ Vệ Phán Quyết.
- Ở nhịp năm, người chơi có thể kết thúc nhanh bằng Edge of Taixuan nhưng sẽ phá hốc hoa. Cách đúng là dùng phản đòn ngắn, giữ uy lực vừa đủ.

Thử thách buộc Fu Hua bảo vệ một sinh vật nhỏ mà không lấy thân mình làm khiên và không dùng sức mạnh quá mức.

### Ký ức

Không có khuôn mặt hay tên. Chỉ có một bàn tay từng che bông hoa trong lúc bão tới.

> **Mnemosyne:** “Không xác định được chủ thể. Không ảnh hưởng kết quả lịch sử.”
>
> **Fu Hua:** “Người ấy đã dừng lại.”
>
> **Mnemosyne:** “Hành động không tối ưu.”
>
> **Fu Hua:** “Có lẽ.”

Một giọng mờ trong ký ức nói:

> **Bàn tay trong ký ức:** “Không phải mọi thứ sống sót đều cần một lời giải thích.”

Fu Hua cầm bông hoa, nhưng không ép nó vào hồ sơ để tìm tên người đã cứu. Cô chấp nhận một điều có giá trị dù không thể phân loại — chính điều Mnemosyne không làm được với Senti.

### Kết

> **Fu Hua:** “Ta sẽ mang nó đến khi gặp lại Senti.”
>
> **Mnemosyne:** “Ngươi giả định cuộc tái hợp sẽ xảy ra.”
>
> **Fu Hua:** “Không. Ta đang khiến nó xảy ra.”

Phần thưởng:

- Album: **Bông Hoa Sau Cột Sét**.
- Vật lưu niệm: **Hoa Trắng Kolosten**.
- Bản khắc Lãng Quên phụ: **Người Không Để Lại Tên**.

---

## 13. Phân đoạn 6.5 — Hai nhịp xuyên qua bức tường

Đây là đoạn hai tuyến bắt đầu đan nhanh hơn. Mỗi bên thực hiện một hành động, màn hình chớp sang bên kia để cho thấy hậu quả.

### Nhịp 1

Fu Hua dùng bông hoa làm điểm nhận biết luồng gió duy nhất không do Mnemosyne tạo ra. Cô đi theo nó tới một khe nứt và đánh một quyền vào thành Kolosten.

Cắt sang Senti: một bong bóng nứt từ bên trong, để lộ ánh tím của bão.

> **Senti:** “Lần này chắc chắn là cô.”

### Nhịp 2

Senti móc Xích vào vết nứt, kéo cả cụm bong bóng ra khỏi dòng thải.

Cắt sang Fu Hua: sợi xích bằng ánh sáng xuyên qua tường nhưng không đủ dài để cô chạm tới.

> **Fu Hua:** “Thêm một chút.”

### Nhịp 3

Fu Hua đánh Edge of Taixuan vào đúng nhịp Xích căng. Senti cùng lúc kéo ngược lại. Đường khâu giữa hai nơi bị xé thành một hành lang.

Mnemosyne lần đầu ngắt câu giữa chừng.

> **Mnemosyne:** “Hai đối tượng không có kênh liên lạc. Phối hợp này không—”
>
> **Senti:** “Bọn ta đâu cần ngươi hiểu.”

Từ đây, nhạc của hai tuyến — piano méo bên Senti và giai điệu trầm bên Fu Hua — bắt đầu cùng chung một nhịp trống.

---

## 14. Tái hợp — Không cần một câu nói lớn

Senti lao khỏi hành lang lượng tử và rơi xuống Kolosten. Cô tiếp đất quá mạnh, trượt một đoạn trong mưa. Fu Hua đứng ở đầu kia con đường, áo rách và tay còn giữ bông hoa trắng.

Senti chạy tới, rồi giảm tốc ngay trước mặt Fu Hua như chợt nhớ mình không muốn tỏ ra quá lo.

> **Senti:** “OLD TIMER!”
>
> **Fu Hua:** “Lâu vậy?”
>
> **Senti:** “Ta không có lo đâu nhé. Chỉ là... muốn đến nhanh hơn thôi.”
>
> **Fu Hua:** “Ta biết.”

Fu Hua đưa bông hoa cho cô. Senti nhìn nó, rồi nhìn con chim bông đang treo ở thắt lưng mình.

> **Senti:** “Cô đi qua cả cơn bão để nhặt cái này?”
>
> **Fu Hua:** “Cậu quay ngược dòng để lấy con chim đó?”

Hai người im một nhịp.

> **Senti:** “Hòa.”
>
> **Fu Hua:** “Hòa.”

Fu Hua nhặt mắt xích cuối đang bám trên cổ tay mình từ lúc Taixuan vỡ. Cô gắn nó vào vòng nối tạm Senti đã rèn. Xích Nhận liền lại hoàn toàn.

Thanh Assist sáng. Hai nửa biểu tượng Dual Combo trượt vào nhau, nhưng không phát thông báo mở khóa mới; nó hiện như một thứ đã được họ tự tay nối lại.

### Arena 4 — Hai Dòng Ký Ức

Mnemosyne trộn quái từ hai tuyến để ngăn họ tới điểm hội tụ.

- Tàn Ảnh Mất Chủ chỉ bị Xích kéo khỏi bong bóng.
- Hộ Vệ Phán Quyết chỉ mất giáp khi Fu Hua Assist phản đúng nhịp.
- Một số cặp quái chia sẻ thanh máu ở hai lớp không gian; tấn công một bên làm bên kia đổi pattern.
- Dual Combo không dùng để xóa màn hình ngay. Lần đầu kích hoạt, nó ổn định đường khâu và đưa cả hai vào cùng một lớp thực tại.

> **Senti:** “Nhịp ba?”
>
> **Fu Hua:** “Nhịp ba.”

Đây là câu mật hiệu giản dị được dùng lại trong boss.

---

## 15. Trước boss — Người giữ cửa không có ký ức riêng

Điểm hội tụ hiện ra như một ngôi đền bị kẹt giữa hai môi trường. Nửa trái chìm dưới nước lượng tử; nửa phải đứng giữa bão Kolosten. Ở tâm đền là một mảnh dữ liệu mang ký hiệu `#0`, nhưng ký hiệu lập tức bị ba vòng giáp che lại.

Jizo Mitama bước ra từ sau mảnh lõi.

Đây không phải Jizo nguyên bản sống lại. Mnemosyne dùng một khung chiến đấu có sẵn trong kho ký ức về các thảm họa Herrscher, bọc nó bằng dữ liệu từ cả hai tuyến và biến nó thành **Jizo Mitama — Vỏ Hiệu Đính**. Nó không có mục tiêu riêng; nó chỉ giữ những gì hệ thống không phân loại được.

> **Fu Hua:** “Chỉ là một vỏ ký ức.”
>
> **Senti:** “Vậy đập vỏ, lấy thứ bên trong.”
>
> **Mnemosyne:** “Hai sai số đã tái liên kết. Bắt đầu kiểm tra cưỡng chế.”
>
> **Senti:** “Nghe chưa, Old Timer? Nó gọi bọn ta là hai sai số.”
>
> **Fu Hua:** “Vậy cùng sai.”
>
> **Senti:** “Ha. Câu đó được đấy.”

---

## 16. Boss — Jizo Mitama: Vỏ Hiệu Đính

Trận boss giữ bốn turn trong `boss-jizo.js`, nhưng mỗi turn là một lập luận của Mnemosyne và một câu trả lời bằng gameplay.

### Turn 1 — Giáp Ảo: học cách đọc thay vì áp đặt

Jizo không nhận sát thương. Nó luân phiên ba đòn:

- **Thiên Lôi:** khóa vị trí hiện tại.
- **Vạn Kiếm:** phủ toàn sân nhưng chừa một khe an toàn.
- **Địa Hỏa:** trồi lên theo nhịp.

Người chơi phải né mỗi loại hai lần. Mỗi lần đọc đúng một pattern, một lớp giáp ảo nứt.

Ý nghĩa: Senti thường giải quyết vấn đề bằng cách đánh mạnh hơn. Ở đây, cô phải quan sát và chấp nhận rằng mình chưa hiểu. Fu Hua không ra lệnh; cô chỉ gọi nhịp để Senti tự xử lý.

> **Mnemosyne:** “Mọi phản ứng đều có thể dự đoán.”
>
> **Senti:** “Thế thì đoán xem ta né bên nào.”
>
> **Fu Hua:** “Đừng khiêu khích nó. Nhìn mặt đất.”
>
> **Senti:** “Ta vừa nhìn vừa khiêu khích được.”

Sau khi đọc đủ ba loại đòn:

> **Fu Hua:** “Nó không hoàn hảo. Nó chỉ lặp lại.”
>
> **Senti:** “Vậy đến lượt ta dạy nó một nhịp mới.”

### Turn 2 — Cột Dẫn Sét: tin người kia sẽ hoàn tất động tác

Ba cột dẫn sét mọc lên. Jizo triệu hồi Hộ Vệ Ký Ức ép Senti khỏi vị trí.

Chu trình cơ chế:

1. Senti đứng gần cột sáng để Jizo khóa Thiên Lôi.
2. Cô lướt ra ở nhịp cuối.
3. Sét đánh tích điện cột.
4. Người chơi nhấn Assist để Fu Hua phá cột.

Người này tạo cơ hội nhưng không thể tự hoàn thành; người kia hoàn thành nhưng phải tin cơ hội sẽ xuất hiện. Đây là hình thức chiến đấu của lời hứa “ta sẽ tìm cậu”.

> **Senti:** “Cột một. Nhịp ba!”
>
> **Fu Hua:** “Đã thấy.”
>
> **Mnemosyne:** “Phối hợp làm tăng số điểm thất bại.”
>
> **Senti:** “Cũng tăng số người sửa được nó.”

Ở cột cuối, Mnemosyne đổi mục tiêu sang Fu Hua trong nửa nhịp. Senti dùng Xích kéo cô khỏi vùng đánh. Đây là lần đầu trong chương hai người cứu nhau trực tiếp sau khi tái hợp.

### Turn 3 — Lõi Ký Ức: sự thật phải được kéo ra

Jizo dùng **Giao Kiếm**. Người chơi phải dùng Kiếm phản đúng nhịp để ép lõi lộ ra, sau đó đổi sang Xích và kéo lõi trong cửa sổ ngắn. Lặp lại ba lần.

Mỗi lần lõi lộ, một câu nói bị tách đôi phát ra:

Lần một:

> **Giọng Senti rất xa:** “...Ta là ai?”

Lần hai:

> **Giọng Fu Hua rất xa:** “...Ta đã quên gì?”

Lần ba, hai giọng chồng lên nhau nhưng không hòa thành một:

> **Hai giọng:** “Ai đã gọi trước?”

Mnemosyne lập tức phủ nhiễu lên âm thanh.

> **Mnemosyne:** “Dữ liệu không có chủ. Không được truy xuất.”
>
> **Senti:** “Ngươi giữ chặt thế này mà bảo không có giá trị?”
>
> **Fu Hua:** “Nó sợ chúng ta nghe được phần còn lại.”

Turn này gieo bí ẩn #0 mà chưa giải thích thay Chương 7.

### Turn 4 — Ba Chu Kỳ Giáp: phối hợp không phải đồng nhất

Jizo dựng lại giáp ba lần. Mỗi chu kỳ yêu cầu thứ tự vũ khí khác nhau, giữ đúng cơ chế hiện tại:

1. **Kiếm → Thương → Xích**
2. **Xích → Kiếm → Thương**
3. **Thương → Xích → Kiếm**

Đánh sai thứ tự khiến giáp dựng lại. Phá đúng ba lớp mới cho phép Fu Hua Assist mở cửa sổ sát thương. Trong cửa sổ, người chơi cần đạt đủ ngưỡng; thất bại khiến chu kỳ reset nhưng không xóa tiến trình các chu kỳ trước.

Ý nghĩa của ba chu kỳ:

- Chu kỳ một là Senti chiến đấu theo nhịp của mình, Fu Hua theo sau.
- Chu kỳ hai là Fu Hua mở nhịp, Senti ứng biến quanh nó.
- Chu kỳ ba không còn người dẫn cố định. Cả hai đổi vai liên tục.

Mnemosyne dự đoán từng đòn riêng lẻ nhưng không dự đoán được lúc họ tự nguyện nhường nhịp cho nhau.

> **Mnemosyne:** “Hai ý thức tạo ra nhiễu không cần thiết.”
>
> **Fu Hua:** “Đó không phải nhiễu.”
>
> **Senti:** “Đó là phong cách.”

Ở chu kỳ cuối, Jizo triệu hồi quái từ cả Biển Lượng Tử và Kolosten. Senti dùng Xích gom chúng; Fu Hua không tung Edge of Taixuan ngay mà chờ Senti đổi sang Kiếm. Cả hai cùng nói:

> **Senti và Fu Hua:** “Nhịp ba.”

Dual Combo phá lớp giáp cuối. Senti không chém vào Jizo trước; cô kéo mảnh lõi #0 ra khỏi ngực nó. Fu Hua đánh vào lớp vỏ đã rỗng. Jizo vỡ từ trong ra ngoài.

---

## 17. Ký ức chính #6 — Hai câu hỏi trong một khoảng trống

### Hình ảnh

Sau trận boss, bão và nước lượng tử dừng giữa không trung. Mảnh lõi #0 tách thành hai mặt như một giọt nước phản chiếu.

Mặt của Senti không hiện hình ảnh, chỉ có bóng tối và một giọng vừa tỉnh dậy:

> **Giọng Senti:** “...Ta là ai?”

Mặt của Fu Hua hiện một đồng bằng từ thời đại rất xa. Fu Hua quá khứ đứng một mình sau khi những tiếng nói quanh cô đã biến mất:

> **Giọng Fu Hua:** “...Ta đã quên gì?”

Hai mặt chạm nhau. Trong một khoảnh khắc rất ngắn, người chơi thấy một giọt nước mắt lơ lửng như hạt sao và nghe Fu Hua quá khứ nói:

> **Fu Hua quá khứ:** “Tôi không muốn cô độc nữa.”
>
> **Fu Hua quá khứ:** “Xin hãy cho tôi một ai đó.”

Một giọng khác chuẩn bị trả lời, nhưng Mnemosyne cắt ký ức trước âm tiết đầu tiên. Mảnh lõi bị một sợi chỉ trắng kéo về phía bầu trời.

> **Senti:** “Khoan— ai đã trả lời?”
>
> **Mnemosyne:** “Ký ức #0 mang hai chữ ký. Quyền sở hữu không xác định.”
>
> **Fu Hua:** “Vì nó không thuộc riêng một người.”
>
> **Mnemosyne:** “Kết luận không hợp lệ.”
>
> **Senti:** “Thế thì đừng chạy. Để bọn ta tự hỏi nó.”

Mnemosyne không đáp ngay. Khi lên tiếng lại, giọng máy móc lẫn một âm sắc rất nhỏ và mệt mỏi:

> **Mnemosyne:** “Hua đã mệt rồi.”

Fu Hua nhìn lên.

> **Fu Hua:** “Ngươi là ai?”

Giọng Mnemosyne lập tức trở lại lạnh và đều:

> **Mnemosyne:** “Cơ chế hiệu đính không cần danh tính.”

Đây là manh mối trực tiếp cho nguồn gốc Mnemosyne ở Chương 7 nhưng chưa giải đáp trọn vẹn.

---

## 18. Payoff — Hai người không trở về như cũ

Sau Jizo, Senti định đùa rằng mọi chuyện quá dễ nhưng dừng lại khi thấy tay Fu Hua run vì kiệt sức. Cô chìa Xích ra. Fu Hua không từ chối và nắm lấy.

> **Senti:** “Lúc nãy cô nói sẽ để người khác thử cứu mình.”
>
> **Fu Hua:** “Ta nhớ.”
>
> **Senti:** “Tốt. Ta ghét phải nhắc hai lần.”

Senti kéo Fu Hua qua phần sàn đang sụp. Vài bước sau, đến lượt Senti hụt chân vì Xích quá tải; Fu Hua giữ cô lại bằng chính mắt xích vừa được nối.

Không ai cảm ơn. Họ tiếp tục chạy, mỗi người giữ một đầu.

Payoff của chương nằm ở hình ảnh này:

- Đầu chương, Xích Nhận bị cắt khi Senti cố giữ Fu Hua một mình.
- Giữa chương, mỗi người sửa một phần dù không thấy nhau.
- Cuối chương, cả hai cùng giữ Xích và thay phiên kéo người kia qua đường sụp.

Mối quan hệ không trở về trạng thái trước khi bị chia cắt. Nó đã thay đổi từ “một người cứu, một người được cứu” thành một liên kết có thể đổi vai.

---

## 19. Cầu nối sang Chương 7 — Cái cây trắng không còn thở

Vỏ Jizo tan đi, để lộ một đường rễ khổng lồ xuyên qua điểm hội tụ. Biển Lượng Tử và Kolosten không tự nhiên sụp đổ; chúng bị hút thành những dải dữ liệu trắng chạy lên rễ cây.

Imaginary Tree hiện ra. Phần cây thật còn ánh vàng rất sâu bên trong, nhưng bên ngoài đang bị phủ dần bởi một lớp trắng nhẵn. Mỗi nơi lớp trắng đi qua, lá dừng rung và các bong bóng ký ức đứng yên.

Fu Hua hiểu cơn bão Kolosten chỉ là dòng điện từ quá trình này. Senti hiểu dòng thải Biển Lượng Tử là nơi Mnemosyne đã ném các khả năng nó loại bỏ. Hai nơi không phải đích đến; chúng là hai bộ phận của cùng một cỗ máy hiệu đính.

> **Fu Hua:** “Nó không chỉ thu thập ký ức.”
>
> **Senti:** “Nó đang đóng băng mọi khả năng thành một đáp án.”
>
> **Mnemosyne:** “Một đáp án không thay đổi sẽ không tạo ra sai lầm mới.”
>
> **Fu Hua:** “Cũng không tạo ra điều gì mới.”

Mảnh #0 chạy dọc rễ cây về phía một vùng sáng trắng. Một cánh cửa mở ra giữa các nhánh.

> **Mnemosyne:** “Ký ức #0. Sai lệch cuối cùng.”
>
> **Mnemosyne:** “Cần hai chữ ký hiện diện để hiệu đính trực tiếp.”
>
> **Senti:** “Vậy ra ngươi không gọi bọn ta tới.”
>
> **Senti:** “Bọn ta ép ngươi phải mở cửa.”

Mnemosyne im lặng. Sự im lặng lần này không còn trống rỗng; nó giống một hệ thống vừa gặp điều mình không thể phủ nhận.

Senti quấn Xích quanh cổ tay. Fu Hua nắm đoạn giữa, không phải để bị kéo mà để cùng giữ nhịp.

> **Senti:** “Qua đó là nó?”
>
> **Fu Hua:** “Và phần còn lại của Ký ức #0.”
>
> **Senti:** “Tốt. Ta còn câu trả lời cần lấy lại.”

Hai người chạy lên rễ cây. Phía sau, Kolosten vỡ thành mưa; những bong bóng Biển Lượng Tử trôi về đúng dòng của chúng thay vì bị hút vào vùng trắng.

Ngay trước khi màn hình chuyển cảnh, giọng Mnemosyne vang lên, khô khốc nhưng có một hơi thở rất nhỏ ở cuối câu:

> **Mnemosyne:** “Đang hiệu đính.”

Màn hình trắng hoàn toàn. Không có nhạc trong hai giây. Sau đó mở thẳng cảnh đầu Chương 7 V3: **một thế giới trắng không còn thở**.

---

## 20. Quái thường kể chuyện bằng cơ chế

### Tàn Ảnh Mất Chủ — tuyến Senti

Những ký ức bị tước tên và chỉ còn một hành động lặp. Chúng không chủ động săn Senti lúc đầu; chúng cố bám vào bong bóng có hình Fu Hua. Khi Senti trả đúng chi tiết cho một bong bóng, một số Tàn Ảnh dừng đánh và tan trong màu sắc riêng.

Thông điệp: xóa đau không giải thoát ký ức; nó xóa luôn người từng trải qua đau đớn.

### Kẻ Khâu Ký Ức — tuyến Senti

Quái bay dùng chỉ trắng khâu hai bong bóng không tương thích thành một cảnh “đẹp” hơn. Người chơi có thể giết nhanh, nhưng cách hiệu quả hơn là dùng Xích kéo đứt đường chỉ. Khi chỉ đứt, địa hình trở nên lộn xộn nhưng mở đường thật.

Thông điệp: trật tự của Mnemosyne là một lớp khâu, không phải sự thật.

### Hộ Vệ Phán Quyết — tuyến Fu Hua

Khiên của chúng chỉ mở về phía lối thoát, buộc Fu Hua quay mặt về tâm vòng hiến tế. Phản đòn đúng nhịp khiến chúng xoay khiên và vô tình che Fu Hua khỏi sét.

Thông điệp: công cụ buộc cô hy sinh có thể được tái sử dụng để bảo vệ lựa chọn sống.

### Kẻ Mang Thay — tuyến Fu Hua

Chúng tạo một sợi nối hút sát thương từ quái khác về bản thân. Nếu người chơi dồn sát thương, chúng phát nổ và hồi giáp cho cả nhóm. Cách giải là cắt liên kết trước, để từng đối tượng tự nhận phần hậu quả của mình.

Thông điệp: nhận hết tổn thương không phải lúc nào cũng cứu được ai.

### Hộ Vệ Giao Thoa — sau tái hợp

Hai nửa quái tồn tại ở hai lớp không gian, dùng chung một thanh máu nhưng khác điểm yếu. Senti mở điểm yếu; Fu Hua Assist đánh kết thúc, hoặc ngược lại.

Thông điệp: hai người không cần giống nhau để tạo thành một chỉnh thể chiến đấu.

---

## 21. Collectible và Album Chương 6

### Hai ký ức ẩn bắt buộc trong bộ 14 mảnh

1. **#11 — Giọt Mưa Đầu Tiên**  
   Điều kiện: nhảy vào bong bóng đi ngược dòng.  
   Ý nghĩa: trải nghiệm đầu tiên hoàn toàn thuộc về Senti.

2. **#12 — Căn Bếp Cháy**  
   Điều kiện: né hoàn hảo ba tia sét liên tiếp trong thử thách hiến tế.  
   Ý nghĩa: một thất bại bình thường có thể là lý do muốn trở về.

### Tám Bản khắc Lãng Quên

Sáu bản nằm trên tuyến chính, mỗi tuyến ba bản; hai bản đến từ side story. Ghép đủ tám không kể thêm một “đại bí mật”, mà tạo thành một câu hoàn chỉnh bằng hai kiểu chữ khác nhau:

> **“Ta vẫn tồn tại khi không ai nhìn thấy.”**  
> **“Ta vẫn quay về khi có quyền đi một mình.”**

Danh sách đề xuất:

1. **Dòng Nước Chảy Ngược** — bong bóng mưa của Senti.
2. **Tiếng Gọi Không Hồi Âm** — sau lần đầu nhấn Assist trong hư không.
3. **Mắt Xích Tự Rèn** — khi Xích hoạt động tạm thời.
4. **Tia Sét Đánh Trượt** — hậu quả của Arena 1 trên tuyến Fu Hua.
5. **Dấu Chân Rời Vòng Tròn** — khi Fu Hua phá vòng hiến tế.
6. **Hai Nhịp Qua Bức Tường** — phân đoạn phối hợp không liên lạc.
7. **Lần Thứ Mười Ba** — side story Chim Bông.
8. **Người Không Để Lại Tên** — side story Hoa Trắng.

### Album đề xuất

1. **Yên Lặng Trong Biển Lượng Tử** — mở đầu tuyến Senti.
2. **Món Quà Không Gắp Được** — side story Chim Bông Một Mắt.
3. **Kolosten · Lựa Chọn Cũ** — mở đầu tuyến Fu Hua.
4. **Ký Ức Chồng Lên Ký Ức** — map giao thoa.
5. **Từ Chối Hy Sinh** — Fu Hua bước khỏi vòng sét.
6. **Bong Bóng Đen** — cameo Nihilius.
7. **Bông Hoa Sau Cột Sét** — side story Hoa Trắng.
8. **Hai Đường Gặp Lại** — cảnh tái hợp và nối Xích.
9. **Vỏ Hiệu Đính** — Jizo Mitama sau khi mất lõi.
10. **Hai Câu Hỏi** — Ký ức chính #6 và dấu cộng hưởng #0.

Các thẻ đời thường dùng màu ấm và viền không đều. Các thẻ do Mnemosyne tạo dùng viền trắng hoàn hảo. Khi hoàn thành chương, viền thẻ **Hai Câu Hỏi** còn khuyết một góc; góc đó chỉ được lấp sau kết thúc bí mật Chương 7.

---

## 22. Payoff sang Chương 7 V3

Bản Chương 6 này chuẩn bị trực tiếp cho các chi tiết đã có trong Chương 7 V3:

- **Thế giới trắng không còn thở:** được nhìn thấy lan trên Imaginary Tree ngay cuối Chương 6.
- **Mnemosyne gọi “Hua đã mệt rồi”:** lần đầu lộ ra ở Ký ức chính #6, báo trước nguồn gốc cơ chế phòng vệ.
- **Ký ức #0 có hai nhịp:** Chương 6 xác lập vì sao Mnemosyne không thể xóa ngay và vì sao cần cả Senti lẫn Fu Hua ở Imaginary Tree.
- **Lời cầu xin của Fu Hua quá khứ:** được nghe một nửa ở đây; Chương 7 mới cho thấy ý chí sống độc lập đã trả lời.
- **Bàn Ký Ức Sea of Quanta/Kolosten:** việc Assist bị khóa ở Chương 7 gợi lại đúng cảm giác chia cắt của Chương 6.
- **Fu Hua cho phép mình được cứu:** làm nền cho cảnh cô nắm Xích ở cửa boss Chương 7 và Force Assist ở 1% HP.
- **Senti tự xác nhận bản thân:** giúp lời tuyên bố “Ta tồn tại. Khỏi cần ngươi cho phép” ở boss cuối là kết quả của một quá trình, không phải một câu khẩu hiệu xuất hiện đột ngột.
- **Mnemosyne không hiểu giá trị của điều không tối ưu:** Chim Bông, Căn Bếp Cháy và Hoa Trắng chuẩn bị cho các log lỗi, Bữa Cơm Khét Lẹt và Bức Tường Bị Vẽ Bậy ở Chương 7.

---

## 23. Quy tắc lời thoại

- Senti gọi Fu Hua là **Old Timer** trong đối thoại trực tiếp.
- Senti xưng **ta** trong toàn bộ chương. Không dùng “tôi”; câu “...Tôi muốn sống” vẫn dành riêng cho Ký ức #0 ở kết thúc bí mật.
- Senti đùa để giữ quyền chủ động, nhưng khi sợ thật, câu của cô ngắn đi thay vì biến thành độc thoại dài.
- Fu Hua nói ít. Thay đổi của cô phải nhìn thấy trong việc bước khỏi vòng sét, quay lại lấy bông hoa, nắm Xích và cho phép Senti kéo mình qua vực.
- Mnemosyne không chửi rủa, chế giễu hoặc khoe sức mạnh. Nó nói như một hệ thống giảm đau đang hoang mang vì hai người liên tục chọn phương án có thể làm họ đau thêm.
- Jizo không nói bằng giọng riêng. Mọi âm thanh từ lõi là câu nói bị lưu trữ của Senti, Fu Hua hoặc giọng nhiễu Mnemosyne.
- Không giải thích toàn bộ bí ẩn bằng hội thoại. Cơ chế, UI trống, Xích đứt/nối, sét đổi hướng và hai bản nhạc nhập nhịp phải gánh phần lớn câu chuyện.

---

## 24. Những điểm cần duyệt trước khi dựng

1. Chốt cách giải thích Kolosten là **bản lưu lựa chọn** được Mnemosyne ghim vào dòng hiệu đính, không phải thành phố vật lý bị kéo nguyên vẹn vào Biển Lượng Tử.
2. Chốt quy luật xuyên tuyến: hành động của Senti làm lệch sét; hành động của Fu Hua đổi dòng bong bóng.
3. Chốt Ký ức #0 mang hai chữ ký và Mnemosyne cần cả hai hiện diện để hiệu đính trực tiếp.
4. Chốt lời cầu xin của Fu Hua quá khứ xuất hiện ở cuối Chương 6 nhưng câu trả lời được giữ cho kết thúc bí mật Chương 7.
5. Chốt hai side story **Món Quà Không Gắp Được** và **Bông Hoa Sau Cột Sét** là nội dung đầy đủ có gameplay, không chỉ là bảng thoại.
6. Chốt cameo Nihilius giữ đúng ba giây, không chiến đấu và không mở tuyến truyện mới.
7. Chốt Jizo là **Vỏ Hiệu Đính** do Mnemosyne dựng từ khung ký ức, không phải Jizo nguyên bản hồi sinh.
8. Chốt giữ nguyên bốn turn boss và ba thứ tự vũ khí đang có trong game; phần V2 bổ sung ý nghĩa truyện, thoại chuyển turn và hình ảnh lõi #0.
9. Chốt thời lượng tuyến chính 30–40 phút hay rút một arena để còn khoảng 25–30 phút.
10. Chốt Album mười thẻ hay gộp **Vỏ Hiệu Đính** vào **Hai Câu Hỏi** để còn chín thẻ.

