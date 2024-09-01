import axios from 'axios';
import { BACKEND_URL } from '../utils/constant';

export const register = async ({name,email,password,confirmPassword})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/auth/register`,{
            name,
            email,
            password,
            confirmPassword
        },{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response;
    }
    catch(err){
        return new Error(err.response.data.message)
    }
    
}

export const login = async ({ email,password })=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/auth/login`,{
            email,
            password
            
        },{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response;
    }
    catch(err){
        return new Error(err.response.data.message)
    }
    
}