import {useClassName} from "../../utils/cn";
import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Button, Space, Table, TableProps} from "antd";
import {api} from "../../utils/api";
import {CustomersType} from "../../types/Customers.type";

const Customers = () => {
    const cn = useClassName('customers');
    const [modal, setModal] = useState(false);
    const [searchParams , setSearchParams] = useSearchParams()
    const [customers, setCustomers] = useState<CustomersType[]>([]);


    const fetchData = async () => {

        try {
            const res = await api.get<CustomersType[]>('/customer/all');
            console.log('res', res.data);
            setCustomers(res.data);
        } catch (e) {
            alert(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns: TableProps<CustomersType>['columns'] = [
        {
            title: 'Имя',
            dataIndex: 'firstname',
            key: 'firstname',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Фамилия',
            dataIndex: 'lastname',
            key: 'lastname',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Отчество',
            dataIndex: 'patronymic',
            key: 'patronymic',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Электронная почта',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <a>{text}</a>,
        },
    ];



    return (
        <div>
            <Table columns={columns} dataSource={customers}/>
        </div>
    );
};

export default Customers;