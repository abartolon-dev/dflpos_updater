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
            }
        },
        messages: {
            EmpNumber: {
                required: "El Campo no puede ser nulo",
                number: "Solo se permiten numeros.",
                minlength: "Favor de ingresar mas de 2 caracteres"

            }
        }
    });
});

function SendEmailToGetCode() {
    if ($('#EmailORuser').val()) {
        StartLoading();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/Home/GetCodeRecoveryPassword/",
            data: { "employeeUsername": $('#EmailORuser').val(), "type": false },
            success: function (returndate) {
                if (returndate.success == true) {
                    $('#divSuccessEmail').removeClass("hide");
                    var div = document.getElementById('divSuccessEmail');
                    div.innerHTML += returndate.email;
                    toastr.success('' + returndate.responseText + '');
                    $('#EmailORuser').val(null);
                }
                else {
                    toastr.warning('' + returndate.responseText + '');
                }

                EndLoading();
            },
            error: function (returndate) {
                toastr.error('Error Inesperado');

                EndLoading();
            }
        });
        return false;
    }
}

function Unlock() {
    var Code = JSON.parse($("#model").val());
    if ($("#FormInsert").valid()) {
        if ($('#EmpNumber').val() && Code != "") {
            StartLoading();
            $.ajax({
                type: "POST",
                url: "/Home/Unlocking/",
                data: { "empno": $('#EmpNumber').val(), "code": Code },
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