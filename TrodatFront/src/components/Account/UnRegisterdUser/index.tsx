import { useClassName } from '../../../utils/cn';
import './style.scss'
import {UserOutlined} from "@ant-design/icons";
import {Button} from "../../ui/button";
import RegistrationModal from "../Modals/RegistrationModal";
import {useEffect, useState} from "react";
import LoginModal from "../Modals/LoginModal";
import {api} from "../../../utils/api";

const UnRegisterdUser = () => {
    const cn = useClassName('unRegisterdUser');
    const [regModal , setRegModal] = useState(false)
    const [loginModal , setLoginModal] = useState(false)




    return (
        <div className={cn('container')}>
            <div className={cn('accountBox')}>

                <h1 className={cn("unRegHeaderText")}>Личный кабинет</h1>
            </div>
            <div className={cn('loginContainer')}>

                <div className={cn("userIcon")}>
                    <Button  icon="user"/>
                </div>
                <div className={cn('accountText')}>
                    <h1>У вас нет аккаунта</h1>
                </div>
                <div className={cn('loginRegBox')}>

                    <div onClick={() => setRegModal(true)}>
                        <Button  title='Зарегистрироваться' />
                    </div>
                    <div onClick={() => setLoginModal(true) }>
                        <Button title='Войти'/>
                    </div>

                </div>

            </div>
            <RegistrationModal open={regModal} setOpen={setRegModal}/>
            <LoginModal open={loginModal} setOpen={setLoginModal}/>
        </div>

    )
}

export default UnRegisterdUser