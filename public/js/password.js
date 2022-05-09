(function () {
  'use strict'

  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation')
    var wasValidated = true
    var oldPass = forms[0].elements[0]
    var newPass = forms[0].elements[1]
    var confPass = forms[0].elements[2]

    const patternPassword =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false || !wasValidated) {
          event.preventDefault()
          event.stopPropagation()
        }
          form.classList.add('was-validated')
      }, false)
    })

    // Valida que antigua y nueva contraseña sean diferentes
    oldPass.addEventListener('change', function(event){
      if(oldPass.value == newPass.value){
        oldPass.classList.add('is-invalid')
        wasValidated = false
      } else{
        oldPass.classList.remove('is-invalid')
        wasValidated = true
      }
    });
    
    // Valida antigua y nueva contraseñas
    newPass.addEventListener('change', function(event) {
      if (!patternPassword.test(newPass.value)){
        newPass.classList.add('is-invalid')
        wasValidated = false
      } else {
        newPass.classList.remove('is-invalid')
        wasValidated = true
      }
      if(oldPass.value == newPass.value){
        oldPass.classList.add('is-invalid')
        wasValidated = false
      } else{
        oldPass.classList.remove('is-invalid')
        wasValidated = true
      }
      if (newPass.value != confPass.value) {
        confPass.classList.add('is-invalid')
        wasValidated = false
      } else {
        confPass.classList.remove('is-invalid')
        wasValidated = true
      }
    });

    // Valida que nueva y confirmar coincidan
    confPass.addEventListener('change', function(event) {
      if (newPass.value != confPass.value) {
        confPass.classList.add('is-invalid')
        wasValidated = false
      } else {
        confPass.classList.remove('is-invalid')
        wasValidated = true
      }
    });

  }, false)
}())
