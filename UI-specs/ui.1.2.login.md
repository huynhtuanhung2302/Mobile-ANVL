# UI Spec 1.2: Màn hình Đăng nhập (Online MVP)

> [!NOTE]
> **Ghi chú về Phạm vi (Scope Update)**: Tính năng **Chế độ Offline** và **Sinh trắc học** đã được tạm hoãn sang Epic tiếp theo. Hiện tại mã nguồn tập trung hoàn toàn vào luồng Đăng nhập Trực tuyến tiêu chuẩn.

## 1. Visual Style (Aesthetics)
- **Theme:** Adaptive Theme (Hỗ trợ Dark/Light Mode). Mặc định ưu tiên Dark Mode/Tactical cho consistency với nhận diện thương hiệu.
- **Header:** Logo "Hệ thống an ninh vật lý" (Subtitle: "Lực lượng an ninh") hiển thị chính tâm.
- **Background:** Gradient chìm (Deep Blue to Black) trong Dark Mode, hoặc Solid/Gradient nhẹ trong Light Mode.

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** App được kích hoạt và người dùng chưa đăng nhập.
- **Hành động chuyển tiếp:** Người dùng nhập thông tin và nhấn Đăng nhập hoặc sử dụng Sinh trắc học.
- **Điểm kết thúc (Exit):** Điều hướng vào **Màn hình Dashboard (Home)** sau khi xác thực thành công.

## 3. Layout & Composition

### 2.1. Vùng nhập liệu (Form Area)
- **Inputs:** Sử dụng kiểu "Floating Label" để tiết kiệm diện tích.
- **Spacing:** Khoảng cách giữa các field là 16px.
- **Border:** Khi focus, viền chuyển thành màu `Primary Blue` (#0A84FF).

### 2.2. Chế độ Offline (Deferred)
*Tính năng này đã được tạm hoãn sang Epic sau.*

## 3. Interaction & Animation
- **Button Loading:** Khi nhấn "Đăng nhập", nút chuyển sang trạng thái loading với spinner quay đều.
- **Error Feedback:** Nếu sai tài khoản, các input sẽ rung nhẹ (Shake animation) và hiển thị text đỏ phía dưới.

## 4. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Visual | Trạng thái (States) |
| :--- | :--- | :--- | :--- |
| UI_LOGIN_01 | Input Tài khoản | Icon User bên trái, placeholder "Tên đăng nhập / Mã nhân viên" | Focus, Error, Disabled (Hidden in Offline) |
| UI_LOGIN_02 | Input Mật khẩu | Icon Lock bên trái, icon Eye bên phải (toggle) | Focus, Error, Disabled (Hidden in Offline) |
| UI_LOGIN_03 | Nút Login | Primary Blue, bo góc 12px, chữ In hoa | Normal, Pressed, Loading (Hidden in Offline) |
| UI_LOGIN_04 | Nút Biometric (Online) | Text Link / Icon nhỏ | Active, Hidden |
| UI_LOGIN_05 | Re-Auth View (Offline) | Layout tối giản, Avatar Ring, Name | Visible (Offline only) |
| UI_LOGIN_06 | Nút Biometric (Offline) | Icon Fingerprint lớn, **Glow Effect** | Active, Expired (Locked/Grey) |
| UI_LOGIN_07 | Expiry Badge | Pill shape, Background trong suốt | Valid (Time left), Expired (Red text) |

## 5. Metadata cho Developer
- **Screen Name:** `SignInScreen`
- **Asset Required:** `logo_anvl.png`, `icon_faceid.svg`, `icon_touchid.svg`.
