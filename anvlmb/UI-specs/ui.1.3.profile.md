# UI Spec 1.3: Màn hình Hồ sơ (Profile Tab)

## 1. Visual Style (Aesthetics)
- **Vị trí:** Tab/Screen riêng biệt. **Lưu ý: Đã ẩn khỏi Tab Bar chính. Truy cập thông qua Avatar tại màn hình Dashboard (Trang chủ).**
- **Header:** Thiết kế dạng Card profile lớn.

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** Nhấn vào Tab "Profile" trên thanh menu chính.
- **Tính năng chính:**
    - Xem thông tin cá nhân.
    - Xem thông tin thiết bị (Device ID - chỉ đọc).
    - **Cài đặt Giao diện:** Chuyển đổi chế độ Tối/Sáng/Tự động.
    - **Gọi chỉ huy:** Nút gọi nhanh hotline khẩn cấp.
    - Đăng xuất.

## 3. Layout & Composition
- **Settings Section:** Group các cài đặt ứng dụng.
- **Dispatcher Call:** Nút lớn nổi bật "GỌI CHỈ HUY" (Call Dispatcher) màu xanh lá hoặc hotline icon.
- **Action Footer:** Nút Đăng xuất màu đỏ.

## 4. Xử lý sự kiện & Popup
- **Chuyển Theme:** Thay đổi ngay lập tức toàn bộ màu sắc ứng dụng mà không cần khởi động lại.
- **Gọi chỉ huy:**
    - Nhấn -> Thực hiện cuộc gọi hệ thống (Tel/SIP) tới số Hot line cấu hình trước.

## 5. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Visual | Tính năng |
| :--- | :--- | :--- | :--- |
| UI_PRO_01 | Avatar Header| Ảnh & Info Text | Hiển thị định danh |
| UI_PRO_SET_THEME | Theme Switcher | Button/Menu | Auto / Light / Dark |
| UI_PRO_BTN_CALL | Call Dispatcher | Nút lớn, Icon Phone | Gọi nhanh về trung tâm |
| UI_PRO_BTN_LOGOUT | Logout Button| Full-width, Outlined Red | Đăng xuất |

## 6. Metadata cho Developer
- **Screen Name:** `ProfileTab`
- **Navigation:** Nằm trong `Tabs.Navigator`.
