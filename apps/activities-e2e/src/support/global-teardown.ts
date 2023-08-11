import axios from 'axios';
import { GATEWAY_URL } from '../constants';

module.exports = async () => {
  // Removing all data that was created during the test run.
  await axios.delete(`${GATEWAY_URL}/api/cleanup`);
};
