# Báo cáo Phân tích Đối chiếu: MVP Input Context vs. User Stories
**Dự án**: ANVL Mobile

## 1. Mục tiêu
Tài liệu này thực hiện việc so sánh và đối chiếu giữa danh mục tính năng dự kiến (MVP Input Context) và danh sách User Stories hiện có. Mục đích là để đảm bảo không có tính năng nào bị bỏ sót và giải trình về cấu trúc của các User Stories.

## 2. Bảng Đối chiếu Tính năng (Mapping Table)

| STT | Module (Input Context) | Thành phần chi tiết | User Story tương ứng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Quản lý truy cập** | Đăng nhập/Đăng xuất | **Story 1.1** | Bao phủ luồng xác thực và duy trì phiên làm việc. |
| **2** | **Dashboard** | Avatar, Thống kê, MiniMap, Lịch tuần tra | **Story 1.2** | Gom nhóm các Widget quan sát vào một Story tổng thể. |
| **3** | **Cảnh báo** | Danh sách (4 trạng thái), Chi tiết tin, Banner, Báo cáo xử lý | **Story 2.1 & 2.2** | Tách thành 2 Story: Quản lý danh sách (Tổng quan) và Xử lý chi tiết (Tác chiến). |
| **4** | **Bản đồ** | Layers, Routing, Hướng dẫn (Indoor/Outdoor), Zoom/Locate | **Story 3.1 & 3.2** | Bao phủ cả khía cạnh hiển thị trực quan và hỗ trợ di chuyển (Routing). |
| **5** | **Tuần tra** | Danh sách lịch, Bản đồ tuyến, GPS Log, Báo cáo Sự cố, Kết thúc | **Story 4.1 & 4.2** | Tập trung vào dữ liệu di chuyển (GPS) và kết quả thực hiện nhiệm vụ. |
| **6** | **Hồ sơ cá nhân** | Thông tin NV, SOS (Liên lạc khẩn cấp), Theme | **Story 5.1** | Tích hợp các tính năng hỗ trợ và cá nhân hóa. |

## 3. Phân tích về Số lượng User Stories

Mặc dù danh sách chỉ bao gồm **9 User Stories**, nhưng toàn bộ **25+ đầu mục tính năng** trong MVP đều đã được bao phủ đầy đủ. Dưới đây là các lý do kỹ thuật đằng sau việc rút gọn này:

### 3.1. Gom nhóm theo Giá trị người dùng (Feature Bundling)
Thay vì liệt kê từng nút bấm (ví dụ: nút Zoom in, nút Locate), chúng tôi đưa chúng vào **Tiêu chí chấp nhận (Acceptance Criteria - AC)** của một Story lớn hơn (ví dụ: Story 3.1 về Bản đồ). Điều này giúp:
- Giảm số lượng tài liệu cần quản lý.
- Giúp lập trình viên thấy được bối cảnh sử dụng của tính năng nhỏ trong một luồng lớn.

### 3.2. Thiết kế theo Luồng nghiệp vụ (End-to-End Flow)
Mỗi Story được viết để mô tả một hành trình hoàn chỉnh của nhân viên an ninh. 
- *Ví dụ:* Story 4.2 (Kết thúc tuần tra) không chỉ là một nút bấm, mà bao gồm cả việc tổng hợp số liệu, hiển thị popup xác nhận và gửi dữ liệu về trung tâm.

### 3.3. Độ chi tiết của Tiêu chí chấp nhận (AC)
Sức mạnh của bộ tài liệu nằm ở phần AC. Mỗi Story có từ 4-6 AC cực kỳ chi tiết, bao phủ từ giao diện (UI), logic xử lý (Validation) đến phản hồi người dùng (Haptic/Feedback). Tổng cộng có hơn 40 tiêu chí kiểm thử cho 9 Stories.

### 3.4. Nguyên tắc Tối giản hóa cho MVP
Trong giai đoạn MVP, việc tập trung vào các "Câu chuyện tác chiến" cốt lõi (Cảnh báo & Tuần tra) giúp đội ngũ phát triển không bị phân tán bởi quá nhiều tài liệu nhỏ lẻ, từ đó đẩy nhanh tốc độ triển khai.

## 4. Danh sách 9 Stories phân theo EPIC

Để quản lý dự án hiệu quả, 9 Stories được chia vào 5 **Epic** (Nhóm tính năng lớn) dựa trên mục đích sử dụng và luồng nghiệp vụ cốt lõi:

### Epic 1: Quản lý Truy cập & Nền tảng (Access & Platform)
*   **Story 1.1**: Đăng nhập (Xác thực đa phương thức).
*   **Story 1.2**: Dashboard (Giám sát Tổng thể).
*   **Lý do**: Đây là "Cửa ngõ" và "Trung tâm điều khiển". EPIC này tập trung vào tính bảo mật (Login) và khả năng nắm bắt thông tin nhanh nhất khi bắt đầu ca trực (Dashboard).

### Epic 2: Hệ thống Cảnh báo & Công việc (Incident Management)
*   **Story 2.1**: Quản lý Danh sách Cảnh báo toàn hệ thống.
*   **Story 2.2**: Xem Chi tiết Cảnh báo & Briefing.
*   **Lý do**: Đây là luồng **Phản ứng (Reactive)**. EPIC này gom nhóm các tính năng xử lý Sự vụ xảy ra ngoài ý muốn từ trung tâm, từ bước tiếp nhận đến bước tìm hiểu hiện trường.

### Epic 3: Bản đồ & Dẫn đường (Tactical Map & Navigation)
*   **Story 3.1**: Tactical Map & Layers.
*   **Story 3.2**: Dẫn đường Văn bản (Textual Guidance).
*   **Lý do**: Đây là bộ công cụ **Không gian (Spatial Tools)**. EPIC này cung cấp khả năng quan sát (Bản đồ lớp) và hỗ trợ di chuyển (Routing), phục vụ cho tất cả các nhiệm vụ khác trong app.

### Epic 4: Tuần tra & Nhật ký di chuyển (Patrol & Monitoring)
*   **Story 4.1**: Giám sát Lộ trình thực tế.
*   **Story 4.2**: Báo cáo Sự cố & Kết thúc.
*   **Lý do**: Đây là luồng **Chủ động (Proactive)**. EPIC này tập trung vào các nhiệm vụ định kỳ, giám sát tính tuân thủ và cho phép Báo cáo Sự cố phát sinh khi đang thực hiện tuyến qua GPS.

### Epic 5: Hồ sơ & Cài đặt (Profile & Utilities)
*   **Story 5.1**: Liên lạc & Giao diện.
*   **Lý do**: Đây là nhóm **Tiện ích hỗ trợ (Supporting)**. EPIC này giải quyết các nhu cầu phụ trợ như liên lạc khẩn cấp (SOS) và tùy chỉnh cá nhân (Theme), giúp tăng trải nghiệm người dùng.

## 5. Kết luận
Việc phân loại theo EPIC như trên giúp đội ngũ phát triển:
- **Xác định thứ tự ưu tiên**: Thường thì Epic 1 & 2 sẽ được ưu tiên phát triển trước (Core workflow).
- **Quản lý module**: Dễ dàng phân chia công việc cho các nhóm Frontend/Backend theo từng mảng chức năng chuyên biệt.
- **Dễ dàng mở rộng**: Khi có tính năng mới, chỉ cần đưa vào Epic tương ứng thay vì xáo trộn toàn bộ danh sách.

---
*Cập nhật ngày: 26/01/2026*
*Người thực hiện: Antigravity AI Assistant*
