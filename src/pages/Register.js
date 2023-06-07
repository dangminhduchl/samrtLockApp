import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserSession } from '../utils/common';
import axios from 'axios';
import { postAPI } from '../utils/axios';

const Register= props => {
  const history = useNavigate();
  const username = useFormInput('');
  const password = useFormInput('');
  const email = useFormInput('')
  const [error, setError] = useState(null);
  const [message,setMessage] = useState(null)
  const [loading, setLoading] = useState(false);

  // handle button click of register form

  const handleRegister = () => {
    setError(null);
    setLoading(true);
    postAPI('/user/register/', { username: username.value, password: password.value, email: email.value }).then(response => {
      setLoading(false);
      setMessage("Dang ki thanh cong, vui long doi admin approve")
    }).catch(error => {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    });
  }

  return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div> <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleRegister} disabled={loading} /><br />
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

export default Register;