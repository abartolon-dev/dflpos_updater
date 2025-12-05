
$(document).ready(function () {
    window.setTimeout(function () {
        $(".normalheader").addClass("small-header");
        $("#fa").removeClass("fa-arrow-up").addClass("fa-arrow-down");
        $("#hbreadcrumb").removeClass("m-t-lg");
    }, 5000);
    $("form").submit(function () { return false; });
    $('#rolList').find('input[name="Rols"]').iCheck({
        radioClass: 'iradio_square-green'
    }).on('ifChecked', function (e) {
        var rolID = $(this).val();
        $.ajax({
            type: "GET",
            url: "/Configuration/ActionGetAllPagesOfRole/",
            data: { "role_id": rolID, "type": $('#checkView').prop("checked") },
            success: function (returndate) {
                if (returndate.success == true) {
                    var arr_json = JSON.parse(returndate.Json);
                    $("#availableList").empty();
                    $.each(arr_json, function (i, v) {
                        $("#availableList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='available' value='" + v.page_id + "'>&nbsp;(" + v.page_id + ') ' + v.description + " </p></li>");
                    });
                    $('#availableList').find('input[name="available"]').iCheck({
                        checkboxClass: 'icheckbox_square-green'
                    });
                    arr_json = null;
                    returndate = null;
                    $.ajax({
                        type: "GET",
                        url: "/Configuration/ActionGetAllPagesAvailable/",
                        data: { "role_id": rolID, "type": $('#checkView').prop("checked") },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                var arr_json = JSON.parse(returndate.Json);
                                $("#assignedList").empty();
                                $.each(arr_json, function (i, v) {
                                    $("#assignedList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='notAvailable' value='" + v.page_id + "'>&nbsp;(" + v.page_id + ') ' + v.description + " </p></li>");
                                });
                                $('#assignedList').find('input[name="notAvailable"]').iCheck({
                                    checkboxClass: 'icheckbox_square-green'
                                });
                            }
                            else {
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function (returndate) {
                            toastr.error('Error inesperado contactar a sistemas.');
                        }
                    });
                }
                else {
                    toastr.warning('' + returndate.responseText + '');
                }
            },
            error: function (returndate) {
                toastr.error('Error inesperado contactar a sistemas.');
            }
        });
    }).end();
});
$('#rolList').slimScroll({
    height: '500px'
});
$('#availableList').slimScroll({
    height: '500px'
});
$('#assignedList').slimScroll({
    height: '500px'
});

function AddToRole() {
    var Role = '';
    var Pages = '';
    $.each($("input[name='Rols']:checked"), function () {
        Role += $(this).val() + ',';
    });
    $.each($("input[name='available']:checked"), function () {
        Pages += $(this).val() + ',';
    });
    if (Pages.length != 0 && Role.length != 0) {
        $.ajax({
            type: "POST",
            url: "/Configuration/ActionAddPagesToRoles/",
            data: { "roles": Role.slice(0, -1), "pages": Pages.slice(0, -1), "type": $('#checkView').prop("checked") },
            success: function (returndate) {
                if (returndate.success == true) {
                    var arr_json = JSON.parse(returndate.Json);
                    $("#availableList").empty();
                    $.each(arr_json, function (i, v) {
                        $("#availableList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='available' value='" + v.page_id + "'>&nbsp;(" + v.page_id + ') ' + v.description + " </p></li>");
                    });
                    $('#availableList').find('input[name="available"]').iCheck({
                        checkboxClass: 'icheckbox_square-green'
                    });
                    arr_json = null;
                    returndate = null;
                    $.ajax({
                        type: "GET",
                        url: "/Configuration/ActionGetAllPagesAvailable/",
                        data: { "role_id": Role.slice(0, -1), "type": $('#checkView').prop("checked") },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                var arr_json = JSON.parse(returndate.Json);
                                $("#assignedList").empty();
                                $.each(arr_json, function (i, v) {
                                    $("#assignedList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='notAvailable' value='" + v.page_id + "'>&nbsp;(" + v.page_id + ') ' + v.description + " </p></li>");
                                });
                                $('#assignedList').find('input[name="notAvailable"]').iCheck({
                                    checkboxClass: 'icheckbox_square-green'
                                });
                            }
                            else {
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function (returndate) {
                            toastr.error('Error inesperado contactar a sistemas.');
                        }
                    });
                }
                else {
                    toastr.warning('' + returndate.responseText + '');
                }
            },
            error: function (returndate) {
                toastr.error('Error inesperado contactar a sistemas.');
            }
        });
    }
    else {
        toastr.warning('Debe seleccionar alguna pagina.');
    }

}
function RemoveFromRole() {
    var Role = '';
    var Pages = '';
    $.each($("input[name='Rols']:checked"), function () {
        Role += $(this).val() + ',';
    });
    $.each($("input[name='notAvailable']:checked"), function () {
        Pages += $(this).val() + ',';
    });
    if (Pages.length != 0 && Role.length != 0) {
        $.ajax({
            type: "POST",
            url: "/Configuration/ActionRemovePagesFromRoles/",
            data: { "roles": Role.slice(0, -1), "pages": Pages.slice(0, -1), "type": $('#checkView').prop("checked") },
            success: function (returndate) {
                if (returndate.success == true) {
                    var arr_json = JSON.parse(returndate.Json);
                    $("#availableList").empty();
                    $.each(arr_json, function (i, v) {
                        $("#availableList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='available' value='" + v.page_id + "'>&nbsp;(" + v.page_id + ') ' + v.description + " </p></li>");
                    });
                    $('#availableList').find('input[name="available"]').iCheck({
                        checkboxClass: 'icheckbox_square-green'
                    });
                    arr_json = null;
                    returndate = null;
                    $.ajax({
                        type: "GET",
                        url: "/Configuration/ActionGetAllPagesAvailable/",
                        data: { "role_id": Role.slice(0, -1), "type": $('#checkView').prop("checked") },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                var arr_json = JSON.parse(returndate.Json);
                                $("#assignedList").empty();
                                $.each(arr_json, function (i, v) {
                                    $("#assignedList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='notAvailable' value='" + v.page_id + "'>&nbsp;(" + v.page_id + ') ' + v.description + " </p></li>");
                                });
                                $('#assignedList').find('input[name="notAvailable"]').iCheck({
                                    checkboxClass: 'icheckbox_square-green'
                                });
                            }
                            else {
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function (returndate) {
                            toastr.error('Error inesperado contactar a sistemas.');
                        }
                    });
                }
                else {
                    toastr.warning('' + returndate.responseText + '');
                }
            },
            error: function (returndate) {
                toastr.error('Error inesperado contactar a sistemas.');
            }
        });
    }
    else {
        toastr.warning('Debe seleccionar alguna pagina.');
    }
}
function ChangeValues(s) {
    $.ajax({
        type: "GET",
        url: "/Configuration/ActionGetAllRolesByType/",
        data: { "type": s.checked },
        success: function (returndate) {
            if (returndate.success == true) {
                $("#assignedList").empty();
                $("#availableList").empty();
                var arr_json = JSON.parse(returndate.Json);
                $("#rolList").empty();
                $.each(arr_json, function (i, v) {
                    $("#rolList").append(" <li class='list-group-item'><p class='radio'><input type='radio' name='Rols' value='" + v.role_id + "'>&nbsp;" + v.role_name + " </p></li>");
                });
                $('#rolList').find('input[name="Rols"]').iCheck({
                    radioClass: 'iradio_square-green'
                });
                $('#rolList').find('input[name="Rols"]').iCheck({
                    radioClass: 'iradio_square-green'
                }).on('ifChecked', function (e) {
                    var rolID = $(this).val();
                    $.ajax({
                        type: "GET",
                        url: "/Configuration/ActionGetAllPagesOfRole/",
                        data: { "role_id": rolID, "type": $('#checkView').prop("checked") },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                var arr_json = JSON.parse(returndate.Json);
                                $("#availableList").empty();
                                $.each(arr_json, function (i, v) {
                                    $("#availableList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='available' value='" + v.page_id + "'>&nbsp;(" + v.page_id + ') ' + v.description + " </p></li>");
                                });
                                $('#availableList').find('input[name="available"]').iCheck({
                                    checkboxClass: 'icheckbox_square-green'
                                });
                                arr_json = null;
                                returndate = null;
                                $.ajax({
                                    type: "GET",
                                    url: "/Configuration/ActionGetAllPagesAvailable/",
                                    data: { "role_id": rolID, "type": $('#checkView').prop("checked") },
                                    success: function (returndate) {
                                        if (returndate.success == true) {
                                            var arr_json = JSON.parse(returndate.Json);
                                            $("#assignedList").empty();
                                            $.each(arr_json, function (i, v) {
                                                $("#assignedList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='notAvailable' value='" + v.page_id + "'>&nbsp;(" + v.page_id + ') ' + v.description + " </p></li>");
                                            });
                                            $('#assignedList').find('input[name="notAvailable"]').iCheck({
                                                checkboxClass: 'icheckbox_square-green'
                                            });
                                        }
                                        else {
                                            toastr.warning('' + returndate.responseText + '');
                                        }
                                    },
                                    error: function (returndate) {
                                        toastr.error('Error inesperado contactar a sistemas.');
                                    }
                                });
                            }
                            else {
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function (returndate) {
                            toastr.error('Error inesperado contactar a sistemas.');
                        }
                    });
                }).end();
            }
            else {
                toastr.warning('' + returndate.responseText + '');
            }
        },
        error: function (returndate) {
            toastr.error('Error inesperado contactar a sistemas.');
        }
    });
}
function AddToRoleAll() {
    $('#availableList').find('input[name="available"]').iCheck('check');
    if ($('#availableList').find('input[name="available"]').iCheck('check').length === 0) {
        toastr.warning('No existen paginas disponibles.');
    }
    else {
        swal({
            title: "¿Esta seguro?",
            text: "Se asignaran todas las páginas al rol seleccionado!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        },
            function (isConfirm) {
                if (isConfirm) {
                    AddToRole();
                } else {
                    $('#availableList').find('input[name="available"]').iCheck('uncheck');
                }
            });
    }
}
function RemoveFromRoleAll() {
    $('#assignedList').find('input[name="notAvailable"]').iCheck('check');
    if ($('#assignedList').find('input[name="notAvailable"]').iCheck('check').length === 0) {
        toastr.warning('No existen paginas disponibles.');
    }
    else {
        swal({
            title: "¿Esta seguro?",
            text: "Se eliminaran todas las paginas relacionadas al rol!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        },
            function (isConfirm) {
                if (isConfirm) {
                    RemoveFromRole();
                } else {
                    $('#assignedList').find('input[name="notAvailable"]').iCheck('uncheck');
                }
            });
    }

}