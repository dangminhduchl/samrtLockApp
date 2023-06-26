import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserSession } from '../utils/common';
import { postAPI } from '../utils/axios';
import { Button, TextField } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context';

const Login = props => {
  const history = useNavigate();
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useContext(AuthContext)

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    postAPI('/user/login/', { username: username.value, password: password.value }).then(response => {
      setLoading(false);
      setUserSession(response.data.access);
      setContext({username: username.value})
      console.log(username.value)
      history('/dashboard');
    }).catch(error => {
      setLoading(false);
      if (error?.response?.status === 401) setError(error.response?.data?.error);
      else setError("Something went wrong, please try again");
    });
  }

  return (
    <div>
      <h2>Đăng nhập</h2>
      <div className="input-block">
        <TextField
          helperText="Please enter your username"
          label="Username"
          name="username"
          {...username}
        />
      </div>
      <div className="input-block">
        <TextField
          helperText="Please enter your password"
          label="Password"
          name="password"
          type='password'
          {...password}
        />
      </div>
      {error && <small className="error">{error}</small>}
      <Button variant="contained" className="input-button" onClick={handleLogin} disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </Button>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }

  return {
    value,
    onChange: handleChange
  }
}

export default Login;
