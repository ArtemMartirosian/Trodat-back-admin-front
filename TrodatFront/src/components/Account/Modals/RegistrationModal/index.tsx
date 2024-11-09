import React, { FC } from 'react';
import './style.scss';
import { Modal, Form, Input, Button } from 'antd';
import { api } from "../../../../utils/api";

type RegistrationModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

const RegistrationModal: FC<RegistrationModalProps> = ({ open, setOpen }) => {
    const [form] = Form.useForm();

    const register = async (payload: any) => {
        try {
            const res = await api.post('/customer/register', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', res.data);
            setOpen(false); // Close modal after successful registration
        } catch (e) {
            console.error('Error:', e);
        }
    };

    const onFinish = async (values: any) => {
        console.log(values, "values");
        await register(values);
    };

    return (
        <Modal
            title="Зарегистрироваться"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null} // Remove if you want to use default footer
        >
            <Form
                form={form}
                initialValues={{
                    firstname: '',
                    lastname: '',
                    patronymic: '',
                    phone: '',
                    email: '',
                    password: '',
                    repeatPassword: ''
                }}
                layout="vertical"
                onFinish={onFinish} // Trigger form submission on Enter
            >
                <Form.Item
                    name="firstname"
                    label="Имя"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <Input placeholder="Введите имя" />
                </Form.Item>
                <Form.Item
                    name="lastname"
                    label="Фамилия"
                    rules={[{ required: true, message: 'Введите фамилию' }]}
                >
                    <Input placeholder="Введите фамилию" />
                </Form.Item>
                <Form.Item
                    name="patronymic"
                    label="Отчество"
                    rules={[{  message: 'Введите отчество' }]}
                >
                    <Input placeholder="Введите отчество" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Телефон"
                    rules={[
                        { required: true, message: 'Введите номер телефона' },
                        { pattern: /^\+?[0-9]\d{1,14}$/, message: 'Введите корректный номер телефона' }
                    ]}
                >
                    <Input type="tel" placeholder="Введите номер телефона" />
                </Form.Item>
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
                <Form.Item
                    name="repeatPassword"
                    label="Повторите пароль"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Повторите пароль' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Повторите пароль" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Зарегистрироваться
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RegistrationModal;
