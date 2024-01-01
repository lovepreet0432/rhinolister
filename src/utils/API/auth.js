import axios from 'axios';
import { API_BASE_URL } from '../../Constants';


export const adminLoginApi = async (formData) => {
    try {
        const response = await axios.post(
            API_BASE_URL+"/admin/login",
             formData ,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const loginApi = async (formData) => {
    try {
        const response = await axios.post(
            API_BASE_URL+"/login",
             formData ,
            {
                headers: {
                    'Content-Type': 'application/json',
                     withCredentials: true,
                },
            });
            console.log('eeeeeeee',response);
        return response;
    } catch (error) {
        if(error.response){
        return error.response;
        }else
        {
            return error.message;
        }
    }
};

export const registerApi = async (formData) => {
    try {
        const response = await axios.post(
            API_BASE_URL+"/signup",
             formData ,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const UserProfileApi = async (formData,accessToken) => {
    try {
        const response = await axios.post(
            API_BASE_URL+"/userprofile",
             formData ,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${atob(accessToken)}`
                },
            });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const ChangePasswordApi = async (formData,accessToken) => {
    try {
        const response = await axios.post(
            API_BASE_URL+"/change-password",
             formData ,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${atob(accessToken)}`,
                },
            });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const resetPasswordApi = async (email,password,token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/reset-password`,
            {
                email: email,
                password: password,
                token: token,
            },
            {
                headers: {
                "Content-Type": "application/json"
                },
            }
            );
        return response;
    } catch (error) {
        return error.response;
    }
}

export const forgotPasswordApi = async (email) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/forgot-password`,
            {
                email: email
            },
            {
                headers: {
                "Content-Type": "application/json"
                },
            }
            );
        return response;
    } catch (error) {  
        return error.response;
    }
}; 


export const getHomePageData = async () => {
    try {
        const response = await axios.get(API_BASE_URL + "/getHomepage", {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getUser = async (authToken) => {
  const encodeToken=atob(authToken);
    try {
      const response = await axios
      .get(API_BASE_URL + "/user", {
        headers: {
          Authorization: `Bearer ${encodeToken}`,
        },
      })
        return response;
    } catch (error) {
        return error.response;
    }
}; 
