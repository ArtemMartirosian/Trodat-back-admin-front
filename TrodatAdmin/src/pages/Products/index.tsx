import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useClassName } from "../../utils/cn";
import { Button, Space, Table, TableProps } from "antd";
import { api } from "../../utils/api";
import { ProductType } from "../../types/product.type";
import { CategoryType } from "../../types/Category.type";
import './style.scss';
import ChangeCategoryModal from "./components/ChangeCategoryModal";
import CreateProductModal from "./components/CreateProductModal";
import { useSearchParams } from "react-router-dom";
import {imageUrl} from "../../utils/constants";
import ProductDetailsModal from "./components/ProductDetailsModal";



const Products = () => {
  const cn = useClassName('products');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [changeCategory, setChangeCategory] = useState<null | ProductType>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false); // New state for details modal
  const [selectedProduct, setSelectedProduct] = useState<null | ProductType>(null); // New state for selected product



  useLayoutEffect(() => {
    const layout = document.querySelector('.layout__outlet-wrapper');
    if (layout && productRef.current) {
      productRef.current.style.width = `${layout.clientWidth - 40}px`;
    }
  }, []);

  const columns: TableProps<ProductType>['columns'] = [
    {
      title: 'Изображение',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      className : cn("tableData"),
      render: (img, record) => {
        // Use img if available, otherwise use record.oneCimages[0]
        const imageSrc = img ? `${imageUrl}products/${img}` : `${record.oneCimages?.[0]}`;
        return (
            <img
                width={70}
                height={40}
                style={{ objectFit: 'cover' }}
                src={imageSrc}
                alt="Product Image"
            />
        );
      },
      align: 'center'
    },
    {
      title: 'Артикул',
      dataIndex: 'article',
      key: 'article',
      width: 100,
      className: cn('tableData'),
      render: (text) => (
          <Button type="link" onClick={() => openDetailsModal(text)}>
            {text}
          </Button>
      ),
      align: 'center',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      width: 120  ,
      className : cn("tableData"),
      render: (text) => <Button type="link">{text}</Button>,
      align: 'center'
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      className : cn("tableData"),
      render: (category: CategoryType) => category?.name,
      align: 'center'
    },
    {
      title: 'Цвета',
      dataIndex: 'color',
      key: 'color',
      width: 120,
      className : cn("tableDataColors"),
      render: (colors: string[] , record) => {
        console.log(colors , "gggg")
        return    colors && !record?.oneCimages?.length ? (
            // Parse the JSON string to an array
            JSON.parse(colors?.[0]).map((val : string, index : number) => (
                <div style={{background : val }} className={cn("productColors")}></div>
            ))
        ) : (
           <div>
             {
               colors.map((item) => {
                 return <p >{item}</p>
               } )
             }
           </div>
        )
      },
      align: 'center'
    },
    {
      title: 'price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'center',
      className : cn("tableData"),
    },
    // {
    //   title: 'Описание',
    //   dataIndex: 'description',
    //   key: 'description',
    //   width: 250,
    //   className: cn('description-column'),
    //   align: 'center'
    // },
    {
      title: 'Комплектация',
      dataIndex: 'equipment',
      key: 'equipment',
      width: 120,
      render: (equipment: string[] , record) => {
        console.log(equipment , "gggg")
        return    equipment && !record?.oneCimages?.length ? (
            // Parse the JSON string to an array
            JSON.parse(equipment?.[0]).map((val : string, index : number) => (
                <p style={{padding : 0 , margin : "5px" }} key={index}>{val}</p>
            ))
        ) : (
            <div>
              {
                equipment.map((val : string, index : number) => (
                    <p style={{padding : 0 , margin : "5px" }} key={index}>{val}</p>
                ))
              }
            </div>
        )
      },
      align: 'center',
      className : cn("tableData"),
    },
    {
      title: 'Корпус',
      dataIndex: 'frame',
      key: 'frame',
      width: 120,
      align: 'center',
      className : cn("tableData"),
    },

    {
      title: 'Геометрия оттиска',
      dataIndex: 'geometry',
      key: 'geometry',
      align: 'center',
      width: 120,
      className : cn("tableData"),
    },
    // {
    //   title: 'Размер клише',
    //   dataIndex: 'size',
    //   key: 'size',
    //   align: 'center',
    //   width: 120,
    //   className : cn("tableData"),
    // },

    {
      title: 'Действие',
      key: 'action',
      render: (_, record) => (
          <div   style={{display : "flex" , alignItems : "start" , flexDirection : "column"  , gap : "-15px" , paddingBottom : "5px"}}>
            {
              !record?.oneCimages?.[0] &&  <Button onClick={() => editProduct(record._id)} type="link" >Редактировать</Button>
            }
            <Button onClick={() => setChangeCategory(record)} type="link" >Изменить категорию</Button>
            <Button onClick={() => deleteProduct(record._id)} type="link" >Удалить</Button>
          </div>
      ),
      width: 110,
      align: 'center',
      // className : cn("tableData"),
    },
  ];

  const handleCreateProduct = async (productData: ProductType, imageFile: File | null) => {
    const id = searchParams.get('id');
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('product1cId', productData.product1cId);
      formData.append('article', productData.article);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('description1c', productData.description1c);
      formData.append('color', JSON.stringify(productData.color));
      formData.append('equipment', JSON.stringify(productData.equipment));
      // @ts-ignore
      formData.append('category', productData.category); // Adjust this line
      formData.append('size', productData.size || '');
      formData.append('frame', productData.frame || '');
      // @ts-ignore
      formData.append('price', productData.price || 0);
      formData.append('geometry', productData.geometry || '');
      formData.append('is_active', productData.is_active.toString());
      console.log(imageFile , "imageFile")
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if(id){
        const res = await api.patch<ProductType>(`/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        const res = await api.post<ProductType>('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }


      setModal(false);
    } catch (e) {
      alert(e);
    } finally {
      fetchData()
      setSearchParams({})
      setLoading(false);
    }
  };

  console.log(products , "products")

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<ProductType[]>('/products');
      setProducts(res.data);
      setLoading(false);
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();
  }, []);

  const handleChangeCategory = async (categoryId: string, productId: string) => {
    setLoading(true);
    api.put<ProductType>('/products/changeCategory', {
      categoryId,
      productId
    })
        .then(res => {
          setChangeCategory(null);
          const copyProducts = [...products];
          const index = copyProducts.findIndex(product => product._id === productId);
          copyProducts[index] = res.data;
          setProducts(copyProducts);
        })
        .catch(err => alert(err))
        .finally(() => setLoading(false));
  };

  const deleteProduct = async (id : string) => {
    try {
      const res = await api.delete(`/products/${id}`);
      fetchData();
      console.log('Response:', res.data);
    } catch (e) {
      console.error('Error deleting news:', e);
    }
  }

  const editProduct = (id : string) => {
    setSearchParams({ id });
  }

  const openDetailsModal = (productId: string) => {
    const product = products.find(p => p.article === productId);
    setSelectedProduct(product || null);
    setDetailsModalVisible(true);
  };

  const productIntegration = async () => {
    try {
      setLoading(true);
      await api.get<ProductType[]>('/products/integration');
      fetchData();
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };




  return (
      <div className={cn()} ref={productRef}>
        <div className={cn('header')}>
          <h2 className={cn('title')}>Товары</h2>

          <div className={cn("productsAdd")}>
            <Button onClick={() => setModal(true)} type="primary">Добавить товары</Button>
            <Button onClick={productIntegration}  type="primary">Интеграция продуктов</Button>
          </div>
        </div>

       <div>
         <Table scroll={{ x: 1200 }} loading={loading} columns={columns} dataSource={products} />
         {/*{*/}
         {/*  products.map((item) => {*/}
         {/*    return <div className={cn('table')}>*/}
         {/*      <div className={cn("tableDataText")}>{item.article}</div>*/}
         {/*      <div className={cn("tableDataText")}>{item.name}</div>*/}
         {/*      <div className={cn("tableDataText")}>{item?.category?.name}</div>*/}
         {/*      <div style={{display : "flex" , flexWrap : "wrap"}} className={cn("tableDataText")}>*/}
         {/*        {*/}
         {/*            item.color?.[0] && (*/}
         {/*                // Parse the JSON string to an array*/}
         {/*                JSON.parse(item.color[0]).map((val : string, index : number) => (*/}
         {/*                    <div style={{background : val}} className={cn("productColors")}></div>*/}
         {/*                ))*/}
         {/*            )*/}
         {/*        }*/}
         {/*      </div>*/}
         {/*      <div className={cn('description-column')}>{item.description}</div>*/}
         {/*      <div className={cn('tableDataText')}>*/}
         {/*        {*/}
         {/*            item.equipment?.[0] && (*/}
         {/*                // Parse the JSON string to an array*/}
         {/*                JSON.parse(item.equipment[0]).map((val : string, index : number) => (*/}
         {/*                    <p style={{padding : 0 , margin : "5px"}} key={index}>{val}</p>*/}
         {/*                ))*/}
         {/*            )*/}
         {/*        }*/}
         {/*      </div>*/}
         {/*      <div className={cn('tableDataText')}>{item.frame}</div>*/}
         {/*      <div className={cn('tableDataText')}>{item.geometry}</div>*/}
         {/*      <div className={cn('tableDataText')}>{item.size}</div>*/}
         {/*      <div className={cn('updateDelete')}>*/}
         {/*        <Button onClick={() => editProduct(item._id)} type="link" >Редактировать</Button>*/}
         {/*        <Button onClick={() => setChangeCategory(item)} type="link" >Изменить категорию</Button>*/}
         {/*        <Button onClick={() => deleteProduct(item._id)} type="link" >Удалить</Button>*/}
         {/*      </div>*/}
         {/*    </div>*/}
         {/*  } )*/}
         {/*}*/}
       </div>

        <CreateProductModal
            open={modal}
            setOpen={setModal}
            handleOk={handleCreateProduct}
            confirmLoading={loading}
            handleCancel={() => (setModal(false), setSearchParams({}))}
        />

        {
            changeCategory && (
                <ChangeCategoryModal
                    product={changeCategory}
                    handleClose={() => setChangeCategory(null)}
                    onOk={handleChangeCategory}
                />
            )
        }

        <ProductDetailsModal
            open={detailsModalVisible}
            product={selectedProduct}
            onClose={() => setDetailsModalVisible(false)}
        />
      </div>
  );
};

export default Products;
