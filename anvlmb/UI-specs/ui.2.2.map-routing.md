# UI Spec 2.2: Màn hình Bản đồ & Dẫn đường (v2.0)

## 1. Visual Style (Aesthetics)
- **Map Theme:** Dark-themed maps (Custom Mapbox Style) với đường giao thông tối và Layer tòa nhà màu xám xanh.
- **Routing Line:** Màu xanh Neon (#00F2FF) có hiệu ứng mũi tên chạy dọc theo đường (Mũi tên chỉ hướng).
- **Layer System:** 5 loại markers với màu sắc riêng biệt (Alert=Red, Camera=Blue, IoT=Green, Building=Overlay, Zone=Transparent).

## 2. Layout & Composition

### 2.1. Idle Mode (Không có nhiệm vụ)
- **Full View:** Bản đồ chiếm 100% diện tích.
- **User Location:** Blue dot với accuracy circle (xanh nếu < 10m, đỏ nếu > 10m).
- **Floating Controls:** 
  - Layers button (mở Layer Menu)
  - Zoom In/Out
  - Re-center (Locate)
- **NO Navigation Card:** Không hiển thị ETA/Distance/Instruction.

### 2.2. Navigation Mode (Có nhiệm vụ)
Kích hoạt khi: `incidentId` hoặc `destination` được truyền vào.

- **Routing Line:** Polyline từ user location → destination.
- **Navigation Panel:** Card ở phía dưới hiển thị:
  - **ETA và Khoảng cách**: Tóm tắt ở header thẻ.
  - **Simplified Step List**: Danh sách Checklist toàn bộ các bước lộ trình (từ tiếp cận cổng đến phòng đích) để đảm bảo độ tin cậy khi mất tín hiệu GPS trong nhà.
  - **Premium Floating Floor Badge**: Nhãn số Tầng (vd: TẦNG 4) dạng Floating Pill màu Neon Red nằm ở góc trên bên phải thẻ, tích hợp icon Layers.
- **Reporting**: Chuyển nút hành động lên Mission Banner (UI 1.1). Thẻ bản đồ chỉ tập trung dẫn đường.

### 2.3. Layer Management
Bottom Sheet với 5 toggle switches:
- **Cảnh báo/Sự vụ** (Alerts) - Red markers
- **Camera** - Blue markers
- **Thiết bị IoT** - Green markers
- **Tòa nhà** (Buildings) - Polygon overlays
- **Khu vực** (Zones) - Color-coded areas

## 3. Interaction & Animation
- **Auto-Follow:** Bản đồ tự động xoay và di chuyển theo vị trí GPS của nhân viên.
- **Marker Pulse:** Marker điểm đến (Sự vụ) có vòng tròn sóng lan tỏa để dễ nhận diện.
- **GPS Simulation:** User location cập nhật mỗi 2 giây (mock).
- **Layer Toggle:** Smooth fade in/out khi bật/tắt layers.
- **Marker Click:** Click vào bất kỳ marker nào (Alert/Camera/IoT) → Kích hoạt Navigation Mode với routing đến marker đó. 
  - *Hỗ trợ Đa nhiệm:* Không kiểm tra xung đột với nhiệm vụ hiện tại, cho phép thay đổi mục tiêu dẫn đường bất cứ lúc nào.
- **Re-center:** Nhấn nút Locate → Map quay về vị trí user hiện tại.

## 4. Bảng thành phần chi tiết (Detailed Items)

| ID | Thành phần | Mô tả Visual | Tính năng |
| :--- | :--- | :--- | :--- |
| UI_MAP_01 | Map Engine | Dark MapBox (Mock) | Zoom, Pan, Tilt 45 độ |
| UI_MAP_02 | Route Line | Gradient Blue Neon | Hiệu ứng Animation Flow |
| UI_MAP_03 | Info Card | White text trên nền Glossy | **Conditional:** Chỉ hiển thị khi có `incidentId` hoặc `selectedDestination` |
| UI_MAP_04 | User Marker | Blue dot với accuracy circle | Real-time position (mock: 2s interval) |
| UI_MAP_05 | Layer Button | Icon "layers" màu Primary | Mở Layer Menu (Bottom Sheet) |
| UI_MAP_06 | Alert Marker | Red circle, icon warning | **Clickable:** Trigger routing |
| UI_MAP_07 | Camera Marker | Blue circle, icon videocam | **Clickable:** Trigger routing |
| UI_MAP_08 | IoT Marker | Green circle, icon chip | **Clickable:** Trigger routing |
| UI_MAP_09 | Building Overlay | Semi-transparent polygon | Toggle via Layer Menu |
| UI_MAP_10 | Accuracy Circle | Dynamic radius, color-coded | Green (< 10m), Red (> 10m) |
| UI_MAP_11 | Locate Button | Icon "locate" màu Primary | Re-center map về user location |

## 5. Metadata cho Developer
- **Screen Name:** `MapRoutingScreen`
- **Components:** `LayerMenu.tsx` (Bottom Sheet)
- **Mock Data:** 
  - 2 Alerts
  - 3 Cameras
  - 2 IoT devices
  - 3 Buildings
  - 1 Zone
- **GPS Simulation:** `setInterval(2000)` với random movement
- **Conditional Rendering:** Navigation Card chỉ render khi `incidentId !== undefined`
