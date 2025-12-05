
$(document).ready(function () {
    $("#EmployeeNumber").focus();
    $('#datapicker1').datepicker({
        autoclose: true,
        todayHighlight: true,
        startDate: '01/01/1950',
        endDate: new Date()
    });
});

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
};

function ValidUserClientSide() {

    var username = $('#Username').val();
    var illegalChars = /\W/; // allow letters, numbers, and underscores

    if (username == "") {
        toastr.warning('Nombre de usuario incorrecto.');
        $("#Username").val(null);
        $("#Username").focus();
    } else if ((username.length < 3) || (username.length > 20)) {
        toastr.warning('Nombre de usuario incorrecto, ingrese más de 4 caracteres y menos de 20 caracteres.');
        $("#Username").val(null);
        $("#Username").focus();
    } else if (illegalChars.test(username)) {
        toastr.warning('Ingrese un usuario correcto sin caracteres especiales o espacios.');
        $("#Username").val(null);
        $("#Username").focus();
    } else {
        $.ajax({
            url: "/Home/UsernameAlreadyExists/",
            type: "GET",
            data: { "username": $('#Username').val() },
            success: function (userNam) {
                console.log("userNam");
                console.log(userNam);
                if (userNam.success) {
                    toastr.warning('Nombre de usuario ya registrado favor de utilizar otro. <br>■ Usuario Existente: ' + username + '');
                    $("#Username").val(null);
                    $("#Username").focus();
                }
            }
        });
    }
}

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

$(function () {
    $('#datapicker1').datepicker();
});

function Clear() {
    $("#EmployeeNumber").val(null);
    $("#Username").val(null);
    $("#FirstName").val(null);
    $("#LastName").val(null);
    $("#DateOfBirth").val(null);
    $("#Phone").val(null);
    $("#Cellphone").val(null);
    $("#Email").val(null);
    $("#Password").val(null);
    $("#RepeatPassword").val(null);
    $("#EmployeeNumber").removeAttr("readonly");
    $("#EmployeeNumber").focus();
    $("#collapseExample").hide("hide");
    EndLoading();
}

function ValidateNumbrer(e) {
    if (e.keyCode == 13 && $('#EmployeeNumber').val().length >= 4 && $('#EmployeeNumber').val().length <= 10 && !isNaN($('#EmployeeNumber').val())) {
        $.ajax({
            url: "/Home/FindByEmployeeId/",
            type: "GET",
            data: { "employeeId": $('#EmployeeNumber').val() },
            success: function (employee) {
                if (employee.success == true) {
                    StartLoading();
                    toastr.warning('El numero de empleado  ya esta registrado <br>■ Numero: ' + employee.employeeId + ' <br>■ Usuario: ' + employee.username + '');
                    Clear();
                } else {
                    $('#EmployeeNumber').attr('readonly', true);
                    $("#collapseExample").show("show");
                }
            },
            error: function () {
                $('#EmployeeNumber').attr('readonly', true);
                $("#collapseExample").show("show");
            }
        });

        return false;
    }
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
            minlength: 3,
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
        //    digits: true,
        //    minlength: 2,
        //    maxlength: 10
        //},
        Email: {
            required: true,
            email: true,
            maxlength: 60
        },
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
        },
        //Cellphone: {
        //    digits: "Ingresar números por favor.",
        //    required: "El Campo no puede estar vacío",
        //    minlength: "Favor de ingresar mas de 10 caracteres",
        //    maxlength: "Maximo 10 caracteres"
        //},
        Email: {
            required: "El Campo no puede estar vacío",
            maxlength: "Maximo 60 caracteres"
        },
        Password: {
            required: "El Campo no puede estar vacío",
            maxlength: "Maximo 60 caracteres"
        }, RepeatPassword: {
            required: "El Campo no puede estar vacío",
            equalTo: "Favor de introducir la misma contraseña"
        }

    },
    submitHandler: function (form) {
        StartLoading();
        $.ajax({
            type: "POST",
            url: "/Home/Register/",
            data: $(form).serialize(),
            success: function (returndate) {
                if (returndate.success == true) {
                    toastr.success('' + returndate.responseText + '<br>■ Numero: ' + $('#EmployeeNumber').val() + '<br>■ Usuario: ' + $('#Username').val() + '');
                    Clear();
                }
                else {
                    toastr.warning('' + returndate.responseText + '');
                    EndLoading();
                }
            },
            error: function () {
                toastr.error('' + returndate.responseText + '');
                EndLoading();
            }
        });

        return false;
    }
});