# VOZLiving chrome-extension-react
### Another VOZ extension using
- webpack
- react/redux

### Install / Develope
- npm install
- Build DLL: `webpack --colors --progress --config=dll.webpack.config.js `
- Build CSS: `webpack --colors --progress --config=css.webpack.config.js`
- ./dev to run dev extension will build inside /chrome dir
- load unpack extension in /chrome dir

### Publish
- vi ./node_modules/automate-chrome-extension-update/secret/config.json => put CLIENT_ID, APP_ID
- ./node_modules/automate-chrome-extension-update/prepare 
- ./compile;./publish

### TODO Features:
- [X] Remove Ads
- [X] Quote notification (dont have setting yet)
- [X] Preview Thread
- [x] +   Quick reload using command + R
- [x] +   Next/Prev Post by arrow keys
- [x] +   Open new tab
- [x] +   First/Last Post
- [x] Link related features
- [x] +   Remove redirect
- [x] +   Link detection (then convert to link)
- [x] +   Embed Youtube Link
- [x] +   Embed Image Link
- [x] Quick Links
- [x] Add full emoticon into editor (both advanced and quick reply)
- [x] Smart quote minification
- [x] Quick post quotation
- [x] Monitor(Notify) followed threads

### Mics:
- [x] Quick add to ignore list
- [ ] cuộn chuột đến cuối trang thành sang 1 trang mới không cần ấn phím mũi tên (https://vozforums.com/showpost.php?p=101419337&postcount=1128)

Notes: Feedback process 40/40

##
Updates:

3.0.1: Fix không nhận được quotes

3.0.2: Thêm mở ra tab mới 

3.0.3: Thêm quick add to ban list

3.0.4: Fix mở ra tab mới

3.0.5: Fix mở ra tab mới lần nữa (lol)

3.0.6: Add tính năng gửi góp ý

3.0.7: 

- Hạn chế chiều cao khung bên cạnh
- Tuỳ chọn chuyển sang tiếng việt

3.0.8: Thêm form feedback khi xoá bỏ 

3.0.9: 

- Fix theo dõi thớt bị break ở 1 số trường hợp
- Thêm chuyển page bằng phím ở danh sách thớt
- Fix reload

3.0.10: 

- Mở ra tab khác nhưng vẫn giữ nguyên tab đang mở
- Ctrl V nếu là hình thì upload và trả về url

3.0.11:

- Hoàn thiện paste hình vô khung soạn thảo

3.0.12:

- Cố gắng fix theo dõi thớt bị lỗi trên windows

3.0.17:
- Thêm tính năng lưu lại bài viết hay (giới hạn 200 bài)
+ Lưu và sync
- Thêm option tự động ẩn thanh công cụ
- Thêm option peer chat (broken feature)

3.0.19: 
- Fix lỗi lặp hình
- Fix khi click vào xoá bookmark thì nhảy lên trên

3.0.20: 
- Add custom userStyle support
3.0.22: 
- Thêm tính năng chụp bài viết và upload lấy link
3.0.27
- Chat Box (optional, off by default)
3.0.28
- Fix Chat Box UI
3.0.29 
- Improve background performance
3.0.30
- Fix PostTracker not working