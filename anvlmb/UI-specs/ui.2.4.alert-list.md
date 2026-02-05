# UI Spec 2.4: Màn hình Danh sách Cảnh báo (Alerts Tab)

## 1. Visual Style (Aesthetics)
- **Vị trí:** Là 1 trong 4 Tab chính (Bottom Navigation), nằm giữa "Trang chủ" và "Bản đồ".
- **Concept:** "Notification Center".
- **Theme:** **Adaptive Theme**. Danh sách cuộn dọc, items dạng Card tự động chuyển màu nền/văn bản.

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** Nhấn vào Tab "Cảnh báo" trên thanh menu chính.
- **Hành động:** 
    - Xem danh sách các cảnh báo (Alerts) theo 5 trạng thái:
        - **Tất cả (ALL):** Màu xám/văn bản. Lấy toàn bộ tin để đối soát.
        - **Đã tiếp nhận (RECEIVED):** Màu Đỏ (Danger). Nhiệm vụ đang thực hiện.
        - **Chờ tiếp nhận (UNPROCESSED):** Màu Cam (Warning). Các sự vụ chưa có người nhận.
        - **Đã báo cáo (REPORTED):** Màu Xanh dương (Primary). Đang chờ TTCH xác nhận đóng.
        - **Kết thúc (FINISHED):** Màu Xanh lá (Safe). Nhật ký các sự vụ đã hoàn tất.
    - Lọc nhanh qua hệ thống 5 Tab ngang.
    - Nhấn vào một cảnh báo để thực hiện hành động tiếp theo tùy trạng thái của chính item đó (không phụ thuộc vào tab đang chọn).
- **Giao diện Nút bấm (Action Buttons):**
    - **Tab Đã tiếp nhận**: 
        - Nút chính (Đỏ): **ĐẾN DẪN ĐƯỜNG** (Icon: `navigate`).
    - **Tab Chờ tiếp nhận**: Nút **XEM CHI TIẾT** (Cam, Icon: `eye`).
    - **Tab Đã báo cáo/Kết thúc**: Nút **XEM BÁO CÁO** (Xanh dương/Xanh lá, Icon: `document-text`).
- **Luồng Điều hướng Thông minh:**
    - Nhấn vào tin **Đã tiếp nhận** (hoặc nút Đến dẫn đường) -> Chuyển sang **Bản đồ (UI 2.2)**.
    - Nhấn nút **CHI TIẾT** (từ bất kỳ đâu) -> Chuyển sang **Chi tiết Cảnh báo (UI 2.5)**.
    - Nhấn nút **XEM BÁO CÁO** -> Chuyển sang **Tổng hợp Sự vụ (UI 2.7)**.

## 3. Layout & Composition
- **Header:** Tiêu đề "DANH SÁCH CẢNH BÁO".
- **Tab Bar (Top):** 
    - 5 Tab ngang: **TẤT CẢ** | **CHỜ TIẾP NHẬN** (Vàng) | **ĐÃ TIẾP NHẬN** (Đỏ) | **ĐÃ BÁO CÁO** (Xanh dương) | **KẾT THÚC** (Xanh lá).
    - **Default:** Luôn mặc định mở tab **CHỜ TIẾP NHẬN**.
    - Style: Pill-based bo tròn với màu sắc đại diện cho từng tab.
- **List Item (Card):**
    - **Icon & Title:** Phân loại loại hình cảnh báo (Xâm nhập, Cháy...).
    - **Metadata:** Vị trí (Zone, Building, Floor).
    - **Badge:** Mức độ ưu tiên (KHẨN CẤP, BÌNH THƯỜNG).

## 4. Interaction
- **Tap Item:** Tự động điều hướng theo trạng thái (như mô tả ở mục 2).
- **Pull to Refresh:** Kéo xuống để cập nhật danh sách mới nhất.

## 5. Bảng thành phần chi tiết (Detailed Items)

| UI_ALR_01 | Tiêu đề Header | Chữ 18px Đậm | Tiêu đề màn hình |
| UI_ALR_02 | Thẻ cảnh báo | Nền Surface, Viền 1px | Khung chứa cho mỗi cảnh báo |
| UI_ALR_03 | Icon mức độ | Icon Ngọn lửa/Cảnh báo | Biểu thị loại sự cố |
| UI_ALR_04 | Huy hiệu | Dạng bo tròn (Pill) | Biểu thị mức độ (Ưu tiên) |
| UI_ALR_05 | Chữ vị trí | Văn bản mờ (Muted) | Hiển thị vị trí |

## 6. Metadata cho Developer
- **Screen Name:** `AlertListScreen` (`app/(tabs)/alerts.tsx`)
- **Navigation:**
    - **Navigation:**
    - `onPress` -> `router.push('/alert-detail')`
