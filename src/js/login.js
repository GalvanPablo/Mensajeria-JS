sessionStorage.removeItem('idUsuarioLogueado');   // Limpiar si alguna vez hubo una sesion abierta

const form_login = document.querySelector('#form_login');
form_login.onsubmit = (e) =>{
    e.preventDefault();
    const mail = document.querySelector('#txt_mail');
    const passwd = document.querySelector('#txt_passwd');

    const user = sistema.traerUsuarioPorMail(mail.value.toString());

    /*
    console.log(user);
    console.log("Contraseña: " + passwd.value)
    */

    if(user.passwd === passwd.value.toString()){
        //alert("Iniciando sesion");
        sessionStorage.setItem('idUsuarioLogueado', user.idUsuario);
        window.location.href = "conversaciones.html";
    }else{
        alert("Datos incorrectos");
    }
}