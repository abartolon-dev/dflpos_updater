var currency_error = false;
var amount_error = false;
var uuid_error = false;
var rfc_error = false;
var payment_error = false;
var usocfdi_error = false;
var global_currency = 0;
var global_amount = 0;
var global_rfc = "";
var global_cfdi = "";
var global_reference = "";
var global_supplier_name = "";
var global_payment = 0;
var global_policy = 0;

function ValidateDate(data) {
    var date = moment(data).format('DD/MM/YYYY');
    if (date != 'Invalid date')
        return date;
    else
        return "-";
}

function ValidateDates() {
    if ($('#ValidDate1').val() != "" & $('#ValidDate2').val() != "") {
        if (!(moment($('#ValidDate1').val()) <= moment($('#ValidDate2').val()))) {
            toastr.remove();
            toastr.warning('La fecha inicial no puede ser mayor a la fecha final');
            document.getElementById('ValidDate2').value = '';
            return false;
        }
        else {
            toastr.remove();
            return true;
        }
    }
    else {
        toastr.remove();
        return true;
    }
}


$(document).ready(function () {
    window.setTimeout(function () { $("#fa").click(); }, 1000);
});

const formatmoney = money => decimal => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", currencyDisplay: "symbol", maximumFractionDigits: decimal }).format(money);


$("#SuppliersDrop").select2({
    minimumInputLength: 3,
    allowClear: true,
    placeholder: "Seleccione un proveedor",
    initSelection: function (element, callback) {
        callback({ id: "0", text: "Seleccione un proveedor" });
    },
    ajax: {
        url: "/Supplier/ActionSearchSupplierCOFIData/",
        dataType: 'json',
        type: "GET",
        quietMillis: 50,
        data: function (Filter) {
            return {
                Filter: Filter
            };
        },
        results: function (data) {
            return {
                results: $.map(data.Json, function (item) {
                    return {
                        text: `${item.BusinessName}`,
                        id: item.Rfc
                    }
                }),
            };
        }
    }
});

$("#ValidDate1").datepicker({
    autoclose: true,
    todayHighlight: true
}).on("changeDate", function () {
    ValidateDates();
});

$("#ValidDate2").datepicker({
    autoclose: true,
    todayHighlight: true
}).on("changeDate", function () {
    ValidateDates();
});

function SearchFunction() {
    if ($("#SuppliersDrop").val() != "") {
        if ($('#ValidDate1').val() != "" || $('#ValidDate2').val() != "") {
            StartLoading();
            $.ajax({
                url: "/AccountingPayment/ActionPaymentsReport",
                type: "GET",
                data: { "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val(), "current_rfc": $("#SuppliersDrop").val() },
                success: function (result) {
                    EndLoading();
                    if (result.success) {
                        if (!$.isEmptyObject(result.payments))
                            ClearTable(tableCurrent, result.payments);
                        else
                            ClearTable(tableCurrent, []);
                    }
                    else
                        SessionFalse("Se terminó su sesion.");
                    EndLoading();
                },
                error: function () {
                    toastr.remove();
                    toastr.error('Error inesperado contactar a sistemas.');
                    EndLoading();
                }
            });
        } else {
            toastr.warning("Seleccione un rango de fechas.");
        }
    } else {
        toastr.warning("Seleccione un proveedor.");
    }
}

var tableCurrent = $('#TableCurrentPurchase').DataTable({
    autoWidth: true,
    responsive: true,
    searching: true,
    paging: true,
    ordering: true,
    info: true,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[3, 5, 10, 25, 50, -1], [3, 5, 10, 25, 50, "Todos"]],
    buttons: [],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        if (aData.Compare_Purchase_Status == 1 || aData.Compare_Purchase_Status == 2) {
            $('td', nRow).addClass("success").addClass("BoldClass");
        }
    },
    columns: [
        {
            "class": "details-control",
            "orderable": false,
            "data": null,
            "defaultContent": "",
        },
        { data: 'payment_id', visible: false },
        { data: 'supplier_rfc', visible: false },
        { data: 'supplier_name' },
        { data: 'payment_date' },
        { data: 'exchange_currency' },
        { data: 'payment_total' },
        { data: 'payment_currency' },
        { data: 'payment_egreso' },
        { data: 'payment_check_number' }
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: "1%"
    },
    {
        targets: [6],
        render: function (data, type, full, meta) {
            return formatmoney(data)(2);
        }

    },
    {
        targets: [4],
        render: function (data, type, full, meta) {
            return moment(data).format("DD/MM/YYYY");
        }
    }],
});

var detailRows = [];

$('#TableCurrentPurchase tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tableCurrent.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
    }
    else {
        if (tableCurrent.row('.details').length) {
            $('.details-control', tableCurrent.row('.details').node()).click();
        }
        row.child(format(row.data())).show();
        tr.addClass('details');
    }
});

tableCurrent.on('draw', function () {
    $.each(detailRows, function (i, id) {
        $('#' + id + ' td.details-control').trigger('click');
    });
});

function format(d) {
    StartLoading();
    var detailUUid = "";
    var detailItems = "";
    var tableHTML = "";
    var tabledetail = $('<div/>').addClass('loading').text('Cargando Datos...');
    $.ajax({
        url: "/AccountingPayment/ActionPaymentsDetailReport",
        data: { "payment_id": d.payment_id, "current_rfc": d.supplier_rfc },
        type: "GET",
        success: function (returndate) {
            if (returndate.success) {
                if (returndate.payments != null) {
                    var styleColor = "";
                    console.log(returndate)
                    $.each(returndate.payments, function (index, value) {
                       // styleColor = (value.Invoice_status_sat) ? "class='danger';" : "";
                        styleColor = "";
                        detailUUid += "<tr " + styleColor + "><td class='text-center'>"
                            + value.Uuid + "</td><td class='text-center'>"
                            + value.Supplier_name + "</td><td class='text-center'>"
                            + ValidateSite(value.Serie) + ValidateSite(value.Folio) + "</td><td class='text-center'>"
                            + ValidateStatus(value.Invoice_xml) + "</td><td class='text-center'>"
                            + ValidateDate(value.Invoice_date) + "</td><td class='text-center'>"
                            + ValidateDate(value.Currency) + "</td><td class='text-center'>"
                            + formatmoney(value.ItemAmount)(4) + "</td><td class='text-center'>"
                            + formatmoney(value.ItemIVA)(4) + "</td><td class='text-center'>"
                            + formatmoney(value.ItemIEPS)(4) + "</td><td class='text-center'>"
                            + formatmoney(value.ItemISRRET)(4) + "</td><td class='text-center'>"
                            + formatmoney(value.ItemIVARET)(4) + "</td><td class='text-center'>"
                            + formatmoney(value.ItemDiscount)(4) + "</td><td class='text-center'>"
                            + formatmoney(value.ItemTotalAmount)(4) + "</td><td class='text-center'>"
                            + ValidateStatusSAT(value.Invoice_status_sat) + "</td><td>"
                            + ValidateReportEdit(value, d.payment_id, d.supplier_rfc) + "</td></tr>";
                    });
                    tableHTML += '<p class="text-center"><code style="font-size: 20px;">Uuid relacionados</code></p><table id="tabledetail" class="table table-striped table-bordered table-hover" style="width:100%">' +
                        '<thead><tr><th>Uuid</th><th>Proveedor</th><th>Folio</th><th>XML</th><th>Fecha Emisión</th><th>Moneda</th><th>Subtotal</th><th>IVA</th><th>IEPS</th><th>ISR RET.</th><th>IVA RET.</th><th>Descuento</th><th>Total</th><th>Estatus</th><th>Sustituir</th></tr></thead><tbody>' + detailUUid + '</tbody></table> ';
                }
                tabledetail.html(tableHTML).removeClass('loading');
                reloadStyleTableSimple();
                EndLoading();
            } else {
                SessionFalse(sesion);
            }
        }
    });
    return tabledetail;
}

function ValidateStatus(data) {
    if (data)
        return `<i class='fa fa-check-circle text-center text-success'></i>`;
    else
        return `<i class='fa fa-circle-thin text-center text-danger'></i>`;
}

function ValidateStatusSAT(data) {
    if (!data)
        return `<i class='fa fa-close fa-2x text-center text-danger'></i><p class='text-danger'>Cancelada ante el SAT</p>`;
    else
        return `<i class='fa fa-check-circle fa-2x text-center text-success'></i><p class='text-success'>VIGENTE</p>`;
}
function ValidateReportEdit(value, payment, rfc) {
    if (value)
        return `<button class="btn btn-xs btn-outline btn-info text-center" onclick="ShowModalReplace(` + payment + `,` + value.Policy_id + `, '` + rfc + `', '` + value.UsoCFDI + `', '` + value.Uuid + `', '` + value.Supplier_name + `', '` + ValidateSite(value.Serie) + ValidateSite(value.Folio) + `', '` + value.Currency + `',  '` + value.Invoice_date + `', ` + value.ItemAmount + `, ` + value.ItemIVA + `, ` + value.ItemIEPS + `, ` + value.ItemISRRET + `,  ` + value.ItemIVARET + `, ` + value.ItemDiscount + `, ` + value.ItemTotalAmount + ` )"> <i class="fa fa-info-circle"></i> Sustituir UUID </button> <br/> <br/>`;
    else
        return `<p>No disponible</p>`;
}

function ValidateSite(data) {
    if (data != "") {
        return data;
    } else {
        return "-";
    }
}

function reloadStyleTableSimple() {
    $('#tabledetail').DataTable({
        oLanguage: {
            autoWidth: true,
            responsive: true,
            searching: true,
            paging: true,
            ordering: true,
            info: true,
            "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
        },
    });
}

var tableLoadXMLPreview = $('#TableLoadXMLPreview').DataTable({
    "autoWidth": true, "paging": false, "ordering": false, "info": false, "searching": false, "lengthChange": false,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        if (currency_error)
            $(nRow).find('td:eq(3)').css('background-color', '#E74C3C').css('color', 'white');
        if (amount_error)
            $(nRow).find('td:eq(14)').css('background-color', '#E74C3C').css('color', 'white');
        if (uuid_error)
            $(nRow).find('td:eq(0)').css('background-color', '#E74C3C').css('color', 'white');
        if (rfc_error)
            $(nRow).find('td:eq(2)').css('background-color', '#E74C3C').css('color', 'white');
        if (usocfdi_error)
            $(nRow).find('td:eq(1)').css('background-color', '#E74C3C').css('color', 'white');
        if (payment_error)
            $('td', nRow).addClass("danger").addClass("BoldClass");
    },
    columns: [
        { targets: 0, data: 'Uuid' },
        { targets: 1, data: 'UsoCFDI' },
        { targets: 2, data: 'Supplier_name' },
        { targets: 3, data: 'Currency' },
        { targets: 4, data: 'Invoice_date' },
        { targets: 5, data: 'Serie' },
        { targets: 6, data: 'Folio' },
        { targets: 7, data: 'Invoice_status_sat' },
        { targets: 8, data: 'ItemAmount' },
        { targets: 9, data: 'ItemIVA' },
        { targets: 10, data: 'ItemIEPS' },
        { targets: 11, data: 'ItemDiscount' },
        { targets: 12, data: 'ItemISRRET' },
        { targets: 13, data: 'ItemIVARET' },
        { targets: 14, data: 'ItemTotalAmount' }
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        width: "1%"
    },
    {
        render: function (data, type, full, meta) {
            return UsoCFDIValidate(data);
        },
        targets: [1]
    },
    {
        targets: [4],
        render: function (data, type, row) {
            return moment(data).format("DD/MM/YYYY");
        }
    },
    {
        targets: [8, 9, 10, 11, 12, 13, 14],
        render: function (data, type, full) {
            return `<p>${formatmoney(data)(4)}</p>`
        }
    },
    {
        render: function (data, type, full, meta) {
            if (data)
                return `<i class='fa fa-check-circle fa-2x text-success'></i><p class='text-success'>VIGENTE</p>`;
            else {
                $('#btnSaveNewInvoice').addClass("hide");
                return `<i class='fa fa-close fa-2x text-danger'></i><p class='text-danger'>Cancelada ante el SAT</p>`;
            }
        },
        targets: [7]
    }]
});


var model = JSON.parse($("#model").val());
if (!$.isEmptyObject(model.dataModel))
    ClearTable(tableCurrent, model.dataModel);
else
    ClearTable(tableCurrent, []);

function ClearTable(myTable, information) {
    myTable.clear().draw();
    myTable.rows.add(information);
    myTable.columns.adjust().draw();
}

function ClearErrors() {
    currency_error = false;
    amount_error = false;
    uuid_error = false;
    rfc_error = false;
    payment_error = false;
    usocfdi_error = false;
    $('#div_success_message').addClass("hide");
    $('#div_error_message').addClass("hide");
    $('#error_currency').addClass("hide");
    $('#error_amount').addClass("hide");
    $('#error_uuid').addClass("hide");
    $('#error_rfc').addClass("hide");
    $('#error_payment').addClass("hide");
    $('#error_usoCFDI').addClass("hide");
    $('#error_register').addClass("hide");
    $('#PreviewUsoCFDI').css('background-color', 'white').css('color', 'black');
    $('#PreviewCurrency').css('background-color', 'white').css('color', 'black');
    $('#PreviewTotal').css('background-color', 'white').css('color', 'black');
    $('#PreviewUUID').css('background-color', 'white').css('color', 'black');
    $('#PreviewSupplier').css('background-color', 'white').css('color', 'black');
}

function ShowModalReplace(payment, policy_id, rfc, usoCFDI, uuid, supplier_name, folio, moneda, date, amount, iva, ieps, ISRRET, IVARET, discount, total) {
    global_payment = payment;
    global_currency = moneda;
    global_amount = total;
    global_uuid = uuid;
    global_policy = policy_id;
    global_reference = folio;
    global_rfc = rfc;
    global_cfdi = usoCFDI;
    global_supplier_name = supplier_name
    ClearErrors();
    $('#btnSaveNewInvoice').addClass("hide");
    ClearTable(tableLoadXMLPreview, []);
    $("#newUuid").val("");
    $("#PreviewUUID").text(uuid);
    $("#PreviewSupplier").text(supplier_name);
    $("#PreviewCurrency").text(moneda);
    $("#PreviewUsoCFDI").text(UsoCFDIValidate(usoCFDI));
    //$("#PreviewDate").text(moment(date).format("DD/MM/YYYY"));
    $("#PreviewFolio").text(folio);
    $("#PreviewSubtotal").text(formatmoney(amount)(4));
    $("#PreviewIVA").text(formatmoney(iva)(4));
    $("#PreviewIEPS").text(formatmoney(ieps)(4));
    $("#PreviewISRRET").text(formatmoney(ISRRET)(4));
    $("#PreviewIVARET").text(formatmoney(IVARET)(4));
    $("#PreviewDiscount").text(formatmoney(discount)(4));
    $("#PreviewTotal").text(formatmoney(total)(4));
    $("#ModalSaveUUID").modal("show");
}
function ModalAddXMLPolicyPV() {
    
    //function CallPVAddXML(number_view, rfc, supplier_name, is_searching, start_date, end_date, is_multi_xml, is_multi_supplier, uso_cfdi, type_cfdi, cur, is_not_cancel, is_record_exists, is_diot, fntExecute, is_reference, is_amount)
    CallPVAddXML(1, global_rfc, global_supplier_name, false, null, null, true, false, "", null, null, true, true, false, fntSaveComisionBancariaPolicy2, "", 0);
}
var uuid_selected;
var array_save_uuid = [];
function fntSaveComisionBancariaPolicy2() {

    uuid_selected = TablesSelectedMainCFDI.data().toArray()
        .filter(f => f.error == "" && f.check_active == true)[0].uuid_str

    array_save_uuid = TablesSelectedMainCFDI.data().toArray()
        .filter(f => f.error == "" && f.check_active == true)
        .map((value, i, array) => {
            return {
                uuid: value.uuid_str
            }
        });

    if (array_save_uuid.length > 1) {
        toastr.warning("Únicamente debe seleccionar 1 XML.");
    } else if (array_save_uuid.length == 0) {
        toastr.warning("Seleccione al menos un XML.");
    } else {
        //SE GUARDA EN array_save_uuid
        $('#PVMainModal').modal('hide');
        $("#newUuid").val(uuid_selected)
    }
}

var newInvoice = "";
var serie = "";
var Folio = "";
function SearchNewUUIDReplace() {
    if ($('#newUuid').val() != "") {
        ClearErrors();
        StartLoading();
        $.ajax({
            type: "POST",
            url: "/AccountingPayment/ActionGetInformatioNewUUID",
            data: { "new_uuid": $('#newUuid').val() },
            success: function (response) {
                EndLoading();
                if (!response.Data)
                    SessionFalse("Terminó tu sesión")
                else {
                    if (response.info_uuid) {
                        if (response.info_uuid.length == 1) {
                            $('#btnSaveNewInvoice').removeClass("hide");
                        }
                        else if (response.info_uuid.length > 1) {
                            $('#btnSaveNewInvoice').addClass("hide");
                        } else {
                            toastr.warning("No se encontró ningún folio fiscal.")
                            $('#btnSaveNewInvoice').addClass("hide");
                        }
                         
                        $.each(response.info_uuid, function (index, value) {
                            if (global_currency != value.Currency)
                                currency_error = true;
                            if (global_amount != value.ItemTotalAmount)
                                amount_error = true;
                            if (global_uuid == value.Uuid)
                                uuid_error = true;
                            if (global_rfc != value.Rfc_issuer)
                                rfc_error = true;
                            if (global_cfdi != value.UsoCFDI)
                                usocfdi_error = true;
                            if (value.system_payment_status)
                                if (value.system_payment_status == 1)
                                    payment_error = true;
                        }); 

                        newInvoice = response.info_uuid[0].Serie + response.info_uuid[0].Folio
                        serie = response.info_uuid[0].Serie
                        folio = response.info_uuid[0].Folio
                       // newInvoice =  response.info_uuid[0].Folio

                        if (currency_error) {
                            $('#div_error_message').removeClass("hide");
                            $('#error_currency').removeClass("hide");
                            $('#PreviewCurrency').css('background-color', '#E74C3C').css('color', 'white');
                        }

                        if (amount_error) {
                            $('#div_error_message').removeClass("hide");
                            $('#error_amount').removeClass("hide");
                            $('#PreviewTotal').css('background-color', '#E74C3C').css('color', 'white');
                        }

                        if (uuid_error) {
                            $('#div_error_message').removeClass("hide");
                            $('#error_uuid').removeClass("hide");
                            $('#PreviewUUID').css('background-color', '#E74C3C').css('color', 'white');
                        }
                        if (rfc_error) {
                            $('#div_error_message').removeClass("hide");
                            $('#error_rfc').removeClass("hide");
                            $('#PreviewSupplier').css('background-color', '#E74C3C').css('color', 'white');
                        }
                        if (payment_error) {
                            $('#div_error_message').removeClass("hide");
                            $('#error_payment').removeClass("hide");
                        }
                        if (usocfdi_error) {
                            $('#div_error_message').removeClass("hide");
                            $('#error_usoCFDI').removeClass("hide");
                            $('#PreviewUsoCFDI').css('background-color', '#E74C3C').css('color', 'white');
                        }
                        ClearTable(tableLoadXMLPreview, response.info_uuid);
                    }

                    if (currency_error || amount_error || uuid_error || rfc_error || payment_error || usocfdi_error) {
                        if ($("#DeparmentSpecial").val() = '1') {
                            $('#btnSaveNewInvoice').removeClass("hide");
                        } else {
                            $('#btnSaveNewInvoice').addClass("hide");
                        }
                    }
                }
            },
            error: function () {
                EndLoading();
                toastr.error("DESCONOCIDO, CONTACTA A SISTEMAS.")
            }
        });
    } else {
        toastr.warning("Ingrese un folio fiscal.")
    }
}

function SaveReplaceUUID() {
    swal({
        title: "¿Desea sustituir el folio fiscal?",
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#74D348",
        confirmButtonText: "Continuar",
        cancelButtonText: `Cancelar`
    }, function (isConfirm) {
        StartLoading();
        $.ajax({
            type: "POST",
            url: "/AccountingPayment/ActionSaveNewUUIDInPayment",
            data: { "new_uuid": $('#newUuid').val(), "current_uuid": global_uuid, "current_policy": global_policy, "current_payment": global_payment, "reference": global_reference, "new_reference": newInvoice, "serie": serie, "folio": folio },
            success: function (response) {
                console.log(response)
                SearchFunction();
                EndLoading();
                if (!response.Data)
                    SessionFalse("Terminó tu sesión");
                else {
                    $('#btnSaveNewInvoice').addClass("hide");
                    if (response.update_uuid) {
                        $('#div_error_message').removeClass("hide");
                        $('#error_register').removeClass("hide");
                    } else {
                        $('#div_success_message').removeClass("hide");
                    }
                }
            },
            error: function () {
                EndLoading();
                toastr.error("DESCONOCIDO, CONTACTA A SISTEMAS.")
            }
        });

    });
}



function UsoCFDIValidate(data) {
    if ("G01" == data)
        return data + " - Adquisición de mercancías";
    else if ("G02" == data)
        return data + " -  Devoluciones, descuentos o bonificaciones";
    else if ("G03" == data)
        return data + " - Gastos en general";
    else if ("I01" == data)
        return data + " - Construcciones";
    else if ("I02" == data)
        return data + " - Mobiliario y equipo de oficina por inversiones";
    else if ("I03" == data)
        return data + " - Equipo de transporte";
    else if ("I04" == data)
        return data + " - Equipo de cómputo y accesorios";
    else if ("I05" == data)
        return data + " - Dados, troqueles, moldes, matrices y herramental";
    else if ("I06" == data)
        return data + " - Comunicaciones telefónicas";
    else if ("I07" == data)
        return data + " - Comunicaciones satelitales";
    else if ("I08" == data)
        return data + " - Otra maquinaria y equipo";
    else if ("D01" == data)
        return data + " - Honorarios médicos, dentales y gastos hospitalarios";
    else if ("D02" == data)
        return data + " - Gastos médicos por incapacidad o discapacidad";
    else if ("D03" == data)
        return data + " - Gastos funerales";
    else if ("D04" == data)
        return data + " - Donativos";
    else if ("D05" == data)
        return data + " - Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)";
    else if ("D06" == data)
        return data + " - Aportaciones voluntarias al SAR";
    else if ("D07" == data)
        return data + " - Primas por seguros de gastos médicos";
    else if ("D08" == data)
        return data + " - Gastos de transportación escolar obligatoria";
    else if ("D09" == data)
        return data + " - Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones";
    else if ("D10" == data)
        return data + " - Pagos por servicios educativos (colegiaturas)";
    else if ("P01" == data)
        return data + " - Por definir";
    else
        return "Desconocido";
}
