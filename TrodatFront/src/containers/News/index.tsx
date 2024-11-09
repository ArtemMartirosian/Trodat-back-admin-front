import {useClassName} from "../../utils/cn";
import NewsCard from "../../components/NewsCard";
import './style.scss'
import {useEffect, useState} from "react";
import {api} from "../../utils/api";
import {NewsType} from "../../types/News.type";

const News = () => {

    const cn = useClassName('news');
    const [news, setNews] = useState<NewsType[]>([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/news');
                console.log('res', res.data);
                setNews(res.data);
            } catch (e) {
            }
        };
        fetchData();
    }, []);

    console.log(news)
    return (
        <section className={cn()}>
            <h2>Новости</h2>
            <p>Мы предлагаем полный комплекс диагностических, лечебных, эстетических и хирургических стоматологических
                услуг.</p>
            <div className={cn('content')}>
                {
                    news?.map((item) => {
                        return  <NewsCard news={item}/>
                    } )
                }
                {/*<NewsCard/>*/}
                {/*<NewsCard/>*/}
                {/*<NewsCard/>*/}
                {/*<NewsCard/>*/}
            </div>
            <div className={cn('footer')}>
                <button className={cn('catalog')}>Посмотреть все</button>
            </div>
        </section>
    )
}

export default News