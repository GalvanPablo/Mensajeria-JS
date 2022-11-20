sessionStorage.removeItem('idUsuarioLogueado');   // Limpiar si alguna vez hubo una sesion abierta

const form_login = document.querySelector('#form_login');
form_login.onsubmit = (e) =>{
    e.preventDefault();
    const mail = document.querySelector('#txt_mail');
    const passwd = document.querySelector('#txt_passwd');

    const user = sistema.traerUsuarioPorMail(mail.value.toString()); // Obtengo los datos del usuario mediante su mail

    if(user.passwd === passwd.value.toString()){    // Si conincide su contraseña
        sessionStorage.setItem('idUsuarioLogueado', user.idUsuario);    // Se guarda el id del usuario actual
        window.location.href = "conversaciones.html";   // Se redirige a sus conversasiones
    }else{  // Si los datos son incorrectos
        Notiflix.Notify.failure("Datos incorrectos"); // No se puede iniciar sesion
    }
}