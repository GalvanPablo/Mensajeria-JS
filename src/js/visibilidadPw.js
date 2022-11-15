const pswrdField = document.querySelector(".form input[type='password']"); // Campo de la contraseña
const toggleIcon = document.querySelector(".form .field i"); // Icono de visibilidad

toggleIcon.onclick = () =>{
  // Cuando se haga click alternara si se ve la contraseña o no, a la vez que el icono de visibilidad
  if(pswrdField.type === "password"){
    // Mostrar contraseña
    pswrdField.type = "text";
    toggleIcon.classList.remove("bi-eye");
    toggleIcon.classList.add("bi-eye-slash");
  }else{
    // Ocultar contraseña
    pswrdField.type = "password";
    toggleIcon.classList.add("bi-eye");
    toggleIcon.classList.remove("bi-eye-slash");
  }
}
