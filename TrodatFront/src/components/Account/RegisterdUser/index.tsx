import React, { useState, useRef } from 'react';
import { useClassName } from '../../../utils/cn';
import './style.scss';
import { Button } from "../../ui/button";
import UserEditModal from "../Modals/UserEditModal";
import DeleteAccountModal from "../Modals/DeleteAccountModal";
import ChangePasswordModal from "../Modals/ChangePasswordModal"; // Import the new modal
import { api } from "../../../utils/api";
import { LockOutlined, LogoutOutlined, DeleteOutlined , CameraOutlined , UserOutlined } from "@ant-design/icons";
import { backUrl } from "../../../utils/constants";

interface RegisterdUserProps {
    user: {
        email: string;
        firstname: string;
        lastname: string;
        phone: string;
        imageUrl?: string;
    };
    setUser: (open: any) => void;
}

const RegisterdUser = ({ user, setUser }: RegisterdUserProps) => {
    const cn = useClassName('registerdUser');
    const [openModal, setOpenModal] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false); // State for change password modal
    const [image, setImage] = useState<File | null>(null); // State for selected image

    const fileInputRef = useRef<HTMLInputElement>(null);

    const logout = () => {
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        window.location.reload();
    };

    const handleUpdate = async (updatedUserData: { firstname: string; lastname: string; phone: string; email: string; }) => {
        try {
            const response = await api.put('/customer/update', updatedUserData);
            console.log(response.data, 'User updated successfully');
            setUser(response.data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteAccount = async () => {
        try {
            await api.delete('/customer/delete');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            await api.put('/customer/changePassword', { currentPassword, newPassword });
            setChangePasswordModalVisible(false); // Close the modal on success
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
            uploadImage(event.target.files[0]);
        }
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/customer/uploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Image uploaded successfully:', response.data);
            setUser((prevUser: any) => ({ ...prevUser, imageUrl: response.data.imageUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={cn('container')}>
            <div className={cn('accountBox')}>
                <h1 className={cn("unRegHeaderText")}>Личный кабинет</h1>
            </div>
            <div className={cn('accountContainer')}>
                <div className={cn('accountInfo')}>
                    <div className={cn('userPhotoBox')}>
                        <div className={cn("userPhoto")}>
                            {
                                user.imageUrl ?
                                    <img src={(`${backUrl}${user.imageUrl}`)} alt="Profile" />
                                    :
                                    <div className={cn("userIcon")}><UserOutlined style={{fontSize : "40px"}} /></div>
                            }

                            <div className={cn('uploadImg')} onClick={handleUploadClick}>
                                <CameraOutlined />
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                    </div>
                    <div className={cn("userData")}>
                        <div className={cn("userInfo")}>
                            <h6>ФИО</h6>
                            <h5>{`${user.firstname} ${user.lastname}`}</h5>
                        </div>
                        <div className={cn("userInfo")}>
                            <h6>Номер телефона</h6>
                            <h5>{user.phone}</h5>
                        </div>
                        <div className={cn("userInfo")}>
                            <h6>Почта</h6>
                            <h5>{user.email}</h5>
                        </div>

                        <div onClick={() => setOpenModal(true)}>
                            <Button title='Редактировать' />
                        </div>
                    </div>
                </div>
                <div className={cn('customerChanges')}>
                    <div onClick={() => setChangePasswordModalVisible(true)} className={cn('changes')}>
                        <LockOutlined />
                        <span>Сменить пароль</span>
                    </div>
                    <div onClick={logout} className={cn('changes')}>
                        <LogoutOutlined />
                        <span>Выйти</span>
                    </div>
                    <div onClick={() => setDeleteModalVisible(true)} className={cn('changes')}>
                        <DeleteOutlined />
                        <span>Удалить аккаунт</span>
                    </div>
                </div>

                <UserEditModal
                    open={openModal}
                    setOpen={setOpenModal}
                    userData={user}
                    onUpdate={handleUpdate}
                />

                <DeleteAccountModal
                    visible={deleteModalVisible}
                    onConfirm={deleteAccount}
                    onCancel={() => setDeleteModalVisible(false)}
                />

                <ChangePasswordModal
                    visible={changePasswordModalVisible}
                    onConfirm={changePassword}
                    onCancel={() => setChangePasswordModalVisible(false)}
                />
            </div>
        </div>
    );
};

export default RegisterdUser;
