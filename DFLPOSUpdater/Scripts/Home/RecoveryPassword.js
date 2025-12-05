
$(document).ready(function () {
    $("#EmployeeNumber").focus();
    $("#FormInsert").validate({
        rules: {
            EmpNumber: {
                required: true,
                number: true,
                digits: true,
                minlength: 2,
                maxlength: 10
            },
            NewPass: {
                required: true,
                minlength: 4
            },
            NewPassRe: {
                required: true,
                minlength: 4,
                equalTo: "#NewPass"
            }

        },
        messages: {
            EmpNumber: {
                required: "El Campo no puede ser nulo",
                number: "Solo se permiten numeros.",
                minlength: "Favor de ingresar mas de 2 caracteres"

            },
            NewPass: {
                required: "El Campo no puede ser nulo",
                minlength: "Favor de ingresar mas de 4 caracteres"
            },
            NewPassRe: {
                required: "El Campo no puede ser nulo",
                minlength: "Favor de ingresar mas de 4 caracteres",
                equalTo: "Favor de introducir la misma contraseña"
            }
        }//,
        //showErrors: function (errorMap, errorList) {
        //    toastr.warning(errorList[0].message);
        //    this.defaultShowErrors();
        //}
    });
});

function SendEmailToRecoveryPassword() {
    if ($('#EmailORuser').val()) {
        StartLoading();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/Home/GetCodeRecoveryPassword",
            data: { "employeeUsername": $('#EmailORuser').val(), type: true },
            success: function (returndate) {
                if (returndate.success) {
                    $('#divSuccessEmail').removeClass("hide");
                    var div = document.getElementById('divSuccessEmail');
                    div.innerHTML += returndate.email;
                    toastr.success('Alerta - ' + returndate.responseText + '');
                    $('#EmailORuser').val(null);
                }
                else
                    toastr.warning('Alerta - ' + returndate.responseText + '');
                EndLoading();
            },
            error: function (returndate) {
                EndLoading();
                toastr.error('Alerta - Error Inesperado');
            }
        });
        return false;
    }
}
function InsertNewPass() {
    var Code = JSON.parse($("#model").val());
    if ($("#FormInsert").valid()) {
        if ($('#EmpNumber').val() && Code != "" && $('#NewPass').val()) {
            StartLoading();
            $.ajax({
                type: "POST",
                url: "/Home/RecoveryPassword/",
                data: { "empno": $('#EmpNumber').val(), "code": Code, "password": $('#NewPass').val() },
                success: function (returndate) {
                    if (returndate.success == true) {
                        toastr.success('' + returndate.responseText + '');
                        $('#EmailORuser').val(null);
                        window.setTimeout(function () {
                            EndLoading();
                            window.location.href = "Login";
                        }, 2500);
                    }
                    else {
                        toastr.warning('' + returndate.responseText + '');
                        EndLoading();
                    }

                },
                error: function () {
                    toastr.error('Error Inesperado');
                    EndLoading();
                }
            });

            return false;
        }
    } else {
        toastr.error('Favor de verificar sus datos.');
    }

}