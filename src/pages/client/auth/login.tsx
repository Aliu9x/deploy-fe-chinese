import { useState } from "react";
import {
  App,
  Button,
  Form,
  Input,
  Typography,
  type FormProps,
} from "antd";
import {
  ArrowLeftOutlined,
  BookOutlined,
  CheckCircleFilled,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
import "./login.scss";

const { Title, Paragraph, Text } = Typography;

type FieldType = {
  email: string;
  password: string;
};

type LoginLocationState = {
  redirectPath?: string;
};

const LoginPage = () => {
  const { message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated, setUser } = useCurrentApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, password } = values;
    setIsSubmit(true);

    try {
      const res = await loginApi(email, password);

      if (res.data) {
        setIsAuthenticated(true);
        setUser(res.data.user);
        localStorage.setItem("access_token", res.data.access_token);
        message.success(res.message);

        const state = location.state as LoginLocationState | null;
        const redirectPath = state?.redirectPath;

        if (redirectPath) {
          navigate(redirectPath, { replace: true });
        } else if (res.data.user?.role === "ADMIN") {
          navigate("/admin");
        } else if (res.data.user?.role === "CUSTOMER") {
          navigate("/");
        }
      } else {
        message.error(res.message || "Đăng nhập không thành công.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Không thể đăng nhập. Vui lòng thử lại.");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-page__decor login-page__decor--left" aria-hidden="true">
        学
      </div>
      <div className="login-page__decor login-page__decor--right" aria-hidden="true">
        中
      </div>

      <Button
        type="text"
        className="login-page__back"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </Button>

      <section className="login-card">
        <aside className="login-card__intro">
          <Link to="/" className="login-brand" aria-label="Về trang chủ Aliu Chinese">
            <span className="login-brand__icon">
              <BookOutlined />
            </span>
            <span className="login-brand__text">
              <strong>Aliu Chinese</strong>
              <small>Học tiếng Trung mỗi ngày</small>
            </span>
          </Link>

          <div className="login-intro-content">
            <span className="login-intro-content__badge">
              欢迎回来 · Chào mừng trở lại
            </span>

            <h1>
              Tiếp tục hành trình
              <span> chinh phục tiếng Trung</span>
            </h1>

            <p>
              Đăng nhập để tiếp tục bài học, luyện từ vựng HSK và duy trì
              tiến độ học tập mỗi ngày.
            </p>

            <ul className="login-benefits">
              <li>
                <CheckCircleFilled />
                <span>Lộ trình học tập từ HSK 1 đến HSK 5</span>
              </li>
              <li>
                <CheckCircleFilled />
                <span>Flashcard, nghe và gõ, bài tập tương tác</span>
              </li>
              <li>
                <CheckCircleFilled />
                <span>Theo dõi tiến độ học tập cá nhân</span>
              </li>
            </ul>
          </div>

          <div className="daily-word" aria-hidden="true">
            <span className="daily-word__label">Từ vựng hôm nay</span>
            <strong>坚持</strong>
            <span className="daily-word__pinyin">jiān chí</span>
            <small>Kiên trì</small>
          </div>
        </aside>

        <section className="login-card__form-side">
          <div className="login-form-wrapper">
            <div className="login-form-heading">
              <span className="login-form-heading__mobile-logo">
                <BookOutlined />
              </span>
              <Title level={2}>Đăng nhập</Title>
              <Paragraph>
                Nhập thông tin tài khoản để tiếp tục học tiếng Trung.
              </Paragraph>
            </div>

            <Form<FieldType>
              name="login"
              className="login-form"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              requiredMark={false}
            >
              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email của bạn"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item<FieldType>
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item className="login-form__submit-item">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isSubmit}
                  className="login-form__submit"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className="login-form__register">
                <Text>Chưa có tài khoản?</Text>
                <Link to="/register">Đăng ký ngay</Link>
              </div>
            </Form>

            <Text className="login-form__security-note">
              Thông tin đăng nhập của bạn được bảo vệ an toàn.
            </Text>
          </div>
        </section>
      </section>
    </main>
  );
};

export default LoginPage;


