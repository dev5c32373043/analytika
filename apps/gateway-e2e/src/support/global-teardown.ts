import axios from 'axios';

module.exports = async () => {
  // Removing all data that was created during the test run.
  await axios.delete('http://localhost:3000/api/cleanup');
};
