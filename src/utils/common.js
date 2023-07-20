export const getUser = () => {
  const token = sessionStorage.getItem('token');

  if (token && token != 'undefined') {
    // Decode the token to get the payload
    const payload = atob(token.split('.')[1]);
    // Parse the payload to retrieve the user's name
    const { name } = JSON.parse(payload);
    return name;
  } else {
    return null;
  }
};

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  sessionStorage.setItem('token', token);
}
