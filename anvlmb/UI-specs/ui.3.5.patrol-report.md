# UI Spec 3.5 & 3.6: Màn hình Báo cáo & Lịch sử Tuần tra (Unified)

## 1. Phong cách Visual (Aesthetics)
- **Concept:** "Bản tổng kết nghiệp vụ đa năng".
- **Giao diện:** Sạch sẽ, tập trung vào các thông số quan trọng. Sử dụng các thẻ tóm tắt (Summary Cards) lớn ở trên đầu. Tự động chuyển đổi giao diện dựa trên trạng thái ca.

## 2. Bố cục & Thành phần (Layout & Composition)
- **Thẻ Tóm tắt (Summary Card):**
    - Quãng đường đã di chuyển.
    - Tổng thời gian thực hiện tuần tra.
- **Tình trạng Lộ trình:** 
    - Liên kết xem Nhật ký vị trí (GPS Log).
    - Thống kê độ phủ lộ trình và trạng thái đồng bộ dữ liệu.
    - Liên kết xem Tổng hợp Sự cố (Incidents Summary).
- **Ghi chú tổng kết:** Ô văn bản (Editable ở chế độ Báo cáo, Read-only ở chế độ Lịch sử).
- **Phần Chữ ký (Signature Section):** 
    - Chế độ Báo cáo: "Nhấn để ký", trồi lên Popup xác nhận.
    - Chế độ Lịch sử: Hiển thị "ĐÃ XÁC THỰC SỐ" kèm dấu tích xanh.

## 3. Tương tác & Luồng (Interaction & Flow)
- **Chế độ Báo cáo (Status: HOÀN THÀNH):**
    - Nút: "GỬI BÁO CÁO & KẾT THÚC" (Màu Safe Green).
    - Hành động: Cập nhật trạng thái sang `ĐÃ BÁO CÁO`, quay về `/patrol`.
- **Chế độ Lịch sử (Status: ĐÃ BÁO CÁO):**
    - Nút: "ĐÓNG TÓM TẮT" (Background Surface).
    - Hành động: Quay lại màn hình trước.

## 6. Metadata cho Developer
- **Screen File:** `app/patrol-report.tsx`.
- **Logic Key:**
    - Kiểm tra `currentRoute.status === 'ĐÃ BÁO CÁO'` để bật chế độ `isHistory` (Read-only).
    - Nhận `params` từ màn hình trước để hiển thị dữ liệu GPS/Incidents.
    - Đồng bộ hoàn toàn với `PatrolContext`.
