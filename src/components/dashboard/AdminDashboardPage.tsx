import React from "react";
import {
  ArrowRightOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  EditOutlined,
  FileTextOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Progress, Row, Space, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import "./admin-dashboard.scss";

const { Title, Paragraph, Text } = Typography;

type ModuleItem = {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "pink" | "blue" | "purple" | "green";
  route?: string;
  status: "available" | "coming-soon";
};

const modules: ModuleItem[] = [
  {
    key: "users",
    title: "Quản lý học viên",
    description: "Xem danh sách, tìm kiếm và quản lý tài khoản học viên.",
    icon: <TeamOutlined />,
    color: "pink",
    route: "/admin/user/customer",
    status: "available",
  },
  {
    key: "courses",
    title: "Quản lý khóa học",
    description: "Tổ chức các khóa học từ HSK 1 đến HSK 5.",
    icon: <BookOutlined />,
    color: "blue",
    status: "coming-soon",
  },
  {
    key: "vocabulary",
    title: "Quản lý từ vựng",
    description: "Quản lý chữ Hán, pinyin, nghĩa và ví dụ theo bài.",
    icon: <ReadOutlined />,
    color: "purple",
    status: "coming-soon",
  },
  {
    key: "exercises",
    title: "Quản lý bài tập",
    description: "Xây dựng câu hỏi, flashcard và bài luyện tương tác.",
    icon: <EditOutlined />,
    color: "green",
    status: "coming-soon",
  },
];

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useCurrentApp();

  const displayName = user?.fullname || user?.email || "Quản trị viên";

  return (
    <section className="admin-dashboard-page">
      <div className="dashboard-welcome">
        <div className="dashboard-welcome__content">
          <span className="dashboard-eyebrow">
            <DashboardOutlined /> TRUNG TÂM QUẢN TRỊ
          </span>
          <Title level={2}>Xin chào, {displayName}</Title>
          <Paragraph>
            Chào mừng trở lại Aliu Chinese. Theo dõi hệ thống và truy cập nhanh
            các module quản trị từ một nơi duy nhất.
          </Paragraph>
          <Space wrap className="dashboard-welcome__actions">
            <Button
              type="primary"
              icon={<TeamOutlined />}
              onClick={() => navigate("/admin/user/customer")}
            >
              Quản lý học viên
            </Button>
            <Button icon={<BookOutlined />} onClick={() => navigate("/")}>
              Xem trang học tập
            </Button>
          </Space>
        </div>

        <div className="dashboard-welcome__visual" aria-hidden="true">
          <span className="dashboard-welcome__hanzi">学</span>
          <div className="dashboard-welcome__visual-card">
            <TrophyOutlined />
            <span>
              <small>Hệ thống học tập</small>
              <strong>HSK 1 → HSK 5</strong>
            </span>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} className="dashboard-stat-grid">
        <Col xs={24} sm={12} xl={6}>
          <Card className="dashboard-stat-card dashboard-stat-card--pink" bordered={false}>
            <span className="dashboard-stat-card__icon"><TeamOutlined /></span>
            <span className="dashboard-stat-card__content">
              <small>Module người dùng</small>
              <strong>Đang hoạt động</strong>
              <Text>Quản lý học viên</Text>
            </span>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="dashboard-stat-card dashboard-stat-card--blue" bordered={false}>
            <span className="dashboard-stat-card__icon"><BookOutlined /></span>
            <span className="dashboard-stat-card__content">
              <small>Cấp độ HSK</small>
              <strong>5 cấp độ</strong>
              <Text>HSK 1 đến HSK 5</Text>
            </span>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="dashboard-stat-card dashboard-stat-card--purple" bordered={false}>
            <span className="dashboard-stat-card__icon"><FileTextOutlined /></span>
            <span className="dashboard-stat-card__content">
              <small>Nội dung hiện tại</small>
              <strong>9+ bài học</strong>
              <Text>Module HSK 5</Text>
            </span>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="dashboard-stat-card dashboard-stat-card--green" bordered={false}>
            <span className="dashboard-stat-card__icon"><CheckCircleOutlined /></span>
            <span className="dashboard-stat-card__content">
              <small>Trạng thái</small>
              <strong>Sẵn sàng</strong>
              <Text>Hệ thống hoạt động</Text>
            </span>
          </Card>
        </Col>
      </Row>

      <Row gutter={[18, 18]} className="dashboard-main-grid">
        <Col xs={24} xl={16}>
          <Card className="dashboard-panel" bordered={false}>
            <div className="dashboard-panel__heading">
              <div>
                <span className="dashboard-panel__eyebrow">TRUY CẬP NHANH</span>
                <Title level={4}>Các module quản trị</Title>
                <Text>Chọn module để bắt đầu quản lý hệ thống.</Text>
              </div>
            </div>

            <div className="dashboard-module-grid">
              {modules.map((item) => (
                <article className={`dashboard-module-card dashboard-module-card--${item.color}`} key={item.key}>
                  <div className="dashboard-module-card__top">
                    <span className="dashboard-module-card__icon">{item.icon}</span>
                    <Tag color={item.status === "available" ? "success" : "default"}>
                      {item.status === "available" ? "Sẵn sàng" : "Sắp bổ sung"}
                    </Tag>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Button
                    type="text"
                    disabled={!item.route}
                    onClick={() => item.route && navigate(item.route)}
                  >
                    {item.route ? "Mở module" : "Đang phát triển"}
                    {item.route && <ArrowRightOutlined />}
                  </Button>
                </article>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card className="dashboard-panel dashboard-progress-panel" bordered={false}>
            <div className="dashboard-panel__heading">
              <div>
                <span className="dashboard-panel__eyebrow">TIẾN ĐỘ XÂY DỰNG</span>
                <Title level={4}>Hệ thống module</Title>
              </div>
              <SettingOutlined className="dashboard-panel__heading-icon" />
            </div>

            <div className="dashboard-progress-list">
              <div>
                <span><Text>Quản lý người dùng</Text><strong>100%</strong></span>
                <Progress percent={100} showInfo={false} strokeColor="#ff5c8a" />
              </div>
              <div>
                <span><Text>Khóa học HSK</Text><strong>40%</strong></span>
                <Progress percent={40} showInfo={false} strokeColor="#3fa9f5" />
              </div>
              <div>
                <span><Text>Từ vựng và ngữ pháp</Text><strong>25%</strong></span>
                <Progress percent={25} showInfo={false} strokeColor="#8b6ce8" />
              </div>
              <div>
                <span><Text>Bài tập tương tác</Text><strong>20%</strong></span>
                <Progress percent={20} showInfo={false} strokeColor="#38b980" />
              </div>
            </div>

            <div className="dashboard-note">
              <ClockCircleOutlined />
              <span>
                <strong>Gợi ý tiếp theo</strong>
                <small>Hoàn thiện module khóa học và bài học HSK.</small>
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="dashboard-activity-panel" bordered={false}>
        <div className="dashboard-panel__heading">
          <div>
            <span className="dashboard-panel__eyebrow">HOẠT ĐỘNG HỆ THỐNG</span>
            <Title level={4}>Tổng quan hôm nay</Title>
          </div>
        </div>

        <div className="dashboard-activity-list">
          <div className="dashboard-activity-item">
            <Avatar icon={<UserAddOutlined />} className="dashboard-activity-item__avatar dashboard-activity-item__avatar--pink" />
            <span><strong>Module quản lý học viên đã sẵn sàng</strong><small>Có thể tìm kiếm, lọc và phân trang người dùng.</small></span>
            <Tag color="success">Hoàn thành</Tag>
          </div>
          <div className="dashboard-activity-item">
            <Avatar icon={<BookOutlined />} className="dashboard-activity-item__avatar dashboard-activity-item__avatar--blue" />
            <span><strong>Module khóa học đang được chuẩn bị</strong><small>Sẽ hỗ trợ quản lý cấp độ, khóa học và bài học.</small></span>
            <Tag>Đang phát triển</Tag>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default AdminDashboardPage;
