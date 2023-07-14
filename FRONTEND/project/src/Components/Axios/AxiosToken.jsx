import axios from "axios";
import Cookies from  "js-cookie";
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';

const  baseURL = "http://127.0.0.1:8000/api/"

let authTokens = Cookies.get('Tokens') ? JSON.parse(Cookies.get('Tokens')) : null;
console.log(authTokens,'tokennnnns')


const axiosInstance = axios.create({
    baseURL: baseURL,
    headers:{Authorization: `Bearer ${authTokens?authTokens.access:null}`}
  });

  axiosInstance.interceptors.request.use(async req =>{
    if(authTokens){
      authTokens = Cookies.get('Tokens') ? JSON.parse(Cookies.get('Tokens')) : null;
      console.log(authTokens,'tokkkkkkkkkkkkkkkk')
      console.log(authTokens.access,'aceeeeeeeeeeeee')
      req.headers.Authorization =  `Bearer ${authTokens?.access}`
           
    }
  
    const user = jwt_decode(authTokens.access)
    const isExperied = dayjs.unix(user.exp).diff(dayjs()) < 1;
    console.log('expired',isExperied)
    if(!isExperied) return req
  
    const response = await axios.post(`${baseURL}users/token/refresh/`,{
      refresh:authTokens.refresh
    })
  
    const tokenString = JSON.stringify(response.data);
    console.log('token',tokenString)
    Cookies.set('Tokens',tokenString)
    req.headers.Authorization =  `Bearer ${response.data.access}`
    
    return req
  })
  
  export default axiosInstance;
  
  