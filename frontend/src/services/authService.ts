import api from './axiosInstance';
import axios, { isAxiosError } from 'axios';

const handleError = (err: any): {
  success: false,
  message: string
} => {
  if (isAxiosError(err)) {
    if (err.response) {
      return {
        success: false,
        message: err.response.data.message
      }
    }
    if (err.request) {
      return {
        success: false,
        message: err.request.data.message
      }
    }
  }

  return {
    success: false,
    message: err
  }
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email:email, password:password });
    if(response.data.success){
      return {success: true, data: response.data.data};
    }
    else {
      return {success:false, message: response.data.message}
    }
  } catch (error) {
    return handleError(error);
  }
};

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
  try {
    const response = await api.post('/user/register/', {
      first_name: firstName,
      last_name: lastName,
      email:email,
      password:password,
    });
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
};