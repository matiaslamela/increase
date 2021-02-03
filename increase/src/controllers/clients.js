const API = require('../constants/API');
const axios = require('axios').default;
require('dotenv/config');
const increaseToken = process.env.TOKEN;
function getClientInfo(clientId) {
  let url = `${API.baseUrl}${API.client}`
  .replace('clientId', clientId)
  return axios.get(url, {
    headers: {
      'Authorization' : `Bearer ${increaseToken}`
    }
  })
}

module.exports = {
  getClientInfo
}