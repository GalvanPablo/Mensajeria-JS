function stringNulo(cadena){
    // Retorna true si la cadena es nula
    return cadena === "" || cadena.trim() === "" || cadena == null;
}

function idInvalido(id){
    // Verifica si el id es un numero y que este sea mayor a 0
    // Devuelve true si el id es invalido
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
        this.idUsuario = idUsuario; // Validado a nivel de listado (no repetidos)
        
        if(stringNulo(nombre)){
            throw new Error("El nombre no puede ser nulo");
        }
        this.nombre = nombre;  // !nulo

        if(stringNulo(apellido)){
            throw new Error("El nombre no puede ser nulo");
        }
        this.apellido = apellido;  // !nulo

        const emailMask = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i; // Mascara del formato de correo
        if (!emailMask.test(mail)) {
            throw new Error("Mail incorreto");
        }
        this.mail = mail;  // !nulo y con formato ejemplo@correo.com

        if(stringNulo(passwd)){
            throw new Error("La contraseña no puede ser nula");
        }
        this.passwd = passwd;  // !nulo
        this.img = img; // Opcional
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
            throw new Error("El mail ingresado ya pertenece a un usuario");   // Ya existe un usuario con dicho mail
        }
        this.lstUsuarios.push(new Usuario(idUsuario, nombre, apellido, mail, passwd, img));
        return (this.lstUsuarios.length === longitud+1) // Verificar si se agrego o no el usuario
    }

    // La funcion de nuevo usuario simplemente crea usuarios con un id autoincremental
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
        /*  Devuelve las id de los usuarios que tuvieron algun mensaje con cuya id es igual a la pasada por parametro
            Ya sea que emisor o receptor de los mensajes
        */
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




/*  La siguiente linea de codigo es usada para resetear lo almacenado en el storage
    La descomento, refresco la pagina, y la vuelvo a comentar
    Asi puedo eliminar lo que se haya guardado en el sistema
*/
//localStorage.clear();
// let sistema = cargarSistema();
let sistema = cargarSistema();
guardarSistema();




// ALMACENAR SISTEMA
function guardarSistema(){
    localStorage.setItem('sistema', JSON.stringify(sistema));
}



function cargarSistema(){
    /*  Que hace esta funcion:
        Es la encargada de verificar si en el localStorage hay datos cargados.
        Si los hay los toma de ahí
        Si no los hay los genera y los guarda
    */
    const sistJSON = localStorage.getItem('sistema'); // Intento obtener los datos del storage

    let sist = new Sistema(); // Creo el sistema
    if(sistJSON === undefined || sistJSON === null){    // Si no encuntro datos en el storage
        // PRE-CARGO LOS DATOS DESDE ARCHIVO JSON (Simulando una API)
        cargarUsuarios(sist);
        cargarMensajes(sist);

    }else{ // Si ya existen datos en el storage
        const datos = JSON.parse(sistJSON); 
        // Paso los datos a un objeto
        // Esto lo hago listado por listado ya que tengo que hacer uso del constructor de Usuario y Mensaje para luego poder usar sus metodos
        datos.lstUsuarios.forEach((usuario) => sist.cargarUsuario(usuario.idUsuario, usuario.nombre, usuario.apellido, usuario.mail, usuario.passwd, usuario.img)); // Cargo todos los usuarios en el sistema
        datos.lstMensajes.forEach((mensaje) => sist.cargarMensajes(mensaje.idMensaje, mensaje.idOrigen, mensaje.idDestino, mensaje.msg));   // Cargo todos los mensajes en el sistema
        //console.log("VIEJO SISTEMA CARGADO");
        //console.log(sist);
    }
    return sist; // Devuelvo el sistema con los datos cargados
}


async function cargarUsuarios(sist){
    fetch('src/json/usuarios.json')
        .then((response) => response.json())
        .then((usuarios) => {
            usuarios.forEach((usuario) => sist.cargarUsuario(usuario.idUsuario, usuario.nombre, usuario.apellido, usuario.mail, usuario.passwd, usuario.img));  // Cargo todos los usuarios en el sistema
            //console.log("Se cargaron los usuarios");
            guardarSistema();
        })
        .catch((error) =>{
            //console.log("ERROR AL CARGAR LOS USUARIOS");
            //console.log(error);
        })
}

async function cargarMensajes(sist){
    fetch('src/json/mensajes.json')
        .then((response) => response.json())
        .then((mensajes) => {
            mensajes.forEach((mensaje) => sist.cargarMensajes(mensaje.idMensaje, mensaje.idOrigen, mensaje.idDestino, mensaje.msg));   // Cargo todos los mensajes en el sistema
            //console.log("Se cargaron los mensajes")
            guardarSistema();
        })
        .catch((error) =>{
            //console.log("ERROR AL CARGAR LOS USUARIOS");
            //console.log(error);
        })
}