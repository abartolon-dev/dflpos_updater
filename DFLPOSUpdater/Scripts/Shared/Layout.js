let escKeyPressed = false;

function handleEscapeKey() {
    if ($("#searchingMainNoRepeat").is(":focus")) {
        $('#search_containerNoRepeat').html('');
        $('#search_containerNoRepeat').removeClass('show');

        $(document).off('keydown.navegacion');

        $("#searchingMainNoRepeat").blur();

        escKeyPressed = true; 

        setTimeout(function () {
            escKeyPressed = false;
        }, 200);
    }
}

$(document).ready(function () {
    //window.setTimeout(function () {
    //    $(".normalheader").addClass("small-header");
    //    $("#fa").removeClass("fa-arrow-up").addClass("fa-arrow-down");
    //    $("#hbreadcrumb").removeClass("m-t-lg");
    //}, 5000);

    $('.select2').select2();

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            handleEscapeKey();
        } else if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            $('#searchingMainNoRepeat').focus().select();
        }
    });

    //$("input").attr("autocomplete", "off");
});

const rgb2hexPVG = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
var GlobalUserMasterSessionGlobalPV = "";
var pages = [];
$.ajax({
    url: '/Home/GetPagesByUser/',
    type: "GET",
    data: {},
    success: function (returndata) {
        if (returndata == "SF") {
            SessionFalse("Su sesión a terminado.")
        } else {
            pages = returndata.pages;
        }
    },
    error: function () {
        toastr.error('Error inesperado contactar a sistemas.');
    }
});

$("#searchingMainNoRepeat").on('keydown', function (event) {
    if (event.ctrlKey && event.keyCode === 32) {
        event.preventDefault();
        showSuggestions();
        return;
    }
});

$("#searchingMainNoRepeat").on('keyup', function (event) {
    
    if ($("#searchingMainNoRepeat").is(":focus") && !escKeyPressed&& event.key !== 'Control') {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
            return;
        }

        inputValueSearching = $("#searchingMainNoRepeat").val();
        if (inputValueSearching.length > 2) {
            $('#search_containerNoRepeat').html('');
            $.each(pages, function (index, value) {
                var name = RemoveAccentsSearching(value.page_name.toLowerCase());
                var description = RemoveAccentsSearching(value.description.toLowerCase());
                if (name.indexOf(RemoveAccentsSearching(inputValueSearching.toLowerCase())) >= 0 || description.indexOf(RemoveAccentsSearching(inputValueSearching.toLowerCase())) >= 0) {
                    $('#search_containerNoRepeat').append(`
                        <a href="${value.url}" onclick="RedirectPageSearching();" data-url="${value.url}" class="list-group-item mx-0 search-result" style="background-color: white;">
                            <strong>${value.page_name}</strong> <span>${value.description}</span>
                        </a>`);
                }
            });
            addResultsNavigation();
            $('#search_containerNoRepeat').addClass('show');
        } else if (inputValueSearching.length === 0) {
            addResultsNavigation();
            $('#search_containerNoRepeat').addClass('show');
        } else {
            $('#search_containerNoRepeat').html('');
            $('#search_containerNoRepeat').removeClass('show');
            $(document).off('keydown.navegacion');
        }
    }
});

$('#searchingMainNoRepeat').blur(function () {
    
    setTimeout(function () {
        $('#search_containerNoRepeat').html('');
        $('#search_containerNoRepeat').removeClass('show');
        $(document).off('keydown.navegacion');
    }, 200);
});

function showSuggestions() {
    
    let inputValueSearching = $("#searchingMainNoRepeat").val();
    $('#search_containerNoRepeat').html('');

    $.each(pages, function (index, value) {
        var name = RemoveAccentsSearching(value.page_name.toLowerCase());
        var description = RemoveAccentsSearching(value.description.toLowerCase());
        if (name.indexOf(RemoveAccentsSearching(inputValueSearching.toLowerCase())) >= 0 || description.indexOf(RemoveAccentsSearching(inputValueSearching.toLowerCase())) >= 0) {
            $('#search_containerNoRepeat').append(`
                <a href="${value.url}" onclick="RedirectPageSearching();" data-url="${value.url}" class="list-group-item mx-0 search-result" style="background-color: white;">
                    <strong>${value.page_name}</strong> <span>${value.description}</span>
                </a>`);
        }
    });
    addResultsNavigation();
    $('#search_containerNoRepeat').addClass('show');
}
function addResultsNavigation() {
    let currentIndex = -1;
    const results = $('.search-result');
    results.removeClass('active');
    if (results.length > 0) {
        $(document).off('keydown.navegacion').on('keydown.navegacion', function (e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, results.length - 1);
                results.removeClass('active');
                $(results[currentIndex]).addClass('active');
                $('.search-result').css('background-color', 'white');
                $(results[currentIndex]).css('background-color', '#34495e');
                $(results[currentIndex]).css('color', '#333');
                results[currentIndex].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                results.removeClass('active');
                $(results[currentIndex]).addClass('active');
                $('.search-result').css('background-color', 'white');
                $(results[currentIndex]).css('background-color', '#34495e');
                $(results[currentIndex]).css('color', '#333');
                results[currentIndex].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter' && currentIndex >= 0) {
                e.preventDefault();
                window.location.href = $(results[currentIndex]).data('url');
                RedirectPageSearching();
            }
        });
        $('.search-result').hover(function () {
            if (!$(this).hasClass('active')) {
                $(this).css('background-color', '#f0f0f0');
            }
        }, function () {
            if (!$(this).hasClass('active')) {
                $(this).css('background-color', 'white');
            }

        });
        $('.search-result').focus(function () {
            $(this).css('outline', '2px solid blue');
        });
    }
}

//Remover acentos
function RemoveAccentsSearching(strAccents) {
    var strAccents = strAccents.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
        } else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
}
function RedirectPageSearching() {
    StartLoading();
}

function SessionFalse(data) {
    swal({
        title: data + " No se realizo ninguna acción.",
        type: "warning",
        showCancelButton: false,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Iniciar Sesión"
    }, function (isConfirm) {
        if (isConfirm) {
            location.reload();
        }
    });
}

function ReloadLoginPV() {
    toastr.error("Es necesario volver a iniciar sesión para poder continuar.");
    $("#btnReloadLoginPV").click(function () { ReloadLoginRequestPV(); });
    GlobalUserMasterSessionGlobalPV = $("#UserNameSessionGlobalPV").html();
    $('#LoginUsernamePV').val(GlobalUserMasterSessionGlobalPV);
    $('#LoginPasswordPV').val("");
    $("#ModalReloadLoginPV").modal("show");
}

function ReloadLoginRequestPV() {
    if ($('#LoginUsernamePV').val() == "") {
        toastr.warning("Ingrese un usuario o número de empleado.");
        return false;
    }
    if ($('#LoginPasswordPV').val() == "") {
        toastr.warning("Ingrese una contraseña.");
        return false;
    }
    var obj_user = { Username: $('#LoginUsernamePV').val(), Password: $('#LoginPasswordPV').val(), UsernamePV: GlobalUserMasterSessionGlobalPV }
    StartLoading();
    $.ajax({
        type: "POST",
        url: "/Home/LoginEnter/",
        data: obj_user,
        success: function (returndate) {
            if (returndate.success == true) {
                EndLoading();

                $('#ModalReloadLoginPV').modal('hide');
                if ((($("#PVContainerMainModal").html()).trim()).length > 0) {
                    setTimeout(function () { $('body').addClass('modal-open'); }, 500);
                }
                toastr.success("Ha iniciado sesión correctamente.");
                return true;
            } else {
                EndLoading();
                toastr.warning('Alerta - ' + returndate.responseText + '');
                return false;
            }
        },
        error: function (returndate) {
            toastr.error('Error inesperado contactar a sistemas.');
            EndLoading();
        }
    });
}

//Convert strings formats dd/mm/yyyy to date
function stringToDate(dateStr) {
    var parts = dateStr.split("/")
    return new Date(parts[2], parts[1] - 1, parts[0])
}

//Function to Get the Current Date in format dd/mm/yyyy
function GetCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = dd + '/' + mm + '/' + yyyy;

    return today;
}

document.addEventListener('keydown', (e) => {
    if (e.key && e.key.toLowerCase() === 'f' && e.ctrlKey && e.shiftKey) {
        PartialViewSitesPVGModal(12, "PVContainerMainModal", 4);
        $("#PVbtnSaveProcess").addClass("hide");
        $("#PVTitleMainModalDetail").removeClass("hide");
        $('#PVMainModal').modal('show');
    }
});
var user_clicks_layout = 0;
function ClickLoadAllSitesLayout() {
    user_clicks_layout++;
    if (user_clicks_layout >= 3) {
        PartialViewSitesPVGModal(12, "PVContainerMainModal", 4);
        $("#PVbtnSaveProcess").addClass("hide");
        $("#PVTitleMainModalDetail").removeClass("hide");
        $('#PVMainModal').modal('show');
        user_clicks_layout = 0;
    }
}


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
        url_direction_partial_view = "/Home/ActionSiteColumnsSelect";
    else if (number_table == 13)
        url_direction_partial_view = "/Home/ActionSiteColumnsSelectAutoupdate";
    else
        url_direction_partial_view = "/Home/ActionSite4Columns";
    $.ajax({
        type: "POST",
        url: url_direction_partial_view,
        data: { "is_format": is_format },
        success: function (partialView) {
            $('#' + id_div).html(partialView +"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>");
            PutClassICheckPV();
            EndLoading();
        },
        error: function () {
            toastr.error("DESCONOCIDO, CONTACTA A SISTEMAS AL CARGAR LA VISTA PARCIAL.")
            EndLoading();
        }
    });
}