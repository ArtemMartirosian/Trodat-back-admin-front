import React, { FC, useState } from 'react';
import './style.scss';
import { useClassName } from "../../../../utils/cn";
import { Modal, Form, Input, Button } from 'antd';
import { api } from "../../../../utils/api";

type LoginModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const LoginModal: FC<LoginModalProps> = ({ open, setOpen }) => {
    const cn = useClassName('loginModal');
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);

    const login = async (payload: {}) => {
        try {
            const res = await api.post('/customer/login', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', res.data);

            // Store tokens in cookies
            const { accessToken, refreshToken } = res.data;
            document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24}; secure`;
            document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure`;
            window.location.reload();
            setOpen(false); // Close modal after successful login
        } catch (e) {
            console.error('Error:', e);
            setError('Неправильный email или пароль'); // Set error message in Russian
        }
    };

    const onFinish = async (values: any) => {
        setError(null); // Clear previous error message
        await login(values);
    };

    return (
        <Modal
            title="Войти"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null} // Remove default footer
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish} // Handle form submission
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Введите email' },
                        { type: 'email', message: 'Введите корректный email' }
                    ]}
                >
                    <Input placeholder="Введите email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[{ required: true, message: 'Введите пароль' }]}
                >
                    <Input.Password placeholder="Введите пароль" />
                </Form.Item>
                {error && (
                    <div style={{ color: 'red' }}>
                        {error}
                    </div>
                )}
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LoginModal;
