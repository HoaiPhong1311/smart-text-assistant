# 🧠 Smart Text Assistant – AI English Helper Extension

Smart Text Assistant là một tiện ích mở rộng trình duyệt giúp bạn **giao tiếp tiếng Anh một cách thuận tiện hơn** bằng cách tích hợp trí tuệ nhân tạo (AI) để:

✅ Viết lại câu tiếng Anh theo 2 phong cách:
- **Professional** (chuyên nghiệp)
- **Casual** (thân mật)

✅ Sửa lỗi ngữ pháp tự động (Grammar Correction)

✅ Kiểm tra lỗi ngữ pháp và highlight (Grammar Check)

---

## 🚀 Mục tiêu

Giúp người dùng, đặc biệt là người học tiếng Anh hoặc làm việc trong môi trường quốc tế, dễ dàng:
- Chỉnh sửa, cải thiện câu tiếng Anh mà không cần mở trang web riêng
- Giao tiếp đúng ngữ cảnh hơn: lịch sự khi viết mail, thoải mái khi nhắn tin
- Tự kiểm tra và sửa ngữ pháp nhanh chóng

---

## 🧩 Tính năng chính

🔹 **Rewrite English Sentence**
- Bôi đen đoạn văn bản → chọn icon *Rewrite*
- AI sẽ trả về 2 phiên bản: *Casual* và *Professional*

🔹 **Grammar Correction**
- Sửa lỗi ngữ pháp tự động bằng mô hình AI

🔹 **Grammar Check**
- So sánh câu gốc và câu đã sửa → hiển thị các phần sai bằng gạch đỏ

---

## 🤖 Mô hình AI sử dụng

🔹 **Rewrite model**  
- Được fine-tuned từ mô hình `ramsrigouthamg/t5_paraphraser` để phù hợp cho nhiệm vụ rewrite theo 2 phong cách.  
- Được host trên [Hugging Face Spaces](https://huggingface.co/spaces)

🔹 **Grammar model**  
- Dựa trên mô hình pre-trained `flan-T5-large-grammar-synthesis`, được sử dụng lại từ Hugging Face.

---

## 🛠️ Cài đặt & Sử dụng (chạy thử)

1. Tải về mã nguồn extension

2. Mở trình duyệt Chrome → `chrome://extensions/`

3. Bật **Developer Mode** → nhấn **Load unpacked** → chọn thư mục `/extension`

4. Truy cập một trang bất kỳ, bôi đen đoạn văn bản tiếng Anh → click để sử dụng tính năng Rewrite hoặc Grammar
