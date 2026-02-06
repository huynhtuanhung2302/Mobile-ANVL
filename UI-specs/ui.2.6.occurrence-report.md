# UI Spec 2.6: Màn hình Báo cáo Sự cố/Sự vụ (Patrol Occurrence)

## 1. Visual Style (Aesthetics)
- **Concept:** "Patrol Observation" - Giao diện báo cáo nhanh dành cho nhân viên đi tuần.
- **Theme:** **Adaptive Theme**.
- **Màu sắc:** Tương tự UI 2.3 nhưng sử dụng nhãn và context liên quan đến tuần tra.

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** Nhân viên nhấn nút **"BÁO CÁO SỰ CỐ"** từ **Màn hình Chi tiết Tuyến (UI 3.3)**.
- **Quy trình:** Chụp bằng chứng (Ảnh/Video/Ghi âm) -> Chọn mức độ sự cố (Thông thường/Nghiêm trọng) -> Chọn nhanh lỗi -> Nhập mô tả -> Nhấn Gửi -> Popup Xác nhận -> Đồng bộ. Nhãn nút: **"GỬI BÁO CÁO SỰ CỐ/SỰ VỤ"** (Tương tự UI 2.3).
- **Điểm kết thúc (Exit):** Sau khi gửi thành công, hiển thị **Popup Thành công** với đếm ngược 5s. Tự động quay về Dashboard.

## 3. Layout & Composition
- **Header:** 
    - Tiêu đề: Theo quy tắc Dynamic Header (**"Báo cáo sự vụ"** cho TTCH, **"Báo cáo sự cố"** cho Tuần tra).
    - *Lưu ý: Không hiển thị nhãn "PATROL INTERFACE" hay "COMMAND INTERFACE"*.
- **Evidence Section:** Hỗ trợ Ảnh, Video và Ghi âm.
- **Status Selection:** Phân loại mức độ sự cố:
    - **Thông thường (Warning Yellow):** Các lỗi nhỏ, vệ sinh, hư hỏng nhẹ.
    - **Nghiêm trọng (Danger Red):** Cháy nổ, đột nhập, mất an ninh.
- **Quick Tags:** Các thẻ chọn nhanh nội dung lỗi (Cháy nổ, Đột nhập, Hư hỏng TS, v.v.).
- **Detail Input:** Ô nhập liệu đa dòng cho mô tả chi tiết.

## 4. Metadata cho Developer
- **Screen Path:** `app/occurrence-report.tsx`
- **Context:** Không kết thúc Mission (khác với Báo cáo sự vụ).
- **Validation:** Ít nhất 1 bằng chứng và đã chọn mức độ.
- **Components:** Sử dụng `ConfirmationPopup` cho việc gửi và thoát màn hình.
