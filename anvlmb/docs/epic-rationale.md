# Giải trình Logic Phân chia Epic (Roadmap Rationale)

Việc chia dự án ANVL Mobile thành 5 Epic cốt lõi dựa trên 3 trụ cột: **Bảo mật**, **Vận hành tác chiến**, và **Trải nghiệm người dùng**.

## 1. Tại sao lại là 5 Epic này?

### EPIC 1: Nền tảng (The Shell & Pulse)
- **Lý do**: Đây là "Cửa ngõ" (Login) và "Trái tim" (Dashboard) của ứng dụng.
- **Giá trị**: Đảm bảo chỉ người dùng hợp lệ mới truy cập được dữ liệu, đồng thời cung cấp cái nhìn tổng thể về "nhịp thở" của hệ thống ngay khi bắt đầu ca trực.

### EPIC 2: Phản ứng Cảnh báo (Reactive Flow)
- **Lý do**: Giải quyết giá trị cốt lõi nhất của hệ thống an ninh: **Xử lý Sự vụ khẩn cấp**.
- **Giá trị**: Giảm thời gian phản ứng từ khi có chuông báo đến khi nhân viên nắm bắt được hiện trường để xử lý Sự vụ.

### EPIC 3: Bản đồ & Dẫn đường (Tactical Map & Navigation)
- **Lý do**: Đây là bộ công cụ **Không gian (Spatial Tools)** dùng chung.
- **Giá trị**: Hỗ trợ cho cả EPIC 2 (đi đến Sự vụ) và EPIC 4 (đi tuần tra). Việc tách riêng giúp tối ưu hóa hiệu suất hiển thị bản đồ mà không phụ thuộc vào logic nghiệp vụ cụ thể.

### EPIC 4: Tuần tra & Nhật ký di chuyển (Proactive Flow)
- **Lý do**: Chuyển từ trạng thái "Chờ báo động" sang "Chủ động kiểm soát".
- **Giá trị**: Giám sát tính tuân thủ của nhân viên và số hóa toàn bộ nhật ký di chuyển, thay thế hoàn toàn sổ sách giấy tờ truyền thống.

### EPIC 5: Hồ sơ & Cài đặt (Supporting Utilities)
- **Lý do**: Nhóm các tính năng phụ trợ nhưng quan trọng cho an toàn và sức khỏe người dùng.
- **Giá trị**: SOS giúp bảo vệ nhân viên trong tình huống nguy hiểm, Theme (Dark/Light) giúp giảm mỏi mắt khi làm việc ca đêm.

## 2. Chiến lược Triển khai
- **Giai đoạn 1 (CORE)**: Tập trung EPIC 1 & 2 để hình thành luồng tác chiến cơ bản.
- **Giai đoạn 2 (OPERATION)**: Triển khai EPIC 3 & 4 để quy chuẩn hóa hoạt động hàng ngày.
- **Giai đoạn 3 (POLISH)**: Hoàn thiện EPIC 5 để tối ưu trải nghiệm.

---
*Cập nhật ngày: 26/01/2026*
