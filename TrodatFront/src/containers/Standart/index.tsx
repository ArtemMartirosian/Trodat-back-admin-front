import './style.scss';
import { useClassName } from '../../utils/cn';

const Standart = () => {
  const cn = useClassName('standart');

  return (
    <div className={cn()}>
      <div className={cn('outlet-wrapper')}>
        <div className={cn('standartContainer')}>
          <p className={cn('standartTitle')}>
            ISO9001.<span>170 стран</span>
          </p>
        </div>
      </div>

      <div className={cn('standartContent')}>
        <img src="/assets/img/aboutUs/group_pocket.png" alt="group pocket" />
        <p className={cn('standartText')}>
          Продукция с маркой Trodat известна в 170 странах мира. Высокое
          качество изделий подтверждает международный сертификат ISO 9001.
        </p>
      </div>
    </div>
  );
};

export default Standart;
