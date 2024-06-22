/* eslint-disable */

require('@babel/polyfill');
const { displayMap } = require('./mapbox');
const { loginForm } = require('./login.js');

const mapbox = document.getElementById('map');
const formHTML = document.querySelector('.form');

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
