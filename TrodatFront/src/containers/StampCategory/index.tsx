import './style.scss';
import { useClassName } from '../../utils/cn';
import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import Category from '../../components/Category';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Product {
    id: string;
    name: string;
    // Add other properties of a product
}

interface Category {
    id: string;
    name: string;
    products: Product[];
}

const StampCategory = () => {
    const cn = useClassName('stCategory');
    const [category, setCategory] = useState<Category[]>([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/category/with-products');
                console.log('res', res.data);
                setCategory(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    const handleCatalogClick = () => {
        navigate('/catalog'); // Navigate to /catalog
    };

    return (
        <div className={cn()}>
            <div className={cn('outlet-wrapper')}>
                <p className={cn('stampTitle')}>Категории штампов и печатей</p>
                <p className={cn('stampText')}>
                    Мы предлагаем полный комплекс диагностических, лечебных, эстетических
                    и хирургических стоматологических услуг.
                </p>
                <div className={cn('homeBlock')}>
                    {category.map(({ id, name, products }) => (
                        <div key={id} className={cn('category')}>
                            <a href="#">
                                {name}
                                <img src="/assets/img/stampCategory/Line.svg" alt="Line" />
                            </a>
                            {products?.map((obj: Product, i: number) => (
                                <Category key={i} {...obj} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <button className={cn('catalog')} onClick={handleCatalogClick}>Каталог</button>
        </div>
    );
};

export default StampCategory;
