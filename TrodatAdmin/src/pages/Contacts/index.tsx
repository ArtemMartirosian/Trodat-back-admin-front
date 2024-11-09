import React, { useEffect, useState } from "react";
import { Button, Space, Table, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import { api } from "../../utils/api";
import { ContactType } from "../../types/Contacts.type";
import { useClassName } from "../../utils/cn";
import { AddContactForm } from "./components/CreateContatcs";

const Contacts = () => {
    const cn = useClassName('category');
    const [modalVisible, setModalVisible] = useState(false);
    const [contacts, setContacts] = useState<ContactType[]>([]);
    const [currentContact, setCurrentContact] = useState<ContactType | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const getContact = () => {
        api.get('/contacts')
            .then(response => {
                setContacts([response.data]); // Set contacts array directly
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    };

    useEffect(() => {
        getContact();
    }, []);

    const handleAddContact = (newContact: ContactType) => {
        api.post('/contacts', newContact)
            .then(() => {
                getContact(); // Refresh contacts list
                setModalVisible(false);
                setIsEditing(false);
            })
            .catch(error => {
                console.error('Error adding contact:', error);
            });
    };

    const handleEditContact = (contact: ContactType) => {
        setCurrentContact(contact);
        setIsEditing(true);
        setModalVisible(true);
    };

    const handleUpdateContact = (updatedContact: ContactType) => {
        api.post(`/contacts`, updatedContact)
            .then(() => {
                getContact(); // Refresh contacts list
                setModalVisible(false);
                setIsEditing(false);
                setCurrentContact(null);
            })
            .catch(error => {
                console.error('Error updating contact:', error);
            });
    };

    const columns: ColumnsType<ContactType> = [
        {
            title: 'Электронные адреса',
            dataIndex: 'emails',
            key: 'emails',
            render: (emails: string[]) => (
                <Space direction="vertical">
                    {emails?.map((email, index) => (
                        <span key={index}>{email}</span>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Телефонные номера',
            dataIndex: 'phones',
            key: 'phones',
            render: (phones: string[]) => (
                <Space direction="vertical">
                    {phones?.map((phone, index) => (
                        <span key={index}>{phone}</span>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Адреса',
            dataIndex: 'addresses',
            key: 'addresses',
            render: (addresses: { address: string, geolocation?: string }[]) => (
                <Space direction="vertical">
                    {addresses?.map((addr, index) => (
                        <div key={index}>
                            <span>{addr?.address}</span>
                            {addr?.geolocation && <div>Геолокация: {addr.geolocation}</div>}
                        </div>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Социальные сети',
            dataIndex: 'socialMedia',
            key: 'socialMedia',
            render: (socialMedia: { name: string, link: string }[]) => (
                <Space direction="vertical">
                    {socialMedia?.map((sm, index) => (
                        <div key={index}>
                            {sm.name && <div><strong>{sm.name}</strong></div>}
                            {sm.link && <div><a href={sm.link} target="_blank" rel="noopener noreferrer">{sm.link}</a></div>}
                        </div>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Действие',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handleEditContact(record)}>Редактировать</Button>
            ),
        },
    ];

    console.log(contacts , "gggg")

    return (
        <div className="contacts-container">
            <div className={cn('header')}>
                <h2 className={cn('title')}>Контакты</h2>
                {
                    !contacts?.length &&   <Button
                    type="primary"
                    onClick={() => {
                        setCurrentContact(null);
                        setIsEditing(false);
                        setModalVisible(true);
                    }}
                  >
                    Добавить контакт
                  </Button>
                }

            </div>

            <Table

                columns={columns}
                dataSource={contacts}
                rowKey={(record) => record?.id}
                pagination={false}
            />

            <Modal
                title={isEditing ? "Редактировать контакт" : "Добавить контакт"}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800} // Adjust the width as needed
            >
                <AddContactForm
                    onAdd={handleAddContact}
                    contact={currentContact}
                    isEditing={isEditing}
                    onUpdate={handleUpdateContact}
                />
            </Modal>
        </div>
    );
};

export default Contacts;
