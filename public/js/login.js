/* eslint-disable */

const login = async function (email, password) {
  try {
    const res = await axios.post('/api/v1/users/login', {
      email,
      password,
    });
    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
};

document.querySelector('.form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  await login(email, password);
});