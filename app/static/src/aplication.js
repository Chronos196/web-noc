function acceptOrRejectApp (accept, appId){
    showLoading();
    let xhr = new XMLHttpRequest();
    let projectDecision = document.querySelector('.project_decision');
    if (accept){
        xhr.open('PUT', `/accept_file/${appId}`);
        xhr.send();
        xhr.onload = function() {
            deleteLoading();
            let jsonText = JSON.parse(xhr.responseText);
            if (jsonText['status'] === 'Success'){
                projectDecision.innerHTML = `<h3 style='color:green'>Вы одобрили данный проект</h3>`;
            }
         };
    }
    else{
        xhr.open('DELETE', `/reject_file/${appId}`);
        xhr.send();
        xhr.onload = function() {
            deleteLoading();
            let jsonText = JSON.parse(xhr.responseText);
            if (jsonText['status'] === 'Success'){
                projectDecision.innerHTML = `<h3 style='color:red'>Вы отклонили данный проект</h3>`;
            }
        };
    }
}