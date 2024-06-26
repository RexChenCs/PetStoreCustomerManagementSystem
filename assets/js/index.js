$(document).ready(function () {
  const passwordField = document.getElementById("signin_psw");
  const togglePassword = document.querySelector(".password-toggle-icon i");

  togglePassword.addEventListener("click", function () {
    if (passwordField.type === "password") {
      passwordField.type = "text";
      togglePassword.classList.remove("fa-eye");
      togglePassword.classList.add("fa-eye-slash");
    } else {
      passwordField.type = "password";
      togglePassword.classList.remove("fa-eye-slash");
      togglePassword.classList.add("fa-eye");
    }
  });

  $(document).on('keypress', 'input,select', function (e) {
    if (e.which == 13) {
      e.preventDefault();
      var $next = $('[tabIndex=' + (+this.tabIndex + 1) + ']');
      if (!$next.length) {
        login();
      }
      $next.focus().click();
    }
  });

});
