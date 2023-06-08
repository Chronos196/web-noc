const authFormContentReg = `
<form action="/auth/register" method="post" class="reg_form" onsubmit="makeReg(event)">
    <div class="registration_open">
        <button id="reg" class="reg reg_active" type="button" onclick='getRegForm()'>Регистрация</button>
        <button id="open" class="open" type="button" onclick='getAuthForm()'>Вход</button>
    </div>
    <div class="data">
        <p class="initials1">Имя</p>
        <input type = "text" placeholder="введите ваше имя" class="registration_text" name="name" required>
        <p class="initials">Фамилия</p>
        <input type = "text" placeholder="введите фамилию" class="registration_text" name="surname" required >
        <p class= "initials auth-reg-error"></p>
        <p class="initials">Электронная почта</p>
        <input type = "email" placeholder="введите email" class="registration_text" name="email" required >
        <p class="initials">Пароль</p>
        <input type = "password" placeholder="введите пароль" class="registration_text" name="password" required >
    </div>
    <div class="register">
        <button id="create-account" class="register_butn" type="submit">Создать аккаунт</button>
    </div>
    <div class="quest">
        <p class="question">Уже есть аккаунт?</p>
        <button class="press_here" type="button" onclick='getAuthForm()'>Нажмите сюда</button>
    </div>
</form>`

const authFormContentAuth = `
<form action="/auth/jwt/login" method="post" class="auth_form" onsubmit="makeAuth(event)">
    <div class="registration_open">
        <button id="reg" class="reg" type="button" onclick='getRegForm()'>Регистрация</button>
        <button id="open" class="open reg_active" type="button" onclick='getAuthForm()'>Вход</button>
    </div>
    <div class="data">
        <p class= "initials auth-reg-error"></p>
        <p class="initials">Электронная почта</p>
        <input type = "email" placeholder="введите email" class="registration_text" name="username" required >
        <p class="initials">Пароль</p>
        <input type = "password" placeholder="введите пароль" class="registration_text" name="password" required >
    </div>
    <div class="register">
        <button id="create-account" class="auth_butn" type="submit">Войти</button>
    </div>
    <div class="quest">
        <p class="question">Нет аккаунта?</p>
        <button class="press_here" type="button" onclick='getRegForm()'>Нажмите сюда</button>
    </div>
</form>`

let menuElements = document.querySelectorAll('.nav-item-link');
let blackoutForm = document.getElementById('blackout');
let addReqForm = document.getElementById('form');
let addReqButton = document.getElementById('add_request');

let fileUpload = document.querySelector('#file-upload');
let fileUploadLabelText = document.querySelector('.custom-file-upload p');

let form = document.querySelector('.upload_file_noc');

let notAuthForm = document.querySelector(".profile_not_auth");

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
    text.innerHTML = 'Загрузите документ в формате<br> <b>.docx</b>';
});


blackoutForm.onclick = () => {
    blackoutForm.style.display = 'none';
    addReqForm.style.display = 'none';
    let auth_block = document.querySelector('div.auth_block');
    let uniquenessBlock = document.querySelector('.uniqueness_details');
    if (auth_block){
        auth_block.parentNode.removeChild(auth_block);}
    if (uniquenessBlock){
        uniquenessBlock.parentNode.removeChild(uniquenessBlock);}
    else{
    location.reload();}
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
        var text = form.querySelector('.form-text');
        console.log(xhr.responseText);
        if (jsonText['detail'] === "Unauthorized"){
            text.innerHTML = `<font color='red'>Что бы отправить файл, нужно авторизоваться</font>`;
            addReqForm.style.animation = "shake 0.7s 1";
        }
        if (jsonText['status'] === "DirectionEmpty"){
            text.innerHTML = `<font color='red'>В файле <b>${jsonText["filename"]}</b> не указано Направление проекта</font>`;
            addReqForm.style.animation = "shake 0.7s 1";
        }
        if (jsonText['status'] === "InvalidExtension"){
            text.innerHTML = `<font color='red'>Файл <b>${jsonText["filename"]}</b> имеет не верный формат. Необходим формат <b>.docx</b></font>`;
            addReqForm.style.animation = "shake 0.7s 1";
        }
        if (jsonText['status'] === "Success"){
            text.innerHTML = `Файл <b>${jsonText["filename"]}</b> был успешно отправлен`;
        } 
        else if (jsonText['status'] === "EmptyFile"){
            text.innerHTML = `<font color='red'>Вы не выбрали файл, либо он оказался пустым</font>`;
            addReqForm.style.animation = "shake 0.7s 1";
        }
        else if (jsonText['status'] === "TooMuch"){
            text.innerHTML = `<font color='red'>Файл <b>${jsonText["filename"]}</b> превышает допустимый размер</font>`;
            addReqForm.style.animation = "shake 0.7s 1";
        }
        form.reset();
    };
    addReqForm.style.animation = "none";
});

if (notAuthForm){
    let auth_block = document.createElement('div');
    auth_block.classList.add('auth_block');
    notAuthForm.addEventListener('click', (evt) => {
        evt.preventDefault();
        auth_block.style.height = '455px';
        blackoutForm.style.display = 'block';
        let mainElement = document.querySelector('main');
        auth_block.innerHTML = authFormContentReg;
        mainElement.parentNode.insertBefore(auth_block, mainElement.nextSibling);
    });
}

function makeAuth(event){
    event.preventDefault();
    authBlock = document.querySelector('.auth_block');
    authErrorBlock = document.querySelector('.auth-reg-error');
    const data = new URLSearchParams();
    const formElements = event.target.elements;
    data.append('username', formElements.username.value);
    data.append('password', formElements.password.value);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/jwt/login');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    xhr.onload = function() {
        if (xhr.status == 204){
            authErrorBlock.style.display = 'none';
            location.reload();
        }
        else{
            authErrorBlock.style.display = 'block';
            authErrorBlock.textContent = 'Неверная почта или пароль';
            authBlock.style.animation = 'shake 0.7s 1';
        }
    };
    authBlock.style.animation = 'none';
};

function makeReg(event){
    event.preventDefault();
    authBlock = document.querySelector('.auth_block');
    authErrorBlock = document.querySelector('.auth-reg-error');
    const formElements = event.target.elements;
    const regInfo =
    {
        "email" : formElements.email.value,
        "password" : formElements.password.value,
        "name" : formElements.name.value,
        "surname" : formElements.surname.value
    }
    const authData = new URLSearchParams();
    authData.append('username', formElements.email.value);
    authData.append('password', formElements.password.value);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/register');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(regInfo));
    xhr.onload = function() {
       let jsonText = JSON.parse(xhr.responseText);
       switch (xhr.status){
        case 400:
            authErrorBlock.style.display = 'block';
            authErrorBlock.textContent = 'Пользователь с введной почтой уже существует';
            authBlock.style.animation = 'shake 0.7s 1';
            break;
        case 422:
            authErrorBlock.style.display = 'block';
            authErrorBlock.textContent = 'Неверный формат введеной электронной почты';
            authBlock.style.animation = 'shake 0.7s 1';
            break;
        case 201:
            let autReq = new XMLHttpRequest();
            autReq.open('POST', '/auth/jwt/login');
            autReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            autReq.send(authData);
            autReq.onload = function() {
                if (autReq.status == 204){
                    authErrorBlock.style.display = 'none';
                    location.reload();
                }
            };
       }
    };
    authBlock.style.animation = 'none';
};

function getRegForm () {
    let auth_block = document.querySelector('.auth_block');
    auth_block.style.height = '465px';
    auth_block.innerHTML = authFormContentReg;
};

function getAuthForm () {
    let auth_block = document.querySelector('.auth_block');
    auth_block.style.height = '330px';
    auth_block.innerHTML = authFormContentAuth;
}