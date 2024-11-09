import Company from '../../containers/AboutCompany';
import MainScreen from '../../containers/MainScreen';
import StampCategory from '../../containers/StampCategory';
import Standart from '../../containers/Standart';
import {useClassName} from '../../utils/cn';
import './style.scss';
import News from "../../containers/News";

const Home = () => {
    const cn = useClassName('');
    return (
        <div className={cn()}>
            <MainScreen/>
            <Company/>
            <Standart/>
            <StampCategory/>
            <News/>
        </div>
    );
};

export default Home;
