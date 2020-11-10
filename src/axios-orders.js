import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://udemy-react-project-465d8.firebaseio.com/'
});

export default instance;