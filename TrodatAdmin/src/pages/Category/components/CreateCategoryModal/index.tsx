import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Switch } from "antd";
import { useSearchParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import {CategoryType} from "../../../../types/Category.type";

type CreateCategoryModalProps = {
  open: boolean;
  handleOk: (name: string, isPublic: boolean) => Promise<void>;
  confirmLoading: boolean;
  handleCancel: () => void;
};

const CreateCategoryModal: FC<CreateCategoryModalProps> = ({ open, handleOk, confirmLoading, handleCancel }) => {
  const [name, setName] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  const onOk = () => {
    if (name) {
      handleOk(name, isPublic);
      setName('');
      setIsPublic(false); // Reset the state after submission
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await api.get<CategoryType>(`/category/${id}`);
          console.log(res, 'categoryById');
          setName(res.data.name);
          setIsPublic(res.data.isPublic); // Assuming `is_active` is a boolean indicating the public status
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchData();
  }, [searchParams, id]);

  console.log(isPublic , "isPublic")


  return (
      <Modal
          title={id ? "Редактирование категории" : "Создание категории"}
          open={open}
          onOk={onOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText={id ? "Редактировать" : "Создать"}
          cancelText="Отмена"
      >
        <Form.Item
            style={{ marginTop: 24 }}
            label="Название"
        >
          <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Введите название категории"
          />
        </Form.Item>
        <Form.Item
            label="Активный"
            valuePropName="checked"
        >
          <Switch checked={isPublic} onChange={setIsPublic} />
        </Form.Item>
      </Modal>
  );
};

export default CreateCategoryModal;
