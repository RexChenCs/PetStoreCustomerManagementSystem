function showPassword() {
    var x = document.getElementById("signin_psw");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }