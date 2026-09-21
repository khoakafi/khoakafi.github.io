# khoanguyeninvest.vn — ghi chú cho phiên làm việc sau

Chủ dự án: Nguyễn Ngọc Anh Khoa — Giám đốc Tư vấn Đầu tư, Chứng khoán KAFI.
Web công khai + app iPhone (PWA), host bằng GitHub Pages từ nhánh `main`.

File chính: `index.html` (layout + CSS + version cache), `dashboard_app.js` (web),
`app-shell.js` (giao diện app iPhone), `sw.js` (service worker),
`dashboard_data.js` / `signals_data.js` (dữ liệu, máy quét tự ghi).

## Quy tắc bắt buộc

1. **Tuyệt đối không chỉnh dữ liệu trong Google Sheet "Leverage".** Mọi thay đổi đi qua code.
   Cần đọc để debug thì chỉ xem, không gõ/xoá/dán vào ô nào.
2. Không nhận token GitHub dán trong chat. Push bằng quyền repo gắn với task.
3. Không bấm qua màn hình OAuth/consent của anh Khoa, không gõ mật khẩu, không thao tác app ngân hàng.
4. **Không bịa số liệu.** Hệ thống là rule-based — không được ghi "machine learning / deep learning"
   trừ khi anh Khoa xác nhận có mô hình thật.

## Kỹ thuật cần nhớ

- Service worker cache theo `?v=`. **Mỗi lần sửa JS phải tăng version trong `index.html`**
  (`dashboard_app.js?v=20260921b`). Chỉ tăng version của file thực sự có sửa.
- Push xong đợi GitHub Pages build (~1 phút) rồi mới kiểm tra site.
  Kiểm bằng `git fetch origin main` + so SHA file, đừng đoán.
- `sw.js` chỉ can thiệp request **cùng domain** + CDN (`sw.js:61`). API bên ngoài nó không đụng tới,
  nên đừng nghi service worker khi lỗi nằm ở API.
- Cache theo phiên (`knGhiCache` / `knDocCache`): **không bao giờ ghi cache khi tải hỏng**.
  Ghi kết quả rỗng là cả phiên hôm đó chart trống mà không báo gì — đã dính đúng lỗi này một lần.

## Cách dò lỗi "server sống mà web không chạy"

Máy chạy task thường bị chặn gọi ra ngoài. Đừng nhờ anh Khoa chụp màn hình để thay cho việc tự kiểm.

1. **Gọi thẳng API trên runner GitHub cho nhanh** (`.github/workflows/do-api.yml`, bấm Run workflow).
   Quan trọng: **phải ép request giống trình duyệt và thử từng header một**.
   curl mặc định *không* gửi `Referer` — nếu chỉ curl trơn rồi thấy 200 là kết luận sai ngay.
2. **Chốt bằng Chromium thật.** Máy task có sẵn Chromium tại `/opt/pw-browsers/chromium`
   (dùng `playwright-core` với `executablePath`). Dựng server HTTP nhỏ ngay trong máy,
   cho trang gọi vào đó rồi đọc header trình duyệt gửi ra. Mọi thứ thuộc hành vi trình duyệt
   (CORS, Referer, service worker, cache) bắt buộc phải xác nhận ở bước này.
3. Sửa xong thì viết test chạy thẳng code thật với API giả trước khi push.

### Đã dính (2026-09-21)

`iq.vietcap.com.vn` bật luật chặn theo `Referer`: trình duyệt luôn gắn
`Referer: https://khoanguyeninvest.vn/` → trả **400**; không có Referer → **200**.
Server vẫn sống, CORS vẫn đúng domain, nên nhìn từ curl tưởng API còn tốt.

Đã sửa: `jget` bỏ Referer **chỉ khi gọi vietcap** (`/iq\.vietcap\.com\.vn/.test(u)`).
**Bài học đắt (2026-09-21):** lần đầu em bỏ Referer cho *toàn bộ* `jget` → VNDirect từ chối một phần
trong 15 lời gọi dchart cùng lúc của B★ → deal ra "…", đường hiệu suất rơi về bản không-B★ (+486.9%).
Đổi header thì **khoanh đúng host cần đổi**, không đụng host đang chạy tốt.
**Đừng** dùng `<meta name="referrer">` cho cả site — sẽ mất Referer ở link mở tài khoản KAFI
và Google Analytics. Các API VNDirect (dchart, stock_prices, foreigns, ratios, news)
chạy được cả hai chiều, nên bỏ Referer không ảnh hưởng.

## Số hiệu suất B★ tính ở đâu

`bstar_books.js` chỉ nướng sẵn đường đến hết năm trước (`BSTAR_CURVE.end`). Phần năm nay `bstarCurve()`
tính lại trên trình duyệt từ giá dchart của ~15 mã (`bstarLoadPrices`). Deal nào thiếu giá thì bị **bỏ khỏi
phép tính** → con số thấp hơn thật mà trông vẫn hợp lý. Đã sửa: tải 4 lô song song, hỏng thử lại 2 lần, nhớ
giá theo phiên (`kn_bstar_px`, chỉ ghi mã tải thành công), nhịp 2 phút tải lại cả mã còn thiếu, và
`BSTAR.thieu` để màn hình ghi "đang tải N mã" thay vì im lặng. Web và app dùng **cùng** `bstarCurve()`.
Kho giá `kn_bstar_px` giữ **qua ngày** (khoá `v2`, không theo phiên): lịch sử đến phiên trước không đổi, giá hôm nay
`bstarGia` lấy từ bảng giá; mã nào `lastd` < phiên trước mới tải lại. `thieu == null` = chưa tải xong lần đầu →
trang đầu ghi "· đang tính 2026…" (mở tab ẩn danh mất vài giây, lần sau ~0.3s). Số đúng là số khi `thieu` rỗng.

## bstar_live.js — giá năm nay nướng sẵn (602% hiện ngay, không "đang tính")

**"Máy phát hành" = Chrome của anh Khoa.** `autorun.js` chạy trên site khi máy có token (`settoken.html` →
`localStorage.kafi_gh_token`): sau 14:45 nó tải engine từ kho riêng `khoakafi/kafi-core`, tính, rồi PUT
`dashboard_data.js` + `signals_data.js` lên GitHub qua API (= các commit `[AUTO]`). Bước `phatHanhBstarLive`
chạy ngay sau đó trong cùng trình duyệt (gọi được VNDirect): giá dchart từ 01/12 năm trước của các mã B★ năm nay
+ carry + VNINDEX → PUT `bstar_live.js` (`[AUTO] gia B* <ngày>`). Có khoá riêng `kafi_lastlive`; `runLive()` chạy
bù nếu tín hiệu đã phát hành mà file chưa có / hỏng. Kiểm tra tay trong console: `__knBstarLive(localStorage.kafi_gh_token)`.
Client: `bstarLoadPrices` ưu tiên `window.BSTAR_LIVE.px` nếu `lastd` ≥ phiên trước → `ready` + vẽ ngay. File cũ
bị bỏ qua, trang tự tải như trước. `sw.js` xếp `bstar_live.js` vào nhóm dữ liệu; thẻ script không có `?v=`.
**Không chạy được trên GitHub Actions** (VNDirect chặn IP, 403) và **không bao giờ commit file sinh từ dữ liệu giả**.

## Cách anh Khoa thích làm việc

Làm từng phần nhỏ, đẩy lên ngay, báo ngắn gọn. Ghét chờ lâu và ghét dừng giữa chừng để hỏi.
Sai thì nói thẳng là sai, đừng vòng vo.
