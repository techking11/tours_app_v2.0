/* eslint-disable */

let icon = {
  success: `<p class='material-symbols-outlined'>&#10003</p>`,
  danger: `<p class='material-symbols-outlined'>&#10007</p>`,
};

exports.showAlert = function ( message, toastType, duration ) {
  if (!Object.keys(icon).includes(toastType)) toastType = 'info';
  let box = document.createElement('div');
  box.classList.add('toast', `toast-${toastType}`);
  
  box.innerHTML = ` <div class="toast-content-wrapper"> 
    <div class="toast-icon"> ${icon[toastType]}</div> 
    <div class="toast-message">${message}</div> 
    <div class="toast-progress"></div> 
  </div>`;
          
  duration = duration || 5000;
  box.querySelector('.toast-progress').style.animationDuration = `${duration / 1000}s`;
  let toastAlready = document.body.querySelector('.toast');
  if (toastAlready) {
    toastAlready.remove();
  }

  document.body.appendChild(box);
};
