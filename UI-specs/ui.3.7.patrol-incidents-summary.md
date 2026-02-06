# UI Spec 3.7: Màn hình Tổng hợp Sự cố Tuần tra

## 1. Visual Style (Aesthetics)
- **Concept:** "Nhật ký Bất thường".
- **Theme:** List-based, sử dụng các thẻ (Cards) riêng biệt cho từng sự cố.
- **Màu sắc nhấn:** Màu cam (#FF9500) hoặc đỏ tùy theo mức độ nghiêm trọng/trạng thái.

## 2. Bố cục & Thành phần (Layout & Composition)
### 2.1. Thẻ Sự cố (Incident Card)
- **Header:** Loại sự cố (VD: Cửa hỏng) và thời gian ghi nhận.
- **Body:** 
    - Mã báo cáo: Hiển thị Mã ID Sự cố (VD: #OCC-101).
    - Vị trí chi tiết: Tòa nhà, khu vực.
    - Mô tả: Nội dung ghi chú từ nhân viên.
- **Footer:** 
    - Badge trạng thái xử lý (Đang xử lý, Đã tiếp nhận).
    - Nút "XEM CHI TIẾT" để mở lại báo cáo gốc.

## 3. Tương tác & Luồng (Interaction & Flow)
- **Điểm bắt đầu:** Từ dòng "Sự cố phát hiện" tại **Tóm tắt Lịch sử (UI 3.6)**.
- **Hành động:** Quay lại tóm tắt lịch sử bằng nút Back.

## 4. Metadata cho Developer
- **Screen File:** `app/patrol-incidents-summary.tsx`.
- **Navigation Payload:** Nhận `routeId`, `routeName` từ màn hình trước.
