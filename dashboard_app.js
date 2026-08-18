/* Dashboard Cổ Phiếu VN — HOSE + HNX — dữ liệu sống từ VNDirect + Vietcap IQ */
(function(){
'use strict';
// ================= DỮ LIỆU & TIỆN ÍCH =================
let SUM = window.SUMMARY;
try { const ls = localStorage.getItem('summary_v1'); if (ls) { const p = JSON.parse(ls); if (p && p.rows && p.rows.length > 500 && (p.updated||'') > ((window.SUMMARY&&window.SUMMARY.updated)||'')) { if (!p.tpn && window.SUMMARY.tpn) p.tpn = window.SUMMARY.tpn; if (!p.rows.some(r=>r.watch) && window.SUMMARY.rows.some(r=>r.watch)) { const wm={}; window.SUMMARY.rows.forEach(r=>{ if(r.watch) wm[r.t]=r; }); p.rows.forEach(r=>{ const w=wm[r.t]; if(w){ r.watch=1; r.wrng=w.wrng; r.wdb=w.wdb; r.wgrade=w.wgrade; } }); } SUM = p; } } } catch(e){}
const BO_CUNG = new Set(['DCL','VC3','SSB','KHG','VPI']);
SUM.rows.forEach(r=>{ if(BO_CUNG.has(r.t)) r.watch=0; });
if(SUM.tpn&&SUM.tpn.recent) SUM.tpn.recent=SUM.tpn.recent.filter(x=>!BO_CUNG.has(x.t));
const ROWS = () => SUM.rows;
const byT = {}; SUM.rows.forEach(r => byT[r.t] = r);
const SEC_MAP={"KOS":"Dịch vụ Đầu tư Bất Động Sản","PIC":"Điện lực","SZC":"Dịch vụ Đầu tư Bất Động Sản","MKV":"Dược phẩm & công nghệ sinh học","VDS":"Dịch vụ tài chính","SBV":"Xây dựng & Vật liệu","GDW":"Ga, nước & dịch vụ công cộng gia dụng","GSP":"Ga, nước & dịch vụ công cộng gia dụng","SD9":"Xây dựng & Vật liệu","TET":"Hàng hóa cá nhân","IDJ":"Dịch vụ Đầu tư Bất Động Sản","CII":"Dịch vụ Đầu tư Bất Động Sản","DMC":"Dụng cụ & dịch vụ y tế","S99":"Xây dựng & Vật liệu","VPH":"Dịch vụ Đầu tư Bất Động Sản","HCM":"Dịch vụ tài chính","MHC":"Giao thông công nghiệp","HHC":"Sản xuất thực phẩm","VTC":"Viễn thông cố định","MIG":"Bảo hiểm phi nhân thọ","HUT":"Xây dựng & Vật liệu","NKG":"Kim loại công nghiệp","SVN":"Xây dựng & Vật liệu","SED":"Bán lẻ","HDA":"Xây dựng & Vật liệu","NTH":"Điện lực","PHC":"Xây dựng & Vật liệu","VVS":"Ôtô & phụ tùng ôtô","TBC":"Điện lực","SFN":"Công nghiệp tổng hợp","RCL":"Dịch vụ Đầu tư Bất Động Sản","HAT":"Đồ uống","SMN":"Bán lẻ","PMS":"Công nghiệp cơ khí ","FIR":"Dịch vụ Đầu tư Bất Động Sản","PHN":"Dụng cụ điện & Điện tử","ILB":"Giao thông công nghiệp","ANV":"Sản xuất thực phẩm","HID":"Xây dựng & Vật liệu","WSS":"Dịch vụ tài chính","MCF":"Sản xuất thực phẩm","VMC":"Xây dựng & Vật liệu","SGD":"Truyền thông","CRE":"Dịch vụ Đầu tư Bất Động Sản","VBC":"Công nghiệp tổng hợp","PMC":"Dược phẩm & công nghệ sinh học","HTV":"Giao thông công nghiệp","VID":"Sản xuất giấy & Trồng rừng","MSB":"Ngân hàng","MEL":"Kim loại công nghiệp","GAS":"Ga, nước & dịch vụ công cộng gia dụng","HPX":"Dịch vụ Đầu tư Bất Động Sản","MSN":"Sản xuất thực phẩm","DHA":"Xây dựng & Vật liệu","VTZ":"Hàng hóa cá nhân","SAF":"Sản xuất thực phẩm","DRH":"Dịch vụ Đầu tư Bất Động Sản","VE4":"Xây dựng & Vật liệu","VTB":"Hàng hóa giải trí","MWG":"Bán lẻ","VNS":"Du lịch & Giải trí","L14":"Xây dựng & Vật liệu","CKV":"Dụng cụ & công nghệ phần cứng","TV4":"Xây dựng & Vật liệu","L40":"Xây dựng & Vật liệu","DAT":"Công nghiệp tổng hợp","PAC":"Dụng cụ điện & Điện tử","SHI":"Hàng gia dụng","SSI":"Dịch vụ tài chính","ABS":"Hóa chất","VCM":"Dịch vụ hỗ trợ","THS":"Ga, nước & dịch vụ công cộng gia dụng","GKM":"Xây dựng & Vật liệu","TNI":"Kim loại công nghiệp","HKT":"Sản xuất thực phẩm","ACL":"Sản xuất thực phẩm","HHP":"Sản xuất giấy & Trồng rừng","SPC":"Hóa chất","AMC":"Khai thác mỏ","TPP":"Công nghiệp tổng hợp","CVT":"Xây dựng & Vật liệu","PGC":"Ga, nước & dịch vụ công cộng gia dụng","BKG":"Sản xuất giấy & Trồng rừng","PTD":"Xây dựng & Vật liệu","TNH":"Dụng cụ & dịch vụ y tế","PVD":"Dụng cụ, dịch vụ & Phân phối Dầu","HLC":"Khai thác mỏ","DST":"Bán lẻ","HAH":"Giao thông công nghiệp","PVS":"Dụng cụ, dịch vụ & Phân phối Dầu","CIG":"Dịch vụ Đầu tư Bất Động Sản","AAN":"","KBC":"Dịch vụ Đầu tư Bất Động Sản","VNM":"Sản xuất thực phẩm","CAN":"Sản xuất thực phẩm","VE1":"Xây dựng & Vật liệu","PIT":"Sản xuất thực phẩm","PPE":"Dịch vụ hỗ trợ","VC6":"Xây dựng & Vật liệu","ASP":"Ga, nước & dịch vụ công cộng gia dụng","HDC":"Dịch vụ Đầu tư Bất Động Sản","QNP":"Giao thông công nghiệp","FTS":"Dịch vụ tài chính","VFS":"Dịch vụ tài chính","HUB":"Xây dựng & Vật liệu","LCD":"Dụng cụ điện & Điện tử","ANT":"Sản xuất thực phẩm","CST":"Khai thác mỏ","ACB":"Ngân hàng","LHC":"Xây dựng & Vật liệu","FID":"Bán lẻ","CTP":"Sản xuất thực phẩm","VCG":"Dịch vụ Đầu tư Bất Động Sản","HTN":"Xây dựng & Vật liệu","VGP":"Giao thông công nghiệp","SRF":"Công nghiệp cơ khí ","KST":"Dụng cụ & công nghệ phần cứng","BAX":"Dịch vụ Đầu tư Bất Động Sản","BIC":"Bảo hiểm phi nhân thọ","KHG":"Dịch vụ Đầu tư Bất Động Sản","BHN":"Đồ uống","LM8":"Công nghiệp cơ khí ","PSD":"Dụng cụ & công nghệ phần cứng","SDC":"Xây dựng & Vật liệu","TVD":"Khai thác mỏ","SKG":"Giao thông công nghiệp","GMD":"Giao thông công nghiệp","HAD":"Đồ uống","C32":"Xây dựng & Vật liệu","PTS":"Giao thông công nghiệp","VIX":"Dịch vụ tài chính","DBD":"Dược phẩm & công nghệ sinh học","ORS":"Dịch vụ tài chính","SC5":"Xây dựng & Vật liệu","NAB":"Ngân hàng","DXS":"Dịch vụ Đầu tư Bất Động Sản","PMG":"Ga, nước & dịch vụ công cộng gia dụng","HLD":"Xây dựng & Vật liệu","PVB":"Dụng cụ, dịch vụ & Phân phối Dầu","VC9":"Xây dựng & Vật liệu","BMI":"Bảo hiểm phi nhân thọ","VCS":"Xây dựng & Vật liệu","BED":"Bán lẻ","DIH":"Dịch vụ Đầu tư Bất Động Sản","HMR":"Xây dựng & Vật liệu","CTT":"Công nghiệp cơ khí ","PJT":"Giao thông công nghiệp","TCR":"Xây dựng & Vật liệu","HEV":"Truyền thông","VTV":"Xây dựng & Vật liệu","UIC":"Xây dựng & Vật liệu","PGT":"Giao thông công nghiệp","TFC":"Sản xuất thực phẩm","GDT":"Hàng gia dụng","TLD":"Xây dựng & Vật liệu","SIP":"Dịch vụ Đầu tư Bất Động Sản","TCL":"Giao thông công nghiệp","HDB":"Ngân hàng","TN1":"Dịch vụ Đầu tư Bất Động Sản","GVR":"Hóa chất","SGR":"Dịch vụ Đầu tư Bất Động Sản","BMP":"Xây dựng & Vật liệu","DSN":"Du lịch & Giải trí","BBS":"Công nghiệp tổng hợp","MCO":"Xây dựng & Vật liệu","LDP":"Dược phẩm & công nghệ sinh học","DVP":"Giao thông công nghiệp","BAF":"Sản xuất thực phẩm","VTP":"Giao thông công nghiệp","BTT":"Bán lẻ","DPR":"Hóa chất","PRE":"Bảo hiểm phi nhân thọ","NHT":"Hàng hóa giải trí","ACC":"Xây dựng & Vật liệu","FRT":"Bán lẻ","NFC":"Hóa chất","LSS":"Sản xuất thực phẩm","BWE":"Ga, nước & dịch vụ công cộng gia dụng","AMV":"Dụng cụ & dịch vụ y tế","PCT":"Giao thông công nghiệp","PPS":"Dụng cụ điện & Điện tử","CLL":"Giao thông công nghiệp","GEL":"","NBC":"Khai thác mỏ","DGC":"Hóa chất","AGR":"Dịch vụ tài chính","VPB":"Ngân hàng","REE":"Ga, nước & dịch vụ công cộng gia dụng","SD5":"Xây dựng & Vật liệu","CTD":"Xây dựng & Vật liệu","DTT":"Hóa chất","SJD":"Điện lực","NO1":"Xây dựng & Vật liệu","VIF":"Sản xuất giấy & Trồng rừng","PSC":"Giao thông công nghiệp","HMH":"Giao thông công nghiệp","PLP":"Khai thác mỏ","TIG":"Dịch vụ Đầu tư Bất Động Sản","CAR":"Dịch vụ hỗ trợ","V12":"Xây dựng & Vật liệu","TDC":"Xây dựng & Vật liệu","DNC":"Xây dựng & Vật liệu","KMR":"Hàng hóa cá nhân","TVB":"Dịch vụ tài chính","KSF":"Xây dựng & Vật liệu","CCR":"Giao thông công nghiệp","RYG":"Xây dựng & Vật liệu","SSC":"Sản xuất thực phẩm","PGI":"Bảo hiểm phi nhân thọ","CTR":"Viễn thông cố định","VLA":"Phần mềm & Dịch vụ máy tính","KSV":"Khai thác mỏ","EVG":"Xây dựng & Vật liệu","PET":"Bán lẻ","TV3":"Xây dựng & Vật liệu","TA9":"Xây dựng & Vật liệu","SJS":"Dịch vụ Đầu tư Bất Động Sản","SGC":"Sản xuất thực phẩm","SJE":"Xây dựng & Vật liệu","KHS":"Sản xuất thực phẩm","MDC":"Khai thác mỏ","TCO":"Giao thông công nghiệp","PCE":"Hóa chất","SZL":"Dịch vụ Đầu tư Bất Động Sản","VMD":"Bán lẻ thực phẩm & thuốc","SMT":"Dụng cụ & công nghệ phần cứng","DCL":"Dược phẩm & công nghệ sinh học","SHP":"Điện lực","LIX":"Hàng gia dụng","KMT":"Kim loại công nghiệp","VSM":"Giao thông công nghiệp","NSH":"Kim loại công nghiệp","DTG":"Dược phẩm & công nghệ sinh học","EID":"Truyền thông","MVB":"Khai thác mỏ","PC1":"Xây dựng & Vật liệu","HVT":"Hóa chất","CKG":"Dịch vụ Đầu tư Bất Động Sản","NCT":"Giao thông công nghiệp","TD6":"Khai thác mỏ","HTL":"Công nghiệp cơ khí ","BSI":"Dịch vụ tài chính","DL1":"Giao thông công nghiệp","PDB":"Xây dựng & Vật liệu","YEG":"Truyền thông","ASG":"Giao thông công nghiệp","HSL":"Sản xuất thực phẩm","PIA":"Phần mềm & Dịch vụ máy tính","HHS":"Ôtô & phụ tùng ôtô","HNA":"Điện lực","DQC":"Dụng cụ điện & Điện tử","VPX":"Dịch vụ tài chính","HHV":"Giao thông công nghiệp","GEX":"Dụng cụ điện & Điện tử","PSE":"Hóa chất","ATS":"Du lịch & Giải trí","TVC":"Dịch vụ tài chính","ADS":"Hóa chất","CCL":"Dịch vụ Đầu tư Bất Động Sản","CTG":"Ngân hàng","GIC":"Giao thông công nghiệp","VOS":"Giao thông công nghiệp","SVC":"Bán lẻ","SGT":"Phần mềm & Dịch vụ máy tính","VPI":"Dịch vụ Đầu tư Bất Động Sản","BVH":"Bảo hiểm phi nhân thọ","IMP":"Dược phẩm & công nghệ sinh học","LBE":"Truyền thông","CMV":"Bán lẻ","NT2":"Điện lực","MBG":"Xây dựng & Vật liệu","PPT":"Ga, nước & dịch vụ công cộng gia dụng","CEO":"Dịch vụ Đầu tư Bất Động Sản","SSB":"Ngân hàng","IDI":"Sản xuất thực phẩm","KLB":"Ngân hàng","EBS":"Bán lẻ","DC2":"Xây dựng & Vật liệu","ACG":"Hàng gia dụng","TRC":"Hóa chất","SVT":"Truyền thông","LCG":"Xây dựng & Vật liệu","LDG":"Dịch vụ Đầu tư Bất Động Sản","LHG":"Dịch vụ Đầu tư Bất Động Sản","PV2":"Dịch vụ tài chính","HVH":"Hàng hóa giải trí","BCC":"Xây dựng & Vật liệu","PSI":"Dịch vụ tài chính","SMB":"Đồ uống","FCN":"Xây dựng & Vật liệu","CLC":"Thuốc lá","HAR":"Dịch vụ Đầu tư Bất Động Sản","TPB":"Ngân hàng","NTL":"Dịch vụ Đầu tư Bất Động Sản","VCB":"Ngân hàng","ECI":"Truyền thông","KTS":"Sản xuất thực phẩm","TTA":"Điện lực","C69":"Xây dựng & Vật liệu","HMC":"Kim loại công nghiệp","HPA":"","BNA":"Bán lẻ thực phẩm & thuốc","YBM":"Hóa chất","TCB":"Ngân hàng","DSE":"Dịch vụ tài chính","VDL":"Đồ uống","ALT":"Truyền thông","PSW":"Hóa chất","SBT":"Sản xuất thực phẩm","PGD":"Ga, nước & dịch vụ công cộng gia dụng","MSH":"Hàng hóa cá nhân","JVC":"Dụng cụ & dịch vụ y tế","LAF":"Sản xuất thực phẩm","GLT":"Dụng cụ điện & Điện tử","LIG":"Xây dựng & Vật liệu","UNI":"Dịch vụ Đầu tư Bất Động Sản","ST8":"Dụng cụ & công nghệ phần cứng","TIX":"Dịch vụ Đầu tư Bất Động Sản","BRC":"Hóa chất","PVT":"Giao thông công nghiệp","S4A":"Điện lực","SBG":"Công nghiệp tổng hợp","INN":"Truyền thông","OGC":"Dịch vụ Đầu tư Bất Động Sản","HU1":"Xây dựng & Vật liệu","VPD":"Điện lực","TDM":"Ga, nước & dịch vụ công cộng gia dụng","LBM":"Xây dựng & Vật liệu","VAB":"Ngân hàng","NBB":"Dịch vụ Đầu tư Bất Động Sản","NDX":"Xây dựng & Vật liệu","SZB":"Dịch vụ Đầu tư Bất Động Sản","HDG":"Dịch vụ Đầu tư Bất Động Sản","BTW":"Ga, nước & dịch vụ công cộng gia dụng","ITQ":"Kim loại công nghiệp","SFI":"Giao thông công nghiệp","VSC":"Giao thông công nghiệp","SHB":"Ngân hàng","VTH":"Dụng cụ & công nghệ phần cứng","DTD":"Xây dựng & Vật liệu","DAE":"Truyền thông","NHA":"Xây dựng & Vật liệu","MDG":"Xây dựng & Vật liệu","VCA":"Kim loại công nghiệp","SEB":"Điện lực","DHM":"Khai thác mỏ","TJC":"Giao thông công nghiệp","IPA":"Dịch vụ tài chính","CX8":"Xây dựng & Vật liệu","VMS":"Giao thông công nghiệp","PDN":"Giao thông công nghiệp","QHD":"Xây dựng & Vật liệu","VIC":"Dịch vụ Đầu tư Bất Động Sản","AAA":"Công nghiệp tổng hợp","SAM":"Dụng cụ & công nghệ phần cứng","TDH":"Dịch vụ Đầu tư Bất Động Sản","DRC":"Ôtô & phụ tùng ôtô","ADC":"Truyền thông","SMA":"Công nghiệp tổng hợp","HQC":"Dịch vụ Đầu tư Bất Động Sản","PEN":"Xây dựng & Vật liệu","NBP":"Điện lực","DCM":"Hóa chất","VFG":"Hóa chất","ICG":"Xây dựng & Vật liệu","NVL":"Dịch vụ Đầu tư Bất Động Sản","SAB":"Đồ uống","CLH":"Xây dựng & Vật liệu","AAM":"Sản xuất thực phẩm","RAL":"Dụng cụ điện & Điện tử","IDV":"Dịch vụ Đầu tư Bất Động Sản","SJ1":"Sản xuất thực phẩm","WCS":"Du lịch & Giải trí","EIB":"Ngân hàng","BFC":"Hóa chất","VC2":"Xây dựng & Vật liệu","AFX":"Sản xuất thực phẩm","SDG":"Công nghiệp tổng hợp","THT":"Khai thác mỏ","PTI":"Bảo hiểm phi nhân thọ","MCC":"Xây dựng & Vật liệu","TSC":"Sản xuất thực phẩm","POW":"Điện lực","TDG":"Sản xuất dầu khí","TCT":"Du lịch & Giải trí","CTS":"Dịch vụ tài chính","TTH":"Bán lẻ","S55":"Xây dựng & Vật liệu","NNC":"Xây dựng & Vật liệu","TLG":"Hàng gia dụng","TTT":"Du lịch & Giải trí","VNC":"Dịch vụ hỗ trợ","ELC":"Phần mềm & Dịch vụ máy tính","DBT":"Dược phẩm & công nghệ sinh học","CNG":"Ga, nước & dịch vụ công cộng gia dụng","SGN":"Giao thông công nghiệp","ADG":"Truyền thông","VPG":"Khai thác mỏ","HTC":"Bán lẻ","CMX":"Sản xuất thực phẩm","CSV":"Hóa chất","ITC":"Dịch vụ Đầu tư Bất Động Sản","SCR":"Dịch vụ Đầu tư Bất Động Sản","DIG":"Dịch vụ Đầu tư Bất Động Sản","SRC":"Ôtô & phụ tùng ôtô","VHM":"Dịch vụ Đầu tư Bất Động Sản","CTI":"Xây dựng & Vật liệu","PGN":"Hóa chất","VJC":"Du lịch & Giải trí","OCB":"Ngân hàng","NAV":"Xây dựng & Vật liệu","KDH":"Dịch vụ Đầu tư Bất Động Sản","CET":"Hóa chất","MST":"Xây dựng & Vật liệu","FIT":"Dịch vụ Đầu tư Bất Động Sản","MIC":"Khai thác mỏ","NVB":"Ngân hàng","HPG":"Kim loại công nghiệp","DP3":"Dược phẩm & công nghệ sinh học","DHP":"Dụng cụ điện & Điện tử","VGC":"Dịch vụ Đầu tư Bất Động Sản","PVP":"Giao thông công nghiệp","TSA":"Xây dựng & Vật liệu","TRA":"Dược phẩm & công nghệ sinh học","CMS":"Dịch vụ hỗ trợ","CCI":"Bán lẻ","SRA":"Phần mềm & Dịch vụ máy tính","HT1":"Xây dựng & Vật liệu","HCD":"Xây dựng & Vật liệu","CIA":"Giao thông công nghiệp","VNT":"Giao thông công nghiệp","HSG":"Kim loại công nghiệp","FPT":"Phần mềm & Dịch vụ máy tính","CMC":"Xây dựng & Vật liệu","VND":"Dịch vụ tài chính","SMC":"Kim loại công nghiệp","GMA":"Xây dựng & Vật liệu","DTA":"Dịch vụ Đầu tư Bất Động Sản","SLS":"Sản xuất thực phẩm","TIP":"Quỹ đầu tư Bất Động Sản","THG":"Xây dựng & Vật liệu","TTF":"Hàng gia dụng","FDC":"Dịch vụ Đầu tư Bất Động Sản","OCH":"Dịch vụ Đầu tư Bất Động Sản","L18":"Xây dựng & Vật liệu","CAP":"Sản xuất giấy & Trồng rừng","TYA":"Dụng cụ & công nghệ phần cứng","DTK":"Điện lực","PVG":"Ga, nước & dịch vụ công cộng gia dụng","EVS":"Dịch vụ tài chính","DGW":"Bán lẻ","GEE":"Dụng cụ điện & Điện tử","DTL":"Kim loại công nghiệp","VIG":"Dịch vụ tài chính","PVI":"Bảo hiểm phi nhân thọ","TTE":"Điện lực","QST":"Bán lẻ","TNT":"Dịch vụ Đầu tư Bất Động Sản","VPS":"Hóa chất","DC4":"Xây dựng & Vật liệu","CTB":"Công nghiệp cơ khí ","TNG":"Hàng hóa cá nhân","VHC":"Sản xuất thực phẩm","PLX":"Sản xuất dầu khí","BSR":"Sản xuất dầu khí","X20":"Hàng hóa cá nhân","CSM":"Ôtô & phụ tùng ôtô","VNR":"Bảo hiểm phi nhân thọ","ABT":"Sản xuất thực phẩm","KDM":"Xây dựng & Vật liệu","SHN":"Xây dựng & Vật liệu","ARM":"Dịch vụ hỗ trợ","GMH":"Xây dựng & Vật liệu","MBS":"Dịch vụ tài chính","NAF":"Đồ uống","TLH":"Kim loại công nghiệp","VTO":"Giao thông công nghiệp","OPC":"Dược phẩm & công nghệ sinh học","NTP":"Xây dựng & Vật liệu","TMX":"Xây dựng & Vật liệu","TV2":"Dịch vụ hỗ trợ","VC1":"Xây dựng & Vật liệu","GIL":"Hàng hóa cá nhân","IJC":"Xây dựng & Vật liệu","TCI":"Dịch vụ tài chính","VHL":"Xây dựng & Vật liệu","BXH":"Công nghiệp tổng hợp","VTJ":"Thuốc lá","HRC":"Hóa chất","HCT":"Giao thông công nghiệp","LGL":"Dịch vụ Đầu tư Bất Động Sản","DSC":"Dịch vụ tài chính","MAC":"Công nghiệp cơ khí ","PTL":"Xây dựng & Vật liệu","VCF":"Đồ uống","AAT":"Hàng hóa cá nhân","VNF":"Giao thông công nghiệp","VRE":"Dịch vụ Đầu tư Bất Động Sản","TPC":"Công nghiệp tổng hợp","DVM":"Dược phẩm & công nghệ sinh học","ITD":"Phần mềm & Dịch vụ máy tính","VCI":"Dịch vụ tài chính","PMB":"Hóa chất","CLM":"Dịch vụ hỗ trợ","HTG":"Hàng hóa cá nhân","THB":"Đồ uống","NET":"Hàng gia dụng","PPC":"Điện lực","PGS":"Ga, nước & dịch vụ công cộng gia dụng","TCM":"Hàng hóa cá nhân","SCS":"Giao thông công nghiệp","BCM":"Dịch vụ Đầu tư Bất Động Sản","DS3":"Giao thông công nghiệp","MCP":"Công nghiệp tổng hợp","D2D":"Dịch vụ Đầu tư Bất Động Sản","PLC":"Hóa chất","KSB":"Khai thác mỏ","VRC":"Dịch vụ Đầu tư Bất Động Sản","VNL":"Giao thông công nghiệp","PTC":"Xây dựng & Vật liệu","SFG":"Hóa chất","TVS":"Dịch vụ tài chính","SDN":"Xây dựng & Vật liệu","C47":"Xây dựng & Vật liệu","CDN":"Giao thông công nghiệp","CRV":"","STB":"Ngân hàng","NTC":"Dịch vụ Đầu tư Bất Động Sản","CDC":"Xây dựng & Vật liệu","VCK":"Dịch vụ tài chính","V21":"Xây dựng & Vật liệu","AME":"Dụng cụ điện & Điện tử","CMG":"Phần mềm & Dịch vụ máy tính","BTP":"Điện lực","TMS":"Giao thông công nghiệp","PGV":"Điện lực","TDP":"Hóa chất","HCC":"Xây dựng & Vật liệu","DHT":"Dược phẩm & công nghệ sinh học","DAD":"Bán lẻ","NHH":"Hóa chất","VPL":"","NAG":"Hàng hóa giải trí","CSC":"Dịch vụ Đầu tư Bất Động Sản","PRC":"Giao thông công nghiệp","MCH":"Sản xuất thực phẩm","VE3":"Xây dựng & Vật liệu","CLW":"Ga, nước & dịch vụ công cộng gia dụng","TTL":"Xây dựng & Vật liệu","TDW":"Ga, nước & dịch vụ công cộng gia dụng","BTS":"Xây dựng & Vật liệu","TMB":"Khai thác mỏ","NDN":"Dịch vụ Đầu tư Bất Động Sản","SHA":"Hàng gia dụng","PTX":"Sản xuất dầu khí","HAS":"Xây dựng & Vật liệu","APS":"Dịch vụ tài chính","CCC":"Hàng gia dụng","SSM":"Xây dựng & Vật liệu","TCX":"Dịch vụ tài chính","PNJ":"Bán lẻ","BPC":"Công nghiệp tổng hợp","PMP":"Công nghiệp tổng hợp","GEG":"Điện lực","DNP":"Xây dựng & Vật liệu","HAG":"Sản xuất thực phẩm","BCF":"Sản xuất thực phẩm","HBS":"Dịch vụ tài chính","TMP":"Điện lực","HOM":"Xây dựng & Vật liệu","PDV":"Giao thông công nghiệp","LGC":"Xây dựng & Vật liệu","TDT":"Hàng hóa cá nhân","KDC":"Sản xuất thực phẩm","DRL":"Điện lực","PNC":"Bán lẻ","TVT":"Hàng hóa cá nhân","PBP":"Công nghiệp tổng hợp","SCG":"Xây dựng & Vật liệu","NAP":"Giao thông công nghiệp","VNG":"Du lịch & Giải trí","ABR":"Ga, nước & dịch vụ công cộng gia dụng","VC7":"Xây dựng & Vật liệu","STP":"Công nghiệp tổng hợp","CJC":"Công nghiệp cơ khí ","AGG":"Dịch vụ Đầu tư Bất Động Sản","BKC":"Khai thác mỏ","HVN":"Du lịch & Giải trí","ADP":"Xây dựng & Vật liệu","STC":"Truyền thông","HII":"Khai thác mỏ","API":"Dịch vụ tài chính","CAG":"Giao thông công nghiệp","IVS":"Dịch vụ tài chính","CRC":"Bán lẻ","APH":"Hóa chất","LAS":"Hóa chất","GHC":"Xây dựng & Vật liệu","GMX":"Xây dựng & Vật liệu","VSA":"Giao thông công nghiệp","VCC":"Xây dựng & Vật liệu","GTA":"Hàng gia dụng","AST":"Bán lẻ","POT":"Dụng cụ & công nghệ phần cứng","DLG":"Hàng gia dụng","DXV":"Xây dựng & Vật liệu","SHE":"Dụng cụ điện & Điện tử","PDR":"Dịch vụ Đầu tư Bất Động Sản","VIP":"Giao thông công nghiệp","DAH":"Du lịch & Giải trí","BVS":"Dịch vụ tài chính","TCD":"Xây dựng & Vật liệu","EVE":"Hàng gia dụng","QTC":"Xây dựng & Vật liệu","FMC":"Sản xuất thực phẩm","BCE":"Xây dựng & Vật liệu","ASM":"Dịch vụ Đầu tư Bất Động Sản","DPM":"Hóa chất","L10":"Xây dựng & Vật liệu","THD":"Xây dựng & Vật liệu","MBB":"Ngân hàng","HAP":"Sản xuất giấy & Trồng rừng","STG":"Giao thông công nghiệp","VIB":"Ngân hàng","VDP":"Dược phẩm & công nghệ sinh học","VSI":"Xây dựng & Vật liệu","NSC":"Sản xuất thực phẩm","MZG":"Sản xuất giấy & Trồng rừng","SHS":"Dịch vụ tài chính","SGH":"Du lịch & Giải trí","TTC":"Xây dựng & Vật liệu","PVC":"Dụng cụ, dịch vụ & Phân phối Dầu","KSD":"Hàng hóa cá nhân","BMC":"Khai thác mỏ","STK":"Hàng hóa cá nhân","VIT":"Xây dựng & Vật liệu","NHC":"Xây dựng & Vật liệu","D11":"Dịch vụ Đầu tư Bất Động Sản","CPC":"Hóa chất","TOT":"Giao thông công nghiệp","INC":"Dịch vụ hỗ trợ","SFC":"Bán lẻ","FCM":"Khai thác mỏ","PAN":"Sản xuất thực phẩm","TMT":"Ôtô & phụ tùng ôtô","DPG":"Xây dựng & Vật liệu","VC3":"Xây dựng & Vật liệu","TNC":"Hóa chất","TCH":"Dịch vụ Đầu tư Bất Động Sản","TKU":"Kim loại công nghiệp","SCI":"Xây dựng & Vật liệu","BAB":"Ngân hàng","NLG":"Dịch vụ Đầu tư Bất Động Sản","HGM":"Khai thác mỏ","QCG":"Dịch vụ Đầu tư Bất Động Sản","SVD":"Hàng hóa cá nhân","TSB":"Dụng cụ điện & Điện tử","COM":"Bán lẻ","SPM":"Dược phẩm & công nghệ sinh học","LPB":"Ngân hàng","DHG":"Dược phẩm & công nghệ sinh học","MED":"Dược phẩm & công nghệ sinh học","ONE":"Dụng cụ & công nghệ phần cứng","ICT":"Dụng cụ & công nghệ phần cứng","PPP":"Dược phẩm & công nghệ sinh học","KKC":"Kim loại công nghiệp","MCM":"Sản xuất thực phẩm","DXG":"Dịch vụ Đầu tư Bất Động Sản","TEG":"Sản xuất giấy & Trồng rừng","MAS":"Giao thông công nghiệp","BCG":"Dịch vụ hỗ trợ","DBC":"Sản xuất thực phẩm","CTF":"Bán lẻ","EVF":"Dịch vụ tài chính","PCH":"Xây dựng & Vật liệu","KHP":"Điện lực","SBA":"Điện lực","TXM":"Xây dựng & Vật liệu","NVT":"Dịch vụ Đầu tư Bất Động Sản","BID":"Ngân hàng","PHR":"Hóa chất","VHE":"Bán lẻ thực phẩm & thuốc","NST":"Thuốc lá","APG":"Dịch vụ tài chính","PTB":"Xây dựng & Vật liệu","NRC":"Dịch vụ Đầu tư Bất Động Sản","HAX":"Bán lẻ","HTI":"Xây dựng & Vật liệu","HJS":"Điện lực","CHP":"Điện lực","NBW":"Ga, nước & dịch vụ công cộng gia dụng","DXP":"Giao thông công nghiệp","TMC":"Bán lẻ","TAL":"Dịch vụ Đầu tư Bất Động Sản","IDC":"Dịch vụ Đầu tư Bất Động Sản","SAV":"Hàng gia dụng","VSH":"Điện lực","VGS":"Kim loại công nghiệp","SDU":"Dịch vụ Đầu tư Bất Động Sản","PJC":"Giao thông công nghiệp","DHC":"Sản xuất giấy & Trồng rừng","PPY":"Dụng cụ, dịch vụ & Phân phối Dầu"};
const YTD0={"KOS":38.6,"PIC":16.4,"SZC":29.1,"MKV":15.3,"VDS":16.6,"SBV":7.78,"GDW":34.93,"GSP":10.5,"SD9":10.71,"TET":33.19,"IDJ":4.9,"CII":21.0,"DMC":59.7,"S99":9.1,"VPH":3.94,"HCM":21.39,"MHC":11.9,"HHC":149.7,"VTC":11.54,"MIG":17.45,"HUT":15.5,"NKG":13.23,"SVN":2.8,"SED":18.28,"HDA":5.55,"NTH":55.04,"PHC":4.93,"VVS":38.75,"TBC":33.94,"SFN":20.92,"RCL":12.18,"HAT":31.0,"SMN":10.04,"PMS":31.38,"FIR":7.24,"PHN":59.03,"ILB":22.5,"ANV":25.35,"HID":5.85,"WSS":6.6,"MCF":6.84,"VMC":5.8,"SGD":19.6,"CRE":8.45,"VBC":19.2,"PMC":168.18,"HTV":12.2,"VID":4.83,"MSB":12.3,"MEL":6.3,"GAS":77.4,"HPX":4.83,"MSN":76.8,"DHA":68.1,"VTZ":19.4,"SAF":49.58,"DRH":2.21,"VE4":260.0,"VTB":20.1,"MWG":87.4,"VNS":9.25,"L14":28.6,"CKV":15.4,"TV4":15.0,"L40":40.49,"DAT":11.25,"PAC":19.86,"SHI":14.0,"SSI":29.15,"ABS":3.11,"VCM":9.4,"THS":11.49,"GKM":1.7,"TNI":4.95,"HKT":9.91,"ACL":13.7,"HHP":11.2,"SPC":7.8,"AMC":12.12,"TPP":10.6,"CVT":29.0,"PGC":12.33,"BKG":2.83,"PTD":7.4,"TNH":11.6,"PVD":29.1,"HLC":13.2,"DST":9.1,"HAH":57.8,"PVS":35.5,"CIG":8.3,"AAN":12.77,"KBC":34.7,"VNM":58.39,"CAN":31.0,"VE1":3.4,"PIT":6.51,"PPE":12.8,"VC6":17.88,"ASP":4.83,"HDC":19.35,"QNP":27.91,"FTS":28.36,"VFS":13.83,"HUB":15.3,"LCD":19.6,"ANT":35.42,"CST":11.94,"ACB":20.68,"LHC":57.86,"FID":1.8,"CTP":7.0,"VCG":22.15,"HTN":8.55,"VGP":27.5,"SRF":8.3,"KST":13.2,"BAX":32.98,"BIC":22.4,"KHG":6.85,"BHN":31.95,"LM8":16.0,"PSD":15.7,"SDC":5.51,"TVD":9.3,"SKG":9.45,"GMD":58.89,"HAD":14.5,"C32":10.5,"PTS":9.71,"VIX":17.73,"DBD":48.65,"ORS":13.0,"SC5":15.1,"NAB":11.83,"DXS":8.94,"PMG":7.35,"HLD":24.8,"PVB":36.8,"VC9":3.7,"BMI":17.3,"VCS":40.2,"BED":23.88,"DIH":9.8,"HMR":11.6,"CTT":27.81,"PJT":9.5,"TCR":2.83,"HEV":8.0,"VTV":14.6,"UIC":57.0,"PGT":7.5,"TFC":51.5,"GDT":18.3,"TLD":8.28,"SIP":48.47,"TCL":31.57,"HDB":28.95,"TN1":13.9,"GVR":25.75,"SGR":18.15,"BMP":165.06,"DSN":41.21,"BBS":12.9,"MCO":6.7,"LDP":11.1,"DVP":62.77,"BAF":30.75,"VTP":70.98,"BTT":36.35,"DPR":36.75,"PRE":21.3,"NHT":8.96,"ACC":13.8,"FRT":145.81,"NFC":56.33,"LSS":8.53,"BWE":44.8,"AMV":2.0,"PCT":8.5,"PPS":10.2,"CLL":30.4,"GEL":34.55,"NBC":8.8,"DGC":65.5,"AGR":15.35,"VPB":27.41,"REE":52.03,"SD5":8.11,"CTD":71.05,"DTT":15.31,"SJD":13.95,"NO1":6.42,"VIF":16.0,"PSC":9.79,"HMH":15.18,"PLP":6.08,"TIG":8.5,"CAR":16.5,"V12":10.8,"TDC":10.84,"DNC":48.82,"KMR":2.94,"TVB":8.08,"KSF":67.0,"CCR":11.81,"RYG":10.3,"SSC":30.16,"PGI":18.7,"CTR":83.3,"VLA":8.5,"KSV":108.6,"EVG":7.76,"PET":33.99,"TV3":17.5,"TA9":12.4,"SJS":60.0,"SGC":76.2,"SJE":18.0,"KHS":14.7,"MDC":10.0,"TCO":8.91,"PCE":19.6,"SZL":48.0,"VMD":16.5,"SMT":11.6,"DCL":42.9,"SHP":31.62,"LIX":31.96,"KMT":9.0,"VSM":14.1,"NSH":4.9,"DTG":15.5,"EID":21.72,"MVB":16.2,"PC1":22.9,"HVT":28.5,"CKG":9.72,"NCT":90.5,"TD6":7.1,"HTL":23.0,"BSI":34.32,"DL1":5.1,"PDB":25.45,"YEG":11.17,"ASG":16.9,"HSL":7.02,"PIA":26.5,"HHS":11.8,"HNA":21.5,"DQC":10.4,"VPX":28.3,"HHV":12.5,"GEX":28.28,"PSE":10.6,"ATS":26.8,"TVC":8.6,"ADS":7.07,"CCL":5.54,"CTG":35.5,"GIC":10.78,"VOS":12.5,"SVC":22.0,"SGT":16.2,"VPI":57.5,"BVH":57.3,"IMP":52.1,"LBE":20.83,"CMV":8.39,"NT2":24.35,"MBG":3.1,"PPT":15.3,"CEO":19.94,"SSB":14.27,"IDI":6.81,"KLB":13.05,"EBS":10.83,"DC2":6.32,"ACG":35.45,"TRC":76.7,"SVT":10.85,"LCG":9.34,"LDG":4.25,"LHG":28.7,"PV2":2.6,"HVH":12.0,"BCC":7.6,"PSI":7.7,"SMB":38.83,"FCN":14.25,"CLC":52.23,"HAR":3.93,"TPB":16.6,"NTL":19.3,"VCB":57.1,"ECI":9.5,"KTS":35.7,"TTA":10.65,"C69":12.7,"HMC":10.88,"HPA":40.65,"BNA":7.2,"YBM":10.35,"TCB":34.23,"DSE":21.92,"VDL":9.1,"ALT":13.0,"PSW":7.6,"SBT":23.49,"PGD":24.0,"MSH":31.07,"JVC":5.83,"LAF":16.72,"GLT":19.39,"LIG":4.0,"UNI":8.9,"ST8":4.71,"TIX":39.33,"BRC":12.0,"PVT":17.09,"S4A":31.06,"SBG":12.5,"INN":39.6,"OGC":3.75,"HU1":6.7,"VPD":23.41,"TDM":56.7,"LBM":34.6,"VAB":10.35,"NBB":18.8,"NDX":6.0,"SZB":37.3,"HDG":23.3,"BTW":57.81,"ITQ":2.8,"SFI":24.07,"VSC":19.6,"SHB":15.87,"VTH":8.4,"DTD":13.84,"DAE":12.92,"NHA":15.4,"MDG":26.54,"VCA":8.19,"SEB":45.0,"DHM":5.79,"TJC":8.58,"IPA":17.8,"CX8":9.5,"VMS":27.49,"PDN":111.06,"QHD":47.3,"VIC":173.1,"AAA":7.7,"SAM":7.27,"TDH":4.34,"DRC":14.12,"ADC":17.17,"SMA":8.5,"HQC":2.96,"PEN":8.3,"NBP":7.9,"DCM":33.35,"VFG":48.92,"ICG":16.37,"NVL":12.42,"SAB":46.13,"CLH":18.97,"AAM":6.88,"RAL":90.31,"IDV":23.24,"SJ1":12.45,"WCS":283.3,"EIB":20.95,"BFC":42.8,"VC2":6.1,"AFX":11.95,"SDG":9.3,"THT":7.2,"PTI":31.0,"MCC":13.2,"TSC":3.05,"POW":12.65,"TDG":3.0,"TCT":19.4,"CTS":24.1,"TTH":2.3,"S55":54.44,"NNC":66.0,"TLG":49.07,"TTT":35.1,"VNC":35.3,"ELC":24.35,"DBT":11.3,"CNG":24.45,"SGN":58.9,"ADG":9.0,"VPG":4.96,"HTC":33.08,"CMX":6.25,"CSV":26.8,"ITC":13.75,"SCR":7.39,"DIG":17.3,"SRC":39.48,"VHM":127.69,"CTI":22.1,"PGN":6.2,"VJC":159.61,"OCB":10.22,"NAV":16.48,"KDH":31.9,"CET":9.7,"MST":6.3,"FIT":4.68,"MIC":12.6,"NVB":13.4,"HPG":23.17,"DP3":49.64,"DHP":10.99,"VGC":41.5,"PVP":13.95,"TSA":15.3,"TRA":75.0,"CMS":7.5,"CCI":22.92,"SRA":2.7,"HT1":15.5,"HCD":6.06,"CIA":9.1,"VNT":27.1,"HSG":11.88,"FPT":93.71,"CMC":9.3,"VND":18.18,"SMC":14.0,"GMA":57.0,"DTA":3.98,"SLS":161.9,"TIP":17.7,"THG":39.34,"TTF":3.06,"FDC":16.3,"OCH":6.1,"L18":21.81,"CAP":36.65,"TYA":15.98,"DTK":11.39,"PVG":6.3,"EVS":5.9,"DGW":40.71,"GEE":128.21,"DTL":13.25,"VIG":5.7,"PVI":95.0,"TTE":39.1,"QST":26.56,"TNT":9.24,"VPS":9.27,"DC4":9.36,"CTB":17.0,"TNG":16.96,"VHC":55.5,"PLX":36.3,"BSR":16.25,"X20":13.0,"CSM":13.15,"VNR":20.3,"ABT":66.81,"KDM":23.5,"SHN":4.8,"ARM":24.76,"GMH":7.32,"MBS":20.18,"NAF":38.15,"TLH":4.75,"VTO":10.33,"OPC":22.6,"NTP":50.76,"TMX":8.7,"TV2":33.3,"VC1":12.9,"GIL":13.6,"IJC":10.09,"TCI":9.42,"VHL":11.0,"BXH":18.0,"VTJ":4.0,"HRC":30.05,"HCT":10.8,"LGL":6.17,"DSC":14.5,"MAC":11.53,"PTL":2.8,"VCF":288.0,"AAT":3.29,"VNF":13.09,"VRE":34.38,"TPC":13.25,"DVM":5.7,"ITD":15.06,"VCI":24.61,"PMB":9.9,"CLM":62.62,"HTG":43.3,"THB":9.2,"NET":67.8,"PPC":9.84,"PGS":49.61,"TCM":24.32,"SCS":51.4,"BCM":60.06,"DS3":6.8,"MCP":28.35,"D2D":35.0,"PLC":24.2,"KSB":17.2,"VRC":14.75,"VNL":20.0,"PTC":6.7,"SFG":10.4,"TVS":14.7,"SDN":26.0,"C47":9.7,"CDN":32.28,"CRV":30.0,"STB":57.9,"NTC":155.5,"CDC":16.91,"VCK":30.41,"V21":6.5,"AME":7.4,"CMG":31.68,"BTP":8.99,"TMS":40.0,"PGV":19.45,"TDP":27.8,"HCC":30.4,"DHT":68.1,"DAD":16.76,"NHH":11.55,"VPL":100.0,"NAG":8.2,"CSC":15.85,"PRC":12.2,"MCH":179.99,"VE3":8.6,"CLW":41.26,"TTL":8.7,"TDW":47.4,"BTS":5.4,"TMB":52.18,"NDN":11.2,"SHA":3.96,"PTX":22.29,"HAS":8.2,"APS":7.3,"CCC":11.4,"SSM":5.5,"TCX":37.78,"PNJ":65.04,"BPC":12.3,"PMP":12.5,"GEG":14.14,"DNP":20.2,"HAG":16.85,"BCF":41.4,"HBS":4.4,"TMP":59.8,"HOM":4.9,"PDV":9.69,"LGC":55.5,"TDT":6.35,"KDC":50.78,"DRL":46.4,"PNC":18.65,"TVT":16.5,"PBP":12.8,"SCG":63.9,"NAP":9.96,"VNG":7.54,"ABR":11.9,"VC7":9.21,"STP":7.37,"CJC":21.6,"AGG":14.15,"BKC":20.8,"HVN":24.9,"ADP":21.84,"STC":14.72,"HII":5.55,"API":6.7,"CAG":7.0,"IVS":9.1,"CRC":9.28,"APH":6.34,"LAS":15.5,"GHC":29.1,"GMX":13.79,"VSA":19.5,"VCC":9.1,"GTA":9.59,"AST":61.63,"POT":21.4,"DLG":2.62,"DXV":3.8,"SHE":6.6,"PDR":18.7,"VIP":11.09,"DAH":3.69,"BVS":28.3,"TCD":1.89,"EVE":9.02,"QTC":29.0,"FMC":33.95,"BCE":9.08,"ASM":6.4,"DPM":22.5,"L10":23.66,"THD":30.3,"MBB":25.35,"HAP":7.36,"STG":38.9,"VIB":16.78,"VDP":58.0,"VSI":25.0,"NSC":74.93,"MZG":11.7,"SHS":19.4,"SGH":27.0,"TTC":8.1,"PVC":11.6,"KSD":4.4,"BMC":14.9,"STK":15.45,"VIT":20.68,"NHC":22.0,"D11":11.0,"CPC":16.15,"TOT":13.43,"INC":14.4,"SFC":17.15,"FCM":3.43,"PAN":20.37,"TMT":13.3,"DPG":36.89,"VC3":27.2,"TNC":32.6,"TCH":17.9,"TKU":13.5,"SCI":9.4,"BAB":10.9,"NLG":30.46,"HGM":221.37,"QCG":14.4,"SVD":4.49,"TSB":25.3,"COM":28.98,"SPM":9.5,"LPB":38.27,"DHG":96.99,"MED":25.0,"ONE":7.3,"ICT":18.05,"PPP":19.0,"KKC":6.7,"MCM":25.53,"DXG":14.91,"TEG":6.52,"MAS":38.0,"BCG":2.53,"DBC":23.34,"CTF":18.95,"EVF":10.75,"PCH":18.6,"KHP":11.69,"SBA":27.03,"TXM":4.5,"NVT":7.94,"BID":38.45,"PHR":56.8,"VHE":3.7,"NST":11.7,"APG":10.4,"PTB":37.27,"NRC":5.9,"HAX":10.4,"HTI":21.39,"HJS":26.15,"CHP":28.29,"NBW":31.9,"DXP":10.7,"TMC":7.03,"TAL":35.31,"IDC":36.0,"SAV":11.94,"VSH":43.0,"VGS":24.42,"SDU":17.1,"PJC":25.77,"DHC":30.1,"PPY":9.5};
const REV_FIX = {"VPB":27.0,"VNR":11.0,"VIB":8.1,"VCB":29.0,"VAB":10.3,"TPB":2.2,"TCB":14.6,"STB":-12.0,"SSB":-1.5,"SHB":-0.8,"PVI":27.4,"PTI":4.2,"PRE":5.6,"PGI":11.4,"OCB":10.1,"NVB":56.9,"NAB":-1.9,"MSB":27.7,"MIG":2.6,"MBB":27.5,"LPB":18.2,"KLB":8.3,"HDB":14.5,"EVF":5.5,"EIB":1.9,"CTG":25.3,"BVH":-1.5,"BMI":1.5,"BID":12.8,"BIC":10.1,"BAB":16.7,"ACB":9.9};
SUM.rows.forEach(r => {
  r._p0 = r.p;
  r._eps = (r.pe && r.p) ? r.p / r.pe : null;
  r._sh  = (r.cap && r.p) ? r.cap / r.p : null;
  r._bv  = (r.pb && r.p) ? r.p / r.pb : null;
  r.sec  = SEC_MAP[r.t] || '';
  if (r.revYoY == null && REV_FIX[r.t] != null) r.revYoY = REV_FIX[r.t];
});
function scDerive(r){
  r._peR = r._eps ? r.p / r._eps : r.pe;
  r._pbR = r._bv  ? r.p / r._bv  : r.pb;
  r._capR= r._sh  ? r.p * r._sh  : r.cap;
  const y0=YTD0[r.t]; r._ytd = (y0 && r.p) ? (r.p/y0-1)*100 : null;
}

document.getElementById('bgeData').textContent = 'Dữ liệu screener: ' + SUM.updated;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = (x,d=1) => x==null||isNaN(x) ? '—' : Number(x).toLocaleString('vi-VN',{maximumFractionDigits:d,minimumFractionDigits:0});
const pct = (x,d=1) => x==null||isNaN(x) ? '—' : (x>0?'+':'')+Number(x).toFixed(d)+'%';
const cls = x => x==null ? 'mut' : x>0 ? 'up' : x<0 ? 'down' : 'mut';
const toast = m => { const t = $('#toast'); t.textContent = m; t.style.display='block'; setTimeout(()=>t.style.display='none', 3500); };
const NOW = () => Math.floor(Date.now()/1000);

const REV = ['isa3','isb27','isi64','nos689','nos693'], NPAT = ['isa22','isa20'];
const pick = (row, codes) => { for (const c of codes) if (row[c]!=null) return row[c]; return null; };
const pickRev = (row, codes) => { for (const c of codes){ const v=row[c]; if (v!=null && v!==0) return v; } return null; };

const pickTop = (row) => { if (row && row.isb38) return row.isb38; return pickRev(row, REV); };
function __fRN(){ return window.__FIN_BANK ? 'TOI' : 'Doanh thu'; }
function __fRS(){ return window.__FIN_BANK ? 'TOI' : 'DT'; }
function __fTxtB(x){ return window.__FIN_BANK ? String(x).replace(/Doanh thu/g,'TOI').replace(/doanh thu/g,'TOI') : x; }

async function jget(u){ const r = await fetch(u); if(!r.ok) throw new Error(r.status); return r.json(); }
const api = {
  ohlc: async (sym, days) => { const to = NOW()+86400; return jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${sym}&resolution=D&from=${to-86400*days}&to=${to}`); },
  kqkd: async t => (await jget(`https://iq.vietcap.com.vn/api/iq-insight-service/v1/company/${t}/financial-statement?section=INCOME_STATEMENT`))?.data?.quarters || [],
  ratios: async t => ((await jget(`https://iq.vietcap.com.vn/api/iq-insight-service/v1/company/${t}/statistics-financial`))?.data||[]).filter(x=>x.ratioType==='RATIO_TTM'&&x.quarter>=1&&x.quarter<=4)
};

const ga = (n,p) => { try { window.gtag && gtag('event', n, p||{}); } catch(e){} };
const _ntf = {};
function beepSound(){ try { const a = new (window.AudioContext||window.webkitAudioContext)(); const o = a.createOscillator(), g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = 880; g.gain.value = 0.12; o.start(); o.stop(a.currentTime + 0.3); } catch(e){} }
function notifyPush(key, title, body, repeatMs){
  const now = Date.now();
  if (_ntf[key] && now - _ntf[key] < (repeatMs || 8.64e7)) return;
  _ntf[key] = now;
  toast(title + ' — ' + body);
  beepSound();
  try { if ('Notification' in window && Notification.permission === 'granted') {
    const n = new Notification(title, {body, tag: key, requireInteraction: true, renotify: true});
    n.onclick = () => { window.focus(); n.close(); };
  } } catch(e){}
}
document.addEventListener('click', () => { try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch(e){} }, {once:true});
// ============ CHỈ BÁO KỸ THUẬT ============
function smaS(a,n){ const o=[]; let s=0; for(let i=0;i<a.length;i++){ s+=a[i]; if(i>=n) s-=a[i-n]; o.push(i>=n-1 ? s/n : null);} return o; }
function emaS(a,n){ const o=[]; const k=2/(n+1); let e=null; for(let i=0;i<a.length;i++){ e = e==null ? a[i] : a[i]*k + e*(1-k); o.push(i>=n-1?e:null);} return o; }
function rsiS(c,n=14){ const o=[null]; let g=0,l=0; for(let i=1;i<c.length;i++){ const d=c[i]-c[i-1]; const up=Math.max(d,0), dn=Math.max(-d,0); if(i<=n){ g+=up; l+=dn; o.push(i===n ? 100-100/(1+(g/n)/((l/n)||1e-9)) : null); if(i===n){g/=n;l/=n;} } else { g=(g*(n-1)+up)/n; l=(l*(n-1)+dn)/n; o.push(100-100/(1+g/(l||1e-9))); } } return o; }
function macdS(c){ const e12=emaS(c,12), e26=emaS(c,26); const m=c.map((_,i)=>e12[i]!=null&&e26[i]!=null?e12[i]-e26[i]:null); const valid=m.map(x=>x==null?0:x); const sig=emaS(valid,9).map((x,i)=>m[i]==null?null:x); return {m, sig, hist:m.map((x,i)=>x!=null&&sig[i]!=null?x-sig[i]:null)}; }
function bollS(c,n=20,k=2){ const ma=smaS(c,n); return c.map((_,i)=>{ if(ma[i]==null) return [null,null]; let s=0; for(let j=i-n+1;j<=i;j++) s+=Math.pow(c[j]-ma[i],2); const sd=Math.sqrt(s/n); return [ma[i]+k*sd, ma[i]-k*sd]; }); }

// ================= ĐIỀU HƯỚNG =================
const views = ['market','screener','watch','detail','compare','leader'];
$$('.nav-link').forEach(b => b.onclick = () => showView(b.dataset.view));
function showView(v, skip){ ga('view_tab', {tab_name: v}); views.forEach(x => { $('#view-'+x).style.display = x===v?'':'none'; }); $$('.nav-link').forEach(b=>b.classList.toggle('active', b.dataset.view===v)); const fd=document.getElementById('footDisc'); if(fd) fd.style.display=(v==='screener'||v==='news'||v==='compare'||v==='leader')?'none':''; if(!skip) inits[v] && inits[v](); }
window.showView = showView;

const inits = {};
// ================= WATCHLIST — DANH MUC THEO DOI (dai tren tab Chi tiet ma) =================
function buildWatchStrip(){
try{
const vd=document.getElementById('view-detail');
if(!vd||document.getElementById('watchStrip'))return;
const ws=ROWS().filter(r=>r.watch&&r.wgrade!=='weak').sort((a,b)=>{const sa=a.wstar?0:1,sb=b.wstar?0:1;if(sa!==sb)return sa-sb;return (a.wrng||99)-(b.wrng||99);});
if(!ws.length)return;
let lab='';
const up=(SUM.updated||'').slice(0,10);
if(up){const dt=new Date(up+'T12:00:00');const wd=dt.getDay();dt.setDate(dt.getDate()+(wd===5?3:(wd===6?2:1)));lab=('0'+dt.getDate()).slice(-2)+'/'+('0'+(dt.getMonth()+1)).slice(-2);}
const chip=r=>{const ch=(r._lv!=null?r._lv:r.chg);
const txt=ch!=null?((ch>0?'+':'')+(+ch).toFixed(1)+'%'):'\u2014';
const col=ch==null?'#7A828E':(ch>0?'#18A34B':(ch<0?'#E5484D':'#7A828E'));
return '<span class="wchip" data-t="'+r.t+'" style="display:inline-flex;align-items:center;gap:3px;padding:1px 7px;border:1px solid #E8EAEF;border-radius:999px;cursor:pointer;background:#fff;font-weight:700;font-size:11.5px;color:#1F2937;white-space:nowrap">'+(r.wstar?'<span style="color:#B45309;font-size:10px">\u2605</span>':'')+r.t+'<span id="wlv_'+r.t+'" style="color:'+col+';font-weight:600;font-size:10.5px">'+txt+'</span></span>';};
const el=document.createElement('div');el.id='watchStrip';
el.style.cssText='display:flex;align-items:center;gap:6px;background:#FFFFFF;border:1px solid #E8EAEF;border-radius:9px;padding:5px 10px;margin-bottom:8px;overflow-x:auto;scrollbar-width:none';
el.innerHTML='<span style="font-weight:700;font-size:11.5px;color:#7A828E;white-space:nowrap;flex:0 0 auto">Watchlist '+lab+'</span>'+ws.map(chip).join('');
el.addEventListener('click',e=>{const c2=e.target.closest('.wchip');if(c2&&window.openDetail)window.openDetail(c2.dataset.t);});
vd.insertBefore(el,vd.firstChild);
}catch(e){}
}
buildWatchStrip();
setInterval(function(){
if(!document.getElementById('watchStrip')){buildWatchStrip();return;}
try{ROWS().forEach(function(r){if(!r.watch)return;const s=document.getElementById('wlv_'+r.t);if(!s)return;const ch=(r._lv!=null?r._lv:r.chg);if(ch==null)return;s.textContent=(ch>0?'+':'')+(+ch).toFixed(1)+'%';s.style.color=ch>0?'#18A34B':(ch<0?'#E5484D':'#7A828E');});}catch(e){}
},5000);


// ================= LEADER BOARD =================
(function addLeaderTab(){
  const nav = document.querySelector('nav');
  if (nav && !nav.querySelector('[data-view="leader"]')) {
    const b = document.createElement('button');
    b.className = 'nav-link'; b.dataset.view = 'leader'; b.textContent = 'Leader Board';
    b.onclick = () => showView('leader');
    nav.appendChild(b);
  }
  if (nav) ['market','detail','leader','compare','screener','watch'].forEach(v => {
    const b = nav.querySelector('[data-view="'+v+'"]'); if (b) nav.appendChild(b);
  });
  if (!document.getElementById('lbCss')) {
    const st = document.createElement('style'); st.id = 'lbCss';
    st.textContent = '.wrap,.topbar-in{max-width:min(1800px,96vw)!important}'
      + '#lbGrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:5px;align-items:start;padding:6px 0 8px}'
      + '#lbGrid .lbCol{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:5px 4px;min-width:0}'
      + '#lbGrid .lbHd{font-weight:700;font-size:9px;line-height:1.15;color:var(--text);padding-bottom:4px;margin-bottom:5px;border-bottom:2px solid var(--green);min-height:23px;display:flex;align-items:flex-end}'
      + '#lbGrid .lbR{display:flex;justify-content:space-between;gap:3px;padding:2px 4px;margin-bottom:1.5px;border-radius:3px;cursor:pointer;font-size:10.5px;line-height:1.4}'
      + '#lbGrid .lbR b{font-weight:700}'
      + '@media(max-width:1150px){#lbGrid{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(104px,1fr);overflow-x:auto}}';
    document.head.appendChild(st);
  }
  if (!document.getElementById('view-leader')) {
    const d = document.createElement('div');
    d.id = 'view-leader'; d.style.display = 'none';
    const a = document.getElementById('view-compare');
    if (a && a.parentNode) a.parentNode.insertBefore(d, a.nextSibling);
    else { const w = document.querySelector('.wrap'); if (w) w.appendChild(d); }
  }
})();

(function brandLogo(){
  const m = document.querySelector('.logo-mark');
  if (!m || m.dataset.img) return;
  m.dataset.img = '1';
  m.textContent = '';
  m.style.cssText = 'display:inline-flex;width:36px;height:36px;border-radius:9px;background:none;box-shadow:none;align-items:center;justify-content:center;overflow:hidden;flex:none';
  const img = document.createElement('img');
  img.src = 'logo.png';
  img.alt = 'Khoa Nguyen Invest';
  img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block';
  m.appendChild(img);
})();

(function brandFooter(){
  const f = document.querySelector('footer');
  if (!f || f.dataset.branded) return;
  f.dataset.branded = '1';
  f.innerHTML =
    '<div style="font-style:normal;font-weight:700;font-size:13.5px;color:var(--text)">'
    + '<span class="nbName">Nguyễn Ngọc Anh Khoa</span>'
    + '<span class="nbSep" style="color:var(--border);font-weight:400;margin:0 8px">|</span>'
    + '<a href="tel:0339136452" style="color:var(--green-dark);text-decoration:none">0339 136 452</a>'
    + '<span class="nbSep" style="color:var(--border);font-weight:400;margin:0 8px">|</span>'
    + '<span class="nbTitle">Giám đốc Tư vấn Đầu tư — Chứng khoán KAFI</span>'
    + '</div>'
    + '<div id="footDisc" style="margin-top:7px;font-size:11px;font-style:italic">Số liệu hiệu suất từ mô phỏng lịch sử (backtest) đã gồm phí giao dịch; kết quả quá khứ không đảm bảo tương lai — thông tin chỉ mang tính tham khảo, không phải khuyến nghị đầu tư.</div>';
})();

const LB_SECTORS = {
  "THÉP": ["HPG","HSG","VGS","NKG"],
  "BĐS": ["DXG","CEO","DXS","DPG","NVL","VHM","VIC","NTL","NLG","DIG","HDC","ITC","TCH","PDR","DTD","KDH","ASM","TDC","L14","TIG"],
  "CHỨNG KHOÁN": ["CTS","VND","SHS","VIX","SSI","MBS","ORS","FTS","BVS","AGR","HCM","VCI","BSI"],
  "NGÂN HÀNG": ["SHB","MBB","STB","OCB","TCB","CTG","MSB","VPB","EIB","ACB","HDB","TPB","LPB","BID","VIB","VCB","NAB"],
  "BĐS KCN": ["PHR","GVR","SZC","DPR","KBC","VGC","IDC","IJC","SIP"],
  "CẢNG - VẬN TẢI": ["PVP","VOS","DXP","VIP","GMD","HAH","VSC"],
  "ĐẦU TƯ CÔNG": ["CTI","VCG","HT1","PLC","CTD","HHV","FCN","KSB","CII","LCG","HUT"],
  "DẦU KHÍ": ["PVC","GAS","PVS","PVB","PVT","OIL","PLX","PVD","BSR"],
  "BÁN LẺ": ["DGW","MWG","PET","FRT","PNJ"],
  "PHÂN BÓN - HÓA CHẤT": ["DDV","BFC","DCM","DPM","LAS","DGC","CSV"],
  "MID": ["DBC","GEX","ANV","HDG","REE","GIL","TNG","NTP","MSH","BMP","HVN","CTR","QNS","TV2","SCS","VHC","VGI","DRC","EVF","VCS","PC1","VTP","ACV","VPG"],
  "VN30": ["GAS","MBB","STB","TCB","CTG","MSN","MWG","HPG","VHM","VIC","VPB","SHB","ACB","VRE","BVH","SSI","BID","VIB","VCB","BCM","VNM","FPT","SAB"]
};
const LB_BANDS = [
  {max:400,  label:'Yếu',       rng:'&lt;400',    bg:'#BFE6F7', fg:'#0F3D56'},
  {max:500,  label:'Trung Bình',rng:'400-500',    bg:'#FFFFFF', fg:'#1F2937'},
  {max:550,  label:'Khá',       rng:'500-550',    bg:'#D9EFD9', fg:'#14532D'},
  {max:600,  label:'Khỏe',      rng:'550-600',    bg:'#00A550', fg:'#FFFFFF'},
  {max:1e9,  label:'Rất Khỏe',  rng:'&gt;600',    bg:'#C77DD6', fg:'#FFFFFF'}
];
const lbBand = v => LB_BANDS.find(b => v < b.max) || LB_BANDS[LB_BANDS.length-1];

function lbRangePos(c, L, p){
  if (L-p+1 < 0) return null;
  const s = c.slice(L-p+1, L+1);
  let hi=-Infinity, lo=Infinity;
  for (const x of s){ if(x.h>hi) hi=x.h; if(x.l<lo) lo=x.l; }
  return hi===lo ? 0 : 100*(c[L].c-lo)/(hi-lo);
}
function lbMoneyFlow(c, L, p){
  if (L-p+1 < 0) return null;
  const s = c.slice(L-p+1, L+1);
  let pos=0, neg=0;
  for (let i=1;i<s.length;i++){
    const a=(s[i].h+s[i].l+s[i].c)/3, b=(s[i-1].h+s[i-1].l+s[i-1].c)/3;
    const f=a*s[i].v;
    if (a>b) pos+=f; else if (a<b) neg+=f;
  }
  if (neg===0) return 100;
  return 100-(100/(1+pos/neg));
}
function lbScore(c, L){
  const P=[20,50,100,200];
  let t=0;
  for (const p of P){
    const k=lbRangePos(c,L,p), m=lbMoneyFlow(c,L,p);
    if (k===null||m===null) return null;
    t += k+m;
  }
  return t;
}

let lbRaw = null, lbLoading = false, lbTimer = null, lbStamp = '';
const LB_SYMS = [...new Set(Object.values(LB_SECTORS).flat())];
const lbInSession = () => { const d=new Date(), w=d.getDay(), m=d.getHours()*60+d.getMinutes();
  return w>=1 && w<=5 && m>=9*60 && m<=15*60; };

async function lbFetchAll(onProg){
  const now = Math.floor(Date.now()/1000);
  const from = now - 86400*500, to = now + 86400;
  const out = {}; let idx = 0, done = 0;
  await Promise.all(Array.from({length:8}, async () => {
    while (idx < LB_SYMS.length){
      const sy = LB_SYMS[idx++];
      try {
        const r = await fetch(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${sy}&resolution=D&from=${from}&to=${to}`).then(x=>x.json());
        if (r && r.t && r.t.length >= 200) out[sy] = r.t.map((tt,i)=>({t:tt, h:r.h[i], l:r.l[i], c:r.c[i], v:r.v[i]}));
      } catch(e){}
      done++; onProg && onProg(done, LB_SYMS.length);
    }
  }));
  return out;
}

function lbRender(){
  const grid = document.getElementById('lbGrid');
  if (!grid || !lbRaw) return;
  grid.innerHTML = Object.entries(LB_SECTORS).map(([name, syms]) => {
    const rows = syms.map(sy => {
      const c = lbRaw[sy]; if (!c) return null;
      const v = lbScore(c, c.length-1); if (v===null) return null;
      return {t:sy, sm:Math.round(v)};
    }).filter(Boolean).sort((a,b)=>b.sm-a.sm);
    if (!rows.length) return '';
    const body = rows.map(r => {
      const b = lbBand(r.sm);
      const brd = b.bg === '#FFFFFF' ? ';box-shadow:inset 0 0 0 1px var(--border)' : '';
      return `<div class="lbR" onclick="openDetail('${r.t}')" style="background:${b.bg};color:${b.fg}${brd}"><b>${r.t}</b><span>${r.sm}</span></div>`;
    }).join('');
    return `<div class="lbCol"><div class="lbHd">${name}</div>${body}</div>`;
  }).join('');
  const st = document.getElementById('lbStatus');
  if (st) st.textContent = lbStamp;
}

async function lbLoad(){
  if (lbLoading) return;
  lbLoading = true;
  const st = document.getElementById('lbStatus');
  if (st && !lbRaw) st.innerHTML = '<span class="spin"></span> Đang tải dữ liệu…';
  try {
    lbRaw = await lbFetchAll((d,n)=>{ if (st && !lbRaw && d%25===0) st.innerHTML = '<span class="spin"></span> Đang xử lý ' + d + '/' + n + ' mã…'; });
    let ngay = '';
    const any = Object.values(lbRaw)[0];
    if (any) { const d = new Date(any[any.length-1].t*1000); ngay = ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2); }
    lbStamp = (lbInSession() ? 'Trong phiên · giá chạy realtime' : 'Kết phiên ' + ngay)
            + ' · cập nhật ' + new Date().toTimeString().slice(0,5) + ' · ' + Object.keys(lbRaw).length + ' mã';
    lbRender();
  } catch(e){
    if (st) st.textContent = 'Lỗi tải dữ liệu: ' + e.message;
  }
  lbLoading = false;
}

inits.leader = function(){
  const el = $('#view-leader');
  if (!el.dataset.built) {
    el.dataset.built = '1';
    el.innerHTML = `<div class="card" style="padding:14px 14px 12px">
      <div style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-bottom:4px">
        <h2 style="margin:0">Leader Board <span class="hint">sức mạnh dòng tiền theo ngành</span></h2>
        <div class="mini" id="lbStatus" style="margin-left:auto"></div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;border-bottom:1px solid var(--border);padding-bottom:9px;margin-bottom:2px">
        <span class="mini" style="font-weight:600">Thang điểm:</span>
        ${LB_BANDS.map(b=>{
          const brd = b.bg==='#FFFFFF' ? ';box-shadow:inset 0 0 0 1px var(--border)' : '';
          return `<span style="border-radius:4px;padding:2px 8px;font-size:10.5px;font-weight:700;background:${b.bg};color:${b.fg}${brd}">${b.rng} ${b.label}</span>`;
        }).join('')}
        <span class="mini" style="margin-left:auto;font-style:italic">Bấm vào mã để xem chi tiết</span>
      </div>
      <div id="lbGrid"></div>
    </div>`;
  }
  if (!lbRaw && !lbLoading) lbLoad(); else lbRender();
  if (!lbTimer) lbTimer = setInterval(() => {
    const v = document.getElementById('view-leader');
    if (v && v.style.display !== 'none' && lbInSession() && !lbLoading) lbLoad();
  }, 180000);
};

// ===== Tim kiem tren navbar =====
(function(){
  const q = $('#navQ'), box = $('#navSugg');
  if (!q) return;
  q.addEventListener('input', () => {
    const s = q.value.toUpperCase();
    if (!s) { box.style.display='none'; return; }
    const hits = ROWS().filter(r=>r.t.startsWith(s) || (r.n||'').toUpperCase().includes(s)).slice(0,10);
    box.innerHTML = hits.map(r=>`<div onclick="openDetail('${r.t}');document.getElementById('navQ').value='';document.getElementById('navSugg').style.display='none'"><b>${r.t}</b> <span class="mini">${r.n||''} · ${r.b==='HO'?'HOSE':'HNX'}</span></div>`).join('');
    box.style.display = hits.length?'block':'none';
  });
  q.addEventListener('keydown', e => { if (e.key==='Enter') { const t = q.value.toUpperCase().trim(); if (byT[t]) { window.openDetail(t); q.value=''; box.style.display='none'; } } });
  document.addEventListener('click', e => { if (!e.target.closest('.searchbox')) box.style.display='none'; });
})();

// ================= 1. THỊ TRƯỜNG =================
let mktDone = false, M_STATUS = null, perfChart = null, perfRange = 'all';
function rrect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
const endBadge = { id:'endBadge', afterDatasetsDraw(chart){
  const ctx = chart.ctx;
  chart.data.datasets.forEach((ds,di)=>{
    const meta = chart.getDatasetMeta(di); const pt = meta.data[meta.data.length-1]; if (!pt) return;
    const val = ds.data[ds.data.length-1];
    const txt = (val>=0?'+':'')+val.toFixed(1)+'%';
    ctx.save(); ctx.font = '700 12px Inter, sans-serif';
    const w = ctx.measureText(txt).width + 16;
    ctx.fillStyle = ds.borderColor; rrect(ctx, pt.x+7, pt.y-12, w, 24, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.fillText(txt, pt.x+15, pt.y+1); ctx.restore();
  });
}};
function drawPerf(){
  const tpn = SUM.tpn; if (!tpn || !tpn.curve || !tpn.curve.length) return;
  let cv = tpn.curve;
  if (/^20\d\d$/.test(perfRange)) cv = cv.filter(x=>x[0].startsWith(perfRange));
  else if (perfRange !== 'all') cv = cv.slice(perfRange==='1y' ? -52 : -26);
  const b0 = cv[0];
  const labels = cv.map(x => x[0].slice(5,7)+'/'+x[0].slice(2,4));
  const dsT = cv.map(x => +(((1+x[1]/100)/(1+b0[1]/100)-1)*100).toFixed(1));
  const dsV = cv.map(x => +(((1+x[2]/100)/(1+b0[2]/100)-1)*100).toFixed(1));
  if (perfChart) perfChart.destroy();
  perfChart = new Chart(document.getElementById('cvPerf'), { type:'line',
    data:{ labels, datasets:[
      {label:'Khoa Nguyen Signal', data:dsT, borderColor:'#128A3E', backgroundColor:'#128A3E', pointRadius:0, borderWidth:2.5, tension:.35},
      {label:'VN-Index', data:dsV, borderColor:'#E5484D', backgroundColor:'#E5484D', pointRadius:0, borderWidth:2, tension:.35}]},
    options:{ responsive:true, maintainAspectRatio:false, layout:{padding:{right:70}}, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{labels:{color:'#1F2937', usePointStyle:true, pointStyle:'circle', boxWidth:7, boxHeight:7, font:{weight:600, size:12, family:'Inter'}}},
        tooltip:{callbacks:{label:c=>c.dataset.label+': '+(c.parsed.y>=0?'+':'')+c.parsed.y+'%'}} },
      scales:{ x:{ticks:{color:'#7A828E', maxTicksLimit:10, font:{size:11}}, grid:{display:false}},
               y:{ticks:{color:'#7A828E', callback:v=>v+'%', font:{size:11}}, grid:{color:'#F1F3F6'}} } },
    plugins:[endBadge] });
}
async function liveQuote(){
  try {
    let data = null;
    for (let k = 0; k < 7; k++) {
      const day = new Date(Date.now()-k*86400000).toISOString().slice(0,10);
      const r = await jget(`https://api-finfo.vndirect.com.vn/v4/stock_prices?sort=code&q=date:gte:${day}~date:lte:${day}&size=3000`);
      if (r.data && r.data.length > 300) { data = r.data; break; }   // ngay giao dich gan nhat
    }
    if (!data) return false;
    try { window.LIVE_DATE = (data[0]&&data[0].date)||null; } catch(e){}
    let n = 0;
    data.forEach(d=>{ const row = byT[d.code]; if (!row) return;
      if (d.close!=null) { const _op=row.p; row.p = d.close; if (_op>0 && d.close>0) { const _k=d.close/_op; ['cap','pe','pb'].forEach(_f=>{ if (typeof row[_f]==='number' && isFinite(row[_f]) && row[_f]!==0) row[_f]=row[_f]*_k; }); } }
      if (d.pctChange!=null) row.chg = +(+d.pctChange).toFixed(2);
      if (row.v20 && d.nmVolume!=null) row.vx = +(d.nmVolume/row.v20).toFixed(2);
      n++; });
    if (n) { const el = document.getElementById('bgeData'); if (el) el.textContent = 'Giá cập nhật lúc ' + new Date().toTimeString().slice(0,5) + ' (phiên ' + data[0].date.slice(8,10)+'/'+data[0].date.slice(5,7) + ') · FA/screener: ' + (SUM.updated||''); }
    if (n) { try { if (typeof dtData!=='undefined' && dtData && dtData.oh && dtData.oh.c && dtData.oh.c.length) updateKpis(dtData.oh.c.length-1); } catch(e){} }
    return n > 0;
  } catch(e){ return false; }
}
function renderTops(){
  const el = document.getElementById('topCs'); if (!el) return;
  const mini2 = (rows, cols) => `<table><tr><th>Mã</th>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr>` +
    rows.map(r=>`<tr class="row" onclick="openDetail('${r.t}')"><td><b>${r.t}</b> <span class="mini">${(r.n||'').slice(0,22)}</span></td>${cols.map(c=>`<td class="${c[2]?c[2](r):''}">${c[1](r)}</td>`).join('')}</tr>`).join('') + '</table>';
  const gCols = [['Giá',r=>fmt(r.p,2)],['+/- %',r=>pct(r.chg,2),r=>cls(r.chg)],['KL (tr)',r=>r.vx&&r.v20?fmt(r.vx*r.v20/1e6,2):'—'],['KL xTB20',r=>r.vx?fmt(r.vx,1)+'x':'—',r=>(r.vx||0)>=1.5?'up':'mut'],['GTGD TB20 (tỷ)',r=>fmt((r.val20||0)/1000,0)]];
  const lq = r => (r.val20||0) >= 20000 && r.chg != null;
  el.innerHTML = mini2([...ROWS()].filter(lq).sort((a,b)=>(b.chg||-99)-(a.chg||-99)).slice(0,10), gCols);
  const el2 = document.getElementById('topRs');
  if (el2) el2.innerHTML = mini2([...ROWS()].filter(lq).sort((a,b)=>((b.vx||0)*(b.v20||0))-((a.vx||0)*(a.v20||0))).slice(0,10), gCols);
}
function renderMonthly(){
  const el = document.getElementById('moTable'); if (!el) return;
  const tpn = SUM.tpn; if (!tpn || !tpn.curve || !tpn.curve.length) return;
  const ends = {}, order = [];
  tpn.curve.forEach(x => { const k = x[0].slice(0,7); if (!(k in ends)) order.push(k); ends[k] = x; });
  const mret = {}, yend = {}, yorder = [];
  let prev = null;
  order.forEach(k => {
    const y = k.slice(0,4), m = +k.slice(5,7), cur = ends[k];
    const pt = prev ? prev[1] : 0;
    (mret[y] = mret[y] || {})[m] = ((1+cur[1]/100)/(1+pt/100)-1)*100;
    if (!yend[y]) yorder.push(y);
    yend[y] = cur; prev = cur;
  });
  const G = ['#EAF7EF','#D0EFDC','#AEE4C4','#86D7A8','#5CC98C'], R = ['#FDEEEE','#FBD9DA','#F8C2C3','#F3A6A8','#EE8A8D'];
  let nAct = 0, nPos = 0, best = null, worst = null;
  yorder.forEach(y => { for (const m in mret[y]) { const v = mret[y][m]; if (Math.abs(v) < 0.05) continue; nAct++; if (v > 0) nPos++; if (best==null || v > best) best = v; if (worst==null || v < worst) worst = v; } });
  const sum = document.getElementById('moSum');
  if (sum && nAct) sum.innerHTML = `Tỷ lệ tháng có lãi: <b class="up">${Math.round(nPos/nAct*100)}%</b> &nbsp;·&nbsp; Tháng lãi cao nhất: <b class="up">+${best.toFixed(1)}%</b> &nbsp;·&nbsp; Tháng lỗ sâu nhất: <b class="down">−${Math.abs(worst).toFixed(1)}%</b>`;
  const cell = v => {
    if (v==null || Math.abs(v) < 0.05) return '<td style="border-top:none;text-align:center;padding:6px 0;border-radius:4px;background:#FAFBFC;color:#C6CBD1;font-weight:400">·</td>';
    const i = Math.min(4, Math.floor(Math.abs(v)/15*5));
    const bg = v>0 ? G[i] : R[i], tc = v>0 ? '#0d6e31' : '#B03A3E';
    return `<td style="border-top:none;text-align:center;padding:6px 0;border-radius:4px;background:${bg};color:${tc};font-weight:600">${v>0?'+':'−'}${Math.abs(v).toFixed(1)}</td>`;
  };
  const thS = 'border-bottom:none;text-align:center;padding:4px 0;font-size:11px';
  const head = `<tr><th style="${thS};text-align:left;padding-left:4px">Năm</th>` + Array.from({length:12},(_,i)=>`<th style="${thS}">T${i+1}</th>`).join('') + `<th style="${thS}">Cả năm</th><th style="${thS}">VN-Index</th></tr>`;
  let prevY = null; const rows = [];
  yorder.forEach(y => {
    const e = yend[y], pt = prevY ? prevY[1] : 0, pv = prevY ? prevY[2] : 0;
    const yr = ((1+e[1]/100)/(1+pt/100)-1)*100, vr = ((1+e[2]/100)/(1+pv/100)-1)*100;
    rows.push(`<tr><td style="border-top:none;text-align:left;padding:6px 4px"><b>${y}</b></td>` + Array.from({length:12},(_,i)=>cell(mret[y]&&mret[y][i+1]!=null?mret[y][i+1]:null)).join('') + `<td style="border-top:none;text-align:center;padding:6px 0;border-radius:4px;background:${yr>=0?'#128A3E':'#E5484D'};color:#fff;font-weight:700">${yr>0?'+':'−'}${Math.abs(yr).toFixed(1)}</td><td style="border-top:none;text-align:center;padding:6px 0;color:#7A828E">${vr>0?'+':'−'}${Math.abs(vr).toFixed(1)}</td></tr>`);
    prevY = e;
  });
  el.innerHTML = `<table style="border-collapse:separate;border-spacing:2px;table-layout:fixed;font-size:12px">` + head + rows.reverse().join('') + '</table>';
}
function renderRecent(){
  const el = document.getElementById('recentWrap'); if (!el) return;
  const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
  el.innerHTML = `<table class="sigtb"><tr><th>Mã</th><th>Giá mua</th><th>Giá bán / TT</th><th>Lợi suất</th></tr>` +
    tpn.recent.map(d=>{ const sp = d.bp*(1+(d.ret+(d.open?0.15:0.4))/100); return `<tr class="row" onclick="openDetail('${d.t}')">
      <td><div class="l1">${d.t} ${d.open?(d.today?'<span class="chip g">Mua hôm nay</span>':'<span class="chip a">Đang mở</span>'):''}</div><div class="l2">${d.bd}</div></td>
      <td><div class="l1" style="font-size:13px">${d.bp}</div></td>
      <td><div class="l1" style="font-size:13px">${sp>=100?sp.toFixed(1):sp.toFixed(2)}</div><div class="l2">${d.open?'giá TT':'bán '+d.sd}</div></td>
      <td><span class="${d.ret>=0?'up':'down'}" style="font-size:14px">${d.ret>=0?'+':''}${d.ret}%</span></td></tr>`;}).join('') + '</table>';
}
function loadLiveDeals(){ try { return JSON.parse(localStorage.getItem('kafi_live_deals')) || []; } catch(e){ return []; } }
function saveLiveDeals(a){ try { localStorage.setItem('kafi_live_deals', JSON.stringify(a.slice(-20))); } catch(e){} }
function mergeLiveDeals(){
  const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
  const cut = Date.now() - 185*86400000;
  const store = loadLiveDeals().filter(x => new Date(x.bdate).getTime() > cut);
  store.forEach(x => {
    if (BO_CUNG.has(x.t)) return;
    if (tpn.recent.some(y => y.t === x.t && y.bdate === x.bdate)) return;
    tpn.recent.unshift({t:x.t, bd:x.bd, bdate:x.bdate, bp:x.bp, sd:'—', ret:-0.15, open:true});
  });
  saveLiveDeals(store);
}
function ensureFreshBanner(){
  try {
    const meta = document.getElementById('bgeData');
    if (!meta || document.getElementById('staleBtn')) return;
    const m = (SUM.updated||'').match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return;
    const age = (Date.now() - new Date(m[1]+'-'+m[2]+'-'+m[3]).getTime()) / 86400000;
    if (age < 5) return;
    const b = document.createElement('button');
    b.id = 'staleBtn'; b.className = 'btn';
    b.style.cssText = 'margin-left:10px;padding:4px 12px;font-size:12px;background:#fdecec;border:1px solid #f0a8ab;color:#c0353a;font-weight:700;border-radius:8px;cursor:pointer';
    b.textContent = 'Dữ liệu cơ bản đã cũ ' + Math.floor(age) + ' ngày — bấm cập nhật (~2 phút)';
    b.onclick = () => { b.remove(); location.reload(); };
    meta.parentNode.appendChild(b);
  } catch(e){}
}
function ensureNotifBanner(){
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') return;
  const meta = document.getElementById('bgeData');
  if (!meta || document.getElementById('notifBtn')) return;
  const b = document.createElement('button');
  b.id = 'notifBtn'; b.className = 'btn';
  b.style.cssText = 'margin-left:10px;padding:5px 14px;font-size:12px;background:#e8f7ee;border:1px solid #7fd2a1;color:#0d6e31;font-weight:700;border-radius:999px;cursor:pointer';
  b.textContent = '🔔 Bật thông báo realtime';
  b.onclick = async () => {
    if (Notification.permission === 'denied') {
      alert('Thông báo của trang đang bị CHẶN.' + String.fromCharCode(10,10) + 'Cách mở: bấm biểu tượng Ổ KHÓA cạnh thanh địa chỉ, chọn Thông báo: Cho phép, rồi tải lại trang.');
      return;
    }
    const p = await Notification.requestPermission();
    if (p === 'granted') {
      try { new Notification('Khoa Nguyen Signal', {body: 'Đã bật thông báo realtime — có tín hiệu mới sẽ báo ngay tại đây, kể cả khi bạn đang mở tab khác.'}); } catch(e){}
      b.remove();
    }
  };
  meta.parentNode.appendChild(b);
}
async function verifySignalAt(t, ds){ return null; }
async function retroScanSignals(){
  try {
    const R = (window.SIGS && window.SIGS.recent10) || []; if (!R.length) return;
    const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
    let store = loadLiveDeals(); let changed = false;
    for (const sg of R) {
      if (BO_CUNG.has(sg.t)) continue;
      if (store.some(x => x.t === sg.t && x.bdate === sg.bdate)) continue;
      if (tpn.recent.some(x => x.t === sg.t && (x.bdate === sg.bdate || x.open))) continue;
      tpn.recent.unshift({t: sg.t, bd: sg.bd, bdate: sg.bdate, bp: sg.bp, sd:'—', ret:0, open:true});
      store.push({t: sg.t, bd: sg.bd, bdate: sg.bdate, bp: sg.bp});
      changed = true;
    }
    if (changed) { saveLiveDeals(store); if (tpn.recent.length > 12) tpn.recent = tpn.recent.slice(0,12); refreshOpenDeals(); }
  } catch(e){}
}
function scanNewSignals(){
  const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
  const now = new Date();
  const dstr = ('0'+now.getDate()).slice(-2)+'/'+('0'+(now.getMonth()+1)).slice(-2)+'/'+String(now.getFullYear()).slice(2);
  const biso = now.toISOString().slice(0,10);
  const qualify = t => { if (BO_CUNG.has(t)) return false; const r = byT[t]; if (!r) return false;
    const g = (window.SIGS && window.SIGS.trig && window.SIGS.trig[t]) || null; if (!g) return false;
    return r.p != null && r.p >= g[0] && r.vx != null && r.v20 && (r.vx * r.v20) >= g[1]; };
  // tin hieu trong phien rot chuan -> tu rut khoi bang + so
  tpn.recent = tpn.recent.filter(x => !(x.today && x.bdate === biso && !qualify(x.t)));
  let store = loadLiveDeals().filter(x => !(x.bdate === biso && !qualify(x.t)));
  ROWS().forEach(r=>{
    if (!r.watch || r.wgrade === 'weak') return;
    if (!qualify(r.t)) return;
    if (tpn.recent.some(x => x.t === r.t && (x.open || x.bdate === biso))) return;
    const nd = {t:r.t, bd:dstr, bdate:biso, bp:+(+r.p).toFixed(2), sd:'—', ret:-0.15, open:true, today:1};
    tpn.recent.unshift(nd);
    notifyPush('SIG'+r.t+biso, r.t+' — TÍN HIỆU MUA KÍCH HOẠT', 'Cây bùng nổ đạt chuẩn kèm dòng tiền tại giá '+nd.bp+'. Mở dashboard xem chi tiết.', 15*60000);
    if (!store.some(x => x.t === r.t && x.bdate === biso)) store.push({t:r.t, bd:dstr, bdate:biso, bp:nd.bp});
  });
  saveLiveDeals(store);
  if (tpn.recent.length > 12) tpn.recent = tpn.recent.slice(0,12);
}
function checkWatchAlerts(){
  try {
    if (!liveWatch.inSession()) return;
    ROWS().forEach(r=>{
      if (!r.watch || r.wgrade === 'weak' || r.chg == null) return;
      const g = (window.SIGS && window.SIGS.trig && window.SIGS.trig[r.t]) || null;
      if (g && r.p != null && r.p >= g[0]) return;  // da co thong bao TIN HIEU MUA lo
      if (r.chg >= 4) notifyPush('W4'+r.t, r.t+' +'+(+r.chg).toFixed(1)+'% — NÓNG MÁY', 'Mã trong vùng theo dõi đang tăng tốc mạnh. Canh chặt tới cuối phiên.', 10*60000);
      else if (r.chg >= 2) notifyPush('W2'+r.t, r.t+' +'+(+r.chg).toFixed(1)+'% — khởi động', 'Mã trong vùng theo dõi bắt đầu chạy. Để mắt.', 15*60000);
    });
  } catch(e){}
}
async function refreshOpenDeals(){
  // dong/mo deal do may phat hanh cap nhat moi phien — o day chi lam moi lai/lo theo gia song
  const tpn = SUM.tpn; if (!tpn || !tpn.recent) return;
  const opens = tpn.recent.filter(d => d.open && d.bdate);
  if (!opens.length) { renderRecent(); return; }
  const now = NOW();
  await Promise.all(opens.map(async d => { try {
    const r = await jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${d.t}&resolution=D&from=${now-30*86400}&to=${now}`);
    const c = r.c; if (!c || !c.length || !(d.bp > 0)) return;
    d.ret = +(((c[c.length-1]/d.bp - 1)*100) - 0.4).toFixed(1);
  } catch(e){} }));
  renderRecent();
}
inits.market = async function(){
  if (mktDone) return; mktDone = true;
  const el = $('#view-market');
  const tpn = SUM.tpn || {stats:{}, recent:[], curve:[]};
  const st = tpn.stats || {};
  el.innerHTML = `
  <div class="hero">
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px">
        <h2 style="margin:0">Hiệu suất Khoa Nguyen Signal</h2>
        <div class="seg" id="perfSeg"><button data-r="all" class="on">Tất cả</button><button data-r="1y">1 năm</button><button data-r="6m">6 tháng</button><button data-r="2025">2025</button><button data-r="2026">2026</button></div>
      </div>
      <div style="height:565px"><canvas id="cvPerf"></canvas></div>
    </div>
    <div class="card" style="margin-bottom:0;display:flex;flex-direction:column">
      <h2 style="text-align:center;letter-spacing:.02em">TOP TÍN HIỆU 6 THÁNG QUA</h2>
      <div style="flex:1;overflow:auto" id="recentWrap"></div>
    </div>
  </div>
  <div style="height:16px"></div>
  <div class="stats4">
    <div class="card" style="margin:0"><h2>Khoa Nguyen Signal</h2>
      <div class="perf-row"><span class="l">1 năm</span><span class="v up">${st.y1>=0?'+':''}${st.y1}%</span></div>
      <div class="perf-row"><span class="l">3 năm</span><span class="v up">+${st.y3}%</span></div>
      <div class="perf-row"><span class="l">Từ 2019</span><span class="v up">+${st.all}%</span></div></div>
    <div class="card" style="margin:0"><h2>VN-Index cùng kỳ</h2>
      <div class="perf-row"><span class="l">1 năm</span><span class="v">${st.vy1>=0?'+':''}${st.vy1}%</span></div>
      <div class="perf-row"><span class="l">3 năm</span><span class="v">+${st.vy3}%</span></div>
      <div class="perf-row"><span class="l">Từ 2019</span><span class="v">+${st.vall}%</span></div></div>
    <div class="card" style="margin:0"><h2>Chất lượng hệ thống</h2>
      <div class="perf-row"><span class="l">R:R</span><span class="v">${st.rr}</span></div>
      <div class="perf-row"><span class="l">Win rate</span><span class="v">${st.winrate}%</span></div>
      <div class="perf-row"><span class="l">Tổng số deal</span><span class="v">${st.ndeal}</span></div></div>
    <div class="card" style="margin:0"><h2>Rủi ro</h2>
      <div class="perf-row"><span class="l">Max Drawdown hệ</span><span class="v down">${st.maxdd}%</span></div>
      <div class="perf-row"><span class="l">Max DD VN-Index</span><span class="v mut">−40.3%</span></div>
      <div class="perf-row"><span class="l">Phí giao dịch</span><span class="v mut">0,15% mua · 0,25% bán</span></div></div>
  </div>
  <div style="height:16px"></div>
  <div class="card"><h2>Lợi suất theo tháng <span class="hint">% · màu đậm = biên độ lớn · chấm mờ = đứng ngoài thị trường</span></h2><div class="mini" id="moSum" style="margin-bottom:10px"></div><div id="moTable" style="overflow-x:auto"></div></div>`;
  drawPerf();
  renderRecent();
  renderMonthly();
  refreshOpenDeals();
  if (!window._odTimer) window._odTimer = setInterval(refreshOpenDeals, 120000);
  $('#perfSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    $$('#perfSeg button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); perfRange = b.dataset.r; drawPerf(); });
  const mini = (rows, cols) => `<table><tr><th>Mã</th>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr>` +
    rows.map(r=>`<tr class="row" onclick="openDetail('${r.t}')"><td><b>${r.t}</b> <span class="mini">${(r.n||'').slice(0,22)}</span></td>${cols.map(c=>`<td class="${c[2]?c[2](r):''}">${c[1](r)}</td>`).join('')}</tr>`).join('') + '</table>';
  renderTops();
};

function chartOpts(){ return {layout:{background:{color:'transparent'},textColor:'#6b7280'},grid:{vertLines:{color:'#eef1f4'},horzLines:{color:'#eef1f4'}},timeScale:{borderColor:'#e4e8ec'},rightPriceScale:{borderColor:'#e4e8ec'},autoSize:true}; }
function candleOpts(){ return {upColor:'#18a34b',downColor:'#e5484d',borderUpColor:'#18a34b',borderDownColor:'#e5484d',wickUpColor:'#18a34b',wickDownColor:'#e5484d'}; }
function addLine(ch, times, vals, color, title){ const s = ch.addLineSeries({color, lineWidth:1.5, title, priceLineVisible:false, lastValueVisible:false}); s.setData(times.map((t,i)=>vals[i]!=null?{time:t,value:vals[i]}:null).filter(Boolean)); return s; }

// ================= 2. SCREENER =================
let scInit = false, sortKey = '_capR', sortDir = 1;
const COLS = [
  ['t','Mã'],['sec','Ngành'],['p','Giá'],['_ytd','YTD%'],['npatYoY','LNST YoY%'],['revYoY','DT / TOI YoY%'],
  ['roe','ROE%'],['_peR','P/E'],['_pbR','P/B'],['dy','Cổ tức%'],['_capR','Vốn hóa (tỷ)'],['val20','GTGD TB20 (tỷ)']
];
const PRESETS = {
  growth: {label:'Tăng trưởng cao', f: r => (r.npatYoY||0)>=30 && (r.revYoY||0)>=15},
  value: {label:'Định giá rẻ', f: r => r._peR!=null && r._peR>0 && r._peR<10 && r._pbR!=null && r._pbR<1.5 && (r.roe||0)>=12},
  divi: {label:'Cổ tức cao', f: r => (r.dy||0)>=5},
  ytd: {label:'Dẫn đầu YTD', f: r => (r._ytd||-999)>=20},
  quality: {label:'ROE cao', f: r => (r.roe||0)>=20}
};
const SECTORS = [...new Set(Object.values(SEC_MAP).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
inits.screener = function(){
  if (scInit) return; scInit = true;
  const el = $('#view-screener');
  el.innerHTML = `<div class="card" style="margin-bottom:4px;padding-bottom:8px">
    <div class="filters">
      <div><label>Tìm mã / tên</label><input id="fQ" style="width:140px" placeholder="VD: FPT, thép..."></div>
      <div><label>Ngành</label><select id="fSec" style="max-width:190px"><option value="">Tất cả ngành</option>${SECTORS.map(x=>`<option value="${x}">${x}</option>`).join('')}</select></div>
      <div><label>Sàn</label><select id="fSan"><option value="">Cả hai</option><option value="HO">HOSE</option><option value="HN">HNX</option></select></div>
      <div><label>P/E ≤</label><input id="fPe" type="number"></div>
      <div><label>P/B ≤</label><input id="fPb" type="number"></div>
      <div><label>ROE ≥ %</label><input id="fRoe" type="number"></div>
      <div><label>LNST YoY ≥ %</label><input id="fNp" type="number"></div>
      <div><label>DT / TOI YoY ≥ %</label><input id="fRev" type="number"></div>
      <div><label>Cổ tức ≥ %</label><input id="fDy" type="number"></div>
      <div><label>Vốn hóa ≥ tỷ</label><input id="fCap" type="number"></div>
      <div><label>YTD ≥ %</label><input id="fYtd" type="number"></div>
      <div><label>GTGD ≥ tỷ</label><input id="fVal" type="number"></div>
      <button class="btn" id="fClear">Xóa lọc</button>
    </div>
    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">${Object.entries(PRESETS).map(([k,p])=>`<span class="pill" data-p="${k}">${p.label}</span>`).join('')}</div>
    <div style="max-height:calc(100vh - 258px);min-height:260px;overflow:auto;margin-top:14px;border-top:1px solid var(--border);padding-top:12px"><table id="scTable"></table></div>
  </div>`;
  ['fQ','fSec','fSan','fPe','fPb','fRoe','fNp','fRev','fDy','fCap','fYtd','fVal'].forEach(id => $('#'+id).addEventListener('input', renderSc));
  $('#fClear').onclick = () => { ['fQ','fPe','fPb','fRoe','fNp','fRev','fDy','fCap','fYtd','fVal'].forEach(id=>$('#'+id).value=''); $('#fSan').value=''; $('#fSec').value=''; activePreset=null; $$('.pill').forEach(p=>p.classList.remove('on')); renderSc(); };
  $$('.pill').forEach(p => p.onclick = () => { activePreset = activePreset===p.dataset.p ? null : p.dataset.p; $$('.pill').forEach(x=>x.classList.toggle('on', x.dataset.p===activePreset)); renderSc(); });
  renderSc();
};
let activePreset = null;
function renderSc(){
  ROWS().forEach(scDerive);
  const q = ($('#fQ').value||'').toUpperCase();
  const num = id => { const v = $('#'+id).value; return v===''?null:+v; };
  const [pe,pb,roe,np,rev,dy,cap,ytd,gtgd] = ['fPe','fPb','fRoe','fNp','fRev','fDy','fCap','fYtd','fVal'].map(num);
  const san = $('#fSan').value, sec = $('#fSec').value;
  let rows = ROWS().filter(r =>
    (!q || r.t.includes(q) || (r.n||'').toUpperCase().includes(q)) &&
    (!san || r.b===san) &&
    (!sec || r.sec===sec) &&
    (pe==null || (r._peR!=null && r._peR>0 && r._peR<=pe)) &&
    (pb==null || (r._pbR!=null && r._pbR<=pb)) &&
    (roe==null || (r.roe||-99)>=roe) &&
    (np==null || (r.npatYoY!=null && r.npatYoY>=np)) &&
    (rev==null || (r.revYoY!=null && r.revYoY>=rev)) &&
    (dy==null || (r.dy||0)>=dy) &&
    (cap==null || (r._capR||0)>=cap) &&
    (ytd==null || (r._ytd!=null && r._ytd>=ytd)) &&
    (gtgd==null || (r.val20||0)/1000>=gtgd)
  );
  if (activePreset) rows = rows.filter(PRESETS[activePreset].f);
  rows.sort((a,b)=>{ const x=a[sortKey], y=b[sortKey]; if(x==null) return 1; if(y==null) return -1; return (x<y?-1:x>y?1:0)*sortDir*-1; });
  const head = '<tr>' + COLS.map(c=>`<th data-k="${c[0]}" class="${sortKey===c[0]?'on':''}"${(c[0]==='t'||c[0]==='sec')?' style="text-align:left"':''}>${c[1]}${sortKey===c[0]?(sortDir>0?' ↓':' ↑'):''}</th>`).join('') + '</tr>';
  const body = rows.slice(0,400).map(r => `<tr class="row" onclick="openDetail('${r.t}')">
    <td><b>${r.t}</b> <span class="mini">${r.b==='HO'?'HOSE':'HNX'}</span><br><span class="mini">${(r.n||'').slice(0,24)}</span></td>
    <td style="text-align:left"><span class="mini">${r.sec||'—'}</span></td>
    <td>${fmt(r.p,2)}</td>
    <td class="${cls(r._ytd)}">${pct(r._ytd)}</td>
    <td class="${cls(r.npatYoY)}">${pct(r.npatYoY)}</td>
    <td class="${cls(r.revYoY)}">${pct(r.revYoY)}</td>
    <td>${fmt(r.roe,1)}</td>
    <td>${fmt(r._peR,1)}</td>
    <td>${fmt(r._pbR,2)}</td>
    <td>${r.dy?fmt(r.dy,1):'—'}</td>
    <td>${fmt(r._capR,0)}</td>
    <td>${fmt((r.val20||0)/1000,0)}</td></tr>`).join('');
  $('#scTable').innerHTML = head + body;
  $$('#scTable th').forEach(th => th.onclick = () => { const k = th.dataset.k; if (sortKey===k) sortDir*=-1; else { sortKey=k; sortDir=1; } renderSc(); });
}

// ================= 3. CHI TIẾT MÃ =================
let dtInit = false, dtCharts = [], kqChart = null, rtChart = null, curT = null, curOhlc = null;
let dtData = null;
function updateKpis(i){
  if (!dtData) return;
  const oh = dtData.oh, c = oh.c, v = oh.v, t = oh.t, n = c.length;
  if (i == null || i < 0 || i >= n) i = n-1;
  const isNow = i === n-1;
  let sVal = 0, cnt = 0;
  for (let k = Math.max(0, i-19); k <= i; k++){
    let vk = v[k]||0;
    if (k === n-1) { const _lv = liveVolOf(curT, t[k]); if (_lv != null) vk = _lv; }   // cay nen cuoi: dung KL song
    sVal += c[k]*vk; cnt++;
  }
  const gtgd20 = sVal/cnt/1e6;
  const ts = t[i];
  const rt = dtData.rtsAv.filter(x=>x.av<=ts).slice(-1)[0] || {};
  const qq = dtData.qsAv.filter(x=>x.pub<=ts).slice(-1)[0] || {};
  const r = byT[curT] || {};
  const peV = isNow && r.pe != null ? r.pe : rt.pe;
  const pbV = isNow && r.pb != null ? r.pb : rt.pb;
  let capT = null;
  if (rt.cap != null && rt.av != null) {
    const qe = rt.av - 45*86400;  // moc do von hoa = ngay chot quy (av = qe + 45 ngay BCTC)
    let j0 = i; while (j0 > 0 && t[j0] > qe) j0--;
    const p0 = c[j0];
    capT = (p0 > 0 && c[i] > 0) ? (rt.cap/1e12)*(c[i]/p0) : rt.cap/1e12;  // von hoa chay theo gia dong nen
  } else if (isNow && r.cap != null) capT = r.cap/1000;
  const roeV = isNow && r.roe != null ? r.roe : (rt.roe != null ? rt.roe*100 : null);
  const rows = [
    ['Vốn hóa', capT != null ? fmt(capT,1)+' nghìn tỷ' : '—'],
    ['TB GTGD 20 phiên', fmt(gtgd20,0)+' tỷ'],
    ['P/E', fmt(peV,1)],
    ['P/B', fmt(pbV,2)],
    ['ROE', roeV != null ? fmt(roeV,1)+'%' : '—'],
    ['RS', r.rs != null ? r.rs+'/99' : '—'],
    ['+/- DT quý gần nhất', `<span class="${cls(qq.revY)}">${pct(qq.revY,1)}</span>`],
    ['+/- LN quý gần nhất', `<span class="${cls(qq.npY)}">${pct(qq.npY,1)}</span>`]
  ];
  const el = document.getElementById('dSide');
  if (!el) return;
  if (el.dataset.built !== '1') {
    el.innerHTML = `<div style="font-weight:700;font-size:14.5px;margin:4px 0 2px">Chỉ số cơ bản</div>
      ${rows.map(k=>`<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:9.5px 0;border-bottom:1px solid var(--border);font-size:13.5px">
        <span style="color:var(--muted)">${k[0]}</span><span class="kpiV" style="font-weight:700">${k[1]}</span></div>`).join('')}`;
    el.dataset.built = '1';
    return;
  }
  const vals = el.getElementsByClassName('kpiV');
  for (let ix = 0; ix < rows.length && ix < vals.length; ix++) {
    const html = String(rows[ix][1]);
    if (vals[ix].innerHTML !== html) vals[ix].innerHTML = html;   // chi ghi khi that su doi
  }
}
// KL "song" cua 1 cay nen: chi tra ve khi cay nen do DUNG la phien ma feed song dang bao.
// Lech ngay -> tra null -> moi thu quay ve dung so cua chart. KHONG bao gio ghi vao curOhlc.
function liveVolOf(tk, barTs){
  try {
    const r = byT[tk];
    if (!r || r.vx == null || !r.v20 || !window.LIVE_DATE) return null;
    const d = new Date(barTs*1000);
    const ds = d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2);
    return ds === window.LIVE_DATE ? r.vx*r.v20 : null;
  } catch(e){ return null; }
}
function updateDPx(i){
  const el = document.getElementById('dPx'); if (!el || !curOhlc) return;
  const r = byT[curT] || {};
  const c = curOhlc.c, v = curOhlc.v, n = c.length;
  const idx = (i == null || i < 0 || i >= n) ? n-1 : i;
  const isNow = idx === n-1;
  const p = isNow && r.p != null ? r.p : c[idx];
  const chg = isNow && r.chg != null ? r.chg : (idx > 0 ? (c[idx]/c[idx-1]-1)*100 : 0);
  const col = chg > 0 ? '#089981' : (chg < 0 ? '#F23645' : '#787B86');
  let vol = (v[idx]||0)/1e6;
  let vx = null;
  const lv = isNow ? liveVolOf(curT, curOhlc.t[idx]) : null;
  if (lv != null && r.vx != null) { vx = Math.round(r.vx*100); vol = lv/1e6; }
  else { let sm=0, cnt=0; for (let k=Math.max(0,idx-19); k<=idx; k++){ sm+=(v[k]||0); cnt++; }
         const tb = cnt ? sm/cnt : 0; if (tb>0) vx = Math.round((v[idx]||0)/tb*100); }
  const d = new Date(curOhlc.t[idx]*1000);
  const ngay = ' <span class="mini" style="font-weight:600;display:block;line-height:1.35;min-height:16px">' + ('0'+d.getUTCDate()).slice(-2)+'/'+('0'+(d.getUTCMonth()+1)).slice(-2)+'/'+String(d.getUTCFullYear()).slice(2) + '</span>';
  const htmlL = `${fmt(p,2)} <span style="font-size:15px;font-weight:700">(${chg>0?'+':''}${fmt(chg,1)}%)</span>${ngay}`;
  const htmlR = `KL ${fmt(vol,2)} tr${vx!=null?` <span style="font-weight:700;color:${vx>=150?'#B45309':'var(--muted)'}">(${vx}%)</span>`:''}`;
  if (el.dataset.built !== '1') {
    el.innerHTML = `<div id="dPxL" style="font-size:27px;font-weight:800;line-height:1;white-space:nowrap"></div><div id="dPxR" style="font-size:14px;font-weight:800;white-space:nowrap"></div>`;
    el.dataset.built = '1';
  }
  const L = document.getElementById('dPxL'), R = document.getElementById('dPxR');
  if (L) { if (L.style.color !== col) L.style.color = col; if (L.innerHTML !== htmlL) L.innerHTML = htmlL; }
  if (R && R.innerHTML !== htmlR) R.innerHTML = htmlR;
}
function renderDHead(){
  const el = document.getElementById('dHead'); if (!el || !curOhlc) return;
  const r = byT[curT] || {};
  const c = curOhlc.c, n = c.length;
  const p = r.p != null ? r.p : c[n-1];
  const chg = r.chg != null ? r.chg : (n>1 ? (c[n-1]/c[n-2]-1)*100 : 0);
  const col = chg > 0 ? '#089981' : (chg < 0 ? '#F23645' : '#787B86');
  const vol = ((curOhlc.v[n-1]||0)/1e6);
  const vx = r.vx != null ? Math.round(r.vx*100) : null;
  el.innerHTML = `<div style="display:flex;align-items:center;gap:10px">
    <div id="dLogo" style="width:44px;height:44px;flex:none;border-radius:50%;overflow:hidden;border:1px solid var(--border);background:var(--green-soft);display:flex;align-items:center;justify-content:center">
      <span style="color:var(--green-dark);font-weight:800;font-size:${curT.length>3?10:12}px">${curT}</span>
    </div>
    <div style="flex:1;min-width:0">
      <div style="font-size:19px;font-weight:800;line-height:1.15">${curT} <span class="mini" style="font-weight:600">${r.b==='HN'?'HNX':'HOSE'}</span></div>
      <div class="mini" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.n||''}</div>
    </div>
  </div>
  <div id="dPx" style="margin:10px 0 2px;display:flex;justify-content:space-between;align-items:baseline;gap:8px"></div>`;
  updateDPx(null);
  const img = new Image();
  img.onload = () => { const d = document.getElementById('dLogo'); if (d) { d.innerHTML = ''; img.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#fff'; d.appendChild(img); } };
  img.src = 'https://cdn.simplize.vn/simplizevn/logo/' + curT + '.jpeg';
}
function renderSigTab(){
  const box = document.getElementById('tab-sig'); if (!box) return;
  const src = document.getElementById('dTpn');
  let html = (src && src.innerHTML) || '';
  const tix = {}; if (curOhlc) curOhlc.t.forEach((tt,ii)=>{ tix[tt]=ii; });
  const deals = []; let od = null;
  (curMarkers||[]).forEach(m => {
    const ii = tix[m.time];
    const d = new Date(m.time*1000);
    const ds = ('0'+d.getUTCDate()).slice(-2)+'/'+('0'+(d.getUTCMonth()+1)).slice(-2)+'/'+String(d.getUTCFullYear()).slice(2);
    if (m.position === 'belowBar') {
      // BUY / BUY-sao / THIN deu la lenh THAT (computeTPN deu set inPos=true). Chi WEAK la khong vao lenh.
      if (m.text === 'BUY' || m.text === 'BUY\u2605' || m.text === 'THIN')
        od = { bd: ds, bp: (ii!=null&&curOhlc)?curOhlc.c[ii]:null, add: false, loai: m.text };
      else if (m.text === 'ADD' && od) od.add = true;
    } else if (od) { od.sd = ds; od.ret = m.text; deals.push(od); od = null; }
  });
  if (od) { od.sd = '—'; od.ret = 'đang mở'; deals.push(od); }
  if (deals.length) {
    html += `<div style="font-weight:700;font-size:14.5px;margin:16px 0 4px">Lịch sử tín hiệu mã này <span class="hint">${deals.length} deal</span></div>
    <table style="font-size:12.5px"><tr><th style="text-align:left">Mua · giá</th><th>Bán</th><th>Kết quả</th></tr>` +
      deals.slice().reverse().map(x => `<tr><td style="text-align:left"><b>${x.bd}</b> @${x.bp!=null?fmt(x.bp,2):'—'}${x.loai==='BUY\u2605'?' <span class="chip g" style="font-size:10.5px">★</span>':(x.loai==='THIN'?' <span class="chip" style="font-size:10.5px;background:#fef6e7;color:#b45309">Nền mỏng</span>':'')}${x.add?' <span class="chip g" style="font-size:10.5px">+Bồi</span>':''}</td>
      <td>${x.sd}</td><td class="${x.ret==='đang mở'?'mut':((''+x.ret).indexOf('-')===0?'down':'up')}" style="font-weight:700">${x.ret}</td></tr>`).join('') + '</table>';
  } else {
    html += '<div class="mini" style="margin-top:14px">Hệ thống chưa từng có tín hiệu mua với mã này trong dữ liệu hiện có.</div>';
  }
  box.innerHTML = html;
}
async function loadRecs(){
  const box = document.getElementById('tab-rec'); if (!box || !curT) return;
  if (window._recFor === curT) return;
  box.innerHTML = '<div class="mini">Đang tải khuyến nghị…</div>';
  try {
    const r = await jget(`https://api-finfo.vndirect.com.vn/v4/recommendations?q=code:${curT}&size=10&sort=reportDate:desc`);
    const d0 = (r && r.data) || [];
    const cut = Date.now() - 240*86400000;
    const d = d0.filter(x => x.reportDate && new Date(x.reportDate).getTime() >= cut).slice(0, 6);
    window._recFor = curT;
    if (!d.length) { box.innerHTML = '<div class="mini" style="padding:8px 0">Chưa có báo cáo phân tích nào của CTCK trong 8 tháng gần đây.</div>'; return; }
    const rr = byT[curT] || {}; const cur = rr.p != null ? rr.p : (curOhlc ? curOhlc.c[curOhlc.c.length-1] : null);
    const chip = ty => ty==='BUY' ? '<span class="chip g">MUA</span>' : (ty==='SELL' ? '<span class="chip r">BÁN</span>' : '<span class="chip a">'+(ty||'—')+'</span>');
    box.innerHTML = '<table style="font-size:12.5px"><tr><th style="text-align:left">CTCK · Ngày</th><th>Loại</th><th>Giá MT</th><th>Upside</th></tr>' +
      d.map(x => { const up = (cur && x.targetPrice) ? (x.targetPrice/cur-1)*100 : null;
        return `<tr><td style="text-align:left"><b>${x.firm||x.source||'—'}</b><div class="mini">${(x.reportDate||'').split('-').reverse().join('/')}</div></td>
        <td>${chip(x.type)}</td><td><b>${x.targetPrice!=null?fmt(x.targetPrice,2):'—'}</b></td>
        <td class="${up!=null?cls(up):'mut'}">${up!=null?pct(up,0):'—'}</td></tr>`; }).join('') + '</table>' +
      '<div class="mini" style="margin-top:8px">Upside so với giá hiện tại · tổng hợp từ báo cáo các CTCK</div>';
  } catch(e){ box.innerHTML = '<div class="mini">Không tải được dữ liệu khuyến nghị.</div>'; }
}
let proLoadedFor = null, proChart = null, proVolChart = null, proCandle = null, proVol = null, proMa = null, useLog = false;
// Dung lai toan bo mui tren chart = tin hieu DA CHOT + tin hieu DANG DAT TRONG PHIEN.
// Trong phien: gia >= nguong gia va volume >= nguong volume (bep da phat hanh trong SIGS.trig)
// -> ve mui tren; neu gia tut xuong duoi nguong thi mui tu bien mat o lan ve ke tiep.
window.__rebuildBadges = function(){
  if (!curOhlc || !curOhlc.t) { window._kafiBadges = []; return; }
  const tix = {}; curOhlc.t.forEach((tt,i)=>{ tix[tt]=i; });
  const out = (curMarkers||[]).map(m => {
    const i = tix[m.time]; if (i == null) return null;
    const isBuy = m.position === 'belowBar';
    const lbl = isBuy ? (m.text === 'ADD' ? '\u25B2 Add' : (m.text === 'WEAK' ? '\u25B2 Weak' : (m.text === 'THIN' ? '\u25B2 B!' : (m.text === 'BUY\u2605' ? '\u25B2 B\u2605' : '\u25B2 B')))) : '\u25BC S ' + m.text;
    return { i: i, below: isBuy, text: lbl, color: m.color, value: isBuy ? curOhlc.l[i] : curOhlc.h[i] };
  }).filter(Boolean);
  try {
    const n = curOhlc.t.length;
    const ts = curOhlc.t[n-1];
    const g = (window.SIGS && window.SIGS.trig && window.SIGS.trig[curT]) || null;
    const lv = liveVolOf(curT, ts);                 // chi khac null khi cay nen cuoi la phien hom nay
    const r  = byT[curT] || {};
    const px = (r.p != null && isFinite(r.p) && r.p > 0) ? r.p : null;
    const daCoTinHieu = out.some(b => b.i === n-1 && b.below);
    if (g && lv != null && px != null && !daCoTinHieu
        && liveWatch.inSession() && px >= g[0] && lv >= g[1]) {
      out.push({ i: n-1, below: true, text: '\u25B2 B', color: '#18a34b',
                 value: Math.min(curOhlc.l[n-1], px) });
    }
  } catch(e){}
  window._kafiBadges = out;
};
function addProBadges(){
  if (!proCandle || !curOhlc) return;
  window.__rebuildBadges();
  if (window.__paintBadges) window.__paintBadges();
  window._dbg = { get chart(){ return proChart; }, get markers(){ return curMarkers; }, get oh(){ return curOhlc; }, get badges(){ return window._kafiBadges; } };
}
// Moi lan feed song lam moi -> cap nhat CAY NEN CUOI + ve lai mui ten + legend.
function syncLiveBar(){
  try {
    if (!proCandle || !curOhlc || !curT || !curOhlc.t) return;
    const n = curOhlc.t.length; if (!n) return;
    const ts = curOhlc.t[n-1];
    const lv = liveVolOf(curT, ts);
    if (lv == null) return;
    const r = byT[curT] || {};
    const cl = (r.p != null && isFinite(r.p) && r.p > 0) ? r.p : curOhlc.c[n-1];
    proCandle.update({ time: ts, open: curOhlc.o[n-1], high: Math.max(curOhlc.h[n-1], cl), low: Math.min(curOhlc.l[n-1], cl), close: cl });
    if (proVol) proVol.update({ time: ts, value: lv, color: cl >= curOhlc.o[n-1] ? 'rgba(8,153,129,.5)' : 'rgba(242,54,69,.5)' });
    addProBadges();
    if (window.__proLegend) window.__proLegend(null);
  } catch(e){}
}
// ===== TU KIEM: bat cac cap so hien thi khong the cung dung ve mat so hoc =====
window.kafiSelfCheck = function(){
  const out = [];
  const add = (muc, ok, chiTiet) => out.push({ muc, ket_qua: ok ? 'OK' : 'LOI', chi_tiet: chiTiet });
  const info = (muc, chiTiet) => out.push({ muc, ket_qua: 'thong tin', chi_tiet: chiTiet });
  try {
    // 1) Khung KL: so trieu co khop voi %TB20 khong
    const txt = (document.getElementById('dPxR')||{}).textContent || '';
    const m = txt.replace(/\./g,'').match(/KL\s+([\d,]+)\s*tr\s*\((\d+)%\)/);
    const rr = byT[curT] || {};
    if (m && rr.v20) {
      const kl = parseFloat(m[1].replace(',', '.'))*1e6, pctHien = +m[2];
      const pctThat = kl/rr.v20*100;
      const lech = Math.abs(pctThat - pctHien);
      add('Khung KL vs %TB20', lech <= 4, `hien ${pctHien}% · tinh ra ${pctThat.toFixed(0)}% · lech ${lech.toFixed(0)} diem`);
    } else add('Khung KL vs %TB20', true, 'khong doc duoc (bo qua)');
    // 2) Gia trong khung vs close cay nen cuoi cua chart
    if (curOhlc && curOhlc.c && curOhlc.c.length) {
      const n = curOhlc.c.length, lv = liveVolOf(curT, curOhlc.t[n-1]);
      const giaKhung = rr.p, giaNen = curOhlc.c[n-1];
      if (lv != null && giaKhung != null) {
        const l = Math.abs(giaKhung/giaNen - 1)*100;
        info('Gia khung vs nen goc', `khung ${giaKhung} · mang goc ${giaNen} · lech ${l.toFixed(2)}% — CO CHU DICH: mang goc giu nguyen cho may tin hieu, nen ve tren chart da dong bo`);
      }
      // 3) Ngay cay nen cuoi vs ngay phien feed song
      const d = new Date(curOhlc.t[n-1]*1000);
      const ds = d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2);
      info('Ngay nen vs ngay feed', `nen ${ds} · feed ${window.LIVE_DATE||'—'}` + (ds===window.LIVE_DATE?' — trung phien, dang dong bo':' — LECH phien, moi so tu dong quay ve nguon chart (an toan)'));
    }
    // 4) Do tuoi cua feed song
    const bg = (document.getElementById('bgeData')||{}).textContent || '';
    add('Nhan cap nhat', /Gia cap nhat luc|Giá cập nhật lúc/.test(bg), bg.slice(0,80) || 'chua co nhan');
    // 5) %KL cua ca ro: co dong nao KL va vx choi nhau khong
    let xau = 0, tong = 0;
    ROWS().forEach(r => { if (r.vx == null || !r.v20) return; tong++; if (!(r.vx >= 0 && r.vx < 60)) xau++; });
    add('vx toan ro trong khoang hop ly', xau === 0, `${tong} ma co vx · ${xau} ma bat thuong`);
  } catch(e){ add('Tu kiem', false, 'loi: ' + e.message); }
  try { console.table(out); } catch(e){ console.log(out); }
  return out;
};
function loadProChart(){
  if (!curT || !curOhlc) return;
  if (proLoadedFor === curT) {
    let oK = false;
    try {
      const el = document.getElementById('proPx');
      const cv = el && el.querySelector('canvas');
      oK = !!(el && cv && el.clientWidth > 0 && cv.width >= el.clientWidth * 0.5);
    } catch(e){}
    if (oK) return;
    proLoadedFor = null;
  }
  if (!window.LightweightCharts) { toast('Không tải được thư viện chart'); return; }
  proLoadedFor = curT;
  const wrap = document.getElementById('chartProWrap');
  wrap.innerHTML = '<div id="proK" style="position:relative">'
    + '<div id="proPx" style="height:360px;position:relative"><canvas id="proBadgeCv" style="position:absolute;left:0;top:0;z-index:3;pointer-events:none"></canvas></div>'
    + '<div id="proVolPane" style="height:145px;border-top:1px solid #F0F3FA"></div>'
    + '<div id="proLegend" style="position:absolute;top:6px;left:8px;z-index:5;font:11.5px/1.5 Inter,sans-serif;color:#131722;background:rgba(255,255,255,.78);padding:2px 7px;border-radius:4px;pointer-events:none"></div>'
    + '<div id="proVolLegend" style="position:absolute;top:366px;left:8px;z-index:5;font:11.5px/1.5 Inter,sans-serif;color:#131722;background:rgba(255,255,255,.78);padding:1px 7px;border-radius:4px;pointer-events:none"></div>'
    + '</div>';
  try { if (proChart && proChart.remove) proChart.remove(); } catch(e){}
  try { if (proVolChart && proVolChart.remove) proVolChart.remove(); } catch(e){}
  const UP = '#089981', DOWN = '#F23645';
  const baseOpts = {
    autoSize: true,
    layout: { background: { color: '#ffffff' }, textColor: '#787B86', fontSize: 12 },
    grid: { horzLines: { color: '#F0F3FA' }, vertLines: { color: '#F0F3FA' } },
    rightPriceScale: { borderColor: '#DDE1E6' },
    timeScale: { borderColor: '#DDE1E6', rightOffset: 6, barSpacing: 9, timeVisible: false },
    crosshair: { mode: 0,
      horzLine: { color: '#9598A1', labelBackgroundColor: '#131722' },
      vertLine: { color: '#9598A1', labelBackgroundColor: '#131722' } },
    localization: { locale: 'vi-VN' }
  };
  const o1 = JSON.parse(JSON.stringify(baseOpts));
  o1.timeScale.visible = false;
  o1.rightPriceScale.scaleMargins = { top: 0.07, bottom: 0.06 };
  proChart = LightweightCharts.createChart(document.getElementById('proPx'), o1);
  const o2 = JSON.parse(JSON.stringify(baseOpts));
  o2.rightPriceScale.scaleMargins = { top: 0.10, bottom: 0 };
  o2.layout.attributionLogo = false;
  proVolChart = LightweightCharts.createChart(document.getElementById('proVolPane'), o2);
  proCandle = proChart.addCandlestickSeries({ upColor: UP, downColor: DOWN, borderUpColor: UP, borderDownColor: DOWN, wickUpColor: UP, wickDownColor: DOWN });
  const n0 = curOhlc.t.length - 1;
  const liveLast = (function(){
    const lv = liveVolOf(curT, curOhlc.t[n0]);
    if (lv == null) return null;
    const _r = byT[curT] || {};
    const cl = (_r.p != null && isFinite(_r.p) && _r.p > 0) ? _r.p : curOhlc.c[n0];
    return { cl: cl, lv: lv };
  })();
  const candData = curOhlc.t.map((tt,i)=>{
    if (i === n0 && liveLast) return { time: tt, open: curOhlc.o[i], high: Math.max(curOhlc.h[i], liveLast.cl), low: Math.min(curOhlc.l[i], liveLast.cl), close: liveLast.cl };
    return { time: tt, open: curOhlc.o[i], high: curOhlc.h[i], low: curOhlc.l[i], close: curOhlc.c[i] };
  });
  proCandle.setData(candData);
  proVol = proVolChart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceLineVisible: false, lastValueVisible: false });
  const volAt = i => (i === n0 && liveLast) ? liveLast.lv : curOhlc.v[i];
  proVol.setData(curOhlc.t.map((tt,i)=>({ time: tt, value: volAt(i), color: candData[i].close >= candData[i].open ? 'rgba(8,153,129,.5)' : 'rgba(242,54,69,.5)' })));
  const ma = []; let s = 0;
  for (let i = 0; i < curOhlc.c.length; i++){ s += curOhlc.c[i]; if (i >= 20) s -= curOhlc.c[i-20]; if (i >= 19) ma.push({ time: curOhlc.t[i], value: +(s/20).toFixed(2) }); }
  proMa = proChart.addLineSeries({ color: '#2962FF', lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
  proMa.setData(ma);
  // dong bo truc thoi gian 2 khung
  const syncTS = (a,b) => a.timeScale().subscribeVisibleLogicalRangeChange(r => { if (r) try { b.timeScale().setVisibleLogicalRange(r); } catch(e){} });
  syncTS(proChart, proVolChart); syncTS(proVolChart, proChart);
  // ep do rong truc gia 2 khung bang nhau -> nen va cot volume thang hang
  const alignScales = () => { try {
    const w1 = proChart.priceScale('right').width(), w2 = proVolChart.priceScale('right').width();
    const w = Math.max(w1, w2);
    if (w > 0) { proChart.applyOptions({ rightPriceScale: { minimumWidth: w } }); proVolChart.applyOptions({ rightPriceScale: { minimumWidth: w } }); }
  } catch(e){} };
  setTimeout(alignScales, 80); setTimeout(alignScales, 400); setTimeout(alignScales, 1000);
  // ==== mui ten + nhan mau (ve tay nhu ban cu) ====
  const paintBadges = () => {
    try {
      const cvs = document.getElementById('proBadgeCv'); const px = document.getElementById('proPx');
      if (!cvs || !px || !proChart || !proCandle || !curOhlc) return;
      const w = px.clientWidth, h = px.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      if (cvs.width !== Math.round(w*dpr) || cvs.height !== Math.round(h*dpr)) { cvs.width = Math.round(w*dpr); cvs.height = Math.round(h*dpr); cvs.style.width = w+'px'; cvs.style.height = h+'px'; }
      const ctx = cvs.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
      ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tsc = proChart.timeScale();
      (window._kafiBadges || []).forEach(b => {
        const x = tsc.timeToCoordinate(curOhlc.t[b.i]); if (x == null) return;
        const y = proCandle.priceToCoordinate(b.value); if (y == null) return;
        const dir = b.below ? 1 : -1, gap = 3, ah = 7, aw = 5;
        const tipY = y + dir*gap, baseY = tipY + dir*ah;
        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.moveTo(x, tipY); ctx.lineTo(x-aw, baseY); ctx.lineTo(x+aw, baseY); ctx.closePath(); ctx.fill();
        const lbl = b.text.replace(/^[▲▼]\s*/, '');
        const hh = 16, r = 3, ww = ctx.measureText(lbl).width + 10;
        const top = b.below ? baseY + 1 : baseY - 1 - hh;
        ctx.beginPath();
        ctx.moveTo(x-ww/2+r, top); ctx.arcTo(x+ww/2, top, x+ww/2, top+hh, r); ctx.arcTo(x+ww/2, top+hh, x-ww/2, top+hh, r); ctx.arcTo(x-ww/2, top+hh, x-ww/2, top, r); ctx.arcTo(x-ww/2, top, x+ww/2, top, r); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillText(lbl, x, top + hh/2 + 0.5);
      });
    } catch(e){}
  };
  window.__paintBadges = paintBadges;
  proChart.timeScale().subscribeVisibleLogicalRangeChange(() => requestAnimationFrame(paintBadges));
  try { new ResizeObserver(() => { requestAnimationFrame(paintBadges); alignScales(); }).observe(document.getElementById('proPx')); } catch(e){}
  addProBadges();
  const __setRange = () => { try { proChart.timeScale().setVisibleLogicalRange({ from: Math.max(0, curOhlc.t.length - 130), to: curOhlc.t.length + 5 }); } catch(e){} };
  __setRange(); setTimeout(__setRange, 150); setTimeout(__setRange, 600);
  // legend
  const v20arr = []; let sv = 0;
  for (let i = 0; i < curOhlc.v.length; i++){ sv += curOhlc.v[i]; if (i >= 20) sv -= curOhlc.v[i-20]; v20arr.push(i >= 19 ? sv/20 : null); }
  const leg = document.getElementById('proLegend');
  const vleg = document.getElementById('proVolLegend');
  const fmtVol = v => v == null ? '—' : (v >= 1e6 ? (v/1e6).toFixed(2) + 'tr' : Math.round(v/1e3) + 'k');
  const showLeg = (i) => {
    const ii = (i == null || i < 0 || i > n0) ? n0 : i;
    const d = candData[ii];
    const vv = volAt(ii);
    const chg = ii > 0 ? (d.close/curOhlc.c[ii-1]-1)*100 : 0;
    const cl = d.close >= d.open ? UP : DOWN;
    const av = v20arr[ii]; const pct = av ? Math.round(vv/av*100) : null;
    const maV = ii >= 19 && ma[ii-19] ? ma[ii-19].value : null;
    if (leg) leg.innerHTML = '<b>' + curT + '</b> <span style="color:' + cl + '">O ' + d.open + ' · H ' + d.high + ' · L ' + d.low + ' · C <b>' + d.close + '</b></span> <b style="color:' + (chg >= 0 ? UP : DOWN) + '">' + (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%</b> · <span style="color:#2962FF">MA20 ' + (maV == null ? '—' : maV) + '</span>';
    if (vleg) vleg.innerHTML = '<span style="color:#787B86">KL</span> <b>' + fmtVol(vv) + '</b>' + (pct == null ? '' : ' <span style="color:' + (pct >= 200 ? '#B45309' : '#787B86') + '">(' + pct + '%)</span>');
  };
  window.__proLegend = showLeg;
  showLeg(null);
  const tpos = {}; curOhlc.t.forEach((tt,i)=>{ tpos[tt] = i; });
  let lastCi = -999;
  const onCross = p => {
    const ci = (p && p.time != null && tpos[p.time] != null) ? tpos[p.time] : null;
    const key = ci == null ? -1 : ci;
    if (key === lastCi) return;
    lastCi = key;
    showLeg(ci);
    if (window.__dHov) { updateKpis(ci); updateDPx(ci); }
  };
  proChart.subscribeCrosshairMove(onCross);
  proVolChart.subscribeCrosshairMove(onCross);
  // soi guong con tro giua 2 khung
  let mirroring = false;
  proChart.subscribeCrosshairMove(p => { if (mirroring) return; mirroring = true; try {
      const ci = (p && p.time != null && tpos[p.time] != null) ? tpos[p.time] : null;
      if (ci == null) proVolChart.clearCrosshairPosition(); else proVolChart.setCrosshairPosition(volAt(ci), curOhlc.t[ci], proVol);
    } catch(e){} mirroring = false; });
  proVolChart.subscribeCrosshairMove(p => { if (mirroring) return; mirroring = true; try {
      const ci = (p && p.time != null && tpos[p.time] != null) ? tpos[p.time] : null;
      if (ci == null) proChart.clearCrosshairPosition(); else proChart.setCrosshairPosition(candData[ci].close, curOhlc.t[ci], proCandle);
    } catch(e){} mirroring = false; });
  const kEl = document.getElementById('proK');
  if (kEl && !kEl.dataset.hovfix) { kEl.dataset.hovfix = '1';
    kEl.addEventListener('pointerenter', () => { window.__dHov = 1; });
    kEl.addEventListener('pointerleave', () => { window.__dHov = 0; lastCi = -999; showLeg(null); updateKpis(null); updateDPx(null); });
  }
}
window.openDetail = t => { ga('view_ticker', {ticker: t}); showView('detail', true); $$('.nav-link').forEach(b=>b.classList.toggle('active', b.dataset.view==='detail')); inits.detail(t); };
inits.detail = function(t){
  const el = $('#view-detail');
  if (!dtInit) { dtInit = true;
    el.innerHTML = `<div id="dBody" style="display:none">
      <div class="card" style="padding:13px 16px 14px">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:9px">
          <div class="search-wrap"><input id="dQ" placeholder="Nhập mã hoặc tên công ty…" style="width:206px;padding:6px 11px"><div id="sugg"></div></div>
          <div id="dTitle" style="font-size:15.5px;font-weight:700"></div>
          <div id="dRanges" style="display:none"></div>
          <div id="dTpn" style="margin-left:auto"></div>
        </div>
        <div style="display:flex;gap:16px;align-items:flex-start" id="dFlex">
          <div style="flex:1;min-width:0">
            <div id="chartSigWrap" style="display:none">
              <div style="flex:1;min-width:0;position:relative">
                <div id="ohlcLegend" style="position:absolute;top:6px;left:8px;z-index:20;font-size:12.5px;color:#374151;background:rgba(255,255,255,.85);padding:3px 10px;border-radius:6px;border:1px solid #e4e8ec"></div>
                <div style="position:absolute;top:6px;right:76px;z-index:20;display:flex;gap:6px">
                  <button class="btn" id="btnLog" style="padding:2px 10px;font-size:11px">Log</button>
                  <button class="btn" id="btnFull" style="padding:2px 10px;font-size:11px">\u26f6 Toàn màn hình</button>
                </div>
                <div id="chartMain"></div><div id="chartVol"></div>
              </div>
            </div>
            <div id="chartProWrap"></div>
          </div>
          <div style="width:360px;flex:none;border:1px solid var(--border);border-radius:12px;padding:14px 16px;background:#fff" id="dPanel">
            <div id="dHead" style="margin-bottom:10px"></div>
            <div id="dTabs" style="display:flex;border-bottom:1px solid var(--border);margin-bottom:10px">
              <button class="dtab active" data-t="ov">Tổng quan</button>
              <button class="dtab" data-t="sig">Tín hiệu</button>
              <button class="dtab" data-t="rec">CTCK KN</button>
            </div>
            <div id="tab-ov"><div id="dSide"></div></div>
            <div id="tab-sig" style="display:none"></div>
            <div id="tab-rec" style="display:none"></div>
          </div>
        </div>
        <div id="finFull" style="margin-top:14px;border:1px solid var(--border);border-radius:12px;padding:14px 16px;background:#fff">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px">
            <b style="font-size:15px">Tài chính — 12 quý gần nhất</b>
            <div class="mini" id="dFundCur" style="font-size:12.5px"></div>
          </div>          <style>
#finCharts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:8px}
@media (max-width:900px){#finCharts{grid-template-columns:1fr}}
#finCharts .fcard{border:1px solid var(--border);border-radius:12px;padding:12px 14px 14px;background:var(--panel);min-width:0}
#finCharts .fhead{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:6px}
#finCharts .ftit{font-size:13px;font-weight:700;color:var(--text);line-height:1.3}
#finCharts .fhero{font-size:16px;font-weight:800;color:var(--text);white-space:nowrap;letter-spacing:-.2px}
#finCharts .fhero .fq{font-size:10.5px;font-weight:600;color:var(--muted);margin-right:6px;letter-spacing:0}
#finCharts .fhero .fd{display:inline-block;font-size:11px;font-weight:700;margin-left:6px;padding:2px 7px;border-radius:999px;letter-spacing:0;vertical-align:1px}
#finCharts .fd.up{color:var(--green);background:var(--green-soft)}
#finCharts .fd.dn{color:var(--red);background:var(--red-soft)}
#finCharts .fd.fl{color:var(--muted);background:var(--panel2)}
#finCharts .fbox{height:215px;position:relative}
#finCharts .fins{font-size:12.5px;line-height:1.6;color:var(--muted);margin-top:10px;padding:9px 12px;background:var(--panel2);border-radius:8px;border-left:3px solid var(--blue)}
#finCharts .fins b{color:var(--text);font-weight:700}
          </style>
          <div id="finCharts">
            <div class="fcard"><div class="fhead"><div class="ftit">Tăng trưởng YoY — Doanh thu &amp; Lợi nhuận</div><div class="fhero" id="fhYoy"></div></div><div class="fbox"><canvas id="fcYoy"></canvas></div><div class="fins" id="fiYoy"></div></div>
            <div class="fcard"><div class="fhead"><div class="ftit">Quy mô — Doanh thu &amp; LNST (tỷ đồng)</div><div class="fhero" id="fhScale"></div></div><div class="fbox"><canvas id="fcScale"></canvas></div><div class="fins" id="fiScale"></div></div>
            <div class="fcard"><div class="fhead"><div class="ftit">ROE theo quý (%)</div><div class="fhero" id="fhRoe"></div></div><div class="fbox"><canvas id="fcRoe"></canvas></div><div class="fins" id="fiRoe"></div></div>
            <div class="fcard"><div class="fhead"><div class="ftit">Định giá — P/E &amp; P/B (lần)</div><div class="fhero" id="fhVal"></div></div><div class="fbox"><canvas id="fcVal"></canvas></div><div class="fins" id="fiVal"></div></div>
          </div>
          <div class="mini" style="margin:0 0 12px;font-style:italic">Số ghi trên chart là đỉnh, đáy và quý mới nhất; đường ngang mảnh là mức trung bình của chính mã. Nhận định được tính tự động từ quý mới nhất so với chuỗi 12 quý của chính mã — không so với ngành.</div>

          <div style="overflow-x:auto"><table id="tbFund" style="width:100%"></table></div>
          <div class="mini" style="margin-top:8px;font-style:italic">Ô "--" là quý nguồn chưa công bố.</div>
        </div>
      </div>
    </div>
  `;
      // eslint-disable-next-line
  const dq = $('#dQ');
    dq.addEventListener('input', () => {
      const q = dq.value.toUpperCase(); const box = $('#sugg');
      if (!q) { box.style.display='none'; return; }
      const hits = ROWS().filter(r=>r.t.startsWith(q) || (r.n||'').toUpperCase().includes(q)).slice(0,12);
      box.innerHTML = hits.map(r=>`<div onclick="openDetail('${r.t}')"><b>${r.t}</b> <span class="mini">${r.n||''} · ${r.b==='HO'?'HOSE':'HNX'}</span></div>`).join('');
      box.style.display = hits.length?'block':'none';
    });
    dq.addEventListener('keydown', e => { if (e.key==='Enter') { const q = dq.value.toUpperCase().trim(); if (byT[q]) openDetail(q); } });
    document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) $('#sugg').style.display='none'; });
    $('#dRanges').addEventListener('click', e => { const b = e.target.closest('button.rng'); if (!b) return; $$('#dRanges .btn.rng').forEach(x=>x.classList.remove('active')); b.classList.add('active'); drawPrice(+b.dataset.y); });
    $('#dTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      $$('#dTabs button').forEach(x=>x.classList.toggle('active', x===b));
      ['ov','sig','rec'].forEach(k => { const d = document.getElementById('tab-'+k); if (d) d.style.display = (b.dataset.t===k?'':'none'); });
      if (b.dataset.t==='sig') renderSigTab();
      if (b.dataset.t==='rec') loadRecs();
    });
    $('#btnLog').onclick = function(){ useLog = !useLog; this.classList.toggle('active', useLog); const b = $('#dRanges .btn.rng.active'); drawPrice(b?+b.dataset.y:14); };
    $('#btnFull').onclick = () => { const el = $('#chartSigWrap'); if (document.fullscreenElement) document.exitFullscreen(); else { el.style.background='#fff'; el.requestFullscreen(); } };
  }
  if (typeof t === 'string') loadDetail(t);
  else if (!curT) loadDetail('FPT');
};
async function loadDetail(t){
  curT = t; const r = byT[t] || {t};
  $('#sugg').style.display='none'; $('#dQ').value='';
  $('#dTitle').innerHTML = `${t} <span class="mini">— ${r.n||''} (${r.b==='HO'?'HOSE':'HNX'})</span> <span class="spin"></span>`;
  $('#dBody').style.display='';
  try {
    const [oh, qs, rts] = await Promise.all([api.ohlc(t, 5100), api.kqkd(t), api.ratios(t)]);
    curOhlc = oh;
    // du lieu quy as-of (theo ngay cong bo) — dung cho ca bang KPI va engine tin hieu
    const qsAv = [];
    qs.forEach(q => {
      if (!q.publicDate) return;
      const pv = qs.find(x=>x.yearReport===q.yearReport-1 && x.lengthReport===q.lengthReport);
      let revY = null, npY = null;
      if (pv) {
        const r1 = pickTop(q), r0 = pickTop(pv), n1 = pick(q,NPAT), n0 = pick(pv,NPAT);
        if (r1!=null && r0) revY = (r1/Math.abs(r0)-1)*100;
        if (n1!=null && n0) npY = (n1/Math.abs(n0)-1)*100;
      }
      qsAv.push({pub: Date.parse(q.publicDate.slice(0,10))/1000, revY, npY});
    });
    qsAv.sort((a,b)=>a.pub-b.pub);
    const tpn = computeTPN(oh, r.b || 'HO', qsAv); starTPN(tpn.markers, oh);
    curMarkers = tpn.markers;
    renderTPN(tpn.state);
    if (proLoadedFor && proLoadedFor !== t) { proLoadedFor = null; if (document.getElementById('chartProWrap').style.display !== 'none') loadProChart(); }
    $('#dTitle').innerHTML = `${t} <span class="mini">— ${r.n||''} (${r.b==='HO'?'HOSE':'HNX'})</span>`;
    // KPI
    const rtsAv = rts.map(x => ({
      av: Date.UTC(x.yearReport, x.quarter*3, 1)/1000 + 45*86400,  // sau khi het quy ~45 ngay (BCTC ra)
      pe: x.pe, pb: x.pb, cap: x.marketCap, roe: x.roe
    })).sort((a,b)=>a.av-b.av);
    dtData = {oh, qsAv, rtsAv};
    updateKpis(null);
    drawPrice(14);
    if (document.getElementById('chartProWrap').style.display !== 'none') loadProChart();
    drawFund(r, qs, rts);
    renderDHead();
    window._recFor = null;
    const _at = document.querySelector('#dTabs button.active');
    if (_at && _at.dataset.t==='rec') loadRecs();
    if (_at && _at.dataset.t==='sig') renderSigTab();
  } catch(e){ toast('Lỗi tải dữ liệu '+t+': '+e.message); }
}
// ===== B★: nang cap hien thi diem mua dat chuan nen co hep + thi truong thuan (display-only) =====
let __ixSD=null, __ixSI=null;
(async()=>{ try{ const to2=NOW()+86400; __ixSD=await jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=VNINDEX&resolution=D&from=${to2-86400*5100}&to=${to2}`); __ixSI={}; __ixSD.t.forEach((ts,k2)=>__ixSI[ts]=k2); }catch(e){} })();
function __ixMA50S(ts){ if(!__ixSD||!__ixSI) return null; const j2=__ixSI[ts]; if(j2==null||j2<49) return null; let s2=0; for(let k2=j2-49;k2<=j2;k2++) s2+=__ixSD.c[k2]; return {c:__ixSD.c[j2], ma:s2/50}; }
function starTPN(mk, oh){ /* da tinh san tren may phat hanh */ }
// ===== Khoa Nguyen Signal engine v2 =====
function computeTPN(oh, boardCode, qsAv){
  // Tin hieu tinh san tren may phat hanh, cong bo qua signals_data.js — trinh duyet chi hien thi
  const S = (window.SIGS && window.SIGS.t && window.SIGS.t[curT]) || null;
  const markers = [];
  if (S && S.m) S.m.forEach(x => {
    const ts = x[0], k = x[1], tx = x[2];
    if (k === 'S') markers.push({time: ts, position:'aboveBar', color:'#e5484d', shape:'arrowDown', text: tx || ''});
    else { const MP = {B:['#18a34b','BUY'], X:['#18a34b','BUY\u2605'], T:['#b45309','THIN'], A:['#67c98b','ADD'], W:['#b45309','WEAK']};
      const mm = MP[k] || MP.B;
      markers.push({time: ts, position:'belowBar', color: mm[0], shape:'arrowUp', text: mm[1]}); }
  });
  return {markers, state: (S && S.st) || null};
}
let curMarkers = [];
function renderTPN(s){
  const el = document.getElementById('dTpn');
  if (!el) return;
  let chip, desc;
  if (s && s.c) {
    chip = s.c; desc = s.dA || '';
    try {
      if (s.dL != null && s.ts) {
        const nv = new Date(), lb = new Date(s.ts*1000);
        const dow = nv.getDay();
        const phienMoi = dow >= 1 && dow <= 5 && lb.toDateString() !== nv.toDateString() && (nv.getHours() + nv.getMinutes()/60) < 15;
        if (phienMoi) desc = s.dL;
      }
    } catch(e){}
  } else { chip = ['CHƯA CÓ TÍN HIỆU', '#f3f5f7', '#6b7280']; desc = ''; }
  el.innerHTML = `<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:flex-end">
    <span class="tag" style="background:${chip[1]};color:${chip[2]};font-size:12.5px;padding:5px 12px;white-space:nowrap">${chip[0]}</span>
    <span class="mini" style="max-width:540px">${desc}</span></div>`;
}

function drawPrice(years){
  if (!curOhlc) return;
  dtCharts.forEach(c=>c.remove()); dtCharts = [];
  ['chartMain','chartVol'].forEach(id=>$('#'+id).innerHTML='');
  const oh = curOhlc; const n = oh.t.length;
  const from = years>=14 ? 0 : Math.max(0, n - Math.round(250*years));
  const T = oh.t.slice(from), O = oh.o.slice(from), H = oh.h.slice(from), Lo = oh.l.slice(from), C = oh.c.slice(from), V = oh.v.slice(from);
  const opts = chartOpts();
  opts.rightPriceScale.mode = useLog ? 1 : 0;
  const ch = LightweightCharts.createChart($('#chartMain'), opts); dtCharts.push(ch);
  const cs = ch.addCandlestickSeries(candleOpts());
  cs.setData(T.map((t,i)=>({time:t,open:O[i],high:H[i],low:Lo[i],close:C[i]})));
  if (curMarkers.length) cs.setMarkers(curMarkers.filter(m=>m.time>=T[0]));
  // OHLC legend theo con tro (kieu TradingView)
  const leg = document.getElementById('ohlcLegend');
  const fmtL = (i) => { const chgP = i>0 ? (C[i]/C[i-1]-1)*100 : 0; const cl = C[i]>=O[i] ? '#128a3e' : '#e5484d';
    return `<b>${curT}</b> &nbsp;O <span style="color:${cl}">${O[i]}</span> &nbsp;H <span style="color:${cl}">${H[i]}</span> &nbsp;L <span style="color:${cl}">${Lo[i]}</span> &nbsp;C <span style="color:${cl}">${C[i]}</span> &nbsp;<span style="color:${chgP>=0?'#128a3e':'#e5484d'}">${chgP>=0?'+':''}${chgP.toFixed(2)}%</span> &nbsp;<span class="mini">KL ${(V[i]/1e6).toFixed(2)}tr</span>`; };
  if (leg && T.length) { leg.innerHTML = fmtL(T.length-1);
    ch.subscribeCrosshairMove(p => {
      if (!p || !p.time) { leg.innerHTML = fmtL(T.length-1); updateKpis(null); return; }
      const ix = T.indexOf(p.time);
      if (ix>=0) { leg.innerHTML = fmtL(ix); updateKpis(from + ix); }   // bang so lieu chay theo con tro
    }); }

  const cAll = oh.c;
  const cut = a => a.slice(from);
  addLine(ch, T, cut(smaS(cAll,20)), '#2563eb', 'MA20');
  addLine(ch, T, cut(smaS(cAll,50)), '#d97706', 'MA50');
  if (cAll.length>=200) addLine(ch, T, cut(smaS(cAll,200)), '#8b5cf6', 'MA200');
  if (false) { const bb = bollS(cAll); addLine(ch, T, cut(bb.map(x=>x[0])), 'rgba(107,114,128,.55)', 'BB+'); addLine(ch, T, cut(bb.map(x=>x[1])), 'rgba(107,114,128,.55)', 'BB-'); }
  // Volume — khung rieng tach khoi chart gia
  const chV = LightweightCharts.createChart($('#chartVol'), chartOpts()); dtCharts.push(chV);
  const vs = chV.addHistogramSeries({priceFormat:{type:'volume'}});
  vs.setData(T.map((t,i)=>({time:t,value:V[i],color: C[i]>=O[i] ? 'rgba(24,163,75,.55)':'rgba(229,72,77,.55)'})));
  // đồng bộ trục thời gian
  const sync = (a,b) => a.timeScale().subscribeVisibleLogicalRangeChange(r => r && b.timeScale().setVisibleLogicalRange(r));
  sync(ch,chV); sync(chV,ch);
  const SHOW = Math.min(T.length, 130);
  ch.timeScale().setVisibleLogicalRange({from: T.length - SHOW, to: T.length + 3});
}
function drawFund(r, qs, rts){
  const cur = [];
  if (r.pe!=null) cur.push(`P/E hiện tại: <b>${fmt(r.pe,2)}</b>`);
  if (r.pb!=null) cur.push(`P/B hiện tại: <b>${fmt(r.pb,2)}</b>`);
  if (r.roe!=null) cur.push(`ROE hiện tại (TTM): <b>${fmt(r.roe,1)}%</b>`);
  $('#dFundCur').innerHTML = cur.join(' &nbsp;·&nbsp; ');
  window.__FIN_BANK = !!(qs && qs.some(function(x){ return x && x.isb38; }));
  const last12 = qs.slice(-12);
  const rtByQ = {}; rts.forEach(x=>{ rtByQ[x.yearReport+'Q'+x.quarter] = x; });
  const cols = last12.map(q => {
    const key = q.yearReport+'Q'+q.lengthReport;
    const pv = qs.find(x=>x.yearReport===q.yearReport-1 && x.lengthReport===q.lengthReport);
    const rev = pickTop(q), np = pick(q,NPAT);
    const rev0 = pv?pickTop(pv):null, np0 = pv?pick(pv,NPAT):null;
    const rt = rtByQ[key] || {};
    return { lb: 'Q'+q.lengthReport+'/'+q.yearReport,
      rev: rev!=null?rev/1e9:null, np: np!=null?np/1e9:null,
      ydt: (rev!=null&&rev0)?(rev/Math.abs(rev0)-1)*100:null,
      yln: (np!=null&&np0)?(np/Math.abs(np0)-1)*100:null,
      roe: rt.roe!=null?rt.roe*100:null, pe: rt.pe, pb: rt.pb };
  });
  const cell = (v,d,suf='',color=false) => v==null ? '<td class="mut">--</td>' : `<td class="${color?cls(v):''}">${(color&&v>0?'+':'')+fmt(v,d)+suf}</td>`;
  const trend = cols.map((c,i)=>{ if (i===0 || c.yln==null || cols[i-1].yln==null) return '<td class="mut">--</td>';
    return c.yln>=cols[i-1].yln ? '<td><span class="chip g">Tăng tốc ▲</span></td>' : '<td><span class="chip r">Giảm tốc ▼</span></td>'; });
  $('#tbFund').innerHTML =
    '<tr><th style="text-align:left">Quý</th>'+cols.map(c=>`<th>${c.lb}</th>`).join('')+'</tr>'
    +'<tr><td style="text-align:left"><b>'+__fRN()+' (tỷ)</b></td>'+cols.map(c=>cell(c.rev,1)).join('')+'</tr>'
    +'<tr><td style="text-align:left"><b>LNST (tỷ)</b></td>'+cols.map(c=>cell(c.np,1)).join('')+'</tr>'
    +'<tr><td style="text-align:left">%YoY '+__fRS()+'</td>'+cols.map(c=>cell(c.ydt,1,'%',true)).join('')+'</tr>'
    +'<tr><td style="text-align:left">%YoY LN</td>'+cols.map(c=>cell(c.yln,1,'%',true)).join('')+'</tr>'
    +'<tr><td style="text-align:left">ROE (%)</td>'+cols.map(c=>cell(c.roe,1,'%',true)).join('')+'</tr>'
    +'<tr><td style="text-align:left">Xu hướng LN</td>'+trend.join('')+'</tr>'
    +'<tr><td style="text-align:left">P/E</td>'+cols.map(c=>cell(c.pe,2)).join('')+'</tr>'
    +'<tr><td style="text-align:left">P/B</td>'+cols.map(c=>cell(c.pb,2)).join('')+'</tr>';
  drawFundCharts(cols);
}

function __fnn(a){ return a.filter(function(v){ return v!=null && !isNaN(v); }); }
function __favg(a){ var x=__fnn(a); if(!x.length) return null; return x.reduce(function(s,v){return s+v;},0)/x.length; }
function __fmed(a){ var x=__fnn(a).slice().sort(function(p,q){return p-q;}); if(!x.length) return null; var m=x.length>>1; return x.length%2 ? x[m] : (x[m-1]+x[m])/2; }
function __fmax(a){ var x=__fnn(a); return x.length?Math.max.apply(null,x):null; }
function __fmin(a){ var x=__fnn(a); return x.length?Math.min.apply(null,x):null; }
function __fidx(a,v){ for(var i=0;i<a.length;i++){ if(a[i]===v) return i; } return -1; }
function __fqOf(cols,key,v){ for(var i=0;i<cols.length;i++){ if(cols[i][key]===v) return cols[i].lb; } return ''; }
function __fsign(v,d){ if(v==null||isNaN(v)) return '--'; return (v>0?'+':'')+fmt(v,d); }
function __fpos(v,a){ var x=__fnn(a); if(!x.length||v==null) return '';
  var tot=x.length, lower=x.filter(function(z){return z<v;}).length, rh=tot-lower;
  if(rh===1) return 'cao nhất '+tot+' quý'; if(rh===2) return 'cao thứ 2 trong '+tot+' quý'; if(rh===3) return 'cao thứ 3 trong '+tot+' quý';
  if(lower===0) return 'thấp nhất '+tot+' quý'; if(lower===1) return 'thấp thứ 2 trong '+tot+' quý'; if(lower===2) return 'thấp thứ 3 trong '+tot+' quý';
  return 'nằm vùng giữa chuỗi '+tot+' quý'; }
function __fstreak(a){ var dir=0,n=0; for(var i=a.length-1;i>0;i--){ if(a[i]==null||a[i-1]==null) break; var d=Math.sign(a[i]-a[i-1]); if(d===0) break; if(dir===0){dir=d;n=1;} else if(d===dir){n++;} else break; } return {n:n,dir:dir}; }
function __fwrap(lead,det){ return '<b>'+lead+'</b> '+det; }

function fundInsight(kind, cols){
 try{
  if(!cols||!cols.length) return '';
  var L=cols[cols.length-1], q=L.lb;
  var A=function(k){ return cols.map(function(c){ return c[k]; }); };

  if(kind==='yoy'){
    var yl=A('yln'), yd=A('ydt'), v=L.yln, d=L.ydt;
    if(v==null) return '';
    var st=__fstreak(yl), lead;
    if(d!=null && d<0 && v>0) lead='Tăng trưởng đang đến từ biên lợi nhuận, không phải từ quy mô.';
    else if(v<0) lead='Lợi nhuận đã tăng trưởng âm so với cùng kỳ.';
    else if(st.dir<0 && st.n>=2) lead='Vẫn tăng trưởng nhưng đà đang chậm lại rõ.';
    else if(st.dir>0 && st.n>=2) lead='Đà tăng trưởng lợi nhuận đang mạnh dần lên.';
    else lead='Tăng trưởng lợi nhuận quanh mặt bằng của chính nó.';
    var det=q+': LNST '+__fsign(v,1)+'% YoY — '+__fpos(v,yl);
    if(st.n>=2) det+=', '+(st.dir<0?'giảm tốc ':'tăng tốc ')+st.n+' quý liên tiếp';
    det+='. Doanh thu '+(d==null?'--':__fsign(d,1)+'%')+'.';
    return __fwrap(lead,det);
  }

  if(kind==='scale'){
    var rv=A('rev'), r=L.rev;
    if(r==null) return '';
    var mxr=__fmax(rv), qi=__fidx(rv,mxr), gap=(mxr?((mxr-r)/mxr*100):0);
    var mgs=cols.map(function(c){ return (c.rev&&c.np!=null)?(c.np/c.rev*100):null; });
    var mg=mgs[mgs.length-1], amg=__favg(mgs), lead;
    if(gap<1) lead='Doanh thu vừa lập đỉnh của chuỗi 12 quý.';
    else if(mg!=null&&amg!=null&&mg>amg&&gap>=8) lead='Quy mô co lại nhưng mỗi đồng doanh thu sinh lời nhiều hơn trước.';
    else if(mg!=null&&amg!=null&&mg<amg&&gap>=8) lead='Cả quy mô lẫn biên lợi nhuận đều dưới mặt bằng của chính nó.';
    else lead='Quy mô doanh thu quanh mặt bằng chuỗi 12 quý.';
    var det=q+': doanh thu '+fmt(r,0)+' tỷ';
    if(gap>=1) det+=', thấp hơn đỉnh '+(cols[qi]?cols[qi].lb:'')+' ('+fmt(mxr,0)+' tỷ) '+fmt(gap,1)+'%';
    if(mg!=null) det+='. Biên LNST '+fmt(mg,1)+'% — '+__fpos(mg,mgs)+', trung bình chuỗi '+fmt(amg,1)+'%';
    det+='.';
    return __fwrap(lead,det);
  }

  if(kind==='roe'){
    var ro=A('roe'), rv2=L.roe;
    if(rv2==null) return '';
    var av=__favg(ro), hi=__fmax(ro), lo=__fmin(ro), band=(hi!=null&&lo!=null)?(hi-lo):null;
    var st2=__fstreak(ro), tot=__fnn(ro).length, n15=__fnn(ro).filter(function(z){return z>=15;}).length, lead;
    var tight = (band!==null && band<=5 && n15===tot && tot>=8);
    if(tight && rv2===lo) lead = 'Nền sinh lời trên vốn vẫn cao và rất ổn định.';
    else if(tight && rv2===hi) lead = 'Vừa lập đỉnh 12 quý trên một nền sinh lời vốn đã rất ổn định.';
    else if(rv2===hi) lead = 'ROE đang ở đỉnh của chuỗi 12 quý.';
    else if(rv2===lo) lead = 'ROE đang ở đáy của chuỗi 12 quý.';
    else if(tight) lead = 'Sinh lời trên vốn cao và rất ổn định — không phải hiện tượng một quý.';
    else if(st2.dir<0 && st2.n>=2) lead = 'Hiệu quả sinh lời trên vốn đang xói mòn dần.';
    else if(st2.dir>0 && st2.n>=2) lead = 'Hiệu quả sinh lời trên vốn đang cải thiện.';
    else lead = 'ROE dao động quanh mặt bằng của chính nó.';
    var det=q+': ROE '+fmt(rv2,1)+'% — '+__fpos(rv2,ro)+', '+(rv2>=av?'trên':'dưới')+' trung bình chuỗi ('+fmt(av,1)+'%)';
    if(st2.n>=2) det+=', '+(st2.dir<0?'giảm ':'tăng ')+st2.n+' quý liên tiếp';
    det+='. '+n15+'/'+tot+' quý trên 15%, cả chuỗi chỉ dao động '+fmt(band,1)+' điểm %.';
    return __fwrap(lead,det);
  }

  if(kind==='val'){
    var pe=A('pe'), pb=A('pb'), ro2=A('roe'), v2=L.pe, b=L.pb, r2=L.roe;
    if(v2==null&&b==null) return '';
    var mpe=__fmed(pe), aro=__favg(ro2);
    var cheap=(v2!=null&&mpe!=null&&v2<mpe*0.85), rich=(v2!=null&&mpe!=null&&v2>mpe*1.15);
    var roeOk=(r2!=null&&aro!=null&&r2>=aro*0.95), lead;
    if(cheap&&roeOk) lead='Thị trường đang trả giá thấp hơn hẳn cho cùng một mức sinh lời so với chính nó 3 năm qua.';
    else if(cheap&&!roeOk) lead='Định giá rẻ đi cùng lúc sinh lời cũng yếu đi — rẻ có lý do của nó.';
    else if(rich&&roeOk) lead='Định giá đang cao hơn mặt bằng 3 năm trong khi sinh lời không đổi.';
    else if(rich&&!roeOk) lead='Giá đang đắt hơn mặt bằng mà sinh lời không theo kịp.';
    else lead='Định giá đang quanh mặt bằng của chính nó.';
    var det=q+': P/E '+fmt(v2,2)+' — '+__fpos(v2,pe)+', trung vị chuỗi '+fmt(mpe,2);
    if(b!=null){ var mxb=__fmax(pb); det+='. P/B '+fmt(b,2)+' — '+__fpos(b,pb)+((mxb!=null&&mxb>b)?', từ '+fmt(mxb,2)+' ('+__fqOf(cols,'pb',mxb)+') về đây':''); }
    if(r2!=null&&aro!=null) det+='. ROE hiện '+fmt(r2,1)+'% so với trung bình chuỗi '+fmt(aro,1)+'%';
    det+='.';
    return __fwrap(lead,det);
  }
  return '';
 }catch(e){ return ''; }
}

var __fundCharts = {}; var __fundCfg = {};
var __FUI = { ink:'#1F2937', mut:'#7A828E', grid:'#E8EAEF', panel:'#FFFFFF',
  ff:'system-ui,-apple-system,Segoe UI,Roboto,sans-serif' };
var __finPlug = {
  id:'finPlug',
  afterDraw: function(chart, a, o){
    var ctx=chart.ctx, ca=chart.chartArea; if(!ca) return;
    var fs=Math.max(13, Math.min(27, (ca.right-ca.left)/25));
    ctx.save();
    ctx.font='700 '+fs.toFixed(1)+'px '+__FUI.ff;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='rgba(122,130,142,.12)';
    try{ ctx.letterSpacing=(fs/7).toFixed(1)+'px'; }catch(e){}
    ctx.fillText('Khoa Nguyen Invest', (ca.left+ca.right)/2, (ca.top+ca.bottom)/2);
    ctx.restore();
  },
  beforeDatasetsDraw: function(chart, a, o){
    if(!o || !o.ref || o.ref.v==null) return;
    var ctx=chart.ctx, ca=chart.chartArea, sc=chart.scales.y; if(!sc) return;
    var y=sc.getPixelForValue(o.ref.v); if(!isFinite(y)||y<ca.top||y>ca.bottom) return;
    ctx.save();
    ctx.strokeStyle='rgba(122,130,142,.5)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(ca.left, Math.round(y)+0.5); ctx.lineTo(ca.right, Math.round(y)+0.5); ctx.stroke();
    ctx.font='600 10px '+__FUI.ff; ctx.textAlign='right'; ctx.textBaseline='bottom';
    ctx.lineWidth=4; ctx.strokeStyle=__FUI.panel; ctx.strokeText(o.ref.label, ca.right-2, y-3);
    ctx.fillStyle=__FUI.mut; ctx.fillText(o.ref.label, ca.right-2, y-3);
    ctx.restore();
  },
  afterDatasetsDraw: function(chart, a, o){
    if(!o || !o.marks || !o.marks.length) return;
    var ctx=chart.ctx, ca=chart.chartArea;
    ctx.save();
    var placed = [];
    o.marks.forEach(function(m){
      var meta=chart.getDatasetMeta(m.ds); if(!meta||!meta.data) return;
      var el=meta.data[m.i]; if(!el) return;
      var x=el.x, y=el.y;
      if(m.dot){ ctx.beginPath(); ctx.arc(x,y,4,0,6.2832); ctx.fillStyle=m.color||__FUI.ink; ctx.fill();
                 ctx.lineWidth=2; ctx.strokeStyle=__FUI.panel; ctx.stroke(); }
      ctx.font=(m.strong?'700 11.5px ':'600 10.5px ')+__FUI.ff;
      var w = ctx.measureText(m.text).width;
      var tx = Math.min(Math.max(x, ca.left+w/2+1), ca.right-w/2-1);
      var ty = m.below ? y+(m.dot?9:7) : y-(m.dot?9:7);
      ctx.textAlign = 'center'; ctx.textBaseline = m.below ? 'top':'bottom';
      if(!m.below) ty = Math.max(ty, ca.top+11); else ty = Math.min(ty, ca.bottom-1);
      var hh = m.strong ? 12 : 11, stepd = m.below ? 1 : -1, guard = 0;
      var rc = function(t){ return { l: tx-w/2-3, r: tx+w/2+3, t: m.below ? t : t-hh, b: m.below ? t+hh : t }; };
      var hit = function(r){ for(var k=0;k<placed.length;k++){ var q=placed[k]; if(r.l<q.r && r.r>q.l && r.t<q.b && r.b>q.t) return true; } return false; };
      while(hit(rc(ty)) && guard < 6){ ty += stepd*(hh+3); guard++; }
      if(!m.below) ty = Math.max(ty, ca.top+11); else ty = Math.min(ty, ca.bottom-1);
      placed.push(rc(ty));
      ctx.lineWidth = 4; ctx.strokeStyle = __FUI.panel; ctx.strokeText(m.text,tx,ty);
      ctx.fillStyle = m.strong ? __FUI.ink:__FUI.mut; ctx.fillText(m.text,tx,ty);
    });
    ctx.restore();
  }
};

function drawFundCharts(cols){
  try{
    if(typeof Chart === 'undefined' || !cols || !cols.length) return;
    var C = { dt:'#2563EB', ln:'#18A34B', roe:'#18A34B', pe:'#2563EB', pb:'#18A34B' };
    var INK=__FUI.ink, MUT=__FUI.mut, GRID=__FUI.grid;
    var L = cols.map(function(c){ return c.lb; }), last = cols.length-1;
    var V = function(k){ return cols.map(function(c){ return c[k]; }); };
    var nn = function(a){ return a.filter(function(v){ return v!=null && !isNaN(v); }); };
    var mx = function(a){ var x=nn(a); return x.length?Math.max.apply(null,x):null; };
    var mn = function(a){ var x=nn(a); return x.length?Math.min.apply(null,x):null; };
    var av = function(a){ var x=nn(a); return x.length?x.reduce(function(s,v){return s+v;},0)/x.length:null; };
    var md = function(a){ var x=nn(a).slice().sort(function(p,q){return p-q;}); if(!x.length) return null; var i=x.length>>1; return x.length%2?x[i]:(x[i-1]+x[i])/2; };
    var ix = function(a,v){ for(var i=0;i<a.length;i++){ if(a[i]===v) return i; } return -1; };
    var dd = function(ms){ var s={}, out=[]; ms.forEach(function(m){ if(!m||m.i<0||m.text==null) return; var k=m.ds+'_'+m.i; if(s[k]) return; s[k]=1; out.push(m); }); return out; };
    var sg = function(v,d){ if(v==null||isNaN(v)) return '--'; return (v>0?'+':'')+fmt(v,d); };

    var opt = function(fv, legend, marks, ref){ return {
      responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      layout:{ padding:{ top:16, right:6, left:0, bottom:0 } },
      plugins:{
        legend:{ display:!!legend, position:'top', align:'start',
          labels:{ boxWidth:8, boxHeight:8, usePointStyle:true, pointStyle:'rectRounded', color:INK, font:{size:11.5}, padding:14 } },
        tooltip:{ backgroundColor:'rgba(31,41,55,.95)', padding:9, cornerRadius:6, usePointStyle:true, boxWidth:8, boxHeight:8,
          titleFont:{size:11.5}, bodyFont:{size:11.5},
          callbacks:{ label:function(x){ return ' '+x.dataset.label+': '+(x.parsed.y==null?'--':fv(x.parsed.y)); } } },
        finPlug:{ marks:marks||[], ref:ref||null }
      },
      scales:{
        x:{ grid:{ display:false }, border:{ color:GRID },
            ticks:{ color:MUT, font:{size:10}, maxRotation:0, autoSkip:true, maxTicksLimit:6 } },
        y:{ grid:{ color:GRID, drawTicks:false }, border:{ display:false },
            ticks:{ color:MUT, font:{size:10}, maxTicksLimit:5, callback:function(v){ return fv(v); } } }
      }
    }; };
    var bar = function(label,key,color){ return { label:label, data:V(key),
      backgroundColor:cols.map(function(c,i){ return i===last?color:color+'80'; }),
      borderRadius:4, borderSkipped:'start', categoryPercentage:.72, barPercentage:.86 }; };
    var line = function(label,key,color){ return { label:label, data:V(key),
      borderColor:color, backgroundColor:color, borderWidth:2, pointRadius:0, pointHoverRadius:5,
      pointHoverBorderColor:__FUI.panel, pointHoverBorderWidth:2, tension:.25, spanGaps:true }; };
    var mk = function(id,fn){ var el=document.getElementById(id); if(!el) return;
      var ex=__fundCharts[id]||(Chart.getChart?Chart.getChart(el):null); if(ex){ try{ ex.destroy(); }catch(e){} }
      var c2=el.getContext('2d'); var __cfg = fn(c2); __fundCfg[id] = __cfg; __fundCharts[id] = new Chart(c2, __cfg); };
    var pctv=function(v){ return fmt(v,1)+'%'; }, tyv=function(v){ return fmt(v,0); }, lanv=function(v){ return fmt(v,1); };
    var chip=function(d,unit,dec,neutral){ if(d==null||!isFinite(d)) return '';
      var cls=neutral?'fl':(d>0?'up':(d<0?'dn':'fl')), ar=(d>0?'▲':(d<0?'▼':'■'));
      return '<span class="fd '+cls+'">'+ar+' '+fmt(Math.abs(d),dec)+unit+'</span>'; };
    var hero=function(id,val,d,unit,dec,neutral){ var e=document.getElementById(id); if(!e) return;
      e.innerHTML='<span class="fq">'+cols[last].lb+'</span>'+val+chip(d,unit,dec,neutral); };

    var yl=V('yln'), yd=V('ydt'), rv=V('rev'), np=V('np'), ro=V('roe'), pe=V('pe'), pb=V('pb');

    var m1=dd([
      {ds:1,i:last,text:sg(yl[last],1)+'%',strong:true,below:(yl[last]<0)},
      {ds:0,i:last,text:sg(yd[last],1)+'%',strong:true,below:(yd[last]<0)},
      {ds:1,i:ix(yl,mx(yl)),text:'Đỉnh '+sg(mx(yl),1)+'%',color:C.ln},
      {ds:1,i:ix(yl,mn(yl)),text:'Đáy '+sg(mn(yl),1)+'%',below:(mn(yl)<0),color:C.ln}
    ]);
    mk('fcYoy', function(){ return { type:'bar', plugins:[__finPlug],
      data:{ labels:L, datasets:[ bar('%YoY '+__fRN(),'ydt',C.dt), bar('%YoY Lợi nhuận','yln',C.ln) ] },
      options:opt(pctv,true,m1,null) }; });
    hero('fhYoy', sg(yl[last],1)+'%', (yl[last]!=null&&yl[last-1]!=null)?(yl[last]-yl[last-1]):null, ' đ%',1,false);

    var m2=dd([
      {ds:0,i:last,text:fmt(rv[last],0),strong:true},
      {ds:1,i:last,text:fmt(np[last],0),strong:true},
      {ds:0,i:ix(rv,mx(rv)),text:'Đỉnh '+fmt(mx(rv),0),color:C.dt}
    ]);
    mk('fcScale', function(){ return { type:'bar', plugins:[__finPlug],
      data:{ labels:L, datasets:[ bar(__fRN()+' (tỷ)','rev',C.dt), bar('LNST (tỷ)','np',C.ln) ] },
      options:opt(tyv,true,m2,null) }; });
    hero('fhScale', fmt(rv[last],0)+' tỷ', (rv[last]&&rv[last-1])?((rv[last]/rv[last-1]-1)*100):null, '%',1,false);

    var m3=dd([
      {ds:0,i:last,text:fmt(ro[last],1)+'%',strong:true,dot:true,color:C.roe},
      {ds:0,i:ix(ro,mx(ro)),text:'Đỉnh '+fmt(mx(ro),1)+'%',dot:true,color:C.roe},
      {ds:0,i:ix(ro,mn(ro)),text:'Đáy '+fmt(mn(ro),1)+'%',below:true,dot:true,color:C.roe}
    ]);
    var avRoe=av(ro);
    mk('fcRoe', function(c2){ var ds=line('ROE (%)','roe',C.roe);
      var g=c2.createLinearGradient(0,0,0,215); g.addColorStop(0,C.roe+'2B'); g.addColorStop(1,C.roe+'00');
      ds.fill=true; ds.backgroundColor=g;
      return { type:'line', plugins:[__finPlug], data:{ labels:L, datasets:[ds] },
        options:opt(pctv,false,m3,avRoe==null?null:{v:avRoe,label:'TB '+fmt(avRoe,1)+'%'}) }; });
    hero('fhRoe', fmt(ro[last],1)+'%', (ro[last]!=null&&ro[last-1]!=null)?(ro[last]-ro[last-1]):null, ' đ%',1,false);

    var m4=dd([
      {ds:0,i:last,text:fmt(pe[last],2),strong:true,dot:true,color:C.pe},
      {ds:1,i:last,text:fmt(pb[last],2),strong:true,dot:true,color:C.pb,below:true},
      {ds:0,i:ix(pe,mx(pe)),text:'Đỉnh '+fmt(mx(pe),2),dot:true,color:C.pe},
      {ds:0,i:ix(pe,mn(pe)),text:'Đáy '+fmt(mn(pe),2),below:true,dot:true,color:C.pe}
    ]);
    var mdPe=md(pe);
    mk('fcVal', function(){ return { type:'line', plugins:[__finPlug],
      data:{ labels:L, datasets:[ line('P/E','pe',C.pe), line('P/B','pb',C.pb) ] },
      options:opt(lanv,true,m4,mdPe==null?null:{v:mdPe,label:'Trung vị P/E '+fmt(mdPe,2)}) }; });
    hero('fhVal', 'P/E '+fmt(pe[last],2), (pe[last]&&pe[last-1])?((pe[last]/pe[last-1]-1)*100):null, '%',1,true);

    var set=function(id,html){ var e=document.getElementById(id); if(e) e.innerHTML=html; };
    set('fiYoy',   __fTxtB(fundInsight('yoy',cols)));
    set('fiScale', __fTxtB(fundInsight('scale',cols)));
    set('fiRoe',   fundInsight('roe',cols));
    set('fiVal',   fundInsight('val',cols));
    try{ var _t1=document.getElementById('fcYoy'), _t2=document.getElementById('fcScale'), _c1=_t1&&_t1.closest('.fcard'), _c2=_t2&&_t2.closest('.fcard'); if(_c1&&_c1.querySelector('.ftit')) _c1.querySelector('.ftit').textContent='Tăng trưởng YoY — '+__fRN()+' & Lợi nhuận'; if(_c2&&_c2.querySelector('.ftit')) _c2.querySelector('.ftit').textContent='Quy mô — '+__fRN()+' & LNST (tỷ đồng)'; }catch(e){}
__finDecorate();
  }catch(e){ console.warn('drawFundCharts', e); }
}


var __finBack = null, __finCurId = null;
function __finCss(){
  if(document.getElementById('finXtraCss')) return;
  var st = document.createElement('style'); st.id = 'finXtraCss';
  st.textContent = [
   '#finCharts .fhead{gap:8px}',
   '#finCharts .ftit{flex:1 1 auto;min-width:0}',
   '#finCharts .fsym,#finModalHead .fsym{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.4px;color:var(--text);background:var(--panel2);border:1px solid var(--border);border-radius:6px;padding:1px 7px;margin-right:8px;vertical-align:1px}',
   '#finModalHead .fsym{font-size:12.5px;padding:2px 9px}',
   '#finCharts .fexp{flex:0 0 auto;align-self:center;width:27px;height:25px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--border);background:var(--panel);color:var(--muted);border-radius:7px;cursor:pointer;padding:0}',
   '#finCharts .fexp:hover{background:var(--panel2);color:var(--text)}',
   '#finModal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:rgba(31,41,55,.55);padding:20px}',
   '#finModalCard{position:relative;background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:18px 20px 16px;width:min(1120px,96vw);max-height:92vh;overflow:auto}',
   '#finModalX{position:absolute;top:10px;right:12px;width:30px;height:30px;border:1px solid var(--border);background:var(--panel);color:var(--muted);border-radius:8px;font-size:19px;line-height:1;cursor:pointer;padding:0}',
   '#finModalX:hover{background:var(--panel2);color:var(--text)}',
   '#finModalHead{display:flex;align-items:baseline;justify-content:space-between;gap:14px;padding-right:38px;margin-bottom:10px}',
   '#finModalHead .mtit{font-size:16px;font-weight:700;color:var(--text)}',
   '#finModalHead .fhero{font-size:20px;font-weight:800;color:var(--text);white-space:nowrap;letter-spacing:-.2px}',
   '#finModalHead .fq{font-size:12px;font-weight:600;color:var(--muted);margin-right:7px;letter-spacing:0}',
   '#finModalHead .fd{display:inline-block;font-size:12.5px;font-weight:700;margin-left:7px;padding:2px 9px;border-radius:999px;letter-spacing:0;vertical-align:2px}',
   '#finModalHead .fd.up{color:var(--green);background:var(--green-soft)}',
   '#finModalHead .fd.dn{color:var(--red);background:var(--red-soft)}',
   '#finModalHead .fd.fl{color:var(--muted);background:var(--panel2)}',
   '#finModal .fbox{height:min(56vh,470px);position:relative}',
   '#finModalIns{font-size:14px;line-height:1.65;color:var(--muted);margin-top:12px;padding:11px 14px;background:var(--panel2);border-radius:9px;border-left:3px solid var(--blue)}',
   '#finModalIns b{color:var(--text);font-weight:700}',
   '#finModalFoot{margin-top:11px;font-size:11.5px;color:var(--muted);text-align:right;letter-spacing:.2px}'
  ].join('');
  document.head.appendChild(st);
}
function __finSym(){
  var e = document.getElementById('dTitle');
  if(e && e.firstChild && e.firstChild.textContent){
    var t = e.firstChild.textContent.trim();
    if(/^[A-Z0-9]{2,5}$/.test(t)) return t;
  }
  return '';
}
function __finClose(){
  var m = document.getElementById('finModal'); if(!m) return;
  if(__finBack && __finBack.box && __finBack.parent){
    __finBack.parent.insertBefore(__finBack.box, __finBack.next);
    var ch = __fundCharts[__finCurId];
    if(ch){ try{ ch.resize(); }catch(e){} }
  }
  __finBack = null; __finCurId = null;
  m.style.display = 'none';
}
function __finOpen(cid){
  try{
    __finCss();
    var cv = document.getElementById(cid); if(!cv) return;
    var card = cv.closest('.fcard'); if(!card) return;
    var box = cv.closest('.fbox'); if(!box) return;
    var m = document.getElementById('finModal');
    if(!m){
      m = document.createElement('div'); m.id = 'finModal';
      m.innerHTML = '<div id="finModalCard">'
        + '<button id="finModalX" type="button" aria-label="Đóng">&times;</button>'
        + '<div id="finModalHead"></div>'
        + '<div id="finModalSlot"></div>'
        + '<div id="finModalIns"></div>'
        + '<div id="finModalFoot"></div>'
        + '</div>';
      document.body.appendChild(m);
      m.addEventListener('click', function(ev){ if(ev.target === m) __finClose(); });
      document.getElementById('finModalX').onclick = __finClose;
      document.addEventListener('keydown', function(ev){
        if(ev.key === 'Escape'){ var mm = document.getElementById('finModal'); if(mm && mm.style.display === 'flex') __finClose(); }
      });
    }
    if(__finCurId) __finClose();
    var tit = card.querySelector('.ftit'), hero = card.querySelector('.fhero'), ins = card.querySelector('.fins');
    document.getElementById('finModalHead').innerHTML =
      '<div class="mtit">' + (tit ? tit.innerHTML : '') + '</div>'
      + '<div class="fhero">' + (hero ? hero.innerHTML : '') + '</div>';
    document.getElementById('finModalIns').innerHTML = ins ? ins.innerHTML : '';
    document.getElementById('finModalFoot').textContent = 'Khoa Nguyen Invest \u00b7 khoanguyeninvest.vn';
    __finBack = { box: box, parent: box.parentNode, next: box.nextSibling };
    __finCurId = cid;
    document.getElementById('finModalSlot').appendChild(box);
    m.style.display = 'flex';
    var ch = __fundCharts[cid];
    if(ch){ setTimeout(function(){ try{ ch.resize(); }catch(e){} }, 30); }
  }catch(e){ console.warn('finOpen', e); }
}
function __finDecorate(){
  try{
    __finCss();
    var sym = __finSym();
    var ids = ['fcYoy','fcScale','fcRoe','fcVal'];
    var svg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
    ids.forEach(function(cid){
      var cv = document.getElementById(cid); if(!cv) return;
      var card = cv.closest('.fcard'); if(!card) return;
      var tit = card.querySelector('.ftit');
      if(tit){
        var b = tit.querySelector('.fsym');
        if(!b){ b = document.createElement('span'); b.className = 'fsym'; tit.insertBefore(b, tit.firstChild); }
        b.textContent = sym || '--';
        b.style.display = sym ? 'inline-block' : 'none';
      }
      var head = card.querySelector('.fhead');
      if(head && !head.querySelector('.fexp')){
        var btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'fexp'; btn.title = 'Phóng to';
        btn.setAttribute('aria-label', 'Phóng to biểu đồ');
        btn.innerHTML = svg;
        btn.addEventListener('click', function(){ __finOpen(cid); });
        head.appendChild(btn);
      }
    });
  }catch(e){ console.warn('finDecorate', e); }
}

function drawCanslim(r, qs){
  const np = qs.map(x=>pick(x,NPAT));
  const items = [
    ['C', r.cs?.C, `LNST quý gần nhất ${pct(r.npatYoY)} so với cùng kỳ (chuẩn: ≥ +25%)`],
    ['A', r.cs?.A, `Tăng trưởng LNST (TTM) 3 năm: ${pct(r.cagr3)}/năm (chuẩn: ≥ +20%)`],
    ['N', r.cs?.N, `Giá cách đỉnh 52 tuần ${pct(r.dHi)} (chuẩn: trong vòng 15%)`],
    ['S', r.cs?.S, `Volume phiên cuối gấp ${fmt(r.vx,2)} lần TB 20 phiên (chuẩn: ≥ 1.2x)`],
    ['L', r.cs?.L, `Sức mạnh giá RS = ${r.rs??'—'}/99 so với toàn thị trường (chuẩn: ≥ 70)`],
    ['I', r.cs?.I, `GTGD trung bình ${fmt((r.val20||0)/1000,1)} tỷ/phiên — thanh khoản đủ hút tổ chức (chuẩn: ≥ 5 tỷ)`],
    ['M', M_STATUS, M_STATUS==null ? 'Mở tab Thị trường để tính xu hướng VN-Index' : (M_STATUS?'VN-Index đang trên MA50 — thị trường thuận lợi':'VN-Index dưới MA50 — thị trường bất lợi')]
  ];
  $('#dCs').innerHTML = items.map(x=>`<div style="display:flex;align-items:center;margin:6px 0"><span class="cs-letter ${x[1]?'cs-on':'cs-off'}">${x[0]}</span><span class="mini" style="font-size:13px">${x[2]}</span></div>`).join('')
    + `<div style="margin-top:8px"><b>Tổng: ${(r.csTong||0)+(M_STATUS?1:0)}/7</b> <span class="mini">— chấm tự động từ dữ liệu, chỉ tham khảo</span></div>`;
}
function drawKq(qs){
  const last12 = qs.slice(-12);
  const labels = last12.map(x=>x.yearReport+'Q'+x.lengthReport);
  const rev = last12.map(x=>{ const v = pick(x,REV); return v!=null?v/1e9:null; });
  const np = last12.map(x=>{ const v = pick(x,NPAT); return v!=null?v/1e9:null; });
  if (kqChart) kqChart.destroy();
  kqChart = new Chart($('#cvKq'), { data: { labels, datasets: [
    {type:'bar', label:'Doanh thu', data:rev, backgroundColor:'rgba(24,163,75,.45)', yAxisID:'y'},
    {type:'line', label:'LNST', data:np, borderColor:'#2563eb', backgroundColor:'#2563eb', yAxisID:'y2', tension:.25}
  ]}, options: chartJsOpts(2) });
  // bảng 12 quý
  const yoy = (arr,i) => { const j = last12.length-12+i; const q = last12[i]; const prevIdx = qs.findIndex(x=>x.yearReport===q.yearReport-1 && x.lengthReport===q.lengthReport); const cur = pick(q,NPAT); const prev = prevIdx>=0?pick(qs[prevIdx],NPAT):null; return (cur!=null&&prev!=null&&prev!==0)?(cur/Math.abs(prev)-1)*100:null; };
  $('#tbKq').innerHTML = '<tr><th>Quý</th><th>Doanh thu (tỷ)</th><th>LNST (tỷ)</th><th>LNST YoY</th><th>Ngày công bố</th></tr>' +
    last12.slice().reverse().map((q,ri)=>{ const i = last12.length-1-ri; const g = yoy(last12,i);
      return `<tr><td><b>${labels[i]}</b></td><td>${fmt(rev[i],0)}</td><td class="${cls(np[i])}">${fmt(np[i],0)}</td><td class="${cls(g)}">${pct(g)}</td><td class="mini">${(q.publicDate||'').slice(0,10)}</td></tr>`; }).join('');
}
function drawRt(rts){
  const labels = rts.map(x=>x.yearReport+'Q'+x.quarter);
  if (rtChart) rtChart.destroy();
  rtChart = new Chart($('#cvRt'), { data: { labels, datasets: [
    {type:'line', label:'P/E', data:rts.map(x=>x.pe), borderColor:'#2563eb', yAxisID:'y', tension:.25},
    {type:'line', label:'P/B', data:rts.map(x=>x.pb), borderColor:'#d97706', yAxisID:'y2', tension:.25},
    {type:'line', label:'ROE %', data:rts.map(x=>x.roe!=null?x.roe*100:null), borderColor:'#18a34b', yAxisID:'y2', tension:.25}
  ]}, options: chartJsOpts(2) });
}
function chartJsOpts(axes){ const o = {responsive:true, plugins:{legend:{labels:{color:'#374151'}}}, scales:{x:{ticks:{color:'#6b7280'},grid:{color:'#eef1f4'}}, y:{ticks:{color:'#6b7280'},grid:{color:'#eef1f4'}}}}; if (axes===2) o.scales.y2 = {position:'right', ticks:{color:'#6b7280'}, grid:{drawOnChartArea:false}}; return o; }

// ================= 4. SO SÁNH =================
let cmpList = [], cmpInit = false, cmpChart = null;
window.addCmp = t => { if (!cmpList.includes(t)) { if (cmpList.length>=4) return toast('Tối đa 4 mã'); cmpList.push(t); } showView('compare'); };
inits.compare = function(){
  const el = $('#view-compare');
  if (!cmpInit) { cmpInit = true;
    el.innerHTML = `<div class="card"><h2>Định giá theo dòng <span class="hint">P/B lịch sử 6 năm + ROE — cập nhật theo phiên</span></h2>
      <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap">
        <div class="seg" id="secGrp"><button data-g="bank" class="on">Ngân hàng</button><button data-g="sec">Chứng khoán</button></div>
        <span class="mini" style="align-self:center"><span style="display:inline-block;width:10px;height:10px;background:#128A3E;border-radius:3px;vertical-align:-1px"></span> khoảng P/B &nbsp; <span style="display:inline-block;width:10px;height:10px;background:#67D98B;border-radius:3px;vertical-align:-1px"></span> P/B hiện tại &nbsp; <span style="display:inline-block;width:10px;height:10px;background:#D97706;border-radius:50%;vertical-align:-1px"></span> ROE hiện tại</span>
        <span class="mini" id="secSt" style="align-self:center"></span>
      </div>
      <div style="height:calc(100vh - 285px);min-height:420px"><canvas id="cvSec"></canvas></div></div>`;
    $('#secGrp').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#secGrp button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); secGrp = b.dataset.g; drawSec(); });
  }
  drawSec();
};
// ===== DINH GIA THEO DONG (khoang P/B & ROE lich su, hien tai theo phien) =====
const SEC_GROUPS = { bank:['VCB','BID','CTG','TCB','MBB','ACB','STB','SHB','VPB','TPB','VIB','MSB','OCB'], sec:['SSI','VND','VCI','HCM','MBS','VDS','BSI','SHS','VIX','FTS','ORS','TCX','VPX','VCK'] };
let secCache = {}, secChart = null, secGrp = 'bank';
async function drawSec(){
  const st = $('#secSt'); const codes = SEC_GROUPS[secGrp];
  const cch = secCache[secGrp];
  if (!cch || (Date.now() - (cch._ts||0)) > 10*60*1000) {
    if (st) st.innerHTML = '<span class="spin"></span> đang tải…';
    const out = {};
    try { const f = await jget('https://api-finfo.vndirect.com.vn/v4/ratios/latest?order=reportDate&filter=ratioCode:PRICE_TO_BOOK&where=code:'+codes.join(',')+'&size=50');
      (f.data||[]).forEach(x=>{ out[x.code] = {curPb: x.value, pbDate: (x.reportDate||'').slice(0,10) || null}; }); } catch(e){}
    for (let i=0;i<codes.length;i+=6) await Promise.all(codes.slice(i,i+6).map(async t => { try {
      const rts = await api.ratios(t); const h = rts.slice(-24);
      const pbs = h.map(x=>x.pb).filter(v=>v!=null&&isFinite(v)), roes = h.map(x=>x.roe!=null?x.roe*100:null).filter(v=>v!=null&&isFinite(v));
      out[t] = Object.assign(out[t]||{}, { pbLo:Math.min(...pbs), pbHi:Math.max(...pbs), roeLo:Math.min(...roes), roeHi:Math.max(...roes),
        curRoe: rts.length && rts[rts.length-1].roe!=null ? rts[rts.length-1].roe*100 : null });
      try { const oh = await api.ohlc(t, 220);
        if (oh && oh.c && oh.c.length > 1) {
          const pNow = oh.c[oh.c.length-1];
          const closeAt = lim => { for (let k = oh.t.length-1; k >= 0; k--) {
            const ds = new Date(oh.t[k]*1000).toISOString().slice(0,10);
            if (ds <= lim) return oh.c[k]; } return null; };
          if (out[t].curPb != null && out[t].pbDate) {
            const pRef = closeAt(out[t].pbDate);
            if (pRef > 0 && pNow > 0) out[t].curPb = +(out[t].curPb * pNow / pRef).toFixed(3);
          } else {
            const L = rts.length ? rts[rts.length-1] : null;
            if (L && L.pb != null && L.pb > 0) {
              const qEnd = new Date(Date.UTC(L.yearReport, L.quarter*3, 0)).toISOString().slice(0,10);
              const pQ = closeAt(qEnd);
              if (pQ > 0 && pNow > 0) out[t].curPb = +(L.pb * pNow / pQ).toFixed(3);
            }
          }
          if (out[t].curPb > 0 && pNow > 0) out[t].bvps = +(pNow / out[t].curPb).toFixed(2);
        }
        if (out[t].curPb == null && rts.length) out[t].curPb = rts[rts.length-1].pb;
      } catch(e){ if (out[t].curPb == null && rts.length) out[t].curPb = rts[rts.length-1].pb; }
    } catch(e){} }));
    out._ts = Date.now();
    secCache[secGrp] = out;
    if (st) st.textContent = 'P/B hiện tại đã quy theo giá phiên mới nhất';
  }
  const D = secCache[secGrp];
  const items = codes.filter(c => D[c] && D[c].pbLo!=null && isFinite(D[c].pbLo))
    .sort((a,b)=>((D[b].curRoe??-99)-(D[a].curRoe??-99)));   // xep theo ROE cao -> thap cho de doc
  if (secChart) secChart.destroy();
  const secLbl = { id:'secLbl', afterDatasetsDraw(chart){ const ctx = chart.ctx; const meta = chart.getDatasetMeta(0);
    meta.data.forEach((bar,i)=>{ const d = D[items[i]];
      ctx.save(); ctx.font = '700 11px Inter, sans-serif'; ctx.fillStyle = '#1F2937'; ctx.textAlign = 'center';
      if (d.curPb!=null && isFinite(d.curPb)) { const yPix = chart.scales.y.getPixelForValue(d.curPb);
        ctx.strokeStyle = '#67D98B'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bar.x-bar.width/2, yPix); ctx.lineTo(bar.x+bar.width/2, yPix); ctx.stroke();
        ctx.fillStyle = '#128A3E'; ctx.textAlign = 'left'; ctx.fillText((+d.curPb).toFixed(1), bar.x+bar.width/2+4, yPix+4); }
      ctx.restore(); }); }};
  secChart = new Chart($('#cvSec'), {
    data:{ labels: items, datasets:[
      { type:'bar', data: items.map(c=>[D[c].pbLo, D[c].pbHi]), backgroundColor:'#128A3E', borderRadius:5, barPercentage:.42, yAxisID:'y', order:2 },
      { type:'line', showLine:false, data: items.map(c=>D[c].curRoe), pointBackgroundColor:'#D97706', pointBorderColor:'#fff', pointBorderWidth:1.5, pointRadius:5.5, yAxisID:'y2', order:1 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{callbacks:{ label: c => { const d = D[items[c.dataIndex]];
        return c.datasetIndex===1 ? 'ROE hiện tại: '+(d.curRoe!=null?d.curRoe.toFixed(1)+'%':'--')
          : ['P/B cao nhất: '+d.pbHi.toFixed(2), 'P/B thấp nhất: '+d.pbLo.toFixed(2), 'P/B hiện tại: '+(d.curPb!=null?(+d.curPb).toFixed(2):'--'),
             'Sổ sách/cp: '+(d.bvps!=null?(+d.bvps).toFixed(2)+' (VNDirect)':'--')]; } }} },
      scales:{ x:{grid:{display:false}, ticks:{color:'#1F2937', font:{weight:600, size:12, family:'Inter'}}},
               y:{beginAtZero:true, grid:{color:'#F1F3F6'}, ticks:{color:'#7A828E', font:{size:11}}, title:{display:true, text:'P/B', color:'#7A828E', font:{size:11}}},
               y2:{position:'right', beginAtZero:true, grid:{drawOnChartArea:false}, ticks:{color:'#D97706', font:{size:11}, callback:v=>v+'%'}, title:{display:true, text:'ROE', color:'#D97706', font:{size:11}}} } },
    plugins:[secLbl] });
}

async function renderCmp(){
  $('#cChips').innerHTML = cmpList.map(t=>`<span class="cmp-chip">${t}<span onclick="rmCmp('${t}')">✕</span></span>`).join('');
  window.rmCmp = t => { cmpList = cmpList.filter(x=>x!==t); renderCmp(); };
  if (!cmpList.length) { $('#tbCmp').innerHTML=''; return; }
  const metrics = [['Giá','p',2],['P/E','pe',1],['P/B','pb',2],['ROE %','roe',1],['LNST YoY %','npatYoY',1],['DT / TOI YoY %','revYoY',1],['LN 3 năm %/n','cagr3',1],['RS','rs',0],['CANSLIM','csTong',0],['Vốn hóa (tỷ)','cap',0],['Cổ tức %','dy',1],['Cách đỉnh 52T %','dHi',1]];
  $('#tbCmp').innerHTML = '<tr><th>Chỉ số</th>' + cmpList.map(t=>`<th>${t}</th>`).join('') + '</tr>' +
    metrics.map(m=>`<tr><td><b>${m[0]}</b></td>${cmpList.map(t=>{ const v = (byT[t]||{})[m[1]]; return `<td>${fmt(v,m[2])}</td>`; }).join('')}</tr>`).join('');
}

// ================= CẬP NHẬT DỮ LIỆU (client-side) =================
// ================= TAB THEO DÕI (quét cuối phiên — canh phiên bùng nổ) =================
let wSortK='val20', wSortD=-1;
window.sortWatch = k => { if (wSortK===k) wSortD=-wSortD; else { wSortK=k; wSortD=(k==='t')?1:-1; } inits.watch(); };
inits.watch = function(){
  const el = $('#view-watch');
  const all = ROWS().filter(r=>r.watch);
  const enrich = r=>{
    r._kl  = (r.v20!=null && r.vx!=null) ? Math.round(r.v20*r.vx) : (r.v20!=null?r.v20:null);
    r._pkl = (r.vx!=null) ? r.vx*100 : null;
    const q = (r.q && r.q.length) ? r.q[r.q.length-1] : null;
    r._dtq = q ? (q[2]||0) : null;                 // doanh thu quy gan nhat (VND); bank = 0
    r._lnq = q ? (q[3]!=null?q[3]:null) : null;      // loi nhuan quy gan nhat (VND)
    r._q = q;
  };
  all.forEach(enrich);
  const sorter = (a,b)=>{
    if (wSortK==='val20' && wSortD===-1){ const sa=a.wstar?0:1, sb=b.wstar?0:1; if(sa!==sb) return sa-sb; }  // sao len truoc
    let x=a[wSortK], y=b[wSortK];
    if (typeof x==='string'||typeof y==='string'){ return wSortD*String(x||'').localeCompare(String(y||'')); }
    x=(x==null?-1e18:x); y=(y==null?-1e18:y); return wSortD*(x-y);
  };
  const strong = all.filter(r=>r.wgrade!=='weak').sort(sorter);   // FA dat -> danh sach mua
  const weak   = all.filter(r=>r.wgrade==='weak').sort(sorter);    // FA chua dat -> de rieng
  const H =(k,lb,left)=>`<th ${left?'style="text-align:left"':''}class="${wSortK===k?'on':''}" onclick="event.stopPropagation();sortWatch('${k}')">${lb}${wSortK===k?(wSortD>0?' ▲':' ▼'):''}</th>`;
  const HP=(lb,left)=>`<th ${left?'style="text-align:left"':''}>${lb}</th>`;
  let lab=''; const up=(SUM.updated||'').slice(0,10);
  if(up){const dt=new Date(up+'T12:00:00');const wd=dt.getDay();dt.setDate(dt.getDate()+(wd===5?3:(wd===6?2:1)));lab=('0'+dt.getDate()).slice(-2)+'/'+('0'+(dt.getMonth()+1)).slice(-2);}
  const tyd = v => (v==null) ? '—' : (v===0 ? '—' : fmt(v/1e9, Math.abs(v)>=1e10?0:1));   // ve ty dong
  const rowHtml = r=>{
    const qlab=r._q?('Q'+r._q[1]+'/'+r._q[0]):'';
    return `<tr class="row" data-t="${r.t}" onclick="openDetail('${r.t}')">
      <td style="text-align:left"><b>${r.t}</b>${r.wstar?' <span style="color:#B45309" title="Nền siết chặt">★</span>':''}</td>
      <td>${fmt(r.p,2)}</td>
      <td id="lv_${r.t}" class="${cls(r.chg)}">${pct(r.chg)}</td>
      <td>${fmt(r._kl,0)}</td>
      <td class="${r._pkl!=null&&r._pkl>=100?'up':'mut'}">${r._pkl==null?'—':fmt(r._pkl,0)+'%'}</td>
      <td>${fmt((r.val20||0)/1000,1)}</td>
      <td class="${cls(r._lnq)}" title="${qlab}">${tyd(r._lnq)}</td>
      <td title="${qlab}">${tyd(r._dtq)}</td></tr>`;
  };
  const headRow = sortable => sortable
    ? `<tr>${H('t','Mã',1)}${H('p','Giá')}${H('chg','% giá')}${H('_kl','Khối lượng')}${H('_pkl','% KL')}${H('val20','GTGD TB20 (tỷ)')}${H('_lnq','LN quý (tỷ)')}${H('_dtq','DT quý (tỷ)')}</tr>`
    : `<tr>${HP('Mã',1)}${HP('Giá')}${HP('% giá')}${HP('Khối lượng')}${HP('% KL')}${HP('GTGD TB20 (tỷ)')}${HP('LN quý (tỷ)')}${HP('DT quý (tỷ)')}</tr>`;
  const tableHtml = (list, sortable)=>`<div style="overflow:auto"><table>${headRow(sortable)}${list.map(rowHtml).join('')}</table></div>`;
  el.innerHTML = `<div class="card">
    <h2 style="margin-bottom:3px">Watchlist ${lab}</h2>
    <div class="mini" style="margin-bottom:10px">Danh sách canh mua phiên tới — đã lọc cơ bản (FA đạt) · ${strong.length} mã · cập nhật ${(SUM.updated||'')}. Mã có <span style="color:#B45309">★</span> là nền siết chặt — bấm tiêu đề cột để sắp xếp.</div>
    ${strong.length?tableHtml(strong,true):'<div class="mini" style="padding:8px 0">Chưa có mã đạt chuẩn cơ bản — cập nhật cuối phiên để quét lại.</div>'}
    <div class="mini" style="margin-top:9px;color:#7A828E">LN/DT quý = quý gần nhất đã công bố (ngân hàng không có cột doanh thu → ghi —). Khối lượng &amp; % KL ước tính theo trung bình 20 phiên.</div>
  </div>
  ${weak.length?`<div class="card" style="border-top:3px solid #F0B429">
    <h2 style="margin-bottom:3px;color:#B45309">Chưa đạt về cơ bản (FA) <span class="hint" style="color:#B45309">· ${weak.length} mã · để riêng, không vào danh sách mua</span></h2>
    <div class="mini" style="margin-bottom:10px">Đã đạt nền kỹ thuật nhưng tăng trưởng lợi nhuận quý gần nhất rơi vùng 0–25% (chưa tăng tốc) — theo bộ lọc FA thì tách riêng để theo dõi, chưa phải mã mua.</div>
    ${tableHtml(weak,false)}
  </div>`:''}`;
};

// ===== TRỰC CHIẾN TRONG PHIÊN: poll giá realtime các mã vùng theo dõi, báo khi bùng nổ =====
const liveWatch = {
  timer: null, list: [],
  inSession(){ const h = new Date().getHours()+new Date().getMinutes()/60; const d = new Date().getDay(); return d>=1 && d<=5 && ((h>=9 && h<11.5) || (h>=13 && h<14.83)); },
  paint(){ const b = document.getElementById('btnLive'), st = document.getElementById('liveSt'); if(!b) return;
    b.classList.toggle('active', !!this.timer);
    b.textContent = this.timer ? 'Đang trực chiến — bấm để tắt' : 'Bật trực chiến trong phiên';
    if (st && !this.timer) st.textContent = 'Quét mỗi 90 giây trong giờ giao dịch, báo ngay khi có mã bùng nổ. Giữ tab này mở.'; },
  async toggle(ws){
    if (this.timer) { clearInterval(this.timer); this.timer = null; document.querySelectorAll('#view-watch tr.row').forEach(tr=>tr.style.display=''); const em=document.getElementById('liveEmpty'); if(em) em.textContent=''; this.paint(); return; }
    ga('live_watch_on');
    if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
    if (!('Notification' in window)) {
      toast('Thiết bị này không hỗ trợ thông báo đẩy (iPhone/Safari) — hãy giữ tab này mở, bảng lọc vẫn tự cập nhật.');
    } else if (Notification.permission === 'granted') {
      try { new Notification('Khoa Nguyen Signal', {body: 'Trực chiến đã bật — thông báo hoạt động tốt. Có mã bùng nổ sẽ báo ngay tại đây.'}); } catch(e){}
    } else if (Notification.permission === 'denied') {
      toast('THÔNG BÁO ĐANG BỊ CHẶN — bấm ổ khóa cạnh thanh địa chỉ, mở Thông báo: Cho phép, rồi bật lại trực chiến.');
      alert('Thông báo của trang đang bị CHẶN nên cảnh báo sẽ không nổi lên.' + String.fromCharCode(10,10) + 'Cách mở: bấm biểu tượng Ổ KHÓA cạnh thanh địa chỉ, chọn Thông báo: Cho phép, tải lại trang và bật lại Trực chiến.');
    } else {
      toast('Bạn chưa cho phép thông báo — trực chiến vẫn chạy nhưng chỉ hiện trên bảng, không có cảnh báo nổi.');
    }
    this.list = ws.map(r=>({t:r.t, b:r.b, v20:r.v20||0}));
    this.timer = setInterval(()=>this.tick(), 90000);
    this.paint(); this.tick();
  },
  applyFilter(){
    if (!this.timer) return 0;
    let shown = 0;
    document.querySelectorAll('#view-watch tr.row').forEach(tr=>{
      const t = (tr.dataset && tr.dataset.t) ? tr.dataset.t : (tr.cells[0] ? tr.cells[0].textContent.trim() : '');
      const r = byT[t]; const on = r && r._lv != null && r._lv >= 2;
      tr.style.display = on ? '' : 'none'; if (on) shown++;
    });
    let em = document.getElementById('liveEmpty');
    const tb = document.querySelector('#view-watch table');
    if (!em && tb) { em = document.createElement('div'); em.id='liveEmpty'; em.className='mini'; em.style.padding='16px 4px'; tb.parentNode.appendChild(em); }
    if (em) em.textContent = shown ? '' : 'Chưa mã nào trong vùng theo dõi tăng ≥2% — bảng sẽ tự hiện ngay khi có hàng nóng máy. Máy quét vẫn chạy mỗi 90 giây.';
    return shown;
  },
  notify(key, title, body, repeatMs){ notifyPush(key, title, body, repeatMs); },
  async tick(){
    const st = document.getElementById('liveSt');
    if (!this.inSession()) { if (st) st.textContent = 'Ngoài giờ giao dịch — chờ phiên sau (quét tự động 9:00-11:30, 13:00-14:50).'; return; }
    const now = NOW(); let hot = 0;
    const h = new Date().getHours()+new Date().getMinutes()/60;
    const elapsed = Math.max(0.08, Math.min(1, (h<11.5 ? (h-9) : (h<13 ? 2.5 : 2.5+(h-13))) / 4.33));
    const one = async m => { try {
      const d = await jget(`https://dchart-api.vndirect.com.vn/dchart/history?symbol=${m.t}&resolution=D&from=${now-86400*7}&to=${now}`);
      const c = d.c||[], v = d.v||[]; if (c.length < 2) return;
      const px = c[c.length-1], chg = (px/c[c.length-2]-1)*100;
      const volR = m.v20 ? (v[v.length-1]/elapsed)/m.v20 : 0;
      const rw = byT[m.t]; if (rw) { rw._lv = chg; rw._lvv = volR; }
      const cell = document.getElementById('lv_'+m.t);
      if (cell) { cell.textContent = (chg>=0?'+':'')+chg.toFixed(1)+'%' + (volR>=1.5?' · KL x'+volR.toFixed(1):''); cell.className = chg>=3?'up':(chg<=-2?'down':'mut'); }
      const g = (window.SIGS && window.SIGS.trig && window.SIGS.trig[m.t]) || null;
      if (g && px >= g[2] && m.v20 && (v[v.length-1]/elapsed) >= g[3]) { hot++; this.notify('L2'+m.t, m.t+' '+(chg>=0?'+':'')+chg.toFixed(1)+'% kèm dòng tiền mạnh', 'Tín hiệu MUA có thể kích hoạt cuối phiên — mở dashboard kiểm tra ngay.', 5*60000); }
      else if (chg >= 4) { hot++; this.notify('W4'+m.t, m.t+' +'+chg.toFixed(1)+'% — NÓNG MÁY', 'Mã trong vùng theo dõi đang tăng tốc mạnh. Canh chặt tới cuối phiên.', 10*60000); }
      else if (chg >= 2) { hot++; this.notify('W2'+m.t, m.t+' +'+chg.toFixed(1)+'% — khởi động', 'Mã trong vùng theo dõi bắt đầu chạy. Để mắt.', 15*60000); }
    } catch(e){} };
    for (let i=0;i<this.list.length;i+=6) await Promise.all(this.list.slice(i,i+6).map(one));
    const shown = this.applyFilter();
    if (st) st.textContent = 'Quét lúc ' + new Date().toTimeString().slice(0,5) + ' — đang lọc trực chiến: ' + shown + ' mã tăng ≥2% / ' + this.list.length + ' mã nền' + (hot ? ' · ' + hot + ' mã nóng' : '');
  }
};
async function pushDataToGitHub(){ /* da chuyen sang may phat hanh rieng */ }
async function maybeAutoPublish(){ /* da chuyen sang may phat hanh rieng */ }
try { const _b = document.getElementById('btnRefresh'); if (_b) _b.style.display = 'none'; } catch(e){}

// ================= KHỞI ĐỘNG =================
(async () => { try { await liveQuote(); mergeLiveDeals(); scanNewSignals(); checkWatchAlerts(); } catch(e){} inits.market(); ensureNotifBanner(); ensureFreshBanner(); retroScanSignals();
  maybeAutoPublish();
})();
// Nhip lam moi gia: 15 giay trong gio giao dich, 120 giay ngoai gio.
// Co TU LUI: hong 3 lan lien tiep -> gian nhip (15->30->60->120s); goi lai duoc -> tu ve 15s.
window.__nhipPhat = 0;      // 0 = dung nhip chuan
window.__loiLienTiep = 0;
(function nhipGia(){
  let trongPhien = false;
  try { trongPhien = liveWatch.inSession(); } catch(e){}
  const chuKyChuan = trongPhien ? 15000 : 120000;
  const chuKy = Math.max(chuKyChuan, window.__nhipPhat || 0);
  setTimeout(async () => {
    try {
      const oK = await liveQuote();
      if (oK) {
        window.__loiLienTiep = 0; window.__nhipPhat = 0;
        renderTops(); scanNewSignals(); checkWatchAlerts(); renderRecent(); syncLiveBar();
        try { if (!window.__dHov) updateDPx(null); } catch(e){}
      } else {
        window.__loiLienTiep++;
        if (window.__loiLienTiep >= 3) window.__nhipPhat = Math.min(120000, (window.__nhipPhat || 15000) * 2);
      }
      maybeAutoPublish();
    } catch(e){}
    nhipGia();
  }, chuKy);
})();
// Quay lai tab la cap nhat gia NGAY, khong cho nhip (Chrome dong bang tab nen)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  (async () => {
    try {
      if (await liveQuote()) {
        renderTops(); scanNewSignals(); checkWatchAlerts(); renderRecent(); syncLiveBar();
        try { if (!window.__dHov) updateDPx(null); } catch(e){}
      }
    } catch(e){}
  })();
});

// ================= 9. BAI VIET (tab tin & phan tich — doc ngay trong trang) =================
(function addNewsTab(){
  try{
    const nav = document.querySelector('nav');
    if (!nav || document.getElementById('view-news')) return;
    views.push('news');
    const b = document.createElement('button');
    b.className = 'nav-link'; b.dataset.view = 'news'; b.textContent = 'B\u00e0i vi\u1ebft';
    b.onclick = () => showView('news');
    const first = nav.querySelector('button');
    nav.insertBefore(b, first ? first.nextSibling : null);
    const wrap = document.getElementById('view-market').parentElement;
    const d = document.createElement('div');
    d.id = 'view-news'; d.style.display = 'none';
    const css = '<style>'
      +'#newsBody{font-size:16.5px;line-height:1.66;max-width:820px;margin:0 auto}'
      +'#newsBody h1{font-size:25px;line-height:1.32;margin:6px 0 14px}'
      +'#newsBody h2{font-size:19.5px;margin:30px 0 10px}'
      +'#newsBody .meta{font-size:13px;color:var(--muted);margin:8px 0 10px}'
      +'#newsBody .meta .chip{background:#18a34b;color:#fff;font-weight:700;padding:2px 9px;border-radius:99px;font-size:11.5px;margin-right:8px}'
      +'#newsBody .s60{border:1px solid var(--border);border-left:4px solid #18a34b;background:#fff;border-radius:10px;padding:14px 18px;margin:18px 0}'
      +'#newsBody .s60 .t{font-weight:800;font-size:13px;color:#18a34b;margin-bottom:8px}'
      +'#newsBody .s60 ul{margin:0;padding-left:19px}#newsBody .s60 li{margin:6px 0}'
      +'#newsBody figure{margin:18px 0;border:1px solid var(--border);border-radius:10px;overflow:hidden;background:#fff}'
      +'#newsBody figure svg{width:100%;height:auto;display:block}'
      +'#newsBody figcaption{font-size:12.5px;color:var(--muted);padding:8px 14px;border-top:1px solid var(--border)}'
      +'#newsBody table{width:100%;border-collapse:collapse;background:#fff;font-size:15px;margin:14px 0}'
      +'#newsBody th{background:#18a34b;color:#fff;padding:9px 12px;text-align:left;font-size:13.5px}'
      +'#newsBody td{padding:9px 12px;border-bottom:1px solid var(--border)}'
      +'#newsBody tr.hl td{background:#fef2f2;font-weight:700;border-left:3px solid #dc2626}'
      +'#newsBody .g{color:#18a34b;font-weight:700}#newsBody .r{color:#dc2626;font-weight:700}'
      +'#newsBody .pull{border-left:4px solid #18a34b;background:#f0fdf4;border-radius:0 10px 10px 0;padding:12px 18px;margin:18px 0;font-size:17px;font-weight:600}'
      +'#newsBody .note{font-size:13px;color:var(--muted);font-style:italic}'
      +'#newsBody .cta{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0 8px}'
      +'#newsBody .cta a{text-decoration:none;font-weight:700;font-size:15px;padding:11px 20px;border-radius:10px}'
      +'#newsBody .cta .p{background:#18a34b;color:#fff}#newsBody .cta .s{border:1.5px solid #18a34b;color:#128A3E}'
      +'#newsBody .disc{display:none}#newsBody .cta a[href="https://khoakafi.github.io/"],#newsBody .cta a[href="https://khoanguyeninvest.vn/"]{display:none}'
      +'</style>';
    d.innerHTML = css
      + '<div class="card" style="padding:18px 20px" id="newsListCard">'
      + '<div style="font-size:19px;font-weight:800;margin-bottom:4px">B\u00e0i vi\u1ebft & Ph\u00e2n t\u00edch</div>'
      + '<div class="mini" style="margin-bottom:14px">M\u1ed7i ng\u00e0y m\u1ed9t b\u00e0i m\u1ed5 x\u1ebb t\u1eeb d\u1eef li\u1ec7u h\u1ec7 th\u1ed1ng \u2014 T\u1ed5ng h\u1ee3p phi\u00ean \u00b7 H\u1ecdc trend-following \u00b7 Ph\u00e2n t\u00edch s\u1ef1 ki\u1ec7n</div>'
      + '<div id="newsGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px"></div>'
      + '<div id="newsEmpty" class="mini" style="padding:14px 2px;display:none">Ch\u01b0a c\u00f3 b\u00e0i vi\u1ebft n\u00e0o.</div>'
      + '<div style="margin-top:18px;padding:12px 16px;background:#eef9f1;border:1px solid #bbe6c8;border-radius:10px;font-size:14.5px">\ud83d\udcacvào room Zalo c\u1ee7a Khoa \u0111\u1ec3 nh\u1eadn b\u00e0i s\u1edbm nh\u1ea5t m\u1ed7i ng\u00e0y \u2014 <a href="https://zalo.me/g/ykbtyp974" target="_blank" rel="noopener" style="font-weight:800;color:#128A3E" onclick="try{gtag(String.fromCharCode(101,118,101,110,116),String.fromCharCode(99,116,97,95,122,97,108,111))}catch(e){}">b\u1ea5m v\u00e0o \u0111\u00e2y \u2192</a></div>'
      + '</div>'
      + '<div id="newsReader" style="display:none"><div class="card" style="padding:8px 22px 22px">'
      + '<div style="padding:10px 0 2px"><a href="#" id="newsBack" style="font-size:14px;font-weight:700;color:#128A3E;text-decoration:none" onclick="window.__closeArt();return false">\u2190 T\u1ea5t c\u1ea3 b\u00e0i vi\u1ebft</a></div>'
      + '<div id="newsBody"></div>'
      + '</div></div>';
    const ft = wrap.querySelector('footer');
    wrap.insertBefore(d, ft || null);
    window.__closeArt = function(skipHist){
      document.getElementById('newsReader').style.display = 'none';
      document.getElementById('newsListCard').style.display = '';
      window.scrollTo({top:0});
      if (!skipHist) try{ if (location.pathname.indexOf('/bai-viet/') >= 0) history.replaceState({}, '', '/'); }catch(e){}
    };
    window.addEventListener('popstate', function(){
      const r = document.getElementById('newsReader');
      if (r && r.style.display !== 'none' && location.pathname.indexOf('/bai-viet/') < 0){ window.__closeArt(true); }
    });
    window.__openArt = async function(url, slug){
      try{ url = new URL(url, location.origin + '/').href; }catch(e){}
      try{ ga('view_article', {slug: slug}); }catch(e){}
      const el = document.getElementById('newsBody');
      el.innerHTML = '<div class="mini" style="padding:30px 0">\u0110ang t\u1ea3i b\u00e0i\u2026</div>';
      document.getElementById('newsListCard').style.display = 'none';
      document.getElementById('newsReader').style.display = '';
      window.scrollTo({top:0});
      try{ history.pushState({art:slug}, '', url); }catch(e){}
      try{
        const t = await fetch(url, {cache:'no-store'}).then(r => r.text());
        const doc = new DOMParser().parseFromString(t, 'text/html');
        const m = doc.querySelector('main');
        el.innerHTML = m ? m.innerHTML : 'Kh\u00f4ng t\u1ea3i \u0111\u01b0\u1ee3c b\u00e0i.';
      }catch(e){ el.innerHTML = 'Kh\u00f4ng t\u1ea3i \u0111\u01b0\u1ee3c b\u00e0i \u2014 <a href="'+url+'" target="_blank" rel="noopener">m\u1edf trang b\u00e0i</a>.'; }
    };
    const CATN = {eod:'T\u1ed5ng h\u1ee3p phi\u00ean', hoc:'H\u1ecdc trend-following', nong:'Ph\u00e2n t\u00edch s\u1ef1 ki\u1ec7n'};
    const CATC = {eod:'#2563eb', hoc:'#18a34b', nong:'#18a34b'};
    let loaded = false;
    inits['news'] = async function(){
      if (loaded) return;
      try{
        const idx = await fetch('bai-viet/index.json?_=' + Date.now()).then(r => r.json());
        loaded = true;
        const g = document.getElementById('newsGrid');
        if (!idx.length){ document.getElementById('newsEmpty').style.display = ''; return; }
        g.innerHTML = idx.map(a =>
          '<a href="' + a.url + '" onclick="window.__openArt(' + String.fromCharCode(38,35,51,57,59) + a.url + String.fromCharCode(38,35,51,57,59) + ',' + String.fromCharCode(38,35,51,57,59) + a.slug + String.fromCharCode(38,35,51,57,59) + ');return false" style="text-decoration:none;color:inherit;border:1px solid var(--border);border-radius:12px;overflow:hidden;display:block;background:#fff">'
          + '<img src="' + a.thumb + '" alt="" decoding="async" style="width:100%;aspect-ratio:1200/630;object-fit:cover;display:block;background:#132a44">'
          + '<div style="padding:12px 14px 14px">'
          + '<div style="display:flex;gap:8px;align-items:center;margin-bottom:7px"><span style="font-size:11px;font-weight:700;color:#fff;background:' + (CATC[a.cat] || '#64748b') + ';padding:2px 8px;border-radius:99px">' + (CATN[a.cat] || 'B\u00e0i vi\u1ebft') + '</span><span class="mini">' + a.date + '</span></div>'
          + '<div style="font-weight:800;font-size:15.5px;line-height:1.35;margin-bottom:6px">' + a.title + '</div>'
          + '<div class="mini" style="line-height:1.5">' + a.summary + '</div>'
          + '</div></a>').join('');
      }catch(e){ const ne = document.getElementById('newsEmpty'); if (ne) ne.style.display = ''; }
    };
  }catch(e){}
})();
})();


/* [UI] 20260729c — ghim name tag + nut Zalo o day man hinh */
function pinNameBar(){
  var f=document.querySelector('footer'); if(!f) return false;
  var rows=[].slice.call(f.querySelectorAll('div')).filter(function(d){
    return d.textContent.indexOf('Gi\u00e1m \u0111\u1ed1c')>-1 && d.textContent.indexOf('KAFI')>-1 && d.children.length<8;});
  var row=rows[rows.length-1]; if(!row) return false;
  var bar=document.getElementById('nameBar');
  if(!bar){bar=document.createElement('div'); bar.id='nameBar'; document.body.appendChild(bar);}
  if(row.parentElement!==bar){ bar.innerHTML=''; bar.appendChild(row); }
  if(!bar.querySelector('a.nbz')){
    var z=document.createElement('a');
    z.className='nbz'; z.target='_blank'; z.rel='noopener';
    z.href='https://zalo.me/g/ykbtyp974';
    z.textContent='T\u01b0 v\u1ea5n qua Zalo \u2192';
    z.addEventListener('click',function(){try{gtag('event','cta_zalo',{from:'namebar'})}catch(e){}});
    bar.appendChild(z);
  }
  return true;
}
(function(){
  function tick(){ var n=0; var t=setInterval(function(){ if(pinNameBar()||++n>80) clearInterval(t); },250); }
  function watch(){ try{ var f=document.querySelector('footer'); if(f) new MutationObserver(function(){ pinNameBar(); }).observe(f,{childList:true,subtree:true}); }catch(e){} }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',function(){ tick(); watch(); }); }
  else { tick(); watch(); }
})();

/* [UI] 20260729d — deep link ?art= : link chia se mo trong dashboard */
(function(){
 var m=location.search.match(/[?&]art=([^&]+)/); if(!m) return;
 var slug=decodeURIComponent(m[1]);
 function goNews(){
  var els=[].slice.call(document.querySelectorAll('a,button,div,span'));
  for(var i=0;i<els.length;i++){ if(els[i].children.length===0 && els[i].textContent.trim()==='B\u00e0i vi\u1ebft'){ els[i].click(); return true; } }
  return false;
 }
 function run(){
  var n=0;
  var t=setInterval(function(){
   n++;
   if(typeof window.__openArt!=='function'){ if(n>160) clearInterval(t); return; }
   clearInterval(t); goNews();
   fetch('bai-viet/index.json?cb='+Date.now(),{cache:'no-store'}).then(function(r){return r.json();}).then(function(j){
    var arr=Array.isArray(j)?j:(j.items||j.articles||[]); var it=null;
    for(var i=0;i<arr.length;i++){ if(arr[i].slug===slug){ it=arr[i]; break; } }
    if(!it) return;
    setTimeout(function(){ try{ window.__openArt(it.url); }catch(e){} },450);
   }).catch(function(){});
  },250);
 }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
