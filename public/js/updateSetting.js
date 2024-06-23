/* eslint-disable */

const { showAlert } = require('./alert');

exports.updatedSetting = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update-me',
      data: { name, email },
    });

    if (res.data.status === 'success') {
      showAlert('Updated Successfully !', 'success', 5000);
      window.setTimeout(() => {
        location.assign('/me');
      }, 2000);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'danger', 5000);
  }
};
