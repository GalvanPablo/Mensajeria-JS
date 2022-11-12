function stringNulo(cadena){
    return cadena === "" || cadena.trim() === "" || cadena == null;
}

function idInvalido(id){
    id = parseInt(id)
    if(id.toString() === "NaN"){
        return true;
    }else if (id <= 0){
        return true;
    }
    return false;
}

class Usuario{
    constructor(idUsuario, nombre, apellido, mail, passwd, img){
        if(idInvalido(idUsuario)){
            throw new Error("Error al crear el usuario");
        }
        this.idUsuario = idUsuario; // Validado a nivel listado
        
        if(stringNulo(nombre)){
            throw new Error("El nombre no puede ser nulo");
        }
        this.nombre = nombre;  // !nulo

        if(stringNulo(apellido)){
            throw new Error("El nombre no puede ser nulo");
        }
        this.apellido = apellido;  // !nulo

        const emailMask = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        if (!emailMask.test(mail)) {
            throw new Error("Mail incorreto");
        }
        this.mail = mail;  // !nulo y con formato ejemplo@correo.com

        if(stringNulo(passwd)){
            throw new Error("La contraseña no puede ser nula");
        }
        this.passwd = passwd;  // !nulo
        this.img = img; // Opcional

        /*  Se que con setters y getters se puede validar incluso cuando se edita atributo por atributo
            pero por mi cuenta no logro entender como se hace correctamente
        */
    }
}

class Mensaje{
    constructor(idMensaje, idOrigen, idDestino, msg){
        if(idInvalido(idMensaje)){
            throw new Error("Error al enviar el mensaje");
        }
        this.idMensaje = idMensaje;
        
        // idDestion != idOrigen
        if(idOrigen === idDestino){
            throw new Error("Id origen y destino no pueden ser iguales");
        }

        if(idInvalido(idOrigen)){
            throw new Error("ID de origen invalido");
        }
        this.idOrigen = idOrigen;   // !nulo

        
        if(idInvalido(idDestino)){
            throw new Error("ID de destino invalido");
        }
        this.idDestino = idDestino; // !nulo

        if(stringNulo(msg)){
            throw new Error("El mensaje no puede ser nulo");
        }
        this.msg = msg; // !nulo
    }
}

class Sistema{
    constructor(){
        this.lstUsuarios = [];
        this.lstMensajes = [];
    }

    // El siguiente cargar usuario va a ser utilizado para luego poder cargar mediante JSON sin interfereir con el ID
    cargarUsuario(idUsuario, nombre, apellido, mail, passwd, img){
        const longitud = this.lstUsuarios.length;
        const usuarioExistente = this.lstUsuarios.some((usuario) => usuario.idUsuario === idUsuario);
        const emailUtilizado = this.lstUsuarios.some((usuario) => usuario.mail === mail);
        if(usuarioExistente){
            throw new Error("Error al crear usuario");  // El id de usuario no se encuentra disponible
        }
        if(emailUtilizado){
            throw new Error("Usuario existente");   // Ya existe un usuario con dicho mail
        }
        this.lstUsuarios.push(new Usuario(idUsuario, nombre, apellido, mail, passwd, img));
        if(this.lstUsuarios.length === longitud+1){ // Verificar si se agrego o no el usuario
            return true;   // 
        }
        return ;
    }

    // La funcion de nuevo usuario simplemente crea usuarios con un id autoincremental
    // Cuando se registra un nuevo usuario se llama a la siguiente funcion para crearlo
    nuevoUsuario(nombre, apellido, mail, passwd, img){
        let id = 1;
        if(this.lstUsuarios.length > 0){    // Si ya hay usuarios
            id = this.lstUsuarios[this.lstUsuarios.length - 1].idUsuario + 1;   // Que el ID sea un autoincremental con respecto al ultimo
        }
        return this.cargarUsuario(id, nombre, apellido, mail, passwd, img);
    }

    cargarMensajes(idMensaje, idOrigen, idDestino, msg){
        let longitud = this.lstMensajes.length;
        const mensajeExistente = this.lstMensajes.some((mensaje) => mensaje.idMensaje === idMensaje);
        if(mensajeExistente){
            throw new Error("Mensaje ya existente ID: " + idMensaje);
        }
        this.lstMensajes.push(new Mensaje(idMensaje, idOrigen, idDestino, msg))
        /*  Segun tenia entendido el push devolvia true/false pero no lo hace
            Por eso es que realizo la siguente comprobacion mediante la cantidad de elementos del array
        */
        if(this.lstMensajes.length === longitud+1){
            return true;    // Se añadio
        }
        return false;   // No se añadio
    }

    // La funcion de nuevo mensaje simplemente añade mensajes con un id autoincremental
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

    traerUsuarioPorMail(mail){
        return this.lstUsuarios.find((usuario) => usuario.mail === mail);
    }
    
    traerChat(idUsuario1, idUsuario2){
        /*  Debe devolver un array de los mensajes correspondientes
            No importa quien de los 2 usuarios que intervienen sea origen o destino
            mientras sea un chat entre ellos y solamente ellos esta bien
        */
        return this.lstMensajes.filter((msj) =>
        (msj.idOrigen === idUsuario1 && msj.idDestino === idUsuario2
            || msj.idOrigen === idUsuario2 && msj.idDestino === idUsuario1));
    }

    traerConversaciones(idUsuario){
        //  Devuelve las id de los usuarios que tuvieron algun mensaje con cuya id es igual a la pasada por parametro
        const msgUsuarios = [];
        this.lstMensajes.reverse().forEach((mensaje) =>{
            let id = 0;
            if(mensaje.idOrigen === idUsuario){
                id = mensaje.idDestino;
            }else if(mensaje.idDestino === idUsuario){
                id = mensaje.idOrigen;
            }
            if(id !== 0 && !msgUsuarios.some((msj) => msj.id === id)){
                const msg = mensaje.msg
                msgUsuarios.push({id, msg});
            }
        });
        return msgUsuarios;
    }
}





//localStorage.clear();
let sistema = cargarSistema();
guardarSistema();




// ALMACENAR SISTEMA
function guardarSistema(){
    localStorage.setItem('sistema', JSON.stringify(sistema));
}

function cargarSistema(){
    const sistJSON = localStorage.getItem('sistema');
    //console.log(sistJSON);

    let sist = new Sistema();
    if(sistJSON === undefined || sistJSON === null){
        //console.log("NO Existe");
        // ==================== CARGA DE DATOS ====================
        // Usuarios
        sist.nuevoUsuario("Pablo", "Galvan", "pablogalvan.015@gmail.com", "2002", "https://ath2.unileverservices.com/wp-content/uploads/sites/5/2018/02/acondicionador-de-cabello-para-hombre-e1517521713969.jpg");
        sist.nuevoUsuario("Va", "Lentin", "valentin@correo.com", "1234", "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/11/11/16366277520929.jpg");
        sist.nuevoUsuario("Lautaro", "Caraballo", "lautaro@clarity.com", "elpepe", "https://fotos.perfil.com/2020/09/08/trim/950/534/dia-del-programador-festejo-con-escasez-de-profesionales-1013463.jpg");
        sist.nuevoUsuario("Santiago", "Martinez", "sanMartinEz@gmail.com", "123456", "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp")

        // Conversación entre usuario 1 y 2
        sist.nuevoMensaje(1, 2, "Hola, todo bien?");
        sist.nuevoMensaje(2, 1, "Si, todo tranki");
        sist.nuevoMensaje(1, 2, "Che queres ir el sabado a la plaza?");
        sist.nuevoMensaje(2, 1, "Si porque no");

        // Conversación entre usuario 1 y 3
        sist.nuevoMensaje(1, 3, "Che estas para ds?");
        sist.nuevoMensaje(3, 1, "En 5 me conecto");
        console.log("NUEVO SISTEMA CARGADO");
    }else{
        //console.log("Existe");
        const datos = JSON.parse(sistJSON); 
        datos.lstUsuarios.forEach((usuario) => sist.cargarUsuario(usuario.idUsuario, usuario.nombre, usuario.apellido, usuario.mail, usuario.passwd, usuario.img));
        datos.lstMensajes.forEach((mensaje) => sist.cargarMensajes(mensaje.idMensaje, mensaje.idOrigen, mensaje.idDestino, mensaje.msg));
        console.log("VIEJO SISTEMA CARGADO");
        console.log(sist);
    }
    return sist;
}