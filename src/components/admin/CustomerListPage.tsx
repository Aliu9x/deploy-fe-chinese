import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchUsersApi, type ListUsersParams } from "@/services/api";
import "./customer-list.scss";

const { Title, Text } = Typography;

type UserRole = "ADMIN" | "CUSTOMER";
type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | string;



interface FilterFormValues {
  q?: string;
  role?: UserRole;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const formatDateTime = (value?: string | null): string => {
  if (!value) return "Chưa đăng nhập";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getInitials = (fullName?: string): string => {
  if (!fullName) return "U";

  return fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const CustomerListPage: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm<FilterFormValues>();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterFormValues>({
    q: "",
    role: "CUSTOMER",
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const params: ListUsersParams = {
        page,
        limit,
        q: filters.q?.trim() || undefined,
        role: filters.role,
      };

      const response = await fetchUsersApi(params);

      const userData = response.data as UsersData;

      console.log("userData", userData);

      setUsers(Array.isArray(userData.result) ? userData.result : []);
      setTotal(Number(userData.total) || 0);
      setTotalPages(Number(userData.totalPages) || 0);
    } catch (error) {
      console.error("Fetch users error:", error);
      setUsers([]);
      setTotal(0);
      setTotalPages(0);
      message.error("Không thể tải danh sách người dùng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [filters.q, filters.role, limit, message, page]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleFilter = (values: FilterFormValues) => {
    setPage(DEFAULT_PAGE);
    setFilters({
      q: values.q?.trim() || "",
      role: values.role || "CUSTOMER",
    });
  };

  const handleReset = () => {
    const defaultFilters: FilterFormValues = {
      q: "",
      role: "CUSTOMER",
    };

    form.setFieldsValue(defaultFilters);
    setPage(DEFAULT_PAGE);
    setLimit(DEFAULT_LIMIT);
    setFilters(defaultFilters);
  };

  const handlePaginationChange = (nextPage: number, nextLimit: number) => {
    if (nextLimit !== limit) {
      setLimit(nextLimit);
      setPage(DEFAULT_PAGE);
      return;
    }

    setPage(nextPage);
  };

  const columns = useMemo<TableProps<UserItem>["columns"]>(
    () => [
      {
        title: "Người dùng",
        key: "user",
        width: 260,
        fixed: "left",
        render: (_, record) => (
          <Space size={12}>
            <Avatar className="customer-user-avatar" icon={<UserOutlined />}>
              {getInitials(record.full_name)}
            </Avatar>
            <span className="customer-user-info">
              <strong>{record.full_name || "Chưa cập nhật"}</strong>
              <small>ID: {record.id}</small>
            </span>
          </Space>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 230,
        ellipsis: true,
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        width: 150,
        render: (value: string) => value || "-",
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        key: "role",
        width: 120,
        render: (role: UserRole) => (
          <Tag color={role === "ADMIN" ? "magenta" : "blue"}>
            {role === "ADMIN" ? "Quản trị viên" : "Học viên"}
          </Tag>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status: UserStatus) => {
          const color =
            status === "ACTIVE"
              ? "success"
              : status === "BLOCKED"
                ? "error"
                : "default";

          const label =
            status === "ACTIVE"
              ? "Đang hoạt động"
              : status === "BLOCKED"
                ? "Đã khóa"
                : "Không hoạt động";

          return <Tag color={color}>{label}</Tag>;
        },
      },
      {
        title: "Đăng nhập gần nhất",
        dataIndex: "lastLogin",
        key: "lastLogin",
        width: 180,
        render: (value: string | null) => formatDateTime(value),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 170,
        render: (value: string) => formatDateTime(value),
      },
    ],
    []
  );

  return (
    <section className="customer-list-page">
      <div className="customer-list-header">
        <div>
          <Space size={10} className="customer-list-eyebrow">
            <TeamOutlined />
            <span>QUẢN LÝ NGƯỜI DÙNG</span>
          </Space>
          <Title level={2}>Danh sách học viên</Title>
          <Text>
            Theo dõi và quản lý tài khoản học viên trong hệ thống Aliu Chinese.
          </Text>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="customer-list-add-button"
          onClick={() => navigate("/admin/user/customer/create")}
        >
          Thêm mới
        </Button>
      </div>

      <Row gutter={[16, 16]} className="customer-list-statistics">
        <Col xs={24} sm={12} lg={8}>
          <Card className="customer-stat-card" bordered={false}>
            <span className="customer-stat-card__icon">
              <TeamOutlined />
            </span>
            <span>
              <small>Tổng người dùng theo bộ lọc</small>
              <strong>{total.toLocaleString("vi-VN")}</strong>
            </span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="customer-stat-card" bordered={false}>
            <span className="customer-stat-card__icon customer-stat-card__icon--blue">
              <UserOutlined />
            </span>
            <span>
              <small>Trang hiện tại</small>
              <strong>{page} / {Math.max(totalPages, 1)}</strong>
            </span>
          </Card>
        </Col>
      </Row>

      <Card className="customer-filter-card" bordered={false}>
        <Form<FilterFormValues>
          form={form}
          layout="vertical"
          initialValues={{ q: "", role: "CUSTOMER" }}
          onFinish={handleFilter}
        >
          <Row gutter={[14, 4]} align="bottom">
            <Col xs={24} md={14} xl={12}>
              <Form.Item label="Tìm kiếm" name="q">
                <Input
                  allowClear
                  prefix={<SearchOutlined />}
                  placeholder="Nhập họ tên, email hoặc số điện thoại"
                  onPressEnter={() => form.submit()}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={10} xl={5}>
              <Form.Item label="Vai trò" name="role">
                <Select
                  options={[
                    { label: "Học viên", value: "CUSTOMER" },
                    { label: "Quản trị viên", value: "ADMIN" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} xl={7}>
              <Form.Item className="customer-filter-actions">
                <Space wrap>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    Lọc dữ liệu
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    Đặt lại
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card className="customer-table-card" bordered={false}>
        <div className="customer-table-card__heading">
          <div>
            <strong>Kết quả tìm kiếm</strong>
            <small>Tìm thấy {total.toLocaleString("vi-VN")} người dùng</small>
          </div>
          <Button
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={() => void loadUsers()}
          >
            Làm mới
          </Button>
        </div>

        <Table<UserItem>
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={false}
          scroll={{ x: 1250 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không tìm thấy người dùng phù hợp"
              />
            ),
          }}
        />

        <div className="customer-pagination-wrapper">
          <Text>
            Hiển thị {users.length} trên tổng số {total.toLocaleString("vi-VN")} kết quả
          </Text>

          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
            showQuickJumper
            onChange={handlePaginationChange}
          />
        </div>
      </Card>
    </section>
  );
};

export default CustomerListPage;
