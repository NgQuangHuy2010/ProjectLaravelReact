import React from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";

const Register = ({ onSubmit, onSwitchToLogin }) => {
  const handleSubmit = (values) => {
    console.log("Register Success:", values);
    onSubmit(); // Đóng Modal sau khi đăng ký thành công
  };

  return (
    <Form name="register" onFinish={handleSubmit} autoComplete="off">
      {/* Username */}
      <Form.Item name="username">
        <Input prefix={<UserOutlined />} placeholder="Nhập tên của bạn"   size="large" />
      </Form.Item>
    {/* phone */}
    <Form.Item name="phone">
        <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại"   size="large"/>
      </Form.Item>

      {/* Email */}
      <Form.Item name="email">
        <Input prefix={<MailOutlined />} placeholder="Email"   size="large"/>
      </Form.Item>
      {/* Password */}
      <Form.Item name="password">
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu"   size="large"/>
      </Form.Item>

      {/* Confirm Password */}
      <Form.Item name="confirm" >
        <Input.Password
          size="large"
          prefix={<LockOutlined />}
          placeholder="Xác nhận mật khẩu"
        />
      </Form.Item>
      {/* Register Button */}
      <Form.Item>
        <Button type="primary" block htmlType="submit">
          Đăng ký
        </Button>
      </Form.Item>

      {/* Switch to login form */}
      <Form.Item>
        <span>Đã có tài khoản?</span>
        <Button type="link" className="p-2" onClick={onSwitchToLogin}>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
