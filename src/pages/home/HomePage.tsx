import React from "react";
import { BookOutlined, CustomerServiceOutlined, EditOutlined, TrophyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./home.page.scss";
import AppHeader from "@/components/layout/AppHeader";

const levels = [
  { level: "HSK 1", title: "Khởi đầu tiếng Trung", description: "Làm quen chữ Hán, phát âm và mẫu câu giao tiếp cơ bản.", status: "Sắp ra mắt", route: "/hsk1", color: "pink" },
  { level: "HSK 2", title: "Xây dựng nền tảng", description: "Mở rộng từ vựng và phản xạ trong các tình huống quen thuộc.", status: "Sắp ra mắt", route: "/hsk2", color: "yellow" },
  { level: "HSK 3", title: "Giao tiếp trung cấp", description: "Luyện đọc, nghe và sử dụng câu dài hơn trong đời sống.", status: "Sắp ra mắt", route: "/hsk3", color: "green" },
  { level: "HSK 4", title: "Tiến tới thành thạo", description: "Củng cố ngữ pháp, tăng tốc độ đọc hiểu và diễn đạt.", status: "Sắp ra mắt", route: "/hsk4", color: "purple" },
  { level: "HSK 5", title: "Chinh phục nâng cao", description: "Flashcard, nghe gõ, trò chơi trí nhớ, ngữ pháp và bài tập bài 1-9.", status: "Học ngay", route: "/hsk5", color: "blue", available: true },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="learning-home">
      <AppHeader />

      <main>
        <section className="hero" id="about">
          <div className="hero-decoration decoration-one">学</div>
          <div className="hero-decoration decoration-two">中</div>
          <div className="home-container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">Nền tảng học tiếng Trung dành cho người Việt</span>
              <h1>Học tiếng Trung <span>rõ ràng, thú vị</span> và có lộ trình</h1>
              <p>
                Hệ thống bài học từ HSK 1 đến HSK 5, kết hợp flashcard, luyện nghe,
                gõ chữ Hán, trò chơi và bài tập tương tác giúp bạn duy trì thói quen mỗi ngày.
              </p>
              <div className="hero-actions">
                <Button type="primary" size="large" onClick={() => navigate("/hsk5")}>Bắt đầu học HSK 5</Button>
                <Button size="large" onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}>Xem lộ trình</Button>
              </div>
              <div className="hero-statistics">
                <div><strong>5</strong><span>Cấp độ HSK</span></div>
                <div><strong>9+</strong><span>Bài HSK 5</span></div>
                <div><strong>8</strong><span>Kiểu luyện tập</span></div>
              </div>
            </div>

            <div className="hero-card" aria-label="Minh họa bài học">
              <span className="hero-card-label">Từ vựng hôm nay</span>
              <div className="hanzi">学习</div>
              <div className="pinyin">xué xí</div>
              <strong>Học tập</strong>
              <div className="progress"><span /></div>
              <small>Tiến độ mục tiêu hôm nay: 75%</small>
              <div className="floating-chip chip-one">你好</div>
              <div className="floating-chip chip-two">加油!</div>
            </div>
          </div>
        </section>

        <section className="courses-section" id="courses">
          <div className="home-container">
            <div className="section-heading">
              <span className="eyebrow">Lộ trình học tập</span>
              <h2>Chọn cấp độ phù hợp với bạn</h2>
              <p>Bắt đầu từ nền tảng hoặc tiếp tục trực tiếp với khóa HSK 5 hiện có.</p>
            </div>
            <div className="level-grid">
              {levels.map((item) => (
                <article className={`level-card ${item.color} ${item.available ? "available" : ""}`} key={item.level}>
                  <div className="level-top"><span className="level-badge">{item.level}</span><span className="status">{item.status}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button type="button" disabled={!item.available} onClick={() => navigate(item.route)}>
                    {item.available ? "Vào khóa học" : "Đang xây dựng"} <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="home-container">
            <div className="section-heading"><span className="eyebrow">Học hiệu quả hơn</span><h2>Một nơi, nhiều cách luyện tập</h2></div>
            <div className="feature-grid">
              <article><BookOutlined /><h3>Flashcard trực quan</h3><p>Ôn chữ Hán, pinyin, nghĩa và ví dụ theo từng bài.</p></article>
              <article><CustomerServiceOutlined /><h3>Nghe và gõ</h3><p>Luyện phát âm, khả năng nghe hiểu và ghi nhớ chữ Hán.</p></article>
              <article><EditOutlined /><h3>Bài tập tương tác</h3><p>Điền từ, sắp xếp câu và phân biệt những từ dễ nhầm.</p></article>
              <article><TrophyOutlined /><h3>Học qua trò chơi</h3><p>Củng cố từ vựng bằng trò chơi trí nhớ và nối từ.</p></article>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer"><div className="home-container"><strong>Aliu Chinese</strong><span>Học từng ngày, tiến bộ từng bước.</span></div></footer>
    </div>
  );
};

export default HomePage;
