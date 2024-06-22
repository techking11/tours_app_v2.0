/* eslint-disable */

const { showAlert } = require('./alert');

exports.loginForm = async function (email, password) {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/login',
      data: { email, password }
    });
    
    if (res.data.status === 'success') {
      showAlert('Login Successfully !', 'success', 5000);
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'danger', 5000);
  }
};
