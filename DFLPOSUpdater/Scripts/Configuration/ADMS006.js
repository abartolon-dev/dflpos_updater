
$(document).ready(function () {
    window.setTimeout(function () {
        $(".normalheader").addClass("small-header");
        $("#fa").removeClass("fa-arrow-up").addClass("fa-arrow-down");
        $("#hbreadcrumb").removeClass("m-t-lg");
    }, 5000);
    $('#datapicker1').datepicker({
        autoclose: true,
        todayHighlight: true,
        startDate: '01/01/1950',
        endDate: new Date()
    });
});


function ValidEmailClientSide() {
    if (!/@elflorido.com.mx\s*$/.test($("#Email").val().toLowerCase())) {
        toastr.warning('El correo debe ser corporativo. Ejemplo: correo@elflorido.com.mx');
        $("#Email").val(null);
        $("#Email").focus();
    }

    //$.ajax({
    //    url: "/Home/EmailAlreadyExists/",
    //    type: "GET",
    //    data: { "employeeEmail": $('#Email').val() },
    //    success: function (useremail) {
    //        toastr.warning('El correo ya esta registrado con otro usuario. <br>■ Correo Existente: ' + useremail[0] + '');
    //        $("#Email").val(null);
    //        $("#Email").focus();
    //    }
    //});
}

$("#form").validate({
    rules: {
        EmployeeNumber: {
            digits: true,
            required: true,
            minlength: 4,
            maxlength: 10
        },
        Username: {
            required: true,
            minlength: 4,
            maxlength: 20
        },
        FirstName: {
            required: true,
            minlength: 4,
            maxlength: 45
        },
        LastName: {
            required: true,
            minlength: 4,
            maxlength: 45
        },
        DateOfBirth: {
            required: true,
            date: true
        },
        Phone: {
            required: true,
            minlength: 10,
            maxlength: 20
        },
        //Cellphone: {
        //    required: true,
        //    digits: true,
        //    minlength: 2,
        //    maxlength: 10
        //},
        Email: {
            required: true,
            email: true,
            maxlength: 60
        }
    },
    messages: {
        EmployeeNumber: {
            required: "El Campo no puede estar vacío",
            digits: "Solo se permiten numeros.",
            minlength: "Favor de ingresar mas de 4 caracteres",
            maxlength: "Máximo 10 caracteres"
        },
        Username: {
            required: "El Campo no puede estar vacío",
            minlength: "Favor de ingresar mas de 4 caracteres",
            maxlength: "Máximo 20 caracteres"
        },
        FirstName: {
            required: "El Campo no puede estar vacío",
            minlength: "Favor de ingresar mas de 4 caracteres",
            maxlength: "Máximo 45 caracteres"
        }, LastName: {
            required: "El Campo no puede estar vacío",
            minlength: "Favor de ingresar mas de 4 caracteres",
            maxlength: "Máximo 45 caracteres"
        },
        DateOfBirth: {
            required: "El Campo no puede estar vacío"
        }, Phone: {
            required: "El Campo no puede estar vacío",
            minlength: "Favor de ingresar mas de 10 caracteres",
            maxlength: "Maximo 20 caracteres"
        }
        //,
        //Cellphone: {
        //    digits: "Ingresar números por favor.",
        //    required: "El Campo no puede estar vacío",
        //    minlength: "Favor de ingresar mas de 4 caracteres",
        //    maxlength: "Maximo 10 caracteres"
        //}, Email: {
        //    required: "El Campo no puede estar vacío",
        //    maxlength: "Maximo 60 caracteres"
        //}
    },
    submitHandler: function (form) {
        swal({
            title: "¿Esta seguro?",
            text: "Se editaran sus datos personales!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }, function (isConfirm) {
            if (isConfirm) {
                StartLoading();
                $.ajax({
                    type: "POST",
                    url: "/Configuration/ActionUpdateUser/",
                    data: { "EmployeeNumber": $('#EmpNumber').text(), "Username": $('#Username').val(), "FirstName": $('#FirstName').val(), "LastName": $('#LastName').val(), "Phone": $('#Phone').val(), "Cellphone": $('#Cellphone').val(), "DateOfBirth": $('#DateOfBirth').val(), "Email": $('#Email').val().toLowerCase() },
                    success: function (returndate) {
                        EndLoading();
                        if (returndate.success == true)
                            toastr.success('' + returndate.responseText + '');
                        else
                            toastr.warning('' + returndate.responseText + '');
                    },
                    error: function () {
                        EndLoading();
                        toastr.error('Alerta!!');
                    }
                });
            }
        });
        return false;
    }
});
$("#formPass").validate({
    rules: {
        Password: {
            required: true,
            maxlength: 60
        },
        RepeatPassword: {
            required: true,
            equalTo: "#Password"
        }
    },
    messages: {
        Password: {
            required: "El Campo no puede ser nulo",
            maxlength: "Maximo 60 caracteres"
        }, RepeatPassword: {
            required: "El Campo no puede ser nulo",
            equalTo: "Favor de introducir la misma contraseña"
        }

    },
    submitHandler: function (form) {
        swal({
            title: "¿Esta seguro?",
            text: "Se editara su contraseña!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }, function (isConfirm) {
            if (isConfirm) {
                StartLoading();
                $.ajax({
                    type: "POST",
                    url: "/Configuration/ActionUpdateUser/",
                    data: { "EmployeeNumber": $('#EmpNumber').text(), "Password": $('#Password').val(), "RepeatPassword": $('#RepeatPassword').val() },
                    success: function (returndate) {
                        EndLoading();
                        if (returndate.success == true)
                            toastr.success('' + returndate.responseText + '');
                        else
                            toastr.warning('' + returndate.responseText + '');
                    },
                    error: function () {
                        EndLoading();
                        toastr.error('' + returndate.responseText + '');
                    }
                });
            }
        });
        return false;
    }
});
function Clear() {
    $("#form")[0].reset();
}
function UpdateImg() {
    var fileInput = document.getElementById('UpdateFile');
    if (fileInput.files.length == 0) {
        toastr.error("Seleccione una imagen.");
    }
    else {
        var idxDot = fileInput.files[0].name.lastIndexOf(".") + 1;
        var extFile = fileInput.files[0].name.substr(idxDot, fileInput.files[0].name.length).toLowerCase();//Obtenemos extension de archivo
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "gif") {
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
                if (selectedFile.size < 5242880)// Menor a 5MB
                {
                    var formdata = new FormData();
                    formdata.append(fileInput.files[0].name, fileInput.files[0]);
                    formdata.append("EmployeeNumber", $('#EmpNumber').text());
                    $.ajax({
                        type: "POST",
                        url: "/Configuration/ActionUploadUserPhoto/",
                        data: formdata,
                        cache: false,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        xhr: function () {  // Custom XMLHttpRequest
                            var myXhr = $.ajaxSettings.xhr();
                            if (myXhr.upload) {
                                myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
                            }
                            return myXhr;
                        },
                        success: function (returndate) {
                            if (returndate.success == true) {
                                toastr.success('' + returndate.responseText + '');
                                // Carga Imagen desde memoria no desde Base de datos
                                var reader = new FileReader();
                                reader.onload = function (e) {

                                    $("#Imagecontainer").empty();
                                    var dataURL = reader.result;
                                    var img = new Image()
                                    img.src = dataURL;
                                    img.className = "img-circle m-b";
                                    img.width = "80"
                                    img.height = "80"
                                    $("#Imagecontainer").append(img);
                                    $("#Imagecontainer").removeClass("fa pe-7s-id fa-5x");
                                    $("#imgDB").addClass("hide");

                                };
                                reader.readAsDataURL(selectedFile);
                            }
                            else {
                                EndLoading();
                                toastr.warning('' + returndate.responseText + '');
                            }
                        },
                        error: function () {
                            toastr.error('Error Inesperado');
                            EndLoading();
                        }
                    });
                }
                else {
                    toastr.error('La imagen debe ser menor a 5MB');
                }
            }
        } else {
            toastr.error("Solo se admiten archivos jpg/jpeg/png. Intentar con otro archivo");
        }
    }
}
function progressHandlingFunction(e) {// animacion loading
    if (e.lengthComputable) {
        var percentComplete = Math.round(e.loaded * 100 / e.total);
        $("#FileProgress").css("width",
            percentComplete + '%').attr('aria-valuenow', percentComplete);
        $('#FileProgress span').text(percentComplete + "%");
    }
    else {
        $('#FileProgress span').text('unable to compute');
    }
}
function DeletePicture() {
    swal({
        title: "¿Se eliminará su imagen de perfil?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar"
    }, function (isConfirm) {
        if (isConfirm) {
            StartLoading();
            $.ajax({
                type: "POST",
                url: "/Configuration/ActionDeletePicture/",
                data: { "EmployeeNumber": $('#EmpNumber').text() },
                success: function (returndate) {
                    EndLoading();
                    if (returndate.success == true)
                        toastr.success('' + returndate.responseText + '');
                    else
                        toastr.warning('' + returndate.responseText + '');
                },
                error: function () {
                    EndLoading();
                    toastr.error('Alerta!!');
                }
            });
        }
    });
}