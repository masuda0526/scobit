import axios from "axios";
import { ADMIN_BASE_URL, PUBLIC_BASE_URL } from "../../constant/ApiUrls";
import { AccessTokenUtil } from "../TokenUtil/AccessTokenUtil";



export const ajaxAdminApi = axios.create({baseURL:ADMIN_BASE_URL});

ajaxAdminApi.interceptors.request.use((config) => {
  // console.log('AJAX-START');
  const token = AccessTokenUtil.getToken();
  if(!token){
    location.href = '#/login';
  }
  config.headers.Authorization = `Bearer ${token}`;

  return config;
},
(error) => {
  return Promise.reject(error);
})

export const ajaxPublicApi = axios.create({baseURL:PUBLIC_BASE_URL});

ajaxPublicApi.interceptors.request.use((config) => {
  // console.log('PUBLIC_API_START');
  return config;
}, (error) =>{return Promise.reject(error);});