sessionStorage.removeItem('idUsuarioChat'); // Resetear el chat elegido (ya que no esta en dicha pagina)
const usuarioLogueado = sistema.traerUsuarioPorId(parseInt(sessionStorage.getItem('idUsuarioLogueado'))); // Obtiene los datos del usuario logueado

if(usuarioLogueado == undefined || usuarioLogueado == null){ // Si el usuario no esta logueado
    Notiflix.Notify.failure("Error al iniciar sesión"); // Mostrar una alerta
    setTimeout(function(){
        window.location.href = "login.html"; // Redirecciono al login
    }, 1000);
}

// Muestro los datos del usuario
const usuario_img = document.querySelector('#user-img'); // Imagen
usuario_img.setAttribute('src', usuarioLogueado.img);

const usuario_nombre = document.querySelector('#user-name');    // Nombre y apellido
usuario_nombre.innerText = usuarioLogueado.nombre + " " + usuarioLogueado.apellido;

mostrarConversaciones();    // Muestro las conversasiones corrspondientes a el usuario logueado

// CERRAR SESION
document.querySelector('#btn_cerrarSesion').onclick = (e) =>{   // Cuando se haga click en el boton cerrar sesion
    sessionStorage.removeItem('idUsuarioActual');   // Elimino la id del usuario logueado
    window.location.href = "login.html";    // Redirigo al login
}



function mostrarConversaciones(){
    // Carga todas las conversaciones del usuario logueado en el DOM
    sistema.traerConversaciones(usuarioLogueado.idUsuario).forEach((conversacion) => mostrarConversacion(conversacion.id, conversacion.msg));
}

function mostrarConversacion(idUsuario, msg){
    // Accede al DOM y muestra una conversacion
    const conversaciones = document.querySelector('#listadoConversaciones');
    const conv = document.createElement('a');
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
    conversaciones.append(conv);
}