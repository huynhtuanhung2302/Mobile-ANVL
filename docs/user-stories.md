# User Stories & Acceptance Criteria (Chi tiết) - ANVL Mobile

> [!IMPORTANT]
> **Trạng thái triển khai**: Tài liệu này đã được rà soát và cập nhật để khớp 100% với logic thực tế của Mobile App (High-fidelity Prototype). Các tính năng như MQTT, GPS nền, và Dẫn đường hiện đang hoạt động dưới dạng **Giả lập (Simulation/Mock)** dựa trên `AlertQueueContext` và tọa độ giả định.

Tài liệu này quy chuẩn hóa các yêu cầu nghiệp vụ thành User Stories nguyên tử (Atomic) với Tiêu chí chấp nhận (AC) chi tiết, phục vụ phát triển, kiểm thử và nghiệm thu (UAT).

---

## EPIC 1: Quản lý Truy cập & Nền tảng (Access & Platform)

### Story 1.1: Xác thực Đăng nhập & Điều hướng Landing (Est: S)
- **Màn hình**: Đăng nhập - Giao diện nhập mã nhân viên/SĐT và mật khẩu.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **đăng nhập vào hệ thống**, để **bắt đầu ca trực**.
- **AC**:
    - [ ] **Giao diện**: Input Mã NV/SĐT, mật khẩu (mặc định ẩn). Nút "Đăng nhập" trạng thái Primary.
    - [ ] **Validation**: Báo lỗi "Thông tin không chính xác" nếu bỏ trống hoặc sai định dạng.
    - [ ] **Landing Logic**: Sau khi đăng nhập thành công, điều hướng thẳng vào **Dashboard**.
    - [ ] **Loading State**: Hiển thị spinner và vô hiệu hóa nút bấm trong quá trình xác thực.

### Story 1.2: Bảo mật Phiên & Duy trì trạng thái (Persistence) (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **nghỉ giữa ca mà không phải đăng nhập lại**, để **thuận tiện trong thao tác**.
- **AC**:
    - [ ] **Auto-login**: Lưu token vào AsyncStorage. Khi mở app, nếu còn phiên thì bỏ qua màn Login.
    - [ ] **Logout Sequence**: Xóa toàn bộ dữ liệu phiên, điều hướng về Login và xóa lịch sử điều hướng (back stack).
    - [ ] **Xác nhận**: Yêu cầu xác nhận qua Modal trước khi thực hiện Đăng xuất.

### Story 1.3: Dashboard: Hồ sơ & Chỉ số Tác chiến (Est: S)
- **Màn hình**: Dashboard - Trung tâm điều phối.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **thấy trạng thái sẵn sàng của mình**, để **nắm bắt tổng quan nhiệm vụ**.
- **AC**:
    - [ ] **Profile Hub**: Hiển thị Avatar, Tên (UPPERCASE) và Mã số nhân viên.
    - [ ] **Real-time Counters**: 
        - Nhóm 4 widget: Chờ xử lý (Red), Đã nhận (Blue), Đã báo cáo (Orange), Hoàn tất (Green).
        - Dữ liệu nhảy số tự động (Counter) theo thời gian thực từ `AlertQueueContext`.
    - [ ] **Deep Linking**: Nhấn vào widget điều hướng đúng tab tương ứng trong màn hình Cảnh báo.

### Story 1.4: Dashboard: Tactical Mini-Map & Pulse (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **biết vị trí của mình so với tổng thể khu vực**, để **định hướng di chuyển**.
- **AC**:
    - [ ] **Visual**: Bản đồ nền tối (Dark mode) hiển thị vị trí hiện tại của User (Cyan Marker).
    - [ ] **Animation**: Hiệu ứng vòng tròn lan tỏa (Pulse) tại vị trí User để tăng tính nhận diện.
    - [ ] **Shortcut**: Chạm vào bản đồ nhỏ sẽ chuyển sang Tab Bản đồ chính.

### Story 1.5: Dashboard: Lịch tuần tra Thông minh (Hero Card) (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **hệ thống tự gợi ý ca tuần tra cần làm**, để **không bỏ lỡ lịch trình**.
- **AC**:
    - [ ] **Priority Logic**:
        - Hiển thị ca đang chạy (`ĐANG THỰC HIỆN`) hoặc ca tới giờ làm (`CHƯA THỰC HIỆN`).
        - Nếu hôm nay không còn ca nào, tự động hiển thị ca đầu tiên của **Ngày mai**.
    - [ ] **Clean UI**: Ẩn các ca đã `HOÀN THÀNH` hoặc `ĐÃ BÁO CÁO` để Dashboard luôn gọn gàng.
    - [ ] **Unified Action**: Chạm vào Item sẽ tự động điều hướng theo trạng thái (Bản đồ tập kết hoặc Form báo cáo).

### Story 1.6: Active Mission Banner (Sticky HUD) (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **luôn thấy nhiệm vụ khẩn cấp đang xử lý**, để **truy cập nhanh báo cáo từ bất kỳ đâu**.
- **AC**:
    - [ ] **Conditional Display**: Chỉ hiện khi có sự vụ ở trạng thái `RECEIVED`.
    - [ ] **Sticky UI**: Banner màu đỏ nổi bật ở đáy màn hình, không bị che bởi nội dung khác.
    - [ ] **Live Timer**: Hiển thị đồng hồ đếm giây (`MM:SS`) tính từ thời điểm tiếp nhận.
    - [ ] **Fast Forward**: Nhấn vào banner mở ngay màn hình **Báo cáo sự vụ** (Story 2.4).

### Story 1.7: Thay đổi Mật khẩu (Security Update) (Est: S)
- **Màn hình**: Hồ sơ / Cài đặt - Giao diện đổi mật khẩu.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **tự đổi mật khẩu của mình**, để **tăng cường tính bảo mật cá nhân**.
- **AC**:
    - [ ] **Giao diện**: Form nhập Mật khẩu cũ, Mật khẩu mới và Xác nhận mật khẩu mới.
    - [ ] **Validation**: 
        - Kiểm tra mật khẩu cũ phải khớp với hệ thống.
        - Mật khẩu mới phải đủ độ phức tạp (tối thiểu 6 ký tự).
        - Xác nhận mật khẩu phải khớp với mật khẩu mới.
    - [ ] **Feedback**: Hiển thị Toast thông báo "Đổi mật khẩu thành công" và yêu cầu đăng nhập lại (tùy chọn).

### Story 1.8: Tùy chỉnh Giao diện (Theme Switching) (Est: S)
- **Màn hình**: Hồ sơ / Cài đặt - Tùy chọn Theme.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **chuyển đổi giữa chế độ Sáng và Tối**, để **phù hợp với môi trường làm việc (trong nhà/ngoài trời)**.
- **AC**:
    - [ ] **Options**: Hỗ trợ 3 lựa chọn: "Sáng", "Tối", "Theo hệ thống".
    - [ ] **Persistence**: Lưu lựa chọn vào bộ nhớ máy, không bị mất khi khởi động lại app.
    - [ ] **Global Application**: Màu sắc toàn bộ ứng dụng (Bản đồ, Card, Text) thay đổi ngay lập tức sau khi chọn.

### Story 1.9: Chính sách Bảo mật & Điều khoản (Privacy Policy) (Est: XS)
- **Màn hình**: Hồ sơ / Cổng thông tin pháp lý.
- **User Story**: Là một **Người dùng ứng dụng**, tôi muốn **đọc các điều khoản và chính sách bảo mật**, để **hiểu cách dữ liệu của mình được bảo vệ**.
- **AC**:
    - [ ] **Access**: Link truy cập dễ dàng tìm thấy trong mục Hồ sơ/Cài đặt.
    - [ ] **Content**: Hiển thị văn bản chính sách bảo mật cập nhật nhất của ANVL.
    - [ ] **Viewer**: Sử dụng Webview hoặc giao diện văn bản sạch sẽ, hỗ trợ cuộn.
---

## EPIC 2: Hệ thống Cảnh báo & Công việc (Incident Management)

### Story 2.1: Quản lý Danh sách sự vụ (Alert Inventory) (Est: M)
- **Màn hình**: Danh sách Cảnh báo - Phân loại theo trạng thái xử lý.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **phân loại sự vụ theo quy trình xử lý**, để **không bị chồng chéo công việc**.
- **AC**:
    - [ ] **Tab System**: 5 tab (`Tất cả`, `Chờ`, `Nhận`, `Báo cáo`, `Xong`) với số lượng đếm (Badge).
    - [ ] **Auto-refresh**: Danh sách tự cập nhật khi trạng thái thay đổi trong Context.
    - [ ] **Interactive Card**:
        - `UNPROCESSED` -> Mở màn hình **Tiếp nhận** (Briefing).
        - `RECEIVED` -> Mở màn hình **Báo cáo sự vụ** (Report).
        - `REPORTED` / `FINISHED` -> Mở màn hình **Tóm tắt Sự vụ** (Summary - Story 2.5).
    - [ ] **Sorting**: Ưu tiên sự vụ **Khẩn cấp** và thời gian mới nhất lên đầu.

### Story 2.2: Hệ thống Tin báo MQTT & Giả lập (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **nhận thông tin sự vụ tức thời**, để **phản ứng kịp thời**.
- **AC**:
    - [ ] **Mock Engine**: Sử dụng `AlertQueueContext` để giả lập các gói tin MQTT gửi tới App.
    - [ ] **Notifications**: Hiển thị Toast hoặc Badge Badge cập nhật ngay khi có sự vụ mới được "bơm" vào hệ thống.

### Story 2.3: Tactical Mission: Enhanced Unified Interface (Est: S)
- **Màn hình**: Tactical Mission (Dẫn đường) - Màn hình tác chiến trung tâm.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **thấy bối cảnh sự vụ và lộ trình dẫn đường chi tiết tại cùng một nơi**, để **không phải chuyển đổi màn hình khi đang cơ động**.
- **AC**:
    - [x] **Tóm tắt hợp nhất**: Card chứa ID sự vụ, Vị trí (Tòa/Tầng), Nội dung xử lý, Ghi chú và Mức độ ưu tiên.
    - [x] **Enhanced Map Widget**:
        - Bản đồ mini hiển thị lộ trình thời gian thực (ETA, Distance).
        - **Interactive**: Chạm vào widget để mở rộng (Expand) sang Tab Bản đồ toàn màn hình.
    - [x] **Contextual Step List**: Tích hợp danh sách các bước dẫn đường (Simplified Step List) ngay dưới bản đồ.
    - [x] **Media Evidence**: Hiển thị ảnh chụp/camera hiện trường kèm nhãn rõ ràng.

### Story 2.4: Lifecycle: Tiếp nhận & Phản ứng hiện trường (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **thực hiện quy trình báo cáo kết quả**, để **đóng hồ sơ sự vụ**.
- **AC**:
    - [ ] **Tiếp nhận (Step 1)**: Nhấn "Đã hiểu/Tiếp nhận" tại màn Briefing để chuyển trạng thái sang `RECEIVED`.
    - [ ] **Hiện trường (Step 2)**: Tại màn Hình `RECEIVED`, có nút "BÁO CÁO KẾT QUẢ" để mở form cuối.
    - [ ] **Báo cáo (Step 3)**:
        - Picker chọn kết quả: "Thành công" / "Thất bại".
        - TextInput nhập ghi chú thực tế.
        - **Chấm dứt**: Nhấn gửi chuyển trạng thái sang `REPORTED` (Chờ TTCH xác nhận) hoặc `FINISHED`.
    - [ ] **Feedback**: Hiệu ứng rung (Haptics) và thông báo thành công sau khi gửi.

### Story 2.5: Lịch sử & Tóm tắt Sự vụ (Incident Summary) (Est: S)
- **Màn hình**: Tổng hợp sự vụ (Lịch sử) - Xem lại kết quả xử lý.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **xem lại bản tóm tắt các sự vụ đã báo cáo**, để **đối soát nội dung và theo dõi xác nhận từ TTCH**.
- **AC**:
    - [ ] **Status Banner**: Hiển thị rõ trạng thái: "Đang chờ TTCH xác nhận" (Orange) hoặc "Đã hoàn thành" (Green).
    - [ ] **Original Alert Data**: Hiển thị ID sự vụ, mức độ, loại hình và chỉ thị gốc từ TTCH.
    - [ ] **Resolution Data**: Hiển thị nội dung báo cáo thực tế, hình ảnh ghi nhận và thời gian hoàn tất.
    - [ ] **Read-only**: Dữ liệu tĩnh, không cho phép chỉnh sửa sau khi đã báo cáo.
---

## EPIC 3: Bản đồ & Dẫn đường (Tactical Map & Navigation)

### Story 3.1: Tactical Layers & Device Visibility (Est: M)
- **Màn hình**: Bản đồ tác chiến - Quản lý hiển thị thiết bị.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **bật/tắt các lớp thông tin thiết bị (Camera, Sensor)**, để **tối ưu hóa quan sát**.
- **AC**:
    - [ ] **Layer Control**: FAB (Floating Action Button) để chọn: Lớp Camera, Lớp Cảm biến, Lớp Tòa nhà.
    - [ ] **Interactivity**: Nhấn vào icon Camera trên bản đồ để xem Pop-up luồng Live (Giả lập).
    - [ ] **Auto-centering**: Bản đồ tự động xoay và phóng to (Zoom) theo hướng di chuyển của User.

### Story 3.2: Dẫn đường Ngoài trời (Outdoor Polylines) (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **thấy đường đi ngắn nhất đến sự vụ**, để **rút ngắn thời gian cơ động**.
- **AC**:
    - [ ] **Visual Path**: Vẽ đường kẻ xanh (Polyline) kết nối từ vị trí User đến mục tiêu.
    - [ ] **Distance Display**: Thẻ thông tin hiển thị khoảng cách còn lại (Mét/Km) cập nhật theo vị trí thực.
    - [ ] **Target Marker**: Điểm đến có icon Sự vụ đặc trưng kèm hiệu ứng cảnh báo (Pulse).

### Story 3.3: Dẫn đường Logic Trong nhà (Indoor Context) (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **được chỉ dẫn khi vào trong các tòa nhà phức tạp**, để **tìm đúng tầng/phòng**.
- **AC**:
    - [x] **Context Switching**: Hệ thống tự động phân loại và hiển thị nhãn **INDOOR** (Trong nhà) hoặc **OUTDOOR** (Ngoài trời) cho từng bước dẫn đường.
    - [x] **Step-by-step**: Hiển thị bảng chỉ dẫn văn bản dạng Timeline: "Vào sảnh -> Thang máy -> Tầng 4 -> Phòng 402".
    - [x] **Floor Indicator**: Hiển thị tầng hiện tại của sự vụ nổi bật trên cả bản đồ và danh sách chỉ dẫn.
    - [x] **Trạng thái**: Đánh dấu điểm tích xanh cho các bước đã hoàn thành để nhân viên dễ theo dõi tiến độ.
---

## EPIC 4: Hệ thống Thông báo & Cảnh báo (Notification System)

### Story 4.1: Push Notification (Foreground/Background) (Est: S)
- **Màn hình**: Toàn dự án (System-level).
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **nhận thông báo ngay cả khi không mở app**, để **không bỏ lỡ sự vụ khẩn cấp**.
- **AC**:
    - [ ] **Display Logic**: Hiển thị Banner thông báo ngay khi có tín hiệu MQTT/Signal từ Backend.
    - [ ] **Data Payload**: Thông báo phải chứa đầy đủ: Loại sự vụ (🚨), Vị trí (Khu vực/Tầng), Mức độ khẩn cấp.
    - [ ] **Background Handling**: App vẫn nhận được tin và hiển thị trên thanh trạng thái (Status Bar) khi đang chạy ngầm hoặc khóa màn hình.
    - [ ] **Vibration**: Rung nhẹ 1 lần để thông báo có tin mới.

### Story 4.2: Critical Alert Overlay (Ringing State) (Est: S)
- **Màn hình**: AlertOverlay - Giao diện tràn màn hình gây chú ý tối đa.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **màn hình điện thoại rung và hiện cảnh báo đỏ rực**, để **huy động sự tập trung tức thì khi có sự cố nghiêm trọng**.
- **AC**:
    - [ ] **Overlay UI**: Tự động hiển thị đè (Modal/Overlay) lên mọi màn hình hiện tại khi có sự vụ CRITICAL/HIGH.
    - [ ] **Visual Feedback**: Pulse animation nháy đỏ toàn màn hình, kèm theo sóng âm (Visualizer) chạy liên tục.
    - [ ] **Mandatory Slide**: Phải trượt Slider "NHẬN LỆNH" mới được vào màn hình Briefing, tránh vô tình chạm tay làm mất cảnh báo.
    - [ ] **Escalation Logic**: Nếu sau 30 giây không tương tác, app tăng mức độ rung dồn dập hơn và hiển thị nhãn "ĐANG LEO THANG".

### Story 4.3: Sound & Haptic Profiles (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **nghe tiếng chuông là biết độ khẩn cấp**, để **ưu tiên phản ứng phù hợp**.
- **AC**:
    - [ ] **Critical Profile**: Âm báo dồn dập (Siren), rung "HEAVY" liên tục không ngắt quãng (Dành cho CRITICAL/HIGH).
    - [ ] **Normal Profile**: Âm báo ngắn (Beep), rung "MEDIUM" 2 nhịp cho sự vụ bình thường (LOW/MEDIUM).

### Story 4.4: Deep Linking & Fast Response (Est: S)
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **chạm vào thông báo để vào thẳng màn hình xử lý**, để **tiết kiệm thời gian thao tác**.
- **AC**:
    - [ ] **Direct Access**: Chạm vào Notification hoặc trượt Slider Acceptance sẽ điều hướng thẳng đến `tactical-mission.tsx` (Briefing).
    - [ ] **State Sync**: Ứng dụng tự động chuyển trạng thái sự vụ sang `RECEIVED` (Đã tiếp nhận) ngay khi User chạm vào thông báo.

---

## EPIC 5: Tuần tra & Nhật ký di chuyển (Patrol & Monitoring)

### Story 5.1: GPS Tracking & Nhật ký di chuyển (Est: S)
- **Màn hình**: Toàn bộ ứng dụng (Chạy nền) - Ghi nhận tọa độ di chuyển của nhân viên khi đang đi tuần.
- **User Story**: Là một **Cấp quản lý**, tôi muốn **theo dõi lộ trình thực tế của nhân viên trên bản đồ**, để **đảm bảo nhân viên đi đúng tuyến quy định**.
- **AC**:
    - [ ] **Foreground Tracking**: Tự động ghi nhận tọa độ GPS mỗi 30-60 giây khi ca tuần tra ở trạng thái `ĐANG THỰC HIỆN`.
    - [ ] **Semantic Mapping**: Hệ thống tự động ánh xạ tọa độ GPS sang tên địa danh (Ví dụ: "Khu vực Cổng B") dựa trên Metadata khu vực.
    - [ ] **Visual History**: Hiển thị đường đi (Polyline) trên bản đồ khi xem lại lịch sử.

### Story 5.2: Lịch trình Đa ngày (Multi-day Schedule) (Est: S)
- **Màn hình**: Lịch tuần tra (Tab Patrol) - Hiển thị danh sách ca trực theo thời gian.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **biết lịch trình tuần tra của mình trong ngày và ngày tiếp theo**, để **chủ động sắp xếp công việc**.
- **AC**:
    - [ ] **Timeline View**: Danh sách nhiệm vụ sắp xếp theo giờ, có đường kẻ timeline kết nối các thẻ.
    - [ ] **Status Flow**:
        - Nhấn vào ca **CHƯA THỰC HIỆN**: Có nút "BẮT ĐẦU" để kích hoạt nhiệm vụ.
        - Nhấn vào ca **ĐANG THỰC HIỆN**: Mở chi tiết tuần tra (Bản đồ/Danh sách).
        - Nhấn vào ca **HOÀN THÀNH**: Điều hướng trực tiếp đến màn hình **Báo cáo Tuần tra**.
        - Nhấn vào ca **ĐÃ BÁO CÁO**: Mở màn hình **Lịch sử Tuần tra** (Read-only).

### Story 5.3: Báo cáo Sự cố Phát sinh (In-Patrol Occurrence) (Est: S)
- **Màn hình**: Báo cáo sự cố (Occurrence Report) - Chụp ảnh & GPS sự cố tự phát sinh trong khi tuần tra.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **báo cáo ngay lập tức một sự việc bất thường gặp phải khi đang tuần tra**, để **kịp thời ghi nhận thông tin hiện trường**.
- **AC**:
    - [ ] **Quick Report**: Nút "Báo cáo sự cố" luôn hiển thị nổi trên màn hình Tuần tra.
    - [ ] **Data Entry**: Chụp tối đa 3 ảnh, nhập mô tả và tự động đính kèm vị trí GPS hiện tại.

### Story 5.4: Tổng kết, Đóng ca & Lịch sử (Unified Report & History) (Est: S)
- **Màn hình**: Báo cáo tuần tra (`patrol-report.tsx`) - Hỗ trợ cả 2 chế độ: Chốt ca và Xem lại.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **tổng kết kết quả ca trực** hoặc **xem lại các ca đã thực hiện**, để **hoàn tất công việc và đối soát khi cần**.
- **AC**:
    - [ ] **Chế độ Chốt ca (Submission)**:
        - Hiển thị khi ca ở trạng thái `HOÀN THÀNH`.
        - Thống kê % hoàn thành, quãng đường, thời gian.
        - Cho phép nhập ghi chú tổng kết.
        - **Mandatory Signature**: Nhân viên phải ký xác nhận trực tiếp trước khi gửi.
    - [ ] **Chế độ Lịch sử (Review)**:
        - Hiển thị khi ca ở trạng thái `ĐÃ BÁO CÁO`.
        - Toàn bộ thông số, ghi chú và chữ ký ở chế độ **Read-only**.
        - Hiển thị Badge trạng thái "ĐÃ BÁO CÁO" màu xanh.
    - [ ] **Unified Action**: Nút hành động thay đổi linh hoạt giữa "GỬI BÁO CÁO" và "ĐÓNG TÓM TẮT".

### Story 5.5: Tổng hợp Sự cố theo Ca (Est: S)
- **Màn hình**: Tổng hợp sự cố (`patrol-incidents-summary.tsx`) - Xem danh sách chi tiết các sự cố đã báo cáo.
- **AC**:
    - [ ] **Occurrence List**: Hiển thị danh sách tất cả các sự cố (An ninh/Hạ tầng) đã báo cáo trong ca.
    - [ ] **Detail View**: Nhấn vào từng mục để xem lại chi tiết hình ảnh và nội dung đã báo cáo.

### Story 5.6: Ghi nhận Bắt đầu (Start Behavior) (Est: S)
- **User Story**: Là một **Cấp quản lý**, tôi muốn **biết thời gian thực tế nhân viên bắt đầu đi tuần**, để **đánh giá tính kỷ luật**.
- **AC**:
    - [ ] **Start Tracking**: Ghi nhận timestamp khi nhấn nút "BẮT ĐẦU".
    - [ ] **Status Mapping**: Tự động chuyển trạng thái từ `CHƯA THỰC HIỆN` sang `ĐANG THỰC HIỆN`.

### Story 5.7: Nhật ký vị trí & Tín hiệu GPS (Est: S)
- **Màn hình**: Nhật ký vị trí (GPS Log) - Tra cứu chi tiết từng điểm di chuyển.
- **AC**:
    - [ ] **Point-by-point**: Danh sách chi tiết từng điểm tọa độ kèm mốc thời gian và địa danh.
    - [ ] **Quality Indicator**: Hiển thị mức độ chính xác của GPS (Kém/Bình thường/Tốt).

---

## PHÁT TRIỂN TRONG TƯƠNG LAI (PHASE 2+)

### Story 6.1: SOS Toàn cục (Global Panic Button) (Est: M)
- **Màn hình**: Toàn bộ ứng dụng - Một nút nổi (FAB) màu đỏ đặc trưng hiển thị trên mọi màn hình tác chiến.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **kích hoạt báo động khẩn cấp nhanh nhất có thể**, để **TTCH biết tôi đang gặp nguy hiểm hoặc có sự cố cực kỳ nghiêm trọng**.
- **AC**:
    - [ ] **Trigger Logic**: Nhấn giữ nút SOS trong đúng **3 giây** (để tránh chạm nhầm).
    - [ ] **Visual Feedback**: Khi đang nhấn, hiển thị vòng tròn tiến trình (Progress Ring) chạy quanh nút và đếm ngược 3..2..1. 
    - [ ] **Safety Mechanism**: Nếu buông tay trước 3 giây, tiến trình bị hủy bỏ ngay lập tức.
    - [ ] **Activation**: Sau khi kích hoạt thành công, app sẽ:
        - Gửi gói tin MQTT loại `SOS_SIGNAL` kèm vị trí GPS hiện tại.
        - Chuyển app sang chế độ "Emergency Mode" (Màn hình nhấp nháy đỏ, âm báo SOS).
        - Tự động bật micro để ghi âm hiện trường (tùy chọn bảo mật).
    - [ ] **Confirmation**: Rung dồn dập (Heavy Haptics) khi tín hiệu SOS được TTCH phản hồi "Đã nhận".

### Story 6.2: Báo cáo Sự cố Thiết bị/Hạ tầng (Maintenance Report) (Est: M)
- **Màn hình**: Occurrence report (Dynamic Mode) - Form chuyên biệt cho hạ tầng kỹ thuật.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **ghi nhận các hư hỏng thiết bị kỹ thuật khi đi tuần**, để **phòng kỹ thuật có thông tin sửa chữa kịp thời**.
- **AC**:
    - [ ] **QR Scanner Integration**: Nút "Quét mã thiết bị" để tự động điền ID thiết bị, Tên thiết bị và Vị trí từ cơ sở dữ liệu.
    - [ ] **Asset Validation**: Nếu không quét được QR, cho phép tìm kiếm thiết bị từ danh sách gợi ý theo tòa nhà.
    - [ ] **Category Mapping**: 
        - Phân loại lỗi: Hỏng vật lý, Mất tín hiệu, Hết pin, Khác.
        - Chọn mức độ ảnh hưởng: Thấp (Vẫn dùng được) đến Nghiêm trọng (Mất an ninh).
    - [ ] **Evidence**: Chụp tối thiểu 1 ảnh hiện trạng hư hỏng.
    - [ ] **Routing**: Tự động đánh dấu báo cáo này thuộc luồng "Maintenance" (khác với luồng Incident an ninh).

### Story 6.3: Quản lý Bảo trì & Xử lý Ticket (Est: L)
- **Màn hình**: Tab Bảo trì (Tickets) - Danh sách các đầu việc kỹ thuật được giao.
- **User Story**: Là một **Nhân viên an ninh (First Responder)**, tôi muốn **nhận và xử lý các yêu cầu bảo trì đơn giản**, để **đảm bảo thiết bị an ninh luôn hoạt động**.
- **AC**:
    - [ ] **Ticket Inventory**: Hiển thị danh sách các phiếu bảo trì được giao cho nhân viên (Chờ, Đang làm, Đã xong).
    - [ ] **Briefing & Route**: Mỗi Ticket có thông tin vị trí chi tiết và hướng dẫn xử lý sơ bộ (SOP).
    - [ ] **Lifecycle**:
        - Nhấn "TIẾP NHẬN" để bắt đầu xử lý.
        - Nhấn "HOÀN TẤT" kèm ảnh chụp sau khi xử lý và chữ ký xác nhận (nếu cần).
    - [ ] **Deferred Status**: Cho phép chuyển trạng thái "CẦN CHUYÊN GIA" nếu vượt quá khả năng xử lý của nhân viên an ninh.
