import axios from 'axios';
import * as Config from './../constants/config';
import qs from 'qs'

const refresh_token = async () => {
  try {
    // console.log("có vô n è refresh_token")
    let payload = {
      client_id: 'xu9BEmYOGSr2jYzWgtRfNzsJGOMAmeLWc4BUVECj',
      refresh_token: localStorage.getItem('refresh_token'),
      grant_type: "refresh_token"
    }
    await axios({
      method: 'POST',
      url: `${Config.API_URL}/o/token/`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(payload),
      timeout:300
    }).then(res => {
      if (res.status === 200) {
        console.log("refresh_token OK")
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('expires_in', res.data.expires_in);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        localStorage.setItem('token_type', res.data.token_type);
        localStorage.setItem('scope', res.data.scope);
      }
      return res
    });
  } catch (err) {
    console.error("apicall -> refresh_token", err.response)
  }
}

export default function callApi(endpoint, method = "GET", body, headers) {

    return axios({
      method: method,
      timeout: 300000,
      headers: {
        ...headers,
        'authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
      },
      url: `${Config.API_URL}/${endpoint}`,
      data: body
    }).catch( async err => {
    if (err.response.status === 401) {
        await refresh_token()
        return axios({
          method: method,
          timeout: 300000,
          headers: {
            ...headers,
            'authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
          },
          url: `${Config.API_URL}/${endpoint}`,
          data: body
        })
    }
    return err
  }).then(re => re)
};