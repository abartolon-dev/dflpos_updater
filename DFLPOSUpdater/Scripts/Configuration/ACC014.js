var remote_note_credit = [];
var remote_devolutions = [];
var enable_inputs = false;
var enable_finish_process = false;
const isDecimal = decimal => number => {
    const IsDecimal = RegExp(`^\\d+\\.?\\d{0,${decimal}}$`);
    return IsDecimal.test(number);
}
const Sum = list => Name => list.reduce((init, total) => { return init + parseFloat(total[Name]) }, 0)
const formatmoney = money => decimal => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", currencyDisplay: "symbol", maximumFractionDigits: decimal }).format(money);
function ComboboxOreders() {
    const selectOption = selectId => selectName => `<option value="${selectId}">${selectName}</option>`;
    axios.get("/Accounting/ActionGetAllPendingDevolution").then((data) => {
        $("#folioSearch").html([`<option value="0">Seleccione un proveedor</option>`, ...data.data.map(x => selectOption(x.supplier_id)(x.supplier_rfc + " - " + x.supplier_name + " - (Pendientes " + x.count_pending + ")"))])
    }).catch((error) => {

    })
}

function ValidateDate(data) {
    var date = moment(data).format('DD/MM/YYYY');
    if (date != 'Invalid date')
        return date;
    else
        return "-";
}

function checkDetail_tableCurrent() {
    enable_inputs = false;
    StartLoading();
    ClearAllCheckUUID();
    ClearAllCheck();
    ClearTable(tableDetailNoteC, []);
    $("#DivUuid").hide();
    $("#DivX").hide();
    if ($("#cbox_tableCurrent").is(':checked')) {
        $("#labelMain_tableCurrent").text("Mostrar solo los UUIDs disponibles asociar (" + remote_note_credit.filter(f => f.Available == "Disponible" && f.UsoCFDI == "G02").length + " uuids )");
        tableCurrent.columns([15]).visible(true);
        ClearTable(tableCurrent, remote_note_credit);
    }
    else {
        $("#labelMain_tableCurrent").text("Mostrar todos los UUIDs (" + remote_note_credit.length + " uuids )");
        tableCurrent.columns([15]).visible(false);
        ClearTable(tableCurrent, remote_note_credit.filter(f => f.Available == "Disponible" && f.UsoCFDI == "G02"));
    }

    if ($("#cbox_tableGlobal").is(':checked')) {
        ClearTable(tableGlobal, remote_devolutions);
    } else {
        ClearTable(tableGlobal, remote_devolutions.filter(f => f.Uuid == ""));
    }
    EndLoading();
}

function checkDetail_tableGlobal() {
    StartLoading();
    ClearAllCheck();
    ClearTable(tableDetailNoteC, []);
    $("#DivX").hide();
    if ($("#cbox_tableGlobal").is(':checked')) {
        $("#labelMain_tableGlobal").text("Mostrar solo las devoluciones disponibles asociar (" + remote_devolutions.filter(f => f.Uuid == "").length + " devoluciones )");
        tableGlobal.columns([14, 16]).visible(true);
        ClearTable(tableGlobal, remote_devolutions);
    }
    else {
        $("#labelMain_tableGlobal").text("Mostrar todas las devoluciones (" + remote_devolutions.length + " devoluciones )");
        tableGlobal.columns([14, 16]).visible(false);
        ClearTable(tableGlobal, remote_devolutions.filter(f => f.Uuid == ""));
    }
    EndLoading();
}

$('#datetimepicker').datepicker({
    autoclose: true,
    format: "mm/dd/yyyy",
    endDate: new Date(),
    todayHighlight: true,
    language: 'es'
});

function SwalMessage(optionSwal, funSucces, funcError, parmas) {
    swal({
        title: optionSwal.text,
        type: optionSwal.type,
        text: optionSwal.textOptional,
        showCancelButton: true,
        confirmButtonColor: optionSwal.color,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar"
    },
        function (isConfirm) {
            if (isConfirm) {
                funSucces(parmas);
            }
            else {
                funcError(parmas);
            }
        });
}

function ErrorListF(value, type, text, typeS, textSucces) {
    return !value ? ToastError(type, text) : typeS != null && typeS != "" ? ToastError(typeS, textSucces, true) : true;
}

function ToastError(type, text, value) {
    if (type == "Success") {
        toastr.success(text)
        return true;
    }
    else if (type == "Error") {
        toastr.error(text)
    }
    else if (type == "Warning") {
        toastr.warning(text)
    }
    return value != undefined || value != null ? value : false;
}

function ClearComboAndForm() {
    ClearForm();
    ClearCombo();
}

function SearchAndClearForm() {
    Search();
    ClearForm()
}

var FullTd = element => Option => Option == 2 ? `<td class = "discrepancy">${element} </td>` : `<td>${Option == 1 ? formatmoney(element)(4) : Option == 0 ? element : element != null && element.trim() != "" ? "Contado" : "No contado"}</td >`
var FullTh = element => `<th>${element}</th>`
var FullTable = element => array => array.map(title => FullTd(element[title.title])(title.option)).toString();
var FullTableHeader = array => `<tr>${array.map(title => FullTh(title))}</tr>`
Listoption = { RFC: "", Currency: "" }
listBlind = []
var base64Xml = "";
const sesion = "Se termino su sesion.";
var total = 0;
var notXMl = false;
var diference = 0;
var remote_uuid = [];

$(document).ready(function () {
    $("#folioSearch").select2();
    PutClassICheck();
    /* Create an array with the values of all the checkboxes in a column. CHECKBOX DENTRO DE DATABLE*/
    $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            return $('input', td).prop('checked') ? '1' : '0';
        });
    };
    OCHideOrShow(true);
    RCHideOrShow(true)
    window.setTimeout(function () { $("#fa").click(); }, 1000);
    $('#buttonStatus').click(function () {
        SwalMessage(
            {
                text: "¿Deseas procesar la orden de compra con diferencia?", type: "warning", color: "#DD6B55"
            },
            NewModifyBlind,
            function () { },
            null
        )
    });
    $("#buttonRescaneo").click(function () {
        SwalMessage(
            {
                text: "¿Deseas rescanear la orden de compra?", type: "warning", color: "#DD6B55"
            },
            function () { StatusRC(); ClearComboAndForm(); },
            function () { },
            null
        )
    });
    $("#buttonRescaneoS4").click(function () {
        SwalMessage(
            {
                text: "¿Deseas rescanear la orden de compra?", type: "warning", color: "#DD6B55"
            },
            function () { StatusRC(); ClearComboAndForm(); },
            function () { },
            null
        )
    });
    $("#cancelOrderButton").click(function () {
        purchaseValue = $("#folioSearch").val()
        if (ErrorListF(purchaseValue != "0", "Warning", "Selecciona una orden a cancelar")) {
            SwalMessage(
                {
                    text: "¿Deseas cancelar la orden de compra?", type: "warning", color: "#DD6B55"
                },
                CancelPurchaseOrder,
                function () { },
                null
            )
        }

    });
    [".select", "#selectOption"].map(element => $(element).select2())
    $("#saveFormModel").hide();
});

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
        { data: 'Uuid' },
        { data: 'Supplier_name' },
        { data: 'Invoice_date' },
        { data: 'Invoice_status_sat' },
        { data: 'Invoice_xml' },
        { data: 'Serie' },
        { data: 'Folio' },
        { data: 'UsoCFDI' },
        { data: 'Currency' },
        { data: 'ItemTotalAmount' },
        { data: 'ContadorDetalle', visible: false },
        { data: 'ContadorRelacionados' },
        { data: 'SiteCode', visible: false },
        { data: 'SiteName', visible: false },
        { data: 'Available' },
        { data: 'check_active' },
        { data: null },
        { data: 'Compare_Purchase_Status', visible: false }
    ],
    columnDefs: [{
        targets: [0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        width: "1%"
    },
    {
        targets: [1],
        width: "100%"
    },
    {
        targets: [3],
        render: function (data, type, row) {
            return ValidateDate(data);
        },
    },
    {
        render: function (data, type, full, meta) {
            if (data) {
                if (full.SiteCode == "")
                    return `<i class='fa fa-check-circle fa-2x text-success'></i>`;
                else
                    return `<i class='fa fa-check-circle fa-2x'></i>`;
            }
            else
                return `<i class='fa fa-circle-thin fa-2x text-danger'></i>`;
        },
        targets: [4]
    },
    {
        render: function (data, type, full, meta) {
            if (data) {
                if (full.SiteCode == "")
                    return `<i class='fa fa-check-circle fa-2x text-success'></i>`;
                else
                    return `<i class='fa fa-check-circle fa-2x'></i>`;
            }
            else
                return `<i class='fa fa-circle-thin fa-2x text-danger'></i>`;
        },
        targets: [5]
    },
    {
        render: function (data, type, full, meta) {
            return UsoCFDIValidate(data);
        },
        targets: [8]
    },
    {
        type: 'numeric-comma',
        render: function (data, type, row) {
            return formatmoney(data)(4);
        },
        targets: [10]
    },
    {
        data: null,
        width: "1%",
        targets: 17,
        render: function (data, type, full, meta) {
            if (full.Uuid) {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDF('` + full.Uuid + `')"> <i class="fa fa-info-circle"></i> PDF </button> <br/> <br/>
                                        <button class="btn btn-xs btn-outline btn-success" onclick="downloadXML('` + full.Uuid + `')"><i class="fa fa-download"></i> XML</button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
    },
    {
        width: "1%",
        ordering: false,
        targets: [16],
        render: function (data, type, full, meta) {
            if (full.Available == "Disponible") {
                if (full.Invoice_xml) {
                    return `<input type='checkbox' id='cbox_active_${full.Uuid}' style='font-size: ${data ? '12' : '8'}px' ${data ? 'checked' : ''} onclick='SelectUUID(${meta.row}, ${data});' class='i-checks'>`;
                } else {
                    return `<i class='fa fa-square fa-2x' data-toggle="tooltip" data-placement="bottom" title="Aun no se obtiene el XML"></i>`;
                }
            }
            else
                return `<i class='fa fa-minus-square-o fa-2x'  data-toggle="tooltip" data-placement="bottom" title="Este XML ya fue procesado en otra devolución."></i>`;
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
        url: "/Accounting/ActionGetInfoFromCreditNote",
        data: { "Uuid": d.Uuid },
        type: "GET",
        success: function (returndate) {
            if (returndate.success) {
                console.log("returndate")
                console.log(returndate)
                if (returndate.current_uuids != null) {
                    $.each(returndate.current_uuids, function (index, value) {
                        detailUUid += "<tr><td class='text-center'>" + value.Uuid + "</td><td class='text-center'>" + value.Supplier_name + "</td><td class='text-center'>" + ValidateSite(value.Folio) + "</td><td class='text-center'>" + ValidateSite(value.DocumentNo) + "</td><td class='text-center'>" + ValidateSite(value.SiteName) + "</td><td class='text-center'>" + ValidateStatus(value.Invoice_status_sat) + "</td><td class='text-center'>" + ValidateStatus(value.Invoice_xml) + "</td><td class='text-center'>" + formatmoney(value.ItemTotalAmount)(4) + "</td><td class='text-center'>" + ValidateDate(value.ProcessDate) + "</td><td class='text-center'>" + value.PaymentStatus + "</td><td class='text-center'>" + ValidateDate(value.PaymentDate) + "</td><td>" + ValidateReport(value.Uuid, value.Invoice_xml) + "</td></tr>"
                    });
                    tableHTML += '<p class="text-center"><code style="font-size: 20px;">Uuid relacionados</code></p><table id="tabledetail" class="table table-striped table-bordered table-hover" style="width:100%">' +
                        '<thead><tr><th>Uuid</th><th>Proveedor</th><th>Folio</th><th>Documento</th><th>Sucursal</th><th>Vigencia</th><th>XML</th><th>Total</th><th>Procesado</th><th>Estatus</th><th>Fecha de Pago</th><th>Reporte</th></tr></thead><tbody>' + detailUUid + '</tbody></table> ';
                }
                if (returndate.current_products != null) {
                    $.each(returndate.current_products, function (index, value) {
                        detailItems += "<tr><td>" + value.item_no + "</td><td>" + value.item_description + "</td><td>" + value.quantity + "</td><td>" + formatmoney(value.unit_cost)(4) + "</td><td>" + formatmoney(value.iva_amount)(4) + "</td><td>" + formatmoney(value.ieps_amount)(4) + "</td><td>" + formatmoney(value.iva_retained)(4) + "</td><td>" + formatmoney(value.isr_retained)(4) + "</td><td>" + formatmoney(value.discount)(4) + "</td><td>" + formatmoney(value.item_amount)(4) + "</td></tr>"
                    });
                    tableHTML += '<p class="text-center"><code style="font-size: 20px;">Productos</code></p><table id="tabledetailtwo" class="table table-striped table-bordered table-hover" style="width:100%">' +
                        '<thead><tr><th>Codigo</th><th>Descripción</th><th>Cantidad</th><th>Costo Unitario</th><th>IVA</th><th>IEPS</th><th>IVA Ret.</th><th>ISR Ret.</th><th>Descuento</th><th>Total</th></tr></thead><tbody>' + detailItems + '</tbody></table>';
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

function ValidateReport(data, flag) {
    if (flag)
        return `<button class="btn btn-xs btn-outline btn-info text-center" onclick="showPDF('` + data + `')"> <i class="fa fa-info-circle"></i> PDF Relacionado</button> <br/> <br/>
                                        <button class="btn btn-xs btn-outline btn-success" onclick="downloadXML('` + data + `')"><i class="fa fa-download"></i> XML</button>`;
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
    $('#tabledetailtwo').DataTable({
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
$('#TableCurrentPurchase').on('draw.dt', function () { //Imprimir los i-check del datatable
    PutClassICheck();
});

function SelectUUID(row, valueNegative) { //Agrega o elimina un producto (checkbox)
    ClearTable(tableDetailNoteC, []);
    ClearAllCheckUUID();
    tableCurrent.cell(row, 16).data(!valueNegative).draw(false);
    if (!valueNegative) {
        var current_UsoCFDI = ((tableCurrent.data().toArray()[row].UsoCFDI == null) ? "" : tableCurrent.data().toArray()[row].UsoCFDI);
        if (current_UsoCFDI == "G02") {
            StartLoading();
            $('#IconMainUploadMain').addClass("text-success");
            $.ajax({
                url: "/Accounting/ActionGetDevolutionsFromUuid",
                data: { "Uuid": tableCurrent.data().toArray()[row].Uuid },
                type: "GET",
                success: function (returndate) {
                    if (returndate.success) {
                        enable_inputs = true;
                        ClearAllCheck();
                        tableCurrent.cell(row, 18).data(1).draw(false);
                        $("#DivUuid").show();
                        $("#DivX").hide();
                        var current_serie = ((tableCurrent.data().toArray()[row].Serie == null) ? "" : tableCurrent.data().toArray()[row].Serie);
                        var current_folio = ((tableCurrent.data().toArray()[row].Folio == null) ? "" : tableCurrent.data().toArray()[row].Folio);
                        current_invoice = current_serie + current_folio;
                        current_date = moment(tableCurrent.data().toArray()[row].Invoice_date).format('L');;
                        current_uuid = tableCurrent.data().toArray()[row].Uuid;
                        $('#TitlePOFolio').text(current_serie + current_folio);
                        $('#TitlePOMoneda').text(tableCurrent.data().toArray()[row].Currency);
                        $('#TitlePOProductos').text(tableCurrent.data().toArray()[row].ContadorRelacionados);
                        $('#TitlePOAmount').text(formatmoney(tableCurrent.data().toArray()[row].ItemTotalAmount)(4));
                        $('#TitlePOFooter').html(`Folio Fiscal ${tableCurrent.data().toArray()[row].Uuid} procesado el dia ${current_date}`);
                        if (returndate.current_credits.length > 0) {
                            $("#DivX").show();
                            ClearTableCurrentPage(tableDetailNoteC, returndate.current_credits);
                            $.each(returndate.current_credits, function (index, value) {
                                var myIndex = tableGlobal.data().toArray().findIndex(f => f.NoteCreditId == value.NoteCreditId);
                                if (myIndex >= 0) {
                                    tableGlobal.cell(myIndex, 17).data(true).draw(false);
                                }
                            });
                        } else {
                            ClearTableCurrentPage(tableDetailNoteC, []);
                        }

                    } else {
                        SessionFalse("session");
                    }
                    EndLoading();
                }
            });

        } else {
            $("#DivUuid").show();
            $("#DivX").hide();
            enable_inputs = false;
            ClearAllCheck();
            $('#TitlePOFooter').html(`Uso de CFDI es incorrecto <span class='text-danger'>` + UsoCFDIValidate(current_UsoCFDI) + `</span>, debe ser <span class='text-success'>G02</span>, <strong>verifique si realmente ocupa necesita esta factura, si es asi, solicite una nueva.<strong>`);
            $('#IconMainUploadMain').addClass("text-danger");
        }
    } else {
        enable_inputs = false;
        ClearAllCheck();
        $("#DivX").hide();
        $("#DivUuid").hide();
    }
    return true;
}


var tableGlobal = $('#TablePurchaseGlobal').DataTable({
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
        { data: 'NoteCreditId' },//1
        { data: 'Rfc_issuer', visible: false },//2
        { data: 'Supplier_name' },//3
        { data: 'Invoice_date' },//4
        { data: 'DocumentNo' },//5
        { data: 'Currency' },//6
        { data: 'ItemTotalAmount' },//7
        { data: 'ContadorDetalle' }, //8
        { data: 'Invoice_status_sat', visible: false },//9
        { data: 'Invoice_xml', visible: false },//10
        { data: 'SiteName', visible: false },//11
        { data: 'SiteCode' }, //12
        { data: 'ProcessDate', visible: false },//13
        { data: 'Uuid', visible: false },//14
        { data: 'Available', visible: false },//15
        { data: null, visible: false }, //16
        { data: "check_active", visible: true }, //17
        { data: "Compare_Purchase_Status", visible: false }, //18
        { data: "delete_flag", visible: false } //19

    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        width: "10%"
    },
    {
        targets: [4],
        render: function (data, type, row) {
            var date = moment(data).format('DD/MM/YYYY');
            if (date != 'Invalid date')
                return date;
            else
                return "";
        },
    },
    {
        type: 'numeric-comma',
        render: function (data, type, row) {
            return formatmoney(data)(4);
        },
        targets: [7]
    },
    {
        render: function (data, type, full, meta) {
            if (data) {
                if (full.SiteCode == "")
                    return `<i class='fa fa-check-circle fa-2x text-success'></i>`;
                else
                    return `<i class='fa fa-check-circle fa-2x'></i>`;
            }
            else
                return `<i class='fa fa-circle-thin fa-2x text-danger'></i>`;
        },
        targets: [11]
    },
    {
        render: function (data, type, full, meta) {
            return full.SiteName;
        },
        targets: [12]
    },
    {
        targets: [15],
        render: function (data, type, full, meta) {
            if (data == "Disponible") {
                if (full.Compare_Purchase_Status == 1 || full.Compare_Purchase_Status == 2) {
                    return `<strong class="text-success">Disponible</strong>`;
                } else {
                    return `<p>Disponible</p>`;
                }
            }
            else if (data == "Terminado" || data == "Cancelado")
                return `<p> ${data}</p>`;
            else
                return `<p class="text-warning">${data}</p>`;
        }
    },
    {
        data: null,
        width: "1%",
        targets: 16,
        render: function (data, type, full, meta) {
            if (full.Uuid != "") {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDF('` + full.Uuid + `')"> <i class="fa fa-info-circle"></i> PDF </button> <br/> <br/>
                                        <button class="btn btn-xs btn-outline btn-success" onclick="downloadXML('` + full.Uuid + `')"><i class="fa fa-download"></i> XML</button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
    },
    {
        width: "1%",
        ordering: false,
        targets: [17],
        render: function (data, type, full, meta) {
            if (full.Available == "Disponible") {
                if (full.Uuid == "") {
                    if (enable_inputs) {
                        return `<input type='checkbox' id='cbox_active_${full.Uuid}' style='font-size: ${data ? '12' : '8'}px' ${data ? 'checked' : ''} onclick='UpdateEnableProduct(${meta.row}, ${data});' class='i-checks'>`;
                    } else {
                        return `<input type='checkbox' id='cbox_active_${full.Uuid}' style='font-size: ${data ? '12' : '8'}px' ${data ? 'checked' : ''} disabled class='i-checks'>`;
                    }

                } else {
                    return `<i class='fa fa-square fa-2x' data-toggle="tooltip" data-placement="bottom" title="Este XML ya esta agregado en otra Nota de Credito"></i>`;
                }
            }
            else
                return `<i class='fa fa-minus-square-o fa-2x'  data-toggle="tooltip" data-placement="bottom" title="Este XML ya esta agregado en otra Nota de Credito."></i>`;
        }
    }],
});

$('#TablePurchaseGlobal').on('draw.dt', function () { //Imprimir los i-check del datatable
    PutClassICheck();
});
function UpdateEnableProduct(row, valueNegative) {
    StartLoading();
    if (!valueNegative) {
        tableGlobal.cell(row, 17).data(true).draw(false);
        $("#DivX").show();
        if (tableGlobal.data().toArray().filter(f => f.check_active == true).length > 0) {
            var myIndex = tableDetailNoteC.data().toArray().findIndex(f => f.NoteCreditId == tableGlobal.data().toArray()[row].NoteCreditId);
            if (myIndex >= 0) {
                tableDetailNoteC.cell(myIndex, 17).data(true).draw(true);
                tableDetailNoteC.cell(myIndex, 19).data(false).draw(true);
                ClearTable(tableDetailNoteC, tableDetailNoteC.data().toArray().sort((a, b) => Number(a.delete_flag) - Number(b.delete_flag)));
            } else {
                tableGlobal.cell(row, 17).data(true).draw(false);
                tableGlobal.cell(row, 19).data(false).draw(false);
                var creditNotes = tableDetailNoteC.data().toArray();
                creditNotes.push(tableGlobal.data().toArray()[row]);
                ClearTable(tableDetailNoteC, creditNotes.sort((a, b) => Number(a.delete_flag) - Number(b.delete_flag)));
            }
            $('#TitleXFolio').text(tableDetailNoteC.data().toArray().filter(f => f.check_active == true).length);
            var count_products = tableDetailNoteC.data().toArray().filter(f => f.check_active == true).reduce((a, b) => ({ ContadorDetalle: a.ContadorDetalle + b.ContadorDetalle }));
            var amount_documents = tableDetailNoteC.data().toArray().filter(f => f.check_active == true).reduce((a, b) => ({ ItemTotalAmount: a.ItemTotalAmount + b.ItemTotalAmount }));
            $('#TitleXProductos').text(count_products.ContadorDetalle);
            $('#TitleXAmount').text(formatmoney(amount_documents.ItemTotalAmount)(4));
        }
    } else {
        tableGlobal.cell(row, 17).data(false).draw(false);
        ClearTableCurrentPage(tableGlobal, tableGlobal.data().toArray());
        if (tableGlobal.data().toArray().filter(f => f.check_active == true).length == 0) {
            $("#DivX").hide();
            var myIndex = tableDetailNoteC.data().toArray().findIndex(f => f.NoteCreditId == tableGlobal.data().toArray()[row].NoteCreditId);
            if (myIndex >= 0) {
                tableDetailNoteC.cell(myIndex, 17).data(false).draw(true);
                tableDetailNoteC.cell(myIndex, 19).data(true).draw(true);
                ClearTable(tableDetailNoteC, tableDetailNoteC.data().toArray().sort((a, b) => Number(a.delete_flag) - Number(b.delete_flag)));
            } else {
                tableGlobal.cell(row, 17).data(false).draw(false);
                tableGlobal.cell(row, 19).data(true).draw(false);
                var creditNotes = tableDetailNoteC.data().toArray();
                creditNotes.push(tableGlobal.data().toArray()[row]);
                ClearTable(tableDetailNoteC, creditNotes.sort((a, b) => Number(a.delete_flag) - Number(b.delete_flag)));
            }
        } else {
            var myIndex = tableDetailNoteC.data().toArray().findIndex(f => f.NoteCreditId == tableGlobal.data().toArray()[row].NoteCreditId);
            if (myIndex >= 0) {
                tableDetailNoteC.cell(myIndex, 17).data(false).draw(true);
                tableDetailNoteC.cell(myIndex, 19).data(true).draw(true);
                ClearTable(tableDetailNoteC, tableDetailNoteC.data().toArray().sort((a, b) => Number(a.delete_flag) - Number(b.delete_flag)));
            } else {
                tableGlobal.cell(row, 17).data(false).draw(false);
                tableGlobal.cell(row, 19).data(true).draw(false);
                var creditNotes = tableDetailNoteC.data().toArray();
                creditNotes.push(tableGlobal.data().toArray()[row]);
                ClearTable(tableDetailNoteC, creditNotes.sort((a, b) => Number(a.delete_flag) - Number(b.delete_flag)));
            }
            $('#TitleXFolio').text(tableDetailNoteC.data().toArray().filter(f => f.check_active == true).length);
            var count_products = tableDetailNoteC.data().toArray().filter(f => f.check_active == true).reduce((a, b) => ({ ContadorDetalle: a.ContadorDetalle + b.ContadorDetalle }));
            var amount_documents = tableDetailNoteC.data().toArray().filter(f => f.check_active == true).reduce((a, b) => ({ ItemTotalAmount: a.ItemTotalAmount + b.ItemTotalAmount }));
            $('#TitleXProductos').text(count_products.ContadorDetalle);
            $('#TitleXAmount').text(formatmoney(amount_documents.ItemTotalAmount)(4));
        }

    }
    EndLoading();
    return true;
}


function ClearAllCheckUUID() {
    if (tableCurrent.data().toArray().length > 0) {
        tableCurrent.data().toArray().forEach(function (part, index, theArray) {
            theArray[index].check_active = false;
            theArray[index].Compare_Purchase_Status = 0;
        });
        ClearTableCurrentPage(tableCurrent, tableCurrent.data().toArray());
    }
}

function ClearAllCheck() {
    if (tableGlobal.data().toArray().length > 0) {
        tableGlobal.data().toArray().forEach(function (part, index, theArray) {
            theArray[index].check_active = false;
            theArray[index].Compare_Purchase_Status = 0;
        });
        ClearTableCurrentPage(tableGlobal, tableGlobal.data().toArray());
    }
}
function PutClassICheck() {
    $('input[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_square-green',
    }).on('ifClicked', function () {
        $(this).trigger("click");
    });
}
function ClearTableCurrentPage(table, list) { /// Dibujar tablas
    table.clear().draw(false);
    table.rows.add(list);
    table.columns.adjust().draw(false);
}
var detailRowsGlobal = [];

$('#TablePurchaseGlobal tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tableGlobal.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
    }
    else {
        if (tableGlobal.row('.details').length) {
            $('.details-control', tableGlobal.row('.details').node()).click();
        }
        row.child(formatGlobal(row.data())).show();
        tr.addClass('details');
    }
});

tableGlobal.on('draw', function () {
    $.each(detailRowsGlobal, function (i, id) {
        $('#' + id + ' td.details-control').trigger('click');
    });
});

function formatGlobal(d) {
    StartLoading();
    var detailItems = "";
    var tabledetail = $('<div/>').addClass('loading').text('Cargando Datos...');
    $.ajax({
        url: "/Accounting/ActionGetProductsFromDevolutions",
        data: { "site_code": d.SiteCode, "document": d.DocumentNo },
        type: "GET",
        success: function (returndate) {
            if (returndate.success) {
                if (returndate.products != null) {
                    $.each(returndate.products, function (index, value) {
                        detailItems += "<tr><td>" + value.item_no + "</td><td>" + value.item_description + "</td><td>" + value.quantity + "</td><td class='text-center'>" + formatmoney(value.unit_cost)(4) + "</td><td class='text-center'>" + formatmoney(value.item_sub_amount)(4) + "</td><td class='text-center'>" + formatmoney(value.ieps_amount)(4) + "</td><td class='text-center'>" + formatmoney(value.iva_amount)(4) + "</td><td class='text-center'>" + formatmoney(value.item_amount)(4) + "</td></tr>"
                    });
                    tabledetail.html('<table id="tabledetailGlobal" class="table table-striped table-bordered table-hover" style="width:100%">' +
                        '<thead><tr><th>Codigo</th><th>Descripción</th><th>Cantidad</th><th>Costo Unitario</th><th>Subtotal</th><th>IEPS</th><th>IVA</th><th>Total</th></tr></thead><tbody>' + detailItems + '</tbody></table>').removeClass('loading');
                    reloadStyleTableGlobal();
                } else {
                    toastr.error('No se logro obtener la información.');
                }
            } else {
                SessionFalse("Se acabo la sesion.");
            }
            EndLoading();
        }
    });
    return tabledetail;
}
function reloadStyleTableGlobal() {
    $('#tabledetailGlobal').DataTable({
        oLanguage: {
            "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
        },
    });
}

var tableDetailNoteC = $('#TableDetailNC').DataTable({
    autoWidth: true,
    responsive: true,
    searching: true,
    paging: true,
    ordering: true,
    info: false,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[3, 5, 10, 25, 50, -1], [3, 5, 10, 25, 50, "Todos"]],
    buttons: [],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        if (aData.Compare_Purchase_Status == 1) {
            $('td', nRow).addClass("success").addClass("BoldClass");
        }
        if (aData.Compare_Purchase_Status == 2) {
            $('td', nRow).addClass("BoldClass");
        }
        if (aData.delete_flag) {
            $(nRow).hide();
        }
    },
    columns: [
        {
            "class": "details-control",
            "orderable": false,
            "data": null,
            "defaultContent": "",
        },
        { data: 'NoteCreditId' },//1
        { data: 'Rfc_issuer', visible: false },//2
        { data: 'Supplier_name', visible: false },//3
        { data: 'Invoice_date' },//4
        { data: 'DocumentNo' },//5
        { data: 'Currency', visible: false },//6
        { data: 'ItemTotalAmount' },//7
        { data: 'ContadorDetalle', visible: false }, //8
        { data: 'Invoice_status_sat', visible: false },//9
        { data: 'Invoice_xml', visible: false },//10
        { data: 'SiteName', visible: false },//11
        { data: 'SiteCode' }, //12
        { data: 'ProcessDate', visible: false },//13
        { data: 'Uuid', visible: false },//14
        { data: 'Available', visible: false },//15
        { data: null, visible: false }, //16
        { data: "check_active", visible: true }, //17
        { data: "Compare_Purchase_Status", visible: false }, //18
        { data: "delete_flag", visible: false } //19

    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        width: "10%"
    },
    {
        targets: [4],
        render: function (data, type, row) {
            var date = moment(data).format('DD/MM/YYYY');
            if (date != 'Invalid date')
                return date;
            else
                return "";
        },
    },
    {
        type: 'numeric-comma',
        render: function (data, type, row) {
            return formatmoney(data)(4);
        },
        targets: [7]
    },
    {
        render: function (data, type, full, meta) {
            if (data) {
                if (full.SiteCode == "")
                    return `<i class='fa fa-check-circle fa-2x text-success'></i>`;
                else
                    return `<i class='fa fa-check-circle fa-2x'></i>`;
            }
            else
                return `<i class='fa fa-circle-thin fa-2x text-danger'></i>`;
        },
        targets: [11]
    },
    {
        render: function (data, type, full, meta) {
            return full.SiteName;
        },
        targets: [12]
    },
    {
        targets: [15],
        render: function (data, type, full, meta) {
            if (data == "Disponible") {
                if (full.Compare_Purchase_Status == 1) {
                    return `<strong class="text-success">Disponible</strong>`;
                } else {
                    return `<p>Disponible</p>`;
                }
            }
            else if (data == "Terminado" || data == "Cancelado")
                return `<p> ${data}</p>`;
            else
                return `<p class="text-warning">${data}</p>`;
        }
    },
    {
        data: null,
        width: "1%",
        targets: 16,
        render: function (data, type, full, meta) {
            if (full.Uuid != "") {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDF('` + full.Uuid + `')"> <i class="fa fa-info-circle"></i> PDF </button> <br/> <br/>
                                        <button class="btn btn-xs btn-outline btn-success" onclick="downloadXML('` + full.Uuid + `')"><i class="fa fa-download"></i> XML</button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
    },
    {
        width: "1%",
        ordering: false,
        targets: [17],
        render: function (data, type, full, meta) {
            if (full.Available == "Disponible") {
                if (full.Uuid == "") {
                    if (enable_inputs) {
                        return `<input type='checkbox' id='cbox_active_${full.Uuid}' style='font-size: ${data ? '12' : '8'}px' ${data ? 'checked' : ''} onclick='UpdateDetailNC(${meta.row});' class='i-checks'>`;
                    } else {
                        return `<input type='checkbox' id='cbox_active_${full.Uuid}' style='font-size: ${data ? '12' : '8'}px' ${data ? 'checked' : ''} disabled class='i-checks'>`;
                    }

                } else {
                    return `<i class='fa fa-square fa-2x' data-toggle="tooltip" data-placement="bottom" title="Este XML ya esta agregado en otra Nota de Credito"></i>`;
                }
            }
            else
                return `<i class='fa fa-minus-square-o fa-2x'  data-toggle="tooltip" data-placement="bottom" title="Este XML ya esta agregado en otra Nota de Credito."></i>`;
        }
    }],
});

$('#TableDetailNC').on('draw.dt', function () { //Imprimir los i-check del datatable
    PutClassICheck();
});


function UpdateDetailNC(row) {
    StartLoading();
    tableDetailNoteC.cell(row, 17).data(false).draw(true);
    tableDetailNoteC.cell(row, 19).data(true).draw(true);
    if (tableDetailNoteC.data().toArray().filter(f => f.check_active == true).length == 0) {
        $("#DivX").hide();
        var myIndex = tableGlobal.data().toArray().findIndex(f => f.NoteCreditId == tableDetailNoteC.data().toArray()[row].NoteCreditId);
        if (myIndex >= 0) {
            tableGlobal.cell(myIndex, 17).data(false).draw(false);
            ClearTableCurrentPage(tableGlobal, tableGlobal.data().toArray());
        }
    } else {
        var myIndex = tableGlobal.data().toArray().findIndex(f => f.NoteCreditId == tableDetailNoteC.data().toArray()[row].NoteCreditId);
        if (myIndex >= 0) {
            tableGlobal.cell(myIndex, 17).data(false).draw(false);
            ClearTableCurrentPage(tableGlobal, tableGlobal.data().toArray());
        }
        $('#TitleXFolio').text(tableDetailNoteC.data().toArray().filter(f => f.check_active == true).length);
        var count_products = tableDetailNoteC.data().toArray().filter(f => f.check_active == true).reduce((a, b) => ({ ContadorDetalle: a.ContadorDetalle + b.ContadorDetalle }));
        var amount_documents = tableDetailNoteC.data().toArray().filter(f => f.check_active == true).reduce((a, b) => ({ ItemTotalAmount: a.ItemTotalAmount + b.ItemTotalAmount }));
        $('#TitleXProductos').text(count_products.ContadorDetalle);
        $('#TitleXAmount').text(formatmoney(amount_documents.ItemTotalAmount)(4));
    }
    ClearTableCurrentPage(tableDetailNoteC, tableDetailNoteC.data().toArray().sort((a, b) => Number(a.delete_flag) - Number(b.delete_flag)));
    EndLoading();
    return true;
}


function ValidateNull(data) {
    return (data == null) ? "N/A" : data;
}

function ClearCombo() {
    ComboboxOreders()
    $("#select2-chosen-1").html("Seleccione una orden")
}

function SearchPurchase() {
    SearchAndClearForm();
}

function ClearTable(myTable, information) {
    myTable.clear().draw();
    myTable.rows.add(information);
    myTable.columns.adjust().draw();
}

function TableORCG(current_supplier_id) {
    StartLoading();
    if (current_supplier_id == 0)
        current_supplier_id = $("#folioSearch").val();
    $("#DivUuid").hide();
    $("#DivX").hide();
    $("#saveFormModel").hide();
    axios.get("/Accounting/ActionCreditNotePending/?supplier_id=" + current_supplier_id)
        .then(function (data) {
            OCHideOrShow(false)
            RCHideOrShow(true)
            $("#tableOCRG").html("");
            $('#rfc').text(data.data.supplier.Rfc);
            $('#provider').text(data.data.supplier.CommercialName);
            $('#adress').text(data.data.supplier.SupplierAddress);
            $('#nameContact').text(data.data.supplier.name);
            $('#email').text(data.data.supplier.email);
            $('#phone').text(data.data.supplier.phone);
            $('#TitlePO').text(data.data.supplier.CommercialName);
            $("#searchBody").show();
            $('#cbox_tableCurrent').iCheck('uncheck');
            $('#cbox_tableGlobal').iCheck('uncheck');
            remote_note_credit = data.data.purchase_order;
            remote_devolutions = data.data.pending;
            tableCurrent.columns([15]).visible(false);
            tableGlobal.columns([14, 16]).visible(false);
            $("#labelMain_tableCurrent").text("Mostrar todos los UUIDs (" + remote_note_credit.length + " facturas)");
            $("#labelMain_tableGlobal").text("Mostrar todos las devoluciones (" + remote_devolutions.length + " facturas)");

            if (remote_note_credit.length > 0) {
                if (remote_note_credit.filter(f => f.Available == "Disponible" && f.UsoCFDI == "G02").length > 0) {
                    ClearTable(tableCurrent, remote_note_credit.filter(f => f.Available == "Disponible" && f.UsoCFDI == "G02"));
                } else {
                    ClearTable(tableCurrent, remote_note_credit);
                }
            } else {
                ClearTable(tableCurrent, []);
            }

            if (remote_devolutions.length > 0) {
                if (remote_devolutions.filter(f => f.Uuid == "")) {
                    ClearTable(tableGlobal, remote_devolutions.filter(f => f.Uuid == ""));
                } else {
                    ClearTable(tableGlobal, remote_devolutions);
                }
            } else {
                ClearTable(tableGlobal, []);
            }
            EndLoading();
        }).catch(function (error) {
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
            console.log("error");
            console.log(error);
            EndLoading()
        }).then(() => { })
}

function OCInfoFill(id, data, name) {
    $(id).text(data[name] != "" ? data[name] : "N/A");
}
function OCInfo() {
    $("#saveFormModel").hide();
    $("#Invoice").val("");
    $("#PurchaseOrder").val("");
    axios.get("/PurchaseOrderItem/ActionPurchaseOrderItem/?PurchaseNo=" + $("#folioSearch").val())
        .then(function (data) {
            if (data.data.Supplier.PurchaseOrderList.length > 0) {
                $("#saveFormModel").show();
                ClearOrder();
                [
                    { title: "#provider", name: "CommercialName" }, { title: "#rfc", name: "RFC" }, { title: "#datee", name: "PurchaseDate" },
                    { title: "#currency", name: "Currency" }, { title: "#email", name: "Email" }, { title: "#nameContact", name: "NameContact" },
                    { title: "#phone", name: "Phone" }, { title: "#adress", name: "Adress" }, { title: "#Invoice", name: "InvoiceNo" },
                    { title: "#Comments", name: "Comments" }
                ].map(element => OCInfoFill(element.title, data.data.Supplier, element.name))
                $('#TitlePO').text(" Orden de compra " + $("#folioSearch").val());
                $('#TitlePOFolio').text(data.data.Supplier.InvoiceNo);
                $('#TitlePOMoneda').text(data.data.Supplier.Currency);
                $('#TitlePOProductos').text(data.data.Supplier.CountProducts);
                $('#TitlePOAmount').text(formatmoney(tableCurrent.data().toArray()[0].ItemTotalAmount)(4));
                $('#TitlePOFooter').text(" Orden de compra " + $("#folioSearch").val() + " procesada el día " + data.data.Supplier.PurchaseDate);
                $("#PurchaseOrder").val($("#folioSearch").val());
                current_po = $("#folioSearch").val();
                Listoption.RFC = data.data.Supplier.RFC
                Listoption.Currency = data.data.Supplier.Currency;
                $("#searchBody").show();
                EndLoading();
            }
            else {
                EndLoading();
            }
        }).catch(function (error) {
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
            EndLoading();
            console.log("error999");
            console.log(error);
        }).then(() => { })
}

function showPurchaseOrder(po_no) {
    StartLoading();
    $.ajax({
        type: "GET",
        url: "/OrderLists/ActionGetPurchasesOrderReport",
        data: { "poNumber": po_no },
        success: function (returndates) {
            document.getElementById("iframe").srcdoc = returndates;
            EndLoading();
            $("#ModalDescription").html('Reporte de orden de compra Numero: ' + po_no + '');
            $('#ModalReport').modal('show');
        },
        error: function (returndates) {
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
            EndLoading();
        }
    });
}

function Search() {
    ["#folio", "#folio2"].map(id => $(id).html($("#folioSearch").val()))
    TableORCG(0);
}

function OCHideOrShow(value) {
    var clearInfoOC = ["#infoSupplier", "#textProvider", "#folio",
        "#provider", "#datee", "#currency", "#email", "#nameContact", "#phone",
        "#adress", "#textOrder", "#totalIvaForm", "#totalIEPSForm", "#totalAmountForm", "#totalFinalForm",
        "#totalIva", "#totalIEPS", "#totalAmount", "#totalFinal", "#saveForm", "#Invoice"]
    value ? clearInfoOC.map(id => $(id).hide()) : clearInfoOC.map(id => $(id).show())
}

function RCHideOrShow(value) {
    var clearInfoOC = ["#folioForm", "#textOCRG", "#statusForm", "#buttonStatus"]
    value ? clearInfoOC.map(id => $(id).hide()) : clearInfoOC.map(id => $(id).show());
}

function ClearOrder() {
    var clearInfoOC = ["#provider", "#datee", "#currency", "#email", "#nameContact", "#phone", "#adress", "#Invoice"]
    clearInfoOC.map(id => $(id).text(""))
}

function ClearForm() {
    $("#searchBody").hide();
    position = $("#folioSearch").offset()
    $('html, body').animate({ scrollTop: position.top - 480 }, "slow");
    $('#selectOption').val($("#selectOption :first").val()).trigger('change');
    $("#PurchaseOrder").val("");
    $("#Invoice").val("");
    $("#Comments").val("");
}


$("#buttonSave").on("click", function () {
    SwalMessage(
        {
            text: "¿Desea agregar XML a la orden " + $("#PurchaseOrder").val() + "?", type: "warning", color: "#DD6B55", textOptional: "Únicamente es permitido registro con XML valido."
        },
        function () {
            $('#UpdateFile').val(null);
            $('#UpdateFile').click();
        },
        function () { },
        null
    )
});


function XmlCompare() {
    var fileInput = document.getElementById('UpdateFile');
    if (fileInput.files.length == 0) {
        toastr.error("Seleccione archivo XML.");
    }
    else {
        var idxDot = fileInput.files[0].name.lastIndexOf(".") + 1;
        var extFile = fileInput.files[0].name.substr(idxDot, fileInput.files[0].name.length).toLowerCase();
        if (extFile == "xml") {
            var selectedFile = ($("#UpdateFile"))[0].files[0];
            convertToBase64XML(fileInput.files);
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
                if (selectedFile.size < 5242880) {
                    swal({
                        title: "¿Esta seguro?",
                        text: "Se actualizará la orden de compra " + $("#PurchaseOrder").val(),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Continuar",
                        cancelButtonText: "Cancelar"
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                var formdata = new FormData();
                                formdata.append("totalPurchases", total + diference);
                                formdata.append("IVAtotalPurchases", sumTotalIva);
                                formdata.append("IEPStotalPurchases", sumTotalIEPS);
                                formdata.append("subTotalPurchases", sumTotalAmount);
                                var supplier = Listoption.RFC
                                formdata.append("supplier", supplier);
                                var currency = Listoption.Currency
                                formdata.append("currency", currency);
                                formdata.append(fileInput.files[0].name, fileInput.files[0]);
                                var xhr = new XMLHttpRequest();
                                xhr.open('POST', '/Purchases/ActionCompareAmountXmlOCRC001');
                                xhr.send(formdata);
                                xhr.overrideMimeType("application/json");
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState == 4 && xhr.status == 200) {
                                        var j = JSON.parse(xhr.responseText);
                                        if (j.success == 1) {
                                            if (j.currency == Listoption.Currency) {
                                                var idOption = $("#selectOption").val();
                                                if (j.diferenceTotal > 0) {
                                                    toastr.warning(`No es posible subir el XML, tiene una diferencia total de $${j.diferenceTotal}.`);
                                                } else if (j.diferenceIVA > 0) {
                                                    toastr.warning(`No es posible subir el XML, tiene una diferencia de $${j.diferenceIVA} en IVA.`);
                                                } else if (j.diferenceIEPS > 0) {
                                                    toastr.warning(`No es posible subir el XML, tiene una diferencia de $${j.diferenceIEPS} en IEPS.`);
                                                }
                                                else
                                                    StoreProcedure(j.uuid, j.fecha, j.invoice, j.diferenceTotal, idOption);
                                            }
                                            else {
                                                toastr.warning("El xml tiene otro tipo de moneda");
                                            }
                                        }
                                        else if (j.success == 8) {
                                            if (j.diferenceTotal > 0) {
                                                toastr.warning(`No es posible subir el XML, tiene una diferencia total de $${j.diferenceTotal}.`);
                                            } else {
                                                toastr.error(j.responseText);
                                            }
                                        }
                                    }
                                }

                            }
                        });
                }
                else {
                    toastr.error('Alerta - La imagen debe ser menor a 5MB');
                }
            }
        }
        else {
            toastr.error("Alerta - Solo se admiten archivos .xml Intentar con otro archivo");
        }
    }
}

function convertToBase64XML(file) {
    var selectedFile = file;
    if (selectedFile.length > 0) {
        var fileToLoad = selectedFile[0];
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            var base64 = window.btoa(fileLoadedEvent.target.result);
            base64Xml = base64
        };
        fileReader.readAsText(fileToLoad);
    }
}

function StoreProcedure(uuid, fecha, invoice, diference, idOption) {
    var purchaseNo = $("#folioSearch").val()
    StartLoading();
    GenericStoreProcedure(notXMl, "/PurchaseOrderItem/ActionNewStoreProcedureUpdateXML", { PurchaseNo: purchaseNo, Base64: base64Xml, Uuid: uuid, Date: fecha, Invoice: invoice, Diference: diference });
}

function GenericStoreProcedure(isXml, url, params) {
    StartLoading()
    axios.post(url, params)
        .then(function (data) {
            StoreProcedureOptions(isXml, data, params.Invoice)
        }).catch(function (data) {
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        }).then(() => {
            ClearCombo()
            EndLoading()
        })
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

function StoreProcedureOptions(isXml, data, Invoice) {
    if (!isXml) {
        if (ErrorListF(data.data.StoreProcedure.ReturnValue == 1005, null, null, "Warning", "Problema xml ya registrado") ||
            ErrorListF(data.data.StoreProcedure.ReturnValue == 1001, null, null, "Warning", "Problema al guardar fecha") ||
            ErrorListF(data.data.StoreProcedure.ReturnValue == 1045, null, null, "Warning", "Problema: valores vacios (nulos) al actualizar") ||
            ErrorListF(data.data.StoreProcedure.ReturnValue == 1006, null, null, "Warning", "Problema al generar diferencia") ||
            ErrorListF(data.data.StoreProcedure.ReturnValue == 7000, null, null, "Warning", `El folio ${Invoice} ya se encuentra registrado. Revise sus ordenes con este mismo proveedor en estatus TERMINADAS.`)) {
            ClearForm();
        }
    }
    if (
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8003, null, null, "Warning", "No existe registro") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8002, null, null, "Warning", "PO no esta confirmada") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8008, null, null, "Warning", "PO cancelada") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8009, null, null, "Warning", "Ya esta finalizada") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8010, null, null, "Warning", "Moneda Nulo") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8011, null, null, "Warning", "Valor Nulo") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8001, null, null, "Warning", "Error desconocido") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8004, null, null, "Warning", "No puede ser mayor a lo requerido") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8006, null, null, "Warning", "No tiene fecha de importación") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8007, null, null, "Warning", "No realizo movimiento") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 8005, null, null, "Warning", "No existe locación de los productos, proporcione una locación a los productos.") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 7000, null, null, "Warning", `El folio ${Invoice} ya se encuentra registrado. Revise sus ordenes con este mismo proveedor en estatus TERMINADAS.`) ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 1005, null, null, "Warning", "Problema xml ya registrado") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 1001, null, null, "Warning", "Problema al guardar fecha") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 1045, null, null, "Warning", "Problema: valores vacios (nulos) al actualizar") ||
        ErrorListF(data.data.StoreProcedure.ReturnValue == 1006, null, null, "Warning", "Problema al generar diferencia")) {
        ClearForm();
    }
    else if (data.data.StoreProcedure.ReturnValue == 1007) {
        if (data.data.uuid.uuid_site == "")
            $('#uuid_title').html("Este archivo ya se encuentra registrado en el sistema ERP FLORIDO. Favor de comunicarse con la tienda que realizo el registro de la factura.");
        else
            $('#uuid_title').html("Este archivo ya se encuentra registrado en el sistema ERP FLORIDO. Favor de revisar la factura repetida en esta misma sucursal.");
        $('#uuid_store').html(data.data.uuid.uuid_site_name);
        $('#uuid_type').html(data.data.uuid.uuid_type);
        $('#uuid_supplier_name').html(data.data.uuid.uuid_supplier_name);
        $('#uuid_invoice').html(data.data.uuid.uuid_invoice);
        $('#uuid_cdate').html(moment(data.data.uuid.uuid_cdate).format('DD/MM/YYYY'));
        $("#ModalUUID").modal("show");
        ClearForm();
    }
    else if (data.data.StoreProcedure.Document != null && data.data.StoreProcedure.Document != "" && data.data.StoreProcedure.ReturnValue == 0) {
        if (!isXml) {
            if (data.data.Error == 1002) { }
            else
                toastr.success('Se ha actualizado correctamente la entrada.');
            ClearForm();
            ClearCombo()
        }
        else {
            toastr.success("Se proceso correctamente")
            ClearForm();
            ClearCombo();
            $("#ModalInvoice").modal("hide")
        }
    }
    else if (data.data == "SF") {
        SessionFalse(sesion)
    }
    else {
        toastr.warning('Hubo un problema al procesar la orden de compra13');
        ClearForm();
    }
}

function UsoCFDIValidate(data) {
    if ("G01" == data)
        return data + " - Adquisición de mercancías";
    else if ("G02" == data)
        return "<strong>" + data + " -  Devoluciones, descuentos o bonificaciones</strong>";
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
        return data + "Desconocido";
}

function SwalMessageAssociation() {
    var list_count = (tableGlobal.data().toArray().filter(f => f.check_active == true).length);
    var message = "";
    if (list_count > 1) {
        message = "¿Desea asociar la Nota de credito a las " + list_count + " devoluciones?";
    } else {
        message = "¿Desea asociar la Nota de credito a 1 sola devolución?";
    }
    swal({
        title: message,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#55dd6b",
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar"
    },
        function (isConfirm) { if (isConfirm) { AssociationSaveProcess(); } });
}

function AssociationSaveProcess() {
    StartLoading();
    $.ajax({
        url: "/Accounting/ActionNoteCreditDevolutions",
        type: "POST",
        data: { "Devolutions": tableDetailNoteC.data().toArray().filter(f => f.check_active == true), "Uuid": tableCurrent.data().toArray().filter(f => f.check_active == true)[0].Uuid, "amount": tableDetailNoteC.data().toArray().filter(f => f.check_active == true)[0].ItemTotalAmount },
        success: function (response) {
            if (response.Error == 5) {
                toastr.error("Error al obtener el XML, intente de nuevo.");
                EndLoading();
            } else if (response.Error == 4) {
                toastr.error("Las devoluciones ya estaban relacionados a otra nota de credito.");
                if (response.new_nc == 0)
                    ClearComboAndForm();
                else {
                    TableORCG(response.new_nc);
                    toastr.success("Buscando devoluciones...");
                }
            } else if (response.Error == 3) {
                toastr.error("Error al relacionar notas de credito con las devoluciones.");
                if (response.new_nc == 0)
                    ClearComboAndForm();
                else {
                    TableORCG(response.new_nc);
                    toastr.success("Buscando devoluciones...");
                }
            } else if (response.Error == 0) {
                toastr.success("Se asocio correctamente la nota de credito.");
                if (response.new_nc == 0) {
                    EndLoading();
                    ClearComboAndForm();
                }
                else {
                    TableORCG(response.new_nc);
                    toastr.success("Buscando devoluciones...");
                }
            }
            else if (response.Error == "SF")
                SessionFalse("Terminó tu sesión.");
            else
                toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        },
        error: function () {
            EndLoading();
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        }
    });
}


function SwalMessageSaveProcess() {
    var list_count = (tableGlobal.data().toArray().filter(f => f.check_active == true).length);
    var message = "";
    if (list_count > 1) {
        message = "¿Desea terminar de relacionar la Nota de credito a las " + list_count + " devoluciones?";
    } else {
        message = "¿Desea terminar la relación la Nota de credito a 1 sola devolución?";
    }
    swal({
        title: message,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#55dd6b",
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar"
    },
        function (isConfirm) { if (isConfirm) { SaveProcess(); } });
}

function SaveProcess() {
    StartLoading();
    $.ajax({
        url: "/Accounting/ActionNoteCreditDevolutionsSaveProcess",
        type: "POST",
        data: { "Devolutions": tableDetailNoteC.data().toArray().filter(f => f.check_active == true), "Uuid": tableCurrent.data().toArray().filter(f => f.check_active == true)[0].Uuid, "amount": tableDetailNoteC.data().toArray().filter(f => f.check_active == true)[0].ItemTotalAmount },
        success: function (response) {
            if (response.Error == 5) {
                toastr.error("Error al obtener el XML, intente de nuevo.");
                EndLoading();
            } else if (response.Error == 4) {
                toastr.error("Ocurrio un error al actualizar las devoluciones.");
                if (response.new_nc == 0)
                    ClearComboAndForm();
                else {
                    TableORCG(response.new_nc);
                    toastr.success("Buscando devoluciones...");
                }
            } else if (response.Error == 3) {
                toastr.error("Error al relacionar notas de credito con las devoluciones.");
                if (response.new_nc == 0)
                    ClearComboAndForm();
                else {
                    TableORCG(response.new_nc);
                    toastr.success("Buscando devoluciones...");
                }
            } else if (response.Error == 0) {
                toastr.success("Se asocio correctamente la nota de credito.");
                if (response.new_nc == 0) {
                    EndLoading();
                    ClearComboAndForm();
                }
                else {
                    TableORCG(response.new_nc);
                    toastr.success("Buscando devoluciones...");
                }
            }
            else if (response.Error == "SF")
                SessionFalse("Terminó tu sesión.");
            else
                toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        },
        error: function () {
            EndLoading();
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
        }
    });
}
