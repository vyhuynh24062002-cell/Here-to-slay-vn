HERE TO SLAY PRIVATE V0.4 — ONLINE BETA

Chế độ offline V0.3 được giữ lại trong public/index.html. Chế độ online mới là một nền tảng riêng, chưa có đầy đủ kỹ năng, điều chỉnh xúc xắc, hình phạt, nội tại, cửa hàng đồng bộ, thưởng điểm hay mic. Các kết quả tấn công/đội hình cần xác nhận thủ công. Không dùng cho thi đấu chống gian lận. Không phát hành tài nguyên bài công khai.

CHẠY THỬ MẠNG LAN (Node.js 22+):
1. Giải nén ZIP, mở terminal trong thư mục đó.
2. node server.mjs
3. Máy tính mở http://localhost:8787; điện thoại cùng Wi-Fi mở http://<IP LAN máy tính>:8787 (cho phép cổng 8787 qua firewall nếu cần).
4. Chọn Phòng online Beta, tạo phòng, gửi mã cho bạn, chọn thủ lĩnh, sẵn sàng.
5. Máy chủ LAN lưu phòng trong RAM, tắt server sẽ mất phòng. Không mở cổng ra Internet.

CLOUDFLARE (chưa triển khai/kiểm thử trực tiếp):
1. Tạo tài khoản Cloudflare, kiểm tra gói miễn phí Workers và Durable Objects.
2. Cài Node.js, mở terminal trong thư mục đã giải nén.
3. npx wrangler login
4. npx wrangler deploy
5. Mở URL HTTPS Wrangler trả về. Không chia sẻ công khai đường dẫn hoặc tài nguyên. Mã phòng hạn chế tham gia phòng, nhưng không phải bảo vệ toàn bộ tài nguyên; muốn giới hạn truy cập toàn site cần cấu hình Access riêng trước khi chia sẻ.
6. iPhone: Safari > Chia sẻ > Thêm vào màn hình chính. Xoay ngang thủ công nếu thiết bị không hỗ trợ khóa hướng.
Không tự nâng cấp gói trả phí. Kiểm tra hạn mức trong dashboard. Polling 2.2 giây khi tab hiển thị; chưa tối ưu WebSocket.

KIỂM THỬ: node test.mjs (Node.js 22+). Kiểm tra cú pháp và API local. Chưa kiểm thử iOS/Android thật hoặc Cloudflare.
