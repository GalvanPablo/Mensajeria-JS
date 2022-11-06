const pswrdField = document.querySelector(".form input[type='password']"),
toggleIcon = document.querySelector(".form .field i");

toggleIcon.onclick = () =>{
  if(pswrdField.type === "password"){
    pswrdField.type = "text";
    toggleIcon.classList.remove("bi-eye");
    toggleIcon.classList.add("bi-eye-slash");
  }else{
    pswrdField.type = "password";
    toggleIcon.classList.add("bi-eye");
    toggleIcon.classList.remove("bi-eye-slash");
  }
}
