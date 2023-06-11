const changedAvatars = `
<h2>Выберите аватар</h2>
<div class="avatar-options">
  <img src="../static/img/default.png" class="avatar-option" alt="Аватар Базовый" width="100px" height="100px" onclick="chooseAvatar(event)">
  <img src="../static/img/avatar1.png" class="avatar-option" alt="Аватар 1" width="100px" height="100px" onclick="chooseAvatar(event)">
  <img src="../static/img/avatar2.png" class="avatar-option" alt="Аватар 2" width="100px" height="100px" onclick="chooseAvatar(event)">
  <img src="../static/img/avatar3.png" class="avatar-option" alt="Аватар 3" width="100px" height="100px" onclick="chooseAvatar(event)">
</div>
<p>Для выбора нажмите на понравившийся аватар<p>
`

const logoutButton = document.querySelector('#logout_button');
const userInfoForm = document.querySelector('.upload-lk-info');
const uploadAvatarButton = document.querySelector('.upload-avatar-image');

logoutButton.addEventListener('click', () => {
  showLoading();
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/auth/jwt/logout');
  xhr.send();
  setTimeout(function() {
    deleteLoading();
    window.location.href = "/noc";
  }, 3000);
});

userInfoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  showLoading();
  const formElements = event.target.elements;
  const changedUserInfo = {};
  avatarSrc = document.querySelector('.lk-profile-icon').getAttribute('src').split('/');
  avatarName = avatarSrc[avatarSrc.length - 1].split('.')[0];
  changedUserInfo['avatar_name'] = avatarName;
  if (formElements.email.value.trim() != "" && formElements.email.value.trim() != formElements.email.getAttribute("placeholder")){
    changedUserInfo['email'] = formElements.email.value;
  }
  if (formElements.name.value.trim() != "" && formElements.name.value.trim() != formElements.name.getAttribute("placeholder")){
    changedUserInfo['name'] = formElements.name.value;
  }
  if (formElements.surname.value.trim() != "" && formElements.surname.value.trim() != formElements.surname.getAttribute("placeholder")){
    changedUserInfo['surname'] = formElements.surname.value;
  }
  if (formElements.password.value.trim() != "" && formElements.password.value.trim() != formElements.password.getAttribute("placeholder")){
    changedUserInfo['password'] = formElements.password.value;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('PATCH', '/users/me');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(changedUserInfo));
  xhr.onload = function() {
    deleteLoading();
    if (xhr.status != 200){
      alert("Изменения не вступили в силу!");
    }
      location.reload();
  };
});

uploadAvatarButton.addEventListener('click', () => {
  blackoutForm.style.display = 'block';
  let mainElement = document.querySelector('main');
  let avatarsBlock = document.createElement('div');
  avatarsBlock.classList.add('show-avatar-options');
  avatarsBlock.innerHTML = changedAvatars;
  mainElement.parentNode.insertBefore(avatarsBlock, mainElement.nextSibling);
});

function chooseAvatar(event){
  blackoutForm.style.display = 'none';
  let avatarsBlock = document.querySelector('.show-avatar-options');
  avatarsBlock.parentNode.removeChild(avatarsBlock);
  document.querySelector('.lk-profile-icon').setAttribute('src', event.target.getAttribute('src'));
}