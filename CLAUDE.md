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

- **Service worker (sửa 29/09):** mạng trước có hạn chờ (trang 1,2 s, dữ liệu 4 s) — quá hạn trả cache nhưng **bản tải về muộn vẫn phải được lưu**.
  Bản cũ bỏ kết quả về muộn → iPhone 5G kẹt ở `dashboard_data.js` 23/09 suốt 6 ngày ("Watchlist 24/09", "cũ 6 ngày", PET "T+1").
  Dữ liệu tải với `cache:'no-cache'`. Test mạng chậm: scratchpad `tq/swt.js` (máy chủ trễ 6 s).

## Tên miền mất DNS (29/09/2026)

`khoanguyeninvest.vn` ủy quyền cho `ns1.matbao.vn` (13.250.228.99) + `ns2.matbao.vn` (103.138.89.11) — **Mắt Bão**. 29/09 cả hai không trả lời
→ Google DNS SERVFAIL, runner GitHub `EAI_AGAIN` → `phat-hanh.yml` hỏng. Web vẫn "mở được" trên máy đã có cache (service worker trả bản cũ)
nên trông như "không cập nhật". Kiểm: kafi-core workflow `dns-check.yml`. Engine/`run.mjs` nay đọc file web qua `webText()`
(tên miền trước, lỗi thì raw GitHub); `breadth.mjs` đọc thẳng raw. Sửa DNS phải làm trong tài khoản Mắt Bão của anh Khoa (không tự thao tác).

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
  và số hero; chỉ lịch sử tín hiệu từng mã lệch vài chỗ.
  **Đã xác minh 24/09 (console Chrome anh Khoa trên trading.vietcap.com.vn):** `publicDate` của vietcap là ngày ra bản
  **kiểm toán năm / soát xét bán niên** (Q4 → 11–24/03, Q2 → 05–22/08), còn VNDirect ghi ngày ra **BCTC quý đầu tiên**
  (Q4 → 23–24/01, Q2 → 22–30/07). Số quý đã công khai từ ngày VNDirect → **VNDirect đúng hơn**; lịch sử kiểu vietcap dùng
  số trễ 1–2 tháng. 5 deal 2025 (REE 19/02, IJC 10/03, CSV 23/07, DCM 06/08, PVS 08/08) nổ giữa hai mốc → vietcap ra W, VNDirect ra X.

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

### Tỷ trọng B★: Buy 35% / 25% / 15% + trần thanh khoản, Add chỉ khi lãi < 20% (29/09/2026, anh Khoa chốt — thay bản 24/09 bên dưới)

Anh Khoa: 50% NAV "rén tay". kafi-core `research/add_sizing.mjs` (workflow `add-sizing.yml`): 35/25/15 → 833% / sụt −9,9%
(50/25/12.5: 1.333% / −11,1%; đều 25%: 643% / −9,05%). Nhóm "thường" +3,8%/deal, 17/37 thắng — 12.5→15 thêm lãi, sụt lớn nhất không đổi.
**Trần thanh khoản:** tài khoản mặc định **10 tỷ**, lệnh ≤ 20% GTGD TB20 trước phiên nổ → trần = 2×TB20 (%), làm tròn xuống bội 5, tối thiểu 5
(`buyPct`, `BUY_NAV`, engine.js). 30 deal B★★: trung vị TB20 32 tỷ; DPR 12,9 tỷ → 25%. **Add:** chỉ khi lãi 10% đến **dưới 20%**
(`ADD_TRAN`); lịch sử chỉ 1 lần Add ở lãi ≥20% (HDC 2023, −5%) + PET 28/09/2026. Chữ BỒI ghi khoảng giá. App: lọc/KPI "Buy 35%" = `buy >= 35`.
Test: `sh test/chay.sh` (engine-test3: 35/25/15, T015 trần thanh khoản, T016/T017 Add).

### (Cũ) Tỷ trọng B★: Buy 50% / 25% / 12.5% (24/09/2026)

Engine gắn `m[2]` vào dấu X: nền siêu chặt (biên độ 10 phiên ≤ 0,5 × 30 phiên, tính **trước** phiên nổ) + KL cạn
(TB KL 10 phiên < 0,8 × TB 50 phiên) → 50; chỉ siêu chặt → 25; còn lại → 12.5 (% vốn cuối năm trước, như đường B★).
Watchlist có `wbuy` (nếu nổ phiên tới). Web/app: `knBuyOf(t, bdate)`, `knBuyTag`, `.knBuy`. Số nghiên cứu: kafi-core
`research/sizing_exact.mjs` (sổ cũ: 614,5% → 1.311%, sụt −9,05% → −11,1%). **Đường B★ và con số hero vẫn tính mỗi deal 25%.**
**Chỉ còn B★ (24/09, anh Khoa chốt):** web/app bỏ B, B!, Weak — `knChiSao(m)` lọc dấu (giữ X và A/S của chính vị thế X),
`knStSao` bỏ chip Weak/Hạng yếu/vị thế B, watchlist chỉ giữ `wstar===1 && wgrade!=='weak'` (lọc ngay lúc nạp `SUM.rows`),
mũi tên trong phiên chỉ vẽ cho mã B★. **Engine vẫn tính B/B!/W như cũ** (B/B! chưa từng chặn B★ nào → tập B★ không đổi).
Engine `wstar` thêm điều kiện giá nổ > MA50 (như luật X).

### Rà soát toàn hệ thống 24–25/09/2026 (lỗi kiểu "PET": luật một đằng, watchlist/thông báo một nẻo)

Đã sửa (có test — kafi-core `sh test/chay.sh`, web: Chromium đồng hồ giả + API giả):
- **Giá dự khớp ATO (9:00–9:15) / ATC (14:30–14:45)** và **bảng giá còn là phiên trước** (trước khớp lệnh đầu, ngày nghỉ):
  không báo, không vẽ mũi tên (`knDuKhop`, `knGiaHomNay`; push-scan `duKhop`, `duLieuMoi`). Giờ phiên theo **giờ VN**, không theo máy khách.
- **Thông báo "TÍN HIỆU MUA" bỏ qua luật 15 tỷ gồm phiên nổ** (mã mỏng) → `knDuTK` / push-scan `duTK`, dùng `trig[4]` = tổng KL 19 phiên.
- **push-scan gửi cả mã không phải B★** (MSN, ACB, VCB…) → `laSao()` lọc như web. Dry-run không ghi state. Tổng kết 14:48 quét lại giá đóng cửa (nổ ở ATC).
- **Ngưỡng trig lệch luật**: giá làm tròn xuống (79/680 mã), KL 2× thay vì S19/9 (~2,11×), MA50 chỉ thử ở giá tối thiểu (bỏ sót VCG 29/06/2026),
  nền < 5% vẫn gắn ★ (engine ra B!). Engine nay công bố `trig = [giá B★, KL, giá sắp tới, KL sắp tới, S19, giá nổ thường]`, test ngẫu nhiên 0 lỗi.
- **Danh sách mã tự co lại** (mã lỗi tải bị xoá, không bao giờ quay lại: CMG, BTP, CDC, AME, V21, APH, VSA từ 07/09) → giữ bản cũ khi lỗi,
  danh sách = bản trước ∪ `SEC_MAP`, sàn lấy từ bảng giá VNDirect. **BCTC lỗi không còn = "đạt"**. Ngân hàng có doanh thu (`isb38`).
  Chặn phát hành khi dấu X lịch sử tụt > max(4, 3%). `SIGS.asof`/`SUMMARY.asof` = ngày nến thật.
- Tab Chi tiết mã: watchlist + khung hiện ngay (trước 2,4 s). `bstar_live.js` dùng được cả tháng 1–4.

**Chia/thưởng cổ phiếu (07/10/2026, GMD 3:2):** dchart điều chỉnh **giá** lịch sử nhưng **không điều chỉnh khối lượng** → ngưỡng KL theo
cổ phiếu cũ (dễ đạt hơn thật), GTGD hụt. Engine: `CHIA` = finfo `close/adClose > 1,05` trong 90 ngày → KL × hệ số (test `test/chia-test.mjs`).
Web: bản phát hành trước khi VNDirect điều chỉnh (GMD 17:48 ghi "≥ 83.00", tham chiếu 52) → `knChiaTach` (tham chiếu hôm nay / `__pPub` lệch > 1,5%)
quy đổi `SIGS.trig` + `knQuyDoi` đổi số trên chữ. Lịch sử > 90 ngày vẫn dính lỗi cũ (mục (1) dưới).

**Còn mở (đổi lịch sử tín hiệu → cần anh Khoa quyết):** (1) lọc GTGD dùng giá đã điều chỉnh cổ tức → deal cũ tự biến mất (DGC, PTB);
(2) `npYAt` để quý mới nhất có npY null đè giá trị cũ → coi là "đạt"; (3) lỗ → lãi (n0<0, n1>0) có thể rơi vào dải 0–25% → W;
(4) ghi sổ tín hiệu kiểu append-only để giá điều chỉnh không xoá được dấu cũ.

## Tab "Toàn cảnh" (27/09/2026, anh Khoa duyệt)

`tongquan.js` (tab thêm vào nav cạnh "Hệ thống", kiểu tab Hàng hoá; link chia sẻ `#toan-canh`) + `tongquan_data.js` (`window.TQ`, không `?v=`,
sw.js xếp vào nhóm dữ liệu). Dữ liệu do kafi-core workflow **`tong-quan.yml`** (4 mốc 16:37/17:13/18:41/20:19 VN, T2–T6 — GitHub xếp hàng lịch :05 trễ hàng giờ; mốc sau tự bỏ qua nếu web đã có `cap` = hôm nay) dựng: `research/breadth.mjs` → `research/phat-tongquan.mjs`
→ PUT bằng `WEB_TOKEN`; thiếu/hỏng (N<2000 phiên, phiên cuối cũ >10 ngày, NaN, lỗi tải >70 mã) thì **không ghi**.
Chỉ báo dòng tiền = giá trị khớp THẬT TB20 ÷ TB250 toàn thị trường; A = ≥1,2 và rổ top 150 (EW, chọn theo thanh khoản tháng trước) > MA50; D = <0,8.
**Không đưa B★ vào tab này** (anh Khoa: B★ cũng theo dòng tiền chung). Lãi suất: nền = cận trên NHNN (theo chart VnExpress), đè bằng `sbv-thang.json` (nhánh `lai-suat-data`).

### Trạng thái thị trường trên tab Toàn cảnh (28/09/2026, anh Khoa chốt)
3 trạng thái: **TÍCH CỰC** (tiền ≥1,2 & rổ > MA50, giữ đến khi tiền <1,2 VÀ < MA50) · **THẬN TRỌNG** (Rủi ro đỉnh ≥2/4 có vĩ mô) ·
**QUAN SÁT** ("Chưa rõ xu hướng"). Nhãn phụ: "Lực bán cạn dần" (Cơ hội đáy ≥3/5), "Rủi ro đang tăng" (Tích cực + rủi ro). Giữ thêm 5 phiên
chống nhảy. Tính ở kafi-core `research/trang-thai.mjs` (khớp 100% bản nghiên cứu từ 10/2018), `breadth.mjs` kiểm độ mới (phiên = VN-Index,
US10Y trễ ≤4 ngày, USD H.10 đúng tuần) → sai thì không phát hành. **Không hiện điều kiện/ngưỡng lên web** (anh Khoa: khách chỉ thấy tầng nổi).
Chạy thử: `tong-quan.yml` tick `thu` → file ở nhánh `tongquan-thu` của kafi-core.
28/09: `WEB_TOKEN` cũ bị 401 → anh Khoa tạo token mới (fine-grained, chỉ repo web, Contents RW, không hết hạn); đã thử ghi thật OK (`[AUTO] toan canh` 5b77ec8).

## Lãi suất NHNN theo tháng (27/09/2026)

Nguồn gốc số chart VnExpress = PDF "Diễn biến lãi suất của TCTD đối với khách hàng tháng M/YYYY" của NHNN (đăng ~17–18 tháng sau;
số trên chart = **cận trên** của khoảng). Workflow `lai-suat-thang.yml` chạy 09:23 VN mỗi ngày: đọc link mới nhất trên trang chủ NHNN,
tải PDF, `scripts/lai-suat-thang.mjs` đọc số → `sbv-thang.json` trên nhánh **`lai-suat-data`** (không đụng web). Chạy thử: Run workflow, tick `thu`.
NHNN chặn ~5 lượt/IP (403) → mỗi lần chạy chỉ 3 lượt. Trang NHNN mới chỉ còn bài từ ~giữa 2025; 2012–2024 không có (IMF, World Bank,
web.archive không có số tháng VN). Năm 2019–2023 chỉ có World Bank bình quân năm (khác định nghĩa). Chưa có số tháng 2024 – 5/2025.

## Nghiên cứu đỉnh/đáy lớn (27/09/2026, CHƯA lên web)

kafi-core `research/dinh-day/` (`KET-QUA.md`, script Python, `bao-cao.html`). Rổ 150 mã, zigzag 15% (12 đỉnh, 12 đáy).
Số đã sửa 28/09 (vĩ mô theo lịch công bố — **USD FRED DTWEXBGS công bố hàng tuần, trễ 4–8 ngày; DGS10 dùng số phiên trước**):
Cơ hội đáy ≥3/5 → 94,5% ngày, 5/6 đợt tăng ≥10%, còn giảm thêm 4–18%. Rủi ro đỉnh ≥2/4 có vĩ mô → 49,4% ngày, gần đỉnh 6/9 đợt đúng,
báo kịp rõ 3 đỉnh. Mô phỏng +319% / −18,4%. Vòng 2 (lợi nhuận, P/E–P/B, khối ngoại, ngành; `research/dinh-day/vong2/`): 46 quy tắc,
không cái nào qua kiểm chéo → luật giữ nguyên. **P/E, P/B lịch sử của VNDirect dùng BCTC trước ngày công bố đến giữa 2022** — muốn
kiểm định lịch sử phải tự tính. Muốn đưa checklist Cơ hội đáy / Rủi ro đỉnh vào tab Toàn cảnh thì **hỏi anh Khoa trước**.

## Mô hình T+ ngắn hạn (10/10/2026) — KHÔNG ĐẠT, không lên web

kafi-core `research/tplus.mjs` + `research/tplus-KET-QUA.md` (workflow `tplus.yml`). 3 tầng: Toàn cảnh → mã xu hướng tăng + RS ≥ 80
→ điểm vào chỉnh MA20 / nền ngắn vượt đỉnh. Kiểm tra 2023–26: −1,02%/lệnh, cả 30 cách thoát đều âm, thua mua bừa; danh mục −62% khi VNI +66%.
Điểm vào còn tệ hơn chỉ lọc xu hướng ngay ở giai đoạn học. Muốn thử lại phải đổi hẳn ý tưởng — giai đoạn 2023–26 đã "dùng" một lần.

## B★ thực tế: vốn, đóng trần, vào sớm (11/10/2026, CHƯA đổi luật/web)

kafi-core `research/breakout-thuc-te-KET-QUA.md`. 125 deal B★ từ 2019: TB20 trung vị 38 tỷ → 10 tỷ/deal chỉ vừa 37% deal (≤20% TB20).
79% deal đóng trần: mua được trần +5,0%/deal, lỡ trần mua mở cửa hôm sau +1,8%. Vào sớm khi chạm ngưỡng: 1/3 xịt nhưng xịt chỉ −0,78%/lệnh.

## Phân tích cơ bản chuyên sâu (15/10/2026)

`phantich.js` (file riêng, `?v=`): khối dưới "Tài chính — 12 quý" ở tab Chi tiết mã (web + app). dashboard_app.js bọc trong IIFE nên
xuất trạng thái qua `window.__knCt` (ngay sau `loadDetail`). Nguồn: VNDirect finfo `financial_statements` ANNUAL (size 350) + QUARTER (size 400),
37 mã chỉ tiêu ghi đầu file (dò bằng `do-api2` trên FPT/VCB/SSI/HPG). Chấm 5 trụ theo **ngưỡng cố định** (rule-based), Piotroski F-score
(chỉ DN thường), cờ đỏ/điểm mạnh, so trung vị ngành (`SEC_MAP`, không gồm chính mã, cần ≥ 3 mã có số — ROE trong bảng giá gần như trống nên
không so ROE ngành). Ngân hàng = có 421701; CTCK/bảo hiểm phân theo ngành (`Dịch vụ tài chính|Bảo hiểm`), không chấm sức khỏe/dòng tiền.
LCTT quý ghi lũy kế → cột "4 quý gần nhất" không có dòng tiền; cộng 4 quý chỉ khi đủ cả 4 (EPS quý 0 = thiếu). Cache theo phiên (nay `kn_pt3_<mã>`),
chỉ ghi khi có ≥ 2 năm. Test: scratchpad `pt-test.js` (Chromium + API giả từ số thật của runner).

**Soi BCTC (bản 2, 15/10 tối — anh Khoa: "phải soi kỹ BCTC, ra insight nhiều khía cạnh, vd VND thị phần giảm, môi giới giảm").**
Khung "Soi BCTC Qx" đầu khối: câu insight tự sinh (rule-based) + **cầu lợi nhuận** (LNTT kỳ này − cùng kỳ = tổng thay đổi từng mảng,
khớp tới từng tỷ với VCB/HPG/VND) + thị phần trong nhóm niêm yết cùng ngành + bảng 8 quý theo ngành. Quý: ~62 mã chỉ tiêu, lọc
`fiscalDate:<10 cuối quý>` (API nhận danh sách). Nhóm so sánh: 1 lời gọi `code:A,B,C…` (top 30 vốn hóa cùng ngành; CTCK 45 vì nhiều mã
"Dịch vụ tài chính" không phải CTCK). Quý "đủ" = ≥ 80% mã đã báo cáo (đầu mùa BCTC không tính thị phần quý mới).
Mã CTCK (mô hình 89/90/91): 621110 DT môi giới, 700056 CP môi giới, 700044 lãi cho vay & phải thu, 700039/700046 lãi/lỗ FVTPL,
700043 lãi HTM, 700053 dự phòng (âm = hoàn nhập), 700001 dư nợ cho vay (margin), 700073 LNTT chưa thực hiện, 22509 lãi vay.
Ngân hàng (101–103): 421900 NII, 423200 phí, 423300 FX, 423400/423500 CK, 421600 khác, 422900 dự phòng, 411400/412300 liên NH/CK đầu tư,
413100 nợ CP & NHNN. **Nợ xấu, CASA, NIM chính thức: VNDirect có tên chỉ tiêu (mô hình 104/1610) nhưng không trả số** → NIM là ước tính.
Thị phần môi giới = thị phần **doanh thu** môi giới trong CTCK niêm yết (không phải thị phần giá trị giao dịch HOSE).
Số thật cho test Soi BCTC: scratchpad `fake/store.json` (gom bằng `gom-log.py` từ log do-api2).

**Khuyến nghị 3 mức TIÊU CỰC / KHẢ QUAN / TÍCH CỰC (16/10/2026 chiều, anh Khoa đổi từ CÓ/KHÔNG; "key tăng trưởng").** `phanLoai` trả
`tc` | `dat` | `sap` | `thap` | `kq` → `muc3`: TÍCH CỰC = quy tắc CÓ bên dưới; TIÊU CỰC = đắt thật (`dat`) hoặc LNST quý gần nhất sụt ≥ 30% / lỗ
(`sap`, `h0 = -1`); KHẢ QUAN = còn lại (`thap` = P/E cao vì LN thấp). kafi-core `research/co-ban/ba-muc.mjs` (4 ứng viên ghi trước, chọn C — xem
KET-QUA.md mục 4b): 6 tháng TÍCH CỰC +5,7% > KHẢ QUAN +0,9% (t 2,8) > TIÊU CỰC −3,3% (t −5,3), thứ tự đúng cả 2014–20 và 2021–; TIÊU CỰC âm 12/12 năm.
**Tăng trưởng một mình chưa đủ:** LN không giảm 2 quý liền chỉ +1,1% (2021– ≈ 0); lợi thế khi tăng trưởng đi cùng giá hợp lý. Web khớp backtest
250/250 mã tháng 10/2026 (35 / 147 / 68). Ngoài vũ trụ thanh khoản: không bao giờ TÍCH CỰC.
**Điểm sáng / điểm tối 2 quý gần nhất + kết luận tăng trưởng (16/10 tối).** `tangTruong(sv)` (sv = `ptSoi`) → `raw.__tt`, tính **trước** khi vẽ
`#ptDgO` để dòng "Tăng trưởng 2 quý gần nhất" nằm dưới khuyến nghị. Nhãn theo LNST mẹ 2 quý so cùng kỳ (`h0`/`h1` như backtest): LỢI NHUẬN SỤT MẠNH
(= `laSap`) · SUY GIẢM · TĂNG TRƯỞNG MẠNH (cả 2 quý ≥ +20% & doanh thu không giảm) · ĐANG TĂNG TRƯỞNG · CHỮNG LẠI · CHƯA ĐỦ SỐ; nhịp tăng tốc/chậm lại ±10 điểm %.
"Soi BCTC" mở đầu bằng bảng 2 quý (`bang2Quy`), hai cột Điểm sáng / Điểm tối (từ `s.ds` + `tt.them`) và khung Nhận định (`tt.nd`: chất lượng tăng
trưởng, nguồn ngoài cốt lõi lớn nhất, gợi ý hợp nhất/thoái vốn, dự phòng NH, tự doanh CTCK). LN cốt lõi (`loiQuy`): DN = LN gộp − CPBH − QLDN; NH = 88888;
CTCK = môi giới ròng + margin + HTM − lãi vay − QL. Nhãn tăng trưởng chỉ **mô tả**, không đổi khuyến nghị.
**Giao diện dạng số liệu (16/10 tối, anh Khoa: "nhìn toàn chữ", thích kiểu thẻ trắng + pill + bảng như phần Chấm điểm 5 năm).** Khối khuyến nghị:
thang 3 mức (`thang3`, số lịch sử 6 tháng mỗi mức), 2 ô "Tăng trưởng 2 quý" / "12 tháng qua" (`diemNhan` trả số), 5 ô điều kiện có thanh đo (`thanhDo`, `oDieuKien`),
thang giá (`thangGia`: vùng TÍCH CỰC + mức thành "đắt thật" = max(P/E 25 hoặc 20 & PEG 2,5, P/E chuẩn hóa 25) — LN quý sụt thì không vẽ), ô số kiểm định
(`KD3`, `KD3P`, Toàn cảnh `TT3` — cùng số với bản chữ cũ), cột lịch sử trên chính mã (cao = Tích cực; màu đỏ/xanh không phân biệt được với người mù màu nên
chiều cao + chữ là kênh chính). Màu KHẢ QUAN = xám trung tính #64748B. Ảnh test: `dg-test.js` (`FULL=1` chụp cả khối, ẩn thanh menu/footer khi chụp).
Soi BCTC: 4 ô KPI quý gần nhất kèm cột 8 quý (`oQuy`, `cotNho`: xanh đậm 2 quý đang soi, xám đậm cùng kỳ) thay bảng 2 quý; mỗi mục điểm sáng/tối là
`{s, w, so, ten, ct}` (`add(s, w, so, ten, ct)` trong `ptSoi`, số chính ở cột trái, tên có chữ tăng/giảm, vượt/kém ngành để không phải đoán qua màu; khi
xếp theo thị phần thì số chính là thị phần). Nhận định `tt.nd` = `{ic, ten, ct}` (ic: ok/no/canh/len/xuong). Mỗi cột hiện 6 mục, còn lại trong "Xem thêm".
**Khung quyết định một màn hình (16/10 tối, anh Khoa xem trên web thật: "hơi nhiều thông tin, phức tạp", "đọc trên 1 mặt trang là hiểu", "tối ưu diện tích").**
`ketLuanDL` tính một lần → `tomTatHtml` (khung trên cùng: khối kết luận màu + việc nên làm `HANH`, 5 điều kiện dạng nhãn, chỉ giải thích điều kiện chưa đạt,
một dòng "Theo giá", ô tăng trưởng + cột LNST 8 quý, 3 điểm sáng / 3 điểm tối từ `raw.__sv` (không đếm khi lưu cache), tối đa 3 lưu ý: Toàn cảnh `TT_NGAN`
cho mức TÍCH CỰC, bằng chứng điều kiện chưa đạt, nhận định BCTC đáng chú ý) + `chiTietKlHtml` (bản đầy đủ cũ). Mọi chi tiết nằm trong 3 mục gập
`mucGap`: `ctkn` Chi tiết khuyến nghị (+ thẻ P/E 5 năm `peTheHtml`), `ctsoi` Soi BCTC chi tiết, `ct5n` Chấm điểm 5 năm (nhãn trụ hiện ngay ở dòng tiêu đề).
Mở/đóng được nhớ theo người xem (`localStorage.kn_pt_mo`). Test đối chiếu 250 mã phải dùng **giá chốt của backtest** (`e.close`), không dùng bảng giá web
(sang phiên sau giá đổi → lệch nhãn giả).

**Kết luận MUA: CÓ / KHÔNG theo giá hôm nay (16/10/2026, mô hình ĐÃ KIỂM ĐỊNH — anh Khoa: "Yes/No, không nước đôi", "backtest mô hình"; nay = mức TÍCH CỰC).**
Thay quy tắc 5 điều kiện cũ (`ptKetLuan`: LN cốt lõi, nền tảng, thị phần, định giá, ≥ 2 báo cáo CTCK dư địa ≥ 15%) — backtest cho thấy
nó **thất bại** (giai đoạn kiểm tra 2021–: −0,6%/6 tháng so với thị trường, t −0,3). Nghiên cứu: kafi-core `research/co-ban/` (`KET-QUA.md`,
`GIA-THUYET.md` đăng ký trước, `chot.mjs`, `kiem-chot.mjs`); dữ liệu nhánh `co-ban-data` (workflow `co-ban-data.yml`, mặc định chỉ tải bổ sung mã thiếu; `tai_lai=1` tải lại ~60 phút): 1.628 mã gồm mã
đã hủy niêm yết, BCTC quý point-in-time theo `createdDate` VNDirect, giá gốc + điều chỉnh cuối tháng 2012–nay, báo cáo CTCK Simplize (từ 2022).
- **CÓ** = P/E < 15 & PEG ≤ 1 & LNST mẹ quý gần nhất ≥ cùng kỳ & giá ≥ 80% đỉnh 12 tháng (giá cuối tháng, điều chỉnh) & không "chu kỳ ở đỉnh"
  (từng giảm LN 4 quý ≥ 50% từ đỉnh hoặc ngành chu kỳ; LN 4 quý ≥ 85% đỉnh; giảm tốc ≥ 25 điểm % hoặc biên gộp ≥ 85% lịch sử)
  & thanh khoản top 250 GTGD TB20 và ≥ 1 tỷ/phiên (vũ trụ kiểm định — ngoài vũ trụ không bao giờ CÓ).
- **KHÔNG (đắt)** = P/E ≥ 25 hoặc (P/E ≥ 20 & PEG ≥ 2,5); ngân hàng không xếp "đắt" (nhóm đó không kém thị trường). Còn lại: KHÔNG (chưa đủ điều kiện).
- Số (vượt TB đều top 250 cùng tháng, t Newey-West): CÓ +3,6%/3T, +5,7%/6T, +8,5%/12T (3.467 lần, 341 mã, dương 11/12 năm, thắng ~52%);
  học 2014–20 f6 +7,3% (t 4,5), kiểm tra 2021– +3,7% (t 1,6 — chưa có ý nghĩa riêng; f3 t 2,5). Danh mục CÓ giữ 3T sau phí +21,3%/năm vs +6,6%;
  2021– +17,4% vs VN-Index +8,6%. ĐẮT thật (không NH, P/E chuẩn hóa ≥ 25) −8,7%/6T, −15,6%/12T, âm 11/12 năm; "P/E cao vì LN thấp"
  (P/E chuẩn hóa < 25, nhãn `thap`) −5,4% học / ~0 kiểm tra. Dao rơi (rẻ + tăng nhưng < 80% đỉnh) −2,4%/3T.
- **Lần tải đầu thiếu 46 mã** (SSI, KBC, VPL, BMI…: mã chuyển sàn có bản ghi DELISTED ở sàn cũ trước 2013 bị ghi đè trạng thái) — đã sửa
  `tai.mjs` (DELISTED trước, LISTED sau; mã web bỏ bản ghi hủy), số trên là sau khi bổ sung (gần như không đổi).
- **Web khớp backtest 250/250 mã tháng 10/2026** (35 CÓ, 32 ĐẮT, 9 THẤP, 174 KHÔNG) (`nmTinh` tính y hệt `dac-trung.mjs`; bỏ điều kiện giá hàng hóa vì trình duyệt không gọi được
  FRED — chỉ đổi 0,8% số lần, tháng 10/2026 không đổi mã nào). Test: scratchpad `dg/dg-test.js` (Chromium, API giả từ dữ liệu thật `co-ban-data`;
  `dg/xuat.mjs` xuất nhãn backtest; `BO_DOI=1` bỏ đối chiếu, `SONG=<giá>` thử vẽ lại theo giá, `LOWVAL=<mã>` thử ngoài vũ trụ).
- Giao diện (đầu khối, nằm trong `#ptDgO` nên **vẽ lại mỗi khi giá đổi**, giữ `<details>` đang mở): 5 điều kiện ✓/✗ có số; **vùng giá CÓ**
  (P/E, PEG tỉ lệ thuận giá; đỉnh 12 tháng cố định trong tháng); tháng điều kiện đỉnh tự đạt nếu giá đứng yên; bằng chứng lịch sử;
  "Mô hình trên chính mã" (kết luận cuối mỗi quý 5 năm + giá 6 tháng sau); báo cáo CTCK chỉ để tham khảo (kiểm định: dư địa CTCK không thêm giá trị).
- BCTC quý tải **đủ lịch sử** (`nmTai`, `size=1000`, ~870 dòng/mã) — cắt 700 làm lệch phân vị biên gộp (DHC đổi nhãn). Cache `kn_pt3_`
  (lsQ dạng mảng gọn, tối đa 15 mã; `kn_pt2_`/`kn_pt_` tự xoá).
- **Thông tin ngoài — trạng thái Toàn cảnh** (`window.TQ.tt.S`, 0 Quan sát / 1 Tích cực / 2 Thận trọng): chỉ kèm kết luận CÓ, một dòng
  (kafi-core `theo-trang-thai.mjs`, 2018–): nhóm CÓ hơn thị trường ở cả 3 trạng thái, nhưng mua lúc **Thận trọng** thì tuyệt đối −5,1%/6T
  (38% có lãi); danh mục CÓ không mua mới khi Thận trọng: sụt −29% thay vì −40%, lợi nhuận/năm không giảm. **Chưa** đổi CÓ thành KHÔNG
  khi Thận trọng (mẫu chỉ 15 tháng) — nếu anh Khoa muốn đồng bộ với tab Toàn cảnh thì sửa ở `phanLoai`/`ketLuanHtml`.
- "Điểm nhấn" đầu thẻ (`diemNhan`): LN 4 quý vs giá 12 tháng → P/E co/nở; chuỗi kỷ lục. LN quý giảm/lỗ thì không ghi "giá chưa theo kịp".
- **Không** kết luận bằng "đắt/rẻ so với chính nó": phân vị P/E so với 5 năm của chính mã không dự báo được giá (kiểm định ~0).
  Thẻ "Định giá theo giá hôm nay" chỉ mô tả, có ghi chú điều này. Muốn đổi ngưỡng → chạy lại kafi-core `chot.mjs`, không chỉnh tay trên web.

## Hồ sơ phân tích từng mã (17/10/2026, làm thử MWG — chờ anh Khoa duyệt khung rồi mới nhân ra ~100 mã)

Anh Khoa: "phân tích detail từng business như một analysis thật, P/E – PEG chỉ là một phần; mỗi mã đọc 3–5 báo cáo CTCK + bài báo
(kế hoạch lợi nhuận, mục tiêu, tin); top-down; đánh giá risk/reward; ~100 mã top thanh khoản được CTCK theo dõi; mã không phân tích =
không đáng quan tâm" + "trải ra, không bấm mở; chart như số cửa hàng, doanh thu/cửa hàng".
- **Tải tài liệu** (máy task không gọi được web VN → luôn qua runner): kafi-core `research/ho-so/tai.py`, workflow `ho-so-tai.yml` tự chạy khi đẩy
  `research/ho-so/**` lên `claude/co-ban-research`. `ma.txt` = danh sách mã; Simplize → ≤ 5 báo cáo mới nhất (≤ 240 ngày, mỗi CTCK 1 bản) PDF → chữ;
  `them.txt` (MA⇥URL⇥ghi chú) = bài báo, ĐHĐCĐ, báo cáo trên web CTCK. Kết quả ở nhánh riêng `ho-so-data` (`out/<MA>/bc_*.txt`, `web_*.txt`, `ds_bao_cao.json`).
- **Viết hồ sơ**: `hoso/<MA>.json` + `hoso/index.json` ({MA: ngày cập nhật}, client chỉ tải mã có trong index). Tự viết lại, không chép văn bản CTCK
  (bản gốc chỉ nằm ở kho riêng); mỗi ý có `ng` (nguồn ngắn), đối chiếu từng con số với văn bản gốc trước khi đẩy. Số phụ thuộc giá tính ở client:
  `{pe26}` trong `dong_mo`, ma trận `kich_ban` (LN 2027 dự phóng × P/E → giá), tiềm năng so với giá mục tiêu.
- **Giá mục tiêu & cổ tức:** Simplize ghi giá MT đã trừ cổ tức tiền mặt chi sau ngày báo cáo (KAFI 94.400 → 93.400); bản PDF thì không.
  Hồ sơ ghi giá trong báo cáo, so với giá hôm nay thì trừ `co_tuc` (ngày GDKHQ sau ngày báo cáo). MWG: cổ tức 2025 2 × 1.000 đ, GDKHQ 29/07 và 07/10/2026.
- **Bẫy số đã gặp:** MBS ghi tiền 44.670 / nợ 22.404 tỷ (30/6) trong bảng DCF là của **riêng DMX**, không phải MWG hợp nhất; ACBS tự vênh trong báo cáo
  (LN 2026F 11.122 ở thân bài/mô hình, 11.160 ở bảng tóm tắt) — dùng số thân bài.
- **Vẽ**: `hoso.js` (`?v=`, nạp trước phantich.js): `phanA` đầu trang + cán cân (vẽ lại khi giá đổi, `#hsA`), `phanB` top-down / từng mảng / biểu đồ KPI /
  kế hoạch & tiến độ, `phanC` CTCK + giá mục tiêu 16 tháng từ `raw.bc` + `raw.gia` (vẽ lại khi giá đổi, `#hsC`), `phanD` rủi ro / sự kiện / nguồn.
  phantich.js `ptVe` xếp: hồ sơ A → khung mô hình (`#ptDgO`) → hồ sơ B → **3 thẻ BCTC trải ra** (`theQuy`, `theBien`, `theNo`, mọi mã) → hồ sơ C, D →
  mục gập cũ. Mã chưa có hồ sơ: một dòng "Chưa có hồ sơ phân tích". Biểu đồ dùng chung `window.__knBd` (cột, cột chồng, đường có trục, thanh ngang).
  Lớp CSS tránh `.up`/`.dn` cho khối lớn (trang có `.up{color:xanh}` toàn cục → cả khối chữ xanh).
- Test: scratchpad `dg/dg-test.js` (`BO_DOI=1 MA=MWG FULL=1`, `W=390`, `APP=1`); Simplize giả lấy thêm `hs/out/<MA>/ds_bao_cao.json`.
- **Bản 2 (17/10 chiều, anh Khoa: "CTCK chỉ tham khảo, phải tự dựng model để đánh giá insight; viết kiểu Catalyst / Risk bằng ngôn ngữ analyst,
  không 'vì sao tăng/giảm'; cập nhật theo quý, luôn có giá"; "làm xong bản máy tính trước, điện thoại để sau").** Mô hình riêng từng mã: kafi-core
  `research/ho-so/mo-hinh/<MA>.mjs` (số thực tế + giả định 3 kịch bản → LN theo mảng, giá trị tổng các phần, độ nhạy) → kafi-core `research/ho-so/mo-hinh/dung-hoso-MWG.py` dựng
  `hoso/<MA>.json` (bản 2: `luan_diem`, `mo_hinh`, `cau_ln`, `gia_dinh`, `kich_ban`, `nhay`, `sotp`, `theo_doi`, `tham_dinh`, `catalyst`, `rui_ro`).
  Trang: kết luận (giá trị mô hình cơ sở, xấu/tốt, cán cân lên/xuống, tín hiệu định lượng) → luận điểm đầu tư + "thị trường đang trả bao nhiêu cho từng
  phần" (vốn hóa mẹ − % công ty con niêm yết theo giá **sống** dchart, MWG: 85,96% DMX, 1.267,7 triệu cp) → mô hình dự phóng + giả định + độ nhạy +
  theo dõi theo quý (thực tế tự điền từ BCTC VNDirect `raw.quy` khi có) → động lực vận hành → vĩ mô → kế hoạch → 3 thẻ BCTC → Catalyst / Rủi ro →
  **Thẩm định quan điểm CTCK** (đồng ý / một phần / không dùng / tham khảo + bằng chứng + trong mô hình) → Tham khảo CTCK (có cột "Mô hình trang") → Nguồn.
  Mỗi quý: cập nhật số thực tế trong script, chạy lại, dựng lại JSON, tăng ngày trong `hoso/index.json`.
  Dựng JSON: `node MWG.mjs > m.json` → `python3 pe-lich-su.py <thư mục gia.json.gz + bctc.json.gz của co-ban-data> MWG > pe.json` →
  `python3 dung-hoso-MWG.py m.json hoso/MWG.json pe.json` (tự kiểm tổng các phần = giá từng kịch bản).
- **Kịch bản xấu đã sai (17/10 tối, anh Khoa: "48.1 tính kiểu gì ghê vậy").** Bản đầu lấy P/E DMX xấu = 9 = P/E dự phóng của **chính MWG**
  (giá MWG đã gồm chiết khấu công ty mẹ) rồi trừ thêm 10% chiết khấu → đếm trùng; cộng LN xấu thành 8,4 lần LN 2027 — thấp hơn mọi tháng
  từ 2015 trừ COVID (6,8). Sửa: P/E xấu = mức thấp 10% P/E 4 quý của chính mã (`research/ho-so/mo-hinh/pe-lich-su.py`, MWG 11,3; hiện 10,9)
  → 55,2. Nguyên tắc cho các mã sau: không dùng P/E của công ty mẹ cho phần con rồi lại trừ chiết khấu; P/E kịch bản neo vào lịch sử chính mã
  + P/E cùng ngành khu vực trong bảng CTCK (ghi rõ năm F; P/E năm hiện tại × LN năm sau = giá trị 12 tháng).
- **Bản 3 — chart hóa (17/10 tối, anh Khoa: "chú ý design, màu; cái nào chart được thì chart, table okay, chữ gọn").** Luận điểm mở bằng con số
  (`so`/`nhan`/`tieu`); thang kịch bản gọn (dải xấu→tốt, vạch cơ sở, chấm giá, giá mục tiêu CTCK ở làn dưới); `peKv`: P/E 2027E thị trường đang
  trả cho DMX và phần còn lại so với từng doanh nghiệp cùng ngành khu vực (chấm xám, vạch trung vị — `sotp.*.kv`); `cauLn` thác nước;
  `theoDoi` khoảng xấu–tốt + cùng kỳ + thực tế; `kichBan3` thanh chồng giá trị từng phần/cp + vạch giá hiện tại; `bangDinhGia` bảng cách tính
  (LN × P/E × sở hữu → tổng → trừ chiết khấu → ÷ cp); `peLichSu`; rủi ro có chip tác động (`tac`); thẩm định có thanh đếm. Màu: c1 xanh dương,
  c2 cam, c3 xanh lá đạt kiểm bảng màu (dataviz); **màu thứ 4 = xám** cho "khác"/bối cảnh — tím cũ gần trùng xanh dương (ΔE 10 mắt thường).
- **Bản 4 — báo cáo 2 trang (17/10 tối, anh Khoa: "bỏ đồng tình/không đồng tình với CTCK — tự kiểm bằng model rồi đẩy ý hợp lý lên; gộp Catalyst
  với Rủi ro; chung quy 2 trang: 1 tổng quan, 1 chi tiết; gửi ai cũng phải thấy như analyst thực thụ; nhớ tone màu của mình; chú ý headline").**
  Mã có hồ sơ: `#hsT1` = **Trang 1 Tổng quan** (`trang1`: dải xanh đầu trang, headline `tieu_de`, tiêu đề phụ `dong_mo`, luận điểm mở bằng con số,
  hộp khuyến nghị = mức của mô hình định lượng + giá trị hợp lý hồ sơ, thông tin cổ phiếu, tóm tắt dự phóng `tom_tat`, thang định giá, thị trường
  đang trả, LN theo mảng `ln_mang`, bảng **Catalyst & rủi ro** gộp `su_kien` theo thời gian, cột tác động `tac = [số, giải thích]`).
  **Trang 2 Chi tiết** đánh số: 1 mô hình dự phóng, 2 định giá, 3 vận hành, 4 vĩ mô → DN, 5 kế hoạch (`#hsB` = `trang2`), 6 sức khỏe tài chính
  (3 thẻ BCTC), 7 tín hiệu định lượng (`#ptDgO`) — 6 và 7 do `ptVe` chèn bằng `hs.muc()`; 8 tham khảo CTCK + nguồn (`#hsD` = `phanD`).
  Mục gập (Soi BCTC, Chấm điểm 5 năm) xuống "Phụ lục". Mã chưa có hồ sơ giữ bố cục cũ. Câu phụ thuộc giá có `dk: 'conlai_re'` (P/E phần ngoài
  công ty con < 90% trung vị khu vực) — sai thì hiện bản `khac`, để headline/luận điểm không nói ngược số khi giá chạy. Thẩm định CTCK đã bỏ;
  ý CTCK đúng (chất lượng LN, cầu kéo về sớm, biên dù iPhone, BHX ra Bắc) nằm trong luận điểm/sự kiện của trang.
- **Bản 5 — đúng 2 trang (17/10 tối, anh Khoa xem trên web: "sao mô hình dự phóng từ 1 đến 8 luôn vậy, tui kêu tóm gọn trong 2 trang thui").**
  Bỏ mục đánh số. `#hsT1` trang 1 như bản 4 (+ hộp khuyến nghị có 5 chip điều kiện và trạng thái Toàn cảnh khi TÍCH CỰC). `#hsT2` = `trang2`
  **gọn một trang**: dự phóng theo mảng | định giá tổng các phần (thanh 3 kịch bản + bảng cách tính) · giả định chính · cầu LN | độ nhạy | theo dõi quý
  · 4 biểu đồ vận hành (chế độ `gon`, ý của từng biểu đồ ở tooltip) · P/E lịch sử | kế hoạch & tiến độ · dòng nguồn. Mọi thứ khác gom vào **một**
  mục gập "Phụ lục" (`mucGap('ctpl')`): khung tín hiệu định lượng `#ptDgO`, 3 thẻ BCTC, `#hsD` = `phanD` (vận hành từng mảng, vĩ mô → DN,
  báo cáo CTCK, nguồn đầy đủ), Soi BCTC, Chấm điểm 5 năm. Trang web ~3.950 px cho cả 2 trang (bản 4: ~7.500 px).

- **Làm hàng loạt top 30 (17/10 tối, anh Khoa: "làm top 30 mã trước").** Mỗi mã một file Python kafi-core `research/ho-so/mo-hinh/<MA>.py`
  (`from chung import *`: `quy`, `cong_nam`, `so_cp(ma, True)`, `boi_so_lich_su(ma, 'P/E'|'P/B', cp_nay=)`, `dinh_gia`, `nhay_mot`, `pb_tu_roe`, `ghi`) →
  `hoso/<MA>.json`; `ghi()` tự chạy `research/ho-so/kiem.py` (lỗi thì không ghi). Quy tắc + khóa JSON: `research/ho-so/HUONG-DAN.md`; gói số liệu khởi đầu
  `research/ho-so/goi-so.py <MA>`. Mẫu theo loại: ngân hàng VCB (P/B × vốn chủ, kiểm chéo ROE), CTCK SSI, chu kỳ HPG, BĐS VHM, có liên kết niêm yết FPT,
  bán lẻ MWG. Mỗi mã do một tác tử riêng làm (đọc 2–5 báo cáo CTCK ở nhánh `ho-so-data`), ~35 phút; xong thì thêm mã vào `hoso/index.json`.
  Đợt thử 5 mã (FPT, VCB, SSI, VHM, HPG) xong 17/10. Bỏ VIC, VIX, VND, VCI, NVL, GEX (không có báo cáo CTCK trong 240 ngày).
  **Số cổ phiếu:** vốn điều lệ quý (`14110`) trễ sau thưởng/chia tách, có khi VNDirect chưa cập nhật cả quý sau (HPG Q2/2026 thiếu 10% thưởng) →
  `so_cp(ma, True)` chỉ **cảnh báo** (giá gốc/giá điều chỉnh, vốn hóa/giá bảng giá lệch), không tự quy đổi (vốn hóa/giá lệch ngày giá vài %: VHM chia 1:1
  ra ×1,93); số đúng lấy từ công bố. Khung định lượng (`phantich.js`/backtest) dùng ngưỡng 1,08 nên vẫn lệch với thưởng có ngày GDKHQ trước ngày kết
  thúc quý mà vốn điều lệ chưa đổi (HPG P/E 6,9 thay vì 7,55) — giữ nguyên để khớp backtest. `hoso.js`: `p.chia` [[ngày GDKHQ, hệ số]] tự quy đổi số trên
  1 cổ phiếu (đợt sau `cap_nhat`) và giá mục tiêu CTCK (đợt sau ngày báo cáo); `sotp.con` nhận danh sách (nhiều công ty con/liên kết niêm yết, giá sống);
  `ln_mang.tong_ten` cho cơ cấu thu nhập ngân hàng; `dk: 'up_duoi:x'` cho câu "đã vào giá". `23000` VNDirect có quý sai (SSI) — đối chiếu tài liệu.

## Số hiệu suất B★ tính ở đâu

`bstar_books.js` chỉ nướng sẵn đường đến hết năm trước (`BSTAR_CURVE.end`). Phần năm nay `bstarCurve()`
tính lại trên trình duyệt từ giá dchart của ~15 mã (`bstarLoadPrices`). Deal nào thiếu giá thì bị **bỏ khỏi
phép tính** → con số thấp hơn thật mà trông vẫn hợp lý. Đã sửa: tải 4 lô song song, hỏng thử lại 2 lần, nhớ
giá theo phiên (`kn_bstar_px`, chỉ ghi mã tải thành công), nhịp 2 phút tải lại cả mã còn thiếu, và
`BSTAR.thieu` để màn hình ghi "đang tải N mã" thay vì im lặng. Web và app dùng **cùng** `bstarCurve()`.
Kho giá `kn_bstar_px` giữ **qua ngày** (khoá `v2`, không theo phiên): lịch sử đến phiên trước không đổi, giá hôm nay
`bstarGia` lấy từ bảng giá; mã nào `lastd` < phiên trước mới tải lại. `thieu == null` = chưa tải xong lần đầu →
trang đầu ghi "· đang tính 2026…" (mở tab ẩn danh mất vài giây, lần sau ~0.3s). Số đúng là số khi `thieu` rỗng.

**Nướng lại 24/09/2026** (`kafi-core/research/nuong_bstar.mjs`, giá từ workflow `gia-bstar.yml` → nhánh `gia-bstar`):
chế độ `kiem` tái tạo sổ cũ khớp từng số (486,93 vs 486,94); chế độ `sua` = sổ cũ + **chỉ** sửa phần do ngày BCTC VNDirect:
thêm PVS/REE/DCM/CSV/IJC 2025, bỏ REE 18/08/2021 + PVP 30/07/2024 (nay là W). Kết quả: hết 2025 486,94 → 484,04%;
đến 24/09/2026 614,54 → **611,04%**, maxdd −9,05% giữ nguyên. (Con số 577% nói trước đó là SAI — lấy từ bản mô phỏng gần đúng.)
**Lỗi dữ liệu đã biết, chưa sửa:** engine lọc GTGD bằng giá dchart **đã điều chỉnh cổ tức** × KL → mỗi lần mã chia cổ tức,
GTGD quá khứ tụt, deal cũ có thể biến mất khỏi tín hiệu (DGC 29/12/2020, DGC 04/05/2021 +24,4%, PTB 17/09/2021 mất từ 05/09→24/09).
Vì vậy **đừng nướng sổ bằng chế độ `moi`** (lấy nguyên tín hiệu hiện tại) — nó dính luôn lỗi này. CMG không còn trong danh sách mã.

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
