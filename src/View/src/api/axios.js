import axios from "axios";

export default axios.create({
    baseURL: 'https://real-time-chat-app-server-6rxf.onrender.com',
    withCredentials: true
});