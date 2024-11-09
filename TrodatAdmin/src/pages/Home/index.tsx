import React from 'react';
import {useClassName} from "../../utils/cn";
import './style.scss';

const Home = () => {
  const cn = useClassName('home');
  return (
    <div className={cn()}>
      <h1 className={cn('title')}>Добро пожаловать в админ панель Trodat</h1>
      <img src="/logo.png" alt="trodat" />
    </div>
  );
};

export default Home;