$(document).ready(function () {
    employeeSelectedOptionForAdminManagement();
    readAcctUserInfoTable('acctUserInfo_table');
    readAcctUserInfoTable('acctUserInfo_table_copy');
    readEmailNoticeInfo();
    isAdmin("adminsection");
    setup();

    $('#employeeTable').DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        text: 'create',
                        action: function () {
                            createEmployeePanel();
                        }
                    },
                    {
                        text: 'edit',
                        action: function () {
                            editEmployeePanel();
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

    const table = new DataTable('#employeeTable');
    table.on('click', 'tbody tr', (e) => {
        let classList = e.currentTarget.classList;

        if (classList.contains('selected')) {
            classList.remove('selected');
        }
        else {
            table.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
            classList.add('selected');
        }
    });

    readEmployeeInfoTable();
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
});

function createEmployeePanel() {
    Swal.fire({
        title: "New Employee",
        confirmButtonText: "Save",
        showCancelButton: true,
        html: `
            <label for="employeeNameForAdding" class="required">姓名</label><input id="employeeNameForAdding" class="swal2-input">
            <br>
            <label for="employeePositionForAdding" class="nonRequired">职位</label><input id="employeePositionForAdding" class="swal2-input">
            <br>
            <label for="employeePhoneForAdding" class="nonRequired">电话</label><input id="employeePhoneForAdding" type="tel" class="swal2-input">
        `
    }).then((result) => {
        if (result.isConfirmed) {
            var employeeName = document.getElementById('employeeNameForAdding').value.trim();
            if (employeeName == null || employeeName == "") {
                Swal.fire("错误提醒", "请输入员工名字", "warning");
            } else {
                var employeePosition = document.getElementById('employeePositionForAdding').value;
                var employeePhone = document.getElementById('employeePhoneForAdding').value;
                generateNewEmployeeId().then(function (newEmployeeId) {
                    var employeeInfo = firebase.database().ref('employees/' + newEmployeeId);
                    employeeInfo.set({ 'employeeName': employeeName, 'employeePosition': employeePosition, 'employeePhone': employeePhone });
                    Swal.fire("成功", "会员信息已保存: " + newEmployeeId, "success");
                });
            }
        }
    });
}


function editEmployeePanel() {

    const table = new DataTable('#employeeTable');
    employeeData = table.row('.selected').data();
    if (employeeData === undefined || employeeData === null) {
        Swal.fire("错误提醒", "请点击修改的员工", "warning");
    }

    Swal.fire({
        title: "Edit Employee",
        confirmButtonText: "Save",
        showCancelButton: true,
        html: `
            <label for="employeeIdForEdit" class="required">工号</label><input id="employeeIdForEdit" style='background:#efefef;' value="${employeeData[0]}"  class="swal2-input" readonly>
            <br>
            <label for="employeeNameForEdit" class="required">姓名</label><input id="employeeNameForEdit" value="${employeeData[1]}" class="swal2-input">
            <br>
            <label for="employeePositionForEdit" class="nonRequired">职位</label><input id="employeePositionForEdit" value="${employeeData[2]}" class="swal2-input"> 
            <br>
            <label for="employeePhoneForEdit" class="nonRequired">电话</label><input id="employeePhoneForEdit" type="tel" value="${employeeData[3]}" class="swal2-input"> 
        `
    }).then((result) => {
        if (result.isConfirmed) {
            var employeeId = document.getElementById('employeeIdForEdit').value.trim();
            var employeeName = document.getElementById('employeeNameForEdit').value.trim();
            if (employeeName == null || employeeName == "") {
                Swal.fire("错误提醒", "请输入员工名字", "warning");
            } else {
                var employeePosition = document.getElementById('employeePositionForEdit').value;
                var employeePhone = document.getElementById('employeePhoneForEdit').value;

                var employeeInfo = firebase.database().ref('employees/' + employeeId);
                employeeInfo.update({ 'employeeName': employeeName, 'employeePosition': employeePosition, 'employeePhone': employeePhone });
                Swal.fire("成功", "会员信息已保存", "success");

            }
        }
    });
}

function employeeSelectedOptionForAdminManagement() {
    var employeeInfo = firebase.database().ref('employees/').orderByKey();
    var employeeSelectAttr = document.getElementById('addNewMemberByEmployeeInfo');
    var employeeSelectAttr1 = document.getElementById('search_employeeId_selection');
    var employeeSelectAttr2 = document.getElementById('transactionByEmployeeInfo');
    employeeInfo.on("value", function (snapshot) {
        ClearOptionsFastAlt('addNewMemberByEmployeeInfo');
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
function findMemberByIdForEditInfo() {

    var memberId = document.getElementById('memberIdSearchingForEditInfo').value.trim();
    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请输入会员账号", "warning");
    } else {

        var memberInfo = firebase.database().ref('members/' + memberId);
        memberInfo.once('value').then(snapshot => {
            var Data = snapshot;
            if (!snapshot.exists()) {
                Swal.fire("错误提醒", "查询的会员账号： " + snapshot.key + " 不存在", "error");
                document.getElementById('memberIdInfo').value = null;
                document.getElementById('memberNameInfo').value = null;
                document.getElementById('memberPetNameInfo').value = null;
                document.getElementById('memberPetBreedInfo').value = null;
                document.getElementById('memberPetGenderInfo').value = null;
                document.getElementById('memberJoinDateInfo').value = null;
                document.getElementById('memberPhoneInfo').value = null;
                document.getElementById('memberBalanceInfo').value = null;
                document.getElementById('memberDiscountRateInfo').value = null;
                document.getElementById('addNewMemberByEmployeeInfo').value = null;
                document.getElementById('addNewMemberNoteInfo').value = null;
            } else {
                var memberId = Data.key;
                var memberName = Data.child("memberName").val();
                var memberPetName = Data.child("memberPetName").val();
                var memberPetBreed = Data.child("memberPetBreed").val();
                var memberPetGender = Data.child("memberPetGender").val();
                var memberJoinDate = Data.child('memberJoinDate').val();
                var memberPhone = Data.child("memberPhone").val();
                var memberDiscountRate = Data.child("memberDiscountRate").val();
                var memberBalance = Data.child("memberBalance").val();
                var addNewMemberByEmployee = Data.child("employee").val();
                var addNewMemberNote = Data.child("note").val();
                current_employee_for_new_member = addNewMemberByEmployee;
                document.getElementById('memberIdInfo').value = memberId;
                document.getElementById('memberNameInfo').value = memberName;
                document.getElementById('memberPetNameInfo').value = memberPetName;
                document.getElementById('memberPetBreedInfo').value = memberPetBreed;
                document.getElementById('memberPetGenderInfo').value = memberPetGender;
                document.getElementById('memberJoinDateInfo').value = memberJoinDate;
                document.getElementById('memberPhoneInfo').value = memberPhone;
                document.getElementById('memberBalanceInfo').value = memberBalance;
                document.getElementById('memberDiscountRateInfo').value = memberDiscountRate;
                document.getElementById('addNewMemberByEmployeeInfo').value = addNewMemberByEmployee;
                document.getElementById('addNewMemberNoteInfo').value = addNewMemberNote;
            }
        });
    }
}

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

    var memberId = document.getElementById('memberIdInfo').value.trim();
    if (memberId == null || memberId == "") {
        Swal.fire("错误提醒", "请输入会员账号", "warning");
    } else if (!updateMemberInfoValidation()) {
        return;
    } else {

        memberName = document.getElementById('memberNameInfo').value;
        memberPetName = document.getElementById('memberPetNameInfo').value;
        memberPetBreed = document.getElementById('memberPetBreedInfo').value;
        memberPetGender = document.getElementById('memberPetGenderInfo').value;
        memberJoinDate = document.getElementById('memberJoinDateInfo').value;
        memberPhone = document.getElementById('memberPhoneInfo').value;
        memberBalance = document.getElementById('memberBalanceInfo').value;
        memberBalance = convertCurrencyToNumber(memberBalance);
        memberDiscountRate = document.getElementById('memberDiscountRateInfo').value;
        addNewMemberByEmployee = document.getElementById('addNewMemberByEmployeeInfo').value;
        addNewMemberNote = document.getElementById('addNewMemberNoteInfo').value;
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
        transactionInfoLookUpTable(oldTransactionId).then(function (result) {
            if (result != null) {
                var remainingBalanceForUpdatedTransaction = 0;
                if (result['type'] == 'addCredit') {
                    remainingBalanceForUpdatedTransaction = Number(result['remainingBalance']) - Number(result['amount']) + Number(UpdatedTransactionInfoDetail['amount']);
                } else if (result['type'] == 'spendCredit') {
                    remainingBalanceForUpdatedTransaction = Number(result['remainingBalance']) + Number(result['amount']) - Number(UpdatedTransactionInfoDetail['amount']);
                }
                UpdatedTransactionInfoDetail['memberRemainingBalance'] = Number(remainingBalanceForUpdatedTransaction).toFixed(2);
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
                memberInfo.update({ 'memberBalance': Number(backward_amount).toFixed(2), 'memberDiscountRate': transactionDiscountRate });
                Swal.fire("成功", "用户：" + transactionMemberId + " 金额 $" + transactionAmount + "已经返还. 用户最新余额为：$" + backward_amount, "success");
            }
        }
        return isValidTransaction;
    });

}


function updateTransactionForEmployeeChange(memberId, newEmployeeId) {

    var transactionInfo = firebase.database().ref('transactions/');

    transactionInfo.orderByChild('type').equalTo('newMember').on("value", function (snapshot) {

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

    transactionInfo.orderByChild('type').equalTo('newMember').on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var Data = childSnapshot;
            if (Data.child("employeeId").val() == employeeId) {
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


function addEmployee() {
    var employeeName = document.getElementById('employeeNameForAdding').value.trim();
    if (employeeName == null || employeeName == "") {
        Swal.fire("错误提醒", "请输入员工名字", "warning");
    } else {
        var employeeId = document.getElementById('employeeIdForAdding').value;
        var employeeName = document.getElementById('employeeNameForAdding').value;
        var employeePosition = document.getElementById('employeePositionForAdding').value;
        var employeePhone = document.getElementById('employeePhoneForAdding').value;
        var employeeInfo = firebase.database().ref('employees/' + employeeId);
        employeeInfo.set({ 'employeeName': employeeName, 'employeePosition': employeePosition, 'employeePhone': employeePhone });
        Swal.fire("成功", "会员信息已保存", "success");
        // location.reload();
    }

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
    }
}

function readAcctUserInfoTable(tableId) {

    var query = firebase.database().ref('users/').orderByKey();

    query.once("value", function (snapshot) {

        var table = document.getElementById(tableId);

        // clear up old data to reduce duplication
        table.innerHTML = null;

        snapshot.forEach(function (childSnapshot) {
            var table = document.getElementById(tableId);
            var email = childSnapshot.child("email").val();
            var isAdminRole = childSnapshot.child("isAdmin").val();
            var row = '<tr>' +
                '<td>' + email + '</td>' +
                '<td>' + isAdminRole + '</td>' +
                '</tr>';
            table.innerHTML += row;
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
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.set({ 'emailNotification': emailNotificationOn, 'discountRateEditable': discountRateEditable, 'discountRateAutoApply': discountRateAutoApply, 'duplicatedPhoneCheck': duplicatedPhoneCheck });
    Swal.fire("成功", "设置已更改", "success");
}


function loadingSetting() {
    var settingInfo = firebase.database().ref('setting/');
    settingInfo.once("value", function (snapshot) {
        document.getElementById('emailNotification').checked = snapshot.child('emailNotification').val();
        document.getElementById('discountRateEditable').checked = snapshot.child('discountRateEditable').val();
        document.getElementById('discountRateAutoApply').checked = snapshot.child('discountRateAutoApply').val();
        document.getElementById('duplicatedPhoneCheck').checked = snapshot.child('duplicatedPhoneCheck').val();
    });
}