# UI Spec 3.5: Màn hình Báo cáo Kết thúc Ca

## 1. Phong cách Visual (Aesthetics)
- **Concept:** "Bản tổng kết nghiệp vụ".
- **Giao diện:** Sạch sẽ, tập trung vào các thông số quan trọng. Sử dụng các thẻ tóm tắt (Summary Cards) lớn ở trên đầu.

## 2. Bố cục & Thành phần (Layout & Composition)
- **Thẻ Tóm tắt (Summary Card):**
    - Số lượng **Điểm tuần tra** đã quét.
    - Số lượng Sự cố đã tạo trong ca.
    - Tổng thời gian thực hiện tuần tra.
- **Danh sách Kiểm chứng (Checklist):** Liệt kê các **điểm tuần tra** đã đi qua với dấu tích xanh xác nhận.
- **Ghi chú tổng kết:** Ô văn bản hiển thị các lưu ý cuối cùng từ hệ thống hoặc nhân viên.
- **Phần Chữ ký (Signature Section):** Một vùng kẻ đứt nét hiển thị thông báo "ĐÃ XÁC NHẬN" kèm mã định danh nhân viên và dấu thời gian (Timestamp).

## 3. Tương tác & Luồng (Interaction & Flow)
- **Nút "GỬI BÁO CÁO & KẾT THÚC":** Sử dụng màu xanh an toàn (Safe Green).
- **Luồng:** Sau khi gửi thành công, người dùng sẽ được đưa quay lại màn hình Dashboard chính.

## 4. AI UI Prompt (Cho việc tạo giao diện)
> "Modern professional mobile report screen for finishing a security shift. Top section features a dark glassmorphism card with big stats: 5/5 checkpoints, 2 incidents, 45m duration. Middle section shows a list of completed checkpoints with green checkmarks. Bottom area has a digital signature verification box with a timestamp. Primary button 'Submit & Finish' in vibrant green. Dark themed, high density information, sleek typography."

## 5. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Visual | Tính năng |
| :--- | :--- | :--- | :--- |
| UI_REP_01 | Stats Grid | 3 cột thông số lớn | Hiển thị dữ liệu ca |
| UI_REP_02 | Checklist Row | Icon check + text | Liệt kê các điểm đã đi |
| UI_REP_03 | Note Box | Background xám đậm | Hiển thị nội dung tổng kết |
| UI_REP_04 | Signature Box | Border nét đứt | Xác thực định danh |
| UI_REP_BTN_SUBMIT | Submit Button | Primary Green, Full-width | Gửi báo cáo & Quay về Home |

## 6. Metadata cho Developer
- **Screen File:** `app/patrol-report.tsx`.
- **Logic Key:**
    - Nhận `params` từ màn hình trước: `total`, `completed`, `incidents`, `duration`.
    - Sử dụng Helper `parseParam` để xử lý an toàn dữ liệu đầu vào.
    - Chuyển hướng về `/patrol` khi nhấn nút Hoàn thành.
