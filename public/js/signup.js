/* eslint-disable */

const { showAlert } = require('./alert');

exports.signupForm = async function (name, email, phone, password, passwordConfirm) {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/signup',
      data: { name, email, phone, password, passwordConfirm },
    });

    if (res.data.status === 'success') {
      showAlert('Account Created Successfully', 'success', 5000);
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    console.log(err.response.data.message)
    // showAlert(err.response.data.message, 'danger', 5000);
  }
};
