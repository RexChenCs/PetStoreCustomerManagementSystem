$(document).ready(function () {

    // loadingFile('笑笑打针疫苗','vaccines');

    generateNavigation("navVip");

    $("input[type='tel']").on({
        click: function () {
            $(this).val('');
        },
        keyup: function () {
            formatPhone($(this));
        }
    });

    $("input[id='memberBalance_customize']").on({
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

    $("select[id='memberBalance']").on({
        keyup: function () {
            wrapCurrency($(this));
        },
        change: function () {
            if ($(this).val() === 'others') {
                document.getElementById('memberBalance_customize_section').style.display = 'block'
                document.getElementById('memberDiscountRate').value = null;
                document.getElementById('memberDiscountRate').readOnly = false;
            } else {
                document.getElementById('memberBalance_customize_section').style.display = 'none';
                discountRateEnable();
                calDiscountRate($(this).val(), 'memberDiscountRate');
            }
        }
    });

    $("input[id='memberBalance_customize']").on({
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

    $("input[id='memberDiscountRate']").on({
        keyup: function () {
            wrapDiscountRate($(this));
        },
        blur: function () {
            if (!isValidDiscountRate($(this).val()) && !checkValue($(this).val())) {
                Swal.fire("错误提醒", "请输入正确折扣率(例如:0.90)", "warning");
                $(this).val('');
            }
        }
    });

    $("input[id='add_credit_discountRate']").on({
        keyup: function () {
            wrapDiscountRate($(this));
        },
        blur: function () {
            if (!isValidDiscountRate($(this).val()) && !checkValue($(this).val())) {
                Swal.fire("错误提醒", "请输入正确折扣率(例如:0.90)", "warning");
                $(this).val('');
            }
        }
    });

    //Doc Type Selection event listen
    $("select[id='fileType']").on({
        change: function () {
            if ($(this).val() === 'vaccines') {
                document.getElementById('doc_vac_info').style.display = 'block'
            } else {
                document.getElementById('doc_vac_info').style.display = 'none';
            }

        }
    });

    $("select[id='search_fileType']").on({
        change: function () {
            if ($(this).val() === 'vaccines') {
                document.getElementById('search_vacFilter').style.display = 'block'
            } else {
                document.getElementById('search_vacFilter').style.display = 'none';
            }

        }
    });

    $("select[id='doc_vac_petType']").on({
        change: function () {
            if ($(this).val() === "") {
                ClearOptionsFastAlt('doc_vac_breed');
            } else {
                petBreedSelectedOptionForUpload($(this).val());
            }
        }
    });

    $("select[id='search_vac_doc_petType_forSearch']").on({
        change: function () {
            if ($(this).val() === "") {
                ClearOptionsFastAlt('doc_vac_breed');
            } else {
                petBreedSelectedOptionForSearch($(this).val());
            }
        }
    });

    $("select[id='add_credit_member_balance']").on({
        keyup: function () {
            wrapCurrency($(this));
        },
        change: function () {
            if ($(this).val() === 'others') {
                document.getElementById('add_credit_member_balance_customize_section').style.display = 'block'
                document.getElementById('add_credit_discountRate').value = null;
                document.getElementById('add_credit_discountRate').readOnly = false;
            } else {
                document.getElementById('add_credit_member_balance_customize_section').style.display = 'none';
                discountRateEnable();
                calDiscountRate($(this).val(), 'add_credit_discountRate');
            }
        }
    });

    $("input[id='add_credit_member_balance_customize']").on({
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

    $("input[id='memberBalance']").on({
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

    $("select[id='search_vac_doc_catagory_forSearch']").on({
        change: function () {
            if ($(this).val() === 'searchByPetBreed') {
                document.getElementById('search_vac_doc_input_value_forSearch').style.display = 'none'
                document.getElementById('search_vac_doc_select_value_forSearch').style.display = 'block'

            } else {
                document.getElementById('search_vac_doc_input_value_forSearch').style.display = 'block'
                document.getElementById('search_vac_doc_select_value_forSearch').style.display = 'none'
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

    document.getElementById('memberJoinDate').valueAsDate = getCurrentNYDate();
    document.getElementById('add_credit_date').valueAsDate = getCurrentNYDate();
    document.getElementById('spend_credit_date').valueAsDate = getCurrentNYDate();
    document.getElementById('fileCreatedDate').valueAsDate = getCurrentNYDate();
    generateNewMemberId();
    employeeSelectedOptionForMemberManagement();
    loadingValueSelectedOptionForMemberManagement();
    discountRateEnable();
});



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
        memberInfoLookUpTable(memberId).then(function (snapshot) {
            if (snapshot.exists()) {
                document.getElementById('memberIdSearchedFor' + searchCategoryType).value = snapshot.key;
                document.getElementById('memberNameSearchedFor' + searchCategoryType).value = snapshot.child('memberName').val();
                document.getElementById('memberPetNameSearchedFor' + searchCategoryType).value = snapshot.child('memberPetName').val();
                document.getElementById('memberPhoneSearchedFor' + searchCategoryType).value = snapshot.child('memberPhone').val();
                document.getElementById('memberBalanceSearchedFor' + searchCategoryType).value = snapshot.child('memberBalance').val();
                document.getElementById('memberDiscountRateSearchedFor' + searchCategoryType).value = snapshot.child('memberDiscountRate').val();
            }
        });
    }
}

function addCreditForMember() {

    var memberId = document.getElementById('memberIdSearchedForAdd').value.trim();
    var creditAmount = document.getElementById('add_credit_member_balance').value.trim();
    if (creditAmount === 'others') {
        creditAmount = convertCurrencyToNumber(document.getElementById('add_credit_member_balance_customize').value.trim())
    } else {
        creditAmount = Number(creditAmount);
    }
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
                addCreditNote = textAreaLineControl(addCreditNote, 20);

                var newBalance = Number(memberBalance) + Number(creditAmount);
                var memberInfo = firebase.database().ref('members/' + memberId);
                memberInfo.update({
                    'memberBalance': Number(Number(newBalance).toFixed(2)),
                    'memberDiscountRate': Number(Number(newDiscountRate).toFixed(2))
                });
                const transactionId = generateTransactionId();
                var transactionInfo = firebase.database().ref('transactions/' + transactionId);
                transactionInfo.set({
                    'memberId': memberId,
                    'amount': Number(Number(creditAmount).toFixed(2)),
                    'discountRate': Number(Number(originalDiscountRate).toFixed(2)),
                    'memberRemainingBalance': Number(Number(newBalance).toFixed(2)),
                    'type': 'addCredit',
                    'date': addCreditDate,
                    'employeeId': addCreditEmployee,
                    'status': 'paid',
                    'note': addCreditNote
                });
                var message = "操作类型：充值，会员号：" + memberId + ",金额：" + Number(creditAmount).toFixed(2) + ",余额:" + Number(newBalance).toFixed(2) + ",员工：" + addCreditEmployee + ",日期：" + addCreditDate + ",最新会员折扣： " + newDiscountRate;
                sendEmailEnable(message);
                swalWithBootstrapButtons.fire("充值成功", "会员: " + memberId + " 已充值 $" + Number(creditAmount).toFixed(2) + ". 请重新查询最新信息", "success").then(() => {
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
                        memberBalance: Number(Number(newBalance).toFixed(2)),
                    })
                    var spendCreditDate = document.getElementById('spend_credit_date').value.trim();
                    var spendCreditEmployee = document.getElementById('spend_credit_employeeName').value.trim();
                    var spendCreditNote = document.getElementById('spend_credit_note').value;
                    spendCreditNote = textAreaLineControl(spendCreditNote, 20);

                    const transactionId = generateTransactionId();
                    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
                    transactionInfo.set({
                        'memberId': memberId,
                        'amount': Number(Number(creditAmount).toFixed(2)),
                        'type': 'spendCredit',
                        'date': spendCreditDate,
                        'employeeId': spendCreditEmployee,
                        'discountRate': Number(Number(memberDiscountRate).toFixed(2)),
                        'memberRemainingBalance': Number(Number(newBalance).toFixed(2)),
                        'status': 'paid',
                        'note': spendCreditNote
                    });
                    var message = "操作类型:消费，会员号：" + memberId + ",金额：" + Number(creditAmount).toFixed(2) + ",余额:" + Number(newBalance).toFixed(2) + ",员工：" + spendCreditEmployee + ",日期：" + spendCreditDate;
                    sendEmailEnable(message);
                    swalWithBootstrapButtons.fire("消费成功", "会员: " + memberId + " 已消费 $" + Number(creditAmount).toFixed(2) + ". 请重新查询最新信息", "success").then(() => { location.reload() });
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
    var memberBalance = document.getElementById('memberBalance').value.trim();
    var memberBalance_customize = document.getElementById('memberBalance_customize').value.trim();

    if (memberBalance === 'others') {
        memberBalance = convertCurrencyToNumber(memberBalance_customize);
    } else {
        memberBalance = Number(memberBalance);
    }

    var memberDiscountRate = Number(document.getElementById('memberDiscountRate').value.trim());
    var addNewMemberByEmployee = document.getElementById('addNewMemberByEmployee').value.trim();
    var addNewMemberNote = document.getElementById('addNewMemberNote').value.trim();
    addNewMemberNote = textAreaLineControl(addNewMemberNote, 20);

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
        'amount': Number(Number(memberBalance).toFixed(2)),
        'memberRemainingBalance': Number(Number(memberBalance).toFixed(2)),
        'type': 'newMember',
        'date': memberJoinDate,
        'employeeId': addNewMemberByEmployee,
        'discountRate': memberDiscountRate,
        'status': 'paid',
        'note': addNewMemberNote
    };

    saveTransactionInfo(transactionId, transactionInfoDetail);
    var message = "操作类型:开户，会员号：" + memberId + ",金额：" + Number(memberBalance).toFixed(2) + ",员工：" + addNewMemberByEmployee + ",日期：" + memberJoinDate + ", 折扣：" + memberDiscountRate;
    sendEmailEnable(message);
    Swal.fire("办理成功", "新会员已经加入: " + memberId, "success").then(() => {
        location.reload()
    });
}

function saveTransactionInfo(transactionId, transactionInfoDetail) {
    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
    transactionInfo.set(transactionInfoDetail);

}

function employeeSelectedOptionForMemberManagement() {
    var addNewMemberSelectAttr = document.getElementById('addNewMemberByEmployee');
    var addCreditEmployeeSelectAttr = document.getElementById('add_credit_employeeName');
    var spendCreditEmployeeSelectAttr = document.getElementById('spend_credit_employeeName');
    firebase.database().ref('employees/').orderByKey().on("value", function (snapshot) {
        ClearOptionsFastAlt('addNewMemberByEmployee');
        ClearOptionsFastAlt('add_credit_employeeName');
        ClearOptionsFastAlt('spend_credit_employeeName');
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

function petBreedSelectedOptionForUpload(petType) {
    var petBreedSelectAttr = document.getElementById('doc_vac_breed');
    firebase.database().ref('petBreed/' + petType).orderByKey().on("value", function (snapshot) {
        ClearOptionsFastAlt('doc_vac_breed');
        snapshot.forEach(function (childSnapshot) {
            var petBreed = childSnapshot.key;
            const opt = document.createElement("option");
            opt.value = petBreed;
            opt.text = petBreed;
            petBreedSelectAttr.add(opt, null);
        });
    });
}

function petBreedSelectedOptionForSearch(petType) {
    var petBreedSelectAttr = document.getElementById('search_vac_doc_select_value_forSearch');
    firebase.database().ref('petBreed/' + petType).orderByKey().on("value", function (snapshot) {
        ClearOptionsFastAlt('search_vac_doc_select_value_forSearch');
        snapshot.forEach(function (childSnapshot) {
            var petBreed = childSnapshot.key;
            const opt = document.createElement("option");
            opt.value = petBreed;
            opt.text = petBreed;
            petBreedSelectAttr.add(opt, null);
        });
    });
}

function discountRateEnable() {
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.on("value", function (snapshot) {
        var isEnable = snapshot.child('discountRateEditable').val();
        document.getElementById('memberDiscountRate').readOnly = !isEnable;
        document.getElementById('add_credit_discountRate').readOnly = !isEnable;

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

function loadingValueSelectedOptionForMemberManagement() {
    var newMemberValueSelectAttr = document.getElementById('memberBalance');
    var loadingValueSelectAttr = document.getElementById('add_credit_member_balance');
    var discountInfo = firebase.database().ref('discounts/').orderByKey();
    discountInfo.on("value", function (snapshot) {
        ClearOptionsFastAlt('memberBalance');
        ClearOptionsFastAlt('add_credit_member_balance');
        const optDefault = document.createElement("option");
        const optDefault1 = document.createElement("option");
        optDefault.value = 0;
        optDefault.text = '请选择充值金额';
        optDefault1.value = 0;
        optDefault1.text = '请选择充值金额';
        newMemberValueSelectAttr.add(optDefault, null);
        loadingValueSelectAttr.add(optDefault1, null);


        snapshot.forEach(function (childSnapshot) {
            var loadingValue = childSnapshot.child('value').val();
            const opt = document.createElement("option");

            opt.value = loadingValue;
            opt.text = formatCurrencyForNumber(loadingValue);
            loadingValueSelectAttr.add(opt, null);

            const opt1 = document.createElement("option");
            opt1.value = loadingValue;
            opt1.text = formatCurrencyForNumber(loadingValue);
            newMemberValueSelectAttr.add(opt1, null);
        });
        const opt = document.createElement("option");
        opt.value = 'others';
        opt.text = '自定义面值';
        loadingValueSelectAttr.add(opt, null);

        const opt1 = document.createElement("option");
        opt1.value = 'others';
        opt1.text = '自定义面值';
        newMemberValueSelectAttr.add(opt1, null);
    });

    $('#chooseFile').bind('change', function () {
        var filename = $("#chooseFile").val();
        if (/^\s*$/.test(filename)) {
            $(".file-upload").removeClass('active');
            $("#noFile").text("No file chosen...");
        }
        else {
            $(".file-upload").addClass('active');
            $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
        }
    });
}

function uploadFiles() {
    var file = document.getElementById("chooseFile").files[0];
    var fileType = document.getElementById("fileType").value;
    var fileCreatedDate = document.getElementById('fileCreatedDate').value;
    var fileName = document.getElementById("fileName").value;
    var petType = document.getElementById('doc_vac_petType').value;
    if (fileType === "") { Swal.fire("错误提醒", "请选择文件类型", "warning"); }
    else if (fileType === "vaccines" && uploadDocVacFileValidation()) {
        fileInfoLookUpTable(fileName, fileType, petType).then(function (snapshot) {
            if (!snapshot.exists()) {

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    }, buttonsStyling: true
                });
                swalWithBootstrapButtons.fire({
                    title: '确定上传文件?',
                    text: "请确定上传疫苗文件" + fileName,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        var petType = document.getElementById('doc_vac_petType').value;
                        var petName = document.getElementById('doc_vac_petName').value.trim();
                        var petBreed = document.getElementById('doc_vac_breed').value.trim();
                        var expiredDate = document.getElementById('doc_vac_expiredDate').value.trim();
                        var docNote = document.getElementById('doc_vac_note').value.trim();
                        docNote = textAreaLineControl(docNote, 20);

                        uploadFile(fileName, fileType, file, petType);

                        var fileInfo = firebase.database().ref('files/vaccines/' + petType + '/' + fileName);
                        fileInfo.set({
                            'petName': petName,
                            'petBreed': petBreed,
                            'expiredDate': expiredDate,
                            'createdDate': fileCreatedDate,
                            'note': docNote
                        });

                        swalWithBootstrapButtons.fire("上传成功", "文件: " + fileName + " 已上传", "success").then(() => {
                            location.reload();
                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithBootstrapButtons.fire('上传取消', '本次上传已取消', 'error');
                    }
                });

            }
        });

    }
}

function addNewPetBreed() {
    Swal.fire({
        title: "添加类型",
        input: "select",
        inputOptions: {
            dogs: "狗",
            cats: "猫",
        },
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonText: "继续",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "添加品种",
                input: "text",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonText: "确定",
                allowOutsideClick: false
            }).then((result1) => {
                if (result1.isConfirmed) {
                    if (result1.value !== '') {
                        var petBreedInfo = firebase.database().ref('petBreed/' + result.value);
                        var petBreed = {};
                        petBreed[result1.value] = '';
                        petBreedInfo.update(petBreed).then(() => {
                            Swal.fire("添加成功", "新品种已添加", "success");
                        });
                    } else {
                        Swal.fire("错误提醒", "请输入内容", "warning");
                    }
                }
            });
        }
    });
}

function searchFiles() {
    if (searchFilesValidation()) {
        var table = document.getElementById('filesInfo_table');
        table.innerHTML = null;
        var fileType = document.getElementById("search_fileType").value;
        var petType = document.getElementById("search_vac_doc_petType_forSearch").value;
        var filterType = document.getElementById("search_vac_doc_catagory_forSearch").value;
        var filterInputValue = document.getElementById("search_vac_doc_input_value_forSearch").value;
        var filterSelectValue = document.getElementById("search_vac_doc_select_value_forSearch").value;

        if (fileType === 'vaccines') {

            if (filterType === 'searchByFileName') {
                searchVaccinesFilesByFileName(petType, filterInputValue);
            } else if(filterType === 'searchByPetName'){
                searchVaccinesFilesByPetName(petType, filterInputValue);
            } else if(filterType === 'searchByPetBreed'){
                searchVaccinesFilesByPetBreed(petType, filterSelectValue);
            }

        }
    }
}

function searchVaccinesFilesByFileName(petType, fileName) {


    firebase.database().ref('files/vaccines/' + petType).once("value").then(snapshot => {
        snapshot.forEach(function (data) {
            if (String(data.key).toUpperCase().includes(String(fileName).toUpperCase())) {
                firstChild = data;
                generateFilesInfoTable(data,petType,'vaccines');
            }
        });
    });

}

function searchVaccinesFilesByPetName(petType, petName) {


    firebase.database().ref('files/vaccines/' + petType).once("value").then(snapshot => {
        snapshot.forEach(function (data) {
            if (String(data.child('petName').val()).toUpperCase().includes(String(petName).toUpperCase())) {
                firstChild = data;
                generateFilesInfoTable(data,petType,'vaccines');
            }
        });
    });

}

function searchVaccinesFilesByPetBreed(petType, petBreed) {

    firebase.database().ref('files/vaccines/' + petType).once("value").then(snapshot => {
        snapshot.forEach(function (data) {
            if (String(data.child('petBreed').val()).toUpperCase().includes(String(petBreed).toUpperCase())) {
                firstChild = data;
                generateFilesInfoTable(data,petType,'vaccines');
            }
        });
    });

}


function generateFilesInfoTable(data,petType, fileType) {
    var table = document.getElementById('filesInfo_table');
    var fileName = data.key;
    var petName = data.child("petName").val();
    var petBreed = data.child("petBreed").val();
    var createdDate = data.child("createdDate").val();
    var expiredDate = data.child("expiredDate").val();
    var note = data.child("note").val();
    if (note === null || note === '') {
        note = '未备注';
    } else {
        note = '<i class="fa fa-search" onclick=checkFilesNoteDetail("' + note + '")>查看备注</i>'
    }

    var fileNameConv = fileName.replace(' ', '&');
    fileUrl = '<i class="fa fa-search" onclick=loadingFile("'+fileNameConv+'","'+petType+'","'+fileType+'")></i>'
    var row = '<tr>' +
        '<td>' + fileName + '</td>' +
        '<td>' + petName + '</td>' +
        '<td>' + petBreed + '</td>' +
        '<td>' + createdDate + '</td>' +
        '<td>' + expiredDate + '</td>' +
        '<td>' + note + '</td>' +
        '<td>' + fileUrl + '</td>' +
        '</tr>';
    table.innerHTML += row;

}

function checkFilesNoteDetail(note) {
    Swal.fire('详情', note);
}
