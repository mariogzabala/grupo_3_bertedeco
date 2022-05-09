(function () {
  'use strict'

  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation')
    var wasValidated = true
    var name = forms[0].elements[0]
    var email = forms[0].elements[2]
    var pass = forms[0].elements[3]
    var confPass = forms[0].elements[4]

    const patternEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

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

    // Valida que nombre tenga al menos dos letras
    name.addEventListener('change', function(event) {
      if(name.value.length < 3){
        name.classList.add('is-invalid')
        wasValidated = false
      } else {
        name.classList.remove('is-invalid')
        wasValidated = true
      }

    });
    
    // Valida el email
    email.addEventListener('change', function(event) {
      if(!email.value.toLowerCase().match(patternEmail)){
        email.classList.add('is-invalid')
        wasValidated = false
      } else {
        email.classList.remove('is-invalid')
        wasValidated = true
      }

    });
    
    // Valida los campos de contraseñas
    pass.addEventListener('change', function(event) {
      if (!patternPassword.test(pass.value)){
        pass.classList.add('is-invalid')
        wasValidated = false
      } else {
        pass.classList.remove('is-invalid')
        wasValidated = true
      }
      if (pass.value != confPass.value) {
        confPass.classList.add('is-invalid')
        wasValidated = false
      } else {
        confPass.classList.remove('is-invalid')
        wasValidated = true
      }
    });

    // Valida que las contraseñas coincidan
    confPass.addEventListener('change', function(event) {
      if (pass.value != confPass.value) {
        confPass.classList.add('is-invalid')
        wasValidated = false
      } else {
        confPass.classList.remove('is-invalid')
        wasValidated = true
      }
    });

  }, false)
}())
