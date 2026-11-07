# Do danh muc cho vay ky quy cua cac CTCK (chi doc). In dong co ma trong ro + tieu de bang.
import re, subprocess, sys, os, html, urllib.parse
MA = "POW MSB MSN CMG KDH SHS MBB FPT MWG VSC ORS NLG VIB F88".split()
RX = re.compile(r'(?<![A-Z0-9])(' + '|'.join(MA) + r')(?![A-Z0-9])')
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
TRANG = [l.strip() for l in open(sys.argv[1]) if l.strip() and not l.startswith('#')]
def tai(u, f):
    r = subprocess.run(['curl', '-s', '-L', '--compressed', '-m', '40', '-A', UA, '-o', f, '-w', '%{http_code} %{content_type}', u], capture_output=True, text=True)
    return r.stdout
def chu(f, ct, u):
    b = open(f, 'rb').read(8)
    if b.startswith(b'%PDF'):
        return subprocess.run(['pdftotext', '-layout', f, '-'], capture_output=True, text=True).stdout
    if b.startswith(b'PK') or b.startswith(b'\xd0\xcf'):
        import pandas as pd
        out = []
        try:
            for name, df in pd.read_excel(f, sheet_name=None, header=None).items():
                out.append('== sheet ' + str(name))
                for row in df.itertuples(index=False):
                    out.append(' | '.join('' if (isinstance(x, float) and x != x) else str(x) for x in row))
        except Exception as e:
            out.append('LOI excel ' + str(e))
        return '\n'.join(out)
    t = open(f, 'rb').read().decode('utf-8', 'ignore')
    t = re.sub(r'(?is)<(script|style).*?</\1>', ' ', t)
    t = re.sub(r'(?i)</(tr|p|div|li|h\d)>|<br\s*/?>', '\n', t)
    t = re.sub(r'(?i)</t[dh]>', ' | ', t)
    return html.unescape(re.sub(r'<[^>]+>', ' ', t))
def in_khop(t, ten):
    lines = [re.sub(r'\s+', ' ', l).strip() for l in t.splitlines()]
    lines = [l for l in lines if l]
    print(f'   [{ten}] {len(lines)} dong. 25 dong dau:')
    for l in lines[:25]: print('     >', l[:220])
    n = 0
    for l in lines:
        if RX.search(l) and len(l) < 400:
            print('     *', l[:300]); n += 1
            if n > 80: break
    print(f'   [{ten}] {n} dong co ma')
os.makedirs('/tmp/m', exist_ok=True)
k = 0
for u in TRANG:
    k += 1
    f = f'/tmp/m/{k}'
    print('#' * 20, u)
    st = tai(u, f); print('HTTP', st, os.path.getsize(f) if os.path.exists(f) else 0, 'bytes')
    if not os.path.exists(f) or os.path.getsize(f) < 200: continue
    raw = open(f, 'rb').read()
    t = chu(f, st, u)
    in_khop(t, 'trang')
    if raw[:4] != b'%PDF' and raw[:2] not in (b'PK', b'\xd0\xcf'):
        s = raw.decode('utf-8', 'ignore')
        links = []
        for m in re.finditer(r'href\s*=\s*["\']([^"\']+)["\'][^>]*>(.{0,200}?)</a', s, re.I | re.S):
            h, tx = m.group(1), re.sub(r'<[^>]+>|\s+', ' ', m.group(2)).strip()
            if re.search(r'\.(pdf|xlsx?)(\?|$)|cms/assets|/download|attachment|upload', h, re.I):
                links.append((urllib.parse.urljoin(u, html.unescape(h)), tx))
        seen = []
        for h, tx in links:
            if h not in [x[0] for x in seen]: seen.append((h, tx))
        print('   link tai lieu:', len(seen))
        for h, tx in seen[:20]: print('     -', tx[:100], '=>', h)
        for j, (h, tx) in enumerate(seen[:3]):
            g = f'{f}_{j}'
            print('   ## tai', h, tai(h, g), os.path.getsize(g) if os.path.exists(g) else 0)
            if os.path.exists(g) and os.path.getsize(g) > 500:
                in_khop(chu(g, '', h), f'file{j}')
