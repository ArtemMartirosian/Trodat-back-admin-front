import React, { FC, useEffect } from 'react';
import './style.scss';
import { Modal, Form, Input, Button } from 'antd';

type UserEditModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    userData: {
        firstname: string;
        lastname: string;
        phone: string;
        email: string;
    };
    onUpdate: (values: { firstname: string; lastname: string; phone: string; email: string }) => void;
};

const UserEditModal: FC<UserEditModalProps> = ({ open, setOpen, userData, onUpdate }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(userData); // Set the initial values in the form
    }, [userData, form, open]);

    const onFinish = async (values: any) => {
        try {
            onUpdate(values); // Pass updated values to parent
            setOpen(false); // Close modal after update
        } catch (error) {
            console.log('Failed:', error);
        }
    };

    return (
        <Modal
            title="Редактировать"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null} // Remove default footer to use custom footer
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish} // Handle form submission on Enter
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
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Сохранить изменения
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserEditModal;
