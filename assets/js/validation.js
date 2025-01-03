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
    var memberPetName = document.getElementById("memberIdSearchedForEdit").value;
    var memberJoinDate = document.getElementById("memberJoinDateSearchedForEdit").value;
    var memberPhone = document.getElementById("memberPhoneSearchedForEdit").value;
    var memberDiscountRate = document.getElementById("memberDiscountRateSearchedForEdit").value;
    var memberBalance = document.getElementById("memberBalanceSearchedForEdit").value;

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

function uploadDocVacFileValidation(){
    var fileName = document.getElementById("fileName").value;
    var fileType = document.getElementById("fileType").value;
    var doc_vac_petName = document.getElementById("doc_vac_petName").value;
    var doc_vac_breed = document.getElementById("doc_vac_breed").value;
    var doc_vac_expiredDate = document.getElementById("doc_vac_expiredDate").value;
    var file = document.getElementById("chooseFile").files[0];


    if(checkValue(fileName) ||  checkValue(fileType) ||  checkValue(doc_vac_petName) ||  checkValue(doc_vac_breed) || checkValue(doc_vac_expiredDate)){
        Swal.fire("错误提醒", "必要内容不能为空", "warning");
        return false;
    }

    if(file == null){
        Swal.fire("错误提醒", "上传文件不能为空", "warning");
        return false;
    }
    return true;

}

function searchFilesValidation(){
    var fileType = document.getElementById("search_fileType").value;
    var petType = document.getElementById("search_vac_doc_petType_forSearch").value;
    var filterType = document.getElementById("search_vac_doc_catagory_forSearch").value;
    var filterInputValue = document.getElementById("search_vac_doc_input_value_forSearch").value;

    if(checkValue(fileType)){
        Swal.fire("错误提醒", "请选择文件类型", "warning");
        return false;
    }
    if(fileType === 'vaccines'&& checkValue(petType)) {
        Swal.fire("错误提醒", "请选择宠物类型", "warning");
        return false;
    }

    if(fileType === 'vaccines'&& filterType !== 'searchByPetBreed' && checkValue(filterInputValue)){
        Swal.fire("错误提醒", "请输入查询内容", "warning");
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