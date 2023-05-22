const lkImageUpload = document.querySelector('#d-photo');
const lkImageUploadLabel = document.querySelector('.upload-avatar-image');
const lkImageUploadLabelText = document.querySelector('.upload-avatar-image span');
const lkDataChangeButton = document.querySelector('.button-save');
const logoutButton = document.querySelector('#logout_button');

lkImageUpload.addEventListener('change', () => {
    if (lkImageUpload.files.length > 0) {
      const ImageName = lkImageUpload.files[0].name;
      lkImageUploadLabelText.textContent = ImageName;
    }
});

logoutButton.addEventListener('click', () => {
  let xhr = new XMLHttpRequest();
  let ghr = new XMLHttpRequest();
  xhr.open('POST', '/auth/jwt/logout');
  xhr.send();
  setTimeout(function() {
    window.location.href = "/statistic";
  }, 3000);
});