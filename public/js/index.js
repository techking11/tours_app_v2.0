/* eslint-disable */

require('@babel/polyfill');
const { displayMap } = require('./mapbox');
const { loginForm } = require('./login.js');
const { logout } = require('./logout.js');
const { updatedSetting } = require('./updateSetting.js');
const { showAlert } = require('./alert.js');
const bcrypt = require('bcryptjs');

const mapbox = document.getElementById('map');
const formHTML = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordChange = document.querySelector('.form-user-settings');

// MapBox
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

// Login Form
if (formHTML) {
  formHTML.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await loginForm(email, password);
  });
}

// Logout User
if (logoutBtn) logoutBtn.addEventListener('click', () => logout());

// A) Update User Settings
async function getUserData() {
  const res = await axios({
    method: 'GET',
    url: '/api/v1/users/me',
  });
  return res.data.data;
}

// B) Update User Data Form
if (userDataForm) {
  userDataForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('photo', document.getElementById('photo').files[0]);

    const name = formData.get('name');
    const email = formData.get('email');
    const photo = formData.get('photo');

    const user = await getUserData();
    if (user.name != name || user.email != email || photo != 'undefined')
      await updatedSetting(formData, 'data');
  });
}

if (userPasswordChange) {
  userPasswordChange.addEventListener('submit', async function (e) {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    const user = await getUserData();
    const trueOrFalse = await bcrypt.compare(passwordCurrent, user.password);
    if (trueOrFalse) {
      await updatedSetting(
        { passwordCurrent, password, passwordConfirm },
        'password',
      );
    } else showAlert('Enter your current password again !', 'danger', 5000);
  });
}
