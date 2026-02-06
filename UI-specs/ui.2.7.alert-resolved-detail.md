# UI Spec 2.7: Màn hình Tổng hợp Sự vụ (Resolved Detail)

## 1. Visual Style (Aesthetics)
- **Concept:** "Audit & Verification" - Giao diện báo cáo sạch sẽ, chuyên nghiệp, tập trung vào tính xác thực của dữ liệu lịch sử.
- **Theme:** **Safe Theme** (Tone màu Xanh lá là chủ đạo).
- **Màu sắc:** Sử dụng màu `safe` cho các biểu hiệu trạng thái hoàn thành.

## 2. Luồng nghiệp vụ (Business Flow)
- **Entry:** Nhấn vào một sự vụ trong tab **ĐÃ BÁO CÁO** hoặc **KẾT THÚC** tại màn hình Danh sách Cảnh báo (UI 2.4).
- **Hành động:** 
    - Xem lại toàn bộ thông tin bối cảnh và báo cáo đã gửi.
    - Theo dõi tiến trình xác nhận từ trung tâm chỉ huy.
- **Điểm kết thúc (Exit):** Quay lại màn hình Danh sách Cảnh báo.

## 3. Layout & Composition
- **Header:** 
    - Tiêu đề: **LỊCH SỬ XỬ LÝ**.
    - Phụ đề: **TỔNG HỢP SỰ VỤ**.
- **Status Banner (Linh hoạt):** 
    - **Nếu trạng thái = REPORTED:** Hiển thị thanh màu Xanh dương với thông điệp: **"ĐANG CHỜ TRUNG TÂM CHỈ HUY XÁC NHẬN"**. Kèm icon `time`.
    - **Nếu trạng thái = FINISHED:** Hiển thị thanh màu Xanh lá với thông điệp: **"ĐÃ HOÀN THÀNH XỬ LÝ"**. Kèm icon `checkmark-circle`.
- **Section 1: Thông tin Cảnh báo gốc** (Bối cảnh ban đầu từ IOC).
- **Section 2: Báo cáo kết quả xử lý** (Dữ liệu từ hiện trường).
    - Tên nhân viên thực hiện.
    - Thời gian đóng sự vụ.
    - Kết luận và nội dung xử lý chi tiết.
- **Image Gallery:** Hiển thị các ảnh bằng chứng đã chụp lúc làm báo cáo.

## 4. Metadata cho Developer
- **Screen Path:** `app/alert-resolved-detail.tsx`
- **Params:** Nhận `incidentId`, `alertType`, `severity`, `location`, `note` qua router params.
