import './style.scss';
import UnRegisterdUser from "./UnRegisterdUser";
import RegisterdUser from "./RegisterdUser";
import { api } from "../../utils/api";
import { useEffect, useState } from "react";

const AccountPage = () => {
    const [user, setUser] = useState(null); // Ensure type matches User

    console.log(user)
    const checkAuth = async () => {
        try {
            const res = await api.get('/customer/checkAuth');
            if (res.data && res.data.user) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        user ? <RegisterdUser user={user}  setUser={setUser} /> : <UnRegisterdUser />
    );
}

export default AccountPage;
