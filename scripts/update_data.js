// Auto-update dashboard_data.js — chay boi GitHub Actions moi ngay sau phien
// Port tu logic "Cap nhat du lieu" cua dashboard_app.js. Giu nguyen khoi tpn (hieu suat).
const fs = require('fs');

const REV = ['isa3','isb27','isi64','nos689','nos693'], NPAT = ['isa22','isa20'];
const pick = (row, codes) => { for (const c of codes) if (row && row[c] != null) return row[c]; return null; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function jget(u, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(u, { headers: { 'accept': 'application/json', 'user-agent': 'Mozilla/5.0' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } catch (e) { if (i === tries - 1) throw e; await sleep(800 * (i + 1)); }
  }
}

function sma(a, n) { return a.length >= n ? a.slice(-n).reduce((x, y) => x + y, 0) / n : null; }
function rsiLast(c, n = 14) {
  if (c.length < n + 1) return null;
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) { const d = c[i] - c[i-1]; g += Math.max(d, 0); l += Math.max(-d, 0); }
  g /= n; l /= n;
  for (let i = n + 1; i < c.length; i++) {
    const d = c[i] - c[i-1];
    g = (g * (n-1) + Math.max(d, 0)) / n; l = (l * (n-1) + Math.max(-d, 0)) / n;
  }
  return 100 - 100 / (1 + g / (l || 1e-9));
}

(async () => {
  const src = fs.readFileSync('dashboard_data.js', 'utf8');
  const j0 = src.indexOf('=') + 1;
  const SUM = JSON.parse(src.slice(j0).trim().replace(/;\s*$/, ''));
  const list = SUM.rows.map(r => ({ t: r.t, b: r.b, n: r.n }));
  const now = Math.floor(Date.now() / 1000) + 86400;
  const out = [];
  const CONC = 8;

  async function one(tk) {
    try {
      const [oh, qs, rtsRaw] = await Promise.all([
        jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${tk.t}&resolution=D&from=${now - 86400 * 420}&to=${now}`),
        jget(`https://iq.vietcap.com.vn/api/iq-insight-service/v1/company/${tk.t}/financial-statement?section=INCOME_STATEMENT`).then(x => (x && x.data && x.data.quarters) || []).catch(() => []),
        jget(`https://iq.vietcap.com.vn/api/iq-insight-service/v1/company/${tk.t}/statistics-financial`).then(x => (x && x.data) || []).catch(() => [])
      ]);
      const rts = rtsRaw.filter(x => x.ratioType === 'RATIO_TTM' && x.quarter >= 1 && x.quarter <= 4);
      const c = oh.c || [], v = oh.v || [], o = { t: tk.t, b: tk.b, n: tk.n };
      if (c.length > 30) {
        const last = c[c.length - 1]; o.p = last;
        o.chg = c[c.length - 2] ? +((last / c[c.length - 2] - 1) * 100).toFixed(2) : null;
        o.hi52 = Math.max(...c); o.lo52 = Math.min(...c); o.dHi = +((last / o.hi52 - 1) * 100).toFixed(1);
        o.ma20 = +(last / sma(c, 20) - 1).toFixed(3);
        o.ma50 = c.length >= 50 ? +(last / sma(c, 50) - 1).toFixed(3) : null;
        o.ma200 = c.length >= 200 ? +(last / sma(c, 200) - 1).toFixed(3) : null;
        const rr = rsiLast(c); o.rsi = rr != null ? Math.round(rr) : null;
        o.v20 = Math.round(sma(v, 20) || 0); o.vx = o.v20 ? +(v[v.length - 1] / o.v20).toFixed(2) : null;
        o.val20 = Math.round((sma(v, 20) || 0) * last / 1000);
        const ret = n2 => c.length > n2 ? +((last / c[c.length - 1 - n2] - 1) * 100).toFixed(1) : null;
        o.r3 = ret(63); o.r6 = ret(126); o.r12 = ret(250);
        // vung theo doi (nen chat, khong cay bung no, thanh khoan dat)
        if (c.length > 32 && (o.val20 || 0) >= 15000) {
          const thr = o.b === 'HN' ? 8.8 : 6.3; const L2 = c.length - 1;
          let hi = -1e9, lo = 1e9, hc = false;
          for (let k = L2 - 29; k <= L2; k++) { if (c[k] > hi) hi = c[k]; if (c[k] < lo) lo = c[k]; if (k > 0 && (c[k] / c[k-1] - 1) * 100 >= thr) hc = true; }
          const rng = (hi - lo) / lo * 100;
          if (!hc && rng <= 12) { o.watch = 1; o.wrng = +rng.toFixed(1); o.wdb = +((c[L2] / hi - 1) * 100).toFixed(1); }
        }
      }
      if (qs.length) {
        const rev = qs.map(x => pick(x, REV)), np2 = qs.map(x => pick(x, NPAT)); const n = qs.length;
        o.q = qs.slice(-9).map((x, i, arr) => { const idx = n - arr.length + i; return [x.yearReport, x.lengthReport, rev[idx], np2[idx]]; });
        if (n >= 5 && np2[n-5] != null && np2[n-1] != null && np2[n-5] !== 0) o.npatYoY = +((np2[n-1] / Math.abs(np2[n-5]) - 1) * 100).toFixed(1);
        if (n >= 5 && rev[n-5] && rev[n-1] != null) o.revYoY = +((rev[n-1] / Math.abs(rev[n-5]) - 1) * 100).toFixed(1);
        if (n >= 17) { const a = np2.slice(n-4).reduce((x, y) => x + (y || 0), 0), b = np2.slice(n-16, n-12).reduce((x, y) => x + (y || 0), 0); if (a > 0 && b > 0) o.cagr3 = +((Math.pow(a / b, 1/3) - 1) * 100).toFixed(1); }
      }
      if (rts.length) {
        const L = rts[rts.length - 1];
        o.pe = L.pe != null ? +L.pe.toFixed(2) : null; o.pb = L.pb != null ? +L.pb.toFixed(2) : null;
        o.roe = L.roe != null ? +(L.roe * 100).toFixed(1) : null; o.roa = L.roa != null ? +(L.roa * 100).toFixed(1) : null;
        o.cap = L.marketCap ? Math.round(L.marketCap / 1e9) : null; o.dte = L.debtToEquity != null ? +L.debtToEquity.toFixed(2) : null;
        o.gm = L.grossMargin != null ? +(L.grossMargin * 100).toFixed(1) : null; o.dy = L.dividendYield != null ? +(L.dividendYield * 100).toFixed(2) : null;
      }
      if (o.watch) o.wgrade = (o.npatYoY != null && o.npatYoY >= 0 && o.npatYoY < 25) ? 'weak' : 'strong';
      out.push(o);
    } catch (e) { /* skip ma loi */ }
  }

  for (let i = 0; i < list.length; i += CONC) {
    await Promise.all(list.slice(i, i + CONC).map(one));
    if (i % 80 === 0) console.log(`${Math.min(i + CONC, list.length)}/${list.length}...`);
  }

  if (out.length < 600) { console.error(`CHI KEO DUOC ${out.length} MA — HUY, giu data cu.`); process.exit(1); }

  // RS + CANSLIM
  const score = r => (r.r3 != null ? 0.4 * r.r3 : 0) + (r.r6 != null ? 0.3 * r.r6 : 0) + (r.r12 != null ? 0.3 * r.r12 : 0);
  const sorted = out.filter(r => r.p != null && (r.val20 || 0) >= 10000).map(r => ({ t: r.t, s: score(r) })).sort((a, b) => a.s - b.s);
  const rk = {}; sorted.forEach((x, i) => rk[x.t] = Math.max(1, Math.round((i + 1) / sorted.length * 99)));
  for (const r of out) {
    r.rs = rk[r.t] || null;
    r.cs = { C: r.npatYoY >= 25 ? 1 : 0, A: (r.cagr3 || 0) >= 20 ? 1 : 0, N: (r.dHi ?? -99) >= -15 ? 1 : 0, S: (r.vx || 0) >= 1.2 ? 1 : 0, L: (r.rs || 0) >= 70 ? 1 : 0, I: (r.val20 || 0) >= 5000 ? 1 : 0 };
    r.csTong = Object.values(r.cs).reduce((a, b) => a + b, 0);
  }

  const vn = new Date(Date.now() + 7 * 3600 * 1000);
  const stamp = vn.toISOString().slice(0, 16).replace('T', ' ');
  const SUM2 = { updated: stamp + ' (auto)', nTickers: out.length, rows: out, tpn: SUM.tpn };
  fs.writeFileSync('dashboard_data.js', 'window.SUMMARY=' + JSON.stringify(SUM2) + ';');
  console.log(`OK: ${out.length} ma, cap nhat ${stamp}`);
})();
