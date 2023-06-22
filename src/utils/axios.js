import axios from 'axios';
import { getToken } from './common';

export const axios_isntance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,

    headers: {
        Accept: 'application/json',
        "Authorization": getToken() ? `Bearer ${getToken()}` : ""
    },
});

export const getAPI = async (url, option) => {
    const response = await axios_isntance.get(
        url,
        option
    );
  
    
    return response
}

export const postAPI = async (url, option) => {
    const response = await axios_isntance.post(
        url,
        option
    );
  
    return response
}


