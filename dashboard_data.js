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
  FRT: {
    currentPE: 23.88, currentPB: 6.02, currentROE: 25.08,
    quarters: [
      {quarter:"Q2/2024",revenue:9271.97,profit:26.74,yoyRevenue:28.77,yoyProfit:112.23,pe:-413.15,pb:14.01,roe:-3.42},
      {quarter:"Q3/2024",revenue:10409.52,profit:140.91,yoyRevenue:25.94,yoyProfit:768.27,pe:256.24,pb:14.98,roe:6.29},
      {quarter:"Q4/2024",revenue:11492.34,profit:111.10,yoyRevenue:31.76,yoyProfit:210.13,pe:72.00,pb:11.96,roe:18.09},
      {quarter:"Q1/2025",revenue:11699.60,profit:167.96,yoyRevenue:29.02,yoyProfit:333.30,pe:58.29,pb:12.52,roe:23.95},
      {quarter:"Q2/2025",revenue:11425.72,profit:118.66,yoyRevenue:23.23,yoyProfit:343.69,pe:45.85,pb:8.61,roe:24.87},
      {quarter:"Q3/2025",revenue:13147.24,profit:218.73,yoyRevenue:26.30,yoyProfit:55.23,pe:45.58,pb:9.11,roe:24.80},
      {quarter:"Q4/2025",revenue:14959.49,profit:289.51,yoyRevenue:30.17,yoyProfit:160.59,pe:31.60,pb:6.02,roe:26.13}
    ]
  },
  FTS: {
    currentPE: 25.24, currentPB: 2.16, currentROE: 9.24,
    quarters: [
      {quarter:"Q2/2024",revenue:305.24,profit:160.50,yoyRevenue:17.48,yoyProfit:14.56,pe:23.88,pb:3.46,roe:14.85},
      {quarter:"Q3/2024",revenue:224.63,profit:80.68,yoyRevenue:-30.91,yoyProfit:-56.07,pe:27.47,pb:3.16,roe:11.80},
      {quarter:"Q4/2024",revenue:318.67,profit:159.51,yoyRevenue:75.53,yoyProfit:279.54,pe:21.08,pb:2.93,roe:14.62},
      {quarter:"Q1/2025",revenue:312.06,profit:152.97,yoyRevenue:4.29,yoyProfit:-8.20,pe:24.98,pb:3.34,roe:13.65},
      {quarter:"Q2/2025",revenue:239.14,profit:60.62,yoyRevenue:-21.65,yoyProfit:-62.23,pe:25.49,pb:2.81,roe:10.94},
      {quarter:"Q3/2025",revenue:284.41,profit:55.11,yoyRevenue:26.61,yoyProfit:-31.69,pe:26.34,pb:2.68,roe:10.12},
      {quarter:"Q4/2025",revenue:370.19,profit:128.06,yoyRevenue:16.17,yoyProfit:-19.72,pe:23.73,pb:2.16,roe:9.29}
    ]
  },
  GAS: {
    currentPE: 16.22, currentPB: 2.85, currentROE: 17.32,
    quarters: [
      {quarter:"Q2/2024",revenue:30071.15,profit:3320.82,yoyRevenue:25.07,yoyProfit:5.24,pe:15.13,pb:2.38,roe:16.71},
      {quarter:"Q3/2024",revenue:25256.62,profit:2521.79,yoyRevenue:14.01,yoyProfit:6.08,pe:14.36,pb:2.73,roe:17.14},
      {quarter:"Q4/2024",revenue:24960.85,profit:2044.10,yoyRevenue:10.43,yoyProfit:-24.93,pe:13.13,pb:2.27,roe:16.73},
      {quarter:"Q1/2025",revenue:25675.43,profit:2756.53,yoyRevenue:10.12,yoyProfit:9.75,pe:14.95,pb:2.52,roe:16.96},
      {quarter:"Q2/2025",revenue:30103.97,profit:4747.61,yoyRevenue:41.39,yoyProfit:42.96,pe:11.93,pb:2.14,roe:19.40},
      {quarter:"Q3/2025",revenue:35711.04,profit:2549.12,yoyRevenue:41.39,yoyProfit:1.08,pe:23.34,pb:4.35,roe:18.93},
      {quarter:"Q4/2025",revenue:43706.10,profit:1361.08,yoyRevenue:75.10,yoyProfit:-33.41,pe:16.55,pb:2.85,roe:18.04}
    ]
  },
  GEG: {
    currentPE: 11.42, currentPB: 1.16, currentROE: 10.70,
    quarters: [
      {quarter:"Q2/2024",revenue:487.63,profit:21.46,yoyRevenue:1.53,yoyProfit:146.46,pe:27.70,pb:1.09,roe:4.00},
      {quarter:"Q3/2024",revenue:543.14,profit:-27.34,yoyRevenue:-4.02,yoyProfit:-299.23,pe:36.01,pb:1.09,roe:3.05},
      {quarter:"Q4/2024",revenue:555.33,profit:31.04,yoyRevenue:-2.36,yoyProfit:-38.62,pe:50.23,pb:1.29,roe:2.62},
      {quarter:"Q1/2025",revenue:1112.76,profit:378.24,yoyRevenue:50.53,yoyProfit:321.85,pe:18.38,pb:1.51,roe:8.92},
      {quarter:"Q2/2025",revenue:624.34,profit:165.82,yoyRevenue:28.03,yoyProfit:672.70,pe:11.92,pb:1.29,roe:11.79},
      {quarter:"Q3/2025",revenue:671.33,profit:74.65,yoyRevenue:23.60,yoyProfit:373.05,pe:9.46,pb:1.19,roe:13.55},
      {quarter:"Q4/2025",revenue:590.44,profit:89.81,yoyRevenue:6.32,yoyProfit:189.36,pe:8.52,pb:1.16,roe:15.09}
    ]
  },
  GEX: {
    currentPE: 27.32, currentPB: 1.98, currentROE: 8.77,
    quarters: [
      {quarter:"Q2/2024",revenue:8317.52,profit:849.41,yoyRevenue:3.55,yoyProfit:164.50,pe:16.57,pb:1.34,roe:8.41},
      {quarter:"Q3/2024",revenue:8856.41,profit:98.86,yoyRevenue:17.72,yoyProfit:-18.98,pe:15.53,pb:1.21,roe:8.05},
      {quarter:"Q4/2024",revenue:10180.90,profit:574.47,yoyRevenue:24.51,yoyProfit:2992.42,pe:14.30,pb:1.68,roe:7.49},
      {quarter:"Q1/2025",revenue:7983.32,profit:233.74,yoyRevenue:19.06,yoyProfit:115.33,pe:27.39,pb:3.36,roe:7.92},
      {quarter:"Q2/2025",revenue:10189.02,profit:656.87,yoyRevenue:22.50,yoyProfit:-22.67,pe:27.66,pb:2.97,roe:8.89},
      {quarter:"Q3/2025",revenue:9970.05,profit:621.93,yoyRevenue:12.57,yoyProfit:529.08,pe:15.78,pb:2.04,roe:8.27},
      {quarter:"Q4/2025",revenue:11765.77,profit:-34.65,yoyRevenue:15.57,yoyProfit:-106.03,pe:23.87,pb:1.98,roe:7.31}
    ]
  },
  GMD: {
    currentPE: 16.67, currentPB: 2.44, currentROE: 14.64,
    quarters: [
      {quarter:"Q2/2024",revenue:1150.90,profit:330.36,yoyRevenue:26.17,yoyProfit:-79.98,pe:15.31,pb:2.73,roe:9.07},
      {quarter:"Q3/2024",revenue:1264.11,profit:335.05,yoyRevenue:26.68,yoyProfit:31.83,pe:15.29,pb:2.91,roe:9.29},
      {quarter:"Q4/2024",revenue:1411.47,profit:230.66,yoyRevenue:36.53,yoyProfit:100.86,pe:10.35,pb:1.62,roe:10.85},
      {quarter:"Q1/2025",revenue:1276.95,profit:402.98,yoyRevenue:26.99,yoyProfit:-27.96,pe:15.01,pb:1.89,roe:10.71},
      {quarter:"Q2/2025",revenue:1493.73,profit:445.26,yoyRevenue:29.79,yoyProfit:34.78,pe:18.45,pb:2.46,roe:12.20},
      {quarter:"Q3/2025",revenue:1560.50,profit:315.21,yoyRevenue:23.45,yoyProfit:-5.92,pe:19.62,pb:2.33,roe:11.20},
      {quarter:"Q4/2025",revenue:1624.85,profit:592.18,yoyRevenue:15.12,yoyProfit:156.73,pe:18.05,pb:2.44,roe:13.76}
    ]
  },
  HCM: {
    currentPE: 20.34, currentPB: 2.08, currentROE: 9.99,
    quarters: [
      {quarter:"Q2/2024",revenue:1093.90,profit:313.36,yoyRevenue:86.19,yoyProfit:99.32,pe:17.70,pb:2.07,roe:11.02},
      {quarter:"Q3/2024",revenue:1137.72,profit:222.39,yoyRevenue:38.13,yoyProfit:3.87,pe:17.69,pb:2.03,roe:10.55},
      {quarter:"Q4/2024",revenue:1181.54,profit:227.05,yoyRevenue:37.15,yoyProfit:26.64,pe:16.58,pb:1.80,roe:11.09},
      {quarter:"Q1/2025",revenue:999.58,profit:226.72,yoyRevenue:15.82,yoyProfit:-18.11,pe:18.53,pb:2.61,roe:9.54},
      {quarter:"Q2/2025",revenue:1073.46,profit:192.37,yoyRevenue:-1.87,yoyProfit:-38.61,pe:21.04,pb:2.62,roe:8.47},
      {quarter:"Q3/2025",revenue:1664.89,profit:440.54,yoyRevenue:46.34,yoyProfit:98.09,pe:19.48,pb:2.59,roe:10.46},
      {quarter:"Q4/2025",revenue:1398.22,profit:318.99,yoyRevenue:18.34,yoyProfit:40.49,pe:19.23,pb:2.08,roe:9.43}
    ]
  },
  HDC: {
    currentPE: 5.06, currentPB: 1.29, currentROE: 24.79,
    quarters: [
      {quarter:"Q2/2024",revenue:171.51,profit:50.29,yoyRevenue:32.81,yoyProfit:151.95,pe:32.65,pb:2.11,roe:6.64},
      {quarter:"Q3/2024",revenue:134.59,profit:13.08,yoyRevenue:-20.24,yoyProfit:-59.75,pe:36.15,pb:1.92,roe:5.40},
      {quarter:"Q4/2024",revenue:164.84,profit:1.36,yoyRevenue:-13.91,yoyProfit:-97.09,pe:57.03,pb:1.74,roe:3.14},
      {quarter:"Q1/2025",revenue:98.97,profit:13.58,yoyRevenue:15.99,yoyProfit:928.66,pe:78.53,pb:2.74,roe:3.43},
      {quarter:"Q2/2025",revenue:80.23,profit:57.87,yoyRevenue:-53.22,yoyProfit:15.06,pe:85.55,pb:3.16,roe:3.78},
      {quarter:"Q3/2025",revenue:102.01,profit:537.89,yoyRevenue:-24.21,yoyProfit:4012.91,pe:6.98,pb:1.49,roe:25.19},
      {quarter:"Q4/2025",revenue:175.29,profit:29.75,yoyRevenue:6.34,yoyProfit:2080.45,pe:5.84,pb:1.29,roe:24.87}
    ]
  },
  HDG: {
    currentPE: 12.72, currentPB: 1.40, currentROE: 10.11,
    quarters: [
      {quarter:"Q2/2024",revenue:549.94,profit:63.91,yoyRevenue:-9.03,yoyProfit:80.45,pe:13.61,pb:1.48,roe:11.02},
      {quarter:"Q3/2024",revenue:566.92,profit:137.61,yoyRevenue:23.33,yoyProfit:63.04,pe:12.54,pb:1.44,roe:11.69},
      {quarter:"Q4/2024",revenue:810.06,profit:-74.55,yoyRevenue:-5.97,yoyProfit:-125.80,pe:22.60,pb:1.29,roe:5.80},
      {quarter:"Q1/2025",revenue:623.18,profit:155.07,yoyRevenue:-26.49,yoyProfit:-29.94,pe:35.22,pb:1.59,roe:4.59},
      {quarter:"Q2/2025",revenue:589.77,profit:-18.37,yoyRevenue:7.24,yoyProfit:-128.75,pe:57.42,pb:1.84,roe:3.23},
      {quarter:"Q3/2025",revenue:714.64,profit:284.99,yoyRevenue:26.06,yoyProfit:107.10,pe:29.26,pb:1.56,roe:5.53},
      {quarter:"Q4/2025",revenue:887.99,profit:348.71,yoyRevenue:9.62,yoyProfit:567.74,pe:12.44,pb:1.40,roe:11.89}
    ]
  },
  HHV: {
    currentPE: 9.25, currentPB: 1.06, currentROE: 5.76,
    quarters: [
      {quarter:"Q2/2024",revenue:813.71,profit:109.45,yoyRevenue:32.90,yoyProfit:15.64,pe:12.88,pb:0.97,roe:4.49},
      {quarter:"Q3/2024",revenue:794.69,profit:104.01,yoyRevenue:17.97,yoyProfit:3.06,pe:13.96,pb:0.99,roe:4.37},
      {quarter:"Q4/2024",revenue:1009.97,profit:116.95,yoyRevenue:17.27,yoyProfit:127.36,pe:11.96,pb:0.93,roe:4.78},
      {quarter:"Q1/2025",revenue:735.02,profit:146.24,yoyRevenue:6.54,yoyProfit:52.32,pe:12.16,pb:1.11,roe:5.24},
      {quarter:"Q2/2025",revenue:947.06,profit:130.70,yoyRevenue:16.39,yoyProfit:19.42,pe:13.88,pb:1.21,roe:5.22},
      {quarter:"Q3/2025",revenue:913.52,profit:128.87,yoyRevenue:14.95,yoyProfit:23.90,pe:11.15,pb:1.07,roe:5.23},
      {quarter:"Q4/2025",revenue:1205.77,profit:175.02,yoyRevenue:19.39,yoyProfit:49.66,pe:10.55,pb:1.06,roe:5.78}
    ]
  },
  HSG: {
    currentPE: 17.31, currentPB: 0.87, currentROE: 4.83,
    quarters: [
      {quarter:"Q2/2024",revenue:10986.18,profit:273.40,yoyRevenue:24.48,yoyProfit:1832.51,pe:11.04,pb:1.14,roe:10.36},
      {quarter:"Q3/2024",revenue:10223.34,profit:-181.34,yoyRevenue:24.14,yoyProfit:-141.21,pe:20.88,pb:0.99,roe:4.68},
      {quarter:"Q4/2024",revenue:10407.26,profit:165.53,yoyRevenue:12.52,yoyProfit:60.16,pe:14.28,pb:0.75},
      {quarter:"Q1/2025",revenue:8661.49,profit:207.51,yoyRevenue:-8.09,yoyProfit:-34.99,pe:23.93,pb:0.99,roe:4.17},
      {quarter:"Q2/2025",revenue:9755.44,profit:273.78,yoyRevenue:-11.20,yoyProfit:0.14,pe:22.16,pb:0.92,roe:4.18},
      {quarter:"Q3/2025",revenue:8496.51,profit:88.20,yoyRevenue:-16.89,yoyProfit:148.64,pe:13.60,pb:0.88,roe:6.54},
      {quarter:"Q4/2025",revenue:8610.14,profit:62.40,yoyRevenue:-17.27,yoyProfit:-62.30,pe:15.76,pb:0.87}
    ]
  },
  HT1: {
    currentPE: 14.39, currentPB: 1.13, currentROE: 7.15,
    quarters: [
      {quarter:"Q2/2024",revenue:2047.58,profit:45.84,yoyRevenue:-4.08,yoyProfit:-21.94,pe:66.94,pb:0.90,roe:1.34},
      {quarter:"Q3/2024",revenue:1766.59,profit:22.55,yoyRevenue:4.51,yoyProfit:317.54,pe:49.11,pb:0.99,roe:2.03},
      {quarter:"Q4/2024",revenue:1960.32,profit:16.45,yoyRevenue:2.66,yoyProfit:-69.66,pe:68.84,pb:0.85,roe:1.24},
      {quarter:"Q1/2025",revenue:1703.07,profit:-9.18,yoyRevenue:7.40,yoyProfit:62.83,pe:65.57,pb:1.02,roe:1.56},
      {quarter:"Q2/2025",revenue:2098.27,profit:112.33,yoyRevenue:2.48,yoyProfit:145.05,pe:47.38,pb:1.36,roe:2.91},
      {quarter:"Q3/2025",revenue:2037.18,profit:85.66,yoyRevenue:15.32,yoyProfit:279.89,pe:31.23,pb:1.28,roe:4.18},
      {quarter:"Q4/2025",revenue:2125.03,profit:84.92,yoyRevenue:8.40,yoyProfit:416.33,pe:20.98,pb:1.13,roe:5.51}
    ]
  },
  IMP: {
    currentPE: 18.05, currentPB: 3.74, currentROE: 15.84,
    quarters: [
      {quarter:"Q2/2024",revenue:582.79,profit:65.92,yoyRevenue:31.57,yoyProfit:-17.26,pe:25.36,pb:3.29,roe:12.97},
      {quarter:"Q3/2024",revenue:618.00,profit:72.41,yoyRevenue:20.22,yoyProfit:3.88,pe:25.06,pb:3.18,roe:12.89},
      {quarter:"Q4/2024",revenue:767.29,profit:120.61,yoyRevenue:13.62,yoyProfit:66.70,pe:20.16,pb:2.96,roe:15.04},
      {quarter:"Q1/2025",revenue:671.47,profit:74.46,yoyRevenue:23.27,yoyProfit:20.25,pe:24.02,pb:3.56,roe:15.40},
      {quarter:"Q2/2025",revenue:770.08,profit:90.30,yoyRevenue:32.14,yoyProfit:36.97,pe:21.42,pb:3.61,roe:16.44},
      {quarter:"Q3/2025",revenue:676.89,profit:76.89,yoyRevenue:9.53,yoyProfit:6.19,pe:22.79,pb:3.75,roe:16.56},
      {quarter:"Q4/2025",revenue:795.86,profit:107.49,yoyRevenue:3.72,yoyProfit:-10.88,pe:24.70,pb:3.74,roe:15.55}
    ]
  },
  KBC: {
    currentPE: 17.39, currentPB: 1.29, currentROE: 6.31,
    quarters: [
      {quarter:"Q2/2024",revenue:891.73,profit:241.06,yoyRevenue:-65.28,yoyProfit:-75.40,pe:84.22,pb:1.10,roe:1.32},
      {quarter:"Q3/2024",revenue:950.37,profit:196.20,yoyRevenue:284.49,yoyProfit:1319.84,pe:52.80,pb:1.20,roe:2.31},
      {quarter:"Q4/2024",revenue:781.34,profit:30.36,yoyRevenue:-7.72,yoyProfit:-56.67,pe:45.82,pb:0.94,roe:2.08},
      {quarter:"Q1/2025",revenue:3049.19,profit:782.71,yoyRevenue:1901.65,yoyProfit:1013.34,pe:18.20,pb:1.41,roe:6.69},
      {quarter:"Q2/2025",revenue:574.56,profit:405.24,yoyRevenue:-35.57,yoyProfit:68.11,pe:19.35,pb:1.40,roe:7.04},
      {quarter:"Q3/2025",revenue:1347.29,profit:307.28,yoyRevenue:41.76,yoyProfit:56.62,pe:18.64,pb:1.36,roe:7.09},
      {quarter:"Q4/2025",revenue:1648.41,profit:608.40,yoyRevenue:110.97,yoyProfit:1903.90,pe:13.88,pb:1.29,roe:9.70}
    ]
  },
  KDC: {
    currentPE: 23.79, currentPB: 1.79, currentROE: 8.96,
    quarters: [
      {quarter:"Q2/2024",revenue:1770.44,profit:7.66,yoyRevenue:-25.35,yoyProfit:-99.17,pe:-28.22,pb:2.17,roe:-6.77},
      {quarter:"Q3/2024",revenue:2303.13,profit:24.39,yoyRevenue:-2.23,yoyProfit:-66.89,pe:-30.52,pb:2.50,roe:-7.72},
      {quarter:"Q4/2024",revenue:2611.07,profit:1.62,yoyRevenue:27.41,yoyProfit:100.29,pe:422.08,pb:2.46,roe:0.54},
      {quarter:"Q1/2025",revenue:2199.78,profit:-75.49,yoyRevenue:15.92,yoyProfit:-892.21,pe:-367.83,pb:2.39,roe:-0.64},
      {quarter:"Q2/2025",revenue:2067.34,profit:103.16,yoyRevenue:16.77,yoyProfit:1245.91,pe:279.63,pb:2.27,roe:0.81},
      {quarter:"Q3/2025",revenue:2487.93,profit:51.94,yoyRevenue:8.02,yoyProfit:112.90,pe:178.39,pb:2.17,roe:1.23},
      {quarter:"Q4/2025",revenue:2536.48,profit:440.27,yoyRevenue:-2.86,yoyProfit:27005.41,pe:24.30,pb:1.79,roe:7.61}
    ]
  },
  KDH: {
    currentPE: 20.29, currentPB: 1.54, currentROE: 6.60,
    quarters: [
      {quarter:"Q2/2024",revenue:645.16,profit:278.53,yoyRevenue:9.51,yoyProfit:12.79,pe:50.17,pb:2.46,roe:4.53},
      {quarter:"Q3/2024",revenue:252.80,profit:70.36,yoyRevenue:-58.99,yoyProfit:-66.10,pe:66.43,pb:2.08,roe:3.30},
      {quarter:"Q4/2024",revenue:2063.21,profit:398.17,yoyRevenue:338.88,yoyProfit:540.37,pe:30.54,pb:1.53,roe:5.25},
      {quarter:"Q1/2025",revenue:716.28,profit:121.95,yoyRevenue:114.48,yoyProfit:92.46,pe:34.01,pb:1.77,roe:5.31},
      {quarter:"Q2/2025",revenue:1054.37,profit:199.03,yoyRevenue:63.43,yoyProfit:-28.54,pe:46.81,pb:2.13,roe:4.55},
      {quarter:"Q3/2025",revenue:1098.46,profit:235.76,yoyRevenue:334.51,yoyProfit:235.10,pe:32.07,pb:1.71,roe:5.60},
      {quarter:"Q4/2025",revenue:1819.99,profit:488.73,yoyRevenue:-11.79,yoyProfit:22.74,pe:27.13,pb:1.54,roe:5.82}
    ]
  },
  KOS: {
    currentPE: 422.86, currentPB: 3.54, currentROE: 0.82,
    quarters: [
      {quarter:"Q2/2024",revenue:461.34,profit:10.18,yoyRevenue:42.79,yoyProfit:78.24,pe:374.76,pb:3.61,roe:0.97},
      {quarter:"Q3/2024",revenue:304.74,profit:11.23,yoyRevenue:3.01,yoyProfit:143.95,pe:292.67,pb:3.64,roe:1.25},
      {quarter:"Q4/2024",revenue:435.55,profit:-2.85,yoyRevenue:18.88,yoyProfit:-161.30,pe:389.84,pb:3.62,roe:0.93},
      {quarter:"Q1/2025",revenue:226.68,profit:2.61,yoyRevenue:-4.47,yoyProfit:-9.21,pe:397.27,pb:3.63,roe:0.91},
      {quarter:"Q2/2025",revenue:436.11,profit:4.33,yoyRevenue:-5.47,yoyProfit:-57.52,pe:548.47,pb:3.62,roe:0.66},
      {quarter:"Q3/2025",revenue:351.76,profit:11.01,yoyRevenue:15.43,yoyProfit:-1.89,pe:561.20,pb:3.64,roe:0.65},
      {quarter:"Q4/2025",revenue:540.73,profit:1.00,yoyRevenue:24.15,yoyProfit:135.12,pe:435.33,pb:3.54,roe:0.82}
    ]
  },
  LPB: {
    currentPE: 14.20, currentPB: null, currentROE: 24.70,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:3644.63,profit:2421.64,yoyRevenue:48.75,yoyProfit:241.93},
      {quarter:"Q3/2024",revenue:3777.90,profit:2330.78,yoyRevenue:43.49,yoyProfit:134.76},
      {quarter:"Q4/2024",revenue:4506.72,profit:2669.82,yoyRevenue:34.69,yoyProfit:1.60},
      {quarter:"Q1/2025",revenue:3281.91,profit:2533.91,yoyRevenue:-5.27,yoyProfit:10.23},
      {quarter:"Q2/2025",revenue:3735.85,profit:2395.87,yoyRevenue:2.50,yoyProfit:-1.06},
      {quarter:"Q3/2025",revenue:4235.05,profit:2762.01,yoyRevenue:12.10,yoyProfit:18.50},
      {quarter:"Q4/2025",revenue:4781.43,profit:3730.59,yoyRevenue:6.10,yoyProfit:39.73}
    ]
  },
  MSB: {
    currentPE: 8.49, currentPB: null, currentROE: 14.14,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:2341.99,profit:1729.96,yoyRevenue:5.94,yoyProfit:6.94},
      {quarter:"Q3/2024",revenue:2396.50,profit:978.49,yoyRevenue:-1.69,yoyProfit:-26.17},
      {quarter:"Q4/2024",revenue:3138.94,profit:1616.98,yoyRevenue:31.75,yoyProfit:234.29},
      {quarter:"Q1/2025",revenue:2503.79,profit:1265.60,yoyRevenue:5.84,yoyProfit:6.00},
      {quarter:"Q2/2025",revenue:2584.84,profit:1237.49,yoyRevenue:10.37,yoyProfit:-28.47},
      {quarter:"Q3/2025",revenue:2815.32,profit:1274.18,yoyRevenue:17.48,yoyProfit:30.22},
      {quarter:"Q4/2025",revenue:3043.55,profit:1851.25,yoyRevenue:-3.04,yoyProfit:14.49}
    ]
  },
  MSN: {
    currentPE: 22.19, currentPB: 3.16, currentROE: 14.37,
    quarters: [
      {quarter:"Q2/2024",revenue:20203.52,profit:502.58,yoyRevenue:8.06,yoyProfit:377.31,pe:162.66,pb:3.47,roe:2.48},
      {quarter:"Q3/2024",revenue:21574.64,profit:701.07,yoyRevenue:6.57,yoyProfit:1349.21,pe:70.60,pb:3.19,roe:4.67},
      {quarter:"Q4/2024",revenue:22735.94,profit:691.06,yoyRevenue:8.99,yoyProfit:1279.08,pe:44.55,pb:2.85,roe:7.04},
      {quarter:"Q1/2025",revenue:18946.40,profit:393.50,yoyRevenue:0.02,yoyProfit:277.07,pe:49.92,pb:3.55,roe:5.56},
      {quarter:"Q2/2025",revenue:18425.06,profit:1032.19,yoyRevenue:-8.80,yoyProfit:105.38,pe:42.63,pb:3.53,roe:9.17},
      {quarter:"Q3/2025",revenue:21255.66,profit:1208.66,yoyRevenue:-1.48,yoyProfit:72.40,pe:34.93,pb:3.29,roe:10.46},
      {quarter:"Q4/2025",revenue:23300.56,profit:1473.96,yoyRevenue:2.48,yoyProfit:113.29,pe:28.49,pb:3.16,roe:12.53}
    ]
  },
  NKG: {
    currentPE: 38.51, currentPB: 0.84, currentROE: 2.02,
    quarters: [
      {quarter:"Q2/2024",revenue:5683.53,profit:219.63,yoyRevenue:3.21,yoyProfit:75.15,pe:13.07,pb:0.94,roe:7.49},
      {quarter:"Q3/2024",revenue:5208.82,profit:64.85,yoyRevenue:22.03,yoyProfit:174.09,pe:9.71,pb:1.03,roe:8.08},
      {quarter:"Q4/2024",revenue:4498.92,profit:18.42,yoyRevenue:0.74,yoyProfit:-17.97,pe:8.89,pb:0.91,roe:8.02},
      {quarter:"Q1/2025",revenue:4108.30,profit:65.40,yoyRevenue:-22.72,yoyProfit:-56.43,pe:14.39,pb:0.96,roe:5.89},
      {quarter:"Q2/2025",revenue:3827.08,profit:91.59,yoyRevenue:-32.66,yoyProfit:-58.30,pe:23.97,pb:0.94,roe:3.58},
      {quarter:"Q3/2025",revenue:3789.40,profit:49.53,yoyRevenue:-27.25,yoyProfit:-23.62,pe:26.64,pb:0.89,roe:2.26},
      {quarter:"Q4/2025",revenue:3174.46,profit:-9.41,yoyRevenue:-29.44,yoyProfit:-151.09,pe:31.11,pb:0.84,roe:2.93}
    ]
  },
  NLG: {
    currentPE: 16.70, currentPB: 1.06, currentROE: 5.89,
    quarters: [
      {quarter:"Q2/2024",revenue:252.29,profit:144.70,yoyRevenue:-73.54,yoyProfit:19.78,pe:35.28,pb:1.62,roe:4.58},
      {quarter:"Q3/2024",revenue:370.58,profit:-52.37,yoyRevenue:3.81,yoyProfit:-178.98,pe:43.10,pb:1.44,roe:3.29},
      {quarter:"Q4/2024",revenue:6368.54,profit:502.42,yoyRevenue:289.28,yoyProfit:73.36,pe:20.77,pb:1.11,roe:5.43},
      {quarter:"Q1/2025",revenue:1291.16,profit:108.36,yoyRevenue:530.93,yoyProfit:241.00,pe:22.80,pb:1.64,roe:7.43},
      {quarter:"Q2/2025",revenue:772.56,profit:99.33,yoyRevenue:206.22,yoyProfit:-31.36,pe:22.71,pb:1.93,roe:6.87},
      {quarter:"Q3/2025",revenue:1877.22,profit:145.96,yoyRevenue:406.57,yoyProfit:378.69,pe:13.19,pb:1.41,roe:8.79},
      {quarter:"Q4/2025",revenue:1704.15,profit:347.72,yoyRevenue:-73.24,yoyProfit:-30.79,pe:15.26,pb:1.06,roe:6.28}
    ]
  },
  NT2: {
    currentPE: 5.20, currentPB: 1.56, currentROE: 27.24,
    quarters: [
      {quarter:"Q2/2024",revenue:2186.07,profit:122.19,yoyRevenue:0.15,yoyProfit:-15.29,pe:69.46,pb:1.37,roe:1.95},
      {quarter:"Q3/2024",revenue:1711.76,profit:44.30,yoyRevenue:109.67,yoyProfit:135.80,pe:23.11,pb:1.40,roe:6.02},
      {quarter:"Q4/2024",revenue:1783.94,profit:74.56,yoyRevenue:48.60,yoyProfit:-68.95,pe:61.12,pb:1.21,roe:1.94},
      {quarter:"Q1/2025",revenue:1426.71,profit:36.96,yoyRevenue:444.74,yoyProfit:123.37,pe:20.81,pb:1.45,roe:6.79},
      {quarter:"Q2/2025",revenue:2081.26,profit:326.25,yoyRevenue:-4.79,yoyProfit:167.01,pe:12.99,pb:1.46,roe:11.62},
      {quarter:"Q3/2025",revenue:1928.24,profit:214.23,yoyRevenue:12.65,yoyProfit:383.54,pe:11.46,pb:1.66,roe:15.35},
      {quarter:"Q4/2025",revenue:2522.02,profit:552.84,yoyRevenue:41.37,yoyProfit:641.44,pe:6.70,pb:1.56,roe:24.98}
    ]
  },
  NVL: {
    currentPE: 8.98, currentPB: 1.01, currentROE: 7.31,
    warning:"NVL có lịch sử lợi nhuận biến động rất mạnh (nhiều quý lỗ nặng) theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:1588.45,profit:-6657.25,yoyRevenue:49.55,yoyProfit:-948.76,pe:-3.73,pb:0.65,roe:-15.11},
      {quarter:"Q3/2024",revenue:2012.31,profit:3119.84,yoyRevenue:87.39,yoyProfit:1729.76,pe:-7.08,pb:0.51,roe:-7.00},
      {quarter:"Q4/2024",revenue:4781.02,profit:-2350.33,yoyRevenue:135.30,yoyProfit:-242.75,pe:-3.44,pb:0.59,roe:-16.89},
      {quarter:"Q1/2025",revenue:1778.25,profit:-443.35,yoyRevenue:154.82,yoyProfit:21.81,pe:-5.39,pb:0.90,roe:-18.04},
      {quarter:"Q2/2025",revenue:1936.65,profit:-160.57,yoyRevenue:21.92,yoyProfit:97.59,pe:162.94,pb:0.72,roe:0.45},
      {quarter:"Q3/2025",revenue:1683.60,profit:-878.22,yoyRevenue:-16.33,yoyProfit:-128.15,pe:-6.77,pb:0.76,roe:-10.02},
      {quarter:"Q4/2025",revenue:1567.85,profit:3225.88,yoyRevenue:-67.21,yoyProfit:237.25,pe:23.20,pb:1.01,roe:4.19}
    ]
  },
  OCB: {
    currentPE: 8.17, currentPB: null, currentROE: 12.70,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:1986.64,profit:716.96,yoyRevenue:9.28,yoyProfit:-43.14},
      {quarter:"Q3/2024",revenue:2064.67,profit:347.20,yoyRevenue:10.68,yoyProfit:-67.95},
      {quarter:"Q4/2024",revenue:2654.66,profit:1155.67,yoyRevenue:42.97,yoyProfit:10.28},
      {quarter:"Q1/2025",revenue:2163.56,profit:712.46,yoyRevenue:13.83,yoyProfit:-25.29},
      {quarter:"Q2/2025",revenue:2179.12,profit:792.93,yoyRevenue:9.69,yoyProfit:10.60},
      {quarter:"Q3/2025",revenue:2424.22,profit:1227.94,yoyRevenue:17.41,yoyProfit:253.67},
      {quarter:"Q4/2025",revenue:2481.94,profit:1276.76,yoyRevenue:-6.51,yoyProfit:10.48}
    ]
  },
  PAN: {
    currentPE: 5.06, currentPB: 1.24, currentROE: 21.39,
    quarters: [
      {quarter:"Q2/2024",revenue:3566.00,profit:92.93,yoyRevenue:20.51,yoyProfit:49.28,pe:10.29,pb:1.04,roe:10.13},
      {quarter:"Q3/2024",revenue:5193.34,profit:186.76,yoyRevenue:36.37,yoyProfit:88.96,pe:9.02,pb:1.04,roe:11.76},
      {quarter:"Q4/2024",revenue:4407.94,profit:245.60,yoyRevenue:1.18,yoyProfit:18.90,pe:7.67,pb:0.92,roe:12.35},
      {quarter:"Q1/2025",revenue:4193.57,profit:107.67,yoyRevenue:16.81,yoyProfit:28.81,pe:11.20,pb:1.38,roe:12.68},
      {quarter:"Q2/2025",revenue:4192.69,profit:139.03,yoyRevenue:17.57,yoyProfit:49.61,pe:9.46,pb:1.23,roe:13.32},
      {quarter:"Q3/2025",revenue:5212.10,profit:156.19,yoyRevenue:0.36,yoyProfit:-16.37,pe:9.37,pb:1.20,roe:12.64},
      {quarter:"Q4/2025",revenue:4411.81,profit:269.77,yoyRevenue:0.09,yoyProfit:9.84,pe:9.81,pb:1.24,roe:12.92}
    ]
  },
  PC1: {
    currentPE: 7.93, currentPB: 1.30, currentROE: 18.79,
    quarters: [
      {quarter:"Q2/2024",revenue:3141.08,profit:158.96,yoyRevenue:113.35,yoyProfit:1362.01,pe:22.33,pb:1.58,roe:7.17},
      {quarter:"Q3/2024",revenue:2232.11,profit:159.59,yoyRevenue:3.22,yoyProfit:17379.76,pe:17.50,pb:1.51,roe:8.87},
      {quarter:"Q4/2024",revenue:2550.89,profit:68.48,yoyRevenue:-0.12,yoyProfit:106.34,pe:15.95,pb:1.35,roe:8.82},
      {quarter:"Q1/2025",revenue:1860.37,profit:55.28,yoyRevenue:-14.06,yoyProfit:-31.37,pe:19.73,pb:1.56,roe:8.09},
      {quarter:"Q2/2025",revenue:2934.93,profit:141.89,yoyRevenue:-6.56,yoyProfit:-10.74,pe:19.51,pb:1.46,roe:7.65},
      {quarter:"Q3/2025",revenue:3278.08,profit:300.87,yoyRevenue:46.86,yoyProfit:88.53,pe:17.57,pb:1.67,roe:9.96},
      {quarter:"Q4/2025",revenue:5011.42,profit:543.34,yoyRevenue:96.46,yoyProfit:693.42,pe:8.14,pb:1.30,roe:17.30}
    ]
  },
  PDR: {
    currentPE: 24.38, currentPB: 1.33, currentROE: 4.92,
    quarters: [
      {quarter:"Q2/2024",revenue:8.26,profit:49.74,yoyRevenue:237.08,yoyProfit:-81.96,pe:30.87,pb:1.67,roe:5.04},
      {quarter:"Q3/2024",revenue:2.63,profit:51.24,yoyRevenue:-99.26,yoyProfit:-49.61,pe:32.81,pb:1.48,roe:4.25},
      {quarter:"Q4/2024",revenue:648.61,profit:1.53,yoyRevenue:852.78,yoyProfit:-99.46,pe:80.23,pb:1.26,roe:1.51},
      {quarter:"Q1/2025",revenue:437.94,profit:50.61,yoyRevenue:170.01,yoyProfit:-3.76,pe:115.98,pb:1.70,roe:1.39},
      {quarter:"Q2/2025",revenue:19.93,profit:64.92,yoyRevenue:141.38,yoyProfit:30.52,pe:124.84,pb:1.83,roe:1.50},
      {quarter:"Q3/2025",revenue:506.53,profit:85.80,yoyRevenue:19175.54,yoyProfit:67.45,pe:84.06,pb:1.49,roe:1.77},
      {quarter:"Q4/2025",revenue:360.58,profit:313.74,yoyRevenue:-44.41,yoyProfit:20461.76,pe:30.99,pb:1.33,roe:4.41}
    ]
  },
  PHR: {
    currentPE: 13.00, currentPB: 2.06, currentROE: 16.36,
    quarters: [
      {quarter:"Q2/2024",revenue:271.95,profit:64.63,yoyRevenue:145.52,yoyProfit:-46.87,pe:18.40,pb:1.98,roe:11.16},
      {quarter:"Q3/2024",revenue:411.71,profit:98.28,yoyRevenue:-9.10,yoyProfit:-18.96,pe:18.19,pb:1.80,roe:10.26},
      {quarter:"Q4/2024",revenue:627.89,profit:224.07,yoyRevenue:35.50,yoyProfit:48.11,pe:13.24,pb:1.63,roe:12.46},
      {quarter:"Q1/2025",revenue:311.49,profit:95.57,yoyRevenue:-3.67,yoyProfit:30.78,pe:17.41,pb:2.17,roe:12.59},
      {quarter:"Q2/2025",revenue:367.97,profit:90.97,yoyRevenue:35.31,yoyProfit:40.76,pe:15.04,pb:2.01,roe:13.27},
      {quarter:"Q3/2025",revenue:616.79,profit:259.44,yoyRevenue:49.81,yoyProfit:163.99,pe:13.00,pb:2.16,roe:17.33},
      {quarter:"Q4/2025",revenue:498.98,profit:32.26,yoyRevenue:-20.53,yoyProfit:-85.60,pe:17.34,pb:2.06,roe:12.31}
    ]
  },
  PLX: {
    currentPE: 26.75, currentPB: null, currentROE: 6.95,
    quarters: [
      {quarter:"Q2/2024",revenue:73584.64,profit:1205.68,yoyRevenue:11.87,yoyProfit:48.28,pe:14.38,pb:2.07,roe:14.12},
      {quarter:"Q3/2024",revenue:64352.15,profit:65.87,yoyRevenue:-11.16,yoyProfit:-91.08,pe:16.81,pb:1.97,roe:11.51},
      {quarter:"Q4/2024",revenue:71055.34,profit:545.27,yoyRevenue:3.45,yoyProfit:-14.94,pe:14.91,pb:1.66,roe:11.12},
      {quarter:"Q1/2025",revenue:67890.17,profit:133.41,yoyRevenue:-9.64,yoyProfit:-87.57,pe:23.65,pb:1.76,roe:7.57},
      {quarter:"Q2/2025",revenue:76568.08,profit:1366.41,yoyRevenue:4.05,yoyProfit:827.07,pe:20.80,pb:1.75,roe:8.22},
      {quarter:"Q3/2025",revenue:83655.31,profit:610.70,yoyRevenue:30.00,yoyProfit:13.33,pe:28.18,pb:2.92,roe:10.33},
      {quarter:"Q4/2025",revenue:81871.62,profit:564.74,yoyRevenue:15.22,yoyProfit:3.57,pe:17.64,pb:1.80,roe:10.24}
    ]
  },
  PNJ: {
    currentPE: 8.84, currentPB: null, currentROE: 28.03,
    quarters: [
      {quarter:"Q2/2024",revenue:9605.15,profit:428.40,yoyRevenue:42.60,yoyProfit:26.90,pe:15.02,pb:2.93,roe:20.30},
      {quarter:"Q3/2024",revenue:7225.79,profit:215.84,yoyRevenue:3.35,yoyProfit:-14.80,pe:16.13,pb:3.13,roe:19.40},
      {quarter:"Q4/2024",revenue:8698.35,profit:730.87,yoyRevenue:-11.82,yoyProfit:15.65,pe:11.27,pb:2.13,roe:20.06},
      {quarter:"Q1/2025",revenue:9759.65,profit:677.73,yoyRevenue:-23.17,yoyProfit:-8.14,pe:14.09,pb:2.48,roe:18.57},
      {quarter:"Q2/2025",revenue:7664.65,profit:437.00,yoyRevenue:-20.20,yoyProfit:2.01,pe:15.53,pb:2.70,roe:18.13},
      {quarter:"Q3/2025",revenue:8235.61,profit:495.70,yoyRevenue:13.98,yoyProfit:129.67,pe:18.39,pb:3.61,roe:19.95},
      {quarter:"Q4/2025",revenue:9750.68,profit:1218.07,yoyRevenue:12.10,yoyProfit:66.66,pe:12.12,pb:2.59,roe:23.06}
    ]
  },
  POW: {
    currentPE: 13.02, currentPB: null, currentROE: 9.15,
    quarters: [
      {quarter:"Q2/2024",revenue:9382.19,profit:391.76,yoyRevenue:11.30,yoyProfit:211.09,pe:26.02,pb:0.89,roe:3.46},
      {quarter:"Q3/2024",revenue:6061.16,profit:396.35,yoyRevenue:6.72,yoyProfit:379.50,pe:19.26,pb:0.84,roe:4.43},
      {quarter:"Q4/2024",revenue:8619.18,profit:45.84,yoyRevenue:34.43,yoyProfit:-86.21,pe:24.97,pb:0.87,roe:3.95},
      {quarter:"Q1/2025",revenue:8150.31,profit:445.09,yoyRevenue:30.55,yoyProfit:60.32,pe:26.55,pb:1.05,roe:4.00},
      {quarter:"Q2/2025",revenue:9398.77,profit:602.42,yoyRevenue:0.18,yoyProfit:53.77,pe:22.32,pb:1.01,roe:4.61},
      {quarter:"Q3/2025",revenue:7855.19,profit:809.30,yoyRevenue:29.60,yoyProfit:104.19,pe:20.43,pb:1.25,roe:5.06},
      {quarter:"Q4/2025",revenue:8901.87,profit:569.85,yoyRevenue:3.28,yoyProfit:1143.15,pe:14.90,pb:1.13,roe:7.33}
    ]
  },
  PPC: {
    currentPE: 14.71, currentPB: null, currentROE: 4.62,
    warning:"PPC có lợi nhuận biến động mạnh theo quý (một số quý gần lỗ) theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:2469.24,profit:93.83,yoyRevenue:76.76,yoyProfit:-41.88,pe:8.42,pb:0.89,roe:10.34},
      {quarter:"Q3/2024",revenue:1465.47,profit:-5.31,yoyRevenue:9.64,yoyProfit:-106.31,pe:9.03,pb:0.78,roe:8.68},
      {quarter:"Q4/2024",revenue:1750.28,profit:181.15,yoyRevenue:-1.09,yoyProfit:20.76,pe:8.71,pb:0.82,roe:8.96},
      {quarter:"Q1/2025",revenue:1536.11,profit:52.33,yoyRevenue:-23.04,yoyProfit:-66.75,pe:11.55,pb:0.81,roe:7.03},
      {quarter:"Q2/2025",revenue:1940.20,profit:6.09,yoyRevenue:-21.43,yoyProfit:-93.51,pe:14.30,pb:0.74,roe:5.14},
      {quarter:"Q3/2025",revenue:1496.74,profit:-14.29,yoyRevenue:2.13,yoyProfit:-169.10,pe:14.73,pb:0.74,roe:4.97},
      {quarter:"Q4/2025",revenue:1592.77,profit:121.05,yoyRevenue:-9.00,yoyProfit:-33.18,pe:19.70,pb:0.73,roe:3.67}
    ]
  },
  PTB: {
    currentPE: 6.40, currentPB: null, currentROE: 16.71,
    quarters: [
      {quarter:"Q2/2024",revenue:1608.06,profit:110.44,yoyRevenue:9.06,yoyProfit:8.89,pe:12.79,pb:1.47,roe:11.94},
      {quarter:"Q3/2024",revenue:1484.99,profit:79.60,yoyRevenue:25.11,yoyProfit:3.91,pe:12.62,pb:1.48,roe:11.92},
      {quarter:"Q4/2024",revenue:1936.67,profit:89.45,yoyRevenue:25.11,yoyProfit:72.90,pe:8.90,pb:1.13,roe:13.18},
      {quarter:"Q1/2025",revenue:1620.23,profit:113.01,yoyRevenue:12.74,yoyProfit:26.72,pe:9.48,pb:1.26,roe:13.67},
      {quarter:"Q2/2025",revenue:1904.63,profit:124.57,yoyRevenue:18.44,yoyProfit:12.80,pe:8.61,pb:1.18,roe:13.99},
      {quarter:"Q3/2025",revenue:1683.94,profit:135.86,yoyRevenue:13.40,yoyProfit:70.69,pe:7.87,pb:1.38,roe:15.56},
      {quarter:"Q4/2025",revenue:2091.29,profit:123.24,yoyRevenue:7.98,yoyProfit:37.78,pe:6.98,pb:1.25,roe:16.28}
    ]
  },
  PVD: {
    currentPE: 15.64, currentPB: null, currentROE: 7.05,
    quarters: [
      {quarter:"Q2/2024",revenue:2283.20,profit:138.24,yoyRevenue:61.88,yoyProfit:-15.50,pe:22.21,pb:0.92,roe:4.29},
      {quarter:"Q3/2024",revenue:2438.22,profit:181.76,yoyRevenue:76.54,yoyProfit:20.72,pe:19.49,pb:0.86,roe:4.45},
      {quarter:"Q4/2024",revenue:2808.35,profit:219.60,yoyRevenue:60.71,yoyProfit:12.54,pe:14.14,pb:0.62,roe:4.58},
      {quarter:"Q1/2025",revenue:1502.99,profit:152.86,yoyRevenue:-14.39,yoyProfit:-3.20,pe:16.98,pb:0.73,roe:4.43},
      {quarter:"Q2/2025",revenue:2447.44,profit:239.69,yoyRevenue:7.19,yoyProfit:73.39,pe:14.32,pb:0.69,roe:5.00},
      {quarter:"Q3/2025",revenue:2570.71,profit:278.25,yoyRevenue:5.43,yoyProfit:53.08,pe:19.35,pb:1.02,roe:5.46},
      {quarter:"Q4/2025",revenue:4369.48,profit:364.82,yoyRevenue:55.59,yoyProfit:66.13,pe:16.59,pb:1.02,roe:6.36}
    ]
  },
  PVT: {
    currentPE: 9.13, currentPB: null, currentROE: 13.39,
    quarters: [
      {quarter:"Q2/2024",revenue:2988.08,profit:288.28,yoyRevenue:41.28,yoyProfit:-6.75,pe:9.80,pb:1.37,roe:13.88},
      {quarter:"Q3/2024",revenue:2934.15,profit:364.97,yoyRevenue:15.04,yoyProfit:46.46,pe:8.11,pb:1.20,roe:15.31},
      {quarter:"Q4/2024",revenue:3267.63,profit:209.06,yoyRevenue:18.70,yoyProfit:-9.17,pe:6.82,pb:0.97,roe:15.05},
      {quarter:"Q1/2025",revenue:2789.55,profit:215.06,yoyRevenue:9.99,yoyProfit:-6.87,pe:7.89,pb:1.07,roe:14.22},
      {quarter:"Q2/2025",revenue:4312.63,profit:294.78,yoyRevenue:44.33,yoyProfit:2.26,pe:7.65,pb:1.02,roe:13.84},
      {quarter:"Q3/2025",revenue:4419.45,profit:263.38,yoyRevenue:50.62,yoyProfit:-27.84,pe:9.81,pb:1.16,roe:12.22},
      {quarter:"Q4/2025",revenue:4444.13,profit:265.90,yoyRevenue:36.00,yoyProfit:27.19,pe:9.96,pb:1.19,roe:12.66}
    ]
  },
  REE: {
    currentPE: 11.81, currentPB: null, currentROE: 12.83,
    quarters: [
      {quarter:"Q2/2024",revenue:2182.95,profit:353.86,yoyRevenue:0.31,yoyProfit:-27.63,pe:17.10,pb:1.73,roe:10.33},
      {quarter:"Q3/2024",revenue:2031.36,profit:479.85,yoyRevenue:3.38,yoyProfit:6.72,pe:16.81,pb:1.68,roe:10.29},
      {quarter:"Q4/2024",revenue:2338.10,profit:678.29,yoyRevenue:13.14,yoyProfit:34.55,pe:16.28,pb:1.72,roe:11.01},
      {quarter:"Q1/2025",revenue:2073.50,profit:611.40,yoyRevenue:12.56,yoyProfit:27.25,pe:17.03,pb:1.85,roe:11.42},
      {quarter:"Q2/2025",revenue:2516.32,profit:622.93,yoyRevenue:15.27,yoyProfit:76.04,pe:14.74,pb:1.79,roe:12.55},
      {quarter:"Q3/2025",revenue:2555.16,profit:674.23,yoyRevenue:25.79,yoyProfit:40.51,pe:13.00,pb:1.65,roe:13.20},
      {quarter:"Q4/2025",revenue:2880.57,profit:619.99,yoyRevenue:23.20,yoyProfit:-8.60,pe:12.85,pb:1.55,roe:12.69}
    ]
  },
  SAB: {
    currentPE: 12.88, currentPB: null, currentROE: 22.01,
    quarters: [
      {quarter:"Q2/2024",revenue:8135.10,profit:1248.29,yoyRevenue:-2.94,yoyProfit:7.68,pe:16.71,pb:2.97,roe:17.21},
      {quarter:"Q3/2024",revenue:7737.39,profit:1119.10,yoyRevenue:3.11,yoyProfit:7.15,pe:16.00,pb:2.77,roe:17.56},
      {quarter:"Q4/2024",revenue:9048.63,profit:965.46,yoyRevenue:5.45,yoyProfit:1.99,pe:15.17,pb:2.82,roe:18.23},
      {quarter:"Q1/2025",revenue:5899.50,profit:793.11,yoyRevenue:-18.55,yoyProfit:-20.47,pe:15.26,pb:2.62,roe:17.17},
      {quarter:"Q2/2025",revenue:6867.33,profit:1207.50,yoyRevenue:-15.58,yoyProfit:-3.27,pe:14.27,pb:2.73,roe:16.07},
      {quarter:"Q3/2025",revenue:6509.18,profit:1360.54,yoyRevenue:-15.87,yoyProfit:21.57,pe:14.91,pb:2.84,roe:16.36},
      {quarter:"Q4/2025",revenue:6972.99,profit:1062.39,yoyRevenue:-22.94,yoyProfit:10.04,pe:13.98,pb:2.92,roe:17.46}
    ]
  },
  SAM: {
    currentPE: 23.64, currentPB: null, currentROE: 2.47,
    warning:"SAM có lợi nhuận rất mỏng và biến động cực mạnh theo quý (P/E dao động 26-126 lần) theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:1635.06,profit:42.29,yoyRevenue:231.60,yoyProfit:3843.32,pe:33.65,pb:0.62,roe:1.85},
      {quarter:"Q3/2024",revenue:918.83,profit:2.57,yoyRevenue:75.42,yoyProfit:-60.33,pe:36.37,pb:0.63,roe:1.75},
      {quarter:"Q4/2024",revenue:871.94,profit:18.51,yoyRevenue:16.51,yoyProfit:422.92,pe:27.89,pb:0.58,roe:2.12},
      {quarter:"Q1/2025",revenue:1163.69,profit:3.52,yoyRevenue:86.68,yoyProfit:-83.23,pe:46.13,pb:0.77,roe:1.67},
      {quarter:"Q2/2025",revenue:1403.79,profit:31.11,yoyRevenue:-14.14,yoyProfit:-26.43,pe:49.18,pb:0.68,roe:1.38},
      {quarter:"Q3/2025",revenue:1540.11,profit:12.26,yoyRevenue:67.62,yoyProfit:377.71,pe:41.95,pb:0.68,roe:1.62},
      {quarter:"Q4/2025",revenue:2018.60,profit:49.51,yoyRevenue:131.51,yoyProfit:167.54,pe:26.45,pb:0.62,roe:2.37}
    ]
  },
  SBT: {
    currentPE: 25.02, currentPB: null, currentROE: 6.90,
    quarters: [
      {quarter:"Q2/2024",revenue:9488.66,profit:194.73,yoyRevenue:38.61,yoyProfit:192.07,pe:12.74,pb:0.93,roe:7.55},
      {quarter:"Q3/2024",revenue:6832.18,profit:217.20,yoyRevenue:7.16,yoyProfit:11.51,pe:13.35,pb:1.00,roe:7.67},
      {quarter:"Q4/2024",revenue:7551.15,profit:217.95,yoyRevenue:7.47,yoyProfit:41.47,pe:16.99,pb:1.36,roe:8.10},
      {quarter:"Q1/2025",revenue:7303.76,profit:216.67,yoyRevenue:18.35,yoyProfit:6.03,pe:24.50,pb:1.96,roe:8.20},
      {quarter:"Q2/2025",revenue:6857.93,profit:160.66,yoyRevenue:-27.73,yoyProfit:-17.49,pe:26.18,pb:2.07,roe:7.78},
      {quarter:"Q3/2025",revenue:5386.65,profit:201.08,yoyRevenue:-21.16,yoyProfit:-7.42,pe:25.44,pb:1.92,roe:7.51},
      {quarter:"Q4/2025",revenue:6749.70,profit:160.87,yoyRevenue:-10.61,yoyProfit:-26.19,pe:24.83,pb:1.66}
    ]
  },
  SCR: {
    currentPE: 25.01, currentPB: null, currentROE: 1.67,
    warning:"SCR có lợi nhuận rất mỏng và cực kỳ biến động theo quý (P/E âm hoặc trên 100 lần nhiều quý) theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:75.59,profit:-3.70,yoyRevenue:10.01,yoyProfit:-258.11,pe:312.43,pb:0.43,roe:0.14},
      {quarter:"Q3/2024",revenue:184.56,profit:0.61,yoyRevenue:49.92,yoyProfit:-38.25,pe:335.79,pb:0.47,roe:0.13},
      {quarter:"Q4/2024",revenue:470.52,profit:1.11,yoyRevenue:378.07,yoyProfit:-75.55,pe:791.04,pb:0.48,roe:0.06},
      {quarter:"Q1/2025",revenue:109.90,profit:1.51,yoyRevenue:58.12,yoyProfit:-69.24,pe:-7652.78,pb:0.71,roe:-0.01},
      {quarter:"Q2/2025",revenue:409.08,profit:29.44,yoyRevenue:441.22,yoyProfit:896.14,pe:108.43,pb:0.70,roe:0.64},
      {quarter:"Q3/2025",revenue:431.64,profit:1.24,yoyRevenue:133.88,yoyProfit:102.58,pe:91.58,pb:0.59,roe:0.64},
      {quarter:"Q4/2025",revenue:276.88,profit:44.13,yoyRevenue:-41.15,yoyProfit:3858.80,pe:34.13,pb:0.49,roe:1.45}
    ]
  },
  SCS: {
    currentPE: 6.66, currentPB: null, currentROE: 47.51,
    quarters: [
      {quarter:"Q2/2024",revenue:264.10,profit:189.54,yoyRevenue:53.21,yoyProfit:46.78,pe:13.11,pb:5.66,roe:42.28},
      {quarter:"Q3/2024",revenue:265.91,profit:185.77,yoyRevenue:54.97,yoyProfit:45.58,pe:12.70,pb:5.25,roe:45.45},
      {quarter:"Q4/2024",revenue:294.06,profit:170.24,yoyRevenue:47.91,yoyProfit:32.60,pe:8.85,pb:4.28,roe:48.72},
      {quarter:"Q1/2025",revenue:266.34,profit:169.92,yoyRevenue:25.15,yoyProfit:15.37,pe:9.56,pb:4.23,roe:51.15},
      {quarter:"Q2/2025",revenue:291.74,profit:189.06,yoyRevenue:10.47,yoyProfit:-0.25,pe:7.89,pb:3.88,roe:48.09},
      {quarter:"Q3/2025",revenue:311.57,profit:203.97,yoyRevenue:17.17,yoyProfit:9.79,pe:7.55,pb:3.30,roe:48.58},
      {quarter:"Q4/2025",revenue:327.00,profit:188.11,yoyRevenue:11.20,yoyProfit:10.50,pe:7.35,pb:3.45,roe:50.62}
    ]
  },
  SHB: {
    currentPE: 5.27, currentPB: null, currentROE: 18.13,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:4412.04,profit:2285.23,yoyRevenue:7.41,yoyProfit:17.10},
      {quarter:"Q3/2024",revenue:3261.81,profit:1739.93,yoyRevenue:-26.23,yoyProfit:-15.48},
      {quarter:"Q4/2024",revenue:8388.20,profit:2087.50,yoyRevenue:56.61,yoyProfit:260.50},
      {quarter:"Q1/2025",revenue:5543.67,profit:3496.35,yoyRevenue:7.23,yoyProfit:8.94},
      {quarter:"Q2/2025",revenue:9160.06,profit:3646.90,yoyRevenue:107.62,yoyProfit:59.59},
      {quarter:"Q3/2025",revenue:5323.82,profit:2606.72,yoyRevenue:63.22,yoyProfit:49.82},
      {quarter:"Q4/2025",revenue:187.36,profit:2210.32,yoyRevenue:-97.77,yoyProfit:5.88}
    ]
  },
  SJS: {
    currentPE: 30.06, currentPB: null, currentROE: 13.98,
    warning:"SJS có doanh thu/lợi nhuận biến động mạnh theo quý (đặc thù ghi nhận doanh thu BĐS) theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:118.81,profit:52.27,yoyRevenue:539.19,yoyProfit:-7.91,pe:34.72,pb:2.64,roe:7.84},
      {quarter:"Q3/2024",revenue:127.61,profit:47.07,yoyRevenue:-26.34,yoyProfit:32.80,pe:44.07,pb:3.47,roe:8.09},
      {quarter:"Q4/2024",revenue:281.31,profit:125.10,yoyRevenue:44.53,yoyProfit:53.57,pe:36.82,pb:3.32,roe:9.44},
      {quarter:"Q1/2025",revenue:143.35,profit:67.24,yoyRevenue:21.19,yoyProfit:52.55,pe:67.62,pb:6.50,roe:9.99},
      {quarter:"Q2/2025",revenue:200.65,profit:103.88,yoyRevenue:68.88,yoyProfit:98.76,pe:55.51,pb:6.04,roe:11.41},
      {quarter:"Q3/2025",revenue:26.72,profit:2.88,yoyRevenue:-79.06,yoyProfit:-93.88,pe:51.59,pb:4.77,roe:9.63},
      {quarter:"Q4/2025",revenue:380.01,profit:187.32,yoyRevenue:35.08,yoyProfit:49.74,pe:48.25,pb:5.09,roe:11.12}
    ]
  },
  SSB: {
    currentPE: 18.09, currentPB: null, currentROE: 7.74,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:2741.58,profit:1381.79,yoyRevenue:81.86,yoyProfit:83.38},
      {quarter:"Q3/2024",revenue:2797.22,profit:1011.97,yoyRevenue:70.77,yoyProfit:11.43},
      {quarter:"Q4/2024",revenue:2425.90,profit:1220.94,yoyRevenue:9.51,yoyProfit:5.14},
      {quarter:"Q1/2025",revenue:2450.48,profit:3492.49,yoyRevenue:22.42,yoyProfit:190.72},
      {quarter:"Q2/2025",revenue:2464.39,profit:1133.28,yoyRevenue:-10.11,yoyProfit:-17.98},
      {quarter:"Q3/2025",revenue:2337.10,profit:779.49,yoyRevenue:-16.45,yoyProfit:-22.97},
      {quarter:"Q4/2025",revenue:2451.87,profit:104.29,yoyRevenue:1.07,yoyProfit:-91.46}
    ]
  },
  SZC: {
    currentPE: 17.38, currentPB: null, currentROE: 7.43,
    quarters: [
      {quarter:"Q2/2024",revenue:262.43,profit:102.23,yoyRevenue:-8.93,yoyProfit:6.52,pe:18.56,pb:2.29,roe:11.90},
      {quarter:"Q3/2024",revenue:164.77,profit:59.59,yoyRevenue:-20.83,yoyProfit:8.17,pe:22.72,pb:2.51,roe:10.57},
      {quarter:"Q4/2024",revenue:231.66,profit:71.71,yoyRevenue:-10.39,yoyProfit:27.91,pe:16.97,pb:1.78,roe:12.48},
      {quarter:"Q1/2025",revenue:414.23,profit:126.35,yoyRevenue:93.81,yoyProfit:94.15,pe:18.34,pb:2.08,roe:11.78},
      {quarter:"Q2/2025",revenue:217.84,profit:94.93,yoyRevenue:-16.99,yoyProfit:-7.14,pe:16.43,pb:1.87,roe:11.41},
      {quarter:"Q3/2025",revenue:86.48,profit:20.82,yoyRevenue:-47.51,yoyProfit:-65.06,pe:17.70,pb:1.79,roe:10.07},
      {quarter:"Q4/2025",revenue:379.42,profit:102.70,yoyRevenue:63.79,yoyProfit:43.23,pe:15.14,pb:1.63,roe:10.93}
    ]
  },
  TCB: {
    currentPE: 9.33, currentPB: null, currentROE: 15.56,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:9477.93,profit:6193.36,yoyRevenue:50.57,yoyProfit:39.02},
      {quarter:"Q3/2024",revenue:8928.68,profit:5737.51,yoyRevenue:22.78,yoyProfit:24.38},
      {quarter:"Q4/2024",revenue:8601.82,profit:3371.07,yoyRevenue:13.22,yoyProfit:-24.06},
      {quarter:"Q1/2025",revenue:8305.39,profit:5947.96,yoyRevenue:-2.28,yoyProfit:-4.39},
      {quarter:"Q2/2025",revenue:9137.08,profit:6247.36,yoyRevenue:-3.60,yoyProfit:0.87},
      {quarter:"Q3/2025",revenue:9924.64,profit:6419.34,yoyRevenue:11.15,yoyProfit:11.88},
      {quarter:"Q4/2025",revenue:10787.98,profit:6675.56,yoyRevenue:25.42,yoyProfit:98.03}
    ]
  },
  TCH: {
    currentPE: 61.21, currentPB: null, currentROE: 1.79,
    warning:"TCH có doanh thu và lợi nhuận suy giảm liên tục nhiều quý gần đây (P/E hiện tại rất cao do lợi nhuận co lại) theo dữ liệu KAFI — cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:828.39,profit:141.01,yoyRevenue:161.46,yoyProfit:32.70,pe:12.04,pb:1.16,roe:9.98},
      {quarter:"Q3/2024",revenue:1418.79,profit:219.75,yoyRevenue:458.29,yoyProfit:295.81,pe:9.06,pb:1.01,roe:11.52},
      {quarter:"Q4/2024",revenue:1560.97,profit:306.56,yoyRevenue:-3.23,yoyProfit:13.65,pe:11.73,pb:1.20,roe:11.64},
      {quarter:"Q1/2025",revenue:858.84,profit:187.68,yoyRevenue:-46.96,yoyProfit:-39.91,pe:19.23,pb:1.69,roe:9.09},
      {quarter:"Q2/2025",revenue:390.36,profit:37.87,yoyRevenue:-52.88,yoyProfit:-73.14,pe:20.30,pb:2.09,roe:7.95},
      {quarter:"Q3/2025",revenue:345.93,profit:40.21,yoyRevenue:-75.62,yoyProfit:-81.70,pe:19.30,pb:1.24,roe:5.73},
      {quarter:"Q4/2025",revenue:317.03,profit:52.43,yoyRevenue:-79.69,yoyProfit:-82.90,pe:43.06,pb:1.43,roe:3.04}
    ]
  },
  TMS: {
    currentPE: 17.18, currentPB: null, currentROE: 8.78,
    quarters: [
      {quarter:"Q2/2024",revenue:829.90,profit:38.09,yoyRevenue:57.09,yoyProfit:85.34,pe:31.16,pb:1.92,roe:6.14},
      {quarter:"Q3/2024",revenue:911.87,profit:73.91,yoyRevenue:36.75,yoyProfit:53.73,pe:27.08,pb:1.82,roe:6.77},
      {quarter:"Q4/2024",revenue:917.50,profit:52.92,yoyRevenue:15.74,yoyProfit:-54.31,pe:35.07,pb:1.77,roe:4.83},
      {quarter:"Q1/2025",revenue:711.45,profit:91.40,yoyRevenue:2.10,yoyProfit:142.70,pe:27.75,pb:1.73,roe:6.42},
      {quarter:"Q2/2025",revenue:875.51,profit:76.74,yoyRevenue:5.50,yoyProfit:101.47,pe:23.59,pb:1.68,roe:7.27},
      {quarter:"Q3/2025",revenue:934.58,profit:92.45,yoyRevenue:2.49,yoyProfit:25.09,pe:22.86,pb:1.69,roe:7.59},
      {quarter:"Q4/2025",revenue:983.09,profit:101.48,yoyRevenue:7.15,yoyProfit:91.77,pe:19.20,pb:1.67,roe:8.84}
    ]
  },
  TPB: {
    currentPE: 6.30, currentPB: null, currentROE: 17.91,
    isBank:true,
    quarters: [
      {quarter:"Q2/2024",revenue:3236.77,profit:1522.56,yoyRevenue:18.61,yoyProfit:17.74},
      {quarter:"Q3/2024",revenue:3173.83,profit:1383.03,yoyRevenue:7.13,yoyProfit:9.52},
      {quarter:"Q4/2024",revenue:3068.67,profit:1703.25,yoyRevenue:-23.21,yoyProfit:244.84},
      {quarter:"Q1/2025",revenue:3383.62,profit:1686.69,yoyRevenue:-1.28,yoyProfit:15.31},
      {quarter:"Q2/2025",revenue:3151.33,profit:1629.60,yoyRevenue:-2.64,yoyProfit:7.03},
      {quarter:"Q3/2025",revenue:3237.62,profit:1520.64,yoyRevenue:2.01,yoyProfit:9.95},
      {quarter:"Q4/2025",revenue:3598.60,profit:2565.06,yoyRevenue:17.27,yoyProfit:50.60}
    ]
  },
  VCG: {
    currentPE: 3.26, currentPB: null, currentROE: 38.92,
    warning:"VCG có lợi nhuận Q2/2025 tăng đột biến (yoyProfit ~3989%), có thể do khoản lợi nhuận bất thường/một lần — P/E và ROE hiện tại bị ảnh hưởng mạnh, cần thận trọng khi đánh giá.",
    quarters: [
      {quarter:"Q2/2024",revenue:2807.93,profit:97.56,yoyRevenue:-38.54,yoyProfit:-12.78,pe:13.11,pb:1.38,roe:10.86},
      {quarter:"Q3/2024",revenue:2675.29,profit:80.26,yoyRevenue:12.33,yoyProfit:-22.75,pe:14.98,pb:1.51,roe:10.27},
      {quarter:"Q4/2024",revenue:4731.18,profit:285.59,yoyRevenue:24.85,yoyProfit:95.52,pe:13.76,pb:1.58,roe:12.02},
      {quarter:"Q1/2025",revenue:2596.05,profit:127.96,yoyRevenue:-2.25,yoyProfit:-72.37,pe:27.77,pb:2.00,roe:7.36},
      {quarter:"Q2/2025",revenue:4387.36,profit:278.93,yoyRevenue:56.25,yoyProfit:185.91,pe:22.04,pb:2.13,roe:9.53},
      {quarter:"Q3/2025",revenue:4429.33,profit:3282.11,yoyRevenue:65.56,yoyProfit:3989.29,pe:3.11,pb:1.10,roe:44.30},
      {quarter:"Q4/2025",revenue:4651.73,profit:243.83,yoyRevenue:-1.68,yoyProfit:-14.62,pe:3.91,pb:1.27,roe:37.60}
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
