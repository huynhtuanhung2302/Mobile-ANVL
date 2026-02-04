# UI Spec 1.1: Màn hình Dashboard (Trang chủ)

## 1. Visual Style (Aesthetics)
- **Concept:** "Command & Control Center".
- **Theme:** **Adaptive Theme**. Sử dụng Card-based layout với các khối chức năng rõ ràng.
- **Header:** Chứa Avatar người dùng (bên trái) và Nút **Test Alert (🐞)** (bên phải - phục vụ kiểm thử).

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** Sau khi đăng nhập thành công (UI 1.2).
- **Tính năng chính:**
    - Theo dõi trạng thái Ca làm việc (Giờ trực, Điểm trực) qua **Patrol Hero Widget**.
    - Theo dõi trạng thái tác chiến qua bộ 4 Status Widgets (Đã tiếp nhận, Chờ tiếp nhận, Đã báo cáo, Kết thúc).
    - Truy cập nhanh Bản đồ qua Mini Map Widget.
    - Tiếp nhận nhiệm vụ khẩn cấp (Global SOS / Alert Overlay).
- **Hành động chuyển tiếp:**
    - Nhấn Avatar -> Hồ sơ (UI 1.3).
    - Nhấn Widget Trạng thái -> Danh sách Cảnh báo theo Tab tương ứng (UI 2.4).
    - Nhấn SOS -> Kích hoạt SOS.

## 3. Layout & Composition
### 3.1. Header Panel
- **Avatar:** Vòng tròn bo góc, nhấn để sang Profile.
- **Shift Info:** Hiển thị "Ca tuần tra: Sáng" và "Vị trí: Cổng chính".
- **Test Trigger:** Biểu tượng 🐞 để giả lập nhận cảnh báo khẩn cấp từ IOC.

### 3.2. Operation Status (2x2 Grid)
- **Cấu trúc:** Lưới 2x2 giúp tối ưu không gian và hiển thị con số lớn rõ ràng hơn.
- **Widgets:**
    - **Đã tiếp nhận (RECEIVED - Danger):** Các nhiệm vụ cá nhân đang xử lý. Màu đỏ (#FF3B30).
    - **Chờ tiếp nhận (UNPROCESSED - Warning):** Cảnh báo mới từ hệ thống. Màu cam (#FF9500).
    - **Đã báo cáo (REPORTED - Primary):** Nhiệm vụ đã xong báo cáo, chờ duyệt. Màu xanh dương (#007AFF).
    - **Kết thúc (FINISHED - Safe):** Nhiệm vụ đã hoàn tất lịch sử. Màu xanh lá (#34C759).
- **Tương tác:** Nhấn vào mỗi khối sẽ nhảy thẳng sang trang Cảnh báo với tab tương ứng được chọn sẵn.

### 3.3. Patrol Hero Widget
- **Mục đích:** Thẻ lớn hiển thị thông tin ca trực ưu tiên để nhân viên chuẩn bị hoặc thực hiện.
- **Logic hiển thị (Smart Hero Filtering):**
    - **Ưu tiên 1:** Hiển thị ca đang thực hiện của hôm nay.
    - **Ưu tiên 2:** Nếu không có ca đang chạy, hiển thị ca chưa thực hiện của hôm nay.
    - **Ưu tiên 3:** Chỉ hiển thị lịch ngày mai khi hôm nay không còn lịch trình nào cần xử lý.
    - **Ẩn:** Các ca đã Hoàn thành trong ngày hôm nay sẽ không xuất hiện trên Dashboard.
- **Visual:**
    - Tiêu đề động: "LỊCH TUẦN TRA" (hôm nay) hoặc "LỊCH NGÀY MAI".
    - Nhãn trạng thái màu sắc theo quy chuẩn (Cam: Chờ, Xanh dương: Đang làm).
- **Tương tác:** Nhấn vào để mở trực tiếp **Chi tiết Tuyến**.

### 3.4. Active Mission Badges (Multi-Tasking)
- **Vị trí:** Ngay dưới Grid Trạng thái tác chiến.
- **Cấu trúc:** Horizontal ScrollView chứa các Badge nhiệm vụ.
- **Màu sắc:** **Red (#FF3B30)** cho toàn bộ các tin có trạng thái `RECEIVED`.
- **Thành phần:**
    - **Timer Badge:** Hiển thị `MM:SS` thời gian trôi qua kể từ khi tin được tạo/tiếp nhận.
    - **Context:** Loại cảnh báo và tòa nhà (vd: XÂM NHẬP - TÒA NHÀ A).
- **Hành động:** Nhấn vào Badge sẽ mở ngay màn hình **Báo cáo sự vụ (UI 2.3)** của nhiệm vụ đó.

## 4. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Giao diện | Thuộc tính |
| :--- | :--- | :--- | :--- |
| UI_DASH_01 | User Avatar | Hình tròn 40px | Clickable |
| UI_DASH_02 | Status Bar | Pill badges | Hiển thị CA TUẦN TRA & VỊ TRÍ |
| UI_DASH_03 | Status Card | Card bo góc 16px | Nền Đỏ/Cam/Xanh/Lá (2x2 Grid) |
| UI_DASH_04 | Mission Badge | Tag bo góc 16px | Nền Đỏ (#FF3B30), có Timer |
| UI_DASH_05 | SOS FAB | Nút đỏ lớn chính giữa Bottom Bar | **Long press for 3s** |

## 5. Metadata cho Developer
- **Screen Path:** `app/(tabs)/index.tsx`
- **Components:** `AlertOverlay.tsx`, `GlobalSOS.tsx`, `ActiveMissionBanner.tsx`.
