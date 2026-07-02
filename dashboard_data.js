// ---------------------------------------------------------------
// 1. DANH SÁCH 100 MÃ VN100 (mã : tên công ty)
// ---------------------------------------------------------------
const VN100 = [
["AAA","Nhựa An Phát Xanh"],["ACB","NH TMCP Á Châu"],["AGG","Đầu tư PT BĐS An Gia"],
["ANV","Nam Việt"],["ASM","Tập đoàn Sao Mai"],["BCG","Tập đoàn Bamboo Capital"],
["BCM","Đầu tư PT Công nghiệp"],["BID","NH TMCP Đầu tư & PT VN (BIDV)"],["BMP","Nhựa Bình Minh"],
["BSI","Chứng khoán BIDV"],["BVH","Tập đoàn Bảo Việt"],["BWE","Nước - Môi trường Bình Dương"],
["CII","Đầu tư Hạ tầng Kỹ thuật TPHCM"],["CMG","Tập đoàn Công nghệ CMC"],["CRE","BĐS Thế Kỷ"],
["CTD","Xây dựng Coteccons"],["CTG","NH TMCP Công Thương (VietinBank)"],["CTR","Công trình Viettel"],
["DBC","Tập đoàn Dabaco"],["DCM","Phân bón Dầu khí Cà Mau"],["DGC","Hóa chất Đức Giang"],
["DGW","Thế Giới Số (Digiworld)"],["DHC","Đông Hải Bến Tre"],["DIG","Đầu tư PT Xây dựng DIC"],
["DPM","Phân bón Dầu khí (Đạm Phú Mỹ)"],["DXG","Tập đoàn Đất Xanh"],["DXS","DV BĐS Đất Xanh"],
["EIB","NH TMCP Xuất Nhập Khẩu (Eximbank)"],["FPT","Tập đoàn FPT"],["FRT","Bán lẻ KTS FPT (FPT Retail)"],
["FTS","Chứng khoán FPT"],["GAS","Tổng công ty Khí Việt Nam (PV GAS)"],["GEG","Điện Gia Lai"],
["GEX","Tập đoàn GELEX"],["GMD","Gemadept"],["GVR","Tập đoàn Cao su Việt Nam"],
["HCM","Chứng khoán TPHCM"],["HDB","NH TMCP Phát triển TPHCM (HDBank)"],["HDC","PT Nhà Bà Rịa Vũng Tàu"],
["HDG","Tập đoàn Hà Đô"],["HHV","Hạ tầng Giao thông Đèo Cả"],["HPG","Tập đoàn Hòa Phát"],
["HSG","Tập đoàn Hoa Sen"],["HT1","Xi măng Vicem Hà Tiên"],["IMP","Dược phẩm Imexpharm"],
["KBC","PT Đô thị Kinh Bắc"],["KDC","Tập đoàn Kido"],["KDH","Đầu tư KD Nhà Khang Điền"],
["KOS","Kosy"],["LPB","NH TMCP Bưu điện Liên Việt (LPBank)"],["MBB","NH TMCP Quân Đội"],
["MSB","NH TMCP Hàng Hải"],["MSN","Tập đoàn Masan"],["MWG","Đầu tư Thế Giới Di Động"],
["NKG","Thép Nam Kim"],["NLG","Đầu tư Nam Long"],["NT2","Điện lực Dầu khí Nhơn Trạch 2"],
["NVL","Tập đoàn Đầu tư Địa ốc No Va (Novaland)"],["OCB","NH TMCP Phương Đông"],["PAN","Tập đoàn PAN"],
["PC1","Tập đoàn PC1"],["PDR","PT BĐS Phát Đạt"],["PHR","Cao su Phước Hòa"],
["PLX","Tập đoàn Xăng dầu Việt Nam (Petrolimex)"],["PNJ","Vàng bạc Đá quý Phú Nhuận"],["POW","Điện lực Dầu khí VN (PV Power)"],
["PPC","Nhiệt điện Phả Lại"],["PTB","Phú Tài"],["PVD","PV Drilling"],
["PVT","Vận tải Dầu khí (PVTrans)"],["REE","Cơ Điện Lạnh"],["SAB","Sabeco"],
["SAM","SAM Holdings"],["SBT","Thành Thành Công - Biên Hòa"],["SCR","Địa ốc Sài Gòn Thương Tín"],
["SCS","DV Hàng hóa Sài Gòn (SCSC)"],["SHB","NH TMCP Sài Gòn - Hà Nội"],["SJS","PT Đô thị & KCN Sông Đà"],
["SSB","NH TMCP Đông Nam Á (SeABank)"],["SSI","Chứng khoán SSI"],["STB","NH TMCP Sài Gòn Thương Tín (Sacombank)"],
["SZC","Sonadezi Châu Đức"],["TCB","NH TMCP Kỹ Thương (Techcombank)"],["TCH","Đầu tư DV Tài chính Hoàng Huy"],
["TMS","Transimex"],["TPB","NH TMCP Tiên Phong (TPBank)"],["VCB","NH TMCP Ngoại Thương (Vietcombank)"],
["VCG","Vinaconex"],["VCI","Chứng khoán Vietcap"],["VHC","Vĩnh Hoàn"],
["VHM","Vinhomes"],["VIB","NH TMCP Quốc Tế"],["VIC","Tập đoàn Vingroup"],
["VIX","Chứng khoán VIX"],["VJC","Vietjet Air"],["VND","Chứng khoán VNDirect"],
["VNM","Vinamilk"],["VPB","NH TMCP Việt Nam Thịnh Vượng (VPBank)"],["VPI","Đầu tư Văn Phú - Invest"],
["VRE","Vincom Retail"],["VSH","Thủy điện Vĩnh Sơn - Sông Hinh"]
];

// ---------------------------------------------------------------
// 2. TOP MÃ ĐÃ NGHIÊN CỨU CANSLIM + CATALYST (dựa trên báo cáo CTCK, tháng 6-7/2026)
// ---------------------------------------------------------------
const TOP_ANALYSIS = {
"HPG": {
  verdict:"buy", target:"Mirae Asset kỳ vọng tăng giá mạnh",
  canslim:{
    C:"LNST quý 1/2026 đạt 8.994 tỷ đồng, +169% svck nhờ mảng thép cốt lõi và lợi nhuận một lần từ chuyển nhượng dự án Phố Nối.",
    A:"Đà tăng trưởng lợi nhuận nhiều quý liên tiếp nhờ chu kỳ giá thép hồi phục; dự phóng LNST Q2/2026 đạt 5.056 tỷ đồng (+19% svck).",
    N:"Giá HRC được điều chỉnh tăng 0%/+5%/+15% trong T4/T5/T6 so với đỉnh T3/2026 - tín hiệu chu kỳ giá mới; công suất vận hành gần tối đa (~1,2 triệu tấn/tháng).",
    S:"Cổ phiếu vốn hóa lớn, thanh khoản top đầu VN100, thuộc rổ VN30.",
    L:"Doanh nghiệp đầu ngành thép Việt Nam, dẫn dắt nhóm vật liệu xây dựng.",
    I:"Được nhiều CTCK lớn (Mirae Asset, SSI, VNDirect) duy trì khuyến nghị theo dõi/mua.",
    M:"Hưởng lợi trực tiếp từ chu kỳ giá thép tăng và giải ngân đầu tư công/hạ tầng."
  },
  catalysts:[
    "Giá thép HRC tăng liên tục 3 tháng (T4-T6/2026), kỳ vọng biên lợi nhuận mảng thép mở rộng trong Q2-Q3/2026.",
    "Doanh thu mảng thép Q2/2026 dự phóng 57.400 tỷ đồng (+71% svck), lợi nhuận hoạt động thép ước 5.900 tỷ đồng (+47% svck).",
    "Lợi nhuận một lần từ chuyển nhượng dự án Phố Nối đã ghi nhận trong Q1/2026, hỗ trợ định giá lại cổ phiếu."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"SSI", rating:"Mua", target:"36.000", upside:"+27,7%"},
    {ctck:"Vietcap (VCSC)", rating:"Mua", target:"35.300", upside:"—"},
    {ctck:"Agriseco", rating:"Mua", target:"32.000", upside:"+21%"}
  ]
},
"VNM": {
  verdict:"buy", target:"Mirae Asset: doanh thu 2026F 66.193 tỷ đồng (+3,9% svck), LNST 9.500 tỷ đồng",
  canslim:{
    C:"Q1/2026: doanh thu +24,6% svck, LNST +54,9% svck nhờ tái cấu trúc kênh phân phối.",
    A:"Tăng trưởng lợi nhuận cải thiện rõ rệt so với các năm trước sau tái cấu trúc.",
    N:"Sản phẩm tái tung giúp tăng giá bán nội địa; doanh thu nước ngoài kỳ vọng +10% năm 2026.",
    S:"Vốn hóa lớn, thanh khoản ổn định, thuộc VN30.",
    L:"Doanh nghiệp sữa số 1 Việt Nam, dẫn dắt ngành hàng tiêu dùng thiết yếu.",
    I:"Được khối phân tích các CTCK lớn theo dõi sát, nằm trong danh mục khuyến nghị trung dài hạn của Mirae Asset.",
    M:"Nhóm tiêu dùng phòng thủ, ít nhạy cảm với biến động vĩ mô ngắn hạn."
  },
  catalysts:[
    "Kết quả tái cấu trúc kênh phân phối bắt đầu phản ánh vào KQKD Q1/2026 tích cực.",
    "Chiến lược tái tung sản phẩm giúp cải thiện giá bán bình quân trong nước.",
    "Giả định giá sữa bột đầu vào ổn định quanh 2.600 USD/tấn giúp kiểm soát chi phí."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"ACBS", rating:"Mua", target:"72.000", upside:"+25,5%"},
    {ctck:"SSI", rating:"Trung lập", target:"67.500", upside:"—"}
  ]
},
"MWG": {
  verdict:"buy", target:"LNST ròng dự báo CAGR 18,1% giai đoạn 2026-2028F",
  canslim:{
    C:"Doanh thu và LNST 2026F dự báo tăng lần lượt 18,3% và 20,8% svck.",
    A:"CAGR lợi nhuận ròng 18,1% trong 3 năm 2026-2028F, xu hướng cải thiện liên tục.",
    N:"Tiếp tục xu hướng tái cấu trúc chuỗi bán lẻ, tối ưu hiệu quả vận hành.",
    S:"Vốn hóa lớn, thanh khoản cao, thuộc VN30.",
    L:"Doanh nghiệp bán lẻ ICT/điện máy số 1 Việt Nam.",
    I:"Nằm trong danh mục khuyến nghị của Mirae Asset nhóm bán lẻ - dịch vụ.",
    M:"Ngành bán lẻ hưởng lợi khi sức mua tiêu dùng nội địa phục hồi."
  },
  catalysts:[
    "Biên lợi nhuận cải thiện nhờ tối ưu chi phí vận hành chuỗi cửa hàng.",
    "Kế hoạch tăng trưởng doanh nghiệp 2026 (+18%/+30% DT/LN) cho thấy kỳ vọng nội bộ tích cực dù ước tính CTCK thận trọng hơn."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"SSI", rating:"Mua", target:"97.700", upside:"+22%"},
    {ctck:"VNDirect", rating:"Giữ nguyên GMT", target:"108.100", upside:"—"}
  ]
},
"VCB": {
  verdict:"watch", target:"Nhóm ngân hàng - nền tảng tài sản vững chắc",
  canslim:{
    C:"Quy mô tài sản và tín dụng tăng trưởng đồng đều; tỷ lệ nợ xấu Q1/2026 chỉ 0,6% - thấp nhất hệ thống.",
    A:"Tăng trưởng lợi nhuận ổn định qua các năm, chất lượng tài sản đầu ngành.",
    N:"Duy trì vị thế cho vay ròng lớn trên thị trường liên ngân hàng.",
    S:"Vốn hóa lớn nhất ngành ngân hàng, thanh khoản cao.",
    L:"Ngân hàng quốc doanh dẫn đầu về chất lượng tài sản và an toàn vốn.",
    I:"Cổ phiếu nền tảng (core holding) được nhiều quỹ lớn nắm giữ dài hạn.",
    M:"Nhóm ngân hàng hưởng lợi khi tăng trưởng tín dụng toàn ngành phục hồi 2026."
  },
  catalysts:[
    "Tỷ lệ nợ xấu thấp nhất ngành (0,6%) giúp giảm áp lực trích lập dự phòng.",
    "Vị thế dẫn đầu về vốn hóa giúp VCB thường là lựa chọn phòng thủ khi thị trường biến động."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"SSI", rating:"Mua", target:"84.900", upside:"—"},
    {ctck:"Vietcap (VCSC)", rating:"Mua", target:"73.500", upside:"—"},
    {ctck:"BVSC", rating:"Mua", target:"87.000", upside:"—"}
  ]
},
"VPB": {
  verdict:"buy", target:"Mirae Asset dự phóng LNTT 2026 đạt 37.300 tỷ đồng",
  canslim:{
    C:"Tăng trưởng tín dụng Q1/2026 đạt 10,2%, cao hơn mặt bằng chung ngành.",
    A:"TTTD cả năm ước +25%, vượt trội so với ngành; LNTT 2026F 37.300 tỷ đồng.",
    N:"Kế hoạch phát hành riêng lẻ (private placement) là động lực tăng vốn mới.",
    S:"Thanh khoản cao, nằm trong VN30.",
    L:"Một trong những NHTM tư nhân tăng trưởng nhanh nhất, dẫn đầu nhóm bán lẻ - tài chính tiêu dùng.",
    I:"Được Mirae Asset đưa vào danh mục khuyến nghị trung - dài hạn tháng 7/2026.",
    M:"Nhóm ngân hàng bán lẻ hưởng lợi khi cho vay KHCN khởi sắc trở lại."
  },
  catalysts:[
    "Kế hoạch phát hành riêng lẻ có thể là catalyst tăng vốn và định giá lại.",
    "NIM dự phóng ổn định quanh 5,5% năm 2026 trước khi bình thường hóa dần về 5,1% trong dài hạn - cần theo dõi cạnh tranh ngành.",
    "Tăng trưởng cho vay KHCN kỳ vọng khởi sắc hơn so với cho vay doanh nghiệp."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"VPBankS", rating:"Mua", target:"42.800", upside:"—"},
    {ctck:"KBSV", rating:"Mua", target:"38.000", upside:"—"},
    {ctck:"HSC", rating:"Mua", target:"36.800", upside:"+39%"},
    {ctck:"BSC", rating:"Mua", target:"36.500", upside:"—"}
  ]
},
"HDB": {
  verdict:"watch", target:"MASVN - danh mục khuyến nghị tháng 7/2026",
  canslim:{
    C:"Thuộc nhóm ngân hàng được MASVN đưa vào danh mục khuyến nghị tháng 7/2026 nhờ nền tảng cơ bản ổn định.",
    A:"Tăng trưởng lợi nhuận ổn định trong nhóm ngân hàng TMCP tư nhân tầm trung.",
    N:"Chiến lược bán lẻ và tài chính nông thôn tiếp tục mở rộng.",
    S:"Thanh khoản khá, thuộc VN30.",
    L:"Một trong các ngân hàng TMCP có tốc độ tăng trưởng khá trong nhóm midcap.",
    I:"Được MASVN đưa vào rổ khuyến nghị cùng nhóm VCB, VPB, EIB, STB.",
    M:"Hưởng lợi chung xu hướng phục hồi tín dụng ngành ngân hàng 2026."
  },
  catalysts:[
    "Nằm trong danh mục 10 cổ phiếu khuyến nghị trung-dài hạn của Mirae Asset công bố cuối tháng 6/2026.",
    "Cần theo dõi thêm báo cáo KQKD Q2/2026 để xác nhận catalyst cụ thể hơn."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"SSI", rating:"Mua", target:"35.000", upside:"+37,3%"},
    {ctck:"HSC", rating:"Khả quan", target:"33.000", upside:"—"},
    {ctck:"Mirae Asset", rating:"Mua", target:"32.000", upside:"+21%"},
    {ctck:"FPTS", rating:"Mua", target:"32.550", upside:"—"},
    {ctck:"ACBS / SHS", rating:"Khả quan", target:"30.000", upside:"—"}
  ]
},
"EIB": {
  verdict:"watch", target:"MASVN - danh mục khuyến nghị tháng 7/2026",
  canslim:{
    C:"Nằm trong nhóm ngân hàng được MASVN khuyến nghị tháng 7/2026.",
    A:"Đang trong giai đoạn tái cấu trúc, cần theo dõi thêm tăng trưởng lợi nhuận các quý tới.",
    N:"Thay đổi cơ cấu cổ đông/quản trị gần đây là yếu tố cần theo dõi.",
    S:"Thanh khoản trung bình so với nhóm ngân hàng lớn.",
    L:"Chưa phải nhóm dẫn đầu ngành nhưng có định giá hấp dẫn theo đánh giá của MASVN.",
    I:"Được đưa vào danh mục khuyến nghị cùng VCB, VPB, HDB, STB.",
    M:"Phụ thuộc nhiều vào xu hướng chung ngành ngân hàng và tiến độ tái cơ cấu nội bộ."
  },
  catalysts:[
    "Định giá được xem là hấp dẫn hơn tương quan so với nhóm ngân hàng cùng quy mô.",
    "Cần theo dõi sát diễn biến tái cấu trúc và KQKD Q2/2026 để xác nhận xu hướng."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"Mirae Asset (MASVN)", rating:"Tăng tỷ trọng", target:"26.000", upside:"—"}
  ]
},
"STB": {
  verdict:"watch", target:"MASVN - danh mục khuyến nghị tháng 7/2026",
  canslim:{
    C:"Được MASVN đưa vào danh mục khuyến nghị tháng 7/2026 nhóm ngân hàng.",
    A:"Kỳ vọng lợi nhuận cải thiện khi hoàn tất xử lý tài sản tồn đọng (VAMC).",
    N:"Tiến độ xử lý nợ xấu/tài sản tồn đọng là câu chuyện tái cơ cấu dài hạn.",
    S:"Thanh khoản tốt trong nhóm ngân hàng tầm trung.",
    L:"Một trong nhóm ngân hàng tái cơ cấu được thị trường theo dõi sát nhiều năm.",
    I:"Được nhiều CTCK và nhà đầu tư tổ chức theo dõi do câu chuyện tái cơ cấu.",
    M:"Nhạy cảm với thông tin liên quan đến kế hoạch chia cổ tức/tái cơ cấu."
  },
  catalysts:[
    "Kỳ vọng hoàn tất xử lý tài sản tồn đọng có thể mở khóa lợi nhuận tích lũy nhiều năm.",
    "Là một trong các mã ngân hàng được MASVN chọn cho danh mục nửa cuối 2026."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"VPBankS", rating:"Khác/Tham chiếu", target:"63.200", upside:"—"},
    {ctck:"Vietcap (VCSC)", rating:"Nắm giữ (hạ từ Khả quan)", target:"58.300", upside:"—"},
    {ctck:"MBS", rating:"Trung lập", target:"58.800", upside:"—"}
  ]
},
"CTR": {
  verdict:"buy", target:"Mirae Asset - triển vọng xây lắp & năng lượng mặt trời áp mái",
  canslim:{
    C:"Tăng trưởng nhờ hai mảng chính: xây lắp hạ tầng viễn thông và năng lượng mặt trời áp mái.",
    A:"Xu hướng tăng trưởng ổn định nhiều năm nhờ mở rộng hạ tầng viễn thông/dữ liệu.",
    N:"Mảng năng lượng mặt trời áp mái là động lực tăng trưởng mới, hưởng lợi xu hướng chuyển dịch năng lượng.",
    S:"Vốn hóa vừa, thanh khoản khá trong nhóm VN100.",
    L:"Công ty con Viettel dẫn đầu mảng xây lắp hạ tầng viễn thông tại Việt Nam.",
    I:"Được Mirae Asset đưa vào danh mục khuyến nghị nhóm sản xuất - dịch vụ.",
    M:"Hưởng lợi từ xu hướng đầu tư hạ tầng số và năng lượng tái tạo quốc gia."
  },
  catalysts:[
    "Mảng năng lượng mặt trời áp mái mở ra dư địa tăng trưởng doanh thu mới ngoài mảng xây lắp truyền thống.",
    "Hưởng lợi gián tiếp từ đà mở rộng hạ tầng viễn thông/dữ liệu của Viettel."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"Vietcap (VCSC)", rating:"Mua", target:"137.700", upside:"—"},
    {ctck:"MBS", rating:"Khả quan (Mua)", target:"119.900", upside:"—"},
    {ctck:"HSC", rating:"Tăng tỷ trọng", target:"99.000", upside:"+17%"},
    {ctck:"Agriseco", rating:"Nắm giữ", target:"98.000", upside:"—"},
    {ctck:"SSI", rating:"Trung lập", target:"96.000", upside:"+10%"},
    {ctck:"BSC", rating:"Theo dõi (Trung lập)", target:"93.800", upside:"+11%"}
  ]
},
"GVR": {
  verdict:"buy", target:"Mirae Asset dự phóng LNST 2026 đạt 6.870 tỷ đồng (+22% svck)",
  canslim:{
    C:"LNST 2026F dự phóng tăng 22% svck nhờ thanh lý cây cao su và mảng cao su cốt lõi.",
    A:"Doanh thu mảng cao su cốt lõi dự kiến đạt 26.851 tỷ đồng, tăng ổn định.",
    N:"Giá dầu Brent tăng kéo giá cao su tổng hợp đi lên, cải thiện cạnh tranh cao su tự nhiên; giá bán bình quân 2026F kỳ vọng cao hơn 10% svck.",
    S:"Vốn hóa lớn trong nhóm nguyên vật liệu, thuộc VN30.",
    L:"Tập đoàn cao su nhà nước lớn nhất Việt Nam, sở hữu quỹ đất công nghiệp lớn.",
    I:"Nằm trong danh mục khuyến nghị của Mirae Asset nhóm sản xuất tháng 7/2026.",
    M:"Hưởng lợi kép từ chu kỳ giá cao su và câu chuyện chuyển đổi đất cao su sang KCN."
  },
  catalysts:[
    "Giá dầu Brent neo cao kéo theo giá cao su tổng hợp tăng, hỗ trợ giá bán cao su tự nhiên của GVR.",
    "Sản lượng tiêu thụ cao su ước tăng 4% svck nhờ nhu cầu duy trì tích cực.",
    "Thu nhập từ thanh lý cây cao su tiếp tục đóng góp lợi nhuận đột biến."
  ],
  sources:[["CafeF - CTCK chỉ ra 10 doanh nghiệp tiềm năng nửa cuối 2026","https://cafef.vn/ctck-chi-ra-10-doanh-nghiep-co-nen-tang-co-ban-va-tiem-nang-tang-truong-tot-phu-hop-xuong-tien-nua-cuoi-2026-188260627223528475.chn"]],
  valuations:[
    {ctck:"KBSV", rating:"Trung lập", target:"37.500", upside:"—"},
    {ctck:"SSI", rating:"Trung lập (hạ từ Mua)", target:"36.200", upside:"—"},
    {ctck:"MBS", rating:"Trung lập", target:"36.100", upside:"—"},
    {ctck:"Vietcap (VCSC)", rating:"Phù hợp thị trường", target:"31.200", upside:"—"}
  ]
},
"FPT": {
  verdict:"buy", target:"BVSC: giá mục tiêu 94.500 đồng/cp",
  canslim:{
    C:"Tăng trưởng lợi nhuận đều đặn hai chữ số nhiều quý liên tiếp, chủ yếu từ mảng CNTT nước ngoài (xuất khẩu phần mềm).",
    A:"Xu hướng tăng trưởng lợi nhuận dài hạn ổn định nhất nhóm công nghệ VN100.",
    N:"Đẩy mạnh mảng AI, chuyển đổi số và mở rộng thị trường Nhật Bản/APAC - câu chuyện tăng trưởng mới.",
    S:"Thanh khoản cao, vốn hóa lớn, thuộc VN30.",
    L:"Doanh nghiệp công nghệ dẫn đầu Việt Nam, không có đối thủ tương đương về quy mô xuất khẩu phần mềm.",
    I:"Được nhiều CTCK lớn (BVSC, MBS, SSI) duy trì khuyến nghị khả quan/mua.",
    M:"Hưởng lợi từ xu hướng toàn cầu về chuyển đổi số và đầu tư AI."
  },
  catalysts:[
    "BVSC đưa ra giá mục tiêu 94.500 đồng/cp, phản ánh kỳ vọng tăng trưởng doanh thu ký mới mảng CNTT nước ngoài.",
    "MBS duy trì khuyến nghị khả quan nhờ biên lợi nhuận mảng phần mềm cải thiện.",
    "Câu chuyện đầu tư hạ tầng AI (trung tâm dữ liệu, GPU) là catalyst trung hạn."
  ],
  sources:[["Tin nhanh Chứng khoán - MBS khuyến nghị khả quan FPT","https://m.tinnhanhchungkhoan.vn/bcpt/mbs-khuyen-nghi-kha-quan-danh-cho-co-phieu-fpt-4604.html"],["Bnews - Khuyến nghị cổ phiếu FPT, GMD","https://bnews.vn/khuyen-nghi-co-phieu-fpt-gmd-va-trien-vong-nhom-ban-le-2026/426737.html"]],
  valuations:[
    {ctck:"SSI", rating:"Khả quan", target:"153.100", upside:"+12,3%"},
    {ctck:"BVSC", rating:"Mua", target:"94.500", upside:"—"},
    {ctck:"MBS", rating:"Khả quan (Mua)", target:"Chưa nêu cụ thể", upside:"—"},
    {ctck:"CTCK khác (chưa xác định rõ)", rating:"Nâng lên Khả quan", target:"142.800", upside:"—"}
  ]
},
"MBB": {
  verdict:"buy", target:"HSC nâng giá mục tiêu lên 30.400 đồng/cp (khuyến nghị Mua)",
  canslim:{
    C:"HSC nâng khuyến nghị lên Mua trên cơ sở định giá hấp dẫn; Yuanta duy trì Mua với giá mục tiêu 29.500 đồng/cp.",
    A:"Tăng trưởng tín dụng và lợi nhuận thuộc nhóm ổn định trong ngành ngân hàng tư nhân.",
    N:"Định giá về vùng hấp dẫn sau nhịp điều chỉnh, tạo điểm mua tích lũy theo đánh giá HSC.",
    S:"Thanh khoản cao, thuộc VN30.",
    L:"Một trong những NHTM tư nhân có chất lượng tài sản và hiệu quả sinh lời (ROE) tốt nhất ngành.",
    I:"Được cả HSC và Yuanta đồng thuận khuyến nghị Mua trong các báo cáo gần nhất.",
    M:"Hưởng lợi khi mặt bằng lãi suất và tăng trưởng tín dụng ngành ngân hàng cải thiện."
  },
  catalysts:[
    "HSC nâng khuyến nghị từ Nắm giữ lên Mua, nâng giá mục tiêu thêm 2,7% lên 30.400 đồng/cp.",
    "Yuanta duy trì Mua với giá mục tiêu 29.500 đồng/cp, đồng thuận về định giá hấp dẫn.",
    "Định giá P/B hiện tại được đánh giá thấp hơn trung bình lịch sử của nhóm ngân hàng tư nhân top đầu."
  ],
  sources:[["Đầu tư Cổ phiếu - HSC nâng khuyến nghị MBB lên Mua","https://dautucophieu.net/cap-nhat-co-phieu-mbb-nang-khuyen-nghi-len-mua-vao-tren-co-so-dinh-gia-hap-dan/"]],
  valuations:[
    {ctck:"HSC", rating:"Mua", target:"30.400", upside:"—"},
    {ctck:"Yuanta", rating:"Mua", target:"29.500", upside:"—"}
  ]
},
"VHM": {
  verdict:"watch", target:"HSC nâng giá mục tiêu +33% lên 163.400 đồng/cp (Nắm giữ); MBS đánh giá tích cực",
  canslim:{
    C:"Hoạt động bán buôn (bulk sale) khởi sắc giúp HSC nâng dự báo lợi nhuận và giá mục tiêu.",
    A:"KQKD cải thiện theo từng quý nhờ đẩy nhanh bàn giao và bán buôn dự án lớn.",
    N:"Dòng tiền khối ngoại quay lại mua ròng mạnh nhóm Vingroup cuối tháng 6/2026 (VHM +380 tỷ đồng phiên 26/6).",
    S:"Vốn hóa lớn nhất nhóm bất động sản, thanh khoản cao, thuộc VN30.",
    L:"Doanh nghiệp bất động sản dân dụng lớn nhất Việt Nam.",
    I:"Được khối ngoại mua ròng trở lại sau giai đoạn bán ròng - tín hiệu dòng tiền tổ chức cải thiện.",
    M:"Định giá P/B ~1,5x, thấp hơn trung bình 5 năm - MBS đánh giá vùng giá hấp dẫn để tích lũy."
  },
  catalysts:[
    "Khối ngoại mua ròng khoảng 380 tỷ đồng cổ phiếu VHM trong phiên 26/6/2026, là điểm sáng dòng tiền cuối tháng 6.",
    "HSC nâng giá mục tiêu thêm 33% lên 163.400 đồng/cp theo phương pháp SoTP nhờ hoạt động bán buôn khởi sắc.",
    "MBS đánh giá định giá hấp dẫn khi P/B ~1,5x, thấp hơn trung bình 5 năm."
  ],
  sources:[["Vietstock - Dòng tiền cá mập 26/06: Khối ngoại mua ròng mạnh cổ phiếu họ Vingroup","https://vietstock.vn/2026/06/theo-dau-dong-tien-ca-map-2606-khoi-ngoai-mua-rong-manh-co-phieu-ho-vingroup-830-1459394.htm"],["Đầu tư Cổ phiếu - Cập nhật VHM, HSC nâng giá mục tiêu","https://dautucophieu.net/cap-nhat-co-phieu-vhm-hoat-dong-ban-buon-khoi-sac-nang-du-bao-loi-nhuan-va-gia-muc-tieu/"]],
  valuations:[
    {ctck:"HSC", rating:"Nắm giữ", target:"163.400", upside:"+33% (điều chỉnh GMT)"},
    {ctck:"Vietcap (VCSC)", rating:"Phù hợp thị trường (hạ từ Mua)", target:"153.700", upside:"+25% (điều chỉnh GMT)"},
    {ctck:"MBS", rating:"Khả quan", target:"123.200", upside:"—"},
    {ctck:"SSI", rating:"Khả quan", target:"69.400", upside:"—"},
    {ctck:"VNDirect", rating:"Trung lập", target:"65.000", upside:"+10,4%"}
  ]
},
"VIC": {
  verdict:"watch", target:"Hưởng lợi dòng tiền khối ngoại nhóm Vingroup",
  canslim:{
    C:"Nhóm Vingroup (VIC/VHM/VRE) được khối ngoại mua ròng mạnh trở lại cuối tháng 6/2026.",
    A:"Đóng góp lợi nhuận đa dạng từ các mảng BĐS, công nghiệp - công nghệ (VinFast, Vinhomes...).",
    N:"Câu chuyện mở rộng hệ sinh thái công nghiệp - xe điện tiếp tục là động lực dài hạn.",
    S:"Vốn hóa lớn nhất thị trường, thanh khoản rất cao, thuộc VN30.",
    L:"Tập đoàn tư nhân đa ngành lớn nhất Việt Nam.",
    I:"Khối ngoại mua ròng ~120 tỷ đồng phiên 26/6/2026, ~1.100 tỷ đồng trong tuần 22-26/6/2026.",
    M:"Tâm điểm dòng tiền thị trường khi nhóm vốn hóa lớn dẫn dắt chỉ số."
  },
  catalysts:[
    "Khối ngoại mua ròng hơn 1.100 tỷ đồng cổ phiếu nhóm Vingroup trong tuần 22-26/6/2026.",
    "Là điểm sáng hiếm hoi khi khối ngoại toàn thị trường vẫn đang bán ròng chung."
  ],
  sources:[["Thương hiệu Công luận - Khối ngoại thu hẹp bán ròng, gom mạnh VIC","https://thuonghieucongluan.com.vn/khoi-ngoai-thu-hep-ban-rong-bat-ngo-gom-manh-co-phieu-vic-a324288.html"],["Tin nhanh Chứng khoán - GD khối ngoại tuần 22-26/6","https://www.tinnhanhchungkhoan.vn/giao-dich-chung-khoan-khoi-ngoai-tuan-22-266-mua-rong-hon-1100-ty-dong-mot-co-phieu-lon-post393031.html"]],
  valuations:[
    {ctck:"SSI", rating:"Trung lập", target:"65.000", upside:"+10,4%"},
    {ctck:"Vietcap (VCSC)", rating:"Bán", target:"Đã hạ 3% (chưa rõ số tuyệt đối)", upside:"—"}
  ]
},
"ANV": {
  verdict:"buy", target:"VDSC: 26.000 đồng/cp (+26%) | HSC: 31.100 đồng/cp (+39%)",
  canslim:{
    C:"LNST Q2/2026 đạt 408 tỷ đồng, +23% svck nhờ sản lượng tiêu thụ cá tra & cá rô phi tích cực.",
    A:"Tăng trưởng lợi nhuận cải thiện rõ so với giai đoạn khó khăn trước đó của ngành thủy sản.",
    N:"Mảng cá rô phi là động lực tăng trưởng mới bên cạnh cá tra truyền thống.",
    S:"Vốn hóa vừa, thanh khoản trung bình trong nhóm thủy sản VN100.",
    L:"Một trong các doanh nghiệp xuất khẩu cá tra hàng đầu Việt Nam.",
    I:"Được cả VDSC và HSC đồng thuận khuyến nghị Mua.",
    M:"Ngành thủy sản hưởng lợi khi nhu cầu xuất khẩu phục hồi và giá bán cải thiện."
  },
  catalysts:[
    "LNST quý 2/2026 tăng 23% svck lên 408 tỷ đồng nhờ sản lượng tiêu thụ tích cực.",
    "VDSC đặt giá mục tiêu 26.000 đồng/cp, tổng mức sinh lời kỳ vọng 26%.",
    "HSC duy trì khuyến nghị Mua với giá mục tiêu 31.100 đồng/cp, tiềm năng tăng giá ~39% nhờ tăng trưởng kép cá tra và cá rô phi."
  ],
  sources:[["Elibook - ANV: LNST quý 2 đạt 408 tỷ đồng, tăng 23% svck","https://elibook.vn/2026/07/01/anv-loi-nhuan-sau-thue-quy-2-dat-408-ty-dong-tang-23-so-voi-cung-ky-nho-san-luong-tieu-thu-ca-tra-va-ca-ro-phi-tich-cuc.html/"]],
  valuations:[
    {ctck:"VDSC", rating:"Mua", target:"26.000", upside:"+26%"},
    {ctck:"HSC", rating:"Mua", target:"31.100", upside:"+39%"}
  ]
}
};

// ---------------------------------------------------------------
// DỮ LIỆU CƠ BẢN THEO QUÝ (Doanh thu / LNST / %YoY / P/E / P/B)
// Nguồn: KAFI X (nền tảng giao dịch, dữ liệu FiinTrade/FiinGroup) — mục
// "Phân tích tài chính > Chỉ số Tài Chính" của từng mã (bảng theo quý) và mục
// "Báo cáo Doanh nghiệp" (P/E hiện tại, real-time theo giá khớp lệnh mới nhất),
// người dùng tự truy cập bằng tài khoản KAFI cá nhân.
// currentPE: lấy trực tiếp từ ô "P/E (lần)" ở tab "Báo cáo Doanh nghiệp" —
// đây là P/E thực tính theo giá thị trường hiện tại (không phải P/E cuối quý).
// currentPB: KAFI không hiển thị P/B real-time riêng biệt (kể cả với NH và
// phi NH) nên lấy P/B của quý gần nhất có dữ liệu trong bảng "quarters" bên
// dưới — có thể lệch nhẹ so với P/B tức thời nếu giá đã biến động từ cuối quý.
// Ghi chú: các ngân hàng (VCB, VPB, HDB, EIB, STB) không có P/B ở bất kỳ đâu
// trong KAFI/FiinTrade (kể cả bảng quý lẫn tab tổng quan) — hiển thị null/--
// (chỉ MBB trong nhóm NH có đủ P/E, P/B theo quý). "revenue" với ngân hàng là
// Thu nhập lãi thuần (không hoàn toàn tương đương doanh thu của DN phi tài
// chính). Một số quý cũ nhất không có số liệu do nguồn chưa công bố.
// currentROE: ROE (TTM, real-time) lấy từ ô "ROE (%)" ở tab "Báo cáo Doanh
// nghiệp" — có ở TẤT CẢ các mã kể cả ngân hàng (khác với P/B). roe (theo quý,
// trong "quarters"): lấy từ bảng "Chỉ số Tài Chính" tab "Phân tích tài chính"
// — CHỈ có với DN phi ngân hàng (bảng ratio của NH dùng NIM/LDR/Nợ xấu thay
// vì ROE/ROIC/ROA nên không có ROE theo quý cho nhóm NH).
// QUAN TRỌNG: tính đến 02/07/2026, bảng "Chỉ số Tài Chính" (ratio theo quý)
// của KAFI/FiinTrade CHƯA cập nhật cột Q1/2026 cho bất kỳ mã nào đã kiểm tra
// (HPG, VNM, STB...) — dữ liệu Q1/2026 mới nhất trong "quarters" bên dưới
// (khi có) được lấy từ nguồn khác (báo cáo tài chính thô/tin tức), không phải
// từ bảng ratio này. Đây là giới hạn của nguồn dữ liệu, không phải do dashboard
// bỏ sót — nhiều mã VN100 sẽ chưa có dòng Q1/2026 cho đến khi FiinTrade cập nhật.
// Cập nhật currentPE/currentROE lần gần nhất: 02/07/2026 18:20-18:40 (giờ hệ thống).
// ---------------------------------------------------------------
const FUNDAMENTALS = {
  HPG: {
    currentPE: 9.32, currentPB: 1.42, currentROE: 16.39,
    quarters: [
      {quarter:"Q2/2023",revenue:29799.50,profit:1460.04,yoyRevenue:-20.99,yoyProfit:-63.79,pe:-71.16,pb:1.39,roe:-1.97},
      {quarter:"Q3/2023",revenue:28765.72,profit:2004.75,yoyRevenue:-16.48,yoyProfit:213.00,pe:87.03,pb:1.63,roe:1.92},
      {quarter:"Q4/2023",revenue:34924.57,profit:2972.78,yoyRevenue:33.24,yoyProfit:249.27,pe:24.29,pb:1.62,roe:6.88},
      {quarter:"Q1/2024",revenue:31092.57,profit:2870.59,yoyRevenue:15.73,yoyProfit:622.17,pe:19.17,pb:1.69,roe:9.17},
      {quarter:"Q2/2024",revenue:39936.27,profit:3319.26,yoyRevenue:34.02,yoyProfit:127.34,pe:15.46,pb:1.59,roe:10.72},
      {quarter:"Q3/2024",revenue:34300.35,profit:3022.95,yoyRevenue:19.24,yoyProfit:50.79,pe:13.94,pb:1.52,roe:11.38},
      {quarter:"Q4/2024",revenue:35232.20,profit:2808.65,yoyRevenue:0.88,yoyProfit:-5.52,pe:13.57,pb:1.43,roe:11.07},
      {quarter:"Q1/2025",revenue:37950.64,profit:3344.28,yoyRevenue:22.06,yoyProfit:16.50,pe:15.60,pb:1.66,roe:11.05},
      {quarter:"Q2/2025",revenue:36286.19,profit:4256.49,yoyRevenue:-9.14,yoyProfit:28.24,pe:15.57,pb:1.72,roe:11.55},
      {quarter:"Q3/2025",revenue:36793.87,profit:3988.32,yoyRevenue:7.27,yoyProfit:31.93,pe:14.29,pb:1.64,roe:12.02},
      {quarter:"Q4/2025",revenue:47301.62,profit:3864.08,yoyRevenue:34.26,yoyProfit:37.58,pe:13.78,pb:1.65,roe:12.69},
      {quarter:"Q1/2026",revenue:53312.91,profit:8994.00,yoyRevenue:40.48,yoyProfit:168.94,pe:9.38,pb:1.42,roe:null}
    ]
  },
  VNM: {
    currentPE: 11.15, currentPB: 4.15, currentROE: 31.74,
    quarters: [
      {quarter:"Q2/2023",revenue:15212.94,profit:2198.81,yoyRevenue:1.69,yoyProfit:5.56,pe:17.18,pb:4.22,roe:null},
      {quarter:"Q3/2023",revenue:15681.49,profit:2492.25,yoyRevenue:-2.56,yoyProfit:8.43,pe:16.61,pb:4.56,roe:null},
      {quarter:"Q4/2023",revenue:15630.46,profit:2326.01,yoyRevenue:3.65,yoyProfit:24.44,pe:15.31,pb:4.29,roe:29.31},
      {quarter:"Q1/2024",revenue:14124.89,profit:2194.67,yoyRevenue:1.22,yoyProfit:18.20,pe:15.25,pb:4.41,roe:28.86},
      {quarter:"Q2/2024",revenue:16665.24,profit:2670.48,yoyRevenue:9.55,yoyProfit:21.45,pe:14.31,pb:4.03,roe:30.13},
      {quarter:"Q3/2024",revenue:15548.71,profit:2403.52,yoyRevenue:-0.85,yoyProfit:-3.56,pe:13.55,pb:4.14,roe:29.69},
      {quarter:"Q4/2024",revenue:15485.05,profit:2123.65,yoyRevenue:-0.93,yoyProfit:-8.70,pe:12.82,pb:3.73,roe:29.36},
      {quarter:"Q1/2025",revenue:12965.40,profit:1568.48,yoyRevenue:-8.21,yoyProfit:-28.53,pe:15.00,pb:3.90,roe:26.63},
      {quarter:"Q2/2025",revenue:16744.61,profit:2474.59,yoyRevenue:0.48,yoyProfit:-7.34,pe:13.92,pb:3.76,roe:26.55},
      {quarter:"Q3/2025",revenue:16968.08,profit:2526.77,yoyRevenue:9.13,yoyProfit:5.13,pe:16.97,pb:4.33,roe:26.37},
      {quarter:"Q4/2025",revenue:17045.42,profit:2840.37,yoyRevenue:10.08,yoyProfit:33.75,pe:13.53,pb:4.15,roe:29.89},
      {quarter:"Q1/2026",revenue:16147,profit:2429,yoyRevenue:25,yoyProfit:55,pe:null,pb:null,roe:null}
    ]
  },
  MWG: {
    currentPE: 14.07, currentPB: 3.86, currentROE: 25.44,
    quarters: [
      {quarter:"Q2/2023",revenue:29725.05,profit:17.41,yoyRevenue:-14.34,yoyProfit:-98.46,pe:37.90,pb:2.55,roe:null},
      {quarter:"Q3/2023",revenue:30520.84,profit:38.74,yoyRevenue:-5.57,yoyProfit:-95.73,pe:95.39,pb:2.85,roe:null},
      {quarter:"Q4/2023",revenue:31653.21,profit:90.26,yoyRevenue:2.51,yoyProfit:-85.42,pe:479.11,pb:3.44,roe:null},
      {quarter:"Q1/2024",revenue:31685.02,profit:902.44,yoyRevenue:15.91,yoyProfit:4143.38,pe:86.50,pb:3.59,roe:null},
      {quarter:"Q2/2024",revenue:34384.59,profit:1172.28,yoyRevenue:15.68,yoyProfit:6635.03,pe:44.13,pb:3.72,roe:8.99},
      {quarter:"Q3/2024",revenue:34361.57,profit:800.15,yoyRevenue:12.58,yoyProfit:1965.48,pe:29.20,pb:3.21,roe:11.67},
      {quarter:"Q4/2024",revenue:34793.92,profit:847.00,yoyRevenue:9.92,yoyProfit:838.43,pe:23.47,pb:3.18,roe:14.57},
      {quarter:"Q1/2025",revenue:36332.91,profit:1545.94,yoyRevenue:14.67,yoyProfit:71.31,pe:22.39,pb:3.36,roe:15.86},
      {quarter:"Q2/2025",revenue:37844.16,profit:1648.15,yoyRevenue:10.06,yoyProfit:40.59,pe:25.57,pb:4.21,roe:17.04},
      {quarter:"Q3/2025",revenue:40091.34,profit:1770.90,yoyRevenue:16.67,yoyProfit:121.32,pe:23.48,pb:4.34,roe:19.68},
      {quarter:"Q4/2025",revenue:42567.70,profit:2068.75,yoyRevenue:22.34,yoyProfit:144.24,pe:17.93,pb:3.86,roe:23.31},
      {quarter:"Q1/2026",revenue:46709.16,profit:2714.43,yoyRevenue:28.56,yoyProfit:75.58,pe:14.41,pb:3.33,roe:25.44}
    ]
  },
  AAA: {
    currentPE: 5.91, currentPB: 0.53, currentROE: 8.86,
    quarters: [
      {quarter:"Q4/2023",revenue:2687.15,profit:93.77,yoyRevenue:-21.33,yoyProfit:195.95,pe:12.92,pb:0.70,roe:5.69},
      {quarter:"Q1/2024",revenue:2964.88,profit:134.71,yoyRevenue:-18.04,yoyProfit:149.94,pe:12.09,pb:0.82,roe:6.70},
      {quarter:"Q2/2024",revenue:2784.04,profit:135.89,yoyRevenue:-0.29,yoyProfit:221.44,pe:7.37,pb:0.61,roe:8.40},
      {quarter:"Q3/2024",revenue:3194.72,profit:21.80,yoyRevenue:-9.53,yoyProfit:-77.99,pe:8.28,pb:0.63,roe:7.20},
      {quarter:"Q4/2024",revenue:3844.07,profit:76.19,yoyRevenue:43.05,yoyProfit:-18.75,pe:7.23,pb:0.50,roe:6.78},
      {quarter:"Q1/2025",revenue:3857.62,profit:45.24,yoyRevenue:30.11,yoyProfit:-66.42,pe:11.42,pb:0.59,roe:5.23},
      {quarter:"Q2/2025",revenue:2310.91,profit:131.69,yoyRevenue:-16.99,yoyProfit:-3.09,pe:11.24,pb:0.60,roe:5.23},
      {quarter:"Q3/2025",revenue:2371.76,profit:117.55,yoyRevenue:-25.76,yoyProfit:439.25,pe:8.07,pb:0.57,roe:6.94},
      {quarter:"Q4/2025",revenue:2193.50,profit:78.43,yoyRevenue:-42.94,yoyProfit:2.94,pe:7.57,pb:0.53,roe:6.90}
    ]
  },
  ACB: {
    currentPE: 8.08, currentPB: null, currentROE: 17.50,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:7111.51,profit:4468.59,yoyRevenue:13.86,yoyProfit:15.59},
      {quarter:"Q3/2024",revenue:6881.39,profit:3870.40,yoyRevenue:10.83,yoyProfit:-4.14},
      {quarter:"Q4/2024",revenue:7080.29,profit:4545.36,yoyRevenue:12.57,yoyProfit:13.46},
      {quarter:"Q1/2025",revenue:6358.87,profit:3678.27,yoyRevenue:-5.40,yoyProfit:-5.82},
      {quarter:"Q2/2025",revenue:6683.85,profit:4881.16,yoyRevenue:-6.01,yoyProfit:9.23},
      {quarter:"Q3/2025",revenue:6769.71,profit:4280.59,yoyRevenue:-1.62,yoyProfit:10.60},
      {quarter:"Q4/2025",revenue:7093.27,profit:2784.69,yoyRevenue:0.18,yoyProfit:-38.74}
    ]
  },
  AGG: {
    currentPE: 5.11, currentPB: 0.58, currentROE: 11.00,
    quarters: [
      {quarter:"Q2/2024",revenue:169.04,profit:25.46,yoyRevenue:-89.92,yoyProfit:-66.67,pe:7.43,pb:0.82,roe:11.26},
      {quarter:"Q3/2024",revenue:268.37,profit:24.29,yoyRevenue:-85.48,yoyProfit:-54.76,pe:8.26,pb:0.81,roe:9.80},
      {quarter:"Q4/2024",revenue:163.20,profit:47.46,yoyRevenue:-7.57,yoyProfit:16.75,pe:8.03,pb:0.80,roe:10.09},
      {quarter:"Q1/2025",revenue:191.77,profit:10.27,yoyRevenue:-85.39,yoyProfit:-94.87,pe:28.51,pb:1.01,roe:3.50},
      {quarter:"Q2/2025",revenue:193.91,profit:80.60,yoyRevenue:14.71,yoyProfit:216.59,pe:15.76,pb:0.80,roe:5.21},
      {quarter:"Q3/2025",revenue:170.37,profit:109.00,yoyRevenue:-36.52,yoyProfit:348.67,pe:9.68,pb:0.72,roe:7.75},
      {quarter:"Q4/2025",revenue:273.04,profit:179.33,yoyRevenue:67.31,yoyProfit:277.87,pe:5.40,pb:0.58,roe:11.47}
    ]
  },
  ASM: {
    currentPE: 22.94, currentPB: 0.42, currentROE: 1.94,
    quarters: [
      {quarter:"Q2/2024",revenue:3379.24,profit:88.44,yoyRevenue:3.76,yoyProfit:10.25,pe:15.67,pb:0.61,roe:3.93},
      {quarter:"Q3/2024",revenue:3223.26,profit:49.35,yoyRevenue:12.05,yoyProfit:8.84,pe:13.77,pb:0.54,roe:3.96},
      {quarter:"Q4/2024",revenue:2867.15,profit:-15.41,yoyRevenue:2.80,yoyProfit:-198.80,pe:13.71,pb:0.46,roe:3.39},
      {quarter:"Q1/2025",revenue:2719.88,profit:15.87,yoyRevenue:6.57,yoyProfit:-72.86,pe:21.90,pb:0.56,roe:2.55},
      {quarter:"Q2/2025",revenue:3359.89,profit:17.73,yoyRevenue:-0.57,yoyProfit:-79.95,pe:42.50,pb:0.53,roe:1.24},
      {quarter:"Q3/2025",revenue:2632.87,profit:11.41,yoyRevenue:-18.32,yoyProfit:-76.88,pe:86.94,pb:0.47,roe:0.54},
      {quarter:"Q4/2025",revenue:2627.67,profit:-7.30,yoyRevenue:-8.35,yoyProfit:52.62,pe:60.79,pb:0.42,roe:0.69}
    ]
  },
  BCG: {
    currentPE: 4.76, currentPB: 0.22, currentROE: 4.81,
    warning:"Cổ phiếu đang trong Nhóm Bị tạm ngừng giao dịch (cảnh báo từ Sở) theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:1165.21,profit:131.91,yoyRevenue:1.15,yoyProfit:9.20,pe:45.30,pb:0.57,roe:1.15},
      {quarter:"Q3/2024",revenue:1170.77,profit:131.53,yoyRevenue:12.50,yoyProfit:2210.31,pe:18.97,pb:0.52,roe:2.56},
      {quarter:"Q4/2024",revenue:1395.85,profit:126.94,yoyRevenue:16.78,yoyProfit:296.91,pe:4.76,pb:0.22,roe:4.81}
    ]
  },
  BCM: {
    currentPE: 15.91, currentPB: 2.50, currentROE: 15.64,
    quarters: [
      {quarter:"Q2/2024",revenue:1158.88,profit:273.36,yoyRevenue:5.39,yoyProfit:235.65,pe:25.45,pb:3.60,roe:14.63},
      {quarter:"Q3/2024",revenue:1241.33,profit:344.39,yoyRevenue:8.59,yoyProfit:58.44,pe:25.74,pb:3.75,roe:14.91},
      {quarter:"Q4/2024",revenue:2101.42,profit:1451.22,yoyRevenue:-59.35,yoyProfit:-29.24,pe:26.41,pb:2.95,roe:11.47},
      {quarter:"Q1/2025",revenue:1847.32,profit:358.27,yoyRevenue:127.54,yoyProfit:203.32,pe:29.04,pb:3.53,roe:12.53},
      {quarter:"Q2/2025",revenue:2919.63,profit:1475.64,yoyRevenue:151.94,yoyProfit:439.82,pe:19.02,pb:3.27,roe:18.19},
      {quarter:"Q3/2025",revenue:828.74,profit:415.68,yoyRevenue:-33.24,yoyProfit:20.70,pe:19.05,pb:3.28,roe:18.02},
      {quarter:"Q4/2025",revenue:1376.78,profit:1238.88,yoyRevenue:-34.48,yoyProfit:-14.63,pe:15.73,pb:2.42,roe:16.53},
      {quarter:"Q1/2026",revenue:1106.20,profit:279.56,yoyRevenue:-40.12,yoyProfit:-21.97,pe:16.03,pb:2.50,roe:15.64}
    ]
  },
  BID: {
    currentPE: 9.65, currentPB: null, currentROE: 18.35,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:14837.76,profit:6365.95,yoyRevenue:9.53,yoyProfit:17.32},
      {quarter:"Q3/2024",revenue:13989.72,profit:5151.32,yoyRevenue:1.50,yoyProfit:12.40},
      {quarter:"Q4/2024",revenue:15638.73,profit:7810.12,yoyRevenue:5.18,yoyProfit:28.58},
      {quarter:"Q1/2025",revenue:13945.58,profit:5840.37,yoyRevenue:2.99,yoyProfit:0.48},
      {quarter:"Q2/2025",revenue:14991.73,profit:6755.00,yoyRevenue:1.04,yoyProfit:6.11},
      {quarter:"Q3/2025",revenue:15172.62,profit:5952.96,yoyRevenue:8.46,yoyProfit:15.56},
      {quarter:"Q4/2025",revenue:19185.17,profit:11355.93,yoyRevenue:22.68,yoyProfit:45.40},
      {quarter:"Q1/2026",revenue:15733.74,profit:6800.83,yoyRevenue:12.82,yoyProfit:16.45}
    ]
  },
  BMP: {
    currentPE: 10.05, currentPB: 3.93, currentROE: 41.51,
    quarters: [
      {quarter:"Q2/2024",revenue:1167.49,profit:280.30,yoyRevenue:-13.36,yoyProfit:-4.86,pe:10.93,pb:3.86,roe:33.47},
      {quarter:"Q3/2024",revenue:1422.52,profit:289.63,yoyRevenue:51.99,yoyProfit:38.72,pe:10.08,pb:3.49,roe:36.44},
      {quarter:"Q4/2024",revenue:1070.62,profit:230.96,yoyRevenue:-27.00,yoyProfit:-10.09,pe:11.15,pb:4.09,roe:36.75},
      {quarter:"Q1/2025",revenue:1408.31,profit:286.91,yoyRevenue:38.34,yoyProfit:51.10,pe:10.82,pb:3.94,roe:38.57},
      {quarter:"Q2/2025",revenue:1333.36,profit:329.90,yoyRevenue:14.21,yoyProfit:17.70,pe:10.18,pb:4.14,roe:39.81},
      {quarter:"Q3/2025",revenue:1554.12,profit:350.58,yoyRevenue:9.25,yoyProfit:21.04,pe:11.85,pb:4.51,roe:41.19},
      {quarter:"Q4/2025",revenue:1306.01,profit:261.34,yoyRevenue:21.99,yoyProfit:13.16,pe:9.87,pb:4.21,roe:44.05},
      {quarter:"Q1/2026",revenue:1484.52,profit:303.96,yoyRevenue:5.41,yoyProfit:5.94,pe:10.05,pb:3.93,roe:41.51}
    ]
  },
  BSI: {
    currentPE: 19.38, currentPB: null, currentROE: 9.20,
    quarters: [
      {quarter:"Q1/2024",revenue:351.75,profit:137.15,yoyRevenue:22.49,yoyProfit:40.39,pe:23.62,pb:2.20,roe:9.59},
      {quarter:"Q2/2024",revenue:424.15,profit:114.78,yoyRevenue:34.07,yoyProfit:-7.13,pe:26.19,pb:2.35,roe:9.24},
      {quarter:"Q3/2024",revenue:319.11,profit:70.01,yoyRevenue:-17.33,yoyProfit:-42.94,pe:25.51,pb:1.98,roe:7.97},
      {quarter:"Q4/2024",revenue:318.51,profit:91.15,yoyRevenue:18.21,yoyProfit:41.58,pe:26.78,pb:2.19,roe:8.48},
      {quarter:"Q1/2025",revenue:337.18,profit:81.12,yoyRevenue:-4.14,yoyProfit:-40.86,pe:31.06,pb:2.16,roe:7.11},
      {quarter:"Q2/2025",revenue:506.43,profit:101.90,yoyRevenue:19.40,yoyProfit:-11.22,pe:30.76,pb:2.03,roe:6.75},
      {quarter:"Q3/2025",revenue:687.92,profit:215.59,yoyRevenue:115.57,yoyProfit:207.95,pe:20.04,pb:1.81,roe:9.40},
      {quarter:"Q4/2025",revenue:565.65,profit:95.06,yoyRevenue:77.60,yoyProfit:4.29,pe:18.22,pb:1.63,roe:9.32}
    ]
  },
  BVH: {
    currentPE: 16.09, currentPB: null, currentROE: 12.05,
    quarters: [
      {quarter:"Q2/2024",revenue:10708.09,profit:427.83,yoyRevenue:1.61,yoyProfit:6.36,pe:17.66,pb:1.43,roe:8.29},
      {quarter:"Q3/2024",revenue:10473.58,profit:535.59,yoyRevenue:0.79,yoyProfit:23.50,pe:19.72,pb:1.65,roe:8.65},
      {quarter:"Q4/2024",revenue:11165.34,profit:561.30,yoyRevenue:0.46,yoyProfit:56.52,pe:16.16,pb:1.51,roe:9.60},
      {quarter:"Q1/2025",revenue:10675.75,profit:671.88,yoyRevenue:3.42,yoyProfit:14.70,pe:16.55,pb:1.57,roe:9.72},
      {quarter:"Q2/2025",revenue:11364.91,profit:664.55,yoyRevenue:6.13,yoyProfit:55.33,pe:15.44,pb:1.58,roe:10.53},
      {quarter:"Q3/2025",revenue:10448.27,profit:759.33,yoyRevenue:-0.24,yoyProfit:41.78,pe:19.51,pb:2.11,roe:11.28},
      {quarter:"Q4/2025",revenue:11239.42,profit:728.83,yoyRevenue:0.66,yoyProfit:29.85,pe:18.45,pb:2.14,roe:12.06}
    ]
  },
  BWE: {
    currentPE: 9.36, currentPB: 1.60, currentROE: 18.19,
    quarters: [
      {quarter:"Q2/2024",revenue:1034.30,profit:135.72,yoyRevenue:17.95,yoyProfit:-35.07,pe:15.44,pb:1.96,roe:13.17},
      {quarter:"Q3/2024",revenue:942.46,profit:182.09,yoyRevenue:12.13,yoyProfit:2.89,pe:16.11,pb:1.99,roe:12.91},
      {quarter:"Q4/2024",revenue:1190.54,profit:141.94,yoyRevenue:5.55,yoyProfit:-1.98,pe:16.18,pb:1.94,roe:12.60},
      {quarter:"Q1/2025",revenue:923.93,profit:147.57,yoyRevenue:16.70,yoyProfit:-17.64,pe:17.15,pb:2.04,roe:11.77},
      {quarter:"Q2/2025",revenue:1325.15,profit:302.58,yoyRevenue:28.12,yoyProfit:122.95,pe:13.66,pb:1.96,roe:14.73},
      {quarter:"Q3/2025",revenue:903.42,profit:264.37,yoyRevenue:-4.14,yoyProfit:45.19,pe:11.63,pb:1.75,roe:15.91},
      {quarter:"Q4/2025",revenue:1390.37,profit:276.52,yoyRevenue:16.79,yoyProfit:94.81,pe:9.65,pb:1.60,roe:17.52}
    ]
  },
  CII: {
    currentPE: 87.06, currentPB: 1.45, currentROE: 1.43,
    quarters: [
      {quarter:"Q2/2024",revenue:748.32,profit:-1.83,yoyRevenue:-13.88,yoyProfit:-105.06,pe:11.57,pb:0.79,roe:6.56},
      {quarter:"Q3/2024",revenue:732.21,profit:5.95,yoyRevenue:-3.81,yoyProfit:-72.33,pe:10.86,pb:0.69,roe:6.24},
      {quarter:"Q4/2024",revenue:798.30,profit:-11.70,yoyRevenue:3.69,yoyProfit:-109.53,pe:19.04,pb:1.20,roe:4.17},
      {quarter:"Q1/2025",revenue:721.29,profit:18.07,yoyRevenue:-20.18,yoyProfit:-93.28,pe:393.59,pb:1.16,roe:0.24},
      {quarter:"Q2/2025",revenue:756.87,profit:28.74,yoyRevenue:1.14,yoyProfit:1673.53,pe:317.13,pb:1.90,roe:0.54},
      {quarter:"Q3/2025",revenue:740.10,profit:11.06,yoyRevenue:1.08,yoyProfit:85.87,pe:230.73,pb:1.30,roe:0.55},
      {quarter:"Q4/2025",revenue:844.96,profit:66.19,yoyRevenue:5.84,yoyProfit:665.75,pe:95.87,pb:1.45,roe:1.66}
    ]
  },
  CMG: {
    currentPE: 15.83, currentPB: 2.03, currentROE: 12.85,
    quarters: [
      {quarter:"Q2/2024",revenue:1793.66,profit:83.23,yoyRevenue:1.19,yoyProfit:-0.82,pe:30.89,pb:3.69,roe:12.32},
      {quarter:"Q3/2024",revenue:2188.05,profit:58.87,yoyRevenue:22.53,yoyProfit:-12.82,pe:30.40,pb:3.65,roe:12.24},
      {quarter:"Q4/2024",revenue:2305.75,profit:126.57,yoyRevenue:8.88,yoyProfit:-2.70,pe:21.28,pb:2.33},
      {quarter:"Q1/2025",revenue:1917.77,profit:79.97,yoyRevenue:14.97,yoyProfit:45.42,pe:23.91,pb:2.85,roe:12.43},
      {quarter:"Q2/2025",revenue:2210.10,profit:94.15,yoyRevenue:23.22,yoyProfit:13.13,pe:24.29,pb:2.89,roe:12.48},
      {quarter:"Q3/2025",revenue:2420.13,profit:89.99,yoyRevenue:10.61,yoyProfit:52.86,pe:22.09,pb:2.82,roe:13.18},
      {quarter:"Q4/2025",revenue:2563.14,profit:134.50,yoyRevenue:11.16,yoyProfit:6.27,pe:16.36,pb:2.03}
    ]
  },
  CRE: {
    currentPE: 36.94, currentPB: 0.62, currentROE: 1.56,
    quarters: [
      {quarter:"Q2/2024",revenue:333.18,profit:7.69,yoyRevenue:-20.02,yoyProfit:-19.92,pe:196.22,pb:0.58,roe:0.30},
      {quarter:"Q3/2024",revenue:328.01,profit:14.25,yoyRevenue:98.94,yoyProfit:17395.16,pe:103.67,pb:0.57,roe:0.55},
      {quarter:"Q4/2024",revenue:383.16,profit:10.35,yoyRevenue:13.36,yoyProfit:952.12,pe:81.11,pb:0.59,roe:0.75},
      {quarter:"Q1/2025",revenue:154.34,profit:3.01,yoyRevenue:-68.74,yoyProfit:-61.23,pe:115.07,pb:0.72,roe:0.63},
      {quarter:"Q2/2025",revenue:349.78,profit:39.46,yoyRevenue:4.98,yoyProfit:412.86,pe:64.64,pb:0.77,roe:1.19},
      {quarter:"Q3/2025",revenue:334.24,profit:23.10,yoyRevenue:1.90,yoyProfit:62.11,pe:45.20,pb:0.60,roe:1.34},
      {quarter:"Q4/2025",revenue:485.13,profit:7.73,yoyRevenue:26.61,yoyProfit:-25.26,pe:47.25,pb:0.62,roe:1.33}
    ]
  },
  CTD: {
    currentPE: 9.58, currentPB: 1.04, currentROE: 9.09,
    quarters: [
      {quarter:"Q2/2024",revenue:6595.44,profit:68.96,yoyRevenue:82.38,yoyProfit:128.84,pe:21.54,pb:0.78,roe:3.66},
      {quarter:"Q3/2024",revenue:4758.91,profit:92.92,yoyRevenue:15.40,yoyProfit:39.46,pe:21.76,pb:0.84,roe:3.93},
      {quarter:"Q4/2024",revenue:6885.67,profit:104.60,yoyRevenue:21.66,yoyProfit:51.41,pe:21.76,pb:0.93,roe:4.33},
      {quarter:"Q1/2025",revenue:5002.82,profit:57.13,yoyRevenue:7.22,yoyProfit:-45.53,pe:25.05,pb:0.94,roe:3.73},
      {quarter:"Q2/2025",revenue:8237.24,profit:201.53,yoyRevenue:24.89,yoyProfit:192.23,pe:21.91,pb:1.13,roe:5.20},
      {quarter:"Q3/2025",revenue:7451.78,profit:294.81,yoyRevenue:56.59,yoyProfit:217.27,pe:12.30,pb:0.88,roe:7.38},
      {quarter:"Q4/2025",revenue:10007.27,profit:227.84,yoyRevenue:45.33,yoyProfit:117.83,pe:12.40,pb:1.04}
    ]
  },
  CTG: {
    currentPE: 7.01, currentPB: null, currentROE: 21.86,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:15338.89,profit:5365.30,yoyRevenue:20.23,yoyProfit:3.11},
      {quarter:"Q3/2024",revenue:15577.51,profit:5225.86,yoyRevenue:19.03,yoyProfit:35.28},
      {quarter:"Q4/2024",revenue:16312.16,profit:9798.25,yoyRevenue:11.94,yoyProfit:60.12},
      {quarter:"Q1/2025",revenue:15475.22,profit:5418.88,yoyRevenue:1.98,yoyProfit:9.28},
      {quarter:"Q2/2025",revenue:15842.62,profit:9669.89,yoyRevenue:3.28,yoyProfit:80.23},
      {quarter:"Q3/2025",revenue:17175.72,profit:8448.78,yoyRevenue:10.26,yoyProfit:61.67},
      {quarter:"Q4/2025",revenue:17959.70,profit:11066.94,yoyRevenue:10.10,yoyProfit:12.95}
    ]
  },
  DBC: {
    currentPE: 5.81, currentPB: 1.08, currentROE: 17.15,
    quarters: [
      {quarter:"Q2/2024",revenue:3192.52,profit:145.44,yoyRevenue:-7.33,yoyProfit:-55.50,pe:34.40,pb:2.12,roe:5.00},
      {quarter:"Q3/2024",revenue:3678.76,profit:312.17,yoyRevenue:30.12,yoyProfit:2404.64,pe:12.32,pb:1.30,roe:10.31},
      {quarter:"Q4/2024",revenue:3386.26,profit:238.87,yoyRevenue:22.77,yoyProfit:3602.23,pe:10.05,pb:1.35,roe:13.46},
      {quarter:"Q1/2025",revenue:3749.98,profit:508.26,yoyRevenue:12.16,yoyProfit:600.01,pe:9.15,pb:1.66,roe:18.97},
      {quarter:"Q2/2025",revenue:3848.33,profit:506.97,yoyRevenue:20.54,yoyProfit:248.59,pe:6.49,pb:1.36,roe:22.29},
      {quarter:"Q3/2025",revenue:5021.58,profit:342.96,yoyRevenue:36.50,yoyProfit:9.86,pe:6.81,pb:1.37,roe:21.66},
      {quarter:"Q4/2025",revenue:2350.51,profit:148.58,yoyRevenue:-30.59,yoyProfit:-37.80,pe:5.77,pb:1.08,roe:20.32}
    ]
  },
  DCM: {
    currentPE: 8.06, currentPB: 2.05, currentROE: 21.73,
    quarters: [
      {quarter:"Q2/2024",revenue:4005.54,profit:584.46,yoyRevenue:15.89,yoyProfit:87.65,pe:12.94,pb:1.98,roe:15.15},
      {quarter:"Q3/2024",revenue:2664.46,profit:120.37,yoyRevenue:-15.43,yoyProfit:-25.22,pe:11.49,pb:1.80,roe:15.50},
      {quarter:"Q4/2024",revenue:4387.44,profit:368.82,yoyRevenue:24.91,yoyProfit:63.31,pe:11.73,pb:1.64,roe:14.14},
      {quarter:"Q1/2025",revenue:3572.12,profit:411.42,yoyRevenue:23.81,yoyProfit:18.91,pe:14.08,pb:1.99,roe:14.74},
      {quarter:"Q2/2025",revenue:6252.27,profit:786.12,yoyRevenue:56.09,yoyProfit:34.50,pe:10.92,pb:1.80,roe:16.55},
      {quarter:"Q3/2025",revenue:3096.35,profit:327.69,yoyRevenue:16.21,yoyProfit:172.24,pe:10.34,pb:1.86,roe:18.29},
      {quarter:"Q4/2025",revenue:4302.32,profit:434.58,yoyRevenue:-1.94,yoyProfit:17.83,pe:11.25,pb:2.05,roe:18.65}
    ]
  },
  DGC: {
    currentPE: 6.93, currentPB: 1.32, currentROE: 17.23,
    warning:"Cổ phiếu đang trong Nhóm Hạn chế giao dịch theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:2506.02,profit:860.74,yoyRevenue:3.36,yoyProfit:2.38,pe:14.24,pb:3.29,roe:24.64},
      {quarter:"Q3/2024",revenue:2559.43,profit:705.98,yoyRevenue:3.86,yoyProfit:-7.27,pe:13.99,pb:3.01,roe:23.41},
      {quarter:"Q4/2024",revenue:2419.38,profit:747.31,yoyRevenue:1.27,yoyProfit:3.86,pe:11.08,pb:2.48,roe:23.83},
      {quarter:"Q1/2025",revenue:2811.40,profit:809.33,yoyRevenue:17.84,yoyProfit:20.33,pe:12.41,pb:2.77,roe:23.08},
      {quarter:"Q2/2025",revenue:2895.50,profit:842.25,yoyRevenue:15.54,yoyProfit:-2.15,pe:11.13,pb:2.33,roe:22.21},
      {quarter:"Q3/2025",revenue:2818.11,profit:751.64,yoyRevenue:10.11,yoyProfit:6.47,pe:8.27,pb:1.67,roe:21.82},
      {quarter:"Q4/2025",revenue:2742.03,profit:587.17,yoyRevenue:13.34,yoyProfit:-21.43,pe:6.57,pb:1.32,roe:21.29}
    ]
  },
  DGW: {
    currentPE: 13.76, currentPB: 2.87, currentROE: 19.15,
    warning:"Cổ phiếu đang trong Nhóm Hạn chế giao dịch theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:5063.71,profit:89.06,yoyRevenue:9.54,yoyProfit:7.28,pe:24.77,pb:3.35,roe:13.98},
      {quarter:"Q3/2024",revenue:6379.72,profit:121.75,yoyRevenue:14.89,yoyProfit:18.88,pe:21.04,pb:2.96,roe:14.46},
      {quarter:"Q4/2024",revenue:6138.66,profit:140.36,yoyRevenue:23.33,yoyProfit:56.70,pe:16.09,pb:2.42,roe:15.94},
      {quarter:"Q1/2025",revenue:5574.85,profit:105.92,yoyRevenue:11.45,yoyProfit:14.55,pe:20.49,pb:3.06,roe:15.71},
      {quarter:"Q2/2025",revenue:5871.96,profit:115.75,yoyRevenue:15.96,yoyProfit:29.97,pe:17.63,pb:2.80,roe:16.19},
      {quarter:"Q3/2025",revenue:7503.66,profit:166.44,yoyRevenue:17.62,yoyProfit:36.71,pe:18.27,pb:2.99,roe:17.06},
      {quarter:"Q4/2025",revenue:8292.36,profit:159.22,yoyRevenue:35.08,yoyProfit:13.44,pe:17.86,pb:2.87,roe:17.09}
    ]
  },
  DHC: {
    currentPE: 8.06, currentPB: 1.56, currentROE: 20.66,
    quarters: [
      {quarter:"Q2/2024",revenue:1016.13,profit:60.40,yoyRevenue:26.84,yoyProfit:-34.38,pe:11.51,pb:1.52,roe:13.20},
      {quarter:"Q3/2024",revenue:896.45,profit:77.03,yoyRevenue:12.81,yoyProfit:37.80,pe:10.39,pb:1.43,roe:14.14},
      {quarter:"Q4/2024",revenue:874.06,profit:49.04,yoyRevenue:6.97,yoyProfit:-34.62,pe:9.48,pb:1.15,roe:12.58},
      {quarter:"Q1/2025",revenue:826.09,profit:75.70,yoyRevenue:1.89,yoyProfit:36.14,pe:11.13,pb:1.41,roe:13.27},
      {quarter:"Q2/2025",revenue:880.98,profit:82.97,yoyRevenue:-13.30,yoyProfit:37.37,pe:11.87,pb:1.63,roe:14.06},
      {quarter:"Q3/2025",revenue:932.29,profit:99.61,yoyRevenue:4.00,yoyProfit:29.32,pe:10.76,pb:1.52,roe:14.77},
      {quarter:"Q4/2025",revenue:993.70,profit:134.79,yoyRevenue:13.69,yoyProfit:174.85,pe:8.80,pb:1.56,roe:18.66}
    ]
  },
  DIG: {
    currentPE: 12.52, currentPB: 1.17, currentROE: 7.74,
    quarters: [
      {quarter:"Q2/2024",revenue:646.55,profit:125.97,yoyRevenue:296.97,yoyProfit:1100.98,pe:135.79,pb:1.63,roe:1.21},
      {quarter:"Q3/2024",revenue:62.49,profit:7.08,yoyRevenue:-73.72,yoyProfit:-58.36,pe:131.40,pb:1.40,roe:1.07},
      {quarter:"Q4/2024",revenue:449.49,profit:98.25,yoyRevenue:1.41,yoyProfit:48.18,pe:78.27,pb:1.15,roe:1.48},
      {quarter:"Q1/2025",revenue:176.53,profit:-35.35,yoyRevenue:-5.31,yoyProfit:69.83,pe:71.59,pb:1.81,roe:2.54},
      {quarter:"Q2/2025",revenue:284.67,profit:66.72,yoyRevenue:-55.97,yoyProfit:-47.03,pe:100.33,pb:2.14,roe:1.76},
      {quarter:"Q3/2025",revenue:1564.21,profit:211.45,yoyRevenue:2403.30,yoyProfit:2888.48,pe:31.27,pb:1.59,roe:4.35},
      {quarter:"Q4/2025",revenue:2761.62,profit:421.81,yoyRevenue:514.40,yoyProfit:329.30,pe:14.89,pb:1.17,roe:7.28}
    ]
  },
  DPM: {
    currentPE: 12.37, currentPB: 1.59, currentROE: 11.13,
    quarters: [
      {quarter:"Q2/2024",revenue:4012.28,profit:230.58,yoyRevenue:6.73,yoyProfit:128.65,pe:20.52,pb:1.16,roe:5.78},
      {quarter:"Q3/2024",revenue:3112.44,profit:62.99,yoyRevenue:-4.52,yoyProfit:-1.61,pe:20.35,pb:1.23,roe:5.80},
      {quarter:"Q4/2024",revenue:3166.51,profit:-19.99,yoyRevenue:-7.16,yoyProfit:-118.57,pe:23.94,pb:1.17,roe:4.81},
      {quarter:"Q1/2025",revenue:4188.86,profit:204.94,yoyRevenue:24.45,yoyProfit:-22.43,pe:32.39,pb:1.38,roe:4.25},
      {quarter:"Q2/2025",revenue:5446.88,profit:402.90,yoyRevenue:35.76,yoyProfit:74.73,pe:24.65,pb:1.39,roe:5.81},
      {quarter:"Q3/2025",revenue:3746.56,profit:236.39,yoyRevenue:20.37,yoyProfit:275.27,pe:19.72,pb:1.46,roe:7.35},
      {quarter:"Q4/2025",revenue:3437.82,profit:229.01,yoyRevenue:8.57,yoyProfit:1245.38,pe:16.79,pb:1.59,roe:9.60}
    ]
  },
  DXG: {
    currentPE: 69.34, currentPB: 1.20, currentROE: 1.65,
    quarters: [
      {quarter:"Q2/2024",revenue:1125.94,profit:32.92,yoyRevenue:66.57,yoyProfit:-78.92,pe:59.99,pb:1.11,roe:1.79},
      {quarter:"Q3/2024",revenue:1014.98,profit:30.71,yoyRevenue:-16.39,yoyProfit:-54.87,pe:74.48,pb:1.24,roe:1.37},
      {quarter:"Q4/2024",revenue:1589.87,profit:161.02,yoyRevenue:13.55,yoyProfit:241.74,pe:43.73,pb:1.26,roe:2.58},
      {quarter:"Q1/2025",revenue:924.93,profit:48.36,yoyRevenue:-13.13,yoyProfit:54.58,pe:62.34,pb:1.60,roe:2.48},
      {quarter:"Q2/2025",revenue:769.74,profit:81.37,yoyRevenue:-31.64,yoyProfit:147.18,pe:60.63,pb:1.74,roe:2.80},
      {quarter:"Q3/2025",revenue:1068.29,profit:92.84,yoyRevenue:5.25,yoyProfit:202.26,pe:38.97,pb:1.37,roe:3.22},
      {quarter:"Q4/2025",revenue:1727.07,profit:8.32,yoyRevenue:8.63,yoyProfit:-94.83,pe:66.55,pb:1.20,roe:1.87}
    ]
  },
  DXS: {
    currentPE: 8.60, currentPB: 0.67, currentROE: 7.63,
    quarters: [
      {quarter:"Q2/2024",revenue:702.46,profit:38.04,yoyRevenue:12.48,yoyProfit:300.69,pe:-81.11,pb:0.57,roe:-0.70},
      {quarter:"Q3/2024",revenue:581.71,profit:34.95,yoyRevenue:6.25,yoyProfit:920.25,pe:-399.23,pb:0.65,roe:-0.16},
      {quarter:"Q4/2024",revenue:791.39,profit:36.47,yoyRevenue:65.74,yoyProfit:132.02,pe:26.50,pb:0.62,roe:2.37},
      {quarter:"Q1/2025",revenue:512.46,profit:40.06,yoyRevenue:-4.07,yoyProfit:28.34,pe:42.41,pb:1.05,roe:2.49},
      {quarter:"Q2/2025",revenue:965.09,profit:216.13,yoyRevenue:37.39,yoyProfit:468.18,pe:19.62,pb:1.03,roe:5.39},
      {quarter:"Q3/2025",revenue:864.11,profit:77.63,yoyRevenue:48.55,yoyProfit:122.12,pe:11.15,pb:0.65,roe:6.01},
      {quarter:"Q4/2025",revenue:1597.58,profit:2.64,yoyRevenue:101.87,yoyProfit:-92.75,pe:12.13,pb:0.67,roe:5.69}
    ]
  },
  VCB: {
    currentPE: 14.46, currentPB: null, currentROE: 16.07,
    isBank:true,
    quarters: [
      {quarter:"Q2/2023",revenue:14020.58,profit:7422.82,yoyRevenue:9.56,yoyProfit:25.03},
      {quarter:"Q3/2023",revenue:12596.12,profit:7268.92,yoyRevenue:-7.81,yoyProfit:19.85},
      {quarter:"Q4/2023",revenue:12801.22,profit:9355.03,yoyRevenue:-13.56,yoyProfit:-5.77},
      {quarter:"Q1/2024",revenue:14078.06,profit:8580.00,yoyRevenue:-0.88,yoyProfit:-4.52},
      {quarter:"Q2/2024",revenue:13907.71,profit:8119.41,yoyRevenue:-0.81,yoyProfit:9.38},
      {quarter:"Q3/2024",revenue:13577.64,profit:8566.60,yoyRevenue:7.79,yoyProfit:17.85},
      {quarter:"Q4/2024",revenue:13842.33,profit:8565.38,yoyRevenue:8.13,yoyProfit:-8.44},
      {quarter:"Q1/2025",revenue:13687.15,profit:8696.23,yoyRevenue:-2.78,yoyProfit:1.35},
      {quarter:"Q2/2025",revenue:14160.19,profit:8831.89,yoyRevenue:1.82,yoyProfit:8.77},
      {quarter:"Q3/2025",revenue:14657.24,profit:9020.50,yoyRevenue:7.95,yoyProfit:5.30},
      {quarter:"Q4/2025",revenue:16266.83,profit:8629.05,yoyRevenue:17.52,yoyProfit:0.74}
    ]
  },
  VPB: {
    currentPE: 8.15, currentPB: null, currentROE: 16.37,
    isBank:true,
    quarters: [
      {quarter:"Q2/2023",revenue:8762.15,profit:3061.79,yoyRevenue:-16.28,yoyProfit:-12.72},
      {quarter:"Q3/2023",revenue:8836.75,profit:2424.75,yoyRevenue:-14.91,yoyProfit:-34.99},
      {quarter:"Q4/2023",revenue:11041.84,profit:2030.08,yoyRevenue:7.38,yoyProfit:-10.40},
      {quarter:"Q1/2024",revenue:11323.40,profit:3566.70,yoyRevenue:18.77,yoyProfit:40.65},
      {quarter:"Q2/2024",revenue:12408.24,profit:3566.85,yoyRevenue:41.61,yoyProfit:16.50},
      {quarter:"Q3/2024",revenue:12155.77,profit:4027.83,yoyRevenue:37.56,yoyProfit:66.11},
      {quarter:"Q4/2024",revenue:14114.99,profit:4617.42,yoyRevenue:27.83,yoyProfit:127.45},
      {quarter:"Q1/2025",revenue:13355.76,profit:3894.91,yoyRevenue:17.95,yoyProfit:9.20},
      {quarter:"Q2/2025",revenue:13478.57,profit:4862.40,yoyRevenue:8.63,yoyProfit:36.32},
      {quarter:"Q3/2025",revenue:15061.21,profit:7275.48,yoyRevenue:23.90,yoyProfit:80.63},
      {quarter:"Q4/2025",revenue:16767.18,profit:7957.14,yoyRevenue:18.79,yoyProfit:72.33}
    ]
  },
  HDB: {
    currentPE: 7.29, currentPB: null, currentROE: 24.03,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:7719.88,profit:3114.89,yoyRevenue:55.82,yoyProfit:44.30},
      {quarter:"Q3/2024",revenue:7773.45,profit:3423.88,yoyRevenue:58.12,yoyProfit:38.04},
      {quarter:"Q4/2024",revenue:8203.40,profit:3114.41,yoyRevenue:9.78,yoyProfit:-6.86},
      {quarter:"Q1/2025",revenue:7408.10,profit:4234.75,yoyRevenue:3.46,yoyProfit:36.18},
      {quarter:"Q2/2025",revenue:9819.16,profit:3514.86,yoyRevenue:27.19,yoyProfit:12.84},
      {quarter:"Q3/2025",revenue:7763.32,profit:3646.64,yoyRevenue:-0.13,yoyProfit:6.51},
      {quarter:"Q4/2025",revenue:9755.61,profit:5128.14,yoyRevenue:18.92,yoyProfit:64.66},
      {quarter:"Q1/2026",revenue:8483.02,profit:4766.64,yoyRevenue:14.51,yoyProfit:12.56}
    ]
  },
  EIB: {
    currentPE: 52.32, currentPB: null, currentROE: 2.85,
    isBank:true,
    quarters: [
      {quarter:"Q3/2023",revenue:868.74,profit:241.81,yoyRevenue:-41.77,yoyProfit:-76.38},
      {quarter:"Q4/2023",revenue:1397.54,profit:804.55,yoyRevenue:-2.79,yoyProfit:99.35},
      {quarter:"Q1/2024",revenue:1358.03,profit:527.25,yoyRevenue:9.82,yoyProfit:-24.26},
      {quarter:"Q2/2024",revenue:1511.54,profit:642.84,yoyRevenue:38.14,yoyProfit:52.11},
      {quarter:"Q3/2024",revenue:1535.87,profit:721.21,yoyRevenue:76.79,yoyProfit:198.25},
      {quarter:"Q4/2024",revenue:1518.09,profit:1435.50,yoyRevenue:8.63,yoyProfit:78.42},
      {quarter:"Q1/2025",revenue:1354.38,profit:658.49,yoyRevenue:-0.27,yoyProfit:24.89},
      {quarter:"Q2/2025",revenue:1469.40,profit:506.24,yoyRevenue:-2.79,yoyProfit:-21.25},
      {quarter:"Q3/2025",revenue:1465.01,profit:444.69,yoyRevenue:-4.61,yoyProfit:-38.34},
      {quarter:"Q4/2025",revenue:1690.89,profit:-472.48,yoyRevenue:11.38,yoyProfit:-132.91},
      {quarter:"Q1/2026",revenue:1379.98,profit:269.16,yoyRevenue:1.89,yoyProfit:-59.12}
    ]
  },
  STB: {
    currentPE: 30.07, currentPB: null, currentROE: 7.59,
    isBank:true,
    quarters: [
      {quarter:"Q3/2023",revenue:4851.11,profit:1634.59,yoyRevenue:-15.81,yoyProfit:34.91},
      {quarter:"Q4/2023",revenue:5633.09,profit:2258.94,yoyRevenue:-6.79,yoyProfit:29.00},
      {quarter:"Q1/2024",revenue:5950.84,profit:2111.41,yoyRevenue:1.96,yoyProfit:11.13},
      {quarter:"Q2/2024",revenue:6116.57,profit:2176.84,yoyRevenue:6.35,yoyProfit:13.08},
      {quarter:"Q3/2024",revenue:6365.11,profit:2201.17,yoyRevenue:31.21,yoyProfit:34.66},
      {quarter:"Q4/2024",revenue:6099.18,profit:3598.08,yoyRevenue:8.27,yoyProfit:59.28},
      {quarter:"Q1/2025",revenue:6863.17,profit:2896.69,yoyRevenue:15.33,yoyProfit:37.19},
      {quarter:"Q2/2025",revenue:6585.08,profit:2893.60,yoyRevenue:7.66,yoyProfit:32.93},
      {quarter:"Q3/2025",revenue:7874.37,profit:2901.28,yoyRevenue:23.71,yoyProfit:31.81},
      {quarter:"Q4/2025",revenue:5358.00,profit:-2752.46,yoyRevenue:-12.15,yoyProfit:-176.50}
    ]
  },
  CTR: {
    currentPE: 15.45, currentPB: 4.75, currentROE: 29.78,
    quarters: [
      {quarter:"Q2/2023",revenue:2701.36,profit:124.14,yoyRevenue:21.48,yoyProfit:20.61,pe:17.13,pb:4.98},
      {quarter:"Q3/2023",revenue:3083.43,profit:140.59,yoyRevenue:18.34,yoyProfit:9.64,pe:21.33,pb:5.81},
      {quarter:"Q4/2023",revenue:3174.68,profit:143.24,yoyRevenue:20.42,yoyProfit:6.27,pe:27.49,pb:7.13},
      {quarter:"Q1/2024",revenue:2623.10,profit:116.13,yoyRevenue:12.12,yoyProfit:7.04,pe:28.70,pb:7.94},
      {quarter:"Q2/2024",revenue:3008.97,profit:125.11,yoyRevenue:11.39,yoyProfit:0.78,pe:27.82,pb:7.80},
      {quarter:"Q3/2024",revenue:3475.57,profit:146.26,yoyRevenue:12.72,yoyProfit:4.03,pe:28.75,pb:9.03},
      {quarter:"Q4/2024",revenue:3501.88,profit:150.72,yoyRevenue:10.31,yoyProfit:5.22,pe:17.92,pb:5.17},
      {quarter:"Q1/2025",revenue:2738.46,profit:121.71,yoyRevenue:4.40,yoyProfit:4.80,pe:20.76,pb:5.63},
      {quarter:"Q2/2025",revenue:3236.36,profit:145.22,yoyRevenue:7.56,yoyProfit:16.08,pe:18.46,pb:5.22},
      {quarter:"Q3/2025",revenue:3965.18,profit:168.94,yoyRevenue:14.09,yoyProfit:15.50,pe:18.72,pb:5.09},
      {quarter:"Q4/2025",revenue:3999.53,profit:163.85,yoyRevenue:14.21,yoyProfit:8.71,pe:16.38,pb:4.75}
    ]
  },
  GVR: {
    currentPE: 20.86, currentPB: 2.34, currentROE: 10.95,
    quarters: [
      {quarter:"Q2/2023",revenue:4161.20,profit:558.18,yoyRevenue:-25.39,yoyProfit:-45.12,pe:25.22,pb:1.45},
      {quarter:"Q3/2023",revenue:6199.49,profit:312.83,yoyRevenue:5.91,yoyProfit:-62.54,pe:39.36,pb:1.82},
      {quarter:"Q4/2023",revenue:7606.80,profit:1164.40,yoyRevenue:-15.82,yoyProfit:27.73,pe:45.75,pb:2.41},
      {quarter:"Q1/2024",revenue:4590.33,profit:475.56,yoyRevenue:10.82,yoyProfit:-13.50,pe:53.37,pb:2.64},
      {quarter:"Q2/2024",revenue:4653.67,profit:820.84,yoyRevenue:11.83,yoyProfit:47.06,pe:47.16,pb:2.55},
      {quarter:"Q3/2024",revenue:7717.06,profit:943.78,yoyRevenue:24.48,yoyProfit:201.69,pe:33.84,pb:2.21},
      {quarter:"Q4/2024",revenue:9305.95,profit:1748.53,yoyRevenue:22.34,yoyProfit:50.17,pe:23.77,pb:1.79},
      {quarter:"Q1/2025",revenue:5681.99,profit:1184.65,yoyRevenue:23.78,yoyProfit:149.10,pe:25.12,pb:2.17},
      {quarter:"Q2/2025",revenue:5891.20,profit:1446.81,yoyRevenue:26.59,yoyProfit:76.26,pe:20.70,pb:1.96},
      {quarter:"Q3/2025",revenue:9296.20,profit:1897.26,yoyRevenue:20.46,yoyProfit:101.03,pe:26.03,pb:2.82},
      {quarter:"Q4/2025",revenue:8658.03,profit:694.40,yoyRevenue:-6.96,yoyProfit:-60.29,pe:24.82,pb:2.34}
    ]
  },
  FPT: {
    currentPE: 12.34, currentPB: 3.43, currentROE: 26.82,
    quarters: [
      {quarter:"Q2/2023",revenue:12484.52,profit:1509.22,yoyRevenue:23.65,yoyProfit:20.66,pe:20.02,pb:4.84},
      {quarter:"Q3/2023",revenue:13761.83,profit:1739.34,yoyRevenue:23.44,yoyProfit:19.65,pe:19.73,pb:5.10},
      {quarter:"Q4/2023",revenue:14695.81,profit:1728.40,yoyRevenue:12.58,yoyProfit:27.88,pe:21.62,pb:5.61},
      {quarter:"Q1/2024",revenue:14093.30,profit:1798.03,yoyRevenue:20.63,yoyProfit:20.39,pe:27.56,pb:6.96},
      {quarter:"Q2/2024",revenue:15245.89,profit:1875.16,yoyRevenue:22.12,yoyProfit:24.25,pe:27.45,pb:7.18},
      {quarter:"Q3/2024",revenue:15972.40,profit:2088.85,yoyRevenue:16.06,yoyProfit:20.09,pe:29.97,pb:7.60},
      {quarter:"Q4/2024",revenue:17651.07,profit:2094.73,yoyRevenue:20.11,yoyProfit:21.19,pe:20.56,pb:5.45},
      {quarter:"Q1/2025",revenue:16064.98,profit:2174.30,yoyRevenue:13.99,yoyProfit:20.93,pe:23.01,pb:5.95},
      {quarter:"Q2/2025",revenue:16658.34,profit:2257.46,yoyRevenue:9.26,yoyProfit:20.39,pe:18.66,pb:4.86},
      {quarter:"Q3/2025",revenue:17225.51,profit:2434.84,yoyRevenue:7.85,yoyProfit:16.56,pe:18.65,pb:4.69},
      {quarter:"Q4/2025",revenue:20258.87,profit:2509.52,yoyRevenue:14.77,yoyProfit:19.80,pe:13.31,pb:3.43}
    ]
  },
  MBB: {
    currentPE: 7.32, currentPB: 1.58, currentROE: 20.93,
    isBank:true,
    quarters: [
      {quarter:"Q2/2023",revenue:9481.37,profit:4893.50,yoyRevenue:5.71,yoyProfit:5.85,pe:5.25,pb:1.16},
      {quarter:"Q3/2023",revenue:9811.79,profit:5773.27,yoyRevenue:8.55,yoyProfit:18.32,pe:4.98,pb:1.27},
      {quarter:"Q4/2023",revenue:9163.49,profit:4986.37,yoyRevenue:-4.84,yoyProfit:45.20,pe:6.22,pb:1.41},
      {quarter:"Q1/2024",revenue:9062.29,profit:4532.70,yoyRevenue:-11.39,yoyProfit:-9.77,pe:5.97,pb:1.25},
      {quarter:"Q2/2024",revenue:10531.11,profit:6026.75,yoyRevenue:11.07,yoyProfit:23.16,pe:6.35,pb:1.37},
      {quarter:"Q3/2024",revenue:10416.64,profit:5790.16,yoyRevenue:6.16,yoyProfit:0.29,pe:6.04,pb:1.23},
      {quarter:"Q4/2024",revenue:11142.18,profit:6284.15,yoyRevenue:21.59,yoyProfit:26.03,pe:6.17,pb:1.25},
      {quarter:"Q1/2025",revenue:11692.18,profit:6567.74,yoyRevenue:29.02,yoyProfit:44.90,pe:6.62,pb:1.38},
      {quarter:"Q2/2025",revenue:12372.12,profit:5877.61,yoyRevenue:17.48,yoyProfit:-2.47,pe:8.88,pb:1.78},
      {quarter:"Q3/2025",revenue:12990.52,profit:5571.02,yoyRevenue:24.71,yoyProfit:-3.78,pe:9.00,pb:1.72},
      {quarter:"Q4/2025",revenue:14555.29,profit:8762.57,yoyRevenue:30.63,yoyProfit:39.44,pe:8.03,pb:1.58}
    ]
  },
  VHM: {
    currentPE: 9.63, currentPB: 2.61, currentROE: 27.83,
    quarters: [
      {quarter:"Q2/2023",revenue:32613.84,profit:9687.70,yoyRevenue:629.54,yoyProfit:1353.57,pe:4.31,pb:1.16},
      {quarter:"Q3/2023",revenue:32724.10,profit:10694.76,yoyRevenue:83.79,yoyProfit:-26.21,pe:4.44,pb:1.03},
      {quarter:"Q4/2023",revenue:8697.58,profit:825.69,yoyRevenue:-72.12,yoyProfit:-90.75,pe:5.32,pb:0.99},
      {quarter:"Q1/2024",revenue:8211.20,profit:884.70,yoyRevenue:-71.97,yoyProfit:-92.58,pe:7.38,pb:0.89},
      {quarter:"Q2/2024",revenue:28375.36,profit:10891.02,yoyRevenue:-13.00,yoyProfit:12.42,pe:7.99,pb:0.97},
      {quarter:"Q3/2024",revenue:33323.14,profit:7866.08,yoyRevenue:1.83,yoyProfit:-26.45,pe:8.35,pb:0.81},
      {quarter:"Q4/2024",revenue:32413.48,profit:12159.46,yoyRevenue:272.67,yoyProfit:1372.64,pe:7.96,pb:1.19},
      {quarter:"Q1/2025",revenue:15697.92,profit:2688.95,yoyRevenue:91.18,yoyProfit:203.94,pe:11.78,pb:1.83},
      {quarter:"Q2/2025",revenue:18974.96,profit:7508.04,yoyRevenue:-33.13,yoyProfit:-31.06,pe:14.89,pb:2.00},
      {quarter:"Q3/2025",revenue:16419.97,profit:4183.93,yoyRevenue:-50.73,yoyProfit:-46.81,pe:17.45,pb:2.02},
      {quarter:"Q4/2025",revenue:102178.07,profit:27514.33,yoyRevenue:215.23,yoyProfit:126.28,pe:14.80,pb:2.61}
    ]
  },
  VIC: {
    currentPE: 146.06, currentPB: 11.80, currentROE: 7.95,
    quarters: [
      {quarter:"Q2/2023",revenue:47284.62,profit:1824.14,yoyRevenue:253.28,yoyProfit:-46.23,pe:31.12,pb:1.47},
      {quarter:"Q3/2023",revenue:47955.86,profit:-669.04,yoyRevenue:66.56,yoyProfit:-170.66,pe:43.71,pb:1.33},
      {quarter:"Q4/2023",revenue:27451.79,profit:-158.77,yoyRevenue:-33.32,yoyProfit:-110.18,pe:75.34,pb:1.42},
      {quarter:"Q1/2024",revenue:21739.45,profit:7934.47,yoyRevenue:-44.22,yoyProfit:644.16,pe:17.58,pb:1.19},
      {quarter:"Q2/2024",revenue:42332.28,profit:-3529.02,yoyRevenue:-10.47,yoyProfit:-293.46,pe:44.27,pb:1.22},
      {quarter:"Q3/2024",revenue:62862.40,profit:5294.92,yoyRevenue:31.08,yoyProfit:891.42,pe:16.40,pb:1.15},
      {quarter:"Q4/2024",revenue:62156.47,profit:2192.43,yoyRevenue:126.42,yoyProfit:1480.92,pe:22.16,pb:1.90},
      {quarter:"Q1/2025",revenue:83821.34,profit:6978.76,yoyRevenue:285.57,yoyProfit:-12.04,pe:38.80,pb:2.91},
      {quarter:"Q2/2025",revenue:46435.49,profit:-940.91,yoyRevenue:9.69,yoyProfit:73.34,pe:58.53,pb:5.47},
      {quarter:"Q3/2025",revenue:39143.02,profit:640.18,yoyRevenue:-37.73,yoyProfit:-87.91,pe:122.46,pb:7.44},
      {quarter:"Q4/2025",revenue:162238.60,profit:4671.90,yoyRevenue:161.02,yoyProfit:113.09,pe:153.62,pb:11.80}
    ]
  },
  ANV: {
    currentPE: 5.32, currentPB: 1.82, currentROE: 30.25,
    quarters: [
      {quarter:"Q2/2023",revenue:1090.88,profit:-51.04,yoyRevenue:-16.46,yoyProfit:-121.21,pe:16.23,pb:1.50},
      {quarter:"Q3/2023",revenue:1100.74,profit:1.04,yoyRevenue:-11.80,yoyProfit:-99.13,pe:26.01,pb:1.32},
      {quarter:"Q4/2023",revenue:1112.56,profit:-0.52,yoyRevenue:-4.19,yoyProfit:-100.49,pe:97.78,pb:1.36},
      {quarter:"Q1/2024",revenue:1016.23,profit:16.90,yoyRevenue:-12.21,yoyProfit:-81.70,pe:-142.55,pb:1.67},
      {quarter:"Q2/2024",revenue:1209.20,profit:-2.29,yoyRevenue:10.85,yoyProfit:95.52,pe:292.87,pb:1.56},
      {quarter:"Q3/2024",revenue:1345.00,profit:27.88,yoyRevenue:22.19,yoyProfit:2583.01,pe:116.08,pb:1.70},
      {quarter:"Q4/2024",revenue:1368.68,profit:5.34,yoyRevenue:23.02,yoyProfit:1131.17,pe:84.89,pb:1.45},
      {quarter:"Q1/2025",revenue:1111.47,profit:132.02,yoyRevenue:9.37,yoyProfit:681.03,pe:38.07,pb:2.12},
      {quarter:"Q2/2025",revenue:1744.79,profit:332.81,yoyRevenue:44.29,yoyProfit:14651.17,pe:16.36,pb:2.50},
      {quarter:"Q3/2025",revenue:2007.87,profit:283.08,yoyRevenue:49.28,yoyProfit:915.48,pe:9.47,pb:2.01},
      {quarter:"Q4/2025",revenue:2128.36,profit:251.57,yoyRevenue:55.50,yoyProfit:4610.83,pe:6.43,pb:1.82}
    ]
  }
};
