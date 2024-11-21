import api from './axiosInstance'
import { isAxiosError } from 'axios'

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

export const getUsers = async () => {
  try {
    console.log("middleware hello");
    const response = await api.get('/user/all/');
    console.log("middleware" + response.data.success);
    if(response.data.success){
      return{
        success: true,
        data: response.data.data
      }
    }
    else{
      return { success: false, message:response.data.message};
    }
  } catch (error) {
    return handleError(error);
  }
};

export const createUser = async(firstName: string, lastName: string, email: string, password: string) => {
  try {
    const response = await api.post('/user/register/', {
      first_name: firstName,
      last_name: lastName,
      email:email,
      password:password,
    });
    return{
      success: true,
      data: response.data.data
    }
  } catch (error) {
    return handleError(error);
  }
};


export const deleteUser = async (user_id: string) => {
  try {
    const response = await api.delete(`/user/${user_id}/`);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
};

export const updateUser = async (userId:string, updateData:any) => {
  try {
    const response = await api.patch(`/user/${userId}/`, updateData);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
}


export const getProfile = async () => {
  try {
    const response = await api.get('/user/');
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
}

export const getDataFromToken = async () => {
  try {
    console.log("ajdsfpoaiewfoisapdoifjhpoaisdf");
    const response = await api.get('/auth/datafromtoken/');
    console.log("dta" + response.data.email);
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
}

export const updateProfile = async (updateData:any) => {
  try {
    const response = await api.put('profile/', updateData);
    return{
      success: true,
      data: response.data
    }
  } catch (error) {
    return handleError(error);
  }
}
