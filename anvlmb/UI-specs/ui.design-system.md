# Hệ thống Thiết kế (Design System) - ANVL Mobile

Tài liệu này định nghĩa ngôn ngữ thiết kế chung để mang lại trải nghiệm chuyên nghiệp, tin cậy và hiệu quả cho nhân viên an ninh.

## 1. Nguyên lý Thiết kế (Design Principles)
- **Security First:** Giao diện tối giản, tập trung vào thông tin quan trọng nhất để đưa ra quyết định nhanh.
- **Adaptive Theme:** Hỗ trợ linh hoạt giữa **Light Mode** (Tương phản cao ngoài trời) và **Dark Mode** (Tactical ban đêm).
- **High Contrast:** Các thành phần cảnh báo phải có độ tương phản cực cao (Neon colors) để dễ nhận diện trong mọi điều kiện ánh sáng.

## 2. Bảng màu (Color Palette)

Hệ thống sử dụng bộ màu động (Dynamic Colors) tự động thích ứng theo chế độ giao diện.

### 🎨 Màu chính (Primary & Alert) - Giữ nguyên trên cả 2 mode
| Loại | Màu | Hex | Công dụng |
| :--- | :--- | :--- | :--- |
| **Danger** | 🔴 Neon Red | `#FF3B30` | Cảnh báo khẩn cấp, SOS, Báo cháy. |
| **Warning** | 🟡 Alert Orange| `#FF9500` | Cảnh báo mức trung bình, chú ý. |
| **Safe** | 🟢 Tactical Green| `#34C759` | Trạng thái bình thường, thành công. |
| **Primary**| 🔵 Security Blue| `#0A84FF` | Action chính, Routing, Link. |

### 🌗 Màu nền & Trung tính (Adaptive)

| Token | Dark Mode (Tactical) | Light Mode (Daylight) | Công dụng |
| :--- | :--- | :--- | :--- |
| **Base** | Deep Black (`#000000`) | System White (`#FFFFFF`) | Nền chính của toàn app. |
| **Surface**| Dark Grey (`#1C1C1E`) | Pure White (`#FFFFFF`) | Card, Bottom Sheet, Input Background. |
| **Text** | Pure White (`#FFFFFF`) | Pure Black (`#000000`) | Nội dung chính. |
| **Muted** | Silver (`#8E8E93`) | Granite (`#8E8E93`) | Label, thông tin phụ. |

## 3. Hệ thống Chữ (Typography)
- **Font chính:** Inter (hoặc Roboto làm fallback).
- **Quy tắc:**
    - **Hệ thống Font Weight**: Nghiêm cấm sử dụng `fontWeight: '900'`. Sử dụng `bold` (700) cho các thành phần quan trọng, `600` cho phân cấp, và `normal` (400) cho nội dung.
    - **Header 1:** 24px, Bold (Tiêu đề màn hình).
    - **Header 2:** 20px, Bold (Tiêu đề module).
    - **Body:** 16px, Regular (Nội dung chính).
    - **Caption:** 12px, Regular (Thông tin phụ, timestamp).

## 4. Thuật ngữ Standard (Terminology)
- **Sự cố (Occurrence)**: Nghiệp vụ xuất phát từ **Tuần tra** hoặc **Người dùng Mobile** gửi lên TTCH.
- **Sự vụ (Incident)**: Nghiệp vụ xuất phát từ **TTCH** gửi xuống Mobile. Thuộc dạng cảnh báo khẩn cấp ưu tiên số 1 phải xử lý.

## 4. Thành phần dùng chung (Global Components)

### 🔘 Buttons
- **Primary Button:** Nền `#0A84FF`, chữ trắng, bo góc 12px.
- **Danger Button:** Nền `#FF3B30`, bo góc 12px.
- **Success Button:** Nền `#34C759` (cho Hoàn thành/Xác nhận).
- **Ghost/Secondary Button:** Nền tối (Dark) hoặc xám nhạt (Light), chữ Xám/Đỏ (cho Hủy/Bỏ qua).
- **Global SOS FAB:** Nút tròn nổi (Floating Action Button) màu Đỏ Neon nằm chính giữa Bottom Bar (hoặc đè lên Tab Bar). Luôn hiển thị ở mọi màn hình chính.

### 🏷️ Cards
- Bo góc 16px.
- Background: Adaptive (`Surface` Color).
- Viền (Border): 0.5px, màu `#38383A` (Dark) hoặc `#E5E5EA` (Light).
- Hiệu ứng đổ bóng: Subtle Outer Glow cho các sự cố khẩn cấp.

### 🏢 Premium Floor Badge (New)
- **Vị trí**: Floating Pill ở góc trên bên phải thẻ điều hướng.
- **Visual**: Nền Neon Red, chữ trắng, kèm icon `layers`. 
- **Công dụng**: Nhận diện vị trí tầng tức thì.

### ⚠️ Popup Xác nhận (Confirmation Popups)
Mọi hành động mang tính thay đổi hoặc xóa dữ liệu (Create, Update, Delete, Submit) đều PHẢI hiển thị Popup này.
- **Layout:** Trung tâm màn hình, có lớp phủ mờ (Scrim) phía dưới.
- **Thành phần:**
    - Tiêu đề (Bold): Thông báo ngắn gọn (VD: "Xóa ảnh này?").
    - Nội dung (Regular): Giải thích hệ quả (VD: "Hành động này không thể hoàn tác").
    - Button: Nút xác nhận bên phải (Màu tương ứng hành động - Xanh/Đỏ), Nút hủy bên trái (Màu Neutral).

---
## 5. Animation Guidelines
- **Alert Pulse:** Các icon cảnh báo phải có hiệu ứng nhịp thở (Scale 1.0 -> 1.1) liên tục.
- **Micro-interactions:** Phản hồi xúc giác (Haptic feedback) khi nhấn nút hoặc quét thành công.
