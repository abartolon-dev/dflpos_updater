
$(document).ready(function () {
    window.setTimeout(function () {
        $(".normalheader").addClass("small-header");
        $("#fa").removeClass("fa-arrow-up").addClass("fa-arrow-down");
        $("#hbreadcrumb").removeClass("m-t-lg");
    }, 5000);
});

var edit = false;
var indexEdit = -1;

var table = $('#TablePages').DataTable({
    drawCallback: function (settings) {
        $('#TablePages').dataTable().$('input').iCheck({ checkboxClass: 'icheckbox_square-green', });
    },
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    responsive: true,
    autoWidth: true,
    order: [[2, "asc"]],
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    buttons: [
        { extend: 'csv', text: 'Excel', title: 'Paginas', className: 'btn-sm' },
        {
            extend: 'pdf', text: 'PDF', title: 'Paginas', className: 'btn-sm', exportOptions: {
                columns: [1, 2, 3]
            },
            customize: function (doc) {
                doc.content[1].table.widths =
                    Array(doc.content[1].table.body[0].length + 1).join('*').split('');
            }
        },
        { extend: 'print', text: 'Imprimir', className: 'btn-sm' },
    ],
    columns: [
        { data: null, orderable: false },
        { data: 'page_id' },
        { data: 'page_name' },
        { data: 'description' },
        { data: 'url' },
        { data: 'active_flag' }
    ],
    columnDefs: [
        {
            targets: [1],
            visible: true,
            searchable: true
        },
         {
             targets: [5],
             render: function (data, type, row) {
                 if (type === 'display') {
                     if (data == true | data == 'True') {
                         return '<div checked><label><input type="checkbox" disabled checked></label></div>'
                     }
                     else {
                         return '<div><label><input type="checkbox" disabled></label></div>'
                     }
                 }
                 return data;
             }
         },
        {
            data: null,
            width: "1%",
            defaultContent: '<button class="btn btn-xs btn-outline btn-danger" type="submit"><i class="pe-7s-config"></i> Editar</button>',
            targets: [0]
        }
    ]
});

$('#TablePages tbody').on('click', 'button', function () {
    var values = table.row($(this).parents('tr')).data();
    values = $.map(values, function (value, index) {
        switch (index) {
            case 'page_id':
                $("#page_id").val(value);
                break;
            case 'page_name':
                $("#page_name").val(value);
                break;
            case 'description':
                $("#description").val(value);
                break;
            case 'url':
                $("#url").val(value);
                break;
            case 'active_flag':
                checkBoxStyle(value);
                break;
        }
    });

    $('#page_id').prop('readonly', true);
    $("#ModalTitle").html('Modificar Pagina');
    $("#ModalDescription").html('Formulario para modificar pagina.');
    $("#ModalAddPages").removeClass("hmodal-success").addClass("hmodal-warning");
    edit = true;
    indexEdit = table.row(this).index();
    $('#ModalAddPages').modal('show');
});

function checkBoxStyle(s) {
    if (s == true | s == 'True') {
        $('#Check').children().addClass("checked").length;
        $('#active_flag_Value').prop("checked", true);
    }
    else {
        $('#Check').children().removeClass("checked").length;
        $('#active_flag_Value').prop("checked", false);
    }
}

function AddPage() {
    clear();
    $('#ModalAddPages').modal('show');
}

function clear() {
    $("#page_id").val(null);
    $("#page_name").val(null);
    $("#description").val(null);
    $("#url").val(null);
    $('#page_id').prop('readonly', false);
    $("#ModalTitle").html('Agregar Pagina');
    $("#ModalDescription").html('Formulario para registrar una nueva pagina.');
    $("#ModalAddPages").removeClass("hmodal-warning").addClass("hmodal-success");
    indexEdit = null;
    edit = false;
}
function ChangeValues(s) {
    $.ajax({
        type: "GET",
        url: "/Configuration/ActionGetAllPagesByType/",
        data: { "type": s.checked },
        success: function (returndate) {
            if (returndate.success == true) {
                table.clear().draw();
                table.rows.add($.parseJSON(returndate.Json));
                table.columns.adjust().draw();
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
$("#form").validate({
    rules: {
        page_id: {
            required: true,
            minlength: 4,
            maxlength: 10
        },
        page_name: {
            required: true,
            minlength: 4,
            maxlength: 50
        },
        description: {
            required: true,
            minlength: 4,
            maxlength: 100
        },
        url: {
            required: true,
            minlength: 4,
            maxlength: 100
        }
    },
    messages: {
        page_id: {
            required: "El Campo no puede ser nulo",
            minlength: "Favor de ingresar mas de 4 caracteres",
            maxlength: "Máximo 10 caracteres"
        },
        page_name: {
            required: "El Campo no puede ser nulo",
            minlength: "Favor de ingresar mas de 4 caracteres",
            maxlength: "Máximo 50 caracteres"
        },
        description: {
            required: "El Campo no puede ser nulo",
            minlength: "Favor de ingresar mas de 4 caracteres",
            maxlength: "Máximo 100 caracteres"
        },
        url: {
            required: "El Campo no puede ser nulo",
            minlength: "Favor de ingresar mas de 4 caracteres",
            maxlength: "Máximo 100 caracteres"
        }
    },
    submitHandler: function (form) {
        if (edit == true) {
            StartLoading();
            $.ajax({
                type: "POST",
                url: "/Configuration/ActionEditPages/",
                data: { "page_id": $('#page_id').val(), "page_name": $('#page_name').val(), "description": $('#description').val(), "url": $('#url').val(), "active_flag": $('#active_flag_HasValue').prop("checked"), "type": $('#checkView').prop("checked") },
                //data: $(form).serialize(),
                success: function (returndate) {
                    if (returndate.success == true) {
                        EndLoading();
                        //var values = table.rows(indexEdit).data()[0];
                        //values[1] = $('#page_name').val();
                        //values[2] = $('#description').val();
                        //values[3] = $('#url').val();
                        //table.row(indexEdit).data(values).invalidate();
                        //Limpia datos de la tabla.
                        table.clear().draw();
                        //Agrega nuevos datos a la tabla.
                        table.rows.add($.parseJSON(returndate.Json))
                        //Dibuja de nuevo la tabla con los nuevos datos
                        table.columns.adjust().draw();
                        $('#ModalAddPages').modal('hide');
                        toastr.success('' + returndate.responseText + '.');
                    }
                    else {
                        EndLoading();
                        toastr.warning('' + returndate.responseText + '');
                    }
                },
                error: function (returndate) {
                    toastr.error('Error inesperado contactar a sistemas.');
                    EndLoading();
                }
            });

            return false;
        }
        else {
            StartLoading();
            $.ajax({
                type: "POST",
                url: "/Configuration/ActionInsertPages/",
                data: { "page_id": $('#page_id').val(), "page_name": $('#page_name').val(), "description": $('#description').val(), "url": $('#url').val(), "active_flag": $('#active_flag_HasValue').prop("checked"), "type": $('#checkView').prop("checked") },
                //data: $(form).serialize(),
                success: function (returndate) {
                    if (returndate.success == true) {
                        EndLoading();
                        //Limpia datos de la tabla.
                        table.clear().draw();
                        //Agrega nuevos datos a la tabla.
                        table.rows.add($.parseJSON(returndate.Json));
                        //Dibuja de nuevo la tabla con los nuevos datos
                        table.columns.adjust().draw();
                        //table.row.add([$('#page_id').val(), $('#page_name').val(), $('#description').val(), $('#url').val(), "True"]).draw();
                        $('#ModalAddPages').modal('hide');
                        toastr.success('' + returndate.responseText + '.');
                    }
                    else {
                        EndLoading();
                        toastr.warning('' + returndate.responseText + '');
                    }
                },
                error: function (returndate) {
                    toastr.error('Error inesperado contactar a sistemas.');
                    EndLoading();
                }
            });
            return false;
        }
    }

});
