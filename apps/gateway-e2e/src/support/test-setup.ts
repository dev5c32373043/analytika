import axios from 'axios';

module.exports = async () => {
  axios.defaults.baseURL = 'http://localhost:3000';
};
