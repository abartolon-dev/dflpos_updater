const formatmoney = money => decimal => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", currencyDisplay: "symbol", maximumFractionDigits: decimal }).format(money);

var projectTitle = "";
var projectItem = "";
var commentFiles = [];
var tab_process = 3;
var IsImage = image => image != "" ? "data:image;base64," + image : "https://www.elflorido.com.mx/images/Logotipo-01.png";
var isImage = file => file != null ? `<a href="${file}" title="" data-gallery=""><img src="${file}" onclick="OpenModalImage(this);" width="100" height="70"></a> ` : ``;
var IsDate = date => date != null ? moment(date).lang('es').format('MMM DD YYYY') : "S/Fecha";
var IsDateFull = date => date != null ? moment(date).lang('es').format('LLLL') : "S/Fecha";
var isPDF = (file, id_history) => file != null ? `<i class="fa fa-file-pdf-o fa-3x pull-left" onclick="OpenModelPdf(${id_history});" style="cursor: pointer;"></i>` : ``;
var isUser = user => user != null ? user : "/";
var getPDF = function (id_history_detail) {
    var attached = attachedByModal.find(x => x.id_history_detail == id_history_detail);
    return attached.document_pdf;
}
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4
});

function ValidateDate(data) {
    var date = moment(data).format('DD/MM/YYYY');
    if (date != 'Invalid date')
        return date;
    else
        return "-";
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
    $("#folioSearch").select2();
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
    if ($('#ValidDate1').val() != "" || $('#ValidDate2').val() != "") {
        StartLoading();
        $.ajax({
            url: "/Accounting/ActionGetRemisionPending",
            type: "GET",
            data: { "current_rfc": $("#SuppliersDrop").val(), "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val(), "process": tab_process},
            success: function (result) {
                EndLoading();
                if (result.success) {
                    //ClearTable(tblMainCreditNote, result.remisiones);
                    //ClearTable(tblLastComments, result.remisiones_pending);
                    if (tab_process == 2 )
                        ClearTable(tblAddendaMain, result.addenda_1);
                    else if (tab_process == 3)
                        ClearTable(tblAddendaNew, result.addenda_1);
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
}

function SearchInvoicesPending() {
    if ($('#ValidDate1').val() != "" || $('#ValidDate2').val() != "") {
        StartLoading();
        var supplier_rfc_container = "";
        if ($("#SuppliersDrop").val() != "") {
            supplier_rfc_container = $("#SuppliersDrop").select2('data').text.split('~');
            supplier_rfc_container = supplier_rfc_container[0];
        } else {
            supplier_rfc_container = "TODOS";
        }

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "/Accounting/ActionRemisionPendingXLS",
            data: { "current_rfc": $("#SuppliersDrop").val(), "supplier_name": supplier_rfc_container, "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val() },
            xhrFields: { responseType: 'blob' },
            success: function (data) {
                EndLoading();
                const url = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                var start_date = new Date($('#ValidDate1').val());
                var end_date = new Date($('#ValidDate2').val());
                var options_date = { year: 'numeric', month: 'long', day: 'numeric' };
                var str_date_start = start_date.toLocaleDateString("es-ES", options_date);
                var str_date_end = end_date.toLocaleDateString("es-ES", options_date);
                if ($("#SuppliersDrop").val() == "")
                    link.setAttribute('download', 'TODOS LOS PROVEEDORES - Addenda - Del ' + str_date_start + ' al ' + str_date_end + '.xlsx');
                else
                    link.setAttribute('download', $("#SuppliersDrop").val() + ' - ' + supplier_rfc_container + ' Addenda - Del ' + str_date_start + ' al ' + str_date_end + '.xlsx');
                document.body.appendChild(link);
                link.click();
            },
            error: function (req, status, error) {
                toastr.remove();
                toastr.error('Verifique su sesión.');
                EndLoading();
            }
        });
    } else {
        toastr.warning("Seleccione un rango de fechas.");
    }
}


function ReloadTab(tab) {
    if (tab == 2 || tab == 3) {
        tab_process = tab;
        $("#SearchMain").show();
        $("#SearchPending").hide();
    } else if (tab == 5) {
        $("#SearchMain").hide();
        $("#SearchPending").show();
    }
}
var tblMainCreditNote = $('#TableMainCreditNote').DataTable({
    autoWidth: true,
    responsive: true,
    searching: true,
    paging: true,
    ordering: false,
    info: true,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
    buttons: [],
    columns: [
        {
            "class": "details-control",
            "orderable": false,
            "data": null,
            "defaultContent": "",
        },//0
        { data: 'Uuid' },//1
        { data: 'Supplier_name' },//2
        { data: 'PurchaseNo' },//3
        { data: 'Invoice_date' },//4
        { data: 'Invoice_status_sat', visible: false },//5
        { data: 'Invoice_xml', visible: false },//6
        { data: 'Serie' },//7
        { data: 'Folio' },//8
        { data: 'UsoCFDI', visible: false },//9
        { data: 'Currency' },//10
        { data: 'ItemAmount' },//11
        { data: 'ItemIVA' },//12
        { data: 'ItemIEPS' },//13
        { data: 'ItemDiscount' },//14
        { data: 'ItemISRRET' },//15
        { data: 'ItemIVARET' },//16
        { data: 'ItemTotalAmount' },//17
        { data: 'ContadorDetalle', visible: false },//18
        { data: 'ContadorRelacionados', visible: false },//19
        { data: 'SiteCode', visible: false },//20
        { data: 'SiteName' },//21
        { data: 'Available', visible: false },//22
        { data: null },//23
        { data: 'Remision' },//24
        { data: null }//25
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        width: "1%"
    },
    {
        targets: [4],
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
        targets: [5]
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
        targets: [6]
    },
    {
        render: function (data, type, full, meta) {
            return UsoCFDIValidate(data);
        },
        targets: [9]
    },
    {
        type: 'numeric-comma',
        render: function (data, type, row) {
            return formatmoney(data)(4);
        },
        targets: [11, 12, 13, 14, 15, 16, 17]
    },
    {
        data: null,
        width: "1%",
        targets: 23,
        render: function (data, type, full, meta) {
            if (full.Uuid) {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDF('` + full.Uuid + `')"> <i class="fa fa-info-circle"></i> PDF </button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
    },
    {
        render: function (data, type, full, meta) {
            if (full.remision_status == null)
                return `Sin relacionar`;
            else if (full.remision_status == 0)
                return `<i class='fa fa-check-circle fa-2x'></i><p>Inicial</p>`;
            else if (full.remision_status == 1)
                return `<i class='fa fa-check-circle fa-2x'></i><p>Entrado</p>`;
            else if (full.remision_status == 2)
                return `<i class='fa fa-check-circle fa-2x'></i><p>Relacionado</p>`;
            else if (full.remision_status == 3)
                return `<i class='fa fa-check-circle fa-2x'></i><p>Relacionado</p>`;
            else if (full.remision_status == 9)
                return `<i class='fa fa-check-circle fa-2x text-success'></i><p>Terminado</p>`;
        },
        targets: [25]
    }],
});
var detailRowsMainCreditNote = [];
$('#TableMainCreditNote tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tblMainCreditNote.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
    }
    else {
        if (tblMainCreditNote.row('.details').length) {
            $('.details-control', tblMainCreditNote.row('.details').node()).click();
        }
        row.child(FormatCommon(row.data())).show();
        tr.addClass('details');
    }
});

tblMainCreditNote.on('draw', function () {
    $.each(detailRowsMainCreditNote, function (i, id) {
        $('#' + id + ' td.details-control').trigger('click');
    });
});

function FormatCommon(d) {
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
                var number_random = Math.floor(Math.random() * 1000000);
                if (returndate.current_uuids != null) {
                    $.each(returndate.current_uuids, function (index, value) {
                        detailUUid += "<tr><td class='text-center'>" + value.Uuid + "</td><td class='text-center'>" + value.Supplier_name + "</td><td class='text-center'>" + ValidateSite(value.Folio) + "</td><td class='text-center'>" + ValidateSite(value.DocumentNo) + "</td><td class='text-center'>" + ValidateSite(value.SiteName) + "</td><td class='text-center'>" + ValidateStatus(value.Invoice_status_sat) + "</td><td class='text-center'>" + ValidateStatus(value.Invoice_xml) + "</td><td class='text-center'>" + formatmoney(value.ItemTotalAmount)(4) + "</td><td class='text-center'>" + ValidateDate(value.ProcessDate) + "</td><td class='text-center'>" + value.Available + "</td><td>" + ValidateReport(value.Uuid, value.Invoice_xml) + "</td></tr>"
                    });
                    tableHTML += '<p class="text-center"><code style="font-size: 20px;">Uuid relacionados</code></p><table id="tabledetail_' + number_random + '" class="table table-striped table-bordered table-hover" style="width:100%">' +
                        '<thead><tr><th>Uuid</th><th>Proveedor</th><th>Folio</th><th>Documento</th><th>Sucursal</th><th>Vigencia</th><th>XML</th><th>Total</th><th>Procesado</th><th>Estatus</th><th>Reporte</th></tr></thead><tbody>' + detailUUid + '</tbody></table> ';
                }
                if (returndate.current_products != null) {
                    $.each(returndate.current_products, function (index, value) {
                        detailItems += "<tr><td>" + value.item_no + "</td><td>" + value.item_description + "</td><td>" + value.quantity + "</td><td>" + formatmoney(value.unit_cost)(4) + "</td><td>" + formatmoney(value.iva_amount)(4) + "</td><td>" + formatmoney(value.ieps_amount)(4) + "</td><td>" + formatmoney(value.iva_retained)(4) + "</td><td>" + formatmoney(value.isr_retained)(4) + "</td><td>" + formatmoney(value.discount)(4) + "</td><td>" + formatmoney(value.item_amount)(4) + "</td></tr>"
                    });
                    tableHTML += '<p class="text-center"><code style="font-size: 20px;">Productos</code></p><table id="tabledetailtwo_' + number_random + '" class="table table-striped table-bordered table-hover" style="width:100%">' +
                        '<thead><tr><th>Codigo</th><th>Descripción</th><th>Cantidad</th><th>Costo Unitario</th><th>IVA</th><th>IEPS</th><th>IVA Ret.</th><th>ISR Ret.</th><th>Descuento</th><th>Total</th></tr></thead><tbody>' + detailItems + '</tbody></table>';
                }
                tabledetail.html(tableHTML).removeClass('loading');
                reloadStyleTableSimple(number_random);
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
        return `<button class="btn btn-xs btn-outline btn-info text-center" onclick="showPDF('` + data + `')"> <i class="fa fa-info-circle"></i> PDF Relacionado</button>`;
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

function reloadStyleTableSimple(number_random) {
    $(`#tabledetail_${number_random}`).DataTable({
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
    $(`#tabledetailtwo_${number_random}`).DataTable({
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


var tblLastComments = $('#TableLastComments').DataTable({
    autoWidth: true,
    responsive: true,
    searching: true,
    paging: true,
    ordering: false,
    info: true,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
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
            "defaultContent": "", visible: false
        },//0
        { data: 'PurchaseNo' },//1
        { data: 'Supplier_name' },//2
        { data: 'Invoice_date' },//3
        { data: 'Remision' },//4
        { data: 'Currency' },//5
        { data: 'ItemAmount', visible: false },//6
        { data: 'ItemIVA', visible: false },//7
        { data: 'ItemIEPS', visible: false },//8
        { data: 'ItemTotalAmount' },//9
        { data: 'ContadorDetalle', visible: false },//10
        { data: 'SiteCode', visible: false },//11
        { data: 'SiteName' },//12
        { data: null },//13
    ],
    columnDefs: [{
        targets: [0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
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
        type: 'numeric-comma',
        render: function (data, type, row) {
            return formatmoney(data)(4);
        },
        targets: [6, 7, 8, 9]
    },
    {
        render: function (data, type, full, meta) {
            return `Sin relacionar.`;
        },
        targets: [13]
    }],
});


var model = JSON.parse($("#model").val());
if (!$.isEmptyObject(model.mainCreditNote))
    ClearTable(tblMainCreditNote, model.mainCreditNote);
else
    ClearTable(tblMainCreditNote, []);
if (!$.isEmptyObject(model.lastComments))
    ClearTable(tblLastComments, model.lastComments);
else
    ClearTable(tblLastComments, []);

function ClearTable(myTable, information) {
    myTable.clear().draw();
    myTable.rows.add(information);
    myTable.columns.adjust().draw();
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


var tblAddendaMain = $('#TableAddendaMain').DataTable({
    autoWidth: true,
    responsive: true,
    searching: true,
    paging: true,
    ordering: false,
    info: true,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[30, 50, 100, 150, -1], [30, 50, 100, 150, "Todos"]],
    buttons: [
        {
            extend: 'copy', className: 'btn-sm', text: "Copiar"
        },
    ],
    columns: [
        { data: 't_rfc', visible: true },//0
        { data: 't_supplier_name', visible: true },//1
        { data: 't_date_start', visible: true },//2
        { data: 't_date_end', visible: true },//3
        { data: 't_insert_metadata', visible: true },//4
        { data: 't_d_service', visible: true },//5
        { data: 't_d_supplier', visible: true },//6
        { data: 't_addenda_flag', visible: true },//7
        { data: 't_addenda', visible: true },//8
        { data: 't_last_date', visible: true },//9
        { data: 't_buyer_name', visible: true },//10
        { data: 't_percent', visible: true }//11
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        width: "1%"
    },
    {
        targets: [0, 1, 4, 5, 6, 8, 10],
        render: function (data, type, full, meta) {
            return data.toString();
        },
    },
    {
        targets: [2, 3, 9],
        render: function (data, type, row) {
            return ValidateDate(data);
        },
    },
    {
        targets: [11],
        render: function (data, type, full, meta) {
            if (full.t_insert_metadata > 0) {
                return data + '%';
            } else {
                return '0%';
            }
        },
    }],
});

var tblAddendaNew = $('#TableAddendaNew').DataTable({
    autoWidth: true,
    responsive: true,
    searching: true,
    paging: true,
    ordering: false,
    info: true,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[30, 50, 100, 150, -1], [30, 50, 100, 150, "Todos"]],
    buttons: [
        {
            extend: 'copy', className: 'btn-sm', text: "Copiar"
        },
    ],
    columns: [
        { data: 't_rfc', visible: true },//0
        { data: 't_supplier_name', visible: true },//1
        { data: 't_remisiones', visible: true },//2
        { data: 't_d_supplier', visible: true },//3
        { data: 't_addenda', visible: true },//4
        { data: 't_remisiones_finish', visible: true },//5
        { data: 't_count_products', visible: true },//6
        { data: 't_percent', visible: true },//7
        { data: 't_buyer_name', visible: true }//8
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        width: "1%"
    },
    {
        targets: [2, 3, 4, 5, 6 ],
        render: function (data, type, full, meta) {
            return data.toString();
        },
    },
    {
        targets: [7],
        render: function (data, type, full, meta) {
            if (full.t_percent > 0) {
                return data + '%';
            } else {
                return '0%';
            }
        },
    }],
});