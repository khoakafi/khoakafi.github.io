# Doc file da tai (pdf/xls/xlsx/html) va in dong co ma trong ro.
import re, sys, glob, subprocess, os
MA = "POW MSB MSN CMG KDH SHS MBB FPT MWG VSC ORS NLG VIB F88".split()
RX = re.compile(r'(?<![A-Z0-9])(' + '|'.join(MA) + r')(?![A-Z0-9])')
for f in sorted(glob.glob('/tmp/m4/*'), key=lambda x: (len(x), x)):
    if f.endswith('.url'): continue
    u = open(f + '.url').read() if os.path.exists(f + '.url') else ''
    b = open(f, 'rb').read(8); t = ''
    if b.startswith(b'%PDF'): t = subprocess.run(['pdftotext', '-layout', f, '-'], capture_output=True, text=True).stdout
    elif b.startswith(b'PK') or b.startswith(b'\xd0\xcf'):
        import pandas as pd
        try:
            for n, df in pd.read_excel(f, sheet_name=None, header=None).items():
                t += '== sheet %s\n' % n + '\n'.join(' | '.join('' if (isinstance(x, float) and x != x) else str(x) for x in r) for r in df.itertuples(index=False)) + '\n'
        except Exception as e: t = 'LOI ' + str(e)
    else: continue
    L = [re.sub(r'\s+', ' ', l).strip() for l in t.splitlines() if l.strip()]
    print('=' * 10, f, u, len(L), 'dong')
    for l in L[:18]: print('   >', l[:200])
    for l in [l for l in L if RX.search(l) and len(l) < 400][:60]: print('   *', l[:300])
