
function getCreditSalePrice() {
    var cashPrice = document.getElementById("cash-price").value;
    var nycTax = 0;
    var creditPrice = (cashPrice * 1.05).toFixed(2);
    document.getElementById("creditPrice").innerHTML = "$" + creditPrice;

    if (document.getElementById("taxAdded").checked) {
        nycTax = (creditPrice * 0.08875).toFixed(2);
        document.getElementById("nycTax").innerHTML = "$" + nycTax;
    } else if (document.getElementById("taxRemoved").checked) {
        document.getElementById("nycTax").innerHTML = "$" + nycTax;
    }
    var totalPrice = (Number(creditPrice) + Number(nycTax)).toFixed(2);
    document.getElementById("totalPrice").innerHTML = "$" + totalPrice;
}

$(document).ready(function () {

    generateNavigation("navTools");

    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    $('#datePicker').datepicker({ //initiate JQueryUI datepicker
        showAnim: 'fadeIn',
        dateFormat: "dd/mm/yy",
        firstDay: 1, //first day is Monday
        beforeShowDay: function (date) {
            //only allow Mondays to be selected
            return [date.getDay() == 1, ""];
        },
        onSelect: populateDates
    });

    $("select[id='timePeriod']").on({
        change: function (){
            if($(this).val()==='1'){
                weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            }else{
                weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            }
            var date = document.getElementById('datePicker').value;
            if(date){
                populateDates();
            }            
        }
    });

    function populateDates() {
        $('#tBody').empty(); //clear table
        $('.bottom').removeClass('d-none'); //display total hours worked
        let chosenDate = $('#datePicker').datepicker('getDate'); //get chosen date from datepicker
        let newDate;
        var monStartWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if(weekDays.length == 14){
            monStartWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday','Monday1', 'Tuesday1', 'Wednesday1', 'Thursday1', 'Friday1', 'Saturday1', 'Sunday1'];
        }
        for (let i = 0; i < weekDays.length; i++) { //iterate through each weekday
            newDate = new Date(chosenDate); //create date object
            newDate.setDate(chosenDate.getDate() + i); //increment set date
            //append results to table
            $('#tBody').append(`
                <tr>
                    <td class="day">${weekDays[newDate.getDay()].slice(0, 3)}</td>
                    <td class="date">${newDate.getDate()} / ${newDate.getMonth() + 1} / ${newDate.getFullYear()}</td>
                    <td class="start-time"><input id="startTime${monStartWeekDays[i]}"    maxlength="5" class="time ui-timepicker-input" type="timeFormat" /></td>
                    <td class="finish-time"><input id="finishTime${monStartWeekDays[i]}"  maxlength="5" class="time ui-timepicker-input" type="timeFormat" /></td></td>
                    <td class="hours-worked" id="hoursWorked${monStartWeekDays[i]}">
                        0
                    </td>
                </tr>
            `);

            //function to calculate hours worked
            let calculateHours = () => {
                let startVal = $(`#startTime${monStartWeekDays[i]}`).val();
                let finishVal = $(`#finishTime${monStartWeekDays[i]}`).val();
                let startTime = new Date(`01/01/2024 ${startVal}`);
                let finishTime = new Date(`01/01/2024 ${finishVal}`);
                let hoursWorked = ((finishTime.getTime() - startTime.getTime()) / 1000);
                hoursWorked /= (60 * 60);
                if (startVal && finishVal && hoursWorked >= 0) { //providing both start and finish times are set
                    $(`#hoursWorked${monStartWeekDays[i]}`).html(Number(hoursWorked).toFixed(2));
                } else if(startTime == "Invalid Date") {
                    Swal.fire({
                        iconHtml: '<img src="../assets/images/error.gif">',
                        customClass: {
                            icon: 'no-border'
                        },
                        html: '<i class="fas fa-exclamation-circle" style="color:red"></i>Invalid Time',
                        showConfirmButton: false,
                        footer: 'Invalid Time'
                    });
                    $(`#startTime${monStartWeekDays[i]}`).val("");
                } else if (finishTime == "Invalid Date"){
                    Swal.fire({
                        iconHtml: '<img src="../assets/images/error.gif">',
                        customClass: {
                            icon: 'no-border'
                        },
                        html: '<i class="fas fa-exclamation-circle" style="color:red"></i>Invalid Time',
                        showConfirmButton: false,
                        footer: 'Invalid Time'
                    });
                    $(`#finishTime${monStartWeekDays[i]}`).val("");
                }
                updateTotal();
            }
            //initiate function whenever an input value is changed
            $(`#startTime${monStartWeekDays[i]}, #finishTime${monStartWeekDays[i]}`).on('change', calculateHours);


        }

        $("input[type='timeFormat']").on({
            click: function () {
                $(this).val('');
            },
            keyup: function () {
                formatTime($(this));
            }
        });
    }


    $("input[id='hourlyRate']").on({
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
        },
    });

});

function updateTotal() { //function to update the total hours worked
    let totalHoursWorked = 0;
    let hrs = document.querySelectorAll('.hours-worked');
    hrs.forEach(function (val) {
        totalHoursWorked += Number(val.innerHTML);
    });
    var hourlyRate = document.getElementById('hourlyRate').value;
    document.querySelector('#totalHours').innerHTML = totalHoursWorked.toFixed(2);
    document.querySelector('#totalWages').innerHTML = (totalHoursWorked * convertCurrencyToNumber(hourlyRate)).toFixed(2);
}



function formatTime(input) {
    var timeValue = input.val(); 
    var output;
    output = wrapTime(timeValue);
    input.val(output);
}

function wrapTime(timeValue) {
    var output;
    timeValue = timeValue.replace(/[^0-9]/g, '');
    var hour = timeValue.substr(0, 2);
    var minute = timeValue.substr(2, 4);


    
    if (hour.length < 2) {
        output = hour;
    } else if (hour.length == 2 && minute.length < 2) {
        output = hour + ":" + minute;
    } else if (hour.length == 2 && minute.length >= 2) {
        output = hour + ":" + minute;
    }
       
    return output;
}