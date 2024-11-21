import React, { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Modal, Form, Input, Checkbox, Button, Flex } from "antd";
import Register from "./Register"; // Import form đăng ký

const Login = ({ isModalOpen, onClose }) => {
  const [isLoginForm, setIsLoginForm] = useState(true); // Trạng thái để chuyển đổi giữa Login và Register

  //   const handleLogin = (values) => {
  //     // console.log("Login Success:", values);
  //     onClose(); // Đóng modal khi login thành công
  //   };

  const handleSwitchToRegister = () => {
    setIsLoginForm(false); // Chuyển sang form register
  };
  const onFinish = (values) => {
    // console.log('Received values of form: ', values);
  };
  const handleSwitchToLogin = () => {
    setIsLoginForm(true); // Chuyển sang form login
  };

  return (
    <Modal
      title={isLoginForm ? "Đăng nhập" : "Đăng ký"}
      className="text-center"
      open={isModalOpen}
      onCancel={onClose}
      footer={null} // Không sử dụng footer mặc định của Modal
      titleStyle={{ fontSize: "20px", fontWeight: "bold", color: "blue" }}
    >
      {isLoginForm ? (
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item name="username">
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email của bạn"
              size="large"
            />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <a href="##">Quên mật khẩu?</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              className="mb-3 fw-bold"
              htmlType="submit"
              style={{ backgroundColor: "#0c7eef" }}
            >
              Đăng nhập
            </Button>
            <span> Bạn chưa có tài khoản?</span>
            <Button
              type="link"
              className="text-primary p-2"
              onClick={handleSwitchToRegister}
            >
              Đăng ký
            </Button>
          </Form.Item>
          <span>Đăng nhập bằng mạng xã hội</span>
          <Form.Item>
            <Button
              block
              className="bg-danger text-white my-3 fw-bold"
              htmlType="submit"
            >
              <i className="fa-brands fa-google"></i> Đăng nhập với Google
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Register onSubmit={onClose} onSwitchToLogin={handleSwitchToLogin} /> // Hiển thị form đăng ký
      )}
    </Modal>
  );
};

export default Login;
