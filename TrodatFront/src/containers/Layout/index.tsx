import React from 'react';
import {Outlet} from 'react-router';
import {useClassName} from '../../utils/cn';
import './style.scss';
import Header from "../Header";
import Footer from "../Footer";

const Layout = () => {
    const cn = useClassName('layout');

    return (
        <div className={cn()}>
            <Header/>
            <div className={cn('outlet-wrapper')}>
                <Outlet/>
            </div>
            <Footer/>
        </div>
    );
};

export default Layout;
