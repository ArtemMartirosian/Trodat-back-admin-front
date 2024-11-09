import './style.scss';
import {useClassName} from '../../utils/cn';

const MainScreen = () => {
    const cn = useClassName('mainScreen');

    return (
        <>
            <div className={cn()}>
                <div className={cn('outlet-wrapper')}>
                    <div className={cn('mainScreenContainer')}>
                        <div className={cn('mainScreenContent')}>
                            <div className={cn('TitleText')}>
                                <p className={cn('mainScreenTitle')}>
                                    Изготавливаем печати и штампы
                                </p>
                                <p className={cn('mainScreenText')}>
                                    Единственный официальный представитель{' '}
                                    <span> Trodat GmBH </span> на территории Кыргызстана с 2006
                                    года.
                                </p>
                            </div>
                            <button className={cn('mainScreenBtn')}>Каталог</button>
                            <div className={cn('ecoLogo')}>
                                <img src="/assets/img/mainPage/eco.png" alt="eco"/>
                                <p className={cn('ecoText')}>
                                    Использования до <span> 75%</span> переработанного пластика
                                    позволило нам свести выбросы <span> CO2 </span> к минимуму
                                </p>
                            </div>
                        </div>

                        <div className={cn('mainScreenImg')}>
                            <img src="/assets/img/mainPage/mainImg.svg" alt="main"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn('mainScreenPagination')}>
                <div className={cn('absolutePagination')}>
                    <div className={cn('paginationWrapped')}>
                        <div className={cn('paginationNum')}>
                            {' '}
                            <span> 01</span> / <span> 04 </span>
                        </div>
                        <div className={cn('paginationArrows')}>
                            <img src="/assets/img/mainPage/Arrow_l.png" alt="Arrow_l"/>
                            <img src="/assets/img/mainPage/Arrow_r.png" alt="Arrow_r"/>
                        </div>
                    </div>
                    <div className={cn('paginationCards')}>
                        <img src="/assets/img/mainPage/1.png" alt="Image"/>
                        <img src="/assets/img/mainPage/2.png" alt="Image"/>
                        <img src="/assets/img/mainPage/3.png" alt="Image"/>
                        <img src="/assets/img/mainPage/4.png" alt="Image"/>
                        <img src="/assets/img/mainPage/5.png" alt="Image"/>
                    </div>
                </div>
            </div>
        </>
    )
};

export default MainScreen;
