import { useEffect } from "react"
import { useContext } from 'react';
import { AuthContext } from '../context';

const UserProfile =(username) => {
  const [context, _] = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAPI('/user/usersk/');
        if (!response || !response.data) {
          throw new Error('No data received from the server');
        }
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        
        setIsLoading(false);
        if (error?.response?.status === 401) {
          // Redirect to login page if unauthorized
          history('/login');
          toast.error('Failed to fetch users, please try again');
        } 
        if (error?.response?.status === 403) {
          toast.error(error?.response?.data?.detail || 'Something went error, please try again later')
          history('/dashboard');
        }
        else {
          toast.error('Something went error, please try again later')
        }
      }
    };

    fetchUsers();
  }, [history]);

}