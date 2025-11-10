import axios, { AxiosError } from "axios"


const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const logOut = async () => {
try {
        
        await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true })
} catch (error:unknown) {
        if (error instanceof AxiosError) {
               alert(`${error.response?.data.error}.`); 
                
        }
}
   
}