(function () {
    'use strict'

    window.addEventListener('load', function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation')
      var wasValidated = true
      var name = forms[0].elements[1]
      var price = forms[0].elements[2]
      var stock = forms[0].elements[3]
      var description = forms[0].elements[6]



      const patternNumber = /^\d+$/;       
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

      // Valida que nombre tenga al menos cinco letras
      name.addEventListener('change', function(event) {
        if(name.value.length < 5){
          name.classList.add('is-invalid')
          wasValidated = false
        } else {
          name.classList.remove('is-invalid')
          wasValidated = true
        }

      });

      // Valida el precio para que sean solo numeros 
      price.addEventListener('change', function(event) {
        if(!price.value.match(patternNumber)){
          price.classList.add('is-invalid')
          wasValidated = false
        } else {
          price.classList.remove('is-invalid')
          wasValidated = true
        }

      });

      // Valida los campos de stock 
      stock.addEventListener('change', function(event) {
        if(!stock.value.match(patternNumber)){
          stock.classList.add('is-invalid')
          wasValidated = false
        } else {
          stock.classList.remove('is-invalid')
          wasValidated = true
        }

      });

      // Valida que los campos de descripción para que sea al menos 20 carácteres
      description.addEventListener('change', function(event) {
        if(description.value.length < 20){
          description.classList.add('is-invalid')
          wasValidated = false
        } else {
          description.classList.remove('is-invalid')
          wasValidated = true
        }

      });

    }, false)
  }())
  