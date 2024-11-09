import React, { useEffect, useState } from 'react';
import './style.scss';
import { useClassName } from "../../utils/cn";
import { api } from "../../utils/api";
import { OrdersType } from "../../types/Orders.type";
import {Button, Modal, Table, TableProps, Card, Row, Col, Select} from "antd";
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { imageUrl } from "../../utils/constants";

const Orders = () => {
    const cn = useClassName('orders');
    const [orders, setOrders] = useState<OrdersType[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrdersType | null>(null);
    const [productDetails, setProductDetails] = useState<any[]>([]);
    const statusOptions = ['В ожидании', 'Отправлен', 'Доставлен', 'Отменен'];

    // @ts-ignore
    const [status, setStatus] = useState<string | undefined>(selectedOrder?.status);


    const columns: TableProps<OrdersType>['columns'] = [
        {
            title: 'Имя клиента',
            key: 'customerName',
            width: 150,
            align: 'center',
            render: (text, record) => (
                <span>{record?.customerName} {record?.customerLastName}</span>
            ),
        },
        {
            title: 'Электронная почта клиента',
            dataIndex: 'customerEmail',
            key: 'customerEmail',
            width: 200,
            align: 'center',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            align: 'center',
        },
        {
            title: 'Телефон клиента',
            dataIndex: 'customerPhone',
            key: 'customerPhone',
            width: 150,
            align: 'center',
        },
        {
            title: 'Итоговая цена',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 120,
            align: 'center',
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 180,
            align: 'center',
            render: (text, record) => (
                <>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleSeeMore(record)}
                        style={{ marginRight: 8 }}
                    >
                        Подробнее
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                    >
                        Удалить
                    </Button>
                </>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res?.data);
            console.log('Order response', res.data);
        } catch (e) {
            console.error('Error fetching orders', e);
        }
    };

    const handleDelete = (orderId: string) => {
        setOrderToDelete(orderId);
        setIsModalVisible(true);
    };

    const confirmDelete = async () => {
        if (orderToDelete) {
            try {
                await api.delete(`/orders/${orderToDelete}`);
                setOrders(orders.filter(order => order._id !== orderToDelete));
                setIsModalVisible(false);
                setOrderToDelete(null);
            } catch (e) {
                console.error('Error deleting order', e);
            }
        }
    };

    const cancelDelete = () => {
        setIsModalVisible(false);
        setOrderToDelete(null);
    };

    const handleSeeMore = async (order: OrdersType) => {
        setSelectedOrder(order);
        console.log(order , "ccccc")
        setStatus(order.status);
        try {
            const productDetails = await Promise.all(
                order.products.map(product => api.get(`/products/${product.id}`))
            );
            setProductDetails(productDetails.map(res => res.data));
            setIsModalVisible(true);
            fetchData()
        } catch (e) {
            console.error('Error fetching product details', e);
        }
    };

    const cancelSeeMore = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
        setProductDetails([]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (newStatus: any) => {
        if (selectedOrder) {
            try {
                await api.patch(`/orders/${selectedOrder._id}/status`, { status: newStatus });
                setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
                setStatus(newStatus);
            } catch (e) {
                console.error('Error updating order status', e);
            }
        }
    };






    return (
        <div>
            <Table columns={columns} dataSource={orders} rowKey="_id" />
            <Modal
                title="Подтверждение удаления"
                visible={isModalVisible && !selectedOrder}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Да"
                cancelText="Нет"
            >
                <p>Вы уверены, что хотите удалить этот заказ?</p>
            </Modal>
            <Modal
                title="Детали заказа"
                visible={!!selectedOrder}
                onCancel={cancelSeeMore}
                footer={null}
                width={800}
                bodyStyle={{ padding: '20px' }}
            >
                {selectedOrder && (
                    <>
                        <p><strong>Имя клиента:</strong> {selectedOrder.customerName} {selectedOrder.customerLastName}</p>
                        <p><strong>Электронная почта клиента:</strong> {selectedOrder.customerEmail}</p>
                        <p><strong>Телефон клиента:</strong> {selectedOrder.customerPhone}</p>
                        <p><strong>Итоговая цена:</strong> {selectedOrder.totalPrice}</p>
                        <p><strong>Статус заказа:</strong></p>
                        <Select
                            value={status}
                            onChange={handleStatusChange}
                            style={{ width: '100%', marginBottom: '16px' }}
                        >
                            {statusOptions.map(option => (
                                <Select.Option key={option} value={option}>
                                    {option}
                                </Select.Option>
                            ))}
                        </Select>
                        <h3>Продукты:</h3>
                        <Row gutter={16}>
                            {productDetails.map(product => {
                                const productCount = selectedOrder?.products.find((val) => val.id === product._id)?.count || 0;
                                const totalProductPrice = product.price * productCount;

                                return (
                                    <Col span={8} key={product._id} style={{ marginBottom: '16px' }}>
                                        <Card
                                            hoverable
                                            cover={<img width={200} height={150} alt={product.name} src={`${imageUrl}products/${product.image}`} />}
                                            style={{ width: '100%' }}
                                        >
                                            <Card.Meta
                                                title={product.name}
                                                description={`Цена: $${product.price} x ${productCount} = $${totalProductPrice}`}
                                            />
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                        <p><strong>Итоговая цена заказа:</strong> {selectedOrder.totalPrice}</p>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Orders;
