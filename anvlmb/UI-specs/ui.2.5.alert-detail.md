# UI Spec 2.5: Màn hình Chi tiết Cảnh báo (Alert Detail)

## 1. Visual Style (Aesthetics)
- **Concept:** "Evidence-Based Response" - Hiển thị bằng chứng trực quan để nhân viên đánh giá mức độ nghiêm trọng.
- **Theme:** **Adaptive Theme** (Hỗ trợ cả Sáng & Tối).
- **Màu sắc:** Sử dụng màu nền surface của theme, các thông tin quan trọng (Mức độ) giữ nguyên màu nhận diện (Red/Yellow).

## 2. Luồng nghiệp vụ (Business Flow)
- **Entry:**
  - Nhấn trực tiếp từ **Thông báo (Push Notification)**.
  - Nhấn vào tin cảnh báo từ **Danh sách Cảnh báo (UI 2.4)** - Tab Chờ tiếp nhận.
- **Hành động:**
    - Xem hình ảnh/video bằng chứng từ Camera/IoT.
    - Nắm bắt chỉ thị điều phối và bối cảnh sự vụ.
    - Nhấn nút **"ĐÃ HIỂU"** để chính thức bắt đầu hành động.
- **Điểm kết thúc (Exit):** Điều hướng sang **Danh sách Cảnh báo (UI 2.4)** ở Tab **ĐÃ TIẾP NHẬN**.

## 3. Layout & Composition
- **Header Title:** Cập nhật thành **"BẢN TIN SỰ VỤ"**.
- **Header Subtitle:** Chuyển từ "QUY TRÌNH TÁC CHIẾN" sang **"THÔNG TIN SỰ VỤ"** để đồng nhất thuật ngữ.
- **Media Section (Top):** Một panel hiển thị hình ảnh hoặc trình phát video (giả lập). Kích thước lớn, bo góc.
- **Summary Section (Middle):**
    - Loại cảnh báo (Badge).
    - Mức độ (Text color).
    - Địa điểm (Hierarchical: Zone • Building • Floor).
- **Instruction Section:** Chỉ thị điều phối từ IOC trong một box nổi bật. (Đã loại bỏ phần NHIỆM VỤ CẦN THIẾT).
- **Action Section (Bottom):** Nút **"ĐÃ HIỂU"** lớn, rộng ngang màn hình (Full-width).

## 4. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Giao diện | Thuộc tính / State |
| :--- | :--- | :--- | :--- |
| UI_DTL_01 | Media Preview | Container hiển thị ảnh/video | Aspect Ratio 16:9 |
| UI_DTL_02 | Info Card | Thẻ chứa tóm tắt thông tin | Nền Surface, bo góc 16px |
| UI_DTL_03 | Note Box | Box chứa nội dung điều phối | Nền mờ, Font Italic |
| UI_DTL_04 | Primary Button | Nút "ĐÃ HIỂU" | Màu Primary của theme |

## 6. Hỗ trợ Đa nhiệm
- **Logic:** Cho phép nhân viên tiếp nhận mọi cảnh báo ngay cả khi đang thực hiện các nhiệm vụ khác.
- **Trigger:** Khi nhấn "ĐÃ HIỂU".
- **Hành động:** Chuyển trạng thái cảnh báo sang `RECEIVED` và thêm vào danh sách nhiệm vụ đang thực hiện. Điều hướng sang Danh sách Cảnh báo.
