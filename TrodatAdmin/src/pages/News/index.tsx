import React, {useEffect, useState} from 'react';
import Card from "../../components/Card";
import {Button} from "antd";
import {useClassName} from "../../utils/cn";
import './style.scss';
import CreateNewsModal from "./components/CreateNewsModal";
import {api} from "../../utils/api";
import {NewsType} from "../../types/News.type";
import {useSearchParams} from "react-router-dom";

const News = () => {
  const cn = useClassName('news');
  const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState<NewsType[]>([]);
    const [searchParams , setSearchParams] = useSearchParams()


    const fetchData = async () => {
        try {
            const res = await api.get<NewsType[]>('/news');
            console.log('res', res.data);
            setNews(res.data);
        } catch (e) {
        }
    };


    useEffect(() => {
        fetchData();
    }, []);


    const handleCreateNews = async (title: string , type: string , fullDescription : string , shortDescription: string ,  imageFile: File  | null ) => {
        setLoading(true);

        const id = searchParams.get('id');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('fullDescription', fullDescription);
        formData.append('shortDescription', shortDescription);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        console.log(id , "id")
        try {
            if (id) {
                await api.patch<NewsType>(`/news/${id}`, formData , {
                    headers: {

                    }
                } );
            } else {
                await api.post<NewsType>('/news', formData);
            }
            await fetchData();
        } catch (err) {
        } finally {
            setLoading(false);
            setModal(false);
            setSearchParams({})
        }

    };

    const deleteNews = async (id : string) => {
        try {
            const res = await api.delete(`/news/${id}`);
            fetchData();
            console.log('Response:', res.data);
        } catch (e) {
            console.error('Error deleting news:', e);
        }
    }

  // @ts-ignore
    return (
    <div className={cn()}>
      <div className={cn('header')}>
        <h1>Новости</h1>
        <Button onClick={() => setModal(true)} >Создать новости</Button>
      </div>



        <CreateNewsModal
            open={modal}
            setOpen={setModal}
            handleOk={handleCreateNews}
            confirmLoading={loading}
            handleCancel={() => (setModal(false),setSearchParams({}))}
        />

        <div className={cn('lists')} >
            {
                news.map((item) => {
                    return <Card news={item} deleteNews={deleteNews}  />
                } )

            }
        </div>
    </div>
  );
};

export default News;