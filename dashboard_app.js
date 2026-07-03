// ---------------------------------------------------------------
// NGUỒN DỮ LIỆU GIÁ #1 (ưu tiên): VNDirect DChart API — dùng cho chính widget TradingView
// mà VNDirect nhúng trên dchart.vndirect.com.vn. Trả dữ liệu OHLCV nhiều năm, định dạng
// chuẩn TradingView UDF: {t:[...unix ts], o:[...], h:[...], l:[...], c:[...], v:[...], s:"ok"}
// ---------------------------------------------------------------
function tsToDateStr(ts){
  const d = new Date(ts * 1000);
  const pad = function(n){ return String(n).padStart(2, "0"); };
  return pad(d.getUTCDate()) + "/" + pad(d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();
}

function fetchVndirectHistory(ticker, years){
  const to = Math.floor(Date.now() / 1000);
  const from = to - (years || 2) * 365 * 86400;
  const url = "https://dchart-api.vndirect.com.vn/dchart/history?resolution=D&symbol="
    + encodeURIComponent(ticker) + "&from=" + from + "&to=" + to;
  return fetch(url).then(function(r){ return r.json(); }).then(function(json){
    if(!json || json.s !== "ok" || !json.t || !json.t.length){
      throw new Error("Không có dữ liệu từ VNDirect cho mã " + ticker);
    }
    return json.t.map(function(ts, i){
      return {
        date: tsToDateStr(ts),
        open: json.o[i],
        high: json.h[i],
        low: json.l[i],
        close: json.c[i],
        volume: json.v[i],
        change: null
      };
    });
  });
}

// ---------------------------------------------------------------
// NGUỒN DỮ LIỆU GIÁ #2 (dự phòng): CafeF.vn — chỉ lưu ~60-65 phiên gần nhất (≈3 tháng)
// qua endpoint công khai này, dùng khi VNDirect không truy cập được.
// ---------------------------------------------------------------
function fetchCafefHistory(ticker){
  const CAFEF_PAGE_SIZE = 20;
  const MAX_PAGES = 8; // an toàn: tối đa 160 phiên
  function fetchPage(page){
    const url = "https://cafef.vn/du-lieu/ajax/pagenew/datahistory/pricehistory.ashx?Symbol="
      + encodeURIComponent(ticker) + "&StartDate=&EndDate=&PageIndex=" + page + "&PageSize=" + CAFEF_PAGE_SIZE;
    return fetch(url).then(function(r){ return r.json(); });
  }
  return fetchPage(1).then(function(first){
    if(!first || !first.Success || !first.Data || !first.Data.Data || !first.Data.Data.length){
      throw new Error("Không có dữ liệu từ CafeF cho mã " + ticker);
    }
    const total = first.Data.TotalCount || first.Data.Data.length;
    const totalPages = Math.min(MAX_PAGES, Math.ceil(total / CAFEF_PAGE_SIZE));
    let rows = first.Data.Data.slice();
    const extraPages = [];
    for(let p = 2; p <= totalPages; p++) extraPages.push(p);
    return extraPages.reduce(function(chain, page){
      return chain.then(function(){
        return fetchPage(page).then(function(json){
          if(json && json.Success && json.Data && json.Data.Data && json.Data.Data.length){
            rows = rows.concat(json.Data.Data);
          }
        }).catch(function(){ /* bỏ qua trang lỗi, vẫn dùng dữ liệu đã có */ });
      });
    }, Promise.resolve()).then(function(){
      return rows.reverse().map(function(r){
        return {
          date: r.Ngay,
          open: r.GiaMoCua,
          high: r.GiaCaoNhat,
          low: r.GiaThapNhat,
          close: r.GiaDongCua,
          volume: r.KhoiLuongKhopLenh,
          change: r.ThayDoi
        };
      });
    });
  });
}

// ---------------------------------------------------------------
// Gộp 2 nguồn: thử VNDirect trước (nhiều năm dữ liệu), rớt xuống CafeF nếu lỗi (~3 tháng)
// ---------------------------------------------------------------
function fetchStockHistory(ticker){
  return fetchVndirectHistory(ticker, 2).then(function(data){
    return { source: "VNDirect", data: data };
  }).catch(function(){
    return fetchCafefHistory(ticker).then(function(data){
      return { source: "CafeF", data: data };
    });
  });
}

function drawCandlestickChart(canvas, data){
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const W = rect.width, H = rect.height;
  ctx.clearRect(0, 0, W, H);

  const padLeft = 6, padRight = 58, padTop = 10, padBottom = 18;
  const priceH = (H - padTop - padBottom) * 0.72;
  const volTop = padTop + priceH + 16;
  const volH = H - volTop - padBottom;
  const plotW = W - padLeft - padRight;

  const highs = data.map(function(d){ return d.high; });
  const lows = data.map(function(d){ return d.low; });
  const maxP = Math.max.apply(null, highs);
  const minP = Math.min.apply(null, lows);
  const priceRange = (maxP - minP) || 1;
  const maxV = Math.max.apply(null, data.map(function(d){ return d.volume; }).concat([1]));

  const n = data.length;
  const slot = plotW / n;
  const candleW = Math.max(1.5, slot * 0.62);

  function yPrice(p){ return padTop + (1 - (p - minP) / priceRange) * priceH; }
  function yVolTop(v){ return volTop + volH - (v / maxV) * volH; }

  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.fillStyle = "#6b7280";
  ctx.font = "10px -apple-system,Segoe UI,Roboto,sans-serif";
  const gridLines = 4;
  for(let i = 0; i <= gridLines; i++){
    const p = minP + (priceRange * i / gridLines);
    const y = yPrice(p);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(W - padRight, y);
    ctx.stroke();
    ctx.fillText(p.toFixed(1), W - padRight + 4, y + 3);
  }

  data.forEach(function(d, i){
    const x = padLeft + i * slot + slot / 2;
    const up = d.close >= d.open;
    const color = up ? "#16a34a" : "#dc2626";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, yPrice(d.high));
    ctx.lineTo(x, yPrice(d.low));
    ctx.stroke();
    const yO = yPrice(d.open), yC = yPrice(d.close);
    const bodyTop = Math.min(yO, yC);
    const bodyH = Math.max(1, Math.abs(yC - yO));
    ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);

    ctx.fillStyle = up ? "rgba(22,163,74,0.55)" : "rgba(220,38,38,0.55)";
    const vy = yVolTop(d.volume);
    ctx.fillRect(x - candleW / 2, vy, candleW, (volTop + volH) - vy);
  });

  ctx.fillStyle = "#6b7280";
  [0, Math.floor(n / 2), n - 1].forEach(function(i){
    if(!data[i]) return;
    const x = padLeft + i * slot + slot / 2;
    ctx.fillText(data[i].date.slice(0, 5), Math.max(padLeft, x - 14), H - 3);
  });
}

// ---------------------------------------------------------------
// PAN / ZOOM: kéo chuột để di chuyển, cuộn chuột hoặc nút +/- để phóng to/thu nhỏ
// ---------------------------------------------------------------
function setupInteractiveChart(canvas, fullData, defaultViewCount){
  const MIN_VIEW = 10;
  const DEFAULT_VIEW = defaultViewCount || Math.min(40, fullData.length);
  let viewCount = Math.min(DEFAULT_VIEW, fullData.length);
  let viewStart = fullData.length - viewCount;

  function clamp(){
    viewCount = Math.max(MIN_VIEW, Math.min(fullData.length, viewCount));
    viewStart = Math.max(0, Math.min(fullData.length - viewCount, viewStart));
  }

  function redraw(){
    clamp();
    drawCandlestickChart(canvas, fullData.slice(viewStart, viewStart + viewCount));
    const rangeLabel = document.getElementById("candleRangeLabel");
    if(rangeLabel){
      const shown = fullData.slice(viewStart, viewStart + viewCount);
      rangeLabel.innerText = shown.length ? (shown[0].date + " → " + shown[shown.length - 1].date) : "";
    }
  }

  function zoom(factor){
    const center = viewStart + viewCount / 2;
    viewCount = Math.round(viewCount * factor);
    viewStart = Math.round(center - viewCount / 2);
    redraw();
  }

  function pan(deltaCandles){
    viewStart += deltaCandles;
    redraw();
  }

  let dragging = false, dragStartX = 0, dragStartView = 0;
  canvas.addEventListener("mousedown", function(e){
    dragging = true;
    dragStartX = e.clientX;
    dragStartView = viewStart;
    canvas.style.cursor = "grabbing";
  });
  window.addEventListener("mousemove", function(e){
    if(!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const pxPerCandle = rect.width / viewCount;
    const deltaCandles = Math.round((dragStartX - e.clientX) / pxPerCandle);
    viewStart = dragStartView + deltaCandles;
    redraw();
  });
  window.addEventListener("mouseup", function(){
    dragging = false;
    canvas.style.cursor = "grab";
  });
  canvas.style.cursor = "grab";

  canvas.addEventListener("wheel", function(e){
    e.preventDefault();
    zoom(e.deltaY > 0 ? 1.15 : 0.87);
  }, { passive: false });

  // touch support (kéo trên di động)
  let touchStartX = 0, touchStartView = 0;
  canvas.addEventListener("touchstart", function(e){
    if(e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartView = viewStart;
  }, { passive: true });
  canvas.addEventListener("touchmove", function(e){
    if(e.touches.length !== 1) return;
    const rect = canvas.getBoundingClientRect();
    const pxPerCandle = rect.width / viewCount;
    const deltaCandles = Math.round((touchStartX - e.touches[0].clientX) / pxPerCandle);
    viewStart = touchStartView + deltaCandles;
    redraw();
  }, { passive: true });

  const zoomInBtn = document.getElementById("candleZoomIn");
  const zoomOutBtn = document.getElementById("candleZoomOut");
  const resetBtn = document.getElementById("candleReset");
  if(zoomInBtn) zoomInBtn.onclick = function(){ zoom(0.8); };
  if(zoomOutBtn) zoomOutBtn.onclick = function(){ zoom(1.25); };
  if(resetBtn) resetBtn.onclick = function(){
    viewCount = Math.min(DEFAULT_VIEW, fullData.length);
    viewStart = fullData.length - viewCount;
    redraw();
  };
  document.querySelectorAll(".candle-range-btn").forEach(function(btn){
    btn.onclick = function(){
      const want = btn.dataset.range === "all" ? fullData.length : parseInt(btn.dataset.range, 10);
      viewCount = Math.min(want, fullData.length);
      viewStart = fullData.length - viewCount;
      redraw();
      document.querySelectorAll(".candle-range-btn").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
    };
  });

  window.addEventListener("resize", redraw);
  redraw();
}

function renderChartFallback(ticker){
  const tvSymbolUrl = "https://www.tradingview.com/symbols/HOSE-" + ticker + "/";
  const tvChartUrl = "https://www.tradingview.com/chart/?symbol=HOSE%3A" + ticker;
  const cafefUrl = "https://cafef.vn/du-lieu/lich-su-giao-dich/hose/" + ticker.toLowerCase() + "-1.chn";
  document.getElementById("chartContainer").innerHTML =
    '<div class="chart-fallback">' +
      '<div class="chart-fallback-icon">📈</div>' +
      '<div class="chart-fallback-title">Không tải được biểu đồ HOSE:' + ticker + '</div>' +
      '<div class="chart-fallback-note">Không lấy được dữ liệu giá từ cả VNDirect và CafeF ngay lúc này (có thể do trình duyệt chặn request liên miền khi mở file trực tiếp). Bấm nút bên dưới để xem biểu đồ đầy đủ.</div>' +
      '<div class="chart-fallback-actions">' +
        '<a href="' + cafefUrl + '" target="_blank" rel="noopener" class="chart-btn chart-btn-primary">Xem trên CafeF ↗</a>' +
        '<a href="' + tvChartUrl + '" target="_blank" rel="noopener" class="chart-btn">Xem trên TradingView ↗</a>' +
      '</div>' +
    '</div>';
}

// ---------------------------------------------------------------
// SỨC MẠNH GIÁ (RELATIVE STRENGTH) SO VỚI VN-INDEX
// ---------------------------------------------------------------
let _vnindexPromise = null;
function fetchVnindexHistory(){
  if(!_vnindexPromise){
    _vnindexPromise = fetchVndirectHistory("VNINDEX", 2).catch(function(){ return null; });
  }
  return _vnindexPromise;
}

function pctReturn(data, sessionsAgo){
  if(!data || data.length <= sessionsAgo) return null;
  const last = data[data.length - 1].close;
  const prev = data[data.length - 1 - sessionsAgo].close;
  if(!prev) return null;
  return ((last / prev) - 1) * 100;
}

function fmtPct(v){
  if(v === null || v === undefined || isNaN(v)) return "--";
  const sign = v > 0 ? "+" : "";
  return sign + v.toFixed(1) + "%";
}

function renderRelativeStrength(ticker, stockData){
  const box = document.getElementById("rsBody");
  if(!box) return;
  fetchVnindexHistory().then(function(vnData){
    const periods = [
      {label:"1 tháng", n:20},
      {label:"3 tháng", n:65},
      {label:"6 tháng", n:130}
    ];
    let rows = "";
    let outCount = 0, validCount = 0;
    periods.forEach(function(p){
      const stockRet = pctReturn(stockData, p.n);
      const idxRet = vnData ? pctReturn(vnData, p.n) : null;
      let stockCell = '<span>' + fmtPct(stockRet) + '</span>';
      let idxCell = idxRet !== null ? ' <span style="color:var(--muted)">(VNI ' + fmtPct(idxRet) + ')</span>' : '';
      if(stockRet !== null && idxRet !== null){
        validCount++;
        const outperform = stockRet > idxRet;
        if(outperform) outCount++;
        stockCell = '<span class="' + (outperform ? "rs-strong" : "rs-weak") + '">' + fmtPct(stockRet) + '</span>';
      }
      rows += '<div class="rs-row"><span>' + p.label + '</span><span>' + stockCell + idxCell + '</span></div>';
    });
    let verdict = "";
    if(validCount > 0){
      const strong = outCount >= Math.ceil(validCount / 2) + (validCount > 2 ? 1 : 0);
      const ratio = outCount / validCount;
      if(ratio >= 0.66){
        verdict = '<div class="rs-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:8px;"><span>Đánh giá</span><span class="rs-strong">Mạnh hơn thị trường</span></div>';
      } else if(ratio <= 0.33){
        verdict = '<div class="rs-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:8px;"><span>Đánh giá</span><span class="rs-weak">Yếu hơn thị trường</span></div>';
      } else {
        verdict = '<div class="rs-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:8px;"><span>Đánh giá</span><span>Tương đương thị trường</span></div>';
      }
    }
    box.innerHTML = rows + verdict + (vnData ? "" : '<div class="pattern-note">Không lấy được dữ liệu VN-Index để so sánh.</div>');
  });
}

// ---------------------------------------------------------------
// TRADINGVIEW TECHNICAL ANALYSIS WIDGET + CAFEF CANDLESTICK CHART
// ---------------------------------------------------------------
function renderCharts(ticker){
  document.getElementById("chartSymbolLabel").innerText = "HOSE:" + ticker;
  document.getElementById("chartContainer").innerHTML = '<div class="chart-loading">Đang tải dữ liệu giá (VNDirect → CafeF)…</div>';
  const techBoxInit = document.getElementById("techBody");
  if(techBoxInit) techBoxInit.innerHTML = '<div class="empty-state">Đang tính toán...</div>';
  const rsBoxInit = document.getElementById("rsBody");
  if(rsBoxInit) rsBoxInit.innerHTML = '<div class="empty-state">Đang tính toán...</div>';

  fetchStockHistory(ticker).then(function(result){
    const data = result.data;
    if(!data || data.length < 5) throw new Error("Dữ liệu quá ít");
    const latest = data[data.length - 1];
    const cafefUrl = "https://cafef.vn/du-lieu/lich-su-giao-dich/hose/" + ticker.toLowerCase() + "-1.chn";
    const rangeNote = result.source === "VNDirect"
      ? (data.length + " phiên (~" + Math.round(data.length / 21) + " tháng)")
      : (data.length + " phiên khả dụng, ~3 tháng gần nhất — VNDirect không truy cập được nên dùng CafeF)");
    document.getElementById("chartContainer").innerHTML =
      '<div class="candle-wrap">' +
        '<div class="candle-toolbar">' +
          '<div class="candle-summary">Đóng cửa gần nhất (' + latest.date + '): <b>' + latest.close + '</b>' +
            (latest.change ? ' <span class="candle-change">(' + latest.change + ')</span>' : '') +
          '</div>' +
          '<div class="candle-controls">' +
            '<button class="candle-range-btn" data-range="20">1T</button>' +
            '<button class="candle-range-btn" data-range="65">3T</button>' +
            '<button class="candle-range-btn active" data-range="130">6T</button>' +
            '<button class="candle-range-btn" data-range="260">1N</button>' +
            '<button class="candle-range-btn" data-range="all">Tất cả</button>' +
            '<span class="candle-sep"></span>' +
            '<button id="candleZoomOut" class="candle-icon-btn" title="Thu nhỏ">−</button>' +
            '<button id="candleZoomIn" class="candle-icon-btn" title="Phóng to">+</button>' +
            '<button id="candleReset" class="candle-icon-btn" title="Đặt lại">⟳</button>' +
          '</div>' +
        '</div>' +
        '<canvas id="candleCanvas"></canvas>' +
        '<div class="candle-footer">Nguồn: ' + result.source + ' • <span id="candleRangeLabel"></span> (' + rangeNote + ') • Kéo chuột để di chuyển, cuộn để zoom • ' +
          '<a href="' + cafefUrl + '" target="_blank" rel="noopener">Xem lịch sử trên CafeF ↗</a></div>' +
      '</div>';
    const canvas = document.getElementById("candleCanvas");
    requestAnimationFrame(function(){ setupInteractiveChart(canvas, data, 130); });
    renderRelativeStrength(ticker, data);
    renderTechnicalSignal(ticker, data);
  }).catch(function(err){
    renderChartFallback(ticker);
    const rsBox = document.getElementById("rsBody");
    if(rsBox) rsBox.innerHTML = '<div class="empty-state">Không có dữ liệu giá để tính sức mạnh giá.</div>';
    const techBox = document.getElementById("techBody");
    if(techBox) techBox.innerHTML = '<div class="empty-state">Không có dữ liệu giá để tính tín hiệu kỹ thuật.</div>';
  });
}

// ---------------------------------------------------------------
// TÍN HIỆU KỸ THUẬT TỰ TÍNH (thay cho widget TradingView cũ)
// Xu hướng: vị trí giá so với MA20/MA50. Động lượng: RSI14 (xấp xỉ, dựa trên
// trung bình tăng/giảm giản đơn của 14 phiên gần nhất, không phải RSI Wilder
// đầy đủ). Hỗ trợ/kháng cự: đáy/đỉnh trong ~65 phiên gần nhất (~3 tháng).
// Đây là tín hiệu tham khảo tự động, không phải khuyến nghị đầu tư.
// ---------------------------------------------------------------
function computeSMA(closes, period){
  if(!closes || closes.length < period) return null;
  const slice = closes.slice(closes.length - period);
  return slice.reduce(function(a, b){ return a + b; }, 0) / period;
}

function computeRSI(closes, period){
  if(!closes || closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for(let i = closes.length - period; i < closes.length; i++){
    const diff = closes[i] - closes[i - 1];
    if(diff >= 0) gains += diff; else losses += -diff;
  }
  const avgGain = gains / period, avgLoss = losses / period;
  if(avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function computeSupportResistance(data, lookback){
  const n = Math.min(lookback, data.length);
  const slice = data.slice(data.length - n);
  let lo = Infinity, hi = -Infinity;
  slice.forEach(function(d){
    const lowVal = Number(d.low), highVal = Number(d.high);
    if(!isNaN(lowVal) && lowVal < lo) lo = lowVal;
    if(!isNaN(highVal) && highVal > hi) hi = highVal;
  });
  return { support: lo === Infinity ? null : lo, resistance: hi === -Infinity ? null : hi, sessions: n };
}

function fmtTechPrice(v){
  if(v === null || v === undefined || isNaN(v)) return "--";
  return Number(v).toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}

function renderTechnicalSignal(ticker, data){
  const box = document.getElementById("techBody");
  if(!box) return;
  const closes = data.map(function(d){ return Number(d.close); }).filter(function(v){ return !isNaN(v); });
  if(closes.length < 20){
    box.innerHTML = '<div class="empty-state">Chưa đủ dữ liệu giá để tính tín hiệu kỹ thuật.</div>';
    return;
  }
  const price = closes[closes.length - 1];
  const ma20 = computeSMA(closes, 20);
  const ma50 = computeSMA(closes, 50);
  const rsi = computeRSI(closes, 14);

  let trendLabel, trendUp;
  if(ma50 !== null){
    if(price > ma20 && price > ma50){ trendLabel = "Tăng"; trendUp = true; }
    else if(price < ma20 && price < ma50){ trendLabel = "Giảm"; trendUp = false; }
    else { trendLabel = "Đi ngang / chưa rõ"; trendUp = null; }
  } else if(ma20 !== null){
    trendLabel = price > ma20 ? "Tăng" : "Giảm";
    trendUp = price > ma20;
  } else {
    trendLabel = "--"; trendUp = null;
  }

  let momLabel, momUp;
  if(rsi === null){ momLabel = "--"; momUp = null; }
  else if(rsi >= 55){ momLabel = "Mạnh (RSI " + rsi.toFixed(0) + ")"; momUp = true; }
  else if(rsi <= 45){ momLabel = "Yếu (RSI " + rsi.toFixed(0) + ")"; momUp = false; }
  else { momLabel = "Trung tính (RSI " + rsi.toFixed(0) + ")"; momUp = null; }

  let verdict, verdictClass;
  if(trendUp === true && momUp !== false){ verdict = "MUA / TÍCH LŨY"; verdictClass = "tech-buy"; }
  else if(trendUp === false && momUp !== true){ verdict = "BÁN / TRÁNH MUA MỚI"; verdictClass = "tech-sell"; }
  else { verdict = "ĐỨNG NGOÀI / QUAN SÁT"; verdictClass = "tech-neutral"; }

  const sr = computeSupportResistance(data, 65);
  const supportPct = (sr.support !== null) ? ((price - sr.support) / price * 100) : null;
  const resistancePct = (sr.resistance !== null) ? ((sr.resistance - price) / price * 100) : null;

  const trendDetail = (ma20 !== null)
    ? ('Giá ' + fmtTechPrice(price) + ' so với MA20 ' + fmtTechPrice(ma20) + (ma50 !== null ? (' / MA50 ' + fmtTechPrice(ma50)) : ''))
    : '';

  box.innerHTML =
    '<div class="tech-verdict-badge ' + verdictClass + '">' + verdict + '</div>' +
    '<div class="tech-row"><span>Xu hướng</span><span>' + trendLabel + '</span></div>' +
    (trendDetail ? ('<div class="tech-row"><span></span><span>' + trendDetail + '</span></div>') : '') +
    '<div class="tech-row"><span>Động lượng</span><span>' + momLabel + '</span></div>' +
    '<div class="tech-row"><span>Hỗ trợ gần nhất</span><span>' + fmtTechPrice(sr.support) + (supportPct !== null ? (' (-' + supportPct.toFixed(1) + '%)') : '') + '</span></div>' +
    '<div class="tech-row"><span>Kháng cự gần nhất</span><span>' + fmtTechPrice(sr.resistance) + (resistancePct !== null ? (' (+' + resistancePct.toFixed(1) + '%)') : '') + '</span></div>';
}

// ---------------------------------------------------------------
// RENDER CANSLIM + CATALYST PANEL
// ---------------------------------------------------------------
const LETTER_LABEL = {
  C:"Current earnings (LN quý gần nhất)",
  A:"Annual earnings growth (Tăng trưởng LN năm)",
  N:"New (SP mới / quản lý mới / vùng giá đỉnh mới)",
  S:"Supply & Demand (Cung cầu / thanh khoản)",
  L:"Leader or Laggard (Vị thế dẫn dắt ngành)",
  I:"Institutional Sponsorship (Sở hữu tổ chức/khối ngoại)",
  M:"Market direction (Xu hướng thị trường chung / ngành)"
};
const VERDICT_LABEL = {buy:"MUA / TÍCH LŨY", watch:"THEO DÕI", avoid:"ĐỨNG NGOÀI"};
const VERDICT_CLASS = {buy:"badge-buy", watch:"badge-watch", avoid:"badge-avoid"};

function ratingToClass(rating){
  const r = (rating || "").toLowerCase();
  if(r.indexOf("bán") >= 0) return "avoid";
  if(r.indexOf("trung lập") >= 0 || r.indexOf("nắm giữ") >= 0 || r.indexOf("theo dõi") >= 0 || r.indexOf("phù hợp thị trường") >= 0 || r === "khác") return "watch";
  if(r.indexOf("mua") >= 0 || r.indexOf("khả quan") >= 0 || r.indexOf("tích cực") >= 0 || r.indexOf("tăng tỷ trọng") >= 0 || r.indexOf("outperform") >= 0) return "buy";
  return "none";
}

function renderValuations(ticker){
  const topData = TOP_ANALYSIS[ticker];
  const extraList = (typeof VALUATIONS_EXTRA !== "undefined") ? VALUATIONS_EXTRA[ticker] : undefined;
  const data = (topData && topData.valuations && topData.valuations.length) ? topData : (extraList ? {valuations: extraList} : null);
  const body = document.getElementById("valuationBody");
  if(!data || !data.valuations || !data.valuations.length){
    body.innerHTML = '<div class="empty-state">Chưa tổng hợp định giá từ CTCK cho mã này trong phiên bản hiện tại của dashboard.</div>';
    return;
  }

  const numericTargets = data.valuations
    .map(function(v){ return parseFloat(String(v.target).replace(/\./g, "").replace(",", ".")); })
    .filter(function(n){ return !isNaN(n); });

  const rows = data.valuations.map(function(v){
    const cls = ratingToClass(v.rating);
    const dlBtn = v.url ? '<a href="' + v.url + '" target="_blank" rel="noopener" class="valuation-dl-btn" title="Xem/tải báo cáo gốc">Tải ↗</a>' : '—';
    return '<tr>' +
      '<td>' + (v.date || "—") + '</td>' +
      '<td>' + v.ctck + '</td>' +
      '<td><span class="valuation-rating ' + cls + '">' + v.rating + '</span></td>' +
      '<td class="valuation-target">' + v.target + (v.target !== "—" && /[0-9]/.test(v.target) ? ' nghìn đ' : '') + '</td>' +
      '<td class="valuation-upside">' + v.upside + '</td>' +
      '<td>' + dlBtn + '</td>' +
    '</tr>';
  }).join("");

  let avgHtml = "";
  if(numericTargets.length > 1){
    const avg = numericTargets.reduce(function(a, b){ return a + b; }, 0) / numericTargets.length;
    const min = Math.min.apply(null, numericTargets);
    const max = Math.max.apply(null, numericTargets);
    avgHtml = '<div class="valuation-avg">Giá mục tiêu trung bình (' + numericTargets.length + ' CTCK): <b>' +
      avg.toFixed(1) + '</b> nghìn đ &nbsp;•&nbsp; Khoảng: ' + min.toFixed(1) + ' – ' + max.toFixed(1) + ' nghìn đ</div>';
  }

  document.getElementById("valuationBody").innerHTML =
    '<table class="valuation-table"><thead><tr>' +
      '<th>Ngày</th><th>CTCK</th><th>Khuyến nghị</th><th>Giá mục tiêu</th><th>Upside</th><th>Báo cáo</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table>' + avgHtml;
}

function fmtFundNum(v){
  if(v === null || v === undefined || isNaN(v)) return "--";
  return Number(v).toLocaleString("vi-VN", {maximumFractionDigits:1});
}
function fmtFundPct(v){
  if(v === null || v === undefined || isNaN(v)) return "--";
  const cls = v >= 0 ? "fund-up" : "fund-down";
  const sign = v > 0 ? "+" : "";
  return '<span class="' + cls + '">' + sign + v.toFixed(1) + '%</span>';
}
function fmtFundRatio(v){
  if(v === null || v === undefined || isNaN(v)) return "--";
  return Number(v).toLocaleString("vi-VN", {maximumFractionDigits:2});
}

function renderFundamentals(ticker){
  const body = document.getElementById("fundamentalsBody");
  if(!body) return;
  const fd = FUNDAMENTALS[ticker];
  if(!fd || !fd.quarters || !fd.quarters.length){
    body.innerHTML = '<div class="empty-state">Mã này chưa có dữ liệu cơ bản theo quý trong phiên bản hiện tại của dashboard.</div>';
    return;
  }
  const revLabel = fd.isBank ? "Tổng thu nhập HĐ (tỷ)" : "Doanh thu (tỷ)";

  // Tính trend (tăng tốc/giảm tốc) cho từng quý dựa trên %YoY LNST so với quý liền trước
  const trends = fd.quarters.map(function(q, i){
    const prev = fd.quarters[i - 1];
    if(!prev || q.yoyProfit === null || q.yoyProfit === undefined || prev.yoyProfit === null || prev.yoyProfit === undefined){
      return '<span class="fund-trend flat">--</span>';
    }
    const diff = q.yoyProfit - prev.yoyProfit;
    if(diff > 3) return '<span class="fund-trend accel">Tăng tốc ▲</span>';
    if(diff < -3) return '<span class="fund-trend decel">Giảm tốc ▼</span>';
    return '<span class="fund-trend flat">Đi ngang</span>';
  });

  // Bảng ngang: cột = quý, hàng = chỉ tiêu
  const quarterHeaderCells = fd.quarters.map(function(q){ return '<th>' + q.quarter + '</th>'; }).join("");
  const revCells = fd.quarters.map(function(q){ return '<td>' + fmtFundNum(q.revenue) + '</td>'; }).join("");
  const profitCells = fd.quarters.map(function(q){ return '<td>' + fmtFundNum(q.profit) + '</td>'; }).join("");
  const yoyRevCells = fd.quarters.map(function(q){ return '<td>' + fmtFundPct(q.yoyRevenue) + '</td>'; }).join("");
  const yoyProfitCells = fd.quarters.map(function(q){ return '<td>' + fmtFundPct(q.yoyProfit) + '</td>'; }).join("");
  const trendCells = trends.map(function(t){ return '<td>' + t + '</td>'; }).join("");
  const hasROE = fd.quarters.some(function(q){ return q.roe !== undefined && q.roe !== null; });
  const roeCells = fd.quarters.map(function(q){ return '<td>' + fmtFundPct(q.roe) + '</td>'; }).join("");
  const roeRow = hasROE ? ('<tr><td>ROE (%)</td>' + roeCells + '</tr>') : "";

  // P/E, P/B theo từng quý (chỉ có với các mã không phải NH, và riêng MBB trong nhóm NH)
  const hasQuarterlyPB = fd.quarters.some(function(q){ return q.pe !== undefined && q.pe !== null; });
  const peCells = fd.quarters.map(function(q){ return '<td>' + fmtFundRatio(q.pe) + '</td>'; }).join("");
  const pbCells = fd.quarters.map(function(q){ return '<td>' + fmtFundRatio(q.pb) + '</td>'; }).join("");
  const pebRows = hasQuarterlyPB ?
    ('<tr><td>P/E</td>' + peCells + '</tr>' + '<tr><td>P/B</td>' + pbCells + '</tr>') : "";

  const hasCurrentStats = (fd.currentPE !== undefined && fd.currentPE !== null) ||
    (fd.currentPB !== undefined && fd.currentPB !== null) ||
    (fd.currentROE !== undefined && fd.currentROE !== null);
  const pebHeader = hasCurrentStats ?
    ('<div class="fund-note" style="margin-bottom:8px;font-style:normal;">' +
      'P/E hiện tại: <b style="color:var(--text);">' + (fd.currentPE || "--") + '</b>' +
      ' &nbsp;•&nbsp; P/B hiện tại: <b style="color:var(--text);">' + (fd.currentPB || "--") + '</b>' +
      ' &nbsp;•&nbsp; ROE hiện tại (TTM): <b style="color:var(--text);">' + (fd.currentROE !== undefined && fd.currentROE !== null ? fd.currentROE + "%" : "--") + '</b>' +
      (hasQuarterlyPB ? '' : ' <span style="opacity:.7;">(ngân hàng này không có P/E, P/B theo quý trong dữ liệu nguồn)</span>') +
    '</div>') : "";

  body.innerHTML = pebHeader +
    '<div class="fund-table-wrap"><table class="fund-table fund-table-h"><thead><tr>' +
      '<th>Quý</th>' + quarterHeaderCells +
    '</tr></thead><tbody>' +
      '<tr><td>' + revLabel + '</td>' + revCells + '</tr>' +
      '<tr><td>LNST (tỷ)</td>' + profitCells + '</tr>' +
      '<tr><td>%YoY DT</td>' + yoyRevCells + '</tr>' +
      '<tr><td>%YoY LN</td>' + yoyProfitCells + '</tr>' +
      roeRow +
      '<tr><td>Xu hướng LN</td>' + trendCells + '</tr>' +
      pebRows +
    '</tbody></table></div>' +
    '<div class="fund-note">Nguồn: KAFI X (dữ liệu FiinTrade/FiinGroup), truy xuất trực tiếp qua tài khoản người dùng. ' +
      (fd.isBank ? 'Chỉ tiêu "doanh thu" của ngân hàng là Thu nhập lãi thuần. ' : '') +
      'Ô "--" là quý nguồn chưa công bố. ' +
      (hasQuarterlyPB ? '' : 'Nhóm ngân hàng này không có P/E, P/B theo quý trong mẫu chỉ số của nguồn — chỉ hiển thị số hiện tại ở trên. ') +
      (hasROE ? '' : 'Mã này chưa có dữ liệu ROE theo quý. ') +
      '"Tăng tốc/Giảm tốc" so sánh %YoY LNST quý này với quý liền trước.' +
    '</div>';
}

function renderAnalysis(ticker){
  const data = TOP_ANALYSIS[ticker];
  const verdictEl = document.getElementById("verdictBadge");
  const verdictBigEl = document.getElementById("verdictBadgeBig");
  const priceTargetEl = document.getElementById("priceTarget");
  const canslimBody = document.getElementById("canslimBody");
  const catalystBody = document.getElementById("catalystBody");

  if(!data){
    verdictEl.className = "badge badge-none";
    verdictEl.innerText = "Chưa phân tích chuyên sâu";
    verdictBigEl.className = "badge badge-none";
    verdictBigEl.innerText = "Chưa có dữ liệu CANSLIM";
    priceTargetEl.innerText = "";
    canslimBody.innerHTML = '<div class="empty-state">Mã này chưa nằm trong nhóm được nghiên cứu CANSLIM chuyên sâu. Xem chart và chỉ báo kỹ thuật tự động ở trên, hoặc yêu cầu phân tích thêm cho mã cụ thể này.</div>';
    catalystBody.innerHTML = '<div class="empty-state">Chưa có catalyst tổng hợp từ CTCK cho mã này trong phiên bản hiện tại của dashboard.</div>';
    renderValuations(ticker);
    renderFundamentals(ticker);
    return;
  }

  verdictEl.className = "badge " + VERDICT_CLASS[data.verdict];
  verdictEl.innerText = VERDICT_LABEL[data.verdict];
  verdictBigEl.className = "badge " + VERDICT_CLASS[data.verdict];
  verdictBigEl.innerText = VERDICT_LABEL[data.verdict];
  priceTargetEl.innerHTML = data.target;

  canslimBody.innerHTML = Object.keys(LETTER_LABEL).map(k => `
    <div class="canslim-row">
      <div class="canslim-letter">${k}</div>
      <div><b>${LETTER_LABEL[k]}:</b> ${data.canslim[k]}</div>
    </div>
  `).join("");

  const catList = data.catalysts.map(c => `<li>${c}</li>`).join("");
  const srcList = data.sources.map(s => `<li><a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a></li>`).join("");
  catalystBody.innerHTML = `<ul class="catalyst-list">${catList}</ul><ul class="source-list">${srcList}</ul>`;

  renderValuations(ticker);
  renderFundamentals(ticker);
}

// ---------------------------------------------------------------
// INIT UI
// ---------------------------------------------------------------
const select = document.getElementById("tickerSelect");
VN100.forEach(([code,name]) => {
  const opt = document.createElement("option");
  opt.value = code;
  opt.innerText = `${code} - ${name}${TOP_ANALYSIS[code] ? " ★" : ""}`;
  select.appendChild(opt);
});

const topChipsEl = document.getElementById("topChips");
Object.keys(TOP_ANALYSIS).forEach(code => {
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.innerText = code;
  chip.onclick = () => selectTicker(code);
  chip.id = "chip-" + code;
  topChipsEl.appendChild(chip);
});

function selectTicker(ticker){
  select.value = ticker;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  const activeChip = document.getElementById("chip-" + ticker);
  if(activeChip) activeChip.classList.add("active");
  renderCharts(ticker);
  renderAnalysis(ticker);
}

select.addEventListener("change", () => selectTicker(select.value));

// Mặc định mở HPG khi tải trang
selectTicker("HPG");
