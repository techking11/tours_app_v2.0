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
      location.reload(true);
    }
  } catch (err) {
    console.log(err);
    showAlert(err.message, 'danger', 5000);
  }
};
