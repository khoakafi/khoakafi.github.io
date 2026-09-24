// Trinh tu dong cap nhat GIA + TIN HIEU — chi chay tren may co token cua Khoa. KHONG chua cong thuc.
// Cong thuc nam trong kho rieng tu khoakafi/kafi-core (khach: 404).
(function(){
  function ls(k){ try { return localStorage.getItem(k) || ''; } catch(e){ return ''; } }
  function lsSet(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  var TOKK='kafi_gh_token', AR_REPO='khoakafi/khoakafi.github.io', CORE_REPO='khoakafi/kafi-core';
  if (!ls(TOKK)) return;
  function lastCloseMs(){
    var vn = new Date(Date.now() + 7*3600*1000);
    for(var i=0;i<10;i++){
      var dow = vn.getUTCDay();
      var closeMs = Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate(), 8, 45);
      if (dow>=1 && dow<=5 && Date.now() >= closeMs) return closeMs;
      vn = new Date(vn.getTime() - 86400000);
    }
    return 0;
  }
  function sigsMs(){ try { var u = window.SIGS && window.SIGS.updated; if(!u) return 0; var t = Date.parse(u.replace(' ','T') + ':00+07:00'); return isNaN(t)?0:t; } catch(e){ return 0; } }
  var bEl=null;
  function badge(msg,color,done){ if(!bEl){ bEl=document.createElement('div'); bEl.style.cssText='position:fixed;bottom:14px;right:14px;z-index:99999;padding:8px 14px;border-radius:8px;font:12.5px/1.4 Inter,system-ui,sans-serif;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.25);max-width:340px'; document.body.appendChild(bEl); } bEl.style.background=color; bEl.textContent=msg; if(done) setTimeout(function(){ if(bEl){bEl.remove();bEl=null;} },20000); }
  function b64enc(str){ var b=new TextEncoder().encode(str); var s=''; for(var i=0;i<b.length;i+=8192) s+=String.fromCharCode.apply(null,b.subarray(i,i+8192)); return btoa(s); }
  async function loadEngine(tok){
    var H2={Authorization:'token '+tok, Accept:'application/vnd.github+json'};
    var r=await fetch('https://api.github.com/repos/'+CORE_REPO+'/contents/engine.js?cb='+Date.now(),{headers:H2});
    if(!r.ok) throw new Error('chua co core ('+r.status+')');
    var j=await r.json();
    var bin=atob((j.content||'').replace(/\s/g,'')); var bytes=new Uint8Array(bin.length); for(var i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    (new Function(new TextDecoder('utf-8').decode(bytes)))();
    if(!window.__GEN||!window.__GEN.run) throw new Error('core khong hop le');
  }
  async function putFile(tok, path, content, msg){
    var H={Authorization:'token '+tok, Accept:'application/vnd.github+json'};
    var cur=await (await fetch('https://api.github.com/repos/'+AR_REPO+'/contents/'+path,{headers:H})).json();
    var body={message:msg, content:b64enc(content)};
    if(cur&&cur.sha) body.sha=cur.sha;
    var r=await fetch('https://api.github.com/repos/'+AR_REPO+'/contents/'+path,{method:'PUT',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify(body)});
    if(!r.ok) throw new Error('phat hanh '+path+' loi '+r.status);
  }
  /* ===== bstar_live.js: gia nam nay cua cac ma B* + VN-Index, nuong san de trang dau hien
     602% NGAY khi mo (ke ca tab an danh). Luat chon ma y het bstarDeals()/bstarLoadPrices()
     trong dashboard_app.js. Chay SAU khi da phat hanh signals_data.js. ===== */
  var BO_CUNG=['DCL','VC3','SSB','KHG','VPI'];
  function isoVN(ts){ return new Date((ts+7*3600)*1000).toISOString().slice(0,10); }
  function dealsB(SIGS){
    var out=[], T=(SIGS&&SIGS.t)||{};
    Object.keys(T).forEach(function(t){
      if (BO_CUNG.indexOf(t)>=0) return;
      var m=T[t].m||[];
      m.forEach(function(mk,i){
        if (mk[1]!=='X') return;
        var sell=null;
        for (var k=i+1;k<m.length;k++){ var q=m[k][1]; if(q==='S'){sell=m[k];break;} if('XBTW'.indexOf(q)>=0) break; }
        out.push({t:t, bdate:isoVN(mk[0]), sdate:sell?isoVN(sell[0]):null});
      });
    });
    return out;
  }
  async function taiMot(sym, from, to, giuTu){
    var r=await fetch('https://dchart-api.vndirect.com.vn/dchart/history?symbol='+sym+'&resolution=D&from='+from+'&to='+to);
    if(!r.ok) throw new Error('HTTP '+r.status);
    var j=await r.json(); if(!j||!j.t||!j.t.length) throw new Error('rong');
    var mp={}, ds=[];
    j.t.forEach(function(ts,i){ var d=isoVN(ts); if(d<giuTu) return; mp[d]=j.c[i]; ds.push(d); });
    return {mp:mp, ds:ds, last:j.c[j.c.length-1], lastd:ds[ds.length-1]};
  }
  async function phatHanhBstarLive(tok){
    var SIGS=window.SIGS, C=window.BSTAR_CURVE;
    if(!SIGS||!SIGS.t) throw new Error('chua co SIGS');
    var y=new Date().getFullYear(), moc=new Date(Date.now()-200*86400000).toISOString().slice(0,10);
    var giuTu=(y-1)+'-12-01';
    var need={}; dealsB(SIGS).forEach(function(d){ if(d.bdate>=(y+'-01-01')||d.bdate>=moc) need[d.t]=1; });
    ((C&&C.carry)||[]).forEach(function(c){ need[c.t]=1; });
    var syms=Object.keys(need).sort(); syms.push('VNINDEX');
    var to=Math.floor(Date.now()/1000)+86400, from=to-86400*330;
    var px={}, hong=[];
    for (var i=0;i<syms.length;i+=4){
      await Promise.all(syms.slice(i,i+4).map(async function(s){
        for (var lan=0;lan<3;lan++){
          try{ px[s]=await taiMot(s,from,to,giuTu); return; }
          catch(e){ if(lan===2) hong.push(s+': '+e.message); else await new Promise(function(r){ setTimeout(r,800*(lan+1)); }); }
        }
      }));
    }
    if(!px.VNINDEX) throw new Error('khong co VN-Index'+(hong.length?' ('+hong.join('; ')+')':''));
    if(hong.length>syms.length*0.3) throw new Error('hong '+hong.length+'/'+syms.length+' ma — khong ghi de file tot bang file thieu');   // giong run.mjs
    var out={as_of:px.VNINDEX.lastd, ghi_luc:new Date().toISOString(), px:px};
    await putFile(tok,'bstar_live.js','window.BSTAR_LIVE='+JSON.stringify(out)+';\n','[AUTO] gia B* '+new Date().toISOString().slice(0,10));
    return {so:Object.keys(px).length, tong:syms.length, hong:hong, as_of:out.as_of};
  }
  window.__knBstarLive=phatHanhBstarLive;   // de kiem tra tay: __knBstarLive(localStorage.kafi_gh_token)
  /* Engine mat co ban (vietcap chan 21/09/2026) -> dien tu VNDirect bang coban_vnd.js truoc khi phat hanh.
     Chi chay khi >=20% ma thieu P/E hoac chuoi quy; engine lay duoc thi buoc nay khong dong vao. */
  async function boSungCoBan(ddJs){
    if(typeof window.knBoSungCoBan!=='function') return ddJs;
    var S=(new Function('window', ddJs+'\n;return window.SUMMARY;'))({});
    if(!S||!S.rows||!S.rows.length) return ddJs;
    var thieu=window.knCoBanThieu(S.rows); if(thieu<S.rows.length*0.2) return ddJs;
    badge('Đang bổ sung cơ bản từ VNDirect ('+thieu+' mã thiếu)…','#b45309');
    var kq=await window.knBoSungCoBan(S.rows,{onTien:function(a,b){ badge('Đang bổ sung cơ bản từ VNDirect… '+a+'/'+b,'#b45309'); }});
    if(kq.dien<thieu*0.5) throw new Error('chi dien duoc '+kq.dien+'/'+thieu+' ma'+(kq.hong.length?' ('+kq.hong[0]+')':''));
    S.coBan='vndirect '+new Date().toISOString().slice(0,10)+(kq.hong.length?' (hỏng '+kq.hong.length+' lô)':'');
    return 'window.SUMMARY='+JSON.stringify(S)+';';
  }
  async function run(){
    var lc=lastCloseMs(); if(!lc) return;
    if(sigsMs()>=lc) return;
    if(+(ls('kafi_lastpub')||0)>=lc) return;
    if(!(window.SUMMARY&&window.SUMMARY.rows&&window.SUMMARY.rows.length>100)) return;
    var lk=+(ls('kafi_ar_lock')||0); if(Date.now()-lk<600000) return;
    lsSet('kafi_ar_lock',String(Date.now()));
    var tick=null, tok=ls(TOKK);
    try{
      badge('Đang cập nhật giá + tín hiệu phiên hôm nay…','#b45309');
      await loadEngine(tok);
      tick=setInterval(function(){ if(window.__GENST) badge('Đang cập nhật… '+window.__GENST,'#b45309'); },4000);
      await window.__GEN.run();
      clearInterval(tick); tick=null;
      var sigJs=window.__SIGSOUT, ddJs=window.__DDOUT;
      if(!sigJs||sigJs.length<1000) throw new Error('tin hieu rong');
      if(!ddJs||ddJs.length<150000) throw new Error('bang gia thieu');
      try{ ddJs=await boSungCoBan(ddJs); }catch(e){ badge('⚠ Bổ sung cơ bản (VNDirect) lỗi: '+e.message+' — vẫn phát hành bảng giá','#b45309'); }
      try{ (new Function(sigJs))(); if(typeof retroScanSignals==='function') retroScanSignals(); }catch(e){}
      badge('Đang phát hành lên web…','#b45309');
      await putFile(tok,'dashboard_data.js', ddJs, '[AUTO] cap nhat bang gia '+new Date().toISOString().slice(0,10));
      await putFile(tok,'signals_data.js', sigJs, '[AUTO] phat hanh tin hieu '+new Date().toISOString().slice(0,10));
      lsSet('kafi_lastpub',String(Date.now()));
      badge('Đang nướng giá B★ năm nay…','#b45309');
      try{ var kq=await phatHanhBstarLive(tok); lsSet('kafi_lastlive',String(Date.now()));
           badge('✓ Đã cập nhật GIÁ + TÍN HIỆU + giá B★ ('+kq.so+'/'+kq.tong+' mã'+(kq.hong.length?', hỏng: '+kq.hong.join(', '):'')+') — bấm F5 để xem','#128a3e',true); }
      catch(e){ badge('✓ Đã cập nhật GIÁ + TÍN HIỆU · ⚠ giá B★ chưa nướng được: '+e.message+' (lần mở sau sẽ thử lại)','#b45309',true); }
    }catch(e){ badge('⚠ Tự cập nhật lỗi: '+e.message,'#e5484d',true); }
    finally{ if(tick)clearInterval(tick); lsSet('kafi_ar_lock','0'); }
  }
  /* Da phat hanh tin hieu roi ma gia B* chua nuong (hong / ban cu chua co buoc nay) -> chay bu rieng. */
  async function runLive(){
    var lc=lastCloseMs(); if(!lc) return;
    if(sigsMs()<lc) return;                                   // tin hieu hom nay chua co -> run() lo
    if(+(ls('kafi_lastlive')||0)>=lc) return;
    var L=window.BSTAR_LIVE; if(L&&L.as_of&&Date.parse(L.as_of+'T08:45:00Z')>=lc){ /* lc = 08:45 UTC nhu lastCloseMs; truoc ghi +07:00 -> khong bao gio khop, nuong lai moi ngay */ lsSet('kafi_lastlive',String(Date.now())); return; }
    var lk=+(ls('kafi_live_lock')||0); if(Date.now()-lk<300000) return;
    lsSet('kafi_live_lock',String(Date.now()));
    try{ badge('Đang nướng giá B★ năm nay…','#b45309'); var kq=await phatHanhBstarLive(ls(TOKK)); lsSet('kafi_lastlive',String(Date.now()));
         badge('✓ Đã nướng giá B★ ('+kq.so+'/'+kq.tong+' mã) — mở lại trang là 602% hiện ngay','#128a3e',true); }
    catch(e){ badge('⚠ Giá B★ chưa nướng được: '+e.message,'#b45309',true); }
    finally{ lsSet('kafi_live_lock','0'); }
  }
  function batDau(){ setTimeout(run,2500); setTimeout(runLive,9000); }
  if(document.readyState==='complete') batDau();
  else window.addEventListener('load',batDau);
})();
