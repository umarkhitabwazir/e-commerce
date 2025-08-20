import axios from "axios"


const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const logOut = async () => {

    try {

        await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true })
    } catch (error) {
        console.log('logOutError', error)
    }
}