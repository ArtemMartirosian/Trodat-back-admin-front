import './style.scss';
import { useClassName } from "../../utils/cn";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

const Header = () => {
  const cn = useClassName('header');

  return (
      <header className={cn()}>
          <Link to={'/'}>
              <img src="/logo.png" alt="trodat" />
          </Link>

        <div className={cn('menu')}>
          <Link to={'/'}>Главная</Link>
          <Link to={'/'}>Каталог</Link>
          <Link to={'/'}>О компании</Link>
          <Link to={'/'}>Акции</Link>
          <Link to={'/'}>Новости</Link>
          <Link to={'/'}>Контакты</Link>
        </div>

        <div className={cn('actions')}>
            <Button icon="search"/>
            <Link to={'/account'}>
                <Button icon="user"/>
            </Link>


            <Button icon="cart" title="корзина"/>
        </div>
      </header>
    )
};

export default Header;