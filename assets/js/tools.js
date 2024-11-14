
function getCreditSalePrice() {
    var cashPrice = document.getElementById("cash-price").value;
    var nycTax = 0;
    var creditPrice = (cashPrice * 1.05).toFixed(2);
    document.getElementById("creditPrice").innerHTML = "$"+creditPrice;

    if (document.getElementById("taxAdded").checked) {
        nycTax = (creditPrice * 0.08875).toFixed(2);
        document.getElementById("nycTax").innerHTML = "$"+nycTax;
    } else if (document.getElementById("taxRemoved").checked) {
        document.getElementById("nycTax").innerHTML = "$"+nycTax;
    }
    var totalPrice = (Number(creditPrice) + Number(nycTax)).toFixed(2);
    document.getElementById("totalPrice").innerHTML = "$"+totalPrice;
}

