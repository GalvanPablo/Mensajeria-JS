sessionStorage.removeItem('idUsuarioLogueado');   // Limpiar si alguna vez hubo una sesion abierta

const form_registro = document.querySelector('#form_registro');
form_registro.onsubmit = (e) =>{
    e.preventDefault()
    const nombre = document.querySelector('#txt_nombre').value;
    const apellido = document.querySelector('#txt_apellido').value;
    const mail = document.querySelector('#txt_mail').value;
    const passwd = document.querySelector('#txt_passwd').value;
    const urlImg = document.querySelector('#txt_urlImg').value;
    
    try {
        if(sistema.nuevoUsuario(nombre, apellido, mail, passwd, urlImg)){
            alert("Se creo el usuario correctamente");
            //console.log(sistema.lstUsuarios[sistema.lstUsuarios.length-1]);
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