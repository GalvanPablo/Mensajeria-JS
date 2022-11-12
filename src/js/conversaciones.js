sessionStorage.removeItem('idUsuarioChat');
const usuarioLogueado = sistema.traerUsuarioPorId(parseInt(sessionStorage.getItem('idUsuarioLogueado')));

if(usuarioLogueado === undefined){
    alert("Error al iniciar sesión");
    window.location.href = "login.html";
}

const usuario_img = document.querySelector('#user-img');
usuario_img.setAttribute('src', usuarioLogueado.img);
const usuario_nombre = document.querySelector('#user-name');
usuario_nombre.innerText = usuarioLogueado.nombre + " " + usuarioLogueado.apellido;
mostrarConversaciones();

// CERRAR SESION
document.querySelector('#btn_cerrarSesion').onclick = (e) =>{
    //alert("Cerrando sesion");
    sessionStorage.removeItem('idUsuarioActual');
    window.location.href = "login.html";
}





function mostrarConversaciones(){
    sistema.traerConversaciones(usuarioLogueado.idUsuario).forEach((conversacion) => mostrarConversacion(conversacion.id, conversacion.msg));
}

function mostrarConversacion(idUsuario, msg){
    const conversaciones = document.querySelector('#listadoConversaciones');
    const conv = document.createElement('a');
    //conv.setAttribute('href', `./chat.html`);
    conv.onclick = (e) =>{
        sessionStorage.setItem('idUsuarioChat', idUsuario);
        window.location.href = "chat.html";
    }
    const user = sistema.traerUsuarioPorId(idUsuario);
    conv.innerHTML = `
    <div class="content">
        <img src="${user.img}" alt="">
        <div class="details">
            <span>${user.nombre} ${user.apellido}</span>
            <p>${msg}</p>
        </div>
    </div>
    `;
    //<div class="status-dot online"><i class="bi bi-circle-fill"></i></div>
    conversaciones.append(conv);
}