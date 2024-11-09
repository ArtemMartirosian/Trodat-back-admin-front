import React, {FC, useEffect, useState} from 'react';
import {List, Modal, Select} from "antd";
import {api} from "../../../../utils/api";
import {ProductType} from "../../../../types/product.type";
import {CategoryType} from "../../../../types/Category.type";
import {useClassName} from "../../../../utils/cn";

type AddProductProps = {
  open: boolean;
  handleOk?: (name: string) => Promise<void>;
  confirmLoading: boolean;
  handleCancel: () => void;
  category: CategoryType;
};

const LinkProductToProduct: FC<AddProductProps> = (
  {
    confirmLoading,
    handleCancel,
    handleOk,
    open,
    category
  }
) => {
  const cn = useClassName('link-product')
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get<ProductType[]>(`/products/byCategory/${category._id}`);

        setProducts(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Modal
      open={open}
      confirmLoading={confirmLoading}
      title={`Просмотр продуктов в категории ${category.name}`}
      onCancel={handleCancel}
    >
      <List
        loading={loading}
        dataSource={products}
        header={(
          <h3 style={{margin: 0}}>Продукты в категории {category.name}</h3>
        )}
        size='small'
        bordered
        renderItem={(product) => <List.Item>{product.name}</List.Item>}
        className={cn('link')}
      />
    </Modal>
  );
};

export default LinkProductToProduct;