# Đặc tả Kỹ thuật Front-end (Front-end Specification)
**Dự án**: ANVL Mobile
**Vai trò**: @ux-expert

## 1. Công nghệ Sử dụng (Tech Stack)

Hệ thống được xây dựng trên nền tảng di động hiện đại, tập trung vào hiệu suất và trải nghiệm người dùng thực địa:

- **Framework**: React Native (Managed by Expo SDK 54+).
- **Ngôn ngữ**: TypeScript 5.x (Bắt buộc Type-safe cho toàn bộ Props và Data Models).
- **Routing**: Expo Router (File-based routing).
- **Styling**: React Native StyleSheet (Ưu tiên sử dụng các Design Tokens từ `constants/Colors.ts`).
- **Animation**: React Native Reanimated 4.x (Dành cho các hiệu ứng Pulse cảnh báo).
- **Feedback**: Expo Haptics (Phản hồi rung khi chạm).
- **State Management**: React Context API & Hooks (Tối giản cho MVP).

## 2. Hệ thống Thiết kế & Tokens (Design System)

Tất cả các thành phần phải tuân thủ nghiêm ngặt **Tactical Dark Mode**:

### 2.1. Bảng màu (Color Tokens)
| Token Name | Hex | Usage Context |
| :--- | :--- | :--- |
| `Danger/NeonRed` | `#FF3B30` | Sự vụ khẩn cấp, SOS, Banner RECEIVED. |
| `Warning/Orange` | `#FF9500` | Tin nhắn chờ tiếp nhận, chú ý. |
| `Safe/Green` | `#34C759` | Kết thúc, Thành công, Xác nhận. |
| `Primary/Blue` | `#0A84FF` | Routing, Hành động chính, Navigation Line. |
| `Background/DeepBlack` | `#000000` | Nền chính toàn ứng dụng. |
| `Surface/DarkGrey` | `#1C1C1E` | Card, Bottom Sheet, Input background. |

### 2.2. Typography
- **Font**: Inter (Fallback: Roboto).
- **Hệ thống phân cấp**:
  - `Header 1`: 24px, Bold.
  - `Header 2`: 20px, Semi-bold.
  - `Body`: 16px, Regular.
  - `Caption`: 12px, Regular (Muted color).

## 3. Quy chuẩn Thuật ngữ & Hiển thị

Đảm bảo sự nhất quán tuyệt đối giữa Front-end và Back-end Web app:

1. **Sự vụ (Incident)**:
   - Nguồn: Từ Web app gửi xuống.
   - Hiển thị: Tab "Cảnh báo", Marker Đỏ trên bản đồ.
   - Hành động: Dẫn đường và **Báo cáo xử lý Sự vụ**.

2. **Sự cố (Occurrence)**:
   - Nguồn: Nhân viên Mobile phát hiện và gửi lên.
   - Hiển thị: Trong luồng Tuần tra hoặc Nút báo cáo tự do.
   - Hành động: **Báo cáo Sự cố**.

## 4. Thành phần Kỹ thuật Đặc thù (Technical Components)

### 4.1. Global SOS FAB
- Phải được đặt trong một `Context` hoặc `Layout` cấp cao nhất.
- Luôn hiển thị (Z-index cao nhất).
- Yêu cầu logic **Long Press (3s)** kết hợp Haptic feedback liên tục khi đang ấn.

## 5. Quy trình Báo cáo Hiện trường
- **Media**: Tối ưu hóa ảnh (Lazy loading thumbnails), nén file trước khi gửi.
- **Confirm**: Luôn hiển thị `Alert.alert()` hoặc Custom Modal xác nhận trước khi `Submit`.
- **Status Sync**: Hiển thị trạng thái "Đang gửi..." trực quan để người dùng không thoát app khi dữ liệu chưa đẩy lên xong.

---
*Tài liệu này là cơ sở để Review code Front-end.*
