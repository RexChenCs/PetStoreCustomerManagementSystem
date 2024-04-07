$(document).ready(function () {

    $("input[type='tel']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            formatPhone($(this));
        }
    });

    $("input[id='memberBalance']").on({
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            if (isNumeric($(this).val())) {
                calDiscountRate($(this).val(), 'memberDiscountRate');
                formatCurrency($(this));
            } else if (!checkValue($(this).val()) && !isValidConcurrency($(this).val())) {
                Swal.fire("错误提醒", "请输入正确数额", "warning");
                $(this).val('');
            }
        }
    });

    $("input[id='add_credit_member_balance']").on({
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            if (isNumeric($(this).val())) {
                calDiscountRate($(this).val(), 'add_credit_discountRate');
                formatCurrency($(this));
            } else if (!checkValue($(this).val()) && !isValidConcurrency($(this).val())) {
                Swal.fire("错误提醒", "请输入正确数额", "warning");
                $(this).val('');
            }
        }
    });

    $("input[id='member_spend_credit_balance_original']").on({
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            var originalAmount = Number($(this).val());
            if (isNumeric($(this).val())) {
                var settingInfo = firebase.database().ref('setting/');
                settingInfo.on("value", function (snapshot) {
                    var isEnable = snapshot.child('discountRateAutoApply').val();
                    if (isEnable) {
                        var discountRate = document.getElementById('memberDiscountRateSearchedForSpend').value;
                        let USDollar = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            useGrouping: false,
                        });
                        document.getElementById('member_spend_credit_balance').value = USDollar.format((originalAmount * Number(discountRate)));
                    }
                });
                formatCurrency($(this));
            } else if (!checkValue($(this).val()) && !isValidConcurrency($(this).val())) {
                Swal.fire("错误提醒", "请输入正确数额", "warning");
                $(this).val('');
            }
        }
    });

    $("input[id='member_spend_credit_balance']").on({
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            if (isNumeric($(this).val())) {
                formatCurrency($(this));
            } else if (!checkValue($(this).val()) && !isValidConcurrency($(this).val())) {
                Swal.fire("错误提醒", "请输入正确数额", "warning");
                $(this).val('');
            }

        }
    });

    $("input[id='search_member_value_forAdd']").on({
        keyup: function () {
            var searchType = document.getElementById('search_member_catagory_forAdd').value;
            if (searchType === 'searchByMemberPhone') {
                formatPhone($(this));
            }
        },
        click: function () {
            var searchType = document.getElementById('search_member_catagory_forAdd').value;
            if (searchType === 'searchByMemberId' || searchType === 'searchByMemberPhone') {
                $(this).val('');
            }
        },
        blur: function () {
            var searchType = document.getElementById('search_member_catagory_forAdd').value;
            if (searchType === 'searchByMemberId') {
                let isNum = /^\d+$/.test($(this).val());
                if (isNum) {
                    formatMemberId($(this));
                }
            }
        },
        keypress: function (event) {
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
                var searchType = document.getElementById('search_member_catagory_forAdd').value;
                if (searchType === 'searchByMemberId') {
                    let isNum = /^\d+$/.test($(this).val());
                    if (isNum) {
                        formatMemberId($(this));
                    }
                }
                // Trigger the search button element with a click
                searchMemberByCatagory('Add');

            }
        }
    });

    $("input[id='search_member_value_forSpend']").on({
        keyup: function () {
            var searchType = document.getElementById('search_member_catagory_forSpend').value;
            if (searchType === 'searchByMemberPhone') {
                formatPhone($(this));
            }
        },
        click: function () {
            var searchType = document.getElementById('search_member_catagory_forSpend').value;
            if (searchType === 'searchByMemberId' || searchType === 'searchByMemberPhone') {
                $(this).val('');
            }
        },
        blur: function () {
            var searchType = document.getElementById('search_member_catagory_forSpend').value;
            if (searchType === 'searchByMemberId') {
                let isNum = /^\d+$/.test($(this).val());
                if (isNum) {
                    formatMemberId($(this));
                }
            }
        },
        keypress: function (event) {
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
                var searchType = document.getElementById('search_member_catagory_forSpend').value;
                if (searchType === 'searchByMemberId') {
                    let isNum = /^\d+$/.test($(this).val());
                    if (isNum) {
                        formatMemberId($(this));
                    }
                }
                // Trigger the search button element with a click
                searchMemberByCatagory('Spend');
            }
        }
    });

    $("input[id='search_member_value_forSearch']").on({
        keyup: function () {
            var searchType = document.getElementById('search_member_catagory_forSearch').value;
            if (searchType === 'searchByMemberPhone') {
                formatPhone($(this));
            }
        },
        click: function () {
            var searchType = document.getElementById('search_member_catagory_forSearch').value;
            if (searchType === 'searchByMemberId' || searchType === 'searchByMemberPhone') {
                $(this).val('');
            }
        },
        blur: function () {
            var searchType = document.getElementById('search_member_catagory_forSearch').value;
            if (searchType === 'searchByMemberId') {
                let isNum = /^\d+$/.test($(this).val());
                if (isNum) {
                    formatMemberId($(this));
                }
            }
        },
        keypress: function (event) {
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the search button element with a click
                var searchType = document.getElementById('search_member_catagory_forSearch').value;
                if (searchType === 'searchByMemberId') {
                    let isNum = /^\d+$/.test($(this).val());
                    if (isNum) {
                        formatMemberId($(this));
                    }
                }
                searchMemberByCatagory('Search');

            }
        }
    });


    $(document).on('keypress', 'input,select', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            var $next = $('[tabIndex=' + (+this.tabIndex + 1) + ']');
            if (!$next.length) {
                $next = $('[tabIndex=1]');
            }
            $next.focus().click();
        }
    });

    var currentTZ = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York' });
    var nyDate = currentTZ.format(new Date());
    document.getElementById('memberJoinDate').valueAsDate = new Date(nyDate);
    document.getElementById('add_credit_date').valueAsDate = new Date(nyDate);
    document.getElementById('spend_credit_date').valueAsDate = new Date(nyDate);
    generateNewMemberId();
    employeeSelectedOptionForMemberManagement();
    discountRateEnable();
    isAdmin("adminsection");
});



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


function findMemberByIdForVIPManagement(searchCategoryType) {

    var memberId = document.getElementById('memberIdSearchingFor' + searchCategoryType).value.trim();
    document.getElementById('memberIdSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberNameSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberPetNameSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberPhoneSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberBalanceSearchedFor' + searchCategoryType).value = null;
    document.getElementById('memberDiscountRateSearchedFor' + searchCategoryType).value = null;

    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请输入会员账号", "warning");
    } else {
        memberInfoLookUpTable(memberId).then(function (result) {
            if (result != null) {
                document.getElementById('memberIdSearchedFor' + searchCategoryType).value = memberId;
                document.getElementById('memberNameSearchedFor' + searchCategoryType).value = result['memberName'];
                document.getElementById('memberPetNameSearchedFor' + searchCategoryType).value = result['memberPetName'];
                document.getElementById('memberPhoneSearchedFor' + searchCategoryType).value = result['memberPhone'];
                document.getElementById('memberBalanceSearchedFor' + searchCategoryType).value = result['memberBalance'];
                document.getElementById('memberDiscountRateSearchedFor' + searchCategoryType).value = result['memberDiscountRate'];
            }
        });
    }
}


function addCreditForMember() {

    var memberId = document.getElementById('memberIdSearchedForAdd').value.trim();
    var creditAmount = convertCurrencyToNumber(document.getElementById('add_credit_member_balance').value.trim());
    var originalDiscountRate = Number(document.getElementById('memberDiscountRateSearchedForAdd').value.trim());

    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请先查询用户信息，确保充值用户正确", "warning");
    } else if (!addCreditValidation()) {
        return;
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }, buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            title: '确定充值?',
            text: "请确定为会员# " + memberId + " :充值 $" + creditAmount,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                var memberId = document.getElementById('memberIdSearchedForAdd').value.trim();
                var memberBalance = document.getElementById('memberBalanceSearchedForAdd').value.trim();
                var addCreditDate = document.getElementById('add_credit_date').value.trim();
                var addCreditEmployee = document.getElementById('add_credit_employeeName').value.trim();
                var newDiscountRate = Number(document.getElementById('add_credit_discountRate').value.trim());

                var addCreditNote = document.getElementById('add_credit_note').value;
                var newBalance = Number(memberBalance) + Number(creditAmount);
                var memberInfo = firebase.database().ref('members/' + memberId);
                memberInfo.update({
                    'memberBalance': newBalance,
                    'memberDiscountRate': newDiscountRate
                });
                const transactionId = generateTransactionId();
                var transactionInfo = firebase.database().ref('transactions/' + transactionId);
                transactionInfo.set({
                    'memberId': memberId,
                    'amount': creditAmount,
                    'discountRate': originalDiscountRate,
                    'memberRemainingBalance': newBalance,
                    'type': 'addCredit',
                    'date': addCreditDate,
                    'employeeId': addCreditEmployee,
                    'status': 'paid',
                    'note': addCreditNote
                });
                var message = "操作类型：充值，会员号：" + memberId + ",金额：" + creditAmount + ",余额:" + newBalance + ",员工：" + addCreditEmployee + ",日期：" + addCreditDate + ",最新会员折扣： " + newDiscountRate;
                sendEmailEnable(message);
                swalWithBootstrapButtons.fire("充值成功", "会员: " + memberId + " 已充值 $" + creditAmount + ". 请重新查询最新信息", "success").then(() => {
                    location.reload();
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('充值失败', '本次充值已取消', 'error');
            }
        });
    }
}



function spendCreditForMember() {

    var memberId = document.getElementById('memberIdSearchedForSpend').value.trim();
    var creditAmount = convertCurrencyToNumber(document.getElementById('member_spend_credit_balance').value.trim());

    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请先查询用户信息，确保充值用户正确", "warning");
    } else if (!spendCreditValidation()) {
        return;
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }, buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            title: '确定消费?',
            text: "请确定为会员# " + memberId + " :消费 $" + creditAmount,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                var memberId = document.getElementById('memberIdSearchedForSpend').value.trim();
                var memberBalance = document.getElementById('memberBalanceSearchedForSpend').value.trim();
                var memberDiscountRate = Number(document.getElementById('memberDiscountRateSearchedForSpend').value.trim());
                var newBalance = Number(memberBalance) - Number(creditAmount);

                if (newBalance < 0) {
                    swalWithBootstrapButtons.fire("余额不足", "会员: " + memberId + " 余额 $" + memberBalance + ". 请先充值！", "warning");
                } else {
                    var memberInfo = firebase.database().ref('members/' + memberId);
                    memberInfo.update({
                        memberBalance: newBalance,
                    })

                    var spendCreditDate = document.getElementById('spend_credit_date').value.trim();
                    var spendCreditEmployee = document.getElementById('spend_credit_employeeName').value.trim();
                    var spendCreditNote = document.getElementById('spend_credit_note').value;

                    const transactionId = generateTransactionId();
                    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
                    transactionInfo.set({
                        'memberId': memberId,
                        'amount': creditAmount,
                        'type': 'spendCredit',
                        'date': spendCreditDate,
                        'employeeId': spendCreditEmployee,
                        'discountRate': memberDiscountRate,
                        'memberRemainingBalance': newBalance,
                        'status': 'paid',
                        'note': spendCreditNote
                    });
                    var message = "操作类型：消费，会员号：" + memberId + ",金额：" + creditAmount + ",余额:" + newBalance + ",员工：" + spendCreditEmployee + ",日期：" + spendCreditDate;
                    sendEmailEnable(message);
                    swalWithBootstrapButtons.fire("消费成功", "会员: " + memberId + " 已消费 $" + creditAmount + ". 请重新查询最新信息", "success").then(() => { location.reload() });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('消费失败', '本次消费已取消', 'error');
            }
        });
    }
}


function addNewMember() {
    if (!addNewMemberValidation()) {
        return;
    }
    var memberId = document.getElementById('memberId').value.trim();
    var memberName = document.getElementById('memberName').value.trim();
    var memberPetName = document.getElementById('memberPetName').value.trim();
    var memberPetBreed = document.getElementById('memberPetBreed').value.trim();
    var memberPetGender = document.getElementById('memberPetGender').value.trim();
    var memberJoinDate = document.getElementById('memberJoinDate').value.trim();
    var memberPhone = document.getElementById('memberPhone').value.trim();
    var memberBalance = convertCurrencyToNumber(document.getElementById('memberBalance').value.trim());
    var memberDiscountRate = Number(document.getElementById('memberDiscountRate').value.trim());
    var addNewMemberByEmployee = document.getElementById('addNewMemberByEmployee').value.trim();
    var addNewMemberNote = document.getElementById('addNewMemberNote').value.trim();

    var memberInfoDetails = { 'memberName': memberName, 'memberPetName': memberPetName, 'memberPetBreed': memberPetBreed, 'memberPetGender': memberPetGender, 'memberJoinDate': memberJoinDate, 'memberPhone': memberPhone, 'memberBalance': memberBalance, 'memberDiscountRate': memberDiscountRate, 'employee': addNewMemberByEmployee, 'note': addNewMemberNote };

    if (duplicatedPhoneCheckEnable()) {

        memberPhoneLookUpTable(memberPhone).then(function (isExistPhoneNumber) {
            if (isExistPhoneNumber) {
                Swal.fire("提醒", "电话号码已存在", "warning");
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    }, buttonsStyling: true
                });

                swalWithBootstrapButtons.fire({
                    title: '确定办理新会员?',
                    text: "会员# " + memberId + "电话号码已存在，请确定仍然办理新会员。",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveMemberInfo(memberId, memberInfoDetails);
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithBootstrapButtons.fire('办理失败', '本次办理已取消', 'error');
                    }
                });
            } else {
                saveMemberInfo(memberId, memberInfoDetails);
            }
        });
    }
    else {
        saveMemberInfo(memberId, memberInfoDetails);
    }
}

function saveMemberInfo(memberId, memberInfoDetails) {

    firebase.database().ref('members/' + memberId).set(memberInfoDetails);
    const transactionId = generateTransactionId();
    var memberBalance = memberInfoDetails.memberBalance;
    var addNewMemberByEmployee = memberInfoDetails.employee;
    var memberJoinDate = memberInfoDetails.memberJoinDate;
    var addNewMemberNote = memberInfoDetails.note;
    var memberDiscountRate = memberInfoDetails.memberDiscountRate;

    var transactionInfoDetail = {
        'memberId': memberId,
        'amount': memberBalance,
        'memberRemainingBalance': memberBalance,
        'type': 'newMember',
        'date': memberJoinDate,
        'employeeId': addNewMemberByEmployee,
        'discountRate': memberDiscountRate,
        'status': 'paid',
        'note': addNewMemberNote
    };

    saveTransactionInfo(transactionId, transactionInfoDetail);
    var message = "操作类型：开户，会员号：" + memberId + ",金额：" + memberBalance + ",员工：" + addNewMemberByEmployee + ",日期：" + memberJoinDate + ", 折扣：" + memberDiscountRate;
    sendEmailEnable(message);
    Swal.fire("办理成功", "新会员已经加入: " + memberId, "success").then(() => {
        location.reload()
    });
}

function saveTransactionInfo(transactionId, transactionInfoDetail) {
    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
    transactionInfo.set(transactionInfoDetail);

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

    memberInfoLookUpTable(memberId).then(function (result) {
        if (result == null) {
            clearContentBySection(sectionType);
        } else {
            buildContentBySection(result, sectionType);
        }
    });
}

function buildContentBySection(memberInfo, sectionType) {
    document.getElementById('memberIdSearchedFor' + sectionType).value = memberInfo['memberId'];
    document.getElementById('memberNameSearchedFor' + sectionType).value = memberInfo['memberName'];
    document.getElementById('memberPetNameSearchedFor' + sectionType).value = memberInfo['memberPetName'];
    document.getElementById('memberPhoneSearchedFor' + sectionType).value = memberInfo['memberPhone'];
    document.getElementById('memberBalanceSearchedFor' + sectionType).value = memberInfo['memberBalance'];
    document.getElementById('memberDiscountRateSearchedFor' + sectionType).value = memberInfo['memberDiscountRate'];
    if (sectionType == 'Search') {
        document.getElementById('memberPetBreedSearchedFor' + sectionType).value = memberInfo['memberPetBreed'];
        var petGenderChinese='未知';
        if(memberInfo['memberPetGender']==='m'){
            petGenderChinese = '男';
        } else if(memberInfo['memberPetGender']==='f'){
            petGenderChinese = '女';
        }
        document.getElementById('memberPetGenderSearchedFor' + sectionType).value = petGenderChinese;
        document.getElementById('memberJoinDateSearchedFor' + sectionType).value = memberInfo['memberJoinDate'];
        document.getElementById('employeeSearchedFor' + sectionType).value = memberInfo['employee'];
        document.getElementById('noteSearchedFor' + sectionType).value = memberInfo['note'];
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

function searchMemberByCatagoryPetName(petName, sectionType) {

    firebase.database().ref('members/').once("value").then(snapshot => {
        numberOfSearchedMember = 0;
        var firstChild;
        var htmlContent = "<select id='search_member_mutiple_option_for" + sectionType + "' type='text' class='form-control'><option  selected>请选择(会员号-宠物名字-电话)</option>";
        snapshot.forEach(function (data) {
            if (String(data.child('memberPetName').val()).toUpperCase().includes(String(petName).toUpperCase())) {
                firstChild = memberInfoConvertor(data);
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
                    buildContentBySection(memberInfoConvertor(data), sectionType);
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


function employeeSelectedOptionForMemberManagement() {

    firebase.database().ref('employees/').orderByKey().on("value", function (snapshot) {
        var addNewMemberSelectAttr = document.getElementById('addNewMemberByEmployee');
        var addCreditEmployeeSelectAttr = document.getElementById('add_credit_employeeName');
        var spendCreditEmployeeSelectAttr = document.getElementById('spend_credit_employeeName');
        snapshot.forEach(function (childSnapshot) {
            var employeeId = childSnapshot.key;
            var employeeName = childSnapshot.child("employeeName").val();
            const opt = document.createElement("option");
            const opt1 = document.createElement("option");
            const opt2 = document.createElement("option");
            opt.value = employeeId;
            opt.text = employeeName;
            opt1.value = employeeId;
            opt1.text = employeeName;
            opt2.value = employeeId;
            opt2.text = employeeName;
            addNewMemberSelectAttr.add(opt, null);
            addCreditEmployeeSelectAttr.add(opt1, null);
            spendCreditEmployeeSelectAttr.add(opt2, null);
        });
    });
}

function discountRateEnable() {
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.on("value", function (snapshot) {
        var isEnable = snapshot.child('discountRateEditable').val();
        document.getElementById('memberDiscountRate').readOnly = !isEnable;
    });
}

function sendEmailEnable(message) {
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.on("value", function (snapshot) {
        var isEnable = snapshot.child('emailNotification').val();
        if (isEnable) {
            sendEmail(message);
        }
    });
}

function duplicatedPhoneCheckEnable() {
    var settingInfo = firebase.database().ref('setting/');
    var isDuplicatedPhoneCheckEnable = false;
    settingInfo.on("value", function (snapshot) {
        isDuplicatedPhoneCheckEnable = snapshot.child('duplicatedPhoneCheck').val();
    });
    return isDuplicatedPhoneCheckEnable;
}