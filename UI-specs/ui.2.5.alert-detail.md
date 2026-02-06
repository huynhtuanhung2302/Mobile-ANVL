# UI Spec 2.5: Màn hình Tác chiến Hiện trường (Tactical Mission)

## 1. Visual Style (Aesthetics)
- **Concept:** "Unified Tactical Hub" - Trung tâm tác chiến hợp nhất dẫn đường và thông tin.
- **Theme:** **Adaptive Theme** (Hỗ trợ cả Sáng & Tối).
- **Màu sắc:** Sử dụng màu nền surface của theme, các thông tin quan trọng (Mức độ) giữ nguyên màu nhận diện (Red/Yellow).

## 2. Luồng nghiệp vụ (Business Flow)
- **Trạng thái kích hoạt**: Chỉ hiển thị cho sự vụ ở trạng thái `RECEIVED`.
- **Hành động tại màn hình**:
    - Nhấn vào **Bản đồ nhỏ** -> Mở Tab Bản đồ Full screen để dẫn đường chi tiết.
    - Xem **Lộ trình tiếp cận** (Indoor/Outdoor Step List).
    - Xem bằng chứng Media và Chỉ thị từ TTCH.
- **Điểm kết thúc (Exit):** Nhấn **"XÁC NHẬN ĐÃ ĐẾN"** -> Điều hướng sang **Báo cáo sự vụ (UI 2.3)**.

## 3. Layout & Composition
- **Header Title:** **"THÔNG TIN CHI TIẾT"**.
- **Header Subtitle:** **"TÁC CHIẾN HIỆN TRƯỜNG"**.
- **Briefing Section**: Hiển thị ID, Mức độ, Loại sự vụ và Vị trí (Tòa/Tầng).
- **Tactical Map Widget**:
    - Bản đồ tương tác mini hiển thị vị trí User và Target.
    - HUD hiển thị ETA và Khoảng cách.
    - Có icon "Expand" để nhảy sang bản đồ lớn.
- **Access Route Section**:
    - Danh sách các bước dẫn đường (Step List).
    - Phân loại rõ ràng nhãn **INDOOR** / **OUTDOOR**.
    - Timeline với chấm tròn và icon tích xanh cho các bước hoàn thành.
- **Media Evidence Section**: Hiển thị ảnh/video ghi nhận từ hiện trường.
- **Action Section (Sticky Bottom)**: Nút **"XÁC NHẬN ĐÃ ĐẾN"** màu Primary.

## 4. Hỗ trợ Đa nhiệm
- **Mission Banner**: Banner đỏ hiển thị ở các màn hình khác sẽ điều hướng người dùng quay lại màn hình này nếu sự vụ vẫn ở trạng thái `RECEIVED`.
