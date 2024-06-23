/* eslint-disable */

require('@babel/polyfill');
const { displayMap } = require('./mapbox');
const { loginForm } = require('./login.js');
const { logout } = require('./logout.js');

const mapbox = document.getElementById('map');
const formHTML = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

if (formHTML) {
  formHTML.addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await loginForm(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    console.log('I am a logout button 1 !');
    logout();
  });
}
