# 🧠 Smart Text Assistant – Extension hỗ trợ giao tiếp tiếng Anh bằng AI

## 🚀 Giới thiệu

**Smart Text Assistant** là một tiện ích mở rộng trình duyệt (browser extension) giúp người dùng **viết lại câu tiếng Anh theo phong cách chuyên nghiệp hoặc thân mật**, **sửa lỗi ngữ pháp**, **kiểm tra ngữ pháp**, **chuyển văn bản thành giọng nói**, và thậm chí **tra từ điển mini** – tất cả được tích hợp gọn nhẹ và hiển thị trực tiếp trên trình duyệt web.

Mục tiêu của extension là giúp việc **giao tiếp tiếng Anh trở nên dễ dàng, thuận tiện và hiệu quả hơn** trong nhiều ngữ cảnh, từ công việc cho đến học tập.

---

## 🧠 Các chức năng chính

- ✍️ **Rewrite câu văn**: Chuyển câu tiếng Anh sang 2 phong cách:
  - **Professional** – trang trọng, phù hợp công việc
  - **Casual** – thân mật, đời thường
- ✅ **Grammar Correction**: Sửa lỗi ngữ pháp và chính tả
- 🔎 **Grammar Check**: Phân tích và chỉ ra lỗi trong câu
- 🗣️ **Voice Input**: Nhập văn bản bằng giọng nói (Tiếng Việt hoặc Tiếng Anh)
- 🔊 **Text to Speech**: Đọc văn bản tiếng Anh hoặc tiếng Việt
- 📚 **Từ điển mini**: Xem nghĩa và phát âm của từ
- 💾 **Saved Words**: Lưu lại từ vựng quan trọng để ôn tập

---

## 🤖 Về AI Model

Các mô hình AI sử dụng trong extension đều được lấy từ Hugging Face:

| Chức năng            | Mô hình sử dụng                                                                 |
|----------------------|----------------------------------------------------------------------------------|
| **Rewrite**          | [`ramsrigouthamg/t5_paraphraser`](https://huggingface.co/ramsrigouthamg/t5_paraphraser) *(có fine-tune lại)* |
| **Grammar Correction** | [`flan-t5-large-grammar-synthesis`](https://huggingface.co/pszemraj/flan-t5-large-grammar-synthesis) |

### 🛠️ Vì sao tính năng Rewrite được fine-tune?

Mặc dù các mô hình từ Hugging Face đã đủ tốt cho nhiều tác vụ, mình muốn thử sức với việc **fine-tune một mô hình Rewrite riêng**, nhằm:
- Thích nghi tốt hơn với nhu cầu viết lại câu theo **2 phong cách rõ ràng** (Professional và Casual)
- Kiểm soát chất lượng đầu ra và phong cách ngôn ngữ
- Trải nghiệm quy trình fine-tuning thực tế trong dự án NLP

Các chức năng khác được gọi thông qua API để đảm bảo tốc độ xử lý và độ ổn định.

---

## 🧪 Cách sử dụng

1. **Bôi đen câu tiếng Anh cần xử lý**
2. **Chuột phải** và chọn `Smart Text Assistant: Choose Function` từ **context menu**
3. Giao diện popup sẽ hiện ra cho bạn chọn và sử dụng chức năng mong muốn

> 💡 **Mẹo:**  
> - Nhấn `Ctrl + Shift + V` để **mở nhanh tính năng Voice Input**

---

## 🛠️ Cài đặt & Sử dụng (chạy thử)

1. Tải về mã nguồn extension

2. Mở trình duyệt Chrome → `chrome://extensions/`

3. Bật **Developer Mode** → nhấn **Load unpacked** → chọn thư mục `/extension`

4. Truy cập một trang bất kỳ, bôi đen đoạn văn bản tiếng Anh → click icon để sử dụng tính năng

---

## 🛡️ Vấn đề bảo mật

Extension không lưu trữ bất kỳ nội dung cá nhân nào của người dùng
Các request gửi đến model thông qua Hugging Face Spaces hoặc API, không qua bên thứ ba

---

## 📫 Góp ý & Đóng góp

Mình rất mong nhận được phản hồi từ mọi người để cải thiện extension.  
Hãy tạo issue hoặc pull request nếu bạn muốn đóng góp thêm 🙌
