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
---

## EPIC 2: Hệ thống Cảnh báo & Công việc (Incident Management)

### Story 2.1: Quản lý Danh sách sự vụ (Alert Inventory) (Est: M)
- **Màn hình**: Danh sách Cảnh báo - Phân loại theo trạng thái xử lý.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **phân loại sự vụ theo quy trình xử lý**, để **không bị chồng chéo công việc**.
- **AC**:
    - [ ] **Tab System**: 4 tab (`Chờ`, `Nhận`, `Báo cáo`, `Xong`) với số lượng đếm (Badge).
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

### Story 2.3: Tactical Mission: Unified Briefing & Dashboard (Est: S)
- **Màn hình**: Tactical Mission (Dẫn đường) - Màn hình tác chiến trung tâm.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **thấy mọi dữ liệu sự vụ tại một nơi**, để **không phải chuyển đổi qua lại giữa các màn hình**.
- **AC**:
    - [ ] **Tóm tắt hợp nhất**: Card chứa ID sự vụ, Vị trí (Tòa/Tầng), Chỉ thị từ TTCH và Mức độ ưu tiên.
    - [ ] **Media Evidence**: Hiển thị ảnh chụp/camera hiện trường (Thumbnail) kèm nhãn tiếng Việt rõ ràng.
    - [ ] **Navigation Context**: Tích hợp bản đồ mini ngay trong màn hình briefing giúp xác định hướng tiếp cận.

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
    - [ ] **Context Switching**: App tự nhận diện khi User tiếp cận cửa tòa nhà và chuyển sang chế độ "Indoor Steps".
    - [ ] **Step-by-step**: Hiển thị bảng chỉ dẫn văn bản: "Vào sảnh -> Thang máy khu B -> Tầng 5 -> Phòng 502".
    - [ ] **Floor Indicator**: Hiển thị tầng hiện tại của sự vụ nổi bật trên bản đồ dẫn đường.
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

### Story 5.4: Tổng kết & Đóng ca (Patrol Submission) (Est: S)
- **Màn hình**: Báo cáo tuần tra - Báo cáo kết quả sau khi đi hết tuyến.
- **User Story**: Là một **Nhân viên an ninh**, tôi muốn **tổng kết kết quả ca trực và xác nhận trách nhiệm**, để **hoàn tất công việc**.
- **AC**:
    - [ ] **Summary Metrics**: Thống kê % hoàn thành, quãng đường đã đi, thời gian thực hiện.
    - [ ] **Mandatory Signature**: Nhân viên phải ký xác nhận trực tiếp trên màn hình trước khi nhấn "Gửi báo cáo".
    - [ ] **UI Feedback**: Sau khi ký, hiển thị dấu tick "Đã xác thực" trực quan.

### Story 5.5: Nhật ký vị trí & Tín hiệu GPS (Est: S)
- **Màn hình**: Nhật ký vị trí (GPS Log) - Tra cứu chi tiết từng điểm di chuyển.
- **AC**:
    - [ ] **Point-by-point**: Danh sách chi tiết từng điểm tọa độ kèm mốc thời gian và địa danh.
    - [ ] **Quality Indicator**: Hiển thị mức độ chính xác của GPS (Kém/Bình thường/Tốt).

### Story 5.6: Xem lại Lịch sử Tuần tra (History Read-only) (Est: S)
- **Màn hình**: Lịch sử tuần tra (Read-only) - Truy cập các ca trực đã đóng.
- **AC**:
    - [ ] **Summary View**: Xem lại toàn bộ thông số ca trực, ghi chú, danh sách sự cố và chữ ký.
    - [ ] **Unified Flow**: Tự động mở màn hình này khi truy cập ca trực có trạng thái `ĐÃ BÁO CÁO`.

---

## PHÁT TRIỂN TRONG TƯƠNG LAI (PHASE 2+)

### Story 6.1: SOS Toàn cục (3s Long Press) (Est: S)
- **Màn hình**: Toàn bộ ứng dụng - Nút SOS nổi cho phép báo động khẩn cấp từ mọi nơi.

### Story 6.2: Báo cáo Sự cố Thiết bị/Hạ tầng (Maintenance) (Est: S)
- **Màn hình**: Occurrence report - Ghi nhận hư hỏng thiết bị kỹ thuật (Camera, PCCC, Khóa).
- **AC**:
    - [ ] **QR Support**: Quét mã QR trên thiết bị để lấy ID tự động.
    - [ ] **Maintenance Routing**: Gắn nhãn phân loại hạ tầng để chuyển tiếp cho đội kỹ thuật.

### Story 6.3: Quản lý Bảo trì (Maintenance Tickets)
- **Màn hình**: Tab Bảo trì (Tickets) - Tiếp nhận và xử lý các yêu cầu sửa chữa thiết bị kỹ thuật.
