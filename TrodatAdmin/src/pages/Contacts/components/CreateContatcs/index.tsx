import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space, Row, Col } from "antd";
import { ContactAddress, ContactType } from "../../../../types/Contacts.type";
import { api } from "../../../../utils/api";

export const AddContactForm = ({
                                   onAdd,
                                   contact,
                                   isEditing,
                                   onUpdate
                               }: {
    onAdd: (contact: ContactType) => void,
    contact: ContactType | null,
    isEditing: boolean,
    onUpdate: (contact: ContactType) => void
}) => {
    const [form] = Form.useForm();
    const [emails, setEmails] = useState<string[]>(['']);
    const [phones, setPhones] = useState<string[]>(['']);
    const [addresses, setAddresses] = useState<ContactAddress[]>([{ address: '', geolocation: '' }]);
    const [socialMedia, setSocialMedia] = useState<{ name: string, link: string }[]>([{ name: '', link: '' }]);

    useEffect(() => {
        if (contact) {
            form.setFieldsValue({ name: contact.name });
            setEmails(contact.emails?.length ? contact.emails : ['']);
            setPhones(contact.phones?.length ? contact.phones : ['']);
            setAddresses(contact.addresses?.length ? contact.addresses : [{ address: '', geolocation: '' }]);
            setSocialMedia(contact.socialMedia?.length ? contact.socialMedia : [{ name: '', link: '' }]);
        } else {
            form.resetFields();
            setEmails(['']);
            setPhones(['']);
            setAddresses([{ address: '', geolocation: '' }]);
            setSocialMedia([{ name: '', link: '' }]);
        }
    }, [contact, form]);

    const handleFormSubmit = (values: any) => {
        const newContact: ContactType = {
            id: contact ? contact.id : '',
            name: values.name,
            emails,
            phones,
            addresses,
            socialMedia
        };

        if (isEditing) {
            onUpdate(newContact);
        } else {
            onAdd(newContact);
        }
    };

    const handleRemoveEmail = (index: number) => {
        const newEmails = emails.filter((_, i) => i !== index);
        setEmails(newEmails.length ? newEmails : ['']);
    };

    const handleRemovePhone = (index: number) => {
        const newPhones = phones.filter((_, i) => i !== index);
        setPhones(newPhones.length ? newPhones : ['']);
    };

    const handleRemoveAddress = (index: number) => {
        const newAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(newAddresses.length ? newAddresses : [{ address: '', geolocation: '' }]);
    };

    const handleRemoveSocialMedia = (index: number) => {
        const newSocialMedia = socialMedia.filter((_, i) => i !== index);
        setSocialMedia(newSocialMedia.length ? newSocialMedia : [{ name: '', link: '' }]);
    };

    return (
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Электронные адреса">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {emails.map((email, index) => (
                                <Space key={index} align="baseline" style={{ width: '100%' }}>
                                    <Input
                                        value={email}
                                        onChange={(e) => {
                                            const newEmails = [...emails];
                                            newEmails[index] = e.target.value;
                                            setEmails(newEmails);
                                        }}
                                        type="email"
                                        placeholder="Введите электронный адрес"
                                    />
                                    <Button type="link" danger onClick={() => handleRemoveEmail(index)}>Удалить</Button>
                                </Space>
                            ))}
                            <Button type="dashed" onClick={() => setEmails([...emails, ''])}>Добавить электронный адрес</Button>
                        </Space>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Телефонные номера">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {phones.map((phone, index) => (
                                <Space key={index} align="baseline" style={{ width: '100%' }}>
                                    <Input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => {
                                            // Remove non-numeric characters
                                            const newPhone = e.target.value.replace(/\D/g, '');
                                            const newPhones = [...phones];
                                            newPhones[index] = newPhone;
                                            setPhones(newPhones);
                                        }}
                                        placeholder="Введите номер телефона"
                                        pattern="[0-9]*" // Allow only numeric input
                                    />
                                    <Button type="link" danger onClick={() => handleRemovePhone(index)}>Удалить</Button>
                                </Space>
                            ))}
                            <Button type="dashed" onClick={() => setPhones([...phones, ''])}>Добавить телефонный номер</Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Адреса">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {addresses.map((addr, index) => (
                                <Space key={index} direction="vertical" style={{ width: '100%' }}>
                                    <Input
                                        value={addr.address}
                                        onChange={(e) => {
                                            const newAddresses = [...addresses];
                                            newAddresses[index].address = e.target.value;
                                            setAddresses(newAddresses);
                                        }}
                                        placeholder="Введите адрес"
                                    />
                                    <Input
                                        value={addr.geolocation}
                                        onChange={(e) => {
                                            const newAddresses = [...addresses];
                                            newAddresses[index].geolocation = e.target.value;
                                            setAddresses(newAddresses);
                                        }}
                                        placeholder="Введите геолокацию (необязательно)"
                                    />
                                    <Button type="link" danger onClick={() => handleRemoveAddress(index)}>Удалить</Button>
                                </Space>
                            ))}
                            <Button type="dashed" onClick={() => setAddresses([...addresses, { address: '', geolocation: '' }])}>
                                Добавить адрес
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Социальные сети">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {socialMedia.map((sm, index) => (
                                <Space key={index} direction="vertical" style={{ width: '100%' }}>
                                    <Input
                                        value={sm.name}
                                        onChange={(e) => {
                                            const newSocialMedia = [...socialMedia];
                                            newSocialMedia[index].name = e.target.value;
                                            setSocialMedia(newSocialMedia);
                                        }}
                                        placeholder="Введите название социальной сети"
                                    />
                                    <Input
                                        value={sm.link}
                                        onChange={(e) => {
                                            const newSocialMedia = [...socialMedia];
                                            newSocialMedia[index].link = e.target.value;
                                            setSocialMedia(newSocialMedia);
                                        }}
                                        placeholder="Введите ссылку на профиль"
                                    />
                                    <Button type="link" danger onClick={() => handleRemoveSocialMedia(index)}>Удалить</Button>
                                </Space>
                            ))}
                            <Button type="dashed" onClick={() => setSocialMedia([...socialMedia, { name: '', link: '' }])}>
                                Добавить социальную сеть
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit">{isEditing ? 'Обновить контакт' : 'Добавить контакт'}</Button>
            </Form.Item>
        </Form>
    );
};
