"use strict";

jQuery(document).ready(function ($) {

    $("input[id='inputForPetNames']").on({
        click: function () {
            readMembershipOverviewTable();
        }
    });
    // readMembershipOverviewTable();
    generateNavigation("navHome");
	
    
});

function membershipOverviewSearch() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("inputForPetNames");
  filter = input.value.toUpperCase();
  table = document.getElementById("membershipOverviewTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


function readMembershipOverviewTable() {

    var query = firebase.database().ref('members/').orderByKey();

    query.on("value", function (snapshot) {

        var table = document.getElementById('membershipOverviewTableBody');
        // clear up old data to reduce duplication
        // table.innerHTML = '<tr class="header"> <th style="width:20%;">宠物名</th><th style="width:20%;">会员号</th><th style="width:20%;">电话</th> <th style="width:20%;">会员折扣</th> <th style="width:20%;">余额</th></tr>';
        table.innerHTML =null;
        snapshot.forEach(function (childSnapshot) {
            var table = document.getElementById('membershipOverviewTableBody');
            var data = childSnapshot;

            var memberPetName = data.child("memberPetName").val();
            var memberPhone = data.child("memberPhone").val();
            var memberDiscountRate = data.child("memberDiscountRate").val();
            var memberBalance = data.child("memberBalance").val();
            var memberId = data.key;


            var row = '<tr>' +
                '<td>' + memberPetName + '</td>' +
                '<td>' + memberId + '</td>' +
                '<td>' + memberPhone + '</td>' +
                '<td>' + memberDiscountRate + '</td>' +
                '<td>$' + memberBalance + '</td>' +
                '</tr>';
            table.innerHTML += row;

        });
        navBar();
    });
}

