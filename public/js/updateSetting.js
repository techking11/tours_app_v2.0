/* eslint-disable */

const { showAlert } = require('./alert');

exports.updatedSetting = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/update-password'
        : '/api/v1/users/update-me';

    const res = await axios({ method: 'PATCH', url, data, });

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
