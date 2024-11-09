import React, {FC, useEffect, useState} from 'react';
import {Modal, Select, Spin} from "antd";
import {ProductType} from "../../../../types/product.type";
import {CategoryType} from "../../../../types/Category.type";
import {api} from "../../../../utils/api";

type ChangeCategoryModalProps = {
  handleClose: () => void;
  product: ProductType;
  onOk: (categoryId: string, productId: string) => Promise<void>;
};

const ChangeCategoryModal: FC<ChangeCategoryModalProps> = ({handleClose, product, onOk}) => {
  const [selectCategory, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<{label: string, value: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get<CategoryType[]>(`/category`)
      .then(res => {
        console.log(res , "hhh")
        const filteredCategories = res.data.filter(cat => cat._id !== product?.category?._id);
          console.log(filteredCategories , "hhh")
        const items = filteredCategories.map(el => ({
          label: el?.name,
          value: el?._id
        }))
          console.log(items , "hhhh")
        setCategories(items);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleOk = () => {
    onOk(selectCategory, product._id);
  };

  console.log(categories , "hhh")


  return (
    <Modal
      open
      onCancel={handleClose}
      onOk={handleOk}
      okButtonProps={{
        disabled: !selectCategory
      }}
      title={`Изменить категорию товары - ${product.article}`}
    >
      <Spin spinning={loading}>
        {
          product.category ?
            <p>Нынешняя категория - {product.category.name}</p>
            : <p>У данного продукта отсутствует категория</p>
        }

        <Select
          style={{width: '100%'}}
          onChange={v => setCategory(v)}
          options={categories}
          size="large"
          value={selectCategory}
          placeholder="Выберите категорию"
        />
      </Spin>
    </Modal>
  );
};

export default ChangeCategoryModal;