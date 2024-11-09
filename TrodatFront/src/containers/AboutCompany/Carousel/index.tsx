import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {useClassName} from '../../../utils/cn';
import './style.scss';

const MyCarousel = () => {
    const cn = useClassName('sliderCarousel');
    const statusFormatter = () => '';
    return (
        <div className={cn()}>
            <Carousel
                showArrows={false}
                autoPlay={false}
                infiniteLoop={false}
                statusFormatter={statusFormatter}
            >
                <div className={cn('slide')}>
                    <img
                        src="/assets/img/aboutUs/carousel.png"
                        alt="carousel"
                    />
                </div>
                <div className={cn('slide')}>
                    <img
                        src="/assets/img/aboutUs/carousel.png"
                        alt="carousel"
                    />
                </div>
                <div className={cn('slide')}>
                    <img
                        src="/assets/img/aboutUs/carousel.png"
                        alt="carousel"
                    />
                </div>
            </Carousel>
        </div>
    );
};

export default MyCarousel;
