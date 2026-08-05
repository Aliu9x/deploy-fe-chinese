import React, { useMemo, useState } from "react";
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
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { registerApi } from "@/services/api";
import "./register.scss";

const { Title, Paragraph, Text } = Typography;

type FieldType = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type RoleType = "CUSTOMER" | "HOTEL_OWNER" | string;

type RegisterLocationState = {
  role?: RoleType;
};

const RegisterPage: React.FC = () => {
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const locationState = location.state as RegisterLocationState | null;
  const roleFromState = locationState?.role;
  const roleFromQuery = searchParams.get("role") as RoleType | null;

  const role: RoleType = useMemo(
    () => roleFromState || roleFromQuery || "CUSTOMER",
    [roleFromState, roleFromQuery]
  );

  const isHotelOwner = role === "HOTEL_OWNER";

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { phone, email, name, password } = values;

    try {
      setIsSubmitting(true);
      const res = await registerApi(email, password, phone, name);

      if (res?.data) {
        message.success(
          isHotelOwner
            ? "Đăng ký đối tác khách sạn thành công"
            : "Đăng ký người dùng thành công"
        );
        navigate("/login", { replace: true });
      } else {
        message.error(res?.error || "Đăng ký thất bại, thử lại sau.");
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      message.error(
        apiError?.response?.data?.message ||
          apiError?.message ||
          "Có lỗi xảy ra khi đăng ký."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
    message.error("Vui lòng kiểm tra lại các trường thông tin.");
  };

  return (
    <main className="register-page">
      <div className="register-page__decor register-page__decor--left" aria-hidden="true">
        汉
      </div>
      <div className="register-page__decor register-page__decor--right" aria-hidden="true">
        语
      </div>

      <Button
        type="text"
        className="register-page__back"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </Button>

      <section className="register-card">
        <aside className="register-card__intro">
          <Link to="/" className="register-brand" aria-label="Về trang chủ Aliu Chinese">
            <span className="register-brand__icon">
              <BookOutlined />
            </span>
            <span className="register-brand__text">
              <strong>Aliu Chinese</strong>
              <small>Học tiếng Trung mỗi ngày</small>
            </span>
          </Link>

          <div className="register-intro-content">
            <span className="register-intro-content__badge">
              开始学习 · Bắt đầu hành trình
            </span>

            <h1>
              Tạo tài khoản và
              <span> học tiếng Trung ngay hôm nay</span>
            </h1>

            <p>
              Xây dựng nền tảng từ HSK 1 đến HSK 5 bằng lộ trình rõ ràng,
              bài tập trực quan và phương pháp học phù hợp mỗi ngày.
            </p>

            <ul className="register-benefits">
              <li>
                <CheckCircleFilled />
                <span>Lưu tiến độ và kết quả luyện tập cá nhân</span>
              </li>
              <li>
                <CheckCircleFilled />
                <span>Học từ vựng, ngữ pháp và luyện nghe chữ Hán</span>
              </li>
              <li>
                <CheckCircleFilled />
                <span>Trải nghiệm tốt trên máy tính và điện thoại</span>
              </li>
            </ul>
          </div>

          <div className="register-level-card" aria-hidden="true">
            <span className="register-level-card__label">Lộ trình của bạn</span>
            <strong>HSK 1 → HSK 5</strong>
            <div className="register-level-card__progress">
              <span />
            </div>
            <small>Mỗi ngày một bước tiến</small>
          </div>
        </aside>

        <section className="register-card__form-side">
          <div className="register-form-wrapper">
            <div className="register-form-heading">
              <span className="register-form-heading__mobile-logo">
                <BookOutlined />
              </span>

              <Title level={2}>
                {isHotelOwner
                  ? "Đăng ký đối tác khách sạn"
                  : "Đăng ký tài khoản"}
              </Title>

              <Paragraph>
                {isHotelOwner
                  ? "Tạo tài khoản đối tác để quản lý và đăng thông tin tài sản."
                  : "Điền thông tin bên dưới để bắt đầu hành trình học tập."}
              </Paragraph>
            </div>

            <Form<FieldType>
              name="register"
              className="register-form"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              size="large"
              requiredMark={false}
            >
              <Form.Item<FieldType>
                label="Họ và tên"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                  { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập họ và tên"
                  autoComplete="name"
                />
              </Form.Item>

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
                  placeholder="Nhập địa chỉ email"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item<FieldType>
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại phải có 10-11 chữ số!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={11}
                />
              </Form.Item>

              <div className="register-form__password-grid">
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
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                  />
                </Form.Item>
              </div>

              <Form.Item className="register-form__submit-item">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isSubmitting}
                  className="register-form__submit"
                >
                  Đăng ký
                </Button>
              </Form.Item>

              <div className="register-form__login-link">
                <Text>Đã có tài khoản?</Text>
                <Link to="/login">Đăng nhập ngay</Link>
              </div>
            </Form>

            <Text className="register-form__security-note">
              Bằng việc đăng ký, bạn đồng ý tạo tài khoản trên Aliu Chinese.
            </Text>
          </div>
        </section>
      </section>
    </main>
  );
};

export { RegisterPage };
export default RegisterPage;