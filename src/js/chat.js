const usuarioLogueado = sistema.traerUsuarioPorId(parseInt(sessionStorage.getItem('idUsuarioLogueado')));
const idUsuarioChat = parseInt(sessionStorage.getItem('idUsuarioChat'));
console.log(idUsuarioChat)
if(usuarioLogueado === undefined){
    alert("Error al iniciar sesión");
    window.location.href = "login.html";
}
if(idUsuarioChat === "NaN"){
    alert("Error al abrir el chat");
    window.location.href = "conversaciones.html";
}


// Mostrar imagen de perfil
const chat_img = document.querySelector('#perfil-img');
chat_img.setAttribute('src', sistema.traerUsuarioPorId(idUsuarioChat).img);
// Mostrar nombre de perfil
const chat_nombre = document.querySelector('#perfil-nombre');
chat_nombre.innerText = sistema.traerUsuarioPorId(idUsuarioChat).nombre + " " + sistema.traerUsuarioPorId(idUsuarioChat).apellido;
// Mostrar mensajes en el chat
mostrarChat();


// ==================== FUNCIONES ====================
function mostrarMensaje(idUsuarioActual, obj_msg){
    let tipo = "";
    if(idUsuarioActual === obj_msg.idOrigen && idUsuarioActual !== obj_msg.idDestino){
        tipo = "outgoing";
    }else{
        tipo = "incoming";
    }
    
    const chat = document.querySelector('#chat-box');
    const message = document.createElement('div');
    message.setAttribute('class', `chat ${tipo}`);
    switch(tipo){
        case "outgoing":
            message.innerHTML =`<div class="details">
                                    <p>${obj_msg.msg}</p>
                                </div>`;
        break;
        case "incoming":
            message.innerHTML =`<img src="${sistema.traerUsuarioPorId(obj_msg.idOrigen).img}" alt="">
                                <div class="details">    
                                    <p>${obj_msg.msg}</p>
                                </div>`;
        break;
        default:
            return false;
    }
    chat.append(message);
    return true;
}

function mostrarChat(){
    // Muestra la conversacion entre el usuario logeado y otro usuario
    if(usuarioLogueado.idUsuario === idUsuarioChat){
        throw new Error("No puede haber un chat que sea solo de 1 usuario");
    }
    // console.log("Usuario actual: " + usuarioLogueado.idUsuarioChat);
    // console.log("Otro usuario: " + idUsuarioChat);
    const chat = sistema.traerChat(usuarioLogueado.idUsuario, idUsuarioChat);
    //console.log(chat);
    if(chat.length > 0){
        const contenedor = document.getElementById('chat-box');
        contenedor.innerHTML = "";
        chat.forEach((msj) => mostrarMensaje(usuarioLogueado.idUsuario, msj));
    }else{
        console.log("NO EXISTEN MENSAJES");
    }
}



// ENTER EN EL CHAT
const txt_msg = document.querySelector('#txt_msg');
txt_msg.onkeydown = (e) =>{
    if(e.key == "Enter"){
        enviarMensaje();
    }
}

/*
// BTN ENVIAR
const btn_enviar = document.querySelector('#btn_enviar');
btn_enviar.onclick = enviarMensaje();
*/

function enviarMensaje(){
    sistema.nuevoMensaje(usuarioLogueado.idUsuario, idUsuarioChat, txt_msg.value.toString());
    txt_msg.value = "";
    mostrarChat();
    guardarSistema();
}

const form_mensaje = document.querySelector('#form_mensaje');
form_mensaje.onsubmit = (e) => {
    e.preventDefault();
}

/*
const form_mensaje = document.querySelector('#form_mensaje')
form_mensaje.onsubmit = (e) =>{
    e.preventDefault();
    const txt_msg = Array.from(e.target.children)[1];
    sistema.nuevoMensaje(usuarioLogueado.idUsuario, idUsuarioChat, txt_msg.value);
    mostrarChat();
    txt_msg.value = "";
}
*/

