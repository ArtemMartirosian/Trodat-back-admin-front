import React, { FC, useEffect, useState } from 'react';
import "../../style.scss"
import { Modal, Form, Input, Upload, Button, Select, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../../../utils/api';
import { imageUrl } from '../../../../utils/constants';
import { useClassName } from '../../../../utils/cn';
import { ProductType } from "../../../../types/product.type";
import { CategoryType } from "../../../../types/Category.type";

type CreateProductModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleOk: (productData: ProductType, imageFile: File | null) => Promise<void>;
  confirmLoading: boolean;
  handleCancel: () => void;
};

const CreateProductModal: FC<CreateProductModalProps> = ({ open = true, setOpen, handleOk, confirmLoading, handleCancel }) => {
  const cn = useClassName('products');
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [selectCategory, setCategory] = useState<string>('');
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<{ label: string, value: string }[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState<string>('#000000');

  console.log(previewImage , "image")
  console.log(imageFile , "image")
  console.log(form.isFieldsTouched() , "image")

  const resetValues = () => {
    form.resetFields();
    setImageFile(null);
    setPreviewImage('');
    setSelectedColors([]);
    setColorInput('#000000');
  };

  const onOk = () => {
    form.validateFields().then(() => {
      if (!imageFile && !previewImage) {
        form.setFields([{ name: 'image', errors: ['Please upload an image'] }]);
        return;
      }
      const productData = form.getFieldsValue();
      handleOk(productData, imageFile);
      resetValues();
    }).catch((errorInfo) => {
      console.log('Validation Failed:', errorInfo);
    });
  };

  const id = searchParams.get("id");

  useEffect(() => {
    console.log(id , "id")
    api.get<CategoryType[]>(`/category`)
        .then(res => {
          const items = res.data.map(el => ({
            label: el?.name,
            value: el?._id
          }));
          setCategories(items);
        })
        .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const res = await api.get<ProductType>(`/products/${id}`);
          console.log(JSON.parse(res.data?.equipment?.[0] ), "aaaa")
          setSelectedColors(JSON.parse(res.data?.color?.[0]))
          form.setFieldsValue({
            product1cId: res.data?.product1cId,
            article: res.data?.article,
            name: res.data?.name,
            description: res.data?.description,
            description1c: res.data?.description1c,
            color: JSON.parse(res.data?.color?.[0]),
            equipment: JSON.parse(res.data?.equipment?.[0]) ,
            category: res.data?.category._id,
            size: res.data?.size,
            frame: res.data?.frame,
            geometry: res.data?.geometry,
            is_active: res.data?.is_active,
            price: res.data?.price,
          });
          if (res.data?.image) {
            setPreviewImage(`${imageUrl}products/${res.data.image}`);
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
      setSelectedColors([])
    }
  }, [searchParams,   open]);

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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorInput(e.target.value);
  };

  const addColor = () => {
    if (!selectedColors.includes(colorInput) && /^#[0-9A-Fa-f]{6}$/.test(colorInput)) {
      setSelectedColors([...selectedColors, colorInput]);
      form.setFieldsValue({ color: [...selectedColors, colorInput] });
      setColorInput('#000000');
    } else {
      alert('Invalid color or color already selected');
    }
  };

  const handleRemoveColor = (color: string) => {
    const updatedColors = selectedColors.filter(c => c !== color);
    setSelectedColors(updatedColors);
    form.setFieldsValue({ color: updatedColors });
  };

  return (
      <Modal
          title={id ? "Редактирование товары" : "Создание товары"}
          open={open}
          onOk={onOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText={id ? "Редактировать" : "Создать"}
          cancelText="Отмена"
          okButtonProps={{ disabled: !id ? !form.isFieldsTouched() || !form.getFieldsError().every(({ errors }) => !errors.length) : false }}
      >
        <Form
            form={form}
            initialValues={{
              // product1cId: '',
              article: '',
              name: '',
              description: '',
              // description1c: '',
              color: [],
              equipment: [],
              category: '',
              size: '',
              frame: '',
              geometry: '',
              is_active: true
            }}
        >
          {/*<Form.Item*/}
          {/*    name="product1cId"*/}
          {/*    label="ID продукта 1С"*/}
          {/*    rules={[{ required: true, message: 'Введите ID продукта 1С' }]}*/}
          {/*>*/}
          {/*  <Input placeholder="Введите ID продукта 1С" />*/}
          {/*</Form.Item>*/}
          <Form.Item
              name="article"
              label="Артикул"
              rules={[{ required: true, message: 'Введите артикул' }]}
          >
            <Input placeholder="Введите артикул" />
          </Form.Item>
          <Form.Item
              name="name"
              label="Название"
              rules={[{ required: true, message: 'Введите название товары' }]}
          >
            <Input placeholder="Введите название товары" />
          </Form.Item>
          <Form.Item
              name="description"
              label="Описание"
              rules={[{ required: true, message: 'Введите описание товары' }]}
          >
            <Input.TextArea placeholder="Введите описание товары" />
          </Form.Item>
          {/*<Form.Item*/}
          {/*    name="description1c"*/}
          {/*    label="Описание 1С"*/}
          {/*    rules={[{ required: true, message: 'Введите описание 1С' }]}*/}
          {/*>*/}
          {/*  <Input.TextArea placeholder="Введите описание 1С" />*/}
          {/*</Form.Item>*/}
          <Form.Item
              name="color"
              label="Цвета"
          >
            <div>
              <Input
                  type="color"
                  value={colorInput}
                  onChange={handleColorChange}
                  style={{ marginRight: '10px' }}
              />
              <Button onClick={addColor}>Добавить цвет</Button>
              <div style={{ marginTop: '10px' }}>
                {selectedColors.map(color => (
                    <div
                        key={color}
                        style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          backgroundColor: color,
                          borderRadius: '50%',
                          marginRight: '5px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleRemoveColor(color)}
                    />
                ))}
              </div>
            </div>
          </Form.Item>
          <Form.Item
              name="equipment"
              label="Оборудование"
              rules={[{ required: true, message: 'Введите оборудование товары' }]}
          >
            <Select mode="tags" placeholder="Введите оборудование товары" />
          </Form.Item>
           <Form.Item
                  name="category"
                  label="Категория"
                  rules={[{  message: 'Выберите категорию товары' }]}
              >
                <Select
                    style={{ width: '100%' }}
                    onChange={v => setCategory(v)}
                    options={categories}
                    size="large"
                    value={selectCategory}
                    placeholder="Выберите категорию"
                />
              </Form.Item>
          <Form.Item
              name="size"
              label="Размер"
          >
            <Input placeholder="Введите размер товары" />
          </Form.Item>
          <Form.Item
              name="price"
              label="Цена"
          >
            <Input type='number' placeholder="Введите цена" />
          </Form.Item>
          <Form.Item
              name="frame"
              label="Рама"
          >
            <Input placeholder="Введите раму товары" />
          </Form.Item>
          <Form.Item
              name="geometry"
              label="Геометрия"
          >
            <Input placeholder="Введите геометрию товары" />
          </Form.Item>
          <Form.Item
              name="is_active"
              label="Активный"
              valuePropName="checked"
          >
            <Switch />
          </Form.Item>


          <Form.Item
              label="Изображение"
              required
              validateStatus={!imageFile && !previewImage ? 'error' : 'success'}
              help={!imageFile && !previewImage ? 'Пожалуйста, загрузите изображение товара' : undefined}
          >
            <Upload
                accept="image/*"
                beforeUpload={() => false}
                onChange={handleImageChange}
                listType="picture"
                showUploadList={false}
            >
                  <Button icon={<UploadOutlined />}>Выберите изображение</Button>
            </Upload>
          </Form.Item>
          {previewImage && (
              <div className={cn('image-container')}>
                <img src={previewImage} alt="Preview" className={cn('image')} />
              </div>
          )}


          {/*<Form.Item*/}
          {/*    label="Изображение"*/}
          {/*>*/}
          {/*  <Upload*/}
          {/*      accept="image/*"*/}
          {/*      beforeUpload={() => false}*/}
          {/*      onChange={handleImageChange}*/}
          {/*      maxCount={1}*/}
          {/*  >*/}
          {/*    <Button icon={<UploadOutlined />}>Загрузить изображение</Button>*/}
          {/*  </Upload>*/}
          {/*</Form.Item>*/}
          {/*{previewImage && (*/}
          {/*    <div className={cn('image-container')}>*/}
          {/*      <img src={previewImage} alt="Preview" className={cn('image')} />*/}
          {/*    </div>*/}
          {/*)}*/}
        </Form>
      </Modal>
  );
};

export default CreateProductModal;
