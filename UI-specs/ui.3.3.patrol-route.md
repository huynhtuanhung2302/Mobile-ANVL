# UI Spec 3.3: Màn hình Tuyến tuần tra (Danh sách & Chi tiết)

## 1. Phong cách Visual (Aesthetics)
- **Concept:** "Bản đồ Nhiệm vụ Hiện đại".
- **Chủ đạo:** Chế độ Dark Mode sâu (Deep Dark), sử dụng các khối thẻ (Cards) có độ nổi với viền mờ (glassmorphism nhẹ).
- **Màu sắc nhấn:** Xanh điện (Electric Blue #0A84FF) cho tiến độ, Xanh lá (Safe Green #30D158) cho trạng thái hoàn thành.

- **Tương tác:** Nhấn vào để mở trực tiếp **Chi tiết Tuyến**.
- **Quy chuẩn Định danh:** Không hiển thị Plan ID trên thẻ thông tin tại Dashboard.

## 3. Chi tiết Tuyến tuần tra (Patrol Route Details)
- **Chế độ xem (Toggle):** Cho phép chuyển đổi giữa **"BẢN ĐỒ TUYẾN"** và **"DANH SÁCH"** (Timeline). Đặt "BẢN ĐỒ TUYẾN" lên trước.
- **Timeline Điểm tuần tra (Waypoints):**
    - Hiển thị theo dạng đường kẻ (Timeline) nối các điểm.
    - Điểm hiện tại: Có hiệu ứng vòng tròn phát sáng màu xanh.
    - Điểm đã xong: Dấu tích xanh.
    - Điểm bị khóa: Icon ổ khóa và làm mờ thẻ.
- **Bản đồ Tuyến:** Hiển thị vị trí các điểm mốc trên nền bản đồ tối, có đường nối lộ trình kỹ thuật (Route Path).
- **Hành động dưới đáy:**
    - Nút "BÁO CÁO SỰ CỐ": Màu vàng cảnh báo.
    - Nút "KẾT THÚC TUYẾN": Màu trắng/xám, chỉ kích hoạt khi đủ điều kiện.
- **Xử lý tuyến TTCH (Không định danh):**
    - Tên tuyến mặc định: "Tuyến Điều Phối TTCH".
    - Tên điểm mốc: Tự động đánh số "Điểm tuần tra #N" nếu thiếu dữ liệu.
    - Chế độ xem: Mặc định mở "BẢN ĐỒ TUYẾN" để định hướng.

## 4. AI UI Prompt (Cho việc tạo giao diện)
> "High-tech dark mode mobile screen for a security patrol route. Feature a timeline list of checkpoints with glow effects for the active one. Each checkpoint card shows ID and tasks. At the top, a toggle switch between 'List' and 'Map' view. Bottom sticky actions for 'Incident Report' in warning yellow and 'Finish Route'. Tropical dark aesthetic, neon blue primary accents, Inter font."

## 5. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Visual | Tính năng |
| :--- | :--- | :--- | :--- |
| UI_PTR_01 | Route Card | Surface gray với border mờ | Chuyển đến chi tiết |
| UI_PTR_02 | Progress Bar | Thanh ngang màu Blue | Hiển thị % hoàn thành |
| UI_PTR_03 | View Toggle | Tab bar nhỏ ở trên | Chuyển List/Map |
| UI_PTR_BTN_REPORT | Report Button | Button màu Vàng (Sticky Bottom Left) | Chuyển sang UI 2.6 (Nhãn: **BÁO CÁO SỰ CỐ**) |
| UI_PTR_BTN_FINISH | Finish Button | Button màu Trắng/Xám (Sticky Bottom Right) | Kết thúc tuyến (Disabled nếu chưa xong) |

## 6. Metadata cho Developer
- **Screen File:** `app/(tabs)/patrol.tsx` & `app/patrol-details.tsx`.
- **Navigation Payload:**
    - `patrol.tsx` -> `patrol-details.tsx`: `{ routeId, routeName }` (Khi status là ĐANG THỰC HIỆN).
    - `patrol.tsx` -> `patrol-report.tsx`: `{ routeId, routeName }` (Khi status là HOÀN THÀNH hoặc ĐÃ BÁO CÁO).
    - `patrol-details.tsx` -> `patrol-report.tsx`: `{ routeId, distance, updates, incidents, duration }`.
- **Note:** Plan ID tuyệt đối không hiển thị trong danh sách hoặc chi tiết tuyến tác chiến.
