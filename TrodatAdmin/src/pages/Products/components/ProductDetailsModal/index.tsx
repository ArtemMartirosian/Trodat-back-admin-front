import React from 'react';
import { Modal, Descriptions, Image, Button } from 'antd';
import { ProductType } from "../../../../types/product.type";
import { imageUrl } from "../../../../utils/constants";

interface ProductDetailsModalProps {
    open: boolean;
    product: ProductType | null;
    onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ open, product, onClose }) => {
    if (!product) return null;

    return (
        <Modal
            visible={open}
            title="Детали продукта" // Title translated to Russian
            onCancel={onClose}
            footer={<Button onClick={onClose}>Закрыть</Button>} // Button label translated to Russian
            width={800}
        >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>

                <div style={{width : "200px"}}>
                    {
                        !product.oneCimages.length && <Image
                        width={200}
                        height={200}
                        src={product.image ? `${imageUrl}products/${product.image}` : `${imageUrl}placeholder.png`}
                        alt="Изображение продукта" // Alt text translated to Russian
                      />
                    }

                    {
                        !!product.oneCimages.length && product.oneCimages.map((img) => {
                            return <Image
                                width={200}
                                height={200}
                                src={img}
                                alt="Изображение продукта" // Alt text translated to Russian
                            />
                        } )
                    }
                </div>


                <div style={{ flex: 1 }}>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Артикул">{product.article}</Descriptions.Item> {/* Label translated */}
                        <Descriptions.Item label="Название">{product.name}</Descriptions.Item> {/* Label translated */}
                        <Descriptions.Item label="Категория">{product.category?.name}</Descriptions.Item> {/* Label translated */}
                        <Descriptions.Item label="Цвета">
                            {!product.oneCimages?.length && JSON.parse(product.color?.[0])?.map((color : any, index : number) => (
                                <div key={index} style={{ backgroundColor: color, width: '20px', height: '20px', borderRadius : "50%", display: 'inline-block', marginRight: '5px' }}></div>
                            ))}
                            {!!product.oneCimages?.length && product.color?.map((color : any, index : number) => (
                                <div key={index} >
                                    {color}
                                </div>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Цена">{product.price}</Descriptions.Item> {/* Label translated */}
                        <Descriptions.Item label="Описание">{product.description}</Descriptions.Item> {/* Label translated */}
                        <Descriptions.Item label="Комплектация">
                            {!product.oneCimages?.length && JSON.parse(product.equipment?.[0])?.map((item : any, index : number) => (
                                <p key={index} style={{ margin: 0 }}>{item}</p>
                            ))}
                            {!!product.oneCimages?.length && product.equipment?.map((item : any, index : number) => (
                                <p key={index} style={{ margin: 0 }}>{item}</p>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Рама">{product.frame}</Descriptions.Item> {/* Label translated */}
                        <Descriptions.Item label="Геометрия">{product.geometry}</Descriptions.Item> {/* Label translated */}
                        <Descriptions.Item label="Размер">{product.size}</Descriptions.Item> {/* Label translated */}
                    </Descriptions>
                </div>
            </div>
        </Modal>
    );
};

export default ProductDetailsModal;
