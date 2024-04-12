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
    var regex  = /^\$\d+(?:\.\d{0,2})$/;
    return regex.test(numStr)
};


const isValidDiscountRate = numStr => {
    var regex  = /(0\.\d{0,2})$/;
    return regex.test(numStr) || Number(numStr) === 1;
};

function wrapDiscountRate(input) {
    var output;
    output = input.val().replace(/[^0-9,.]/g, '');
    if(output.length>4){
        output = output.substr(0, 3);
    }
    input.val(output);
}

function textAreaLineControl(text, maxLength){
    text = text.replace("\n", " ").trim();
    var words = text.split(" "); 
    var pointer = words[0].length;
    for(var i = 1; i<words.length;i++){
        pointer += words[i].length + 1;
        if(pointer>maxLength){
            words[i-1] += '<br>';
            pointer = words[i].length + 1;
        } 
    }
    return words.join(" ");
}


function ClearOptionsFastAlt(id){
	document.getElementById(id).innerHTML = "";
}
