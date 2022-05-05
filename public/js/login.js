(function () {
    'use strict'
  
    window.addEventListener('load', function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation')
      var email = forms[0].elements[0]
      var wasValidated = true
  
      const patternEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
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
  
    }, false)
  }())
