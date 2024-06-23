/* eslint-disable */

const { showAlert } = require('./alert');

exports.logout = async function () {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/logout',
    });
    
    if (res.data.status === 'success') {
      showAlert('Logout Successfully !', 'success', 5000);
      window.setTimeout(() => {
        location.reload(true);
      }, 3000);
    }
  } catch (err) {
    showAlert(err.message, 'danger', 5000);
  }
};
