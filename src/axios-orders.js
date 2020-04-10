import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-49e04.firebaseio.com/'
});

export default instance;