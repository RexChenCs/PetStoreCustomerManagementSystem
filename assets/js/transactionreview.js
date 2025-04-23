jQuery(document).ready(function ($) {

    generateNavigation("navTrans");

    $("input[id='search_transaction_memberId']").on({
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
});

let totalSpend = 0; // Total for spendCredit
let totalNewMember = 0; // Total for newMember
let totalAddCredit = 0; // Total for addCredit

function searchTransactions() {


    totalSpend = 0; // Total for spendCredit
    totalNewMember = 0; // Total for newMember
    totalAddCredit = 0; // Total for addCredit
    // Update the footer with the totals
    document.getElementById('total_spend').textContent = `$${totalSpend.toFixed(2)}`;
    document.getElementById('total_new_member').textContent = `$${totalNewMember.toFixed(2)}`;
    document.getElementById('total_add_credit').textContent = `$${totalAddCredit.toFixed(2)}`;

    var memberId = document.getElementById('search_transaction_memberId').value;
    var startDate = document.getElementById('search_transaction_starDate').valueAsDate;
    var endDate = document.getElementById('search_transaction_endDate').valueAsDate;
    var transactionType = document.getElementById('search_transaction_type').value;
    var tableBody = document.getElementById('transaction_table');
    tableBody.innerHTML = null;
    if (memberId == "") {
        if (startDate > endDate && startDate != null && endDate != null) {
            Swal.fire("错误提醒", "开始时间不能大于结束时间", "warning");
        } else {
            searchTransactionByDate(startDate, endDate, transactionType);
        }
    } else {
        searchTransactionByIdAndDate(memberId, startDate, endDate, transactionType);
    }
}


function searchTransactionByDate(startDate, endDate, type) {

    var transactionInfo = firebase.database().ref('transactions/');

    transactionInfo.on("value", function (snapshot) {
        let transactionCount = 0;
        snapshot.forEach(function (childSnapshot) {

            var date = childSnapshot.child("date").val();
            var transactionType = childSnapshot.child("type").val();

            if (startDate != null && endDate == null && new Date(date) >= new Date(startDate) && (type === 'all' || type === transactionType)) {
                transactionCount++;
                generateTransactionTable(childSnapshot);

            } else if (startDate == null && endDate != null && new Date(date) <= new Date(endDate) && (type === 'all' || type === transactionType)) {
                transactionCount++;
                generateTransactionTable(childSnapshot);

            } else if (startDate != null && endDate != null && new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate) && (type === 'all' || type === transactionType)) {
                transactionCount++;
                generateTransactionTable(childSnapshot);

            } else if (startDate == null && endDate == null && (type === 'all' || type === transactionType)) {
                transactionCount++;
                generateTransactionTable(childSnapshot);

            }

            if (transactionCount === 0) {
                const tableBody = document.getElementById('transaction_table');
                const noRecordsRowInfo = '<tr id="no_records_row"><td colspan="9" class="text-center text-muted">暂无记录</td></tr>';
                tableBody.innerHTML = noRecordsRowInfo;
            } else {
                const noRecordsRow = document.getElementById('no_records_row');
                if (noRecordsRow) {
                    noRecordsRow.remove();
                }
            }
        });
    });
}


function searchTransactionByIdAndDate(memberId, startDate, endDate, type) {

    firebase.database().ref('transactions/').orderByChild('memberId').equalTo(memberId).once("value", function (snapshot) {

        if (!snapshot.exists()) {
            Swal.fire("错误提醒", "查询的会员账号： " + memberId + " 不存在", "error");
        } else if (startDate > endDate && startDate != null && endDate != null) {
            Swal.fire("错误提醒", "开始时间不能大于结束时间", "warning");
        } else {

            snapshot.forEach(function (childSnapshot) {
                var transactionCount = 0;
                var date = childSnapshot.child("date").val();

                if (startDate != null && endDate == null && new Date(date) >= new Date(startDate) && (type === 'all' || type === transactionType)) {
                    transactionCount++;
                    generateTransactionTable(childSnapshot);

                } else if (startDate == null && endDate != null && new Date(date) <= new Date(endDate) && (type === 'all' || type === transactionType)) {
                    transactionCount++;
                    generateTransactionTable(childSnapshot);

                } else if (startDate != null && endDate != null && new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate) && (type === 'all' || type === transactionType)) {
                    transactionCount++;
                    generateTransactionTable(childSnapshot);

                } else if (startDate == null && endDate == null && (type === 'all' || type === transactionType)) {
                    transactionCount++;
                    generateTransactionTable(childSnapshot);

                }

                if (transactionCount === 0) {
                    const tableBody = document.getElementById('transaction_table');
                    const noRecordsRowInfo = '<tr id="no_records_row"><td colspan="9" class="text-center text-muted">暂无记录</td></tr>';
                    tableBody.innerHTML = noRecordsRowInfo;
                } else {
                    const noRecordsRow = document.getElementById('no_records_row');
                    if (noRecordsRow) {
                        noRecordsRow.remove();
                    }
                }

            });
        }
    });



}

function generateTransactionTable(data) {

    var table = document.getElementById('transaction_table');
    var transactionId = data.key;

    var memberId = data.child("memberId").val();
    var transactionDate = data.child("date").val();
    var transactionType = data.child("type").val();
    var transactionAmount = parseFloat(data.child("amount").val()) || 0; // Ensure amount is a number
    var memberRemainingBalance = data.child("memberRemainingBalance").val();
    var transactionStatus = data.child("status").val();
    var transactionNote = data.child("note").val();
    var transactionTypeConv;
    if (transactionType == 'spendCredit') {
        transactionTypeConv = "消费";
    } else if (transactionType == 'addCredit') {
        transactionTypeConv = "充值";
    } else {
        transactionTypeConv = "开户";
    }
    var transactionStatusConv;
    if (transactionStatus == 'paid') {
        transactionStatusConv = "已付";
    } else if (transactionStatus == 'void') {
        transactionStatusConv = "已作废";
    }

    memberInfoLookUpTable(memberId).then(function (memberInfo) {

        if (transactionNote === null || transactionNote === '') {
            transactionNote = '未备注';
        } else {
            transactionNote = '<i class="fa fa-search" onclick=checkTransactionNoteDetail("' + transactionId + '")>查看备注</i>'
        }
        var row = '<tr>' +
            '<td>' + transactionId + '</td>' +
            '<td>' + memberId + '</td>' +
            '<td>' + memberInfo.child('memberPetName').val() + '</td>' +
            '<td>' + transactionDate + '</td>' +
            '<td>' + transactionTypeConv + '</td>' +
            '<td>$' + transactionAmount.toFixed(2) + '</td>' +
            '<td>$' + memberRemainingBalance + '</td>' +
            '<td>' + transactionStatusConv + '</td>' +
            '<td>' + transactionNote + '</td>' +
            '</tr>';
        table.innerHTML += row;

        // Update totals based on transaction type
        if (transactionType === 'spendCredit') {
            totalSpend += transactionAmount;
        } else if (transactionType === 'newMember') {
            totalNewMember += transactionAmount;
        } else if (transactionType === 'addCredit') {
            totalAddCredit += transactionAmount;
        }

        // Update the footer with the totals
        document.getElementById('total_spend').textContent = `$${totalSpend.toFixed(2)}`;
        document.getElementById('total_new_member').textContent = `$${totalNewMember.toFixed(2)}`;
        document.getElementById('total_add_credit').textContent = `$${totalAddCredit.toFixed(2)}`;

    });
}

function checkTransactionNoteDetail(transactionId) {
    firebase.database().ref("transactions/" + transactionId).once("value", function (snapshot) {
        Swal.fire('备注详情', snapshot.child('note').val());
    });
}

function getEmployeeNameById(employeeId) {
    var employeeName;
    var query = firebase.database().ref('employees/' + employeeId);
    employeeName = query.on("value", function (snapshot) {
        employeeName = snapshot.child('employeeName').val();
    });
    return employeeName;
}