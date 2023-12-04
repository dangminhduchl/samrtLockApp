export const getUser = () => {
  const token = sessionStorage.getItem('token');

  if (token && token != 'undefined') {
    try {
      // Decode the token to get the payload
      const payload = atob(token.split('.')[1]);
      const { name } = JSON.parse(payload);

      return name;
    }
    catch {
      return token;
    }
    // Parse the payload to retrieve the user's name

  } else {
    return null;
  }
};

export const getUserId = () => {
  const token = sessionStorage.getItem('token');

  if (token && token != 'undefined') {
    try {
      // Decode the token to get the payload
      const payload = atob(token.split('.')[1]);
      // Parse the payload to retrieve the user's name
      const { id } = JSON.parse(payload);

      return id;
    } catch {
      return token;
    }
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
