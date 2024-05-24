// Axios.js
import axios from "axios";
import { isExpired } from "react-jwt";
import { setMarketSession, setUserSession} from "../src/commonfn";



// Create a custom Axios instance with a base URL
const Axios = axios.create({
  baseURL: `http://127.0.0.1:5001`,
});



// Add interceptors or other configurations if needed
Axios.interceptors.request.use((config) => {


const usertoken = localStorage.getItem("usertoken"); 
const companytoken = localStorage.getItem("companytoken");
const markettoken = localStorage.getItem('markettoken');


  
  if (companytoken != null) {

    const isMyTokenExpired = isExpired(companytoken);

    if (isMyTokenExpired) {
      
      localStorage.clear();
      window.location.replace(`${window.location.origin}/companyLogin`);
      
      return Promise.reject("company login session expired");
    }

    config.headers['companyAuthToken'] = `Bearer ${companytoken}`;

  }

  if (usertoken != null) {

    const isMyTokenExpired = isExpired(usertoken);

    if (isMyTokenExpired) {

      setUserSession(null)
      window.location.replace(`${window.location.origin}/userLogin`);
      
      return Promise.reject("user login session expired");
    }

    config.headers['userAuthToken'] = `Bearer ${usertoken}`;
  }

  if (markettoken != null) {

    const isMyTokenExpired = isExpired(markettoken);

    if (isMyTokenExpired) {

      setMarketSession(null)
      window.location.replace(`${window.location.origin}/marketplace`);
      
      return Promise.reject("market session expired");
    }

    config.headers['marketAuthToken'] = `Bearer ${markettoken}`;
  }



  // Do something before the request is sent
  


  console.log('Request interceptor:', config);
  return config;

});

Axios.interceptors.response.use(
  (response) => {
    // Do something with the response data
    console.log('Response interceptor:', response);
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

export {Axios};
