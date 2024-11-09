import { Modal, Button } from "antd";
import React from "react";

interface DeleteAccountModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;

}

const DeleteAccountModal = ({
                                visible,
                                onConfirm,
                                onCancel,
                            }: DeleteAccountModalProps) => {
    return (
        <Modal
            title="Подтверждение удаления"
            visible={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" onClick={onConfirm}>
                    Удалить
                </Button>,
            ]}
        >
            <p>Вы уверены, что хотите удалить аккаунт?</p>
        </Modal>
    );
};

export default DeleteAccountModal;
