sessionStorage.removeItem('idUsuarioLogueado');   // Limpiar si alguna vez hubo una sesion abierta

const form_registro = document.querySelector('#form_registro');
form_registro.onsubmit = (e) =>{
    e.preventDefault()
    const nombre = document.querySelector('#txt_nombre').value;
    const apellido = document.querySelector('#txt_apellido').value;
    const mail = document.querySelector('#txt_mail').value;
    const passwd = document.querySelector('#txt_passwd').value;
    const urlImg = document.querySelector('#txt_urlImg').value;
    
    /*  Hago uso del try y catch para poder informar al usuario los errores que puede tener al crear un usuario
        Dichos errores son arrojados desde el constructor del Usuario
        Y son verificados aca para poder avisar al usuario que tipo de error se genero
    */
    try {
        if(sistema.nuevoUsuario(nombre, apellido, mail, passwd, urlImg)){
            alert("Se creo el usuario correctamente");
            guardarSistema();
            window.location.href = "./src/pages/login.html";
        }else{
            alert("Error al crear el usuario");
        }
    } catch (error) {
        if(error.toString() == "Error: Mail incorreto"){
            alert(error + `\nPruebe con el formato\n    ejemplo@correo.com`);
        }else{
            alert(error);
        }
    }
}