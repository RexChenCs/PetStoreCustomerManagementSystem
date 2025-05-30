jQuery(document).ready(function ($) {
    goInactiveEnable();
    $(document).ready(function () {
        setTimeout(function () { navBar(); });
    });
    $(window).on('resize', function () {
        setTimeout(function () { navBar(); }, 500);
    });
    $(".navbar-toggler").click(function () {
        $(".navbar-collapse").slideToggle(300);
        setTimeout(function () { navBar(); });
    });
    
});

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    useGrouping: false,
});

function isNumeric(stringValue) {
    return /^[+-]?\d+(\.\d+)?$/.test(stringValue);
}

function formatPhone(input) {
    var phoneValue = input.val();
    var output;
    output = wrapPhoneNumber(phoneValue);
    input.val(output);
}

function wrapPhoneNumber(phoneValue) {
    var output;
    phoneValue = phoneValue.replace(/[^0-9]/g, '');
    var area = phoneValue.substr(0, 3);
    var pre = phoneValue.substr(3, 3);
    var tel = phoneValue.substr(6, 4);
    if (area.length < 3) {
        output = "(" + area;
    } else if (area.length == 3 && pre.length < 3) {
        output = "(" + area + ")" + " " + pre;
    } else if (area.length == 3 && pre.length == 3) {
        output = "(" + area + ")" + " " + pre + " - " + tel;
    }
    return output;
}

function wrapCurrency(input) {
    var output;
    output = input.val().replace(/[^0-9,.]/g, '');
    input.val(output);
}

function formatCurrency(input) {
    var input_val = input.val();
    input.val(USDollar.format(input_val));
}

function formatCurrencyForNumber(number) {
    return USDollar.format(number);
}

function formatMemberId(input) {
    var input_val = input.val();
    var output = 'PH' + (100000 + Number(input_val));
    input.val(output);
}

function generateNewMemberId() {
    firebase.database().ref('members/').on("value", function (snapshot) {
        var memberBasedId = 100000;
        var memberPrefix = 'PH';
        var newMemberBasedId = memberBasedId + snapshot.numChildren() + 1;
        var newMemberId = memberPrefix + newMemberBasedId;
        document.getElementById('memberId').value = newMemberId;
    })
}

function convertCurrencyToNumber(currencyStr) {
    return Number(currencyStr.replace(/[^0-9.-]+/g, "")).toFixed(2);
}

function generateTransactionId() {
    return 't' + new Date().getTime();
}

const isValidJSON = str => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

const isValidConcurrency = numStr => {
    var regex = /^\$\d+(?:\.\d{0,2})$/;
    return regex.test(numStr)
};


const isValidDiscountRate = numStr => {
    var regex = /(0\.\d{0,2})$/;
    return regex.test(numStr) || Number(numStr) === 1;
};

function wrapDiscountRate(input) {
    var output;
    output = input.val().replace(/[^0-9,.]/g, '');
    if (output.length > 4) {
        output = output.substr(0, 3);
    }
    input.val(output);
}

function textAreaLineControl(text, charlimit) {
    return text.replace('\n', '<br>');
}


function ClearOptionsFastAlt(id) {
    document.getElementById(id).innerHTML = "";
}

function getCurrentNYDate() {
    var currentTZ = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York' });
    var nyDate = currentTZ.format(new Date());
    return new Date(nyDate);
}

let timeOutMinute;
function setup() {
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);
    startTimer();
}

function startTimer() {
    var time = timeOutMinute * 60000; // one section 1000 unit ms
    timeoutID = window.setTimeout(goInactive, time);
}

function resetTimer(e) {
    window.clearTimeout(timeoutID);
    goActive();
}

function goInactive() {
    if (firebase.auth().currentUser != null) {
        alert("Time out: your are no active within " + timeOutMinute + " minus!");
        signout();
    }
}

function goActive() {
    startTimer();
}

function searchCatagoryReselect(sectionType) {
    var catagory = document.getElementById('search_member_catagory_for' + sectionType).value;
    document.getElementById('search_member_value_for' + sectionType).value = "";
    if (catagory == "searchByMemberPhone") {
        document.getElementById('search_member_value_for' + sectionType).placeholder = "Enter Phone Number";
    } else if (catagory == "searchByMemberId") {
        document.getElementById('search_member_value_for' + sectionType).placeholder = "Enter Member Id";
    } else if (catagory == "searchByMemberPetName") {
        document.getElementById('search_member_value_for' + sectionType).placeholder = "Enter Pet Name";
    }
}

function searchMemberByCatagory(sectionType) {
    var searchType = document.getElementById('search_member_catagory_for' + sectionType).value.trim();
    var searchValue = document.getElementById('search_member_value_for' + sectionType).value.trim();
    if (searchValue == null || searchValue == "") {
        Swal.fire("错误提醒", "查询内容不能为空", "warning");
    } else {
        if (searchType == 'searchByMemberId') {
            searchMemberByCatagoryMemberId(searchValue, sectionType);
        }
        else if (searchType == 'searchByMemberPetName') {
            searchMemberByCatagoryPetName(searchValue, sectionType);
        }
        else if (searchType == 'searchByMemberPhone') {
            searchMemberByCatagoryPhoneNumber(searchValue, sectionType);
        }
    }
}

function searchMemberByCatagoryMemberId(memberId, sectionType) {
    memberInfoLookUpTable(memberId).then(function (snapshot) {
        if (!snapshot.exists()) {
            clearContentBySection(sectionType);
        } else {
            buildContentBySection(snapshot, sectionType);
        }
    });
}

function searchMemberByCatagoryPetName(petName, sectionType) {
    firebase.database().ref('members/').once("value").then(snapshot => {
        numberOfSearchedMember = 0;
        var firstChild;
        var htmlContent = "<select id='search_member_mutiple_option_for" + sectionType + "' type='text' class='form-control'><option  selected>请选择(会员号-宠物名字-电话)</option>";
        snapshot.forEach(function (data) {
            if (String(data.child('memberPetName').val()).toUpperCase().includes(String(petName).toUpperCase())) {
                firstChild = data;
                htmlContent += "<option  value='" + data.key + "'>" + data.key + "-" + data.child('memberPetName').val() + "-" + data.child('memberPhone').val() + "</option>";
                numberOfSearchedMember += 1;
            }
        });
        if (numberOfSearchedMember === 0) {
            Swal.fire("错误提醒", "查询的宠物名字： " + petName + " 不存在", "error");
            clearContentBySection(sectionType);
        } else if (numberOfSearchedMember === 1) {
            buildContentBySection(firstChild, sectionType);
        } else {
            htmlContent += "</select>";
            Swal.fire({
                title: "<strong>发现多个会员</strong>",
                icon: "info",
                html: htmlContent,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then((result) => {
                if (result.isConfirmed) {
                    memberIdSearchReselect(sectionType);
                } else {
                    clearContentBySection(sectionType);
                }
            });
        }
    });
}

function searchMemberByCatagoryPhoneNumber(phoneNumber, sectionType) {
    phoneNumber = wrapPhoneNumber(phoneNumber);
    firebase.database().ref('members/').orderByChild('memberPhone').equalTo(phoneNumber).once("value").then(snapshot => {
        numberOfSearchedMember = snapshot.numChildren();
        if (numberOfSearchedMember === 0) {
            Swal.fire("错误提醒", "查询的电话号码： " + phoneNumber + " 不存在", "error");
            clearContentBySection(sectionType);
            return;
        }
        var htmlContent = "<select id='search_member_mutiple_option_for" + sectionType + "' type='text' class='form-control'><option  selected>请选择(会员号-名字)</option>";
        snapshot.forEach(function (data) {
            if (data.child('memberPhone').val() == phoneNumber) {
                if (numberOfSearchedMember === 1) {
                    buildContentBySection(data, sectionType);
                } else {
                    htmlContent += "<option  value='" + data.key + "'>" + data.key + "-" + data.child('memberPetName').val() + "</option>";
                }
            }
        });

        if (numberOfSearchedMember > 1) {
            htmlContent += "</select>";
            Swal.fire({
                title: "<strong>发现多个会员</strong>",
                icon: "info",
                html: htmlContent,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then((result) => {
                if (result.isConfirmed) {
                    memberIdSearchReselect(sectionType);
                }
            });
        }
    });

}

function memberIdSearchReselect(sectionType) {
    var memberId = document.getElementById('search_member_mutiple_option_for' + sectionType).value;
    searchMemberByCatagoryMemberId(memberId, sectionType);
}

function buildContentBySection(memberInfo, sectionType) {
    document.getElementById('memberIdSearchedFor' + sectionType).value = memberInfo.key;
    document.getElementById('memberNameSearchedFor' + sectionType).value = memberInfo.child('memberName').val();
    document.getElementById('memberPetNameSearchedFor' + sectionType).value = memberInfo.child('memberPetName').val();
    document.getElementById('memberPhoneSearchedFor' + sectionType).value = memberInfo.child('memberPhone').val();
    document.getElementById('memberBalanceSearchedFor' + sectionType).value = memberInfo.child('memberBalance').val();
    document.getElementById('memberDiscountRateSearchedFor' + sectionType).value = memberInfo.child('memberDiscountRate').val();
    if (sectionType === 'Search' || sectionType === 'Edit') {
        document.getElementById('memberPetBreedSearchedFor' + sectionType).value = memberInfo.child('memberPetBreed').val();
        var petGenderChinese = '未知';
        if (memberInfo.child('memberPetGender').val() === 'm') {
            petGenderChinese = '男';
        } else if (memberInfo.child('memberPetGender').val() === 'f') {
            petGenderChinese = '女';
        }
        document.getElementById('memberPetGenderSearchedFor' + sectionType).value = memberInfo.child('memberPetGender').val();
        document.getElementById('memberJoinDateSearchedFor' + sectionType).value = memberInfo.child('memberJoinDate').val();
        document.getElementById('employeeSearchedFor' + sectionType).value = memberInfo.child('employee').val();
        document.getElementById('noteSearchedFor' + sectionType).value = memberInfo.child('note').val();
    }
}

function clearContentBySection(sectionType) {
    document.getElementById('memberIdSearchedFor' + sectionType).value = null;
    document.getElementById('memberNameSearchedFor' + sectionType).value = null;
    document.getElementById('memberPetNameSearchedFor' + sectionType).value = null;
    document.getElementById('memberPhoneSearchedFor' + sectionType).value = null;
    document.getElementById('memberBalanceSearchedFor' + sectionType).value = null;
    document.getElementById('memberDiscountRateSearchedFor' + sectionType).value = null;
    if (sectionType == 'Search') {
        document.getElementById('memberPetBreedSearchedFor' + sectionType).value = null;
        document.getElementById('memberPetGenderSearchedFor' + sectionType).value = null;
        document.getElementById('memberJoinDateSearchedFor' + sectionType).value = null;
        document.getElementById('employeeSearchedFor' + sectionType).value = null;
        document.getElementById('noteSearchedFor' + sectionType).value = null;
    }
}

function oldgenerateNavigation(id) {

    var isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin === 'N') {
        $('#navbar').append(`
        <nav class="navbar navbar-default">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand"><img src="../assets/images/logo.png" style="width: 200px; height: 40px" alt="Logo" /></a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav navbar-right">
                        <li id="navHome"><a href="./home.html">Overview</a></li>
                        <li id="navVip"><a href="./membermanagement.html">VIP Management</a></li>
                        <li id="navTrans"><a href="./transactionreview.html">Transaction Review</a></li>
                        <li id="navData"><a href="./export.html">Data Exportation</a></li>
                        <li id="navTools"><a href="./tools.html">Tools</a></li>
                        <li class="login" onclick="signout()" style="width:auto;"><a>Sign Out</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `);

    } else if (isAdmin === 'Y') {
        $('#navbar').append(`
        <nav class="navbar navbar-default">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand"><img src="../assets/images/logo.png" style="width: 200px; height: 40px" alt="Logo" /></a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav navbar-right">
                        <li id="navHome"><a href="./home.html">Overview</a></li>
                        <li id="navVip"><a href="./membermanagement.html">VIP Management</a></li>
                        <li id="navTrans"><a href="./transactionreview.html">Transaction Review</a></li>
                        <li id="navData"><a href="./export.html">Data Exportation</a></li>
                        <li id="navTools"><a href="./tools.html">Tools</a></li>
                        <li id="navAdmin"><a href="./admin.html">Admin</a></li>
                        <li class="login" onclick="signout()" style="width:auto;"><a>Sign Out</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `);

    }

    document.getElementById(id).setAttribute("class", "active");
}


function generateNavigation(id) {
    const userEmail = sessionStorage.getItem("userEmail").split('@');
    var user = userEmail[0];

    var isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin === 'N') {
        $('#navbar').append(`
        <nav class="navbar navbar-expand-custom navbar-mainbg">
                <a class="navbar-brand navbar-logo" href="./home.html"><img src='../assets/images/logo.png' style='height:50px;width: 250px'></a>
                <button class="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars text-white"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ml-auto">
                        <div class="hori-selector"><div class="left"></div><div class="right"></div></div>
                        <li id="navVip" class="nav-item">
                            <a class="nav-link" href="./membermanagement.html">VIP Management</a>
                        </li>
                        <li id="navTrans" class="nav-item">
                            <a class="nav-link" href="./transactionreview.html">Transaction Review</a>
                        </li>                    
                        <li id="navFile" class="nav-item">
                            <a class="nav-link" href="./filemanagement.html">File Management</a>
                        </li>
                        <li id="navTools" class="nav-item">
                            <a class="nav-link" href="./tools.html">Tools</a>
                        </li>
      
                    </ul>
                </div>
                
                <div class="navbar-brand dropdown nav-profile">
                    <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> <i class="fa fa-user"></i>${user}</a>
                    <ul class="dropdown-menu dropdown-menu-lg-right">
                        <li class='navbar-logout'><a  onclick="signout()">Sign Out&nbsp;&nbsp;<i class="fa fa-sign-out"></i></a></li>
                    </ul>
                </div>
    
                
            </nav>
    `);
    } else if (isAdmin === 'Y') {
        $('#navbar').append(`
            <nav class="navbar navbar-expand-custom navbar-mainbg">
                    <a class="navbar-brand navbar-logo" href="./home.html"><img src='../assets/images/logo.png' style='height:50px;width: 250px'></a>
                    <button class="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="fas fa-bars text-white"></i>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ml-auto">
                            <div class="hori-selector"><div class="left"></div><div class="right"></div></div>
                            <li id="navVip" class="nav-item">
                                <a class="nav-link" href="./membermanagement.html">VIP Management</a>
                            </li>
                            <li id="navTrans" class="nav-item">
                                <a class="nav-link" href="./transactionreview.html">Transaction Review</a>
                            </li>                    
                            <li id="navFile" class="nav-item">
                                <a class="nav-link" href="./filemanagement.html">File Management</a>
                            </li>
                            <li id="navTools" class="nav-item">
                                <a class="nav-link" href="./tools.html">Tools</a>
                            </li>
                            <li id="navAdmin" class="nav-item">
                                <a class="nav-link" href="./admin.html">Admin</a>
                            </li>
                        </ul>
                    </div>
                    <div class="navbar-brand dropdown nav-profile">                      
                        <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-user"></i>${user}</a>
                        <ul class="dropdown-menu dropdown-menu-lg-right">
                            <li class='navbar-logout'><a  onclick="signout()">Sign Out&nbsp;&nbsp;<i class="fa fa-sign-out"></i></a></li>
                        </ul>
                    </div>            
                </nav>
        `);
    }
    document.getElementById(id).setAttribute("class", "active");

}
// ---------Responsive-navbar-active-animation-----------
function navBar() {
    var tabsNewAnim = $('#navbarSupportedContent');
    var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
        "top": itemPosNewAnimTop.top + "px",
        "left": itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
    });
    $("#navbarSupportedContent").on("click", "li", function (e) {
        $('#navbarSupportedContent ul li').removeClass("active");
        $(this).addClass('active');
        var activeWidthNewAnimHeight = $(this).innerHeight();
        var activeWidthNewAnimWidth = $(this).innerWidth();
        var itemPosNewAnimTop = $(this).position();
        var itemPosNewAnimLeft = $(this).position();
        $(".hori-selector").css({
            "top": itemPosNewAnimTop.top + "px",
            "left": itemPosNewAnimLeft.left + "px",
            "height": activeWidthNewAnimHeight + "px",
            "width": activeWidthNewAnimWidth + "px"
        });
    });
}


$(document).ready(function () {
    setTimeout(function () { navBar(); });
});
$(window).on('resize', function () {
    setTimeout(function () { navBar(); }, 500);
});
$(".navbar-toggler").click(function () {
    $(".navbar-collapse").slideToggle(300);
    setTimeout(function () { navBar(); });
});



// --------------add active class-on another-page move----------
jQuery(document).ready(function ($) {
    // Get current path and find target link
    var path = window.location.pathname.split("/").pop();

    // Account for home page with empty path
    if (path == '') {
        path = 'index.html';
    }

    var target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
    // Add active class to target link
    target.parent().addClass('active');
});
