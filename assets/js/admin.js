$(document).ready(function () {
    acctUserSelectedOptionForAdminManagement();
    showAndHideTimeOutInputOptions();
    $('#employeeTable').DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        text: 'create',
                        action: function () {
                            document.getElementById('add_new_employee_modal').style.display = 'block';
                        }
                    },
                    {
                        text: 'edit',
                        action: function () {
                            const table = new DataTable('#employeeTable');
                            employeeData = table.row('.selected').data();
                            if (employeeData === undefined || employeeData === null) {
                                Swal.fire("错误提醒", "请点击修改的员工", "warning");
                            } else {
                                document.getElementById('edit_employee_modal').style.display = 'block';
                                document.getElementById('employeeIdForEdit').value = employeeData[0];
                                document.getElementById('employeeNameForEdit').value = employeeData[1];
                                document.getElementById('employeePositionForEdit').value = employeeData[2];
                                document.getElementById('employeePhoneForEdit').value = employeeData[3];
                            }
                        }
                    }
                ]
            },
            topEnd: {
                search: {
                    placeholder: 'Type search here'
                }
            }
        }
    });

    $('#discountRateTable').DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        text: 'create',
                        action: function () {
                            document.getElementById('add_new_discount_rate_modal').style.display = 'block';

                        },
                    },
                    {
                        text: 'edit',
                        action: function () {
                            const discountTable = new DataTable('#discountRateTable');
                            discountData = discountTable.row('.selected').data();
                            if (discountData === undefined || discountData === null) {
                                Swal.fire("错误提醒", "请点击修改的折扣", "warning");
                            } else {
                                document.getElementById('edit_discount_rate_modal').style.display = 'block';
                                document.getElementById('discountLevelIdForEdit').value = discountData[0];
                                document.getElementById('discountValueForEdit').value = discountData[1];
                                document.getElementById('discountRateForEdit').value = discountData[2];
                            }
                        }
                    }
                ]
            },
            topEnd: {
                search: {
                    placeholder: 'Type search here'
                }
            }
        }
    });

    $('#acctUserTable').DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        text: 'create',
                        action: function () {
                            document.getElementById('add_acct_user_role_modal').style.display = 'block';

                        },
                    },
                    {
                        text: 'edit',
                        action: function () {
                            const acctUserTable = new DataTable('#acctUserTable');
                            acctUserData = acctUserTable.row('.selected').data();
                            if (acctUserData === undefined || acctUserData === null) {
                                Swal.fire("错误提醒", "请点击用户信息", "warning");
                            } else {
                                document.getElementById('edit_acct_user_role_modal').style.display = 'block';
                                document.getElementById('adminRoleEmailForUpdate').value = acctUserData[0];
                                document.getElementById('isAdminRoleForUpdate').value = acctUserData[1];
                            }
                        }
                    }
                ]
            },
            topEnd: {
                search: {
                    placeholder: 'Type search here'
                }
            }
        }
    });

    const employeeTable = new DataTable('#employeeTable');
    employeeTable.on('click', 'tbody tr', (e) => {
        let classList = e.currentTarget.classList;
        if (classList.contains('selected')) {
            classList.remove('selected');
        }
        else {
            employeeTable.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
            classList.add('selected');
        }
    });
    readEmployeeInfoTable();

    const discountRateTable = new DataTable('#discountRateTable');
    discountRateTable.on('click', 'tbody tr', (e) => {
        let classList = e.currentTarget.classList;
        if (classList.contains('selected')) {
            classList.remove('selected');
        }
        else {
            discountRateTable.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
            classList.add('selected');
        }
    });
    readDiscountRateInfoTable();

    const acctUserTable = new DataTable('#acctUserTable');
    acctUserTable.on('click', 'tbody tr', (e) => {
        let classList = e.currentTarget.classList;
        if (classList.contains('selected')) {
            classList.remove('selected');
        }
        else {
            acctUserTable.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
            classList.add('selected');
        }
    });
    readAcctUserInfoTable();

    $("input[type='tel']").on({
        keyup: function () {
            formatPhone($(this));
        }
    });

    $("input[id='memberBalanceInfo']").on({
        keyup: function () {
            wrapCurrency($(this));
        },
        blur: function () {
            if (isNumeric($(this).val())) {
                calDiscountRate($(this).val(), 'memberDiscountRateInfo');
                formatCurrency($(this));
            } else if (!checkValue($(this).val()) && !isValidConcurrency($(this).val())) {
                Swal.fire("错误提醒", "请输入正确数额", "warning");
                $(this).val('');
            }
        }
    });

    $("input[id='memberIdSearchingForEditInfo']").on({
        click: function () {
            $(this).val('');
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if (isNum) {
                formatMemberId($(this));
            }
        }
    });

    $("input[id='transactionAmountInfo']").on({
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

    $("input[id='employeeIdSearchingForEditInfo']").on({
        click: function () {
            $(this).val('');
        },
        blur: function () {
            let isNum = /^\d+$/.test($(this).val());
            if (isNum) {
                formatEmployeeId($(this));
            }
        }
    });

    $("input[id='search_member_value_forEdit']").on({
        keyup: function () {
            var searchType = document.getElementById('search_member_catagory_forEdit').value;
            if (searchType === 'searchByMemberPhone') {
                formatPhone($(this));
            }
        },
        click: function () {
            var searchType = document.getElementById('search_member_catagory_forEdit').value;
            if (searchType === 'searchByMemberId' || searchType === 'searchByMemberPhone') {
                $(this).val('');
            }
        },
        blur: function () {
            var searchType = document.getElementById('search_member_catagory_forEdit').value;
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
                var searchType = document.getElementById('search_member_catagory_forEdit').value;
                if (searchType === 'searchByMemberId') {
                    let isNum = /^\d+$/.test($(this).val());
                    if (isNum) {
                        formatMemberId($(this));
                    }
                }
                // Trigger the search button element with a click
                searchMemberByCatagory('Edit');

            }
        }
    });

    $("input[id='transactionIdSearchingForEditInfo']").on({
        keypress: function (event) {
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the search button element with a click
                findTransactionByIdForEditInfo()
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

    $("input[id='newDiscountValue']").on({
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

    $("input[id='newDiscountRate']").on({
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

    $("input[id='discountValueForEdit']").on({
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

    $("input[id='discountRateForEdit']").on({
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
});

function createNewEmployee() {
    var employeeName = document.getElementById('newEmployeeName').value.trim();
    if (employeeName == null || employeeName == "") {
        Swal.fire("错误提醒", "请输入员工名字", "warning");
    } else {
        var employeePosition = document.getElementById('newEmployeePosition').value;
        var employeePhone = document.getElementById('newEmployeePhoneNumber').value;
        generateNewEmployeeId().then(function (newEmployeeId) {
            var employeeInfo = firebase.database().ref('employees/' + newEmployeeId);
            employeeInfo.set({ 'employeeName': employeeName, 'employeePosition': employeePosition, 'employeePhone': employeePhone });
            Swal.fire("成功", "会员信息已保存: " + newEmployeeId, "success").then(() => {
                readEmployeeInfoTable();
                document.getElementById('add_new_employee_modal').style.display = 'none';
            });
        });
    }
}

function createNewDiscount() {
    var loadingValue = document.getElementById('newDiscountValue').value.trim();
    var discountRate = document.getElementById('newDiscountRate').value.trim();
    if (checkValue(loadingValue) || checkValue(discountRate)) {
        Swal.fire("错误提醒", "充值金额或者折扣率不能为空白", "warning");
    } else {
        loadingValue = convertCurrencyToNumber(loadingValue);
        generateNewDiscountLevel().then(function (levelId) {
            var discountInfo = firebase.database().ref('discounts/' + levelId);
            discountInfo.set({ 'value': Number(Number(loadingValue).toFixed(2)), 'rate': Number(Number(discountRate).toFixed(2)) });
            Swal.fire("成功", "新折扣已保存: " + levelId, "success").then(() => {
                readDiscountRateInfoTable();
                document.getElementById('add_new_discount_rate_modal').style.display = 'none';
            });
        });
    }
}

function updateEmployee() {
    var employeeId = document.getElementById('employeeIdForEdit').value.trim();
    var employeeName = document.getElementById('employeeNameForEdit').value.trim();
    if (employeeName == null || employeeName == "") {
        Swal.fire("错误提醒", "请输入员工名字", "warning");
    } else {
        var employeePosition = document.getElementById('employeePositionForEdit').value;
        var employeePhone = document.getElementById('employeePhoneForEdit').value;
        var employeeInfo = firebase.database().ref('employees/' + employeeId);
        employeeInfo.update({ 'employeeName': employeeName, 'employeePosition': employeePosition, 'employeePhone': employeePhone });
        Swal.fire("成功", "会员信息已保存", "success").then(() => {
            readEmployeeInfoTable();
            document.getElementById('edit_employee_modal').style.display = 'none';
        });
    }
}

function updateDiscountRate() {
    var levelId = document.getElementById('discountLevelIdForEdit').value.trim();
    var loadingValue = document.getElementById('discountValueForEdit').value.trim();
    var discountRate = document.getElementById('discountRateForEdit').value.trim();
    if (checkValue(loadingValue) || checkValue(discountRate)) {
        Swal.fire("错误提醒", "充值金额或者折扣率不能为空白", "warning");
    } else {
        loadingValue = convertCurrencyToNumber(loadingValue);
        var discountRateInfo = firebase.database().ref('discounts/' + levelId);
        discountRateInfo.update({ 'value': Number(Number(loadingValue).toFixed(2)), 'rate': Number(Number(discountRate).toFixed(2)) });
        Swal.fire("成功", "折扣信息已保存", "success").then(() => {
            readDiscountRateInfoTable();
            document.getElementById('edit_discount_rate_modal').style.display = 'none';
        });
    }
}

function employeeSelectedOptionForAdminManagement() {
    var employeeInfo = firebase.database().ref('employees/').orderByKey();
    var employeeSelectAttr = document.getElementById('employeeSearchedForEdit');
    var employeeSelectAttr1 = document.getElementById('search_employeeId_selection');
    var employeeSelectAttr2 = document.getElementById('transactionByEmployeeInfo');
    employeeInfo.once("value", function (snapshot) {
        ClearOptionsFastAlt('employeeSearchedForEdit');
        ClearOptionsFastAlt('search_employeeId_selection');
        ClearOptionsFastAlt('transactionByEmployeeInfo');
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
            employeeSelectAttr.add(opt, null);
            employeeSelectAttr1.add(opt1, null);
            employeeSelectAttr2.add(opt2, null);
        });
    });
}

var current_employee_for_new_member;

function findEmployeeByIdForEditInfo() {
    var employeeId = document.getElementById('employeeIdSearchingForEditInfo').value.trim();
    if (employeeId == null || employeeId == "") {
        Swal.fire("错误提醒", "请输入员工账号", "warning");
    } else {
        var memberInfo = firebase.database().ref('employees/' + employeeId);
        memberInfo.once('value').then(snapshot => {
            var Data = snapshot;
            if (!snapshot.exists()) {
                Swal.fire("错误提醒", "查询的员工账号： " + snapshot.key + " 不存在", "error");
                document.getElementById('employeeIdInfo').value = null;
                document.getElementById('employeeNameInfo').value = null;
                document.getElementById('employeePhoneInfo').value = null;
                document.getElementById('employeePositionInfo').value = null;
                document.getElementById('employeeNoteInfo').value = null;
            } else {
                var employeeId = Data.key;
                var employeeName = Data.child("employeeName").val();
                var employeePhone = Data.child("employeePhone").val();
                var employeePosition = Data.child("employeePosition").val();
                var employeeNote = Data.child("employeeNote").val();
                document.getElementById('employeeIdInfo').value = employeeId;
                document.getElementById('employeeNameInfo').value = employeeName;
                document.getElementById('employeePhoneInfo').value = employeePhone;
                document.getElementById('employeePositionInfo').value = employeePosition;
                document.getElementById('employeeNoteInfo').value = employeeNote;
            }
        });
    }
}

function findTransactionByIdForEditInfo() {
    var transactionId = document.getElementById('transactionIdSearchingForEditInfo').value.trim();
    if (transactionId == null || transactionId == "") {
        Swal.fire("错误提醒", "请输入交易查询号", "warning");
    } else {
        var transactionInfo = firebase.database().ref('transactions/' + transactionId);
        transactionInfo.once('value').then(snapshot => {
            var Data = snapshot;
            if (!snapshot.exists()) {
                Swal.fire("错误提醒", "查询的交易号： " + snapshot.key + " 不存在", "error");
                document.getElementById('transactionIdInfo').value = null;
                document.getElementById('transactionTypeInfo').value = null;
                document.getElementById('transactionMemberIdInfo').value = null;
                document.getElementById('transactionStatusInfo').value = null;
                document.getElementById('transactionDateInfo').value = null;
                document.getElementById('transactionAmountInfo').value = null;
                document.getElementById('transactionByEmployeeInfo').value = null;
                document.getElementById('transactionDiscountRateInfo').value = null;
                document.getElementById('transactionNoteInfo').value = null;
                document.getElementById('transactionRemainingBalanceInfo').value = null;
            } else {
                var transactionId = Data.key;
                var transactionType = Data.child("type").val();
                var transactionMemberId = Data.child("memberId").val();
                var transactionDate = Data.child("date").val();
                var transactionAmount = Data.child("amount").val();
                var transactionEmployeeId = Data.child('employeeId').val();
                var transactionStatus = Data.child('status').val();
                var transactionNote = Data.child("note").val();
                var transactionDiscountRate = Data.child("discountRate").val();
                var transactionRemainingBalance = Data.child("memberRemainingBalance").val();
                document.getElementById('transactionIdInfo').value = transactionId;
                document.getElementById('transactionTypeInfo').value = transactionType;
                document.getElementById('transactionMemberIdInfo').value = transactionMemberId;
                document.getElementById('transactionDateInfo').value = transactionDate;
                document.getElementById('transactionAmountInfo').value = USDollar.format(transactionAmount);
                document.getElementById('transactionByEmployeeInfo').value = transactionEmployeeId;
                document.getElementById('transactionStatusInfo').value = transactionStatus;
                document.getElementById('transactionDiscountRateInfo').value = transactionDiscountRate;
                document.getElementById('transactionNoteInfo').value = transactionNote;
                document.getElementById('transactionRemainingBalanceInfo').value = transactionRemainingBalance;
            }
        });
    }
}

function updateMemberInfo() {
    var memberId = document.getElementById('memberIdSearchedForEdit').value.trim();
    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请输入会员账号", "warning");
    } else if (!updateMemberInfoValidation()) {
        return;
    } else {
        memberName = document.getElementById('memberNameSearchedForEdit').value;
        memberPetName = document.getElementById('memberPetNameSearchedForEdit').value;
        memberPetBreed = document.getElementById('memberPetBreedSearchedForEdit').value;
        memberPetGender = document.getElementById('memberPetGenderSearchedForEdit').value;
        memberJoinDate = document.getElementById('memberJoinDateSearchedForEdit').value;
        memberPhone = document.getElementById('memberPhoneSearchedForEdit').value;
        memberBalance = document.getElementById('memberBalanceSearchedForEdit').value;
        memberBalance = convertCurrencyToNumber(memberBalance);
        memberDiscountRate = document.getElementById('memberDiscountRateSearchedForEdit').value;
        addNewMemberByEmployee = document.getElementById('employeeSearchedForEdit').value;
        addNewMemberNote = document.getElementById('noteSearchedForEdit').value;
        addNewMemberNote = textAreaLineControl(addNewMemberNote, 20);
        var memberInfo = firebase.database().ref('members/' + memberId);
        if (current_employee_for_new_member != addNewMemberByEmployee) {
            updateTransactionForEmployeeChange(memberId, addNewMemberByEmployee);
        }
        memberInfo.update({ 'memberName': memberName, 'memberPetName': memberPetName, 'memberPetBreed': memberPetBreed, 'memberPetGender': memberPetGender, 'memberJoinDate': memberJoinDate, 'memberPhone': memberPhone, 'memberBalance': memberBalance, 'memberDiscountRate': memberDiscountRate, 'employee': addNewMemberByEmployee, 'note': addNewMemberNote });
        Swal.fire("成功", "会员信息已保存", "success").then(() => {
            location.reload();
        });
    }
}

function voidTransactionInfo() {
    var transactionId = document.getElementById('transactionIdInfo').value.trim();
    var status = document.getElementById('transactionStatusInfo').value.trim();
    if (transactionId == null || transactionId == "") {
        Swal.fire("错误提醒", "请输入交易查询号", "warning");
    } else if (status === 'void') {
        Swal.fire("错误提醒", "订单已经被消除，不可以修改", "warning");
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }, buttonsStyling: true
        });
        swalWithBootstrapButtons.fire({
            title: '确定要取消交易订单吗?',
            text: "订单号#" + transactionId,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                memberAcctHandlerForVoidTransaction(transactionId);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire('修改失败', '本次修改已取消', 'error');
            }
        });
    }
}

function updateTransactionInfo() {

    var transactionId = document.getElementById('transactionIdInfo').value.trim();
    var status = document.getElementById('transactionStatusInfo').value.trim();
    var transactionType = document.getElementById('transactionTypeInfo').value;
    var transactionDate = document.getElementById('transactionDateInfo').value;
    var transactionAmount = convertCurrencyToNumber(document.getElementById('transactionAmountInfo').value);
    var transactionMemberId = document.getElementById('transactionMemberIdInfo').value;
    var transactionDiscountRate = Number(document.getElementById('transactionDiscountRateInfo').value);
    var transactionByEmployee = document.getElementById('transactionByEmployeeInfo').value;
    var transactionNote = document.getElementById('transactionNoteInfo').value;
    transactionNote = textAreaLineControl(transactionNote, 20);
    var transactionRemainingBalance = document.getElementById('transactionRemainingBalanceInfo').value;

    if (Number(transactionAmount) == 0) {
        voidTransactionInfo();
    } else {
        var UpdatedTransactionInfoDetail = {
            'memberId': transactionMemberId,
            'amount': transactionAmount,
            'type': transactionType,
            'date': transactionDate,
            'employeeId': transactionByEmployee,
            'discountRate': transactionDiscountRate,
            'memberRemainingBalance': transactionRemainingBalance,
            'status': 'paid',
            'note': transactionNote
        };

        if (transactionId == null || transactionId == "") {
            Swal.fire("错误提醒", "请输入交易查询号", "warning");
        } else if (!updateTransactionValidation()) {
            return;
        } else if (status === 'void') {
            Swal.fire("错误提醒", "订单已经被消除，不可以修改", "warning");
        } else {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                }, buttonsStyling: true
            });
            swalWithBootstrapButtons.fire({
                title: '确定要修改交易订单吗?',
                text: "订单号#" + transactionId,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    memberAcctHandlerForUpdateTransaction(transactionId, UpdatedTransactionInfoDetail);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire('修改失败', '本次修改已取消', 'error');
                }
            });
        }
    }
}

function memberAcctHandlerForVoidTransaction(transactionId) {
    firebase.database().ref('transactions/' + transactionId).once('value').then(snapshot => {
        if (snapshot.exists()) {
            var transactionType = snapshot.child("type").val();
            var transactionMemberId = snapshot.child("memberId").val();
            var transactionAmount = snapshot.child("amount").val();
            var transactionDiscountRate = snapshot.child("discountRate").val();
            memberAcctModify(transactionType, transactionMemberId, transactionAmount, transactionDiscountRate);
        }
    });
    // make transaction status as void
    markTransactionAsVoid(transactionId);
}

function memberAcctHandlerForUpdateTransaction(oldTransactionId, UpdatedTransactionInfoDetail) {

    var transactionInfo = firebase.database().ref('transactions/' + oldTransactionId);
    //Modify user acct back to original amount
    var isSuccessfulUpdateMemberAcct = transactionInfo.once('value').then(snapshot => {
        if (snapshot.exists()) {
            var transactionAmount = snapshot.child("amount").val();
            var transactionType = snapshot.child("type").val();
            var transactionMemberId = snapshot.child("memberId").val();
            var transactionAmount = snapshot.child("amount").val();
            var transactionDiscountRate = snapshot.child("discountRate").val();
            return memberAcctModify(transactionType, transactionMemberId, transactionAmount - UpdatedTransactionInfoDetail.amount, transactionDiscountRate);
        }
    });

    //  if add => old balance - old amount + new amount 
    //  if delete => old balance + old amount - new amount 
    if (isSuccessfulUpdateMemberAcct) {
        transactionInfoLookUpTable(oldTransactionId).then(function (snapshot) {
            if (snapshot.exists()) {
                var remainingBalanceForUpdatedTransaction = 0;
                if (snapshot.child('type').val() === 'addCredit') {
                    remainingBalanceForUpdatedTransaction = Number(snapshot.child('memberRemainingBalance').val()) - Number(snapshot.child('amount').val()) + Number(UpdatedTransactionInfoDetail['amount']);
                } else if (snapshot.child('type').val() === 'spendCredit') {
                    remainingBalanceForUpdatedTransaction = Number(snapshot.child('memberRemainingBalance').val()) + Number(snapshot.child('amount').val()) - Number(UpdatedTransactionInfoDetail['amount']);
                } else if (snapshot.child('type').val() === 'newMember') {
                    remainingBalanceForUpdatedTransaction = Number(UpdatedTransactionInfoDetail['amount']);
                }
                UpdatedTransactionInfoDetail['memberRemainingBalance'] = Number(Number(remainingBalanceForUpdatedTransaction).toFixed(2));
                firebase.database().ref('transactions/').child(oldTransactionId).update(UpdatedTransactionInfoDetail);
                findTransactionByIdForEditInfo();
                Swal.fire("成功", "订单已修改");
            } else {
                Swal.fire("错误提醒", "交易未发现", "warning");
            }
        });
    }
}

function markTransactionAsVoid(transactionId) {
    var transactionInfo = firebase.database().ref('transactions/' + transactionId);
    transactionInfo.update({
        'status': 'void'
    });
    findTransactionByIdForEditInfo();
    Swal.fire("成功", "交易号：" + transactionId + " 已被取消", "success");
}

function memberAcctModify(transactionType, transactionMemberId, transactionAmount, transactionDiscountRate) {
    var backward_amount;
    var memberInfo = firebase.database().ref('members/' + transactionMemberId);
    return memberInfo.once('value').then(snapshot => {
        var Data = snapshot;
        var isValidTransaction = false;
        if (snapshot.exists()) {
            isValidTransaction = true;
            var memberBalance = Data.child("memberBalance").val();
            if (transactionType === 'spendCredit') {
                backward_amount = Number(memberBalance) + Number(transactionAmount);
                if (backward_amount < 0) {
                    isValidTransaction = false;
                    Swal.fire("错误提醒", "当前消费余额不足，请确认消费金额！", "warning");
                }
            } else { // add credit or new member
                backward_amount = Number(memberBalance) - Number(transactionAmount);
            }
            if (isValidTransaction) {
                memberInfo.update({ 'memberBalance': Number(Number(backward_amount).toFixed(2)), 'memberDiscountRate': Number(Number(transactionDiscountRate).toFixed(2)) });
                Swal.fire("成功", "用户：" + transactionMemberId + " 金额 $" + transactionAmount + "已经返还. 用户最新余额为：$" + backward_amount, "success");
            }
        }
        return isValidTransaction;
    });

}

function updateTransactionForEmployeeChange(memberId, newEmployeeId) {
    var transactionInfo = firebase.database().ref('transactions/');
    transactionInfo.orderByChild('type').equalTo('newMember').once("value", function (snapshot) {
        snapshot.forEach(function (data) {
            if (data.child('memberId').val() == memberId) {
                data.ref.update({
                    "employeeId": newEmployeeId
                });
            }
        });
    });
}

function searchTransactionsForCommission() {

    var employeeId = document.getElementById('search_employeeId_selection').value;
    var startDate = document.getElementById('search_commission_start_date').valueAsDate;
    var endDate = document.getElementById('search_commission_end_date').valueAsDate;
    var tableBody = document.getElementById('commissionInfo_table');

    tableBody.innerHTML = null;

    if (employeeId == "") {
        Swal.fire("错误提醒", "请选择要查询的员工", "warning");
    }
    else if (startDate > endDate && startDate != null && endDate != null) {
        Swal.fire("错误提醒", "开始时间不能大于结束时间", "warning");
    } else {
        searchTransactionByemployeeIdAndTime(employeeId, startDate, endDate);
    }

}

function searchTransactionByemployeeIdAndTime(employeeId, startDate, endDate) {

    var commissionTotal = 0;
    var transactionInfo = firebase.database().ref('transactions/');

    transactionInfo.orderByChild('type').equalTo('newMember').once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var Data = childSnapshot;
            if (Data.child("employeeId").val() == employeeId && Data.child("status").val() == 'paid') {
                var amount = Data.child("amount").val();
                var date = Data.child("date").val();
                var memberId = Data.child("memberId").val();
                var transactionId = Data.key;
                var tableBody = document.getElementById('commissionInfo_table');
                if (startDate == null && endDate == null) {
                    var row = '<tr>' +
                        '<td>' + employeeId + '</td>' +
                        '<td>' + memberId + '</td>' +
                        '<td>$' + amount + '</td>' +
                        '<td>' + transactionId + '</td>' +
                        '<td>' + date + '</td>' +
                        '</tr>';
                    tableBody.innerHTML += row;
                    commissionTotal += Number(amount);
                } else if (startDate != null && endDate == null && new Date(date) >= new Date(startDate)) {
                    var row = '<tr>' +
                        '<td>' + employeeId + '</td>' +
                        '<td>' + memberId + '</td>' +
                        '<td>$' + amount + '</td>' +
                        '<td>' + transactionId + '</td>' +
                        '<td>' + date + '</td>' +
                        '</tr>';
                    tableBody.innerHTML += row;
                    commissionTotal += Number(amount);

                } else if (startDate == null && endDate != null && new Date(date) <= new Date(endDate)) {
                    var row = '<tr>' +
                        '<td>' + employeeId + '</td>' +
                        '<td>' + memberId + '</td>' +
                        '<td>$' + amount + '</td>' +
                        '<td>' + transactionId + '</td>' +
                        '<td>' + date + '</td>' +
                        '</tr>';
                    tableBody.innerHTML += row;
                    commissionTotal += Number(amount);

                } else if (startDate != null && endDate != null && new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate)) {
                    var row = '<tr>' +
                        '<td>' + employeeId + '</td>' +
                        '<td>' + memberId + '</td>' +
                        '<td>$' + amount + '</td>' +
                        '<td>' + transactionId + '</td>' +
                        '<td>' + date + '</td>' +
                        '</tr>';
                    tableBody.innerHTML += row;
                    commissionTotal += Number(amount);
                }
            }
            document.getElementById('commission_total').innerHTML = commissionTotal;

        });
    });
}

function updateAdminRole() {
    var email = document.getElementById('adminRoleEmailForUpdate').value.trim().toLowerCase();
    if (email == null || email == "") {
        Swal.fire("错误提醒", "请输入邮箱", "warning");
    } else {
        var isAdminRole = document.getElementById('isAdminRoleForUpdate').value;
        userEmailLookUpTable(email).then(function (uid) {
            if (uid != null) {
                var usersInfo = firebase.database().ref('users/' + uid);
                usersInfo.update({ 'isAdmin': isAdminRole });
                Swal.fire("成功", "信息已保存", "success");
                readAcctUserInfoTable();
            } else {
                Swal.fire("失败", "邮箱错误", "error");
            }
        });
    }
}

function generateNewEmployeeId() {
    return firebase.database().ref('employees/').once("value").then(snapshot => {
        var employeeBasedId = 1000;
        var employeePrefix = 'PHE';
        var newEmployeeBasedId = employeeBasedId + snapshot.numChildren() + 1;
        var newEmployeeId = employeePrefix + newEmployeeBasedId;
        return newEmployeeId;
    })
}

function generateNewDiscountLevel() {
    return firebase.database().ref('discounts/').once("value").then(snapshot => {
        return snapshot.numChildren() + 1;
    })
}

function readEmployeeInfoTable() {
    var query = firebase.database().ref('employees/').orderByKey();
    var table = $('#employeeTable').DataTable();
    query.once("value", function (snapshot) {
        table.clear().draw();
        snapshot.forEach(function (childSnapshot) {
            var employeeId = childSnapshot.key;
            var employeeName = childSnapshot.child("employeeName").val();
            var employeePhone = childSnapshot.child("employeePhone").val();
            var employeePosition = childSnapshot.child("employeePosition").val();
            table.row.add([employeeId, employeeName, employeePosition, employeePhone]).draw();
        });
    });
}

function readDiscountRateInfoTable() {
    var query = firebase.database().ref('discounts/').orderByKey();
    var table = $('#discountRateTable').DataTable();
    query.once("value", function (snapshot) {
        table.clear().draw();
        snapshot.forEach(function (childSnapshot) {
            var levelId = childSnapshot.key;
            var value = childSnapshot.child("value").val();
            var rate = childSnapshot.child("rate").val();
            table.row.add([levelId, value, rate]).draw();
        });
    });
}

function readEmailNoticeInfo() {
    firebase.database().ref('emailNoticeConfig/').once("value", function (snapshot) {
        var publicKey = snapshot.child("publicKey").val();
        var serviceId = snapshot.child("serviceId").val();
        var templateId = snapshot.child("templateId").val();
        var fromName = snapshot.child("fromName").val();
        var toName = snapshot.child("toName").val();
        var replyTo = snapshot.child("replyTo").val();
        document.getElementById('publicKey').value = publicKey;
        document.getElementById('serviceId').value = serviceId;
        document.getElementById('templateId').value = templateId;
        document.getElementById('fromName').value = fromName;
        document.getElementById('toName').value = toName;
        document.getElementById('replyTo').value = replyTo;
    });
}

function addAcctUser() {
    var uid = document.getElementById('acctUserIdForAdd').value.trim();
    var email = document.getElementById('acctUserEmailForAdd').value.trim().toLowerCase();
    var isAdminRole = document.getElementById('acctUserRoleForAdd').value;
    if (email == null || email == "") {
        Swal.fire("错误提醒", "请输入邮箱", "warning");
    } else if (uid == null || uid == "") {
        Swal.fire("错误提醒", "请输入用户ID", "warning");
    } else {
        var usersInfo = firebase.database().ref('users/' + uid);
        usersInfo.set({ 'email': email, 'isAdmin': isAdminRole });
        Swal.fire("成功", "用户已经添加", "success");
        readAcctUserInfoTable();
    }
}

function readAcctUserInfoTable() {
    var query = firebase.database().ref('users/').orderByKey();
    var table = $('#acctUserTable').DataTable();
    query.once("value", function (snapshot) {
        table.clear().draw();
        snapshot.forEach(function (childSnapshot) {
            var email = childSnapshot.child("email").val();
            var isAdminRole = childSnapshot.child("isAdmin").val();
            table.row.add([email, isAdminRole]).draw();
        });
    });
}

function updateEmailNoticeInfo() {
    if (updateEmailNoticeInfoValidation()) {
        var publicKey = document.getElementById('publicKey').value;
        var serviceId = document.getElementById('serviceId').value;
        var templateId = document.getElementById('templateId').value;
        var fromName = document.getElementById('fromName').value;
        var toName = document.getElementById('toName').value;
        var replyTo = document.getElementById('replyTo').value;

        var emailNoticeConfig = firebase.database().ref('emailNoticeConfig/');
        emailNoticeConfig.set({ 'publicKey': publicKey, 'serviceId': serviceId, 'templateId': templateId, 'fromName': fromName, 'toName': toName, 'replyTo': replyTo });
        Swal.fire("成功", "设置已更改", "success");
    }
}

function updateSetting() {
    var emailNotificationOn = document.getElementById('emailNotification').checked;
    var discountRateEditable = document.getElementById('discountRateEditable').checked;
    var discountRateAutoApply = document.getElementById('discountRateAutoApply').checked;
    var duplicatedPhoneCheck = document.getElementById('duplicatedPhoneCheck').checked;
    var goInactiveEnable = document.getElementById('goInactiveEnable').checked;
    var timeOutInactiveMinute = document.getElementById('timeOutInactiveMinute').value;
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.set({ 'emailNotification': emailNotificationOn, 'discountRateEditable': discountRateEditable, 'discountRateAutoApply': discountRateAutoApply, 'duplicatedPhoneCheck': duplicatedPhoneCheck, 'goInactiveEnable': goInactiveEnable,'timeOutInactiveMinute':timeOutInactiveMinute });
    Swal.fire("成功", "设置已更改", "success");
}

function loadingSetting() {
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.once("value", function (snapshot) {
        document.getElementById('emailNotification').checked = snapshot.child('emailNotification').val();
        document.getElementById('discountRateEditable').checked = snapshot.child('discountRateEditable').val();
        document.getElementById('discountRateAutoApply').checked = snapshot.child('discountRateAutoApply').val();
        document.getElementById('duplicatedPhoneCheck').checked = snapshot.child('duplicatedPhoneCheck').val();
        document.getElementById('goInactiveEnable').checked = snapshot.child('goInactiveEnable').val();
        document.getElementById('timeOutInactiveMinute').value = snapshot.child('timeOutInactiveMinute').val();
    });
    showAndHideTimeOutInputOptions();
    refreshTimeOutMinuteValueByLengthChange();
}

function acctUserSelectedOptionForAdminManagement() {
    var acctUserInfo = firebase.database().ref('users/').orderByKey();
    var acctUserEmailSelectAttr = document.getElementById('acctUserEmailForAccessGroup');

    acctUserInfo.once("value", function (snapshot) {
        ClearOptionsFastAlt('acctUserEmailForAccessGroup');
        snapshot.forEach(function (childSnapshot) {
            var userEmail = childSnapshot.child("email").val();
            const opt = document.createElement("option");
            opt.value = userEmail;
            opt.text = userEmail;
            acctUserEmailSelectAttr.add(opt, null);
        });
    });
}

function updateUserAccessGroup() {
    var accessGroupForUpdateElement = document.getElementById('accessGroupForUpdate');
    var accessTypeForUpdateElement = document.getElementById('accessTypeForUpdate');
    var accessGroupForUpdate = accessGroupForUpdateElement.value;
    var accessTypeForUpdate = accessTypeForUpdateElement.value;

    if (checkValue(accessGroupForUpdate) || checkValue(accessTypeForUpdate)) {
        Swal.fire("错误提醒", "请选择权限种类和修改的类型", "warning");
    } else {
        var email = document.getElementById('acctUserEmailForAccessGroup').value;
        var accessGroupForUpdateText = accessGroupForUpdateElement.options[accessGroupForUpdateElement.selectedIndex].text;
        var accessTypeForUpdateText = accessTypeForUpdateElement.options[accessTypeForUpdateElement.selectedIndex].text;
        userEmailLookUpTable(email).then(function (uid) {
            if (uid != null) {
                var usersAccessGroup = firebase.database().ref('users/' + uid).child('accessGroup');
                usersAccessGroup.update({ [accessGroupForUpdate]: accessTypeForUpdate });
                refreshUserAccessTags();
                Swal.fire("成功", "用户" + email + "的" + accessGroupForUpdateText + "已" + accessTypeForUpdateText, "success");
            } else {
                Swal.fire("失败", "邮箱错误", "error");
            }
        });

    }
}

function refreshUserAccessTags() {
    var userEmail = document.getElementById('acctUserEmailForAccessGroup').value;
    var accessTags = document.getElementById('access_tags');
    accessTags.innerHTML = null;
    var tags = "";
    userEmailLookUpTable(userEmail).then(function (uid) {
        if (uid != null) {
            firebase.database().ref('users/' + uid).child('accessGroup').once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val() === 'true') {
                        tags += "<span class='access_tag'>" + childSnapshot.key + "</span>";
                    }
                });
                accessTags.innerHTML = tags;
            });
        }
    });
}

function refreshTimeOutMinuteValueByLengthChange(){
    const sliderValue = document.querySelector(".length__title");
    const lengthEl = document.getElementById("timeOutInactiveMinute").value;
    sliderValue.setAttribute("data-length", lengthEl);
}

function showAndHideTimeOutInputOptions(){
    var goInactiveEnable = document.getElementById('goInactiveEnable').checked;
    const slider = document.querySelector(".range__slider");
    if(goInactiveEnable){
        slider.style.display="block";
    } else{
        slider.style.display="none";
    }
}