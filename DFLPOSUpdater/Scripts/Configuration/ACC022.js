var rfcSelected;
var currencySelected = "MXN";
var supplierSelected;
var creditorSelected;
var typeSelected;
var finalSupplierSelected;
var typeSelectedStr;
var global_payment_id = 0;
var global_payment_egreso = "";
var global_payment_origin = "";
var global_payment_destiny = "";
var global_payment_not_negotiable = false;
var global_payment_account_credit = false;
var global_payment_cheque = 0;
var global_payment_method = "";
var listDetail = []
var Ssubtotal = 0;
var Siva = 0;
var Sieps = 0;
var Stotal = 0;
var discountsSelectedAdd = []
var discountsDelete = []
var check_invoices_available = [];
var discountAmount = 0;
var StotalFac = 0;
var discountSubtotal = 0;
var discountIva = 0;
var discountIeps = 0;
var discountRateIva = 0;
var discountRateIeps = 0;
var discountTotal = 0;
var c = 0; //Consecutivo para descuentos
const formatMoney = money => decimal => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", currencyDisplay: "symbol", maximumFractionDigits: decimal }).format(money);

function PutClassICheck() {
    $('input[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_square-green',
    }).on('ifClicked', function () {
        $(this).trigger("click");
    });
}

$("#ValidDate1").datepicker({
    autoclose: true,
    todayHighlight: true,
    showButtonPanel: true
}).on("changeDate", function (e) {
    $("#ValidDate3").val($("#ValidDate1").val())
});
$("#ValidDate2").datepicker({
    autoclose: true,
    todayHighlight: true
}).on("changeDate", function (e) {
    $("#ValidDate4").val($("#ValidDate2").val())
});
$("#ValidDate3").datepicker({
    autoclose: true,
    todayHighlight: true,
    showButtonPanel: true
}).on("changeDate", function (e) {
});
$("#ValidDate4").datepicker({
    autoclose: true,
    todayHighlight: true
}).on("changeDate", function (e) {
});
var dateNow = new Date();
$("#dateCheck").datepicker({
    autoclose: true,
    todayHighlight: true,
    startDate: dateNow
}).on("changeDate", function (e) {
    checkCurrency()
});
$("#dateTransfer").datepicker({
    language: 'es',
    autoclose: true,
    todayHighlight: true,
    startDate: dateNow
}).on("changeDate", function (e) {
});


$(document).ready(function () {
    //$("#ValidDate1").val("07/01/2021")
    //$("#ValidDate2").val("08/01/2021")
    //PutClassICheck();
})

$('#uuidTable').on('draw.dt', function () { //Imprimir los i-check del datatable
    iChecks();
});
$("#supplier").select2({
    minimumInputLength: 3,
    allowClear: true,
    placeholder: "Seleccione una proveedor",
    initSelection: function (element, callback) {
        callback({ id: "0", text: "Seleccione una proveedor" });
    },
    ajax: {
        url: "/AccountingSupplier/ActionSearchSupplierData/",
        dataType: 'json',
        type: "GET",
        quietMillis: 50,
        data: function (Filter) {
            return {
                Filter: Filter,
                type: "supplier"
            };
        },
        results: function (data) {
            return {
                results: $.map(data.Json, function (item) {
                    return {
                        text: `${item.business_name}`,
                        id: item.rfc
                    }
                }),
            };
        }
    }
});

$("#creditor").select2({
    minimumInputLength: 3,
    allowClear: true,
    placeholder: "Seleccione una acreedor",
    initSelection: function (element, callback) {
        callback({ id: "0", text: "Seleccione una acreedor" });
    },
    ajax: {
        url: "/AccountingSupplier/ActionSearchSupplierData/",
        dataType: 'json',
        type: "GET",
        quietMillis: 50,
        data: function (Filter) {
            return {
                Filter: Filter,
                type: "creditor"
            };
        },
        results: function (data) {
            return {
                results: $.map(data.Json, function (item) {
                    return {
                        text: `${item.business_name}`,
                        id: item.rfc
                    }
                }),
            };
        }
    }
});

var table = $('#uuidTable').DataTable({
    "autoWidth": true,
    "searching": true,
    "bLengthChange": false,
    "bFilter": false,
    buttons: [],
    "order": [[14, "asc"]],
    createdRow: function (row, data, dataIndex) {
        if (data.policy_is_square && data.quick_pay) //PROVEEDORES CON PRONTO PAGO
            return;
        if (!data.policy_is_square || (data.payment_nc_status != "OK" && data.payment_nc_status != "OK_NC")) {
            $(row).css('background-color', '#F6FA7A');//yellow
            $(row).css('color', 'Gray');
        }
    },
    oLanguage: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ Registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        if (aData.metadata_active != null) {
            if (!aData.metadata_active) {
                $('td', nRow).addClass("danger");
            }
        }
    },
    columns:
        [{
            "class": "details-control",
            "orderable": false,
            "data": null,
            "defaultContent": ""
        },
        { data: null },
        { data: null },
        { data: 'id_uuid' },
        { data: 'site_name' },
        { data: 'document_no' },
        { data: 'invoice' },
        { data: 'policy_date' },
        { data: 'cur_code' },
        { data: 'policy_subtotal' },
        { data: 'policy_iva' },
        { data: 'policy_ieps' },
        { data: 'total_amount' },
        { data: 'cn_amount' },
        { data: 'payment_nc_status' },
        { data: 'metadata_active' }
        ],
    columnDefs:
        [
            {
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                width: "1%"
            }, {
                data: null,
                width: "1%",
                render: function (data, type, full, meta) {
                    if (full.policy_is_square && ((full.payment_nc_status == "OK" || full.payment_nc_status == "OK_NC") || full.quick_pay == true)) {
                        if (full.metadata_active != null) {
                            if (full.metadata_active) {
                                return `<div class='checkbox'><label><input type='checkbox' class='ichecks' id = '` + full.id_uuid + `' uuid = '` + full.id_uuid + `' total = '` + full.total_amount
                                    + `' policy_id = '` + full.policy_id + `' policy_iva = '` + full.policy_iva + `' policy_ieps = '` + full.policy_ieps
                                    + `' invoice_rate_iva = '` + full.invoice_rate_iva + `' invoice_rate_ieps = '` + full.invoice_rate_ieps + `' policy_subtotal = '` + full.policy_subtotal +
                                    `' payment_before = '` + full.policy_debit_amount + `' /></label></div>`;
                            } else {
                                return '';
                            }
                        } else
                            return `<div class='checkbox'><label><input type='checkbox' class='ichecks' id = '` + full.id_uuid + `' uuid = '` + full.id_uuid + `' total = '` + full.total_amount
                                + `' policy_id = '` + full.policy_id + `' policy_iva = '` + full.policy_iva + `' policy_ieps = '` + full.policy_ieps
                                + `' invoice_rate_iva = '` + full.invoice_rate_iva + `' invoice_rate_ieps = '` + full.invoice_rate_ieps + `' policy_subtotal = '` + full.policy_subtotal +
                                `' payment_before = '` + full.policy_debit_amount + `' /></label></div>`;
                    } else
                        return ''
                },
                targets: [1]
            }, {
                targets: [ 9, 10, 11, 12, 13],
                render: function (data, type, full, meta) {
                    return formatMoney(data)(2)
                },
                width: "1%"
            }, {
                data: null,
                width: "1%",
                render: function (data, type, full, meta) {
                    return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDF('` + full.id_uuid + `')"><i class="fa fa-info-circle"></i> PDF</button>`;
                },
                targets: [2]
            },
            {
                render: function (data, type, full, meta) {
                    if (data == null) {
                        return `<p class="text-danger">Factura no valida</p>`;
                    } else {
                        if (data) {
                            return "<div class='text-center'><i class='fa fa-check-circle fa-2x text-success'></i><p class='text-success'><b>Vigente</b></p></div>";
                        } else
                            return "<div class='text-center'><i class='fa fa-close fa-2x text-danger'></i><p class='text-danger'><b>Cancelada ante el SAT</b></p></div>";
                    }
                },
                targets: [15]
            },
            {
                render: function (data, type, full, meta) {
                   
                        return `<div class='text-center'><i class='fa fa-close fa-2x text-danger'></i><p class='text-danger'><b>` + data + `</b></p><button class="btn btn-xs btn-outline btn-primary" onclick="showPVXML('` + full.id_uuid + `','` + full.document_no + `','` + full.site_code + `',1,2,null,null,null)"><i class="fa fa-plus"></i> NOTAS</button></div>`
                    
                },
                targets: [13]
            },
            {
                render: function (data, type, full, meta) {
                    if (data == "OK") {
                        return `<div class='text-center'><i class='fa fa-check-circle fa-2x text-success'></i><p class='text-success'><b>Valida</b></p><button class="btn btn-xs btn-outline btn-primary" onclick="showPVXML('` + full.id_uuid + `','` + full.document_no + `','` + full.site_code + `',0,2,null,null,null)"><i class="fa fa-plus"></i> NOTAS</button></div>`

                    } else if (data == "OK_NC") {
                        return `<div class='text-center'><i class='fa fa-check-circle fa-2x text-success'></i><p class='text-success'><b>Valida</b></p><button class="btn btn-xs btn-outline btn-primary" onclick="showPVXML('` + full.id_uuid + `','` + full.document_no + `','` + full.site_code + `',0,2,null,null,null)"><i class="fa fa-plus"></i> NOTAS</button></div>`;
                    } else {
                        return `<div class='text-center'><i class='fa fa-close fa-2x text-danger'></i><p class='text-danger'><b>` + data + `</b></p><button class="btn btn-xs btn-outline btn-primary" onclick="showPVXML('` + full.id_uuid + `','` + full.document_no + `','` + full.site_code + `',1,2,null,null,null)"><i class="fa fa-plus"></i> NOTAS</button></div>`
                    }
                },
                targets: [14]
            }
        ]
});
FullTd = element => Option => `<td>${Option == 1 ? fomartmoney(element)(2) : Option == 0 ? element : element != null && element.trim() != "" ? "Contado" : "No contado"}</td >`
FullTh = element => `<th>${element}</th>`
FullTable = element => array => array.map(title => FullTd(element[title.title])(title.option)).toString();
FullTableHeader = array => `<tr>${array.map(title => FullTh(title))}</tr>`

$('#uuidTable tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = table.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
        //tr.removeClass('rowSelected');
    }
    else {
        if (table.row('.details').length) {
            $('.details-control', table.row('.details').node()).click();
        }
        row.child(format(row.data())).show();
        tr.addClass('details');
        //tr.addClass('rowSelected');
    }
});


//Tabla detalles
function format(d) {
    console.log(d)
    var detailItems = "";
    var tabledetail = $('<div/>').addClass('loading').text('Cargando Datos...');
    $.ajax({
        url: "/AccountingPayment/ActionGetCreditNotesPayment/",
        data: { "document_no": d.document_no, "site_code": d.site_code },
        type: "POST",
        success: function (json) {
            if (json.success) {
                detailItems = json.data.map(value => ` <tr>${FullTable(value)([
                    { title: null, option: 0 },
                    { title: "uuid", option: 0 },
                    { title: "policy_reference", option: 0 },
                    { title: "document_no", option: 0 },
                    { title: "policy_subtotal", option: 0 },
                    { title: "policy_iva", option: 0 },
                    { title: "policy_ieps", option: 0 },
                    { title: "policy_credit_amount", option: 0 },
                    { title: "cur_code", option: 0 },
                    { title: "exchange_currency", option: 0 }])}</tr>`).join().replace(/>,</g, '><').replace(/>, </g, '><')
                header = FullTableHeader(["", "UUID", "Referencia", "Documento", "Subtotal", "IVA", "IEPS", "Importe", "Moneda", "TCDOF"]).replace(/,/g, '')
                var Html = (`<div class="table-responsive"><table id="tabledetail" class="table table-striped table-bordered table-hover" style="width:100%"><thead>
                                                                  ${header}
                                                    </thead><tbody>${detailItems.length > 0 ? detailItems : "<td colspan='10' style='text-align: center;'>No cuenta con notas de credito</td>"}</tbody></table></div>`);
                Apro = ` <div class="row"> <div class="col-md-10"> <button id="btn-cancel" type="button" onclick = "confirmacionNC('` + d.id_uuid + `')"  class="btn btn-sm btn-danger"><i class="fa fa-close"></i>Desasociar NC</button></div></div></div>`;
                tabledetail.html(Html + Apro).removeClass('loading');
                             if (detailItems.length > 0)
                    reloadStyleTable();

            } else {
                if (json.data == "SF") {
                    SessionFalse("Terminó tu sesión");
                    return;
                } else {
                    toastr.error("Ha ocurrido un error , contacte a sistema")
                }
            }
        }
    });
    return tabledetail;
}
//desasociar nota de credito
function confirmacionNC(uuid) {
    swal({
        title: "Desasociar Notas",
        text: "Se desociaran las notas de credito relacionadas a la facturas",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar"
    }, function (isConfirm) {
        if (isConfirm)
            desasociarNC(uuid);
    });
}
function desasociarNC(uuid) {
    StartLoading();
    $.ajax({
        url: "/Purchases/ActionDesasociarNCACompra",
        type: "POST",
        data: {
            "uuid": uuid, "rfc": rfcSelected
        },
        success: function (response) {
            if (response.result) {
                var current_index = table.data().toArray().findIndex(f => f.id_uuid == uuid);
                var uuid_table = table.row(current_index).data().id_uuid;
                var cn_amount_table = parseFloat(table.row(current_index).data().cn_amount);
                var xml_amount_table = parseFloat(table.row(current_index).data().total_amount);
                table.row(current_index).data(response.data).draw()



                console.log(uuid_table)
                if (listDetail.findIndex(f => f.uuid === uuid_table) === -1) {
                    console.log('not contain')
                } else {
                    console.log('contain')
                    console.log(cn_amount_table)
                    total_xml -= (xml_amount_table + cn_amount_table);
                    total_cn -= cn_amount_table;
                }

                //tabledetail.clear();
                //tabledetail.draw()
                $('#PVMainModal').modal('hide');
                EndLoading();
                toastr.success("Notas de credito desasociadas correctamente");
                listDetail = listDetail.filter(x => x.uuid != uuid);
                ValidationAmountsSelected()
                refreshTotals();
            } else {
                EndLoading();
                toastr.error('Alerta - Error inesperado  contactar a sistemas.');
            }



        },
        error: function () {
            EndLoading();
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        }
    });
}
//Recargar tabla
function reloadStyleTable() {
    tabledetail = $('#tabledetail').DataTable({
        "searching": false,
        "bLengthChange": false,
        "bFilter": false,
        oLanguage: {
            "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningun dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Ãltimo", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
        },
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
        buttons: [
        ],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        "pageLength": -1,
        columnDefs:
            [{
                targets: [0, 2, 3, 5, 6, 7, 8, 9],
                width: "1%"
            }, {
                targets: [1],
                width: "10%"
            },
            {
                targets: [4, 5, 6, 7, 9],
                render: function (data, type, full, meta) {
                    return formatMoney(data)(2)
                },
                width: "1%"
            },
            {
                data: null,
                width: "1%",
                render: function (data, type, full, meta) {
                    return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDF('` + full[1] + `')"><i class="fa fa-info-circle"></i> PDF</button>`;
                },
                targets: [0]
            }
            ]
    });
    showTableDetail();
}
var tablePaymentsHeader = $('#tablePayments').DataTable({
    "autoWidth": true,
    "searching": false,
    "bLengthChange": false,
    "bFilter": false,
    buttons: [

    ],
    oLanguage: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ Registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    columns:
        [
            {
                "class": "details-control",
                "orderable": false,
                "data": null,
                "defaultContent": "",
                visible: true,
            },
            { data: null, class: "text-center", visible: false },
            { data: 'payment_id' },
            { data: 'supplier_rfc' },
            { data: 'supplier_name' },
            { data: 'account_number' },
            { data: 'payment_destiny_bank', visible: false },
            { data: 'payment_reference', visible: false },
            { data: 'payment_description', visible: false },
            { data: 'payment_date' },
            { data: 'payment_total' },
            { data: 'payment_currency' },
            { data: 'payment_method' }
        ],
    columnDefs:
        [
            {
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                width: "1%"
            },
            {
                targets: [9],
                render: function (data, type, full, meta) {
                    return moment(data).format("DD/MM/YYYY");
                },
                width: "1%"
            },
            {
                targets: [10],
                render: function (data, type, full, meta) {
                    return formatMoney(parseFloat(data))(2);
                },
                width: "1%"
            },
            {
                data: null,
                width: "1%",
                render: function (data, type, full, meta) {
                    return `<div class='checkbox'><label><input type='checkbox' class='i-checks oneCheck' payment_id = '` + full.payment_id + `' payment_total = '` + full.payment_total + `' /></label></div>`;
                },
                targets: [1]
            }

        ]
});

function searchPayments() {
    var date1 = $("#ValidDate1").val();
    var date2 = $("#ValidDate2").val();
    if (date2 == "" || date1 == "") {
        toastr.warning("Selecciona un rango de fecha.");
        return;
    }
    supplierSelected = $("#supplier").val();
    creditorSelected = $("#creditor").val();
    typeSelected = $("#supplierType").is(':checked');
    if (supplierSelected == "" && creditorSelected == "") {
        toastr.error("Seleccione un proveedor");
        return;
    }
    if (typeSelected) {
        typeSelectedStr = "creditor"
        showInfoSupplier(creditorSelected);
        finalSupplierSelected = creditorSelected
    }
    else {
        typeSelectedStr = "supplier"
        showInfoSupplier(supplierSelected);
        finalSupplierSelected = supplierSelected
    }
    StartLoading();
    $.ajax({
        url: "/AccountingPayment/ActionGetPaymentsTransferByDatesAndStatusWithRFC/",
        data: {
            "dateInitial": date1, "dateFinish": date2, "status": 1, "rfc": finalSupplierSelected, "typeSupplier": typeSelectedStr
        },
        type: "POST",
        success: function (json) {
            if (json.success) {
                ClearTableWithArray(tablePaymentsHeader, json.data);
                //iChecksHeader();
                EndLoading();
            } else {
                if (json.data == "SF") {
                    SessionFalse("Terminó tu sesión");
                    EndLoading();
                    return;
                } else {
                    EndLoading();
                    toastr.error("Ha ocurrido un error , contacte a sistemas");
                }
            }
        }
    });
}

var detailRowsPayment = [];
$('#tablePayments tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tablePaymentsHeader.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
        tr.removeClass('rowSelected');
    }
    else {
        if (tablePaymentsHeader.row('.details').length) {
            $('.details-control', tablePaymentsHeader.row('.details').node()).click();
        }
        row.child(FormatCommon(row.data())).show();
        tr.addClass('details');
        tr.addClass('rowSelected');
    }
});

tablePaymentsHeader.on('draw', function () {
    $.each(detailRowsPayment, function (i, id) {
        $('#' + id + ' td.details-control').trigger('click');
    });
});

function FormatCommon(d) {
    StartLoading();
    var detailUUid = "";
    var detailItems = "";
    var tableHTML = "";
    supplierSelected = $("#supplier").val();
    creditorSelected = $("#creditor").val();
    typeSelected = $("#supplierType").is(':checked');
    if (typeSelected) {
        typeSelectedStr = "creditor"
        showInfoSupplier(creditorSelected);
        finalSupplierSelected = creditorSelected
    } else {
        typeSelectedStr = "supplier"
        showInfoSupplier(supplierSelected);
        finalSupplierSelected = supplierSelected
    }
    var tabledetail = $('<div/>').addClass('loading').text('Cargando Datos...');
    $.ajax({
        url: "/AccountingSupplier/ActionGetInfoPaymentsById",
        data: { "payment_id": d.payment_id, "type": typeSelectedStr, "rfc": d.supplier_rfc },
        type: "GET",
        success: function (returndate) {
            if (returndate.success) {
                if (returndate.current_payments != null) {
                    global_payment_id = d.payment_id;
                    $.each(returndate.current_payments, function (index, value) {
                        detailUUid += `<tr><td class='text-center'>` + ValidateReport(value.id_uuid, value.Invoice_xml) + `</td>` +
                            `<td class='text-center'>` + value.id_uuid + `</td>` +
                            `<td class='text-center'>` + value.site_name + `</td>` +
                            `<td class='text-center'>` + value.document_no + `</td>` +
                            `<td class='text-center'>` + value.invoice + `</td>` +
                            `<td class='text-center'>` + value.policy_date + `</td>` +
                            `<td class='text-center'>` + value.cur_code + `</td>` +
                            `<td class='text-center'>` + formatMoney(value.policy_subtotal)(4) + `</td>` +
                            `<td class='text-center'>` + formatMoney(value.policy_iva)(4) + `</td>` +
                            `<td class='text-center'>` + formatMoney(value.policy_ieps)(4) + `</td>` +
                            `<td class='text-center'>` + formatMoney(value.total_amount)(4) + `</td>` +
                            `<td class='text-center'>` + formatMoney(value.cn_amount)(4) + `</td>` +
                            //`<td>` + formatMoney(value.cn_amount)(4) + `<button class='btn btn-xs btn-outline btn-primary' onclick="showPVXML('` + value.id_uuid + `','` + value.document_no + `','` + value.site_code + `',0,2,null,null,null)"> <i class="fa fa-plus"></i> NOTAS</button> </td>`+
                            `<td><button class='btn btn-xs btn-outline btn-danger text-center' onclick='DeleteInvoiceSimple(` + d.payment_id + `,"` + value.id_uuid + `", ` + value.total_amount + `)'> <i class='fa fa-close'></i> Eliminar </button> </td></tr>`;
                    });
                    tableHTML += '<br><br><div class="row">' +
                        '<div class="text-center">' +
                        '<button type="button" class="btn btn-lg btn-success" onclick="ShowNewInvoices()"><i class="fa fa-check"></i> Agregar más facturas</button>' +
                        '</div> ' +
                        '</div><br><table id="tabledetailPayment" class="table table-striped table-bordered table-hover" style="width:100%">' +
                        '<thead><tr><th>PDF</th><th>UUID</th><th>Tienda</th><th>#Compra</th><th>Factura</th><th>Fecha Compra</th><th>Moneda</th><th>SubTotal</th><th>IVA</th><th>IEPS</th><th>Total</th><th>NC Aplicada</th><th>Eliminar</th></tr></thead><tbody>' + detailUUid + '</tbody></table> ';
                }
                tabledetail.html(tableHTML).removeClass('loading');
                reloadStyleTableSimple();

            } else {
                SessionFalse(sesion);
            }
            EndLoading();
        }
    });
    return tabledetail;
}
////+notas

// +notas
function ValidateReport(data, flag) {
    if (flag)
        return `<button class="btn btn-xs btn-outline btn-info text-center" onclick="showPDF('` + data + `')"> <i class="fa fa-info-circle"></i> PDF Relacionado</button> <br/> <br/>
                                        <button class="btn btn-xs btn-outline btn-success" onclick="downloadXML('` + data + `')"><i class="fa fa-download"></i> XML</button>`;
    else
        return `<p>No disponible</p>`;
}

var TempTableDetail = $(`#tabledetailPayment`).DataTable({
    oLanguage: {
        autoWidth: true,
        responsive: true,
        searching: true,
        paging: true,
        ordering: true,
        info: true,
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    columns:
        [
            { data: null, visible: false },
            { data: 'id_uuid' },
            { data: 'site_name' },
            { data: 'document_no' },
            { data: 'invoice' },
            { data: 'policy_date' },
            { data: 'cur_code' },
            { data: 'policy_subtotal' },
            { data: 'policy_iva' },
            { data: 'policy_ieps' },
            { data: 'total_amount' },
            { data: 'cn_amount' },
            { data: null, visible: false }
        ],
});

function reloadStyleTableSimple(number_random) {
    TempTableDetail = $('#tabledetailPayment').DataTable();
}


function ShowNewInvoices() {
    StartLoading();
    $('#divTablePayments').addClass('hide');
    $('#DivMainPayment').addClass('hide');
    $('#DivNewPayments').removeClass('hide');
    $('#DivBackMain').removeClass('hide');
    $('#DivNewParameters').removeClass('hide');
    searchInvoices();
}

function BackMainPayments() {
    StartLoading();
    $('#DivNewParameters').addClass('hide');
    $('#DivBackMain').addClass('hide');
    $('#DivNewPayments').addClass('hide');
    $('#DivMainPayment').removeClass('hide');
    $('#divTablePayments').removeClass('hide');
    searchPayments();
}

function ClearTableWithArray(myTable, information) {
    myTable.clear().draw();
    myTable.rows.add(information);
    myTable.columns.adjust().draw();
}

function DeleteInvoiceSimple(payment_id, current_uuid, amount_delete) {
    if (TempTableDetail.data().toArray().length > 1) {
        swal({
            title: "¿Esta seguro que desea ELIMINAR la factura del pago?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EA6557",
            confirmButtonText: "Continuar",
            cancelButtonText: `Cancelar`
        }, function (isConfirm) {
            StartLoading();
            $.ajax({
                type: "POST",
                url: "/AccountingSupplier/ActionInvoiceOneDelete",
                data: { "payment_id": payment_id, "current_uuid": current_uuid, "amount_delete": amount_delete },
                success: function (response) {
                    EndLoading();
                    if (!response.success)
                        SessionFalse("Terminó tu sesión")
                    else {
                        if (response.result_status == 1) {
                            ClearTableWithArray(TempTableDetail, TempTableDetail.data().toArray().filter(f => f[1] != current_uuid));
                            toastr.success("La Factura fue eliminada correctamente.");
                            searchPayments();
                        } else if (response.result_status == 3) {
                            toastr.error("Error al actualizar la factura.");
                        } else if (response.result_status == 4) {
                            toastr.error("No se encontro la factura a eliminar.");
                        } else if (response.result_status == 5) {
                            toastr.error("Error al intentar actualizar. Contacte a sistemas. (5)");
                        } else if (response.result_status == 6) {
                            toastr.error("Error al intentar actualizar. Contacte a sistemas. (6)");
                        } else {
                            toastr.error("DESCONOCIDO, CONTACTA A SISTEMAS.")
                        }
                    }
                },
                error: function () {
                    EndLoading();
                    toastr.error("DESCONOCIDO, CONTACTA A SISTEMAS.")
                }
            }).then(function () {
            });
        });
    } else {
        toastr.warning("No pueden eliminar todas las facturas de un pago.");
    }
}

function searchInvoices() {
    typeSelected = $("#supplierType").is(':checked');
    ClearPayments();
    if (supplierSelected == "" && creditorSelected == "") {
        toastr.error("Seleccione un proveedor");
        return;
    }
    if ($('#ValidDate3').val() == "" || $('#ValidDate4').val() == "") {
        toastr.error("Seleccione un rango de fechas");
        return;
    }
    StartLoading();
    var date1 = moment($("#ValidDate3").val(), 'MM/DD/YYYY').format('MM/DD/YYYY');
    var date2 = moment($("#ValidDate4").val(), 'MM/DD/YYYY').format('MM/DD/YYYY');

    if (typeSelected) {
        typeSelectedStr = "creditor"
        showInfoSupplier(creditorSelected);
        finalSupplierSelected = creditorSelected
    }
    else {
        typeSelectedStr = "supplier"
        showInfoSupplier(supplierSelected);
        finalSupplierSelected = supplierSelected
    }
    var discountManual = false;


    function DiscountManual(a) {
        if (a == "Manual") {
            discountManual = true;
            $("#divDiscountManual").show();
            $("#divDiscountAuto").hide();
            $("#labelManualManual").show();
            $("#labelManualAuto").hide();
            $("#divaddDiscountAuto").hide();
            $("#divaddDiscountManual").show();
        } else {
            discountManual = false;
            $("#divDiscountManual").hide();
            $("#divDiscountAuto").show();
            $("#labelManualManual").hide();
            $("#labelManualAuto").show();
            $("#divaddDiscountAuto").show();
            $("#divaddDiscountManual").hide();
        }
    }
    emptyTotals();
    $.ajax({
        url: "/AccountingSupplier/ActionGetInfoPaymentExtra/",
        data: {
            "rfc": finalSupplierSelected, "dateInitial": date1, "dateFinish": date2, "currency": currencySelected, "type": typeSelectedStr, "payment_id": global_payment_id
        },
        type: "POST",
        success: function (json) {
            if (json.success) {
                if (json.data.Item3)
                    $("#DivBlackList").show();
                else
                    $("#DivBlackList").hide();
                if (json.data.Item1 != 0) {
                    if (json.data.Item5 == "Transferencia") {
                        global_payment_origin = json.data.Item7.payment_origin;
                        global_payment_destiny = json.data.Item7.payment_destiny;
                    } else if (json.data.Item5 == "Cheque") {
                        global_payment_not_negotiable = json.data.Item7.not_negotiable;
                        global_payment_account_credit = json.data.Item7.credit_account;
                        global_payment_cheque = json.data.Item7.payment_check_number;
                        if (global_payment_not_negotiable)
                            $('#checkNotNegotiable').iCheck('check');
                        if (global_payment_account_credit)
                            $('#checkCreditAccount').iCheck('check');
                    }
                    global_payment_method = json.data.Item5;
                    $('#paymentMethod').text(json.data.Item5);
                    global_payment_egreso = json.data.Item6;
                    check_invoices_available = json.data.Item2.filter(f => f.check_invoice == 1);
                    table.clear();
                    table.rows.add(json.data.Item2);
                    table.columns.adjust().draw();
                    check_invoices_available.forEach(function (valor, indice, array) {
                        $("#" + valor.id_uuid).prop("checked", true);
                        var invoice_rate_iva = valor.invoice_rate_iva;
                        var invoice_rate_ieps = valor.invoice_rate_ieps;
                        var listRateIva_Detail = [];
                        var listRateIeps_Detail = [];
                        var listSplitIVa_Detail = invoice_rate_iva.split('-');
                        var listSplitIeps_Detail = invoice_rate_ieps.split('-');
                        var subtotal = parseFloat(valor.policy_subtotal);
                        var iva = parseFloat(valor.policy_iva);
                        var ieps = parseFloat(valor.policy_ieps);
                        for (var i = 0; i < listSplitIVa_Detail.length; i++) { listRateIva_Detail.push(parseFloat(listSplitIVa_Detail[i])) }
                        for (var i = 0; i < listSplitIeps_Detail.length; i++) { listRateIeps_Detail.push(parseFloat(listSplitIeps_Detail[i])) }
                        listDetail.push({
                            uuid: valor.id_uuid, policy_id: valor.policy_id.toString(), payment_before: valor.policy_debit_amount,
                            payment_total: valor.total_amount, rateIva: listRateIva_Detail, rateIeps: listRateIeps_Detail, iva: iva, ieps: ieps, subtotal: subtotal
                        })
                        Stotal += valor.total_amount;
                        StotalFac += valor.total_amount;
                        Ssubtotal += valor.policy_subtotal;
                        Siva += valor.policy_iva;
                        Sieps += valor.policy_ieps;
                    });
                    iChecks();
                    refreshTotals();
                    SetTaxesRate();
                    //Agregando descuentos
                    if (json.data.Item4.length > 0) {
                        c = 0;
                        var array_discounts = json.data.Item4;
                        array_discounts.forEach(function (valor, indice, array) {
                            c = c + 1;
                            var amount = parseFloat(valor.discount_total);
                            discountRateIva = parseFloat(0);
                            discountRateIeps = parseFloat(0);

                            var discountRateFinal = 0;

                            if (discountRateIva != 0)
                                discountRateFinal = (discountRateIva / 100) + 1;
                            else if (discountRateIeps != 0)
                                discountRateFinal = (discountRateIeps / 100) + 1;

                            if (discountRateIva != 0 || discountRateIeps != 0) {
                                selected = true;
                            }
                            if (isNaN(amount) || amount == 0) {
                                toastr.error("Ingrese un importe valido");
                                $("#discountAmount").val(null)
                                return;
                            }
                            discountSubtotal = parseFloat(amount);
                            if (discountRateIva != 0 && discountRateIeps != 0) {
                                toastr.error("No se puede ingresar un registro con IVA e IEPS");
                                $("#selectDiscountIva").select2().select2("val", 0);
                                $("#selectDiscountIeps").select2().select2("val", 0);
                                discountIva = 0;
                                discountIeps = 0;
                                discountTotal = discountSubtotal + discountIva + discountIeps;
                                refreshTotalsDiscounts();
                                return;
                            } else {
                                if (discountRateIeps != 0) {
                                    discountIeps = parseFloat(amount - (amount / discountRateFinal).toFixed(2))
                                }
                                else {
                                    discountIeps = 0
                                }

                                if (discountRateIva != 0) {
                                    discountIva = parseFloat(amount - (amount / discountRateFinal).toFixed(2))
                                }
                                else {
                                    discountIva = 0;
                                }
                            }
                            discountSubtotal = discountSubtotal - discountIva - discountIeps;
                            discountTotal = discountSubtotal + discountIva + discountIeps;
                            refreshTotalsDiscounts();

                            var newDiscount = {
                                uuidRel: valor.uuidDisc, discount_consecutive: c, discount_code: valor.discount_code.toString(), discount_name: valor.discount_name, discount_subtotal: valor.discount_total,
                                site_code: valor.site_code, discount_iva: valor.discount_iva, discount_ieps: valor.discount_ieps, discount_total: valor.discount_total,
                                discount_rate_iva: discountRateIva, discount_rate_ieps: discountRateIeps, payment_discount_id: valor.payment_discount_id, manual: discountManual
                            }
                            discountsSelected.push(newDiscount);

                            Siva = Siva - valor.discount_iva;
                            Sieps = Sieps - valor.discount_ieps;
                            Ssubtotal = Ssubtotal - discountSubtotal;
                            discountAmount += discountTotal;
                            Stotal -= discountTotal;
                            discountsTable.clear();
                            discountsTable.rows.add(discountsSelected);
                            discountsTable.columns.adjust().draw();
                            refreshTotals();
                            refreshTotalsModal();
                            changeDiscount();
                            clearDiscount();
                        });
                        refreshTotals();
                        SetTaxesRate();
                    }

                    EndLoading();
                    $("#divData").show();
                    $("#divTable").show();
                    $("#divData").animatePanel();
                    $("#divTable").animatePanel();
                } else {
                    toastr.error("El proveedor no cuenta con datos contables , favor de agregarlos");
                    table.clear();
                    table.columns.adjust().draw();
                    EndLoading();
                }

            } else {
                if (json.data == "SF") {
                    SessionFalse("Terminó tu sesión");
                    EndLoading();
                    return;
                } else {
                    EndLoading();
                    toastr.error("Ha ocurrido un error , contacte a sistemas");
                }
            }
        }
    });
}


function showPDF(uuid) {
    StartLoading();
    $.ajax({
        url: "/Accounting/ActionGetPurchaseXML",
        type: "POST",
        data: { "uuid": uuid },
        success: function (response) {
            EndLoading();
            if (response.result) {
                $("#modalReferenceBody").html(`<iframe width='100%' height='550px' src='data:application/pdf;base64,${response.data}'></iframe>`);
                $("#modalReference").modal("show");
            }
            else if (response.result == "SF")
                SessionFalse("Terminó tu sesión.");
            else
                toastr.error('No es posible cargar el XML');
        },
        error: function () {
            EndLoading();
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        }
    });
}

function iChecks() {
    $('input[class=ichecks]').iCheck({
        checkboxClass: 'icheckbox_square-green',
    }).on('ifClicked', function () {
        $(this).trigger("change");
        var item = this;
        var check = item.checked;
        var uuid = item.attributes.uuid.value;
        var policy_id = item.attributes.policy_id.value;
        var total = parseFloat(item.attributes.total.value);
        var subtotal = parseFloat(item.attributes.policy_subtotal.value);
        var iva = parseFloat(item.attributes.policy_iva.value);
        var ieps = parseFloat(item.attributes.policy_ieps.value);
        var payment_before = parseFloat(item.attributes.payment_before.value)
        var payment_before = parseFloat(item.attributes.payment_before.value)
        var invoice_rate_iva = item.attributes.invoice_rate_iva.value
        var invoice_rate_ieps = item.attributes.invoice_rate_ieps.value
        var listRateIva = []
        var listRateIeps = []

        var listSplitIVa = invoice_rate_iva.split('-')
        var listSplitIeps = invoice_rate_ieps.split('-')

        for (var i = 0; i < listSplitIVa.length; i++) { listRateIva.push(parseFloat(listSplitIVa[i])) }
        for (var i = 0; i < listSplitIeps.length; i++) { listRateIeps.push(parseFloat(listSplitIeps[i])) }

        if (!check) {
            listDetail.push({
                uuid: uuid, policy_id: policy_id, payment_before: payment_before,
                payment_total: total, rateIva: listRateIva, rateIeps: listRateIeps
            })
            Stotal += total;
            StotalFac += total;
            Ssubtotal += subtotal;
            Siva += iva;
            Sieps += ieps

            var available_invoice = check_invoices_available.filter(f => f.id_uuid == uuid && f.delete_invoice == 1);
            if (available_invoice.length > 0) {
                var index_invoice = available_invoice.findIndex(f => f.id_uuid == uuid);
                if (index_invoice > -1) {
                    available_invoice[index_invoice].delete_invoice = false;
                }
            }

        } else {
            listDetail = listDetail.filter(x => x.uuid != uuid);
            Stotal -= total;
            StotalFac -= total;
            Ssubtotal -= subtotal;
            Siva -= iva;
            Sieps -= ieps;

            var available_invoice = check_invoices_available.filter(f => f.id_uuid == uuid && f.delete_invoice == 0);
            if (available_invoice.length > 0) {
                var index_invoice = available_invoice.findIndex(f => f.id_uuid == uuid);
                if (index_invoice > -1) {
                    available_invoice[index_invoice].delete_invoice = true;
                }
            }

        }
        refreshTotals();
        SetTaxesRate();
    });
    $('input[class=belowCheck]').iCheck({
        checkboxClass: 'icheckbox_square-green',
    }).on('ifClicked', function () {
        $(this).trigger("change");
    });
}

function iChecksHeader() {
    $('input[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_square-green',
    }).on('ifClicked', function () {
        $(this).trigger("change");
        var item = this;
        var check = item.checked;
        if (item.id == "allCheck") { AllCheck(); return; }
        var payment = item.attributes.payment_id.value;
        var amount = item.attributes.payment_total.value;
        if (!check) {
            listPayment.push({ payment_id: payment })
        } else {
            listPayment = listPayment.filter(x => x.payment_id != payment);
        }
        UpdateLabelPayments()
    });
    $('input[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_square-green',
    }).on('ifChanged', function () {
        var item = this;
        var check = item.checked;
        if (item.id == "allCheck") { AllCheck(); return; }
        var payment = item.attributes.payment_id.value;
        var amount = parseFloat(item.attributes.payment_total.value);
        if (check) {
            listPayment.push({ payment_id: payment, payment_total: amount })
        } else {
            listPayment = listPayment.filter(x => x.payment_id != payment);
        }
        UpdateLabelPayments()
    });
}

function SetTaxesRate() {
    //var allRateIva = []
    //var allRateIeps = []
    //$('#selectDiscountIva').empty();
    //var option = new Option("0%", 0, true, true);
    //$("#selectDiscountIva").append(option);
    //$('#selectDiscountIeps').empty();
    //var option = new Option("0%", 0, true, true);
    //$("#selectDiscountIeps").append(option);
    //listDetail.forEach(k => {
    //    allRateIva = allRateIva.concat(k.rateIva);
    //    allRateIeps = allRateIeps.concat(k.rateIeps);
    //})

    //let uniqueIva = [...new Set(allRateIva)];
    //let uniqueIeps = [...new Set(allRateIeps)];

    //uniqueIva.forEach(y => {
    //    if (!isNaN(y)) {
    //        var option = new Option(y + "%", y, true, false);
    //        $("#selectDiscountIva").append(option);
    //    }
    //})

    //uniqueIeps.forEach(y => {
    //    if (!isNaN(y)) {
    //        var option = new Option(y + "%", y, true, false);
    //        $("#selectDiscountIeps").append(option);
    //    }
    //})

}

function refreshTotals() {
    $("#divNumberUUID").html(listDetail.length)
    $("#divSubTotal").html(formatMoney(Ssubtotal)(2));
    $("#divIVA").html(formatMoney(Siva)(2));
    $("#divIEPS").html(formatMoney(Sieps)(2));
    $("#divTotal").html(formatMoney(Stotal)(2));
    $("#divDiscount").html(formatMoney(discountAmount)(2));
    $("#divTotalFac").html(formatMoney(StotalFac)(2));

   
    
  

   
   
    $("#total_xml").html(formatMoney(total_xml)(2));
    $("#total_cn").html(formatMoney(total_cn)(2));
}

function refreshTotalsDiscounts() {
    $("#discountSubtotal").html(formatMoney(discountSubtotal)(2))
    $("#discountIva").html(formatMoney(discountIva)(2));
    $("#discountIeps").html(formatMoney(discountIeps)(2));
    $("#discountTotal").html(formatMoney(discountTotal)(2));
}

function refreshTotalsModal() {
    $("#totalAmount").val(Stotal.toFixed(2))
    $("#modalSubTotal").html(formatMoney(Ssubtotal)(2));
    $("#modalIVA").html(formatMoney(Siva)(2));
    $("#modalIEPS").html(formatMoney(Sieps)(2));
    $("#modalTotal").html(formatMoney(Stotal)(2));
    $("#modalDiscount").html(formatMoney(discountAmount)(2));
    $("#modalTotalFac").html(formatMoney(Stotal)(2));

    $("#totalAmountCheck").val(Stotal.toFixed(2))
    $("#modalSubTotalCheck").html(formatMoney(Ssubtotal)(2));
    $("#modalIVACheck").html(formatMoney(Siva)(2));
    $("#modalIEPSCheck").html(formatMoney(Sieps)(2));
    $("#modalTotalCheck").html(formatMoney(Stotal)(2));
    $("#modalDiscountCheck").html(formatMoney(discountAmount)(2));
    $("#modalTotalFacCheck").html(formatMoney(Stotal)(2));

}

function emptyTotals() {
    list = [];
    Ssubtotal = 0;
    Siva = 0;
    Sieps = 0;
    Stotal = 0;
    StotalFac = 0;
    discountAmount = 0;
    discountsSelected = []
    discountsDelete = []
    check_invoices_available = []
    discountsTable.clear();
    discountsTable.columns.adjust().draw();
    refreshTotals();
}

function showModalDiscounts() {
    alert('Aqui');
    if (listDetail.length == 0) { toastr.error("Seleccione al menos una factura a pagar"); return; }
        $('#modalPaymentDiscount').modal('show');
}

function showModalPayment() {

    var method = $("#paymentMethod").text();
    if (Stotal <= 0) { toastr.error("El importe a pagar debe ser mayor a cero"); return; }
    if (method == "") { toastr.error("Seleccione un metodo de pago"); return; }
    if (listDetail.length == 0) { toastr.error("Seleccione al menos una factura a pagar"); return; }
    $("#currency").val($("#selectCurrency").val())
    $("#currencyCheck").val($("#selectCurrency").val())
    $("#dateCheck").datepicker().datepicker("setDate", new Date());
    $("#dateTransfer").datepicker().datepicker("setDate", new Date());
    if (method == "Transferencia") {
        StartLoading();
        $.ajax({
            url: "/AccountingSupplier/ActionGetAccountsSupplier/",
            data: {
                "rfc": rfcSelected, "currency": currencySelected
            },
            type: "POST",
            success: function (json) {
                if (json.success) {
                    $("#destinyAccount").val(global_payment_destiny);
                    FillDropdownOrigin("originAccount", json.origin);
                    $('#originAccount').val(global_payment_origin).trigger('change.select2');//default
                    $('#modalPaymentTransfer').modal('show');
                    EndLoading();
                } else {
                    if (json.data == "SF") {
                        SessionFalse("Terminó tu sesión");
                        EndLoading();
                        return;
                    } else {
                        EndLoading();
                        toastr.error("Ha ocurrido un error , contacte a sistemas");
                    }
                }
            }
        });
        refreshTotalsModal()
    } else {

        $("#checkNumber").val(global_payment_cheque);
        $('#modalPaymentCheck').modal('show');
        refreshTotalsModal();
    }
}


function savePayment() {
    var method = $("#paymentMethod").text();
    var modelHeader = [];
    if (method == "Transferencia") {
        modelHeader = {
            supplier_rfc: rfcSelected,
            supplier_data_id: finalSupplierSelected,
            payment_method: global_payment_method,
            payment_subtotal: parseFloat(Ssubtotal),
            payment_iva: parseFloat(Siva),
            payment_ieps: parseFloat(Sieps),
            payment_total: Stotal.toFixed(2),
            payment_origin: $("#originAccount").val(),
            payment_destiny: $("#destinyAccount").val(),
            payment_currency: $("#currency").val(),
            payment_comment: $("#comment").val(),
            payment_date: moment($("#dateTransfer").val(), 'MM/DD/YYYY').format('MM/DD/YYYY'),
           // moment($("#dateTransfer").val(), 'DD/MM/YYYY').format('MM/DD/YYYY')
            payment_before: StotalFac.toFixed(2),
            payment_egreso: global_payment_egreso
        }
    } else {
        modelHeader = {
            supplier_rfc: rfcSelected,
            supplier_data_id: finalSupplierSelected,
            payment_method: global_payment_method,
            payment_subtotal: parseFloat(Ssubtotal),
            payment_iva: parseFloat(Siva),
            payment_ieps: parseFloat(Sieps),
            payment_total: Stotal.toFixed(2),
            payment_currency: $("#currencyCheck").val(),
            payment_comment: $("#commentCheck").val(),
            payment_check_number: $("#checkNumber").val(),
            not_negotiable: $('#checkNotNegotiable').prop('checked'),
            exchange_currency: $("#exchangeCurrency").val(),
            credit_account: $('#checkCreditAccount').prop('checked'),
            payment_date: moment($("#dateCheck").val(), 'DD/MM/YYYY').format('MM/DD/YYYY')
        }
    }

    //TablesSelectedMainCFDI.data().toArray()

    var discountsSelectedFinal = [];

   // discountsTable.data().toArray().forEach(function (valor, indice, array) {
    discountsSelectedAdd.forEach(function (valor, indice, array)
            {
            var newDiscountF = {
                payment_discount_id: valor.payment_discount_id, uuidDisc: valor.uuidRel, discount_consecutive: valor.discount_consecutive, discount_code: valor.discount_code,
                discount_name: valor.discount_name, discount_subtotal: valor.discount_subtotal,
                site_code: valor.site_code, discount_iva: valor.discount_iva, discount_ieps: valor.discount_ieps, discount_total: valor.discount_total,
                discount_rate_iva: valor.discount_rate_iva, discount_rate_ieps: valor.discount_rate_ieps , manual: discountManual
            }
            discountsSelectedFinal.push(newDiscountF);
    });
    StartLoading();
    $.ajax({
        url: "/AccountingPayment/ActionUpdatePayment/",
        data: {
            "header": modelHeader, "detail": listDetail, "update_detail": check_invoices_available, "discountsList": discountsSelectedFinal, "discountsListDelete": discountsDelete, "payment_id": global_payment_id, "program_id": "ACC003.cshtml", type: typeSelectedStr, "CreditNote": array_save_uuid.filter(f => f.discount_code != 10), "ListConcepts": ConceptSelectedAddMain
        },

        
        type: "POST",
        success: function (json) {
            if (json.data == 0) {
                if (method == "Transferencia")
                    $('#modalPaymentTransfer').modal('hide');
                else
                    $('#modalPaymentCheck').modal('hide');
                swal({
                    title: "Pago Guardado Correctamente",
                    text: "Se realizo el registro correctamente",
                    type: "success"
                }, function () {
                       
                        window.location.href = UrlAction;
                    //BackMainPayments();
                });
                ClearPayments();
                refreshTotalsModal();
                refreshTotals();

                EndLoading();
                // searchInvoices();
            }
            else {
                if (json.data == "SF") {
                    SessionFalse("Terminó tu sesión");
                    //EndLoading();
                    return;
                } else {
                    EndLoading();
                    toastr.error("Ha ocurrido un error , contacte a sistemas (Error " + json.data.Item2 + ")");
                    $('#modalPaymentTransfer').modal('hide');
                    ShowNewInvoices();
                    ClearPayments();
                    refreshTotalsModal();
                    refreshTotals();
                    searchInvoices();
                }
            }
        }
    });

}

function checkCurrency() {
    var date = moment($("#dateCheck").val(), 'MM/DD/YYYY').format('MM/DD/YYYY');
    $.ajax({
        url: "/AccountingPayment/ActionGetExchangeCurrencyCheck",
        type: "POST",
        data: { "date": date, "currency": currencySelected },
        success: function (response) {
            if (response.result) {
                if (response.data.Item1 === 0) {
                    $("#exchangeCurrency").val(response.data.Item2);

                } else {
                    toastr.error("Seleccione una fecha de aplicacion valida");
                    $("#dateCheck").datepicker().datepicker("setDate", new Date());
                }
                EndLoading();

            }
            else if (response.result == "SF") {
                SessionFalse("Terminó tu sesión.");
                EndLoading();
            }
            else {
                toastr.error('Alerta - Error inesperado  contactar a sistemas.');
                EndLoading();
            }
        },
        error: function () {
            EndLoading();
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        }
    });

}

function showInfoSupplier(supplierId) {
    $.ajax({
        url: "/AccountingSupplier/ActionGetSupplierAccountDataBySupplierDataID",
        type: "POST",
        data: { "rfc": supplierId },
        success: function (response) {
            if (response.result == "SF") {
                SessionFalse("Terminó tu sesión.");
                EndLoading();
            }

            if (response.success) {
                $("#quick_pay_perc").html(response.data.quick_pay_perc + "%")

                if (response.data.quick_pay_days != 0) {
                    var business = "";
                    if (response.data.quick_pay_business_days)
                        business = "Habiles"
                    else
                        business = "Naturales"
                    var labelQPDays = response.data.quick_pay_days + " Dias " + business;
                    $("#quick_pay_days").html(labelQPDays)
                }
                if (response.data.supplier_pr)
                    $("#supplier_pr").html("Si");
                else
                    $("#supplier_pr").html("No");

                $("#logistics_perc").html(response.data.logistics_perc + " %")
                $("#id_tercero").html(response.data.ID_tercero)
                $("#txtSupplierName").html(response.data.business_name + " - Moneda: " + currencySelected)
                $("#modalSupplierName").html(response.data.business_name)
                $("#modalSupplierNameCheck").html(response.data.business_name)

                rfcSelected = response.data.rfc;
                supplierNameSelected = response.data.business_name;
            }
        },
        error: function () {
            EndLoading();
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        }
    });
}

function FillDropdown(selector, vData) {
    if (vData != null) {
        $('#' + selector).trigger("change");
        var vItems = [];
        //vItems.push('<option value="">Seleccione una cuenta</option>');
        for (var i in vData) {
            if (vData[i].Selected)
                vItems.push('<option selectedselected=selected value="' + vData[i].account_number + '">' + vData[i].account_number + '</option>');
            else
                vItems.push('<option value="' + vData[i].account_number + '">' + vData[i].account_number + '</option>');
        }
        $('#' + selector).empty();
        $('#' + selector).append(vItems.join(''));
        $('#' + selector).val("").trigger('change');
    }
    else {
        var vItems = [];
        //vItems.push('<option value="">Seleccione una cuenta</option>');
        $('#' + selector).empty();
        $('#' + selector).append(vItems.join(''));
        $('#' + selector).val("").trigger('change');
    }
}

function ClearPayments() {
    listDetail = [];
    refreshTotals();
    refreshTotalsModal();
    $("#comment").val(null)
    $('#checkNotNegotiable').iCheck('uncheck');
    $('#checkCreditAccount').iCheck('uncheck');
    //$("#paymentMethod").text("?");
}

function FillDropdownOrigin(selector, vData) {
    if (vData != null) {
        $('#' + selector).trigger("change");
        var vItems = [];
        // vItems.push('<option value="">Seleccione una cuenta</option>');
        var c = 0;
        for (var i in vData) {
            if (c == 0) {
                vItems.push('<option value="' + vData[i].account_number + '" >' + vData[i].account_number + " - " + vData[i].account_name + '</option>');
                c = 1;
            }
            else
                vItems.push('<option value="' + vData[i].account_number + '">' + vData[i].account_number + " - " + vData[i].account_name + '</option>');
        }
        $('#' + selector).empty();
        $('#' + selector).append(vItems.join(''));
        $('#' + selector).val("").trigger('change');
    }
    else {
        var vItems = [];
        //vItems.push('<option value="">Seleccione una cuenta</option>');
        $('#' + selector).empty();
        $('#' + selector).append(vItems.join(''));
        $('#' + selector).val("").trigger('change');
    }
}

function ClearTable() {
    table.clear();
    table.columns.adjust().draw();
}

function ChangeValues(s) {
    ClearPayments();
    ClearTableWithArray(tablePaymentsHeader, []);
    $("#divData").hide();
    $("#divTable").hide();
    $("#supplier").select2("val", "");
    $("#creditor").select2("val", "");
    supplierSelected = "";
    creditorSelected = "";
    if (s.checked) {
        //GASTOS
        $("#labelPurchases").removeClass("text-success");
        $("#labelExpenses").addClass("text-info");
        $("#divCreditor").show();
        $("#divSupplier").hide();

    } else {
        //COMPRAS
        $("#labelPurchases").addClass("text-success");
        $("#labelExpenses").removeClass("text-info");
        $("#divSupplier").show();
        $("#divCreditor").hide();

    }
}

var discountsTable = $('#discountsTable').DataTable({
    "autoWidth": true,
    "searching": true,
    "bLengthChange": false,
    "bFilter": false,
    buttons: [

    ],
    oLanguage: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ Registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    columns:
        [

            { data: 'discount_code' },
            { data: 'discount_name' },
            { data: 'discount_subtotal' },
            { data: 'discount_iva' },
            { data: 'discount_ieps' },
            { data: 'discount_total' },
            { data: null },
            { data: null },
            { data: 'uuidRel' }
        ],
    columnDefs:
        [
            {
                targets: [0],
                visible: false
            },
            {
                targets: [1, 2, 3, 4, 5, 6],
                width: "1%"
            }, {
                targets: [2, 3, 4, 5],
                render: function (data, type, full, meta) {
                    return formatMoney(data)(2)
                },
                width: "1%"
            }, {
                targets: [6],
                render: function (data, type, full, meta) {
                    return `<button class="btn btn-xs btn-danger btn-circle" style="text-align:center;border-right-width: 0px;padding-right: 0px;padding-left: 0px;padding-top: 0px;padding-bottom: 0px;margin-top: 5px;" onclick="deleteDiscountME(${full.discount_consecutive})"><i class="fa fa-times"></i></button>`;
                }
            },
            {
                //<button id="discountAmount" type="button" class="btn btn-success" title="Agregar XML" onclick="showPVXML(null, null, null,0,1)">+ </button>
                //                          <button id="discountAmount" type="button" class="btn btn-danger" title="Quitar XML" onclick="quitarXML()">- </button>

                targets: [7],
                render: function (data, type, full, meta) {
                    return `<button id="discountAmount" type="button" class="btn btn-success" title="Agregar XML" onclick="showPVXML(null, null, null,0,1,'` + full.discount_consecutive + `','` + full.discount_code + `','` + full.discount_total + `')">+ </button>`;
                }
            },
        ]
});

function changeDiscount() {
    var selected = $("#discountSelect").val()
    if (selected == "1" || selected == "2" || selected == "6") {
        $("#divSite").show();
    } else {
        $("#divSite").hide();
    }
}

function changeDiscountRow() {
    var amount = parseFloat($("#discountAmount").val());
    discountRateIva = parseFloat($("#selectDiscountIva").val());
    discountRateIeps = parseFloat($("#selectDiscountIeps").val());

    var discountRateFinal = 0;

    if (discountRateIva != 0)
        discountRateFinal = (discountRateIva / 100) + 1;
    else if (discountRateIeps != 0)
        discountRateFinal = (discountRateIeps / 100) + 1;
    var selected = false;

    if (discountRateIva != 0 || discountRateIeps != 0) {
        selected = true;
    }
    if (isNaN(amount) || amount == 0) {
        toastr.error("Ingrese un importe valido");
        $("#discountAmount").val(null)
        return;
    }
    discountSubtotal = parseFloat(amount);
    if (discountRateIva != 0 && discountRateIeps != 0) {
        toastr.error("No se puede ingresar un registro con IVA e IEPS");
        $("#selectDiscountIva").select2().select2("val", 0);
        $("#selectDiscountIeps").select2().select2("val", 0);
        discountIva = 0;
        discountIeps = 0;
        discountTotal = discountSubtotal + discountIva + discountIeps;
        refreshTotalsDiscounts();
        return;
    } else {
        if (discountRateIeps != 0) {
            discountIeps = parseFloat(amount - (amount / discountRateFinal).toFixed(2))
        }
        else {
            discountIeps = 0
        }

        if (discountRateIva != 0) {
            discountIva = parseFloat(amount - (amount / discountRateFinal).toFixed(2))
        }
        else {
            discountIva = 0;
        }
    }
    discountSubtotal = discountSubtotal - discountIva - discountIeps;
    discountTotal = discountSubtotal + discountIva + discountIeps;
    refreshTotalsDiscounts();
}

var ConceptSelectedAddMain = [];
var discountTotalRel = 0;
function addDiscount() {
    console.log(Stotal);
    var discount_code = $("#discountSelect").select2('data').id;
    var discount_name = $("#discountSelect").select2('data').text;
    var discount_amount = parseFloat($("#discountAmount").val());
    if (discount_code == "") {
        toastr.error("Seleccione un tipo de descuento");
        return;
    }
    if ((discount_code == "2" || discount_code == "6") && $("#selectSite").val() == "") {
        toastr.error("Seleccione una sucursal");
        return;
    }
    if (isNaN(discount_amount) || discount_amount == 0) {
        toastr.error("Ingrese un importe valido");
        return;
    }
    if (discount_amount <= 0) {
        toastr.error("El descuento debe ser mayor a 0.");
        return;
    }
    if (discount_amount > Stotal) {
        toastr.error("El descuento no puede ser mayor al pago.");
        return;
    }
    //if (discountRateIva != 0 && Siva == 0) {
    //    toastr.error("No se le puede aplicar decuento con IVA ya que las facturas seleccionadas no tiene IVA")
    //    return;
    //}
    //if (discountRateIeps != 0 && Sieps == 0) {
    //    toastr.error("No se le puede aplicar decuento con IEPS ya que las facturas seleccionadas no tiene IEPS")
    //    return;
    //}
    c = c + 1;
    var newDiscount = {
        discount_consecutive: c, discount_code: discount_code, discount_name: discount_name, discount_subtotal: discountSubtotal,
        site_code: $("#selectSite").val(), discount_iva: discountIva, discount_ieps: discountIeps, discount_total: discountTotal,
        discount_rate_iva: discountRateIva, discount_rate_ieps: discountRateIeps, uuidRel: '', manual: discountManual
    }
    discountsSelected.push(newDiscount);
    discountsSelectedAdd.push(newDiscount);

    Siva = Siva - discountIva;
    Sieps = Sieps - discountIeps;
    Ssubtotal = Ssubtotal - discountSubtotal;
    discountAmount += discountTotal;
    Stotal -= discountTotal
    toastr.success("Descuento guardado correctamente");
    discountsTable.clear();
    discountsTable.rows.add(discountsSelected);
    discountsTable.columns.adjust().draw();
    refreshTotals();
    refreshTotalsModal();
    changeDiscount();
    clearDiscount();
}

function closeModalDesc() {
    //console.log('Agregado ' + AddTotal);
    //console.log('totalNC ' + TotalConcept);

    //if (discountTotalRel > .01) {

    //    if (discountAmount > 0.01 && discountAmount < discount_totalSelected) {
    //        toastr.error("el total de los descuentos no es igual al monto de la nota de crédito");
    //        return;
    //    }

    //  if (discountAmount > discount_totalSelected ) {
    //     toastr.error("el total de los descuentos no es igual al monto de la nota de crédito");
    //    return;
    //     }
    //}


    $('#modalPaymentDiscount').modal('hide');
}
function clearDiscount() {
    $("#selectDiscountIva").select2().select2("val", 0);
    $("#selectDiscountIeps").select2().select2("val", 0);
    $('#discountSelect').select2("val", null)
    $('#selectSite').select2("val", null)
    $("#discountAmount").val(null)
    $("#selectDiscountIvaManual").select2().select2("val", 0);
    $("#selectDiscountIepsManual").select2().select2("val", 0);
    $("#discountAmountManualSubtotal").val(null)
    $("#discountAmountManualIVA").val(null)
    $("#discountAmountManualIeps").val(null)
    discountSubtotal = 0;
    discountIva = 0;
    discountIeps = 0;
    discountTotal = 0;
    refreshTotalsDiscounts();
}

function deleteDiscountME(discount_code) {
    var deleteDiscount = discountsSelected.filter(f => f.discount_consecutive == discount_code && f.payment_discount_id > 0);

    if (deleteDiscount.length > 0) {
        discountsDelete.push(deleteDiscount[0]);
    }
    var index = discountsSelected.findIndex(x => x.discount_consecutive == discount_code);
    var current = parseFloat(discountsSelected[index].discount_total);
    var currentIva = parseFloat(discountsSelected[index].discount_iva);
    var currentIeps = parseFloat(discountsSelected[index].discount_ieps);
    var currentSubtotal = parseFloat(discountsSelected[index].discount_subtotal);
    discountAmount = discountAmount - current;
    Stotal = StotalFac - discountAmount;
    Siva = Siva + currentIva;
    Sieps = Sieps + currentIeps;
    Ssubtotal = Ssubtotal + currentSubtotal;
    discountsSelected = discountsSelected.filter(x => x.discount_consecutive != discount_code);
    discountsSelectedAdd = discountsSelectedAdd.filter(x => x.discount_consecutive != discount_code);
    discountsTable.clear();
    discountsTable.rows.add(discountsSelected);
    discountsTable.columns.adjust().draw();
    refreshTotals()
}

function downloadXML(uuid) {
    StartLoading();
    $.ajax({
        url: "/AccountingPolicies/ActionDownloadXML/",
        data: {
            "uuid": uuid
        },
        type: "POST",
        success: function (json) {
            if (json.success) {
                download(json.name, json.body);
                EndLoading();
            } else {
                if (json.data == "SF") {
                    SessionFalse("Terminó tu sesión");
                    EndLoading();
                    return;
                } else {
                    EndLoading();
                    toastr.error("Ha ocurrido un error , contacte a sistemas");
                }
            }
        }
    });
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

