let menuElements = document.querySelectorAll('.nav-item-link');
let blackoutForm = document.getElementById('blackout');
let addReqForm = document.getElementById('form');
let addReqButton = document.getElementById('add_request');

const fileUpload = document.querySelector('#file-upload');
const fileUploadLabel = document.querySelector('.custom-file-upload');
const fileUploadLabelText = document.querySelector('.custom-file-upload p');

var form = document.querySelector('form');

fileUpload.addEventListener('change', () => {
    if (fileUpload.files.length > 0) {
      const fileName = fileUpload.files[0].name;
      fileUploadLabelText.textContent = fileName;
    }
});

addReqButton.addEventListener('click', () => {
    blackoutForm.style.display = 'block';
    addReqForm.style.display = 'block';
    var text = form.querySelector('.form-text');
    text.innerHTML = 'Загрузите документ в формате<br> <b>.pdf</b> или <b>.doc</b>';
});


blackoutForm.onclick = () => {
    blackoutForm.style.display = 'none';
    addReqForm.style.display = 'none';
};

menuElements.forEach(element => {
    element.addEventListener('click', () => {
        menuElements.forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    });
});


form.addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(form);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload_file');
    xhr.send(formData);
    xhr.onload = function() {
        var jsonText = JSON.parse(xhr.responseText);
        if (jsonText['status'] === "Success") {
            var text = form.querySelector('.form-text');
            text.innerHTML = `Файл <b>${jsonText["filename"]}</b> был успешно отправлен`;
        } 
        else if (jsonText['status'] === "EmptyFile"){
            var text = form.querySelector('.form-text');
            text.innerHTML = `<font color='red'>Вы не выбрали файл, либо он оказался пустым</font>`;
        }
        else if (jsonText['status'] === "TooMuch"){
            var text = form.querySelector('.form-text');
            text.innerHTML = `<font color='red'>Файл <b>${jsonText["filename"]}</b> превышает допустимый размер</font>`;
        }
        form.reset();
    };
});