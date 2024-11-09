import './style.scss';
import {useClassName} from "../../utils/cn";
import {Button} from "../ui/button";

const CatalogPage = () => {
    const cn = useClassName('catalog');


    return (
        <div className={cn('catalogContainer')} >
            <div className={cn("catalogBox")}>

                <h1 className={cn('catalogHeaderText')}>
                    Каталог Trodat
                </h1>
                <div className={cn("searchBox")}>
                    <Button iconStart={true} icon='sorting' title='Сортировка'/>

                </div>

            </div>
        </div>
    );
}

export default CatalogPage;
