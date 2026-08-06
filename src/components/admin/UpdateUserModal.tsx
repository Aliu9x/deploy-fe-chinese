import React, { useEffect } from "react";
import { App, Form, Input, Modal, Select } from "antd";
import {
  updateUserApi,
} from "@/services/api";
import "./update-user-modal.scss"; // [MỚI]

type UserRole = "ADMIN" | "CUSTOMER";
type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | string;

export interface UpdateUserFormValues {
  full_name?: string;
  email?: string;
  phone?: string;
  role?:UserRole ;
  status?: UserStatus;
}

interface UpdateUserModalProps {
  open: boolean;
  userId: string | null;
  initialValues?: UpdateUserFormValues | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  open,
  userId,
  initialValues,
  onClose,
  onSuccess,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<UpdateUserFormValues>();
  const [submitting, setSubmitting] = React.useState(false);

  // Fill lại thông tin mỗi khi mở modal với user khác
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    }
    if (!open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleSubmit = async (values: UpdateUserFormValues) => {
    if (!userId) return;

    setSubmitting(true);
    try {
      const payload: IUpdateUserReq = {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        status: values.status,
      };

      const response = await updateUserApi(userId, payload);

      message.success(response.message || "Cập nhật người dùng thành công");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Update user error:", error);
      message.error(
        error?.response?.data?.message || "Cập nhật người dùng thất bại. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      className="update-user-modal" // [MỚI]
      title="Cập nhật thông tin người dùng"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form<UpdateUserFormValues>
        className="update-user-form" // [MỚI]
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ min: 2, message: "Họ tên phải có ít nhất 2 ký tự" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Email không hợp lệ" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Vai trò" name="role">
          <Select
            options={[
              { label: "Học viên", value: "CUSTOMER" },
              { label: "Quản trị viên", value: "ADMIN" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select
            options={[
              { label: "Đang hoạt động", value: "ACTIVE" },
              { label: "Không hoạt động", value: "INACTIVE" },
              { label: "Đã khóa", value: "LOCKED" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;