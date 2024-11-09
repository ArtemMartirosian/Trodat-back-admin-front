// ChangePasswordModal.tsx
import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

interface ChangePasswordModalProps {
    visible: boolean;
    onConfirm: (currentPassword: string, newPassword: string) => void;
    onCancel: () => void;
}

const ChangePasswordModal = ({ visible, onConfirm, onCancel }: ChangePasswordModalProps) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleConfirm = () => {
        onConfirm(currentPassword, newPassword);
    };

    return (
        <Modal
            title="Сменить пароль"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" onClick={handleConfirm}>
                    Подтвердить
                </Button>,
            ]}
        >
            <div>
                <Input.Password
                    placeholder="Текущий пароль"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Input.Password
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
        </Modal>
    );

};

export default ChangePasswordModal;
