import {Outlet} from 'react-router';
import './style.scss';
import {useClassName} from '../../utils/cn';
import MyCarousel from './Carousel';
// import group from "./img/group_pocket.png"

const Company = () => {
    const cn = useClassName('company');

    return (
        <>
            <div className={cn()}>
                <div className={cn('outlet-wrapper')}>
                    <div className={cn('sliderContainer')}>
                        <div className={cn('sliderBox')}>
                            <MyCarousel/>
                            <div className={cn('sliderLogo')}>
                                <img
                                    src='/assets/img/aboutUs/carousel2.png' alt="Image"
                                />
                            </div>
                        </div>
                        <div className={cn('sliderContent')}>
                            <p className={cn('sliderContentTitle')}>
                                trodat.<span>Бишкек</span>
                            </p>
                            <div className={cn('walkDot')}>
                                <img src="/assets/img/aboutUs/circle.png" alt="circle"/>
                                <p>Всегда на шаг впереди</p>
                            </div>
                            <p className={cn('sliderContentText')}>
                                Мы являемся лояльными партнерами для наших клиентов, и мы
                                рассматриваем их успех как нашу ответственность. Создавая
                                материальную и нематериальную ценность для наших клиентов, наши
                                продукты обеспечивают им конкурентное рыночное преимущество и
                                прибыль.
                            </p>
                            <img className={cn('sliderContent__logo')} src="/assets/img/aboutUs/logo.png" alt="logo"/>
                            <div className={cn('tpoGroup')}>
                                <p>Трогруппа</p>
                                <p>Ориентированы на клиента</p>
                            </div>
                            <p className={cn('founded')}>
                                Основана в 1912 году. Trodat – это почти столетняя история,
                                посвященная искусству создания уникальной штемпельной продукции.
                            </p>
                            <button className={cn('moreAboutUs')}>Подробнее о нас</button>
                        </div>
                    </div>
                    <Outlet/>
                </div>
            </div>
        </>
    );
};

export default Company;
