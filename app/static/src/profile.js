const lkImageUpload = document.querySelector('#d-photo');
const lkImageUploadLabel = document.querySelector('.upload-avatar-image');
const lkImageUploadLabelText = document.querySelector('.upload-avatar-image span');
const lkDataChangeButton = document.querySelector('.button-save');

lkImageUpload.addEventListener('change', () => {
    if (lkImageUpload.files.length > 0) {
      const ImageName = lkImageUpload.files[0].name;
      lkImageUploadLabelText.textContent = ImageName;
    }
});