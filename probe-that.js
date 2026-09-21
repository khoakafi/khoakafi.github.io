/* Chay CHINH ham secTai/drawSec trong dashboard_app.js voi API that. */
const fs=require('fs'), vm=require('vm');
const L=fs.readFileSync('dashboard_app.js','utf8').split('\n');
const lay=(a,b)=>L.slice(a-1,b).join('\n');
const n=(re)=>L.findIndex(x=>re.test(x))+1;
const src = lay(n(/^function knNgayStr\(/), n(/^const KN_MOC_SEC/)) + '\n'
          + lay(n(/^const SEC_GROUPS =/), n(/^async function renderCmp\(/)-1);

const w={}; vm.createContext(w); vm.runInContext('var window=this;'+fs.readFileSync('dashboard_data.js','utf8'), w);
const byT={}; (w.SUMMARY.rows||[]).forEach(r=>byT[r.t]=r);

let store={};
const sb={ console, Date, JSON, Math, Promise, isFinite, Object, String, byT, window:{},
  localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}},
  Chart:function(c,cfg){ this.destroy=()=>{}; sb.__ve=cfg; },
  $:()=>null, $$:()=>[],
  jget: async u=>{ const r=await fetch(u,{headers:{'Origin':'https://khoanguyeninvest.vn'}}); if(!r.ok) throw new Error(r.status); return r.json(); },
  api:{ ratios: async t=>{ const r=await fetch('https://iq.vietcap.com.vn/api/iq-insight-service/v1/company/'+t+'/statistics-financial');
    if(!r.ok) throw new Error(r.status); const d=await r.json();
    return (d.data||[]).filter(x=>x.ratioType==='RATIO_TTM'&&x.quarter>=1&&x.quarter<=4); } } };
vm.createContext(sb);
vm.runInContext(src+'\nthis.secTai=secTai;this.secMoc=secMoc;this.SEC_GROUPS=SEC_GROUPS;this.secDemMuc=secDemMuc;', sb);

(async()=>{
  for (const g of ['bank','sec']) {
    const codes=sb.SEC_GROUPS[g];
    const t0=Date.now();
    const {out,loi}=await sb.secTai(codes);
    console.log('\n=== nhom '+g+'  ('+((Date.now()-t0)/1000).toFixed(1)+'s)  loi:', loi||'khong');
    console.log('so ma co du lieu:', sb.secDemMuc(out,codes), '/', codes.length);
    console.log('trang thai hien ra:', sb.secMoc(out,codes));
    codes.forEach(c=>{ const o=out[c]; console.log(' ', c.padEnd(4),
      o? ('P/B '+o.pbLo.toFixed(2)+'–'+o.pbHi.toFixed(2)+'  hien tai '+(+o.curPb).toFixed(2)
          +'  ROE '+(o.curRoe!=null?o.curRoe+'%':'--')+'  BVPS '+(o.bvps!=null?o.bvps:'--')
          +'  tu '+(o.pbTu||'-')) : 'KHONG CO DU LIEU'); });
  }
})();
