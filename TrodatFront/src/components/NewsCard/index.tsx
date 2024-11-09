import React from 'react';
import {useClassName} from "../../utils/cn";
import {Button, Tag} from "antd";
import './style.scss';
import {imageUrl} from "../../utils/constants";
import {ArrowRightOutlined} from "@ant-design/icons";

interface CardProps {
    news: any;}

const NewsCard: React.FC<CardProps>  = ({news}) => {
  const cn = useClassName('card');

  return (
    <div className={cn()}>
        <div className={cn('image-container')}>
            <img src={`${imageUrl}${news.image}`} alt="" className={cn('image')} />
        </div>

      <div className={cn('content')}>
        <h4 className={cn('title')}>
            {news.title}
            {/*Закажите 8 печатей и 1 в подарок!*/}
        </h4>
        <Tag color="green">
            {news.type}
        </Tag>


        <div className={cn('seeMore')}>
            <button className={cn('seeMoreBtn')}>
                <span>
                    Подробнее
                </span>
                <ArrowRightOutlined style={{ fontSize: '22px' }}     />
            </button>

          {/*<Button >Редактировать</Button>*/}
          {/*<Button danger>Удалить</Button>*/}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;