//////////////////////////////////////////////////////////---------LOGIN/REGISTER---------/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
firebase.auth().onAuthStateChanged(function (user) {
    if (user === null && (
        // window.location == authDomain + "/layouts/home.html" ||
        window.location == authDomain + "/layouts/transactionreview.html" ||
        window.location == authDomain + "/layouts/membermanagement.html" ||
        window.location == authDomain + "/layouts/tools.html" ||
        window.location == authDomain + "/layouts/export.html" ||
        window.location == authDomain + "/layouts/admin.html")) {
        window.location.href = authDomain + "/index.html";
    } else if (
        // window.location == authDomain + "/layouts/home.html" ||
        window.location == authDomain + "/layouts/transactionreview.html" ||
        window.location == authDomain + "/layouts/membermanagement.html" ||
        window.location == authDomain + "/layouts/export.html" ||
        window.location == authDomain + "/layouts/tools.html" ||
        window.location == authDomain + "/layouts/admin.html") {
        firebase.database().ref('users/' + user.uid).on('value', function (snapshot) {
            if (snapshot.exists()) {
                var isAdmin = snapshot.child('isAdmin').val();
                var accessForAdminSection = snapshot.child('accessGroup').child('adminSectionForReview').val();
                if ((accessForAdminSection !== "true" && isAdmin !== 'true') && window.location == authDomain + "/layouts/admin.html") {
                    window.location.href = authDomain + "/layouts/membermanagement.html";
                }
            } else {
                if (window.location == authDomain + "/layouts/admin.html") {
                    window.location.href = authDomain + "/layouts/membermanagement.html";
                }
            }
        });
    }
});

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
                    firebase.database().ref('users/' + user.uid).once('value', function (snapshot) {
                        if (snapshot.exists()) {
                            var userSecurityCode = snapshot.child('securityCode').val();
                            Swal.fire({
                                title: "Pls enter security code",
                                input: "text",
                                inputAttributes: {
                                    autocapitalize: "off",
                                    autocomplete: "off"
                                },
                                showCancelButton: true,
                                confirmButtonText: "Enter",
                                showLoaderOnConfirm: true,
                                preConfirm: async (securityCode) => {
                                    if (userSecurityCode === securityCode) {
                                        sessionStorage.setItem("userEmail", email);
                                        var isAdmin = snapshot.child('isAdmin').val();
                                        var isPermited = snapshot.child('accessGroup').child('adminSectionForReview').val();
                                        if (isAdmin === 'true' || isPermited === 'true') {
                                            sessionStorage.setItem("isAdmin", "Y");
                                        } else {
                                            sessionStorage.setItem("isAdmin", "N");
                                        }
                                    } else {
                                        Swal.showValidationMessage(`Login failed: Invalid Security Code`);
                                    }
                                },
                                allowOutsideClick: () => false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Swal.fire({
                                        title: "Sign In",
                                        text: 'Welcome ' + user.email,
                                        iconHtml: '<img src="./assets/images/loginCat.gif">',
                                        customClass: {
                                            icon: 'no-border'
                                        },
                                        showConfirmButton: false,
                                        timer: 1500
                                    }).then(function () {
                                        window.location.href = authDomain + "/layouts/membermanagement.html";
                                    });
                                } else{
                                    firebase.auth().signOut();
                                }
                            });
                        }
                    }).catch(function (error) {
                        var errorMessage = error.message;
                        if (isValidJSON(errorMessage)) {
                            errorMessage = JSON.parse(errorMessage).error.message;
                            if (errorMessage == 'INVALID_LOGIN_CREDENTIALS') {
                                errorMessage = 'The password is invalid or the user does not have a password.'
                            }
                        }
                        Swal.fire({
                            iconHtml: '<img src="./assets/images/error.gif">',
                            customClass: {
                                icon: 'no-border'
                            },
                            html: '<i class="fas fa-exclamation-circle" style="color:red"></i>Invalid Email or Password',
                            showConfirmButton: false,
                            footer: 'Details: ' + errorMessage
                        });
                    });
                })
                .catch(function (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "INVALID_LOGIN_CREDENTIALS",
                        iconHtml: '<img src="./assets/images/error.gif">',
                        customClass: {
                            icon: 'no-border'
                        }
                    });
                });
        });
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
            }).then((result) => {
                window.location.href = authDomain + "/index.html";
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
    return firebase.database().ref('members/' + memberId).once('value').then(snapshot => {
        if (!snapshot.exists()) {
            Swal.fire("错误提醒", "查询的会员账号不存在", "error");
        }
        return snapshot;
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
        if (!snapshot.exists()) {
            Swal.fire("错误提醒", "查询的交易号不存在", "error");
        }
        return snapshot;
    });
}

function calDiscountRate(loadingAmount, elementId) {
    discountRateInfoLookUpTable(loadingAmount).then(function (discountRate) {
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

function checkPermission(permissionType, model) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user === null) {
            Swal.fire({
                title: "No Access",
                text: 'Invalid User',
                icon: "error"
            });
        } else {
            firebase.database().ref('users/' + user.uid).once('value', function (snapshot) {
                if (snapshot.exists()) {
                    var isPermited = snapshot.child('accessGroup').child(permissionType).val();
                    var isAdmin = snapshot.child('isAdmin').val();
                    if (isPermited === 'true' || isAdmin === 'true') {
                        document.getElementById(model).style.display = 'block';
                    } else {
                        document.getElementById(model).style.display = 'none';
                        Swal.fire({
                            title: "No Access",
                            text: 'You dont have access, please request access from admin',
                            icon: "error"
                        });
                    }
                } else {
                    Swal.fire({
                        title: "No Access",
                        text: 'Invalid User',
                        icon: "error"
                    });
                }
            });
        }
    });
}

function goInactiveEnable() {
    firebase.database().ref('setting/').on("value", function (snapshot) {
        var isEnable = snapshot.child('goInactiveEnable').val();
        var timeout = snapshot.child('timeOutInactiveMinute').val();
        if (isEnable) {
            timeOutMinute = Number(timeout);
            setup();
        }
    });
}

function fileInfoLookUpTable(fileName, fileType , petType) {
    var fileRef = 'files/' + fileType + '/' + fileName;
    if(fileType === 'vaccines'){
        fileRef = 'files/' + fileType + '/' + petType + '/' +fileName;
    }
    return firebase.database().ref(fileRef).once('value').then(snapshot => {
        if (snapshot.exists()) {
            Swal.fire("错误提醒", "同文件类型的文件名已存在", "error");
        }
        return snapshot;
    });
}

function uploadFile(fileName, fileType, file, petType) {
    var fileStorageRef = fileType + '/' + fileName;
    if(fileType === 'vaccines'){
        fileStorageRef = fileType + '/' + petType + '/' + fileName;
    }
    var storageRef = firebase.storage().ref();
    storageRef.child(fileStorageRef).put(file);
}

function loadingFile(fileName, petType, fileType) {

    fileName = fileName.replace('&', ' ');
    var fileStorageRef = fileType + '/' + fileName;
    if(fileType === 'vaccines'){
        fileStorageRef = fileType + '/' + petType + '/' + fileName;
    }

    var storageRef = firebase.storage().ref();
    storageRef.child(fileStorageRef).getDownloadURL()
        .then((url) => {
            Swal.fire('备注详情', '<a target="_blank" href="'+url+'">查看文件</a>');
        });
}