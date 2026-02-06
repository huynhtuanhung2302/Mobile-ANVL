# UI Spec 2.1: Màn hình Overlay Khẩn cấp (Critical Alert)

## 1. Visual Style (Aesthetics)
- **Concept:** "Tactical Emergency" - Gây áp lực thị giác mạnh để buộc người dùng chú ý.
- **Theme:** **Adaptive Theme** (Hỗ trợ cả Sáng & Tối).
- **Màu nền:** Đỏ khẩn cấp (#FF3B30). Text trắng để đảm bảo độ tương phản cao nhất.

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** Nhận tin nhắn MQTT ưu tiên cao từ IOC.
- **Thông tin nhận được:**
    - **Loại:** Xâm nhập trái phép, Phương tiện danh sách đen, Lưu trú quá hạn.
    - **Mức độ:** Khấn cấp, Cao, Trung bình, Thấp.
    - **Địa điểm:** Phân khu (A/B/C) -> Tòa (Nhà 1/2/3 tầng) -> Tầng (1/2/3).
    - **Chỉ thị điều phối:** Nội dung text từ user điều phối (Ưu tiên hiển thị).
- **Hành động:** Trượt để nhận lệnh -> Điều hướng sang **Chi tiết Cảnh báo (UI 2.5)** để xem bằng chứng IoT.

> [!CAUTION]
> **Trạng thái hiện tại:** Thành phần này đã bị vô hiệu hóa (Commented out) để hỗ trợ luồng đa nhiệm thông qua Thông báo (Notification) và Badge Dashboard. Giữ mã nguồn để sử dụng cho các tình huống Điều phối trực tiếp (Direct Dispatch) trong tương lai.

## 3. Layout & Composition
- **Center Focus:** Loại sự vụ (Uppercase) và Mức độ (Badge).
- **Processing Content (Nội dung xử lý):** Đặt trong một box hiển thị nổi bật ở giữa màn hình. Đây là thông tin quan trọng nhất để nhân viên biết cần làm gì ngay lập tức.
- **Location Hierarchy:** Hiển thị chuỗi địa điểm đầy đủ (Zone • Building • Floor).
- **Tactical Slider:** Nằm ở dưới cùng, nút trượt để xác nhận nhận lệnh.

## 3. Interaction & Animation
- **Heartbeat Animation**: Toàn bộ panel chính thu phóng nhẹ theo nhịp tim (120 bpm).
- **Heartbeat Pulse**: Nền màn hình nhấp nháy màu đen mờ (Black overlay pulse) đồng bộ với âm thanh/icon để tăng tính khẩn cấp.
- **Slider Interaction**: Khi trượt, nền gradient của slider chuyển từ Xám sang Xanh lá cây dần dần.
- **Sound Visualizer:** (Option) Hiển thị sóng âm thanh thực tế của tiếng còi hú chạy ngang màn hình.

## 4. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Giao diện | Hiệu ứng |
| :--- | :--- | :--- | :--- |
| UI_OVER_01 | Khung nền | Nền Đỏ khẩn cấp (Adaptive) | Nhịp thở / Nhấp nháy |
| UI_OVER_02 | Icon Sự vụ | Viền trắng, Có hoạt họa | Xoay hoặc Thu phóng lặp lại |
| UI_OVER_03 | Thẻ vị trí | Huy hiệu nền đen, chữ trắng | Hiển thị phía trên |
| UI_OVER_04 | Thanh trượt | Đường chạy dài, Nút trượt kim loại | Phát sáng khi trượt |
| UI_OVER_05 | Nút Bỏ qua | Văn bản nhỏ "Bỏ qua" (Góc trên) | Dành cho cảnh báo mức thấp |

## 5. Metadata cho Developer
- **Screen Name:** `GlobalAlertOverlay`
- **Asset Required:** `siren_heavy.wav`, `danger_icon_pack.zip`.
- **Constraint:** Phải là một Activity riêng lẻ (hoặc Overlay Window) có level ưu tiên cao nhất trên hệ điều hành.
