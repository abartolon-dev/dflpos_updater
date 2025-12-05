var pendingBool = false;
var pendingdeparmentBool = false;
var statusUserReal = 0;
var statusUserDepartmentReal = 0;

$(document).ready(function () {
    window.setTimeout(function () {
        $(".normalheader").addClass("small-header");
        $("#fa").removeClass("fa-arrow-up").addClass("fa-arrow-down");
        $("#hbreadcrumb").removeClass("m-t-lg");
    }, 5000);
    $("form").submit(function () { return false; });
    //$('input').iCheck({ checkboxClass: 'icheckbox_square-green', });
    $("#user_status").select2();
    $("#siteDestino").select2();
    $("#user_department").select2();
    $('#OldVersion').iCheck({ checkboxClass: 'icheckbox_square-green', });
    $('#MigrateStores').find('input[name="MigrateStores"]').iCheck({
        checkboxClass: 'icheckbox_square-green'
    });
    $('#UsersList').find('input[name="Users"]').iCheck({
        radioClass: 'iradio_square-green'
    }).on('ifChecked', function (e) {
        StartLoading();
        var EmployeeNumber = $(this).val();
        $.ajax({
            type: "GET",
            url: "/Configuration/ActionGetAllRolesAvailable/",
            data: { "EmployeeNumber": EmployeeNumber, "Site": $("#siteDestino").val() },
            success: function (returndate) {
                if (returndate.success == true) {
                    pendingBool = false;
                    pendingdeparmentBool = false;
                    var arr_json = JSON.parse(returndate.Json);
                    var status_user = returndate.Status;
                    var department = returndate.department;
                    statusUserReal = 1;
                    statusUserDepartmentReal = 1;
                    if (status_user != 'P') {
                        $('#user_status').val(status_user).trigger('change');
                        $('#pending').addClass('hide');
                    } else {
                        $('#user_status').val("").trigger('change');
                        pendingBool = true;
                        $('#pending').removeClass('hide');
                    }
                    if (department != 0) {
                        $('#user_department').val(department).trigger('change');
                        $('#pendingDepartment').addClass('hide');
                    } else {
                        $('#user_department').val("").trigger('change');
                        pendingdeparmentBool = true;
                        $('#pendingDepartment').removeClass('hide');
                    }
                    $("#availableList").empty();
                    $.each(arr_json, function (i, v) {
                        $("#availableList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='available' value='" + v.role_id + "'>&nbsp;(" + v.role_name + ') ' + v.role_description + " </p></li>");
                    });
                    $('#availableList').find('input[name="available"]').iCheck({
                        checkboxClass: 'icheckbox_square-green'
                    });
                    arr_json = null;
                    returndate = null;
                    $.ajax({
                        type: "GET",
                        url: "/Configuration/ActionGetAllRolesOfUser/",
                        data: { "EmployeeNumber": EmployeeNumber, "Site": $("#siteDestino").val() },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                var arr_json = JSON.parse(returndate.Json);
                                $("#assignedList").empty();
                                $.each(arr_json, function (i, v) {
                                    $("#assignedList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='notAvailable' value='" + v.role_id + "'>&nbsp;(" + v.role_name + ') ' + v.role_description + " </p></li>");
                                });
                                $('#assignedList').find('input[name="notAvailable"]').iCheck({
                                    checkboxClass: 'icheckbox_square-green'
                                });
                                EndLoading();
                            }
                            else {
                                EndLoading();
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function (returndate) {
                            EndLoading();
                            toastr.error('Error inesperado contactar a sistemas.');
                        }
                    });
                }
                else {
                    EndLoading();
                    toastr.warning('' + returndate.responseText + '');
                }
            },
            error: function (returndate) {
                EndLoading();
                toastr.error('Error inesperado contactar a sistemas.');
            }
        });
    }).end();
   
});

function OnChangeSelect2() {
    var status = $('#user_status').val();
    if (pendingBool) {

        if (status != "") {
            $('#pending').addClass('hide');
            pendingBool = false;
        } else {
            $('#pending').removeClass('hide');
            pendingBool = false;
        }
    }

    if (statusUserReal != 1) {
        if (status != "" && status != null) {
            var EmployeeNumber = '';
            var SiteList = '';
            var Sites =$("#siteDestino").val();
            $.each($("input[name='Users']:checked"), function () {
                EmployeeNumber += $(this).val() + ",";
            });
            $.each($("input[name='MigrateStores']:checked"), function () {
                SiteList += $(this).val() + ",";
            });
            if(SiteList  !='')
            {
                Sites = SiteList;
            }
            var userNumber = EmployeeNumber.slice(0, -1);
            if (EmployeeNumber.length != 0) {
                $("user_status").prop("disabled", true);
                var status = $('#user_status').val();
                StartLoading();
                $.ajax({
                    type: "POST",
                    url: "/Configuration/ActionUpdateStatus/",
                    data: { "user": userNumber, "statusUser": status, "Site": Sites },
                    success: function (returndate) {
                        if (returndate.success == true) {
                            var resp = returndate.responseText;
                            if (resp != "1") {
                                EndLoading();
                                toastr.error('Alerta - Error' + resp);

                            } else {
                                EndLoading();
                                toastr.success('Se ha actualizado correctamente.');
                                $("user_status").prop("disabled", false);
                            }
                        }
                        else {
                            EndLoading();
                            toastr.warning('Alerta - Error al actualizar contacte a sistemas.');
                        }
                    },
                    error: function (returndate) {
                        EndLoading();
                        toastr.error('Alerta - Error inesperado contactar a sistemas.');
                    }
                });

            }
        }
    }
    statusUserReal++;
}

function OnChangeDepartmentSelect2() {
    var status = $('#user_department').val();
    if ( pendingdeparmentBool ) {
        if (status != "") {
            $('#pendingDepartment').addClass('hide');
            pendingdeparmentBool = false;
        } else {
            $('#pendingDepartment').removeClass('hide');
            pendingdeparmentBool = false;
        }
    }
    if (statusUserDepartmentReal != 1) {
        if (status != "" && status != null) {
            var EmployeeNumber = '';
            $.each($("input[name='Users']:checked"), function () {
                EmployeeNumber += $(this).val() + ",";
            });
            var userNumber = EmployeeNumber.slice(0, -1);
            if (EmployeeNumber.length != 0) {
                $("user_department").prop("disabled", true);
                var status = $('#user_department').val();
                $.ajax({
                    type: "POST",
                    url: "/Configuration/ActionUpdateDepartament/",
                    data: { "user": userNumber, "department": status },
                    success: function (returndate) {
                        if (returndate.success == true) {
                            var resp = returndate.responseText;
                            if (resp == 0) {
                                toastr.error('Alerta - Error al actualizar contacte a sistemas.');
                            } else {
                                toastr.success('Se ha actualizado correctamente.');
                                $("user_status").prop("disabled", false);
                            }
                        }
                        else {
                            toastr.warning('Alerta - Error al actualizar contacte a sistemas.');
                        }
                    },
                    error: function (returndate) {
                        toastr.error('Alerta - Error inesperado contactar a sistemas.');
                    }
                });

            }
        }
    }
    statusUserDepartmentReal++;
}

$('#MigrateStores').slimScroll({
    height: '500px'
});
$('#UsersList').slimScroll({
    height: '500px'
});
$('#availableList').slimScroll({
    height: '500px'
});
$('#assignedList').slimScroll({
    height: '500px'
});
function AddToUser() {
    var EmployeeNumber = '';
    var Roles = '';
    $.each($("input[name='Users']:checked"), function () {
        EmployeeNumber += $(this).val() + ',';
    });
    $.each($("input[name='available']:checked"), function () {
        Roles += $(this).val() + ',';
    });
    if (EmployeeNumber.length != 0 && Roles.length != 0) {
        StartLoading();
        $.ajax({
            type: "POST",
            url: "/Configuration/ActionAddRolesToUser/",
            data: { "EmployeeNumber": EmployeeNumber.slice(0, -1), "Roles": Roles.slice(0, -1) , "Site": $("#siteDestino").val() },
            success: function (returndate) {
                if (returndate.success == true) {
                    var arr_json = JSON.parse(returndate.Json);
                    $("#availableList").empty();
                    $.each(arr_json, function (i, v) {
                        $("#availableList").append("<li class='list-group-item'><p class='checkbox'><input type='checkbox' name='available' value='" + v.role_id + "'>&nbsp;(" + v.role_name + ') ' + v.role_description + " </p></li>");
                    });
                    $('#availableList').find('input[name="available"]').iCheck({
                        checkboxClass: 'icheckbox_square-green'
                    });
                    arr_json = null;
                    returndate = null;
                    $.ajax({
                        type: "GET",
                        url: "/Configuration/ActionGetAllRolesOfUser/",
                        data: { "EmployeeNumber": EmployeeNumber.slice(0, -1), "Site": $("#siteDestino").val() },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                var arr_json = JSON.parse(returndate.Json);
                                $("#assignedList").empty();
                                $.each(arr_json, function (i, v) {
                                    $("#assignedList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='notAvailable' value='" + v.role_id + "'>&nbsp;(" + v.role_name + ') ' + v.role_description + " </p></li>");
                                });
                                $('#assignedList').find('input[name="notAvailable"]').iCheck({
                                    checkboxClass: 'icheckbox_square-green'
                                });
                                EndLoading();
                            }
                            else {
                                EndLoading();
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function (returndate) {
                            EndLoading();
                            toastr.error('Error inesperado contactar a sistemas.');
                        }
                    });
                }
                else {
                    EndLoading();
                    toastr.warning('' + returndate.responseText + '');
                }
            },
            error: function (returndate) {
                EndLoading();
                toastr.error('Error inesperado contactar a sistemas.');
            }
        });
    }
    else {
        
        toastr.warning('Debe seleccionar algun rol.');
    }

}
function RemoveFromUser() {
    var EmployeeNumber = '';
    var Roles = '';
    $.each($("input[name='Users']:checked"), function () {
        EmployeeNumber += $(this).val() + ',';
    });
    $.each($("input[name='notAvailable']:checked"), function () {
        Roles += $(this).val() + ',';
    });
    if (Roles.length != 0 && EmployeeNumber.length != 0) {
        StartLoading();
        $.ajax({
            type: "POST",
            url: "/Configuration/ActionRemoveRolesFromUser/",
            data: { "EmployeeNumber": EmployeeNumber.slice(0, -1), "Roles": Roles.slice(0, -1), "Site": $("#siteDestino").val() },
            success: function (returndate) {
                if (returndate.success == true) {
                    var arr_json = JSON.parse(returndate.Json);
                    $("#availableList").empty();
                    $.each(arr_json, function (i, v) {
                        $("#availableList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='available' value='" + v.role_id + "'>&nbsp;(" + v.role_name + ') ' + v.role_description + " </p></li>");
                    });
                    $('#availableList').find('input[name="available"]').iCheck({
                        checkboxClass: 'icheckbox_square-green'
                    });
                    arr_json = null;
                    returndate = null;
                    $.ajax({
                        type: "GET",
                        url: "/Configuration/ActionGetAllRolesOfUser/",
                        data: { "EmployeeNumber": EmployeeNumber.slice(0, -1), "Site": $("#siteDestino").val() },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                var arr_json = JSON.parse(returndate.Json);
                                $("#assignedList").empty();
                                $.each(arr_json, function (i, v) {
                                    $("#assignedList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='notAvailable' value='" + v.role_id + "'>&nbsp;(" + v.role_name + ') ' + v.role_description + " </p></li>");
                                });
                                $('#assignedList').find('input[name="notAvailable"]').iCheck({
                                    checkboxClass: 'icheckbox_square-green'
                                });
                                EndLoading();
                            }
                            else {
                                EndLoading();
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function (returndate) {
                            EndLoading();
                            toastr.error('Error inesperado contactar a sistemas.');
                        }
                    });
                }
                else {
                    EndLoading();
                    toastr.warning('' + returndate.responseText + '');
                }
            },
            error: function (returndate) {
                EndLoading();
                toastr.error('Error inesperado contactar a sistemas.');
            }
        });
    }
    else {
        toastr.warning('Debe seleccionar algun rol.');
    }
}
function AddToRoleAll() {
    $('#availableList').find('input[name="available"]').iCheck('check');
    if ($('#availableList').find('input[name="available"]').iCheck('check').length === 0) {
        toastr.warning('No existen roles disponibles.');
    }
    else {
        swal({
            title: "¿Esta seguro?",
            text: "Se asignaran todos los rol al usuario seleccionado!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        },
            function (isConfirm) {
                if (isConfirm) {
                    AddToUser();
                } else {
                    $('#availableList').find('input[name="available"]').iCheck('uncheck');
                }
            });
    }
}

function RemoveFromRoleAll() {
    $('#assignedList').find('input[name="notAvailable"]').iCheck('check');
    if ($('#assignedList').find('input[name="notAvailable"]').iCheck('check').length === 0) {
        toastr.warning('No existen roles disponibles.');
    }
    else {
        swal({
            title: "¿Esta seguro?",
            text: "Se eliminaran todos los roles relacionados al usuario!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        },
            function (isConfirm) {
                if (isConfirm) {
                    RemoveFromUser();
                } else {
                    $('#assignedList').find('input[name="notAvailable"]').iCheck('uncheck');
                }
            });
    }
}
function ValidateSite() {

    if ($("#siteDestino").val() != "") {
        $('#user_department').addClass('hide');
        $('#pendingDepartmentLabel').addClass('hide');
        
    } else {
        $('#user_department').removeClass('hide');
        $('#pendingDepartmentLabel').removeClass('hide');
    }

    StartLoading();
    $("#UsersList").empty();
    $("#availableList").empty();
    $("#assignedList").empty();
    $.ajax({
        type: "GET",
        url: "/Configuration/ActionGetAllUsersFromStore/",
        data: { "Site": $("#siteDestino").val() },
        success: function (returndate) {
            if (returndate.success == true) {
                var arr_json = JSON.parse(returndate.Json);
                console.log(arr_json);
                $("#UsersList").empty();
                $.each(arr_json, function (i, v) {
                    $("#UsersList").append(" <li class='list-group-item'><p class='radio'><input type='radio' name='Users' value='" + v.EmployeeNumber + "'>&nbsp;" + v.FullName + '  ( ' + (v.userName) + ' #: '+v.EmployeeNumber + ' )'+ " </p></li>");
                });

                $('#UsersList').find('input[name="Users"]').iCheck({
                    radioClass: 'iradio_square-green'
                }).on('ifChecked', function (e) {
                    StartLoading();
                    var EmployeeNumber = $(this).val();
                    $.ajax({
                        type: "GET",
                        url: "/Configuration/ActionGetAllRolesAvailable/",
                        data: { "EmployeeNumber": EmployeeNumber, "Site": $("#siteDestino").val() },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                pendingBool = false;
                                pendingdeparmentBool = false;
                                var arr_json = JSON.parse(returndate.Json);
                                var status_user = returndate.Status;
                                var department = returndate.department;
                                statusUserReal = 1;
                                statusUserDepartmentReal = 1;
                                if (status_user != 'P') {
                                    $('#user_status').val(status_user).trigger('change');
                                    $('#pending').addClass('hide');
                                } else {
                                    $('#user_status').val("").trigger('change');
                                    pendingBool = true;
                                    $('#pending').removeClass('hide');
                                }
                                if (department != 0) {
                                    $('#user_department').val(department).trigger('change');
                                    $('#pendingDepartment').addClass('hide');
                                } else {
                                    $('#user_department').val("").trigger('change');
                                    pendingdeparmentBool = true;
                                    if ($("#siteDestino").val() == "")
                                        $('#pendingDepartment').removeClass('hide');
                                }
                                $("#availableList").empty();
                                $.each(arr_json, function (i, v) {
                                    $("#availableList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='available' value='" + v.role_id + "'>&nbsp;(" + v.role_name + ') ' + v.role_description + " </p></li>");
                                });
                                $('#availableList').find('input[name="available"]').iCheck({
                                    checkboxClass: 'icheckbox_square-green'
                                });
                                arr_json = null;
                                returndate = null;
                                $.ajax({
                                    type: "GET",
                                    url: "/Configuration/ActionGetAllRolesOfUser/",
                                    data: { "EmployeeNumber": EmployeeNumber, "Site": $("#siteDestino").val() },
                                    success: function (returndate) {
                                        if (returndate.success == true) {
                                            var arr_json = JSON.parse(returndate.Json);
                                            $("#assignedList").empty();
                                            $.each(arr_json, function (i, v) {
                                                $("#assignedList").append(" <li class='list-group-item'><p class='checkbox'><input type='checkbox' name='notAvailable' value='" + v.role_id + "'>&nbsp;(" + v.role_name + ') ' + v.role_description + " </p></li>");
                                            });
                                            $('#assignedList').find('input[name="notAvailable"]').iCheck({
                                                checkboxClass: 'icheckbox_square-green'
                                            });
                                            EndLoading();
                                        }
                                        else {
                                            EndLoading();
                                            toastr.warning('' + returndate.responseText + '');
                                        }
                                    },
                                    error: function (returndate) {
                                        EndLoading();
                                        toastr.error('Error inesperado contactar a sistemas.');
                                    }
                                });
                            }
                            else {
                                EndLoading();
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function (returndate) {
                            EndLoading();
                            toastr.error('Error inesperado contactar a sistemas.');
                        }
                    });
                }).end();
                EndLoading();
            }
            else {
                toastr.warning('' + returndate.responseText + '');
                EndLoading();
            }
        },
        error: function (returndate) {
            toastr.error('Error inesperado contactar a sistemas.');
            EndLoading();
        }
    });
}
function ChangeValues(s) {
    if (s.checked) {
        $('#Tab1').addClass("hide");
        $('#Tab2').removeClass("hide");
        $('#Tab2').animatePanel();
    }
    else
    {
        $('#Tab2').addClass("hide");
        $('#Tab1').removeClass("hide");
        $('#Tab1').animatePanel();
    }
}
function SelectAllStores() {
    $('#MigrateStores').find('input[name="MigrateStores"]').iCheck('check');
}
function UnSelectAllStores() {
    $('#MigrateStores').find('input[name="MigrateStores"]').iCheck('uncheck');
}
function MigrateUsers() {
    
    var SiteList = '';
    var EmployeeNumber = '';
    $.each($("input[name='Users']:checked"), function () {
        EmployeeNumber += $(this).val();
    });
    $.each($("input[name='MigrateStores']:checked"), function () {
        SiteList += $(this).val() + ",";
    });
    if ($("#siteDestino").val() == '' || SiteList == '' || EmployeeNumber == '')
        toastr.warning('Seleccione una Tienda y Usuario de la misma.');
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
                       StartLoading();
                       $.ajax({
                           type: "POST",
                           url: "/Configuration/ActionMigrateUser/",
                           data: { "userNumber": EmployeeNumber, "SiteFrom": $("#siteDestino").val(), "SitesToMigrate": SiteList, "type": $("#OldVersion").is(":checked") },
                           success: function (returndate) {
                               if (returndate.success == true) {
                                   var resp = returndate.responseText;
                                   if (resp != "1") {
                                       EndLoading();
                                       toastr.error('Alerta - Error' + resp);

                                   } else {
                                       EndLoading();
                                       toastr.success('Se ha actualizado correctamente.');
                                       $("user_status").prop("disabled", false);
                                   }
                               }
                               else {
                                   EndLoading();
                                   toastr.warning('Alerta - Error al actualizar contacte a sistemas.');
                               }
                           },
                           error: function (returndate) {
                               EndLoading();
                               toastr.error('Alerta - Error inesperado contactar a sistemas.');
                           }
                       });
                   } else {
                       $('#assignedList').find('input[name="notAvailable"]').iCheck('uncheck');
                   }
               });
    }
}
function UpdateExcel() {
    var fileInput = document.getElementById('UpdateFile');
    if (fileInput.files.length == 0) {
        toastr.error("Seleccione una imagen.");
    }
    else {
        var idxDot = fileInput.files[0].name.lastIndexOf(".") + 1;
        var extFile = fileInput.files[0].name.substr(idxDot, fileInput.files[0].name.length).toLowerCase();//Obtenemos extension de archivo
        if (extFile == "xlsx") {
            swal({
                title: "¿Esta seguro?",
                text: "Se daran de baja todos los empleados del documento seleccionado.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar"
            },
              function (isConfirm) {
                  if (isConfirm) {
                      StartLoading();
                      var selectedFile = ($("#UpdateFile"))[0].files[0];
                      if (selectedFile) {
                          var FileSize = 0;
                          if (selectedFile.size > 1048576) {
                              FileSize = Math.round(selectedFile.size * 100 / 1048576) / 100 + " MB";
                          }
                          else if (selectedFile.size > 1024) {
                              FileSize = Math.round(selectedFile.size * 100 / 1024) / 100 + " KB";
                          }
                          else {
                              FileSize = selectedFile.size + " Bytes";
                          }
                          if (selectedFile.size < 10485760)// Menor a 10MB (valor en BYTES)
                          {
                              var formdata = new FormData();
                              formdata.append(fileInput.files[0].name, fileInput.files[0]);
                              $.ajax({
                                  type: "POST",
                                  url: "/Configuration/ActionUploadExcel/",
                                  data: formdata,
                                  cache: false,
                                  dataType: 'json',
                                  processData: false,
                                  contentType: false,
                                  success: function (retuValue) {
                                      console.log(retuValue);
                                      var status = 0;
                                      var statusText = "";
                                      EndLoading();

                                      for (var entry of retuValue.retuValue) {
                                          console.log(entry);
                                          if (entry[1] === "Sucsess") {
                                              status = 1;
                                          }
                                          else if (entry[1] == "Fail") {
                                              statusText = statusText + entry[0];
                                              toastr.error('Alerta - Error ' + entry[0] + '.');
                                           
                                          }
                                          else if (entry[1] == "Warning") {
                                              statusText = statusText + entry[0];
                                              toastr.warning('Alerta - Error ' + entry[0] + '.');
                                          }
                                          
                                      }
                                      if (status === 1) {
                                          if (statusText != "")
                                              swal("Error!", "Se actualizaron algunas tiendas. Lista de errores: ■" + statusText + " ", "warning");
                                          else
                                              swal("Registro exitoso!", "Se dieron de baja todos los empleados del archivo.", "success");
                                      }
                                      else {
                                          swal("Error!", "Lista de errores: ■" + statusText + " ", "warning");
                                      }
                                  },
                                  error: function (retuValue) {
                                      EndLoading();
                                  }
                              });
                          }
                          else {
                              toastr.warning('El archivo debe ser menor a 10MB');
                          }
                      }
                  }
              });
        } else {
            toastr.warning('Solo se admiten archivos xlsx. Intentar con otro por favor.');
        }
    }
}

