import {useClassName} from "../../../utils/cn";
import Icon from "../icon";
import "./index.scss"

export const Button = ({title = "", icon = "" , iconStart = false }) => {
    const cn = useClassName('button');


    return (
        <button className={cn()} style={title ? {padding: '0 20px'} : {}}>
            {iconStart && icon &&  <Icon name={icon}/> }
            {title && <span>{title}</span>}
            {icon && !iconStart && <Icon name={icon}/>}
        </button>
    );
};