
//VARIABLES RETURN DEL URL
var viewR = ""
var controller = ""
var urll = ""
var countWrongPwd = 1;
const rgb2hexPVG = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
$(document).ready(function () {
    urll = window.location.href;
    if (urll.split('ReturnUrl')[0] != "") {
        controller = urll.split('%2f')[1];
        viewR = urll.split('%2f')[2];
    }
});

$("#LoginForm").validate({
    rules: {
        Username: {
            required: true
        },
        Password: {
            required: true
        }
    },
    messages: {
        Username: {
            required: "El Campo no puede ser nulo"
        },
        Password: {
            required: "El Campo no puede ser nulo",
        }
    },
    submitHandler: function (form) {
        StartLoading();
        $.ajax({
            type: "POST",
            url: "/Home/LoginEnter/",
            data: $(form).serialize(),
            success: function (returndate) {
                if (returndate.success == true) {
                    var baseUrl = window.location.origin;
                    if (viewR == undefined && controller == undefined || urll.split('%2f')[3] != null)                      
                        window.location.href = baseUrl + '/Home/Index';
                    else {                   
                        window.location.href = baseUrl + '/' + controller + '/' + viewR;
                    }
                }
                else {
                    EndLoading();
                    toastr.warning('Alerta - ' + returndate.responseText + '');
                    if (returndate.responseText) {
                        if (returndate.responseText == "Esta cuenta se encuentra bloqueada.") {
                            var input_error = document.getElementById("BlockLi");
                            input_error.classList.add('error_input');
                            setTimeout(function () {
                                input_error.classList.remove('error_input');
                            }, 3000);
                        } else if (returndate.responseText == "Contraseña Incorrecta, intenta de nuevo.") {
                            if (countWrongPwd > 1) {
                                var input_error = document.getElementById("PassWordLi");
                                input_error.classList.add('error_input');
                                setTimeout(function () {
                                    input_error.classList.remove('error_input');
                                }, 3000);
                            }
                            countWrongPwd += 1;
                        }
                    }
                }
            },
            error: function (returndate) {
                toastr.error('Error inesperado contactar a sistemas.');
                EndLoading();
            }
        });
        return false;
    }
});

var user_clicks_login = 0;
function ClickLoadAllSites() {
    user_clicks_login++;
    if (user_clicks_login >= 3) {
        PartialViewSitesPVGModal(12, "PVContainerMainModal", 4);
        $("#PVbtnSaveProcess").addClass("hide");
        $("#PVTitleMainModalDetail").removeClass("hide");
        $('#PVMainModal').modal('show');
        user_clicks_login = 0;
    }
}


document.addEventListener('keydown', (e) => {
    if (e.key) {
        if (e.key.toLowerCase() === 'l' && e.ctrlKey && e.shiftKey) {
            PartialViewSitesPVGModal(14, "PVContainerMainModal", 4);
            $("#PVbtnSaveProcess").addClass("hide");
            $("#PVTitleMainModalDetail").removeClass("hide");
            $('#PVMainModal').modal('show');
        }
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key) {
        if (e.key.toLowerCase() === 'f' && e.ctrlKey && e.shiftKey) {
            PartialViewSitesPVGModal(12, "PVContainerMainModal", 4);
            $("#PVbtnSaveProcess").addClass("hide");
            $("#PVTitleMainModalDetail").removeClass("hide");
            $('#PVMainModal').modal('show');
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.keyCode == 123 && e.ctrlKey && e.shiftKey) {
        PartialViewSitesPVGModal(13, "PVContainerMainModal", 5);
        $("#PVbtnSaveProcess").addClass("hide");
        $("#PVTitleMainModalDetail").removeClass("hide");
        $('#PVMainModal').modal('show');
    }
});

function CheckSitesDistrictPVG(district) {
    var isCheckDistrict = ("#ffffff" == rgb2hexPVG($("#" + district).css("Color"))) ? true : false;
    $('#CheckBoxesSitesPVG input[type="checkbox"]').each(function () {
        if ($(this).attr('name') + "MG" == district) {
            if (isCheckDistrict)
                $('#' + $(this).attr('id')).iCheck('uncheck');
            else
                $('#' + $(this).attr('id')).iCheck('check');
        }
    });
    CheckValidateAllDistricts();
}

function CheckValidateAllDistricts() {
    var list_district = [];
    $('#CheckBoxesSitesPVG input[type="checkbox"]').each(function () {
        if ($(this).attr('id') != "All") {
            if (!list_district.includes(this.name))
                list_district.push(this.name);
        }
    });
    $.each(list_district, function (index, value) {
        if (value != "C1") {
            if ($('#CheckBoxesSitesPVG input[type="checkbox"][name="' + value + '"]').length == $('#CheckBoxesSitesPVG input[type="checkbox"][name="' + value + '"]:checked').length) {
                value = value + "MG";
                if ($("#" + value).length) {
                    document.getElementById(value).style.backgroundColor = "#68A84B";
                    document.getElementById(value).style.color = "white";
                }
            } else {
                value = value + "MG";
                if ($("#" + value).length) {
                    document.getElementById(value).style.backgroundColor = "white";
                    document.getElementById(value).style.color = "#606265";
                }
            }
        }
    });
}

function PartialViewSitesPVGModal(number_table, id_div, is_format) {
    StartLoading();
    var url_direction_partial_view = "";
    if (number_table == 1)
        url_direction_partial_view = "/Home/ActionSite4Columns";
    else if (number_table == 2)
        url_direction_partial_view = "/Home/ActionSite4ColumnsPaginator";
    else if (number_table == 3)
        url_direction_partial_view = "/Home/ActionSite3Columns";
    else if (number_table == 4)
        url_direction_partial_view = "/Home/ActionSite3ColumnsPaginator";
    else if (number_table == 5)
        url_direction_partial_view = "/Home/ActionSites2ColumnsPercentage";
    else if (number_table == 6)
        url_direction_partial_view = "/Home/ActionSites2ColumnsPercentagePaginator";
    else if (number_table == 7)
        url_direction_partial_view = "/Home/ActionSites2ColumnsInputs";
    else if (number_table == 8)
        url_direction_partial_view = "/Home/ActionSites2ColumnsInputsPaginator";
    else if (number_table == 9)
        url_direction_partial_view = "/Home/ActionSites2ColumnsInputsShowAmount";
    else if (number_table == 10)
        url_direction_partial_view = "/Home/ActionSites2Columns2Inputs";
    else if (number_table == 11)
        url_direction_partial_view = "/Home/ActionSites2Columns2InputsShowAmount";
    else if (number_table == 12)
        url_direction_partial_view = "/Home/ActionSiteColumnsSelect";//ActionSiteColumnsSelect//ActionCameraTakeSnapshotOne
    else if (number_table == 13)
        url_direction_partial_view = "/Home/ActionSiteColumnsSelectAutoupdate";
    else if (number_table == 14)
        url_direction_partial_view = "/Home/ActionCameraTakeSnapshotOne";
    else
        url_direction_partial_view = "/Home/ActionSite4Columns";
    $.ajax({
        type: "POST",
        url: url_direction_partial_view,
        data: { "is_format": is_format },
        success: function (partialView) {
            $('#' + id_div).html(partialView + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>");
            PutClassICheckPV();
            EndLoading();
        },
        error: function () {
            toastr.error("DESCONOCIDO, CONTACTA A SISTEMAS AL CARGAR LA VISTA PARCIAL.")
            EndLoading();
        }
    });
}

function PutClassICheckPV() {
    $('input[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_square-green',
    }).on('ifClicked', function () {
        $(this).trigger("click");
    });
}