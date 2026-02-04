# UI Spec 3.2: Màn hình Chi tiết & Xử lý Ticket

> [!WARNING]
> **Tính năng này KHÔNG có trong MVP**. Sẽ được triển khai trong Epic sau.

## 1. Visual Style (Aesthetics)
- **Concept:** "Maintenance Management".
- **Theme:** **Adaptive Theme**. Toàn bộ các thẻ (Cards) và ô nhập liệu tự động đổi màu theo chế độ Sáng/Tối.

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** Chọn một ticket từ **Màn hình Danh sách Bảo trì (UI 3.1)**.
- **Quy trình:** Xem thông tin -> Nhấn "Bắt đầu làm" (**Popup Xác nhận**) -> Nhập báo cáo -> Nhấn "Hoàn thành" (**Popup Xác nhận**).
- **Điểm kết thúc (Exit):** Quay lại Danh sách Bảo trì hoặc Trang chủ sau khi hoàn tất.

## 3. Layout & Composition
- **Info Section:** Hiển thị trên cùng với các thông tin Read-only (Mã ticket, Thiết bị, Vị trí).
- **Update Section:** Khu vực nhập liệu (Ghi chú, Phụ tùng thay thế).
- **Action Footer:** Các nút hành động chính (Start / Complete / Cancel).

## 4. Xử lý sự kiện & Popup Xác nhận

| Thành phần | Hành động | Loại Popup |
| :--- | :--- | :--- |
| Nút "Bắt đầu làm" | Nhấn | **Confirmation:** "Bắt đầu xử lý Ticket này?" |
| Nút "Hoàn thành" | Nhấn | **Confirmation:** "Gửi báo cáo và đóng Ticket? Hành động này không thể hoàn tác." |
| Nút "Hủy bỏ" | Nhấn | **Warning:** "Bạn có chắc chắn muốn hủy các thay đổi?" |

## 5. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Visual | Tính năng |
| :--- | :--- | :--- | :--- |
| UI_TKT_01 | Huy hiệu trạng thái | Màu sắc theo tiến độ | Hiển thị trạng thái |
| UI_TKT_02 | Ô nhập ghi chú | Nền Surface, bo góc | Nhập nội dung kỹ thuật |
| UI_TKT_BTN_START | Nút "Bắt đầu làm" | Màu Primary Blue | Bắt đầu xử lý ticket |
| UI_TKT_BTN_DONE | Nút "Hoàn thành" | Màu Success Green (Khi đang làm) | Kết thúc & Gửi báo cáo |
| UI_TKT_BTN_CANCEL | Nút "Hủy bỏ" | Viền xám, text đỏ | Hủy các thay đổi hiện tại |

## 6. AI UI Prompt
> "Maintenance ticket detail screen for a mobile app in dark mode. Top section shows device ID and issue description in clean cards. Bottom half has a text area for technician notes and a 'Complete Ticket' button. Include a clear confirmation dialog mockup on top of the screen with 'Cancel' and 'Confirm' buttons. High-tech security aesthetic, blue and grey palette."
