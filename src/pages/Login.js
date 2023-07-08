import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserSession } from '../utils/common';
import { postAPI } from '../utils/axios';
import { Button, TextField, Card, CardMedia } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context';
import FaceLogin from './FaceLogin';
import '../login.css';
import { getUser } from '../utils/common';
import { Image } from '@mui/icons-material';

const Login = () => {
  const history = useNavigate();
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useContext(AuthContext);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    postAPI('/user/login/', { username: username.value, password: password.value })
      .then(response => {
        setLoading(false);
        setUserSession(response.data.access);
        history('/dashboard');
        setContext((prevContext) => ({ ...prevContext, username: getUser() }));
      })
      .catch(error => {
        setLoading(false);
        if (error?.response?.status === 401) setError(error.response?.data?.error);
        else setError('Something went wrong, please try again');
      });
  };

  return (
    <div className="login-container">
      <div className="border-login">
        {/* <Card>
          <CardMedia
            component="img"
            src={process.env.PUBLIC_URL + 'public/image/logo_knock.png'}
            alt="Image Alt Text"
          />
        </Card> */}
        <Image source = {{uri: '../../public/image/logo_knock.png'}} style = {{width:40, height:40}}/>
        <div className="login-section">
          <div className='face-login-section'>
            <div className="input-block">
              <h2>Login</h2>
              <TextField className='text-field'
                helperText="Please enter your username"
                label="Username"
                name="username" {...username}
              />
              <TextField className='text-field'
                helperText="Please enter your password"
                label="Password"
                name="password"
                type="password"
                {...password}
              />
              {error && <small className="error">{error}</small>}
              <Button variant="contained" className="input-button" onClick={handleLogin} disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </div>
          </div>
        </div>
        <div className="login-section">
          <FaceLogin />
        </div>
      </div>
    </div>
  );
};

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleChange,
  };
};

export default Login;
