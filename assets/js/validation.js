"use strict";

function addNewMemberValidation(){
    var memberPetName = document.getElementById("memberPetName").value;
    var memberJoinDate = document.getElementById("memberJoinDate").value;
    var memberPhone = document.getElementById("memberPhone").value;
    var memberDiscountRate = document.getElementById("memberDiscountRate").value;
    var memberBalance = document.getElementById("memberBalance").value;
    var memberBalance_customize = document.getElementById("memberBalance_customize").value;


    if(((memberBalance === 'others' && checkValue(memberBalance_customize) && Number(memberBalance_customize!==0)) 
        || ( Number(memberBalance) === 0))
        || checkValue(memberPetName) || checkValue(memberJoinDate) || checkValue(memberPhone) || checkValue(memberDiscountRate)){
        Swal.fire("错误提醒", "必要内容不能为空", "warning");
        return false;
    }
    return true;
}


function addCreditValidation(){
    var add_credit_member_balance = document.getElementById("add_credit_member_balance").value;
    var add_credit_member_balance_customize = document.getElementById("add_credit_member_balance_customize").value;
    var add_credit_discountRate = document.getElementById("add_credit_discountRate").value;
    var add_credit_date = document.getElementById("add_credit_date").value;

    if(((add_credit_member_balance === 'others' && checkValue(add_credit_member_balance_customize) && Number(add_credit_member_balance_customize!==0)) 
        || ( Number(add_credit_member_balance) === 0))
        || checkValue(add_credit_member_balance) || checkValue(add_credit_discountRate) || checkValue(add_credit_date)){
        Swal.fire("错误提醒", "必要内容不能为空", "warning");
        return false;
    }
    return true;
}

function spendCreditValidation(){
    var spend_credit_member_balance = document.getElementById("member_spend_credit_balance").value;
    var spend_credit_date = document.getElementById("spend_credit_date").value;
    if(checkValue(spend_credit_member_balance) ||  checkValue(spend_credit_date)){
        Swal.fire("错误提醒", "必要内容不能为空", "warning");
        return false;
    }
    return true;
}

function updateMemberInfoValidation(){
    var memberPetName = document.getElementById("memberPetNameInfo").value;
    var memberJoinDate = document.getElementById("memberJoinDateInfo").value;
    var memberPhone = document.getElementById("memberPhoneInfo").value;
    var memberDiscountRate = document.getElementById("memberDiscountRateInfo").value;
    var memberBalance = document.getElementById("memberBalanceInfo").value;

    if(checkValue(memberPetName) || checkValue(memberJoinDate) || checkValue(memberPhone) || checkValue(memberDiscountRate) || checkValue(memberBalance)){
        Swal.fire("错误提醒", "必要内容不能为空", "warning");
        return false;
    }
    return true;
}

function updateEmailNoticeInfoValidation(){

    var publicKey = document.getElementById('publicKey').value;
    var serviceId = document.getElementById('serviceId').value;
    var templateId = document.getElementById('templateId').value;
    var fromName = document.getElementById('fromName').value;
    var toName = document.getElementById('toName').value;
    var replyTo = document.getElementById('replyTo').value;


    if(checkValue(publicKey) || checkValue(serviceId) || checkValue(templateId) || checkValue(fromName) || checkValue(toName) || checkValue(replyTo)){
        Swal.fire("错误提醒", "必要内容不能为空", "warning");
        return false;
    }
    return true;
}


function updateTransactionValidation(){
    var transactionAmountInfo = document.getElementById("transactionAmountInfo").value;
    var transactionDateInfo = document.getElementById("transactionDateInfo").value;
    if(checkValue(transactionAmountInfo) ||  checkValue(transactionDateInfo)){
        Swal.fire("错误提醒", "必要内容不能为空", "warning");
        return false;
    }
    return true;
}



function checkValue(value){
    if(value === undefined || value === null || value === "" ){
        return true;
    }else{
        return false;
    }
}