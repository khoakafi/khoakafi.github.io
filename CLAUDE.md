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
