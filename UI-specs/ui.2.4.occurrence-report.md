# UI Spec 2.4: Màn hình Báo cáo Sự cố (Patrol Occurrence)

## 1. Visual Style (Aesthetics)
- **Concept:** "Patrol Observation" - Giao diện báo cáo nhanh dành cho nhân viên đi tuần.
- **Theme:** **Adaptive Theme**.
- **Màu sắc:** Tương tự UI 2.3 nhưng sử dụng nhãn và context liên quan đến tuần tra.

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** Nhân viên nhấn nút **"BÁO CÁO SỰ CỐ"** từ **Màn hình Chi tiết Tuyến (UI 3.3)**.
- **Quy trình:** Chụp bằng chứng (Ảnh/Video) -> Chọn mức độ sự cố (Thông thường/Nghiêm trọng) -> Chọn nhanh lỗi hệ thống -> Nhấn Gửi -> Popup Xác nhận -> Đồng bộ.
- **Điểm kết thúc (Exit):** Sau khi gửi thành công, quay về màn hình Chi tiết Tuyến hoặc Dashboard.

## 3. Layout & Composition
- **Header:** Tiêu đề "Báo cáo Sự cố".
- **Status Selection:** Phân loại mức độ sự cố:
    - **Thông thường (Warning Yellow):** Các lỗi nhỏ, vệ sinh, hư hỏng nhẹ.
    - **Nghiêm trọng (Danger Red):** Cháy nổ, đột nhập, mất an ninh.

## 4. Metadata cho Developer
- **Screen Path:** `app/occurrence-report.tsx`
- **Context:** Không kết thúc Mission (khác with Báo cáo sự vụ).
- **Validation:** Ít nhất 1 bằng chứng và đã chọn mức độ.
