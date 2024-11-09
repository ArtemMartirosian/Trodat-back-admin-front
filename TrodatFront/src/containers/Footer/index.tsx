import './style.scss';
import {useClassName} from "../../utils/cn";

const Footer = () => {
    const cn = useClassName('footer');

    return (
        <footer className={cn()}>
            <div className={cn('content')}>
                <div className={cn('info')}>
                    <img src="/logo.png" alt="trodat"/>
                    <p>Крупнейший производитель оснасток для печатей и штампов в мире</p>
                    <div>
                        <div>+996 553 66 47 87</div>
                        <span>или</span>
                        <div>+996 553 66 47 87</div>
                    </div>
                </div>
                <div className={cn('menu')}>
                    <div>
                        <h4>Навигация</h4>
                        <a href="#">Категории</a>
                        <a href="#">О компании</a>
                        <a href="#">Новости</a>
                        <a href="#">Контакты</a>
                        <a href="#">Профиль</a>
                    </div>
                    <div>
                        <h4>Печати</h4>
                        <a href="#">Круглые </a>
                        <a href="#">Прямоугольные</a>
                        <a href="#">Плоские</a>
                        <a href="#">Рельефные</a>
                    </div>
                    <div>
                        <h4>Штампы</h4>
                        <a href="#">Датер</a>
                        <a href="#">Овальные</a>
                        <a href="#">Бухгалтерские</a>
                        <a href="#">Угловые</a>
                        <a href="#">Банковские</a>
                    </div>
                    <div>
                        <h4>Контакты</h4>
                        <a href="#">trodatkg@gmail.com</a>
                        <a href="#">Токтогула 125/1 (Бизнес центр Avangard), Bishkek, Kyrgyzstan</a>
                    </div>
                </div>
            </div>
            <div className={cn('copyright')}>
                <div>
                    <img src="/assets/img/footer/madeIn.png" alt="made in"/>
                </div>
                <p>Trodat © 2023. All Rights Reserved</p>
                <div/>
            </div>

        </footer>
    )
};

export default Footer;