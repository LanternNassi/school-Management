
import axios from "axios";


const Custom_Axios = () => axios.create({
    baseURL: "http://localhost:5035/api",
    timeout: 100000,
    headers : {
        Authorization : "Bearer " 
    }
});


export default Custom_Axios
