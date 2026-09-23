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

### Đã dính (2026-09-22): vietcap chặn hẳn

`iq.vietcap.com.vn` chặn **mọi** request cross-origin (400/403 với cả 6 bộ header trên runner, cả không Referer).
Chrome của anh Khoa mở *trang* vietcap vẫn thấy dữ liệu vì đó là cùng domain + cookie của họ — không phải bằng chứng API còn mở.
Hậu quả: engine (kafi-core) phát hành `dashboard_data.js` **mất 12 trường cơ bản** (q, npatYoY, revYoY, cagr3, pe, pb, roe, roa,
cap, dte, gm, dy) mà autorun vẫn PUT vì chỉ kiểm độ dài file; tab Chi tiết mã mất P/E, P/B, ROE, vốn hóa + 4 chart tài chính.

Đã sửa (nguồn dự phòng = **VNDirect finfo**, CORS `*`, runner GitHub gọi được — khác dchart):
- `dashboard_app.js`: `api.kqkd` / `api.ratios` thử vietcap trước, hỏng 1 lần trong phiên (`sessionStorage.kn_vc_hong`) thì đi thẳng
  `knFfQuy` / `knFfChiSo`, trả **đúng hình dạng vietcap** nên phần vẽ không đổi.
- `coban_vnd.js` (`knBoSungCoBan`): điền 12 trường vào `SUMMARY.rows` cho mã thiếu, 40 mã/lô. Dùng ở `autorun.js` (trước khi PUT,
  chỉ khi ≥20% mã thiếu) và `scripts/bo-sung-co-ban.js` (workflow `bo-sung-co-ban.yml`, bấm tay). Ghi nguồn ở `SUMMARY.coBan`.
- Mã chỉ tiêu VNDirect: `financial_statements` itemCode 21001 doanh thu thuần (mọi mô hình KQKD), 421701 TOI ngân hàng, 23000 LNST mẹ,
  23001 EPS quý, 14100 vốn chủ; `ratios` PRICE_TO_EARNINGS, PRICE_TO_BOOK, MARKETCAP (VND), ROAE_TR_AVG4Q, ROAA_TR_AVG4Q,
  GROSS_MARGIN_TR, DEBT_TO_EQUITY_AQ, NET_SALES_QR_GRYOY, NET_PROFIT_QR_GRYOY, DIVIDEND_YIELD (tỉ lệ, ×100 = %).
  `reportDate:a,b,c` và `code:A,B,C` nhận danh sách; `ratios/latest` cần `filter=` + `where=`.
- Dò API: `.github/workflows/do-api2.yml` (nhiều URL một lượt, có `jq`). TCBS bị Cloudflare chặn runner — không dùng được.
- **Engine (`kafi-core/engine.js`) đã sửa 22/09** (commit `752e250`): `layCoBan()` vietcap trước, hỏng thì VNDirect (`ffQuy`/`ffChiSo`,
  trả đúng hình dạng vietcap); **thiếu BCTC >15% mã thì ném lỗi, không phát hành**. Lý do bắt buộc: `gradeAt()` (lọc "cơ bản quý
  không đạt", LNST YoY 0–25% → W) đọc `qsAv`; rỗng là mọi mã "đạt" → bộ tín hiệu 21/09 lệch (X 131→163, thêm BCM/ORS/HHP 2026,
  hiệu suất 602%→579%). Test: `node scratchpad/engine-test.mjs` (fetch giả, 650 mã) — mã yếu phải ra W, VNDirect hỏng phải ném lỗi.
  Phát hành lại 22/09 15:09 (run 20): MSB về "HẠNG YẾU", HHP/BCM/ORS biến mất, hero +602.2% / 126 deal hiện ngay (bstar_live as_of 22/09).
  **Lệch nguồn đã biết:** ngày "as-of" BCTC lấy `createdDate` của VNDirect (ngày họ nhập), không phải ngày công bố như vietcap →
  11 marker cũ (2021–2026) đổi W↔B/X quanh ngày ra BCTC (REE, EIB, PVP, VHM, KHG, IJC, CSV, DCM, PVS, CTI). Không đụng deal B★ 2026
  và số hero; chỉ lịch sử tín hiệu từng mã lệch vài chỗ. Chưa có nguồn ngày công bố chính thức thay thế.

### Hai máy phát hành (sửa lại ghi chú cũ)

Ngoài Chrome của anh Khoa (`autorun.js`), kho `kafi-core` còn workflow **`phat-hanh.yml`** (`run.mjs`, lịch 08:50 UTC = 15:50 VN,
hay chạy trễ nhiều giờ — 21/09 chạy 22:21) PUT `dashboard_data.js` + `signals_data.js` bằng secret `WEB_TOKEN`. Các commit
`[AUTO]` buổi tối là của nó. **dchart VNDirect gọi được từ runner GitHub** (run 19 kéo đủ 693 mã) — ghi chú "VNDirect chặn IP
runner" trước đây sai với `run.mjs`. Từ 22/09 `run.mjs` cũng nướng `bstar_live.js` (bước 4, hỏng không ảnh hưởng tín hiệu). Hai máy chạy cùng engine nên sửa
`engine.js` là sửa cả hai; muốn phát hành lại tay: Actions → `Phat hanh tin hieu` → Run workflow (chỉ chạy **sau 14:45**, engine
lấy cả nến hôm nay).

### Watchlist 10 tỷ, tín hiệu 15 tỷ (23/09/2026, anh Khoa chốt)

Luật B★ cần GTGD TB20 ≥ 15 tỷ **tính cả phiên nổ**. 14/134 deal lịch sử (PET 22/09/2026, DPR, HVN, HDC, PPC, TNH…) có TB20 phiên
trước chỉ 10–15 tỷ, đủ 15 nhờ chính phiên nổ → trước đây không vào watchlist, tín hiệu chỉ hiện sau 15:09. Nhóm này: 5/13 thắng,
TB +5,6%/deal (chung: 58/133, +7,7%). **Luật tín hiệu không đổi** (giữ số 602%). Chỉ đổi hiển thị: engine cho vào watchlist từ
`val20 ≥ 10000`, gắn `wmong=1` khi < 15000, chip "CHỜ ĐIỂM MUA · TK MỎNG" kèm điều kiện; web/app vẽ nhãn "mỏng" (`__wmong`, `.knMong`),
mũi tên trong phiên chỉ vẽ khi ước tính TB20 gồm phiên nay ≥ 15 tỷ (`duTK`). Kiểm lại lịch sử: workflow `kiem-bstar.yml`
(`scripts/kiem-bstar-thanh-khoan.mjs`, chỉ đọc, chạy trên runner vì cần dchart).

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
Cả hai máy phát hành đều nướng `bstar_live.js` (Chrome: `autorun.js`; runner: `run.mjs` bước 4) và **không bao giờ commit file sinh từ dữ liệu giả**.

## Cách anh Khoa thích làm việc

Làm từng phần nhỏ, đẩy lên ngay, báo ngắn gọn. Ghét chờ lâu và ghét dừng giữa chừng để hỏi.
Sai thì nói thẳng là sai, đừng vòng vo.
