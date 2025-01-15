$(document).ready(function () {

    generateNavigation("navFile");

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
    document.getElementById('fileCreatedDate').valueAsDate = getCurrentNYDate();

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
