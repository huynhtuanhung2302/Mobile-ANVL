# Danh mục Đặc tả Giao diện (UI Specification) - ANVL Mobile

Tài liệu này quản lý toàn bộ các đặc tả về giao diện (UI) và trải nghiệm người dùng (UX) cho ứng dụng ANVL, đảm bảo tính đồng nhất về thẩm mỹ và trải nghiệm trên toàn hệ thống.

> [!IMPORTANT]
> **Toàn bộ ứng dụng hỗ trợ Adaptive Theme (Sáng/Tối) và được bản địa hóa 100% sang tiếng Việt.** Các thành phần UI trong đặc tả này phải luôn tuân thủ nguyên tắc "Dynamic Color" từ Design System.

## 🎨 Nền tảng Thiết kế (Global Design)
- **[Hệ thống Thiết kế (Design System)](./ui.design-system.md)**: Màu sắc, Typography, Spacing, Global Components, Popup Quy chuẩn.

## 🔄 Sơ đồ Luồng người dùng (User Flows)

### 🚨 Luồng Xử lý Cảnh báo Khẩn cấp (4 Giai đoạn)
```mermaid
graph TD
    Start((Tin báo MQTT)) --> Detail[2.5. Chi tiết Sự vụ/Briefing]
    Detail -- "Bắt đầu di chuyển" --> Map[2.2. Bản đồ & Dẫn đường - STATE: RECEIVED]
    Map -- "Báo cáo Sự cố" --> Report[2.3. Báo cáo Sự vụ - STATE: REPORTED]
    Report -- "Chờ xác nhận" --> Resolved[2.7. Tổng hợp Sự vụ - CHỜ DUYỆT]
    Resolved -- "Web xác nhận" --> Finished[2.7. Tổng hợp Sự vụ - KẾT THÚC]
```

### 👤 Luồng Điều hướng từ Dashboard
```mermaid
graph LR
    Dash((Dashboard)) -- "Widget RECEIVED" --> Map[2.2. Map Routing]
    Dash -- "Widget UNPROCESSED" --> Detail[2.5. Alert Detail]
    Dash -- "Widget REPORTED" --> Resolved[2.7. Resolved Detail]
    Dash -- "Widget FINISHED" --> Resolved[2.7. Resolved Detail]
    
    Tabs((Tab Bar)) -- "Alert Tab" --> Alerts[2.4. Alert List - 4 TABS]
```
*Lưu ý: Các luồng nâng cao như Đăng nhập Offline, Sinh trắc học và Quản lý Ticket đã được chuyển sang giai đoạn sau.*

### 🚨 Luồng SOS Toàn cục
```mermaid
graph TD
    GlobalFAB((SOS Button)) -- "Long Press (3s)" --> SOS[SOS Signal Sent]
```

### 🛠️ Luồng Tuần tra MVP
```mermaid
graph TD
    Dash((Dashboard)) --> Patrol[3.3. Tuyến tuần tra]
    Patrol -- "Bắt đầu tuyến" --> PDetail[3.3. Chi tiết Tuyến]
    PDetail -- "Báo cáo Sự cố" --> Occ[2.6. Báo cáo Sự cố/Sự vụ]
    Occ -- "Submit" --> PDetail
    PDetail -- "Hoàn thành lộ trình" --> PReport[3.5. Báo cáo Kết thúc]
    PReport -- "Gửi & Đóng ca" --> Dash
    Patrol -- "Tab Hoàn thành" --> PHistory[3.6. Lịch sử Tuần tra]
    PHistory -- "Chi tiết Sự cố" --> PInc[3.7. Tổng hợp Sự cố]
```

## 📱 Đặc tả Giao diện theo Màn hình (Screen UI Specs)

### Module 1: Xác thực & Nền tảng
- [UI 1.1: Màn hình Dashboard (Trang chủ)](./ui.1.1.dashboard.md)
- [UI 1.2: Màn hình Đăng nhập (Online MVP)](./ui.1.2.login.md)
- [UI 1.3: Màn hình Hồ sơ & Thiết bị](./ui.1.3.profile.md)

### Module 2: Hệ thống Cảnh báo & Bản đồ
- [UI 2.2: Màn hình Bản đồ & Dẫn đường](./ui.2.2.map-routing.md)
- [UI 2.3: Màn hình Báo cáo Sự vụ/Sự cố (Dynamic)](./ui.2.3.incident-report.md)
- [UI 2.4: Màn hình Danh sách Cảnh báo (Main Tab)](./ui.2.4.alert-list.md)
- [UI 2.5: Màn hình Chi tiết Cảnh báo (Briefing)](./ui.2.5.alert-detail.md)
- [UI 2.6: Màn hình Báo cáo Sự cố/Sự vụ (Tuần tra)](./ui.2.6.occurrence-report.md)
- [UI 2.7: Màn hình Tổng hợp Sự vụ (Resolved Detail)](./ui.2.7.alert-resolved-detail.md)

### Module 3: Vận hành & Hậu cần (MVP)
- [UI 3.3: Màn hình Tuyến tuần tra (Danh sách/Chi tiết)](./ui.3.3.patrol-route.md)
- [UI 3.5: Màn hình Báo cáo Kết thúc Ca](./ui.3.5.patrol-report.md)
- [UI 3.6: Màn hình Tóm tắt Lịch sử Tuần tra](./ui.3.6.patrol-history.md)
- [UI 3.7: Màn hình Tổng hợp Sự cố Tuần tra](./ui.3.7.patrol-incidents-summary.md)

### 📁 Các tính năng trì hoãn (Future Scope)
> [!NOTE]
> Toàn bộ đặc tả cho các tính năng: **Offline Mode, Bảo trì Ticket, Check-in NFC, Biometrics** đã được di chuyển sang tài liệu riêng biệt để tập trung vào MVP.
> 
> Xem thêm: **[ANVL Future Scope (Docs)](../docs/future-scope.md)**

---
*Lưu ý: Mọi quyết định quan trọng (Create, Update, Delete, Submit) đều phải hiển thị Popup Xác nhận theo chuẩn Design System.*
