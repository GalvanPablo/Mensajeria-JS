class Usuario{
    constructor(idUsuario, nombre, apellido, email, password, img){
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.img = img;
    }
}

class Mensaje{
    constructor(idMensaje, idOrigen, idDestino, msg){
        this.idMensaje = idMensaje;
        this.idOrigen = idOrigen;
        this.idDestino = idDestino;
        this.msg = msg;
    }
}

class Sistema{
    constructor(){
        this.lstUsuarios = [];
        this.lstMensajes = [];
    }

    // El siguiente cargar usuario va a ser utilizado para luego poder cargar mediante JSON sin interfereir con el ID
    cargarUsuario(idUsuario, nombre, apellido, email, password, img){
        const longitud = this.lstUsuarios.length;
        const usuarioExistente = this.lstUsuarios.some((usuario) => usuario.idUsuario === idUsuario);
        const emailUtilizado = this.lstUsuarios.some((usuario) => usuario.email === email);
        if(usuarioExistente || emailUtilizado){
            throw new Error("\n\tUsuario existente: " + usuarioExistente + "\n\tEmail ya utilizado: " + emailUtilizado);
        }
        this.lstUsuarios.push(new Usuario(idUsuario, nombre, apellido, email, password, img));
        if(this.lstUsuarios.length === longitud+1){ // Verificar si se agrego o no el usuario
            return true
        }
        return false;
    }

    // Cuando se registra un nuevo usuario se llama a la siguiente funcion para crearlo
    nuevoUsuario(nombre, apellido, email, password, img){
        let id = 1;
        if(this.lstUsuarios.length > 0){    // Si ya hay usuarios
            id = this.lstUsuarios[this.lstUsuarios.length - 1].idUsuario + 1;   // Que el ID sea un autoincremental con respecto al ultimo
        }
        return this.cargarUsuario(id, nombre, apellido, email, password, img);
    }

    cargarMensajes(idMensaje, idOrigen, idDestino, msg){
        let longitud = this.lstMensajes.length;
        const mensajeExistente = this.lstMensajes.some((mensaje) => mensaje.idMensaje === idMensaje);
        const msgInvalido = (msg === "" || msg.trim() === "" || msg === null || msg === undefined);
        if(mensajeExistente || msgInvalido){
            throw new Error("Mensaje ya existente ID: " + idMensaje);
        }
        this.lstMensajes.push(new Mensaje(idMensaje, idOrigen, idDestino, msg))
        if(this.lstMensajes.length === longitud+1){
            return true;
        }
        return false;
    }

    nuevoMensaje(idOrigen, idDestino, msg){
        let id = 1;
        if(this.lstMensajes.length > 0){
            id = this.lstMensajes[this.lstMensajes.length - 1].idMensaje + 1;
        }
        return this.cargarMensajes(id, idOrigen, idDestino, msg);
    }

    traerUsuarioPorId(idUsuario){
        return this.lstUsuarios.find((usuario) => usuario.idUsuario === idUsuario);
    }

    traerUsuarioPorMail(email){
        return this.lstUsuarios.find((usuario) => usuario.email === email);
    }
    
    traerChat(idUsuario1, idUsuario2){
        //  Debe devolver un array de los mensajes correspondientes
        //  No importa quien de los 2 usuarios que intervienen sea origen o destino
        //  mientras sea un chat entre ellos y solamente ellos esta bien
        return this.lstMensajes.filter((msj) =>
        (msj.idOrigen === idUsuario1 && msj.idDestino === idUsuario2
            || msj.idOrigen === idUsuario2 && msj.idDestino === idUsuario1));
    }
}


const sistema = new Sistema();

// ==================== CARGA DE DATOS ====================

// Usuarios
sistema.nuevoUsuario("Pablo", "Galvan", "pablogalvan.015@gmail.com", "2002", "https://ath2.unileverservices.com/wp-content/uploads/sites/5/2018/02/acondicionador-de-cabello-para-hombre-e1517521713969.jpg");
sistema.nuevoUsuario("Va", "Lentin", "valentin@correo.com", "1234", "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/11/11/16366277520929.jpg");
sistema.nuevoUsuario("Lautaro", "Caraballo", "lautaro@clarity.com", "elpepe", "https://fotos.perfil.com/2020/09/08/trim/950/534/dia-del-programador-festejo-con-escasez-de-profesionales-1013463.jpg");

// Conversación entre usuario 1 y 2
sistema.nuevoMensaje(1, 2, "Hola, todo bien?");
sistema.nuevoMensaje(2, 1, "Si, todo tranki");
sistema.nuevoMensaje(1, 2, "Che queres ir el sabado a la plaza?");
sistema.nuevoMensaje(2, 1, "Si porque no");

// Conversación entre usuario 1 y 3
sistema.nuevoMensaje(1, 3, "Che estas para ds?");
sistema.nuevoMensaje(3, 1, "En 5 me conecto");

/*
const txt_nombre = document.getElementById('txt_nombre');
txt_nombre.onkeydown = (e) =>{
    if(e.key === "Enter"){
        console.log("Valor: " + txt_nombre.value);
    }
}
*/

const form_registro = document.querySelector('#form_registro');
if(form_registro != null){
    form_registro.onsubmit = (e) =>{
        e.preventDefault()
        const nombre = document.querySelector('#txt_nombre').value;
        const apellido = document.querySelector('#txt_apellido').value;
        const mail = document.querySelector('#txt_mail').value;
        const passwd = document.querySelector('#txt_passwd').value;
        const urlImg = document.querySelector('#txt_urlImg').value;
        
        if(sistema.nuevoUsuario(nombre, apellido, mail, passwd, urlImg)){
            console.log("Usuario agregado correctamente");
        }else{
            console.log("Error al crear usuario");
        }
    
    
    }
}

// Validar mail
const inputRegistroMail = document.querySelector('#txt_mail');
if(inputRegistroMail != null){
    inputRegistroMail.addEventListener('input', function() {
        campo = event.target;
            
        emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        //Se muestra un texto a modo de ejemplo, luego va a ser un icono
        if (emailRegex.test(campo.value)) {
            console.log("Mail correto")
        } else {
            console.log("Mail incorrecto")
        }
    });
}