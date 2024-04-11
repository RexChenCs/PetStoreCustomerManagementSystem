//////////////////////////////////////////////////////////---------LOGIN/REGISTER---------/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

function login() {
    var email = document.getElementById("signin_email").value;
    var password = document.getElementById("signin_psw").value;

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {

            return firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    Toast.fire({
                        icon: "success",
                        title: "Signed In successfully"
                    }).then(() => {
                        Swal.fire({
                            title: "Sign In",
                            text: 'You sign in successfully ',
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        }).then(function () {
                            window.location.href = authDomain + "/layouts/home.html";
                        });

                    });
                })
                .catch(function (error) {
                    var errorMessage = error.message;
                    if (isValidJSON(errorMessage)) {
                        errorMessage = JSON.parse(errorMessage).error.message;
                        if (errorMessage == 'INVALID_LOGIN_CREDENTIALS') {
                            errorMessage = 'The password is invalid or the user does not have a password.'
                        }

                    }
                    Swal.fire({
                        icon: "error",
                        html: '<i class="fas fa-exclamation-circle" style="color:red"></i>Invalid Email or Password',
                        showConfirmButton: false,
                        footer: 'Details: ' + errorMessage
                    });

                });
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            Swal.fire({
                title: "Error!",
                text: errorCode + ":" + errorMessage,
                icon: "error"
            });
        });

}

function isAdmin(id) {
    var isAdminRole = window.sessionStorage.getItem('isAdminRole');
    var userEmail = window.sessionStorage.getItem('userEmail');
    document.getElementById("userEmail").innerHTML = userEmail;
    if (isAdminRole === "true") {
        document.getElementById(id).style.display = "block";
    } else {
        document.getElementById(id).style.display = "none";
    }
}

function signout() {
    Toast.fire({
        icon: "success",
        title: "Signed out successfully"
    }).then(() => {
        firebase.auth().signOut().then(function () {
            Swal.fire({
                title: "Sign Out",
                text: 'You sign out successfully ',
                icon: "success"
            });
        }).catch(function (error) {
            var errorMessage = error.message;
            Swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error"
            });
        });
    });
}


firebase.auth().onAuthStateChanged(function (user) {
    if (user === null && (window.location == authDomain + "/layouts/home.html" ||
        window.location == authDomain + "/layouts/transactionreview.html" ||
        window.location == authDomain + "/layouts/membermanagement.html" ||
        window.location == authDomain + "/layouts/export.html" ||
        window.location == authDomain + "/layouts/admin.html")) {

        window.location.href = authDomain + "/index.html";

    } else if (window.location == authDomain + "/layouts/home.html" ||
        window.location == authDomain + "/layouts/transactionreview.html" ||
        window.location == authDomain + "/layouts/membermanagement.html" ||
        window.location == authDomain + "/layouts/export.html" ||
        window.location == authDomain + "/layouts/admin.html") {
        firebase.database().ref('users/' + user.uid).on('value', function (snapshot) {
            if (snapshot.exists()) {
                var isAdmin = snapshot.child('isAdmin').val();
                var email = snapshot.child('email').val();
                window.sessionStorage.setItem("isAdminRole", isAdmin);
                window.sessionStorage.setItem("userEmail", email);
                document.getElementById("adminsection").style.display = "block";
                if (isAdmin === "false" && window.location == authDomain + "/layouts/admin.html") {
                    window.location.href = authDomain + "/layouts/home.html";
                    document.getElementById("adminsection").style.display = "none";
                }
            } else {
                if (window.location == authDomain + "/layouts/admin.html") {
                    window.location.href = authDomain + "/layouts/home.html";
                }
                document.getElementById("adminsection").style.display = "none";
            }
            //initial the setting right after login
            var isAdminRole = window.sessionStorage.getItem('isAdminRole');
            var userEmail = window.sessionStorage.getItem('userEmail');
            document.getElementById("userEmail").innerHTML = userEmail;
            if (isAdminRole === "true") {
                document.getElementById("adminsection").style.display = "block";
            } else {
                document.getElementById("adminsection").style.display = "none";
            }
        });
    }
});

function sendEmail(message) {
    firebase.database().ref('emailNoticeConfig/').on("value", function (snapshot) {
        var publicKey = snapshot.child('publicKey').val();
        emailjs.init(publicKey);
        var serviceId = snapshot.child('serviceId').val();
        var templateId = snapshot.child('templateId').val();
        var toName = snapshot.child('toName').val();
        var fromName = snapshot.child('fromName').val();
        var replyTo = snapshot.child('replyTo').val();
        emailjs.send(serviceId, templateId, {
            to_name: toName,
            from_name: fromName,
            message: message,
            reply_to: replyTo,
        });
    });
}


function memberInfoLookUpTable(memberId) {
    var memberInfo = firebase.database().ref('members/' + memberId);
    return memberInfo.once('value').then(snapshot => {
        let memberInfoJson = null;
        if (!snapshot.exists()) {
            Swal.fire("错误提醒", "查询的会员账号不存在", "error");
        } else {
            memberInfoJson = memberInfoConvertor(snapshot);
        }
        return memberInfoJson;
    });

}


function memberPhoneLookUpTable(phoneNumber) {

    var memberInfo = firebase.database().ref('members/');
    return memberInfo.orderByChild('memberPhone').equalTo(phoneNumber).once("value").then(snapshot => {
        var isExistPhoneNumber = false;
        snapshot.forEach(function (data) {
            if (data.child('memberPhone').val() == phoneNumber) {
                isExistPhoneNumber = true;
            }
        });
        return isExistPhoneNumber;
    });

}

function userEmailLookUpTable(email) {
    return firebase.database().ref('users/').orderByChild('email').equalTo(email).once("value").then(snapshot => {
        var uid;
        snapshot.forEach(function (data) {
            if (data.child('email').val() == email) {
                uid = data.key;
            }
        });
        return uid;
    });
}

function transactionInfoLookUpTable(transactionId) {
    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
    return transactionInfo.once('value').then(snapshot => {
        let transactionInfoJson = null;
        if (!snapshot.exists()) {
            Swal.fire("错误提醒", "查询的交易号不存在", "error");
        } else {
            var transactionId = snapshot.key;
            var transactionAmount = snapshot.child("amount").val();
            var transactionDate = snapshot.child("date").val();
            var transactionDiscountRate = snapshot.child("discountRate").val();
            var transactionEmployeeId = snapshot.child("employeeId").val();
            var transactionMemberId = snapshot.child("memberId").val();
            var transactionNote = snapshot.child("note").val();
            var transactionStatus = snapshot.child("status").val();
            var transactionType = snapshot.child("type").val();
            var transactioRemainingBalance = snapshot.child("memberRemainingBalance").val();

            transactionInfoJson = '{ "id":"' + transactionId + '",'
                + '"amount":"' + transactionAmount + '",'
                + '"date":"' + transactionDate + '",'
                + '"discountRate":"' + transactionDiscountRate + '",'
                + '"employeeId":"' + transactionEmployeeId + '",'
                + '"memberId":"' + transactionMemberId + '",'
                + '"note":"' + transactionNote + '",'
                + '"status":"' + transactionStatus + '",'
                + '"type":"' + transactionType + '",'
                + '"remainingBalance":"' + transactioRemainingBalance + '"'
                + '}';
        }
        return JSON.parse(transactionInfoJson);
    });
}

function memberInfoConvertor(snapshot){
    var memberId = snapshot.key;
    var memberName = snapshot.child("memberName").val();
    var memberPetName = snapshot.child("memberPetName").val();
    var memberPhone = snapshot.child("memberPhone").val();
    var memberDiscountRate = snapshot.child("memberDiscountRate").val();
    var memberBalance = snapshot.child("memberBalance").val();
    var employee = snapshot.child("employee").val();
    var memberJoinDate = snapshot.child("memberJoinDate").val();
    var memberPetBreed = snapshot.child("memberPetBreed").val();
    var memberPetGender = snapshot.child("memberPetGender").val();
    var note = snapshot.child("note").val();
    var memberInfoJson = '{ "memberId":"' + memberId + '",'
        + '"memberName":"' + memberName + '",'
        + '"memberPetName":"' + memberPetName + '",'
        + '"memberPhone":"' + memberPhone + '",'
        + '"memberDiscountRate":"' + memberDiscountRate + '",'
        + '"employee":"' + employee + '",'
        + '"memberJoinDate":"' + memberJoinDate + '",'
        + '"memberPetBreed":"' + memberPetBreed + '",'
        + '"memberPetGender":"' + memberPetGender + '",'
        + '"note":"' + note + '",'
        + '"memberBalance":"' + memberBalance + '"'
        + '}';

    return JSON.parse(memberInfoJson);
}


function calDiscountRate(loadingAmount, elementId) {
    discountRateInfoLookUpTable(loadingAmount).then(function(discountRate){
        var settingInfo = firebase.database().ref('setting/');
        settingInfo.on("value", function (snapshot) {
            var isEnable = snapshot.child('discountRateAutoApply').val();
            if (isEnable) {
                document.getElementById(elementId).value = discountRate;
            }
        });
    });
}


function discountRateInfoLookUpTable(loadingAmount) {
    loadingAmount = Number(loadingAmount);
    var discountInfo = firebase.database().ref('discounts/');
    return discountInfo.orderByChild('value').equalTo(loadingAmount).once("value").then(snapshot => {
        var rate = 1;
        snapshot.forEach(function (data) {
            if (data.child('value').val() === loadingAmount) {
                rate = data.child('rate').val();
            }
        });
        return Number(rate);
    });
}