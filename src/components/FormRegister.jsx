import React, { useState } from 'react';
import { TextField, Grid, Snackbar, Slide } from '@material-ui/core';
import { BiUserCircle } from 'react-icons/bi';
import { BiMailSend} from 'react-icons/bi';
import { CgPassword } from 'react-icons/cg';
import call_api from '../services/request';
import validator from './../utils/validator';


function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

function FormRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClose = (reason) => {
        setOpen(false);
    };

    async function register() {
        var error = ""

        if(!validator.validateEmail(email)) {
            error += "Email invalid!!!\n"
        }

        if(!validator.validatePassword(password, resetPassword)) {
            error += "Password and reset password not match!!!"
        }

        if(error.length > 0){
            setErrorMessage(error);
            setOpen(true);
            return
        }


        const res = await call_api({
            method: 'POST',
            url: '/register',
            data: {
                username,
                password,
                email
            }
        });

        const { data } = res;

        if (data.code === 200) {
            window.location = '/login';
        } else {
            setErrorMessage(data.data);
            setOpen(true);
        }
    }

    function login() {
        window.location = '/login';
    }

    return (
        <div className="col-md-6 bg-main">
            <div className="container d-flex justify-content-center align-items-center full-height">
                <form className="shadow border rounded col-md-7 bg-white p-4 mb-3 mt-3">
                    <h2>Register Account</h2>
                    <Grid container alignItems="flex-end">
                        <Grid item xs={2}>
                            <BiMailSend size="1.5em" color="#ef9a9a" />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                label="email"
                                fullWidth
                                value={email}
                                color="secondary"
                                onChange={(e) => setEmail(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid container alignItems="flex-end">
                        <Grid item xs={2}>
                            <BiUserCircle size="1.5em" color="#ef9a9a" />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                label="username"
                                fullWidth
                                value={username}
                                color="secondary"
                                onChange={(e) => setUsername(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid className="mt-2" container alignItems="flex-end">
                        <Grid item xs={2}>
                            <CgPassword size="1.5em" color="#ef9a9a" />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                type="password"
                                label="password"
                                value={password}
                                fullWidth
                                color="secondary"
                                onChange={(e) => setPassword(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid className="mt-2" container alignItems="flex-end">
                        <Grid item xs={2}>
                            <CgPassword size="1.5em" color="#ef9a9a" />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                type="password"
                                label="reset password"
                                value={resetPassword}
                                fullWidth
                                color="secondary"
                                onChange={(e) => setResetPassword(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        TransitionComponent={SlideTransition}
                        open={open}
                        autoHideDuration={3000}
                        onClose={handleClose}
                        message={errorMessage}
                    />
                    <button type="button" onClick={register} class="mt-4 btn btn-custom">Register</button>
                
                    <button type="button" onClick={login} class="mt-4 btn btn-custom-register">Login</button>

                </form>
            </div>
        </div>
    );
}

export default FormRegister;