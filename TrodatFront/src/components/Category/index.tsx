import {useClassName} from "../../utils/cn";
import './style.scss'
import {imageUrl} from "../../utils/constants";
import React from "react";

const Category = (product : any) => {
    const cn = useClassName('categoryCard');
    console.log(product , 'product2')

    return (
        <div className={cn()}>
            <div className={cn('image')}>
                <img src={`${imageUrl}products/${product.image}`} alt="" className={cn('image')} />
                {/*<img src={image} alt=""/>*/}
            </div>
            <div>
                <p>{product?.name}</p>
                <div className={cn('action')}>
                    <button>{product.article}</button>
                    <div>{product.size}</div>
                </div>
            </div>
        </div>

    )
}

export default Category