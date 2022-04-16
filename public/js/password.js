(function () {
    'use strict'

    window.addEventListener('load', function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation')

      // Loop over them and prevent submission
      Array.prototype.filter.call(forms, function (form) {
        var validity = function (event) {
          // Remove is-invalid if its necessary
          if (forms[0].elements[1].classList.contains('is-invalid')) {
            forms[0].elements[1].classList.remove('is-invalid')
          }
          if (forms[0].elements[2].classList.contains('is-invalid')) {
            forms[0].elements[2].classList.remove('is-invalid')
          }
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          // Validate Password and Confirmation
          } if (forms[0].elements[0].value == forms[0].elements[1].value) {
            forms[0].elements[1].classList.add('is-invalid')
            event.preventDefault()
            event.stopPropagation()
          } if (forms[0].elements[1].value != forms[0].elements[2].value) {
            forms[0].elements[2].classList.add('is-invalid')
            event.preventDefault()
            event.stopPropagation()
          }
          form.classList.add('was-validated')
        }
        // Call de validity function when subimt or on change
        form.addEventListener('submit', validity, false);
        form.addEventListener('change', validity, false);
      })
    }, false)

}())
