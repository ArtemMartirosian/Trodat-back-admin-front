import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../../../utils/api';
import { NewsType } from '../../../../types/News.type';
import { imageUrl } from '../../../../utils/constants';
import { useClassName } from '../../../../utils/cn';

type CreateNewsModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleOk: (title: string, type: string, fullDescription: string, shortDescription: string, imageFile: File | null) => Promise<void>;
  confirmLoading: boolean;
  handleCancel: () => void;
};

const CreateNewsModal: FC<CreateNewsModalProps> = ({ open, setOpen, handleOk, confirmLoading, handleCancel }) => {
  const cn = useClassName('card');
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [searchParams] = useSearchParams();

  const resetValues = () => {
    form.resetFields();
    setImageFile(null);
    setPreviewImage('');
  };

  const onOk = () => {
    form.validateFields().then(() => {
      const { title, type, fullDescription, shortDescription } = form.getFieldsValue();
      handleOk(title, type, fullDescription, shortDescription, imageFile);
      resetValues();
    }).catch((errorInfo) => {
      console.log('Validation Failed:', errorInfo);
    });
  };

  const id = searchParams.get("id");

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (id) {
          const res = await api.get<NewsType>(`/news/${id}`);
          form.setFieldsValue({
            title: res.data.title,
            type: res.data.type,
            fullDescription: res.data.fullDescription,
            shortDescription: res.data.shortDescription,
          });
          if (res.data.image) {
              setPreviewImage(`${imageUrl}/${res.data.image}`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (id) {
      fetchData().then(() => setOpen(true));
    } else {
      resetValues();
    }
  }, [searchParams, setOpen]);

  const handleImageChange = (info: { file: any, fileList: any }) => {
    if (info.fileList.length) {
      const file = info.fileList[0]?.originFileObj;

      if (file && file.type.startsWith('image/')) {
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImageFile(null);
        setPreviewImage('');
        alert('Please upload a valid image file');
      }
    }
  };

  return (
      <Modal
          title={id ? "Редактирование новости" : "Создание новости"}
          open={open}
          onOk={onOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText={id ? "Редактировать" : "Создать"}
          cancelText="Отмена"
          // okButtonProps={{ disabled: !form.isFieldsTouched() || !form.getFieldsError().every(({ errors }) => !errors.length) }}
          okButtonProps={{ disabled: !id ? !form.isFieldsTouched() || !form.getFieldsError().every(({ errors }) => !errors.length) : false }}

      >
        <Form
            form={form}

            initialValues={{ title: '', type: '', shortDescription: '', fullDescription: '' }}
        >
          <Form.Item
              name="title"
              label="Заголовок"
              rules={[{ required: true, message: 'Введите заголовок' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
          <Form.Item
              name="type"
              label="Тип"
              rules={[{ required: true, message: 'Введите тип новости' }]}
          >
            <Input placeholder="Введите тип новости" />
          </Form.Item>
          <Form.Item
              name="shortDescription"
              label="Краткое описание"
              rules={[{ required: true, message: 'Введите краткое описание' }]}
          >
            <Input placeholder="Введите краткое описание" />
          </Form.Item>
          <Form.Item
              name="fullDescription"
              label="Полное описание"
              rules={[{ required: true, message: 'Введите полное описание' }]}
          >
            <Input.TextArea placeholder="Введите полное описание" />
          </Form.Item>
          <Form.Item
              label="Изображение"
              rules={[{ required: true, message: 'Загрузите изображение' }]}
          >
            <Upload
                accept="image/*"
                beforeUpload={() => false}
                onChange={handleImageChange}
                maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Загрузить изображение</Button>
            </Upload>
          </Form.Item>
          {previewImage && (
              <div className={cn('image-container')}>
                <img src={previewImage} alt="Preview" className={cn('image')} />
              </div>
          )}
        </Form>
      </Modal>
  );
};

export default CreateNewsModal;
