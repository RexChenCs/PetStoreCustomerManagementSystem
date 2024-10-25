$(document).ready(function () {

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

function toggle(){
  const passwordField = document.getElementById("signin_psw");
  const eyeicon = document.getElementById("eye-icon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeicon.src="./assets/images/invisible.png"
  } else {
    passwordField.type = "password";
    eyeicon.src="./assets/images/visible.png"
  }
}