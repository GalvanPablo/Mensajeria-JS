const usuario_img = document.querySelector('#user-img');
usuario_img.setAttribute('src', usuarioLogueado.img);
const usuario_nombre = document.querySelector('#user-name');
usuario_nombre.innerText = usuarioLogueado.nombre + " " + usuarioLogueado.apellido;

function mostrarConversaciones(){
    const conversaciones = document.querySelector('#users-list');
    const conv = document.createElement('a');
    conv.setAttribute('href', `./chat.html`);
    conv.innerHTML = `
    <div class="content">
        <img src="../images/perfil.png" alt="">
        <div class="details">
            <span>Pablo Galvan</span>
            <p>Ultimo mensaje recibido</p>
        </div>
    </div>
    <div class="status-dot online"><i class="bi bi-circle-fill"></i></div>
    `;
}