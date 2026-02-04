# UI Spec 3.4: Màn hình Check-in Camera Watermark

## 1. Phong cách Visual (Aesthetics)
- **Concept:** "Visual Evidence" (Bằng chứng trực quan).
- **Giao diện:** Camera View chiếm toàn màn hình hoặc phần lớn diện tích.
- **Overlay:** Lớp phủ (Watermark) hiển thị thông tin thời gian thực để người dùng biết ảnh chụp sẽ có gì.

## 2. Bố cục & Thành phần (Layout & Composition)
- **Camera View:**
    - Hiển thị hình ảnh thực tế từ camera sau.
    - **Watermark Overlay:** Các badge bán trong suốt (semi-transparent) ở góc (hoặc rải rác) hiển thị:
        - 📍 Tên Checkpoint
        - 🕒 Thời gian thực (Live Clock - chạy từng giây)
        - 👤 Tên nhân viên
- **Controls:**
    - Nút Chụp (Shutter Button) lớn ở dưới cùng.
    - Nút Đèn Flash (nếu cần).
- **Preview Mode (Sau khi chụp):**
    - Hiển thị ảnh tĩnh đã chụp.
    - Watermark được "đóng cứng" (hoặc hiển thị giả lập vị trí tương đương).
    - Danh sách các mục cần kiểm tra (Checklist) hiện ra bên dưới hoặc đè lên một phần.
    - Nút "Chụp lại" và "Hoàn thành".

## 3. Tương tác & Luồng (Interaction & Flow)
- **Vào màn hình:** Yêu cầu quyền Camera nếu chưa có.
- **Chụp ảnh:** Nhấn nút -> Đóng băng hình ảnh -> Hiển thị Checklist.
- **Hoàn thành:** Chỉ cho phép nhấn "Hoàn thành" khi đã có ảnh và tick đủ checklist.

## 4. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Visual | Tính năng |
| :--- | :--- | :--- | :--- |
| UI_CAM_01 | Camera View | Fullscreen | Viewfinder |
| UI_CAM_02 | Watermark Badge | Pill shape, background tối mờ | Hiển thị thông tin ngữ cảnh (Context) |
| UI_CAM_BTN_SHUTTER | Shutter Button | Hình tròn lớn, viền trắng | Kích hoạt chụp |
| UI_CAM_03 | Checklist Card | Card nổi, background tối | Danh sách công việc tại điểm |
| UI_CAM_BTN_SUBMIT | Submit Button | Primary Green | Gửi dữ liệu (Ảnh + Metadata) |

## 5. Metadata cho Developer
- **Library:** `expo-camera`.
- **Data Logic:**
    - `imageUri`: Đường dẫn file ảnh local.
    - `capturedAt`: ISO String thời điểm nhấn nút chụp (Tách riêng, không chỉ dựa vào Exif).
    - `watermarkData`: Object chứa thông tin text đã in lên ảnh (để backend verify nếu cần).
