import React, { useState } from 'react';
import { useClassName } from "../../utils/cn";
import { Button, Tag, Modal } from "antd";
import './style.scss';
import { useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";
import { NewsType } from "../../types/News.type";
import {imageUrl} from "../../utils/constants";

interface CardProps {
    news: any;
    deleteNews: (id: string) => void;  // Define the type for deleteNews function
}

const Card: React.FC<CardProps> = ({ news, deleteNews }) => {
    const cn = useClassName('card');
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

    const openNews = () => {
        setSearchParams({ id: news._id });
    };

    const showDeleteConfirm = (id: string) => {
        setNewsToDelete(id);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (newsToDelete) {
            deleteNews(newsToDelete);
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className={cn("newsContainer")}>
            <div className={cn('image-container')}>
                <img src={`${imageUrl}${news.image}`} alt="" className={cn('image')} />
            </div>

            <div className={cn('content')}>
                <h4 className={cn('title')}>
                    {news.title}
                </h4>
                <Tag color="green">
                    {news.type}
                </Tag>

                <div className={cn('buttons')}>
                    <Button onClick={openNews}>Редактировать</Button>
                    <Button onClick={() => showDeleteConfirm(news._id)} danger>Удалить</Button>
                </div>
            </div>

            <Modal
                title="Подтверждение удаления"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Удалить"
                cancelText="Отмена"
            >
                <p>Вы уверены, что хотите удалить эту новость?</p>
            </Modal>
        </div>
    );
};

export default Card;
