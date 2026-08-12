// Trinh tu dong cap nhat tin hieu — chi chay tren may co token cua Khoa. KHONG chua cong thuc.
// Cong thuc nam trong kho rieng tu khoakafi/kafi-core, chi token cua Khoa doc duoc (khach: 404).
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
  function badge(msg,color,done){ if(!bEl){ bEl=document.createElement('div'); bEl.style.cssText='position:fixed;bottom:14px;right:14px;z-index:99999;padding:8px 14px;border-radius:8px;font:12.5px/1.4 Inter,system-ui,sans-serif;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.25);max-width:340px'; document.body.appendChild(bEl); } bEl.style.background=color; bEl.textContent=msg; if(done) setTimeout(function(){ if(bEl){bEl.remove();bEl=null;} },15000); }
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
  async function run(){
    var lc=lastCloseMs(); if(!lc) return;
    if(sigsMs()>=lc) return;
    if(+(ls('kafi_lastpub')||0)>=lc) return;
    if(!(window.SUMMARY&&window.SUMMARY.rows&&window.SUMMARY.rows.length>100)) return;
    var lk=+(ls('kafi_ar_lock')||0); if(Date.now()-lk<600000) return;
    lsSet('kafi_ar_lock',String(Date.now()));
    var tick=null, tok=ls(TOKK);
    try{
      badge('Đang cập nhật tín hiệu phiên hôm nay…','#b45309');
      await loadEngine(tok);
      tick=setInterval(function(){ if(window.__GENST) badge('Đang cập nhật… '+window.__GENST,'#b45309'); },4000);
      await window.__GEN.run();
      clearInterval(tick); tick=null;
      var sigJs=window.__SIGSOUT;
      if(!sigJs||sigJs.length<1000) throw new Error('ket qua rong');
      try{ (new Function(sigJs))(); if(typeof retroScanSignals==='function') retroScanSignals(); }catch(e){}
      badge('Đang phát hành lên web…','#b45309');
      var Hp={Authorization:'token '+tok,Accept:'application/vnd.github+json'};
      var cur=await (await fetch('https://api.github.com/repos/'+AR_REPO+'/contents/signals_data.js',{headers:Hp})).json();
      var body={message:'[AUTO] phat hanh tin hieu '+new Date().toISOString().slice(0,10),content:b64enc(sigJs)};
      if(cur&&cur.sha) body.sha=cur.sha;
      var pr=await fetch('https://api.github.com/repos/'+AR_REPO+'/contents/signals_data.js',{method:'PUT',headers:Object.assign({'Content-Type':'application/json'},Hp),body:JSON.stringify(body)});
      if(!pr.ok) throw new Error('phat hanh loi '+pr.status);
      lsSet('kafi_lastpub',String(Date.now()));
      badge('✓ Đã cập nhật & phát hành tín hiệu phiên hôm nay','#128a3e',true);
    }catch(e){ badge('⚠ Tự cập nhật lỗi: '+e.message,'#e5484d',true); }
    finally{ if(tick)clearInterval(tick); lsSet('kafi_ar_lock','0'); }
  }
  if(document.readyState==='complete') setTimeout(run,2500);
  else window.addEventListener('load',function(){ setTimeout(run,2500); });
})();
