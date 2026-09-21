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

## Cách anh Khoa thích làm việc

Làm từng phần nhỏ, đẩy lên ngay, báo ngắn gọn. Ghét chờ lâu và ghét dừng giữa chừng để hỏi.
Sai thì nói thẳng là sai, đừng vòng vo.
