# UI Spec 2.3: Màn hình Báo cáo Sự vụ/Sự cố (Dynamic)

## 1. Visual Style (Aesthetics)
- **Concept:** "Clean & Accountability" - Giao diện nhập liệu sạch sẽ, rõ ràng để nhân viên báo cáo nhanh.
- **Theme:** **Adaptive Theme**. Sử dụng `surface` color theo theme được chọn (Dark: #1C1C1E, Light: #FFFFFF).

## 2. Luồng nghiệp vụ (Business Flow)
- **Điểm bắt đầu (Entry):** 
    - Nhân viên nhấn nút báo cáo từ **Màn hình Bản đồ (UI 2.2)**.
    - Nhân viên click trực tiếp vào **Badge Cảnh báo trên Dashboard (UI 1.1)**.
- **Quy trình:** Tự động lấy ảnh từ Mission Banner (nếu có) -> Chụp thêm (nếu cần) -> Chọn trạng thái hiện trường (Quick Chips) -> Chọn kết quả -> Nhấn Gửi -> **Popup Xác nhận** -> **Syncing Animation (2s)** -> Đồng bộ.
- **Điểm kết thúc (Exit):** Sau khi gửi thành công, hiển thị **Popup Thành công (Success Overlay)** với thời gian đếm ngược 5 giây. Tự động quay về Dashboard sau khi hết giờ hoặc khi người dùng nhấn "VỀ TRANG CHỦ NGAY". Badge tương ứng sẽ tự động ẩn khỏi Dashboard.

## 3. Layout & Composition
- **Dynamic Header Title:** 
    - Hiển thị **"Báo cáo sự vụ"** nếu đang thực hiện nhiệm vụ từ TTCH.
    - Hiển thị **"Báo cáo sự cố"** trong các trường hợp tuần tra hoặc tự phát.
- **Image Grid:** Hiển thị các ảnh đã chụp dưới dạng Thumbnail lưới 3 cột. **Mỗi thumbnail có nhãn tên tệp bên dưới** (vd: photo_1.jpg).
- **Action Button:** Nút Gửi nằm cố định ở dưới màn hình (Sticky Bottom). Nhãn nút: **"XÁC NHẬN GỬI BÁO CÁO SỰ CỐ/SỰ VỤ"**.

## 3. Thành phần Giao diện chi tiết

| ID | Thành phần | Mô tả Visual | Tính năng |
| :--- | :--- | :--- | :--- |
| UI_REP_01 | Lưới đa phương tiện | Lưới thumbnail (Ảnh/Video) có nút Xóa | Xem trước Media |
| UI_REP_BTN_PHOTO | Nút chụp ảnh | Icon Camera | Chụp ảnh |
| UI_REP_BTN_VIDEO | Nút quay video | Icon Video Camera | Quay video (Tối đa 30s) |
| UI_REP_BTN_AUDIO | Nút ghi âm | Icon Micro (Nhấn để Bắt đầu/Dừng) | Ghi âm hiện trường |
| UI_REP_02 | Trạng thái xử lý | Các nút Toggle (Thành công: Xanh, Thất bại: Đỏ) | Chọn kết quả |
| UI_REP_02_QS | Quick Select Chips | Pill badges màu Primary (vùng Note) | Chọn nhanh nội dung báo cáo (Append không trùng lặp) |
| UI_REP_03 | Ô ghi chú | Nhập liệu nhiều dòng, nền Surface | Nhập giải trình |
| UI_REP_SYNC | Syncing Overlay | Icon "sync" xoay, nền mờ | Visual feedback khi đang gửi |
| UI_REP_04 | Nút gửi | Màu Primary Blue, bo góc | Xác nhận gửi báo cáo (Yêu cầu Popup Xác nhận) |
| UI_REP_05 | Cancel Button | Text Link "Hủy" hoặc Icon Back (Top Left) | Quay lại màn hình trước |

## 4. AI UI Prompt
> "A professional dark mode mobile app form for reporting security incidents. Features: a grid of 3 photo thumbnails with 'add' placeholder, a custom dropdown selector for 'Status', and a large text area for 'Notes'. The bottom has a prominent blue 'Submit Report' button. Use Apple-style dark aesthetics, Inter font, 16px border-radius, and subtle blue glows."

## 5. Metadata cho Developer
- **Validation:** Nút Submit chỉ sáng (Enabled) khi `image_count > 0` và `status != null`.
- **Hỗ trợ Đa nhiệm:** Màn hình nhận tham số `incidentId` để xác định chính xác báo cáo thuộc về cảnh báo nào trong hệ thống Đa nhiệm.
- **Offline Sync (Deferred):** Tính năng lưu tạm và icon đám mây ngoại tuyến đã được tạm hoãn sang Epic tiếp theo. Luồng hiện tại tiêu chuẩn hóa 100% Online.
