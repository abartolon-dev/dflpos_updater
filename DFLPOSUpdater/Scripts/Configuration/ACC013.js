

var model = JSON.parse($("#model").val());
var modelView = JSON.parse($("#View").val());
var modelERP = JSON.parse($("#modelERP").val());

$(document).ready(function () {
    window.setTimeout(function () { $("#fa").click(); }, 1000);
});


var mytable = $('#TableBlackL').DataTable({
    autoWidth: true,
    responsive: true,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    buttons: [
        {
            extend: 'csv', text: 'Excel', title: 'Proveedores_List_Negra', className: 'btn-sm', exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
            }
        },
        {
            extend: 'pdf', text: 'PDF', title: 'Proveedores_List_Negra', className: 'btn-sm', exportOptions: {
                columns: [0, 1, 2]
            },
            customize: function (doc) {
                doc.content[1].table.widths =
                    Array(doc.content[1].table.body[0].length + 1).join('*').split('');
            }
        },
        { extend: 'print', text: 'Imprimir', className: 'btn-sm' },
    ],
    columns: [
        { targets: 0, data: 'cofi_rfc' },
        { targets: 1, data: 'cofi_business_name' },
        { targets: 2, data: 'cofi_situation_sat' },
        { targets: 3, data: 'cofi_num_presumption_sat' },
        { targets: 4, data: 'cofi_presumption_sat_date' },
        { targets: 5, data: 'cofi_num_presumption_dof' },
        { targets: 6, data: 'cofi_presumption_dof_date' },
        { targets: 7, data: 'cofi_num_distorted_sat' },
        { targets: 8, data: 'cofi_distorted_sat_date' },
        { targets: 9, data: 'cofi_num_distorted_dof' },
        { targets: 10, data: 'cofi_distorted_dof_date' },
        { targets: 11, data: 'cofi_num_definitive_sat' },
        { targets: 12, data: 'cofi_definitive_sat_date' },
        { targets: 13, data: 'cofi_num_definitive_dof' },
        { targets: 14, data: 'cofi_definitive_dof_date' },
        { targets: 15, data: 'cofi_num_favorable' },
        { targets: 16, data: 'cofi_favorable_date' },
        { targets: 17, data: 'cofi_num_favorable_dof' },
        { targets: 18, data: 'cofi_favorable_dof_date' },
        { targets: 19, data: 'cofi_status', visible: false }
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        width: "1%"
    },
    {
        targets: [4, 6, 8, 10, 12, 14, 16, 18],
        render: function (data, type, row) {
            var date = moment(data).format('DD/MM/YYYY');
            if (date != 'Invalid date')
                return date;
            else
                return "";
        }
    },
    {
        targets: [2],
        render: function (data, type, full, meta) {
            if (full.cofi_status == 8)
                return `<strong class = "text-danger" > ${data}</strong >`
            else if (full.cofi_status == 7)
                return `<strong class = "text-warning" > ${data}</strong >`
            else
                return `<strong > ${data}</strong >`
        }
    }]
});



var mytableERP = $('#TableBlackLERP').DataTable({
    autoWidth: true,
    responsive: true,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    buttons: [
        {
            extend: 'csv', text: 'Excel', title: 'Proveedores_List_Negra', className: 'btn-sm', exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
            }
        },
        {
            extend: 'pdf', text: 'PDF', title: 'Proveedores_List_Negra', className: 'btn-sm', exportOptions: {
                columns: [0, 1, 2]
            },
            customize: function (doc) {
                doc.content[1].table.widths =
                    Array(doc.content[1].table.body[0].length + 1).join('*').split('');
            }
        },
        { extend: 'print', text: 'Imprimir', className: 'btn-sm' },
    ],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        if (aData.cofi_status == 8 || aData.cofi_status == 7)
            $('td', nRow).addClass("danger");
    },
    columns: [
        { targets: 0, data: 'cofi_rfc' },
        { targets: 1, data: 'cofi_business_name' },
        { targets: 2, data: 'cofi_situation_sat' },
        { targets: 3, data: 'cofi_num_presumption_sat' },
        { targets: 4, data: 'cofi_presumption_sat_date' },
        { targets: 5, data: 'cofi_num_presumption_dof' },
        { targets: 6, data: 'cofi_presumption_dof_date' },
        { targets: 7, data: 'cofi_num_distorted_sat' },
        { targets: 8, data: 'cofi_distorted_sat_date' },
        { targets: 9, data: 'cofi_num_distorted_dof' },
        { targets: 10, data: 'cofi_distorted_dof_date' },
        { targets: 11, data: 'cofi_num_definitive_sat' },
        { targets: 12, data: 'cofi_definitive_sat_date' },
        { targets: 13, data: 'cofi_num_definitive_dof' },
        { targets: 14, data: 'cofi_definitive_dof_date' },
        { targets: 15, data: 'cofi_num_favorable' },
        { targets: 16, data: 'cofi_favorable_date' },
        { targets: 17, data: 'cofi_num_favorable_dof' },
        { targets: 18, data: 'cofi_favorable_dof_date' },
        { targets: 19, data: 'cofi_status', visible: false }
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        width: "1%"
    },
    {
        targets: [4, 6, 8, 10, 12, 14, 16, 18],
        render: function (data, type, row) {
            var date = moment(data).format('DD/MM/YYYY');
            if (date != 'Invalid date')
                return date;
            else
                return "";
        }
    },
    {
        targets: [2],
        render: function (data, type, full, meta) {
            if (full.cofi_status == 8)
                return `<strong class = "text-danger" > ${data}</strong >`
            else if (full.cofi_status == 7)
                return `<strong class = "text-warning" > ${data}</strong >`
            else
                return `<strong > ${data}</strong >`
        }
    }]
});

if (!$.isEmptyObject(model)) {
    $('#TableBlackLDiv').animatePanel();
    mytable.rows.add($(model));
    mytable.columns.adjust().draw();
}
else {
    $('#TableBlackLDiv').animatePanel();
    mytable.clear();
    mytable.columns.adjust().draw();
}


if (!$.isEmptyObject(modelView)) {
    $("#IdTotalSuppliers").text((modelView.Definitivo + modelView.Presunto + modelView.Desvirtuado + modelView.Sentencia_Favorable));
    $("#IdDefinitivo").text(modelView.Definitivo);
    $("#IdPresunto").text(modelView.Presunto);
    $("#IdDesvirtuado").text(modelView.Desvirtuado);
    $("#IdSentencia_Favorable").text(modelView.Sentencia_Favorable);
    $("#SuppliersInERP").text(modelView.SuppliersInERP);
    if (modelView.LastUpdate != null)
        $("#IdLastUpdate").text(moment(modelView.LastUpdate).lang('es').format('DD [de] MMMM [del] YYYY [a las] h:mm:ss a'));
}

if (!$.isEmptyObject(modelERP)) {
    mytableERP.rows.add($(modelERP));
    mytableERP.columns.adjust().draw();
} else {
    mytableERP.clear();
    mytableERP.columns.adjust().draw();
}
