import React, { useState } from 'react';
import avatar from '../assets/avatar.png';
import {useHistory} from 'react-router-dom'
import { actLogout } from './../action/index'
import { useDispatch } from 'react-redux';
import { actEnableToast } from './../action/index'

function Nav() {
    let history = useHistory()
    const dispatch = useDispatch();

    const signout = () => dispatch(actLogout());
    const toast = (message) => dispatch(actEnableToast(message));
    const [username, setUsername] = useState(localStorage.getItem('user'));

    function logout(){
        localStorage.setItem('token', '');
        localStorage.setItem('user', '');
        localStorage.setItem('houseId', '');
        signout()
        toast("Đăng xuất thành công")
        history.push('/');
    }

    function home(){
        history.push('/');
    }

    return (
        <div className="bg-nav-home full-height">
            <div className="d-flex justify-content-center">
                <div className="bg-white avatar p-4 rounded-circle mt-5">
                    <img src={avatar} alt="avatar" className="full-width" />
                </div>
            </div>
            <h4 className="text-white text-center mt-1">{username}</h4>
            <div className="mt-5">
                <button type="button" onClick={home} className="d-block m-auto btn btn-nav">Home</button>
            </div>
            <div className="mt-5">
                <button type="button" onClick={logout} className="d-block m-auto btn btn-nav">Logout</button>
            </div>
        </div>
    );
}

export default Nav;