import React, {useEffect, useState} from 'react';
import {Button, Space, Table, TableProps, Modal} from "antd";
import {useClassName} from "../../utils/cn";
import {api} from "../../utils/api";
import CreateCategoryModal from "./components/CreateCategoryModal";
import {ExclamationCircleFilled} from '@ant-design/icons';
import LinkProductToProduct from "./components/LinkProductToProduct";
import {CategoryType} from "../../types/Category.type";
import './style.scss';
import {useSearchParams} from "react-router-dom";

const { confirm } = Modal;

const Category = () => {
  const cn = useClassName('category');
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [searchParams , setSearchParams] = useSearchParams()

    const fetchData = async () => {
        try {
            const res = await api.get<CategoryType[]>('/category');
            console.log('res', res.data);
            setCategories(res.data);
        } catch (e) {
            alert(e);
        }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCategory = (id: string) => {
    const handleDelete = async () => {
      setLoading(true);
      api.delete<CategoryType>(`/category/${id}`)
        .then(res => {
          const copyCategories = [...categories];
          const index = copyCategories.findIndex(cat => cat._id === id);
          copyCategories.splice(index, 1);
          setCategories(copyCategories);
        })
        .catch(err => console.log(err))
        .finally(() => {
          setLoading(false);
          setModal(false);
        });
    };

    confirm({
      title: 'Вы уверены, что хотите удалить?',
      icon: <ExclamationCircleFilled />,
      content: 'При удалении товары могут остаться без категории. Их можно будет привязать вручную',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: handleDelete,
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  const onProductLinkToProduct = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  const columns: TableProps<CategoryType>['columns'] = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '1c идентификатор',
      dataIndex: 'category1cId',
      key: 'category1cId',
    },
    {
      title: 'Публичный',
      dataIndex: 'isPublic',
      key: 'isPublic',
      render: (_, record) => record.isPublic ? "Да" : "Нет"
    },
    {
      title: 'Действие',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => onProductLinkToProduct(record)}>
            Посмотреть продукты
          </Button>
          <Button
              type='link'
              onClick={() => {
                editCategory(record._id)
                setModal(true)
              }
              }
          >
            Редактировать
          </Button>
          <Button
            type='link'
            onClick={() => handleDeleteCategory(record._id)}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateCategory = async (name: string , isPublic : boolean) => {
      console.log(isPublic , "isPublickCheck")
    setLoading(true);
      const id = searchParams.get('id');

      if(id){
          api.patch<CategoryType>(`/category/${id}`, {name , isPublic})
              .then()
              .catch(err => console.log(err))
              .finally(() => {
                  fetchData();
                  setLoading(false);
                  setModal(false);
                  setSearchParams({})
              });
      } else {
          api.post<CategoryType>('/category', {name , isPublic})
              .then(res => {
                  setCategories(prev => [...prev, res.data]);
              })
              .catch(err => console.log(err))
              .finally(() => {
                  setLoading(false);
                  setModal(false);
                  setSearchParams({})
              });
      }


  };

  const editCategory = (id : string) => {
    console.log(id , "categoryId")
    setSearchParams({id})

  }

  return (
    <div className={cn()}>
      <div className={cn('header')}>
        <h2 className={cn('title')}>Категории</h2>
        <Button type="primary" onClick={() => setModal(true)}>Добавить категорию</Button>
      </div>

      <Table columns={columns} dataSource={categories}/>

      <CreateCategoryModal
        confirmLoading={loading}
        open={modal}
        handleCancel={() => {
          setModal(false)
          setSearchParams({})
        }}
        handleOk={handleCreateCategory}
      />


      {
        selectedCategory && (
          <LinkProductToProduct
            confirmLoading={false}
            open={!!selectedCategory}
            handleCancel={() => setSelectedCategory(null)}
            category={selectedCategory}
          />
        )
      }
    </div>
  );
};

export default Category;