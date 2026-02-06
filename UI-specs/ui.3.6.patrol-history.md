# UI Spec 3.6: Màn hình Tóm tắt Lịch sử Tuần tra

## 1. Visual Style (Aesthetics)
- **Concept:** "Hồ sơ Báo cáo số" - Tích hợp cùng màn hình Báo cáo.
- **Theme:** Read-only, Desktop-style clarity. Sử dụng các khối thông tin lớn, chữ số đậm để dễ đối soát.
- **Header:** Hiển thị thời gian thực hiện (Start - End) và nhãn "ĐÃ BÁO CÁO" màu xanh lá.

## 2. Bố cục & Thành phần (Layout & Composition)
### 2.1. Thẻ Thông tin Chính (Main Info Card)
- **Tiêu đề:** Tên tuyến tuần tra.
- **Định danh:** Hiển thị Mã ID (VD: R-101) - Đây là màn hình báo cáo nên cần ID để tra cứu.
- **Stats Grid:** Quãng đường (km), Thời gian (phút).

### 2.2. Chi tiết Báo cáo (Metric Rows)
- **Đồng bộ GPS:** Icon cloud-done, hiển thị trạng thái đã lưu trữ.
- **Sự cố phát hiện:** Icon alert-circle. Hiển thị số lượng sự cố.
- **Xác nhận:** Icon checkmark-circle, hiển thị thông tin nhân viên và chữ ký số.

## 3. Tương tác & Luồng (Interaction & Flow)
- **Hành động:** Chế độ Read-only khi `status === 'ĐÃ BÁO CÁO'`.
- **Nút Hành động:** "ĐÓNG TÓM TẮT" thay cho "GỬI BÁO CÁO".

## 4. Metadata cho Developer
- **Screen File:** `app/patrol-report.tsx`.
- **Navigation Payload:** Nhận `routeId`, `routeName` từ `patrol.tsx`.
