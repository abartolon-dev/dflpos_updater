const formatmoney = money => decimal => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", currencyDisplay: "symbol", maximumFractionDigits: decimal }).format(money);

var projectTitle = "";
var projectItem = "";
var commentFiles = [];
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
        return "Desconocido";
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

$("#SuppliersDrop").select2({
    minimumInputLength: 3,
    allowClear: true,
    placeholder: "Seleccione un proveedor",
    initSelection: function (element, callback) {
        callback({ id: "0", text: "Seleccione un proveedor" });
    },
    ajax: {
        url: "/Supplier/ActionSearchSupplier/",
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
                url: "/Accounting/ActionGetCreditNotesReport",
                type: "GET",
                data: { "current_rfc": $("#SuppliersDrop").val(), "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val() },
                success: function (result) {
                    EndLoading();
                    if (result.success) {
                        if (!$.isEmptyObject(result.creditnotes))
                            ClearTable(tblMainCreditNote, result.creditnotes);
                        else
                            ClearTable(tblMainCreditNote, []);
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

var tblMainCreditNote = $('#TableMainCreditNote').DataTable({
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
            "defaultContent": "",
        },//0
        { data: 'Uuid' },//1
        { data: 'Supplier_name' },//2
        { data: 'Invoice_date' },//3
        { data: 'Invoice_status_sat' },//4
        { data: 'Invoice_xml' },//5
        { data: 'Serie' },//6
        { data: 'Folio' },//7
        { data: 'UsoCFDI', visible: false },//8
        { data: 'Currency' },//9
        { data: 'ItemAmount' },//10
        { data: 'ItemIVA' },//11
        { data: 'ItemIEPS' },//12
        { data: 'ItemDiscount' },//13
        { data: 'ItemISRRET' },//14
        { data: 'ItemIVARET' },//15
        { data: 'ItemTotalAmount' },//16
        { data: 'ContadorDetalle', visible: false },//17
        { data: 'ContadorRelacionados' },//18
        { data: 'SiteCode', visible: false },//19
        { data: 'SiteName' },//20
        { data: 'Available', visible: false },//21
        { data: null },//22
        { data: 'comments_count' },//23
        { data: null }//24
    ],
    columnDefs: [{
        targets: [0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
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
        targets: [10, 11, 12, 13, 14, 15, 16]
    },
    {
        data: null,
        width: "1%",
        targets: 22,
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
        data: null,
        width: "1%",
        targets: 24,
        render: function (data, type, full, meta) {
            if (full.Uuid) {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="GetAllComments('` + full.Uuid + `')"> <i class="fa fa-commenting"></i> Commentar </button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
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
        return `<button class="btn btn-xs btn-outline btn-info text-center" onclick="showPDF('` + data + `')"> <i class="fa fa-info-circle"></i> PDF Relacionado</button> <br/> <br/>
                                        <button class="btn btn-xs btn-outline btn-success" onclick="downloadXML('` + data + `')"><i class="fa fa-download"></i> XML Relacionado</button>`;
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
        columns: [
            {
                "class": "details-control2",
                "orderable": false,
                "data": null,
                "defaultContent": "",
                width: "1%"
            }
        ],
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
    ordering: true,
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
            "defaultContent": "",
        },//0
        { data: 'Uuid' },//1
        { data: 'Supplier_name' },//2
        { data: 'Invoice_date' },//3
        { data: 'Invoice_status_sat', visible: false },//4
        { data: 'Invoice_xml', visible: false },//5
        { data: 'Serie' },//6
        { data: 'Folio' },//7
        { data: 'UsoCFDI', visible: false },//8
        { data: 'Currency' },//9
        { data: 'ItemAmount', visible: false },//10
        { data: 'ItemIVA', visible: false },//11
        { data: 'ItemIEPS', visible: false },//12
        { data: 'ItemDiscount', visible: false },//13
        { data: 'ItemISRRET', visible: false },//14
        { data: 'ItemIVARET', visible: false },//15
        { data: 'ItemTotalAmount' },//16
        { data: 'ContadorDetalle', visible: false },//17
        { data: 'ContadorRelacionados' },//18
        { data: 'SiteCode', visible: false },//19
        { data: 'SiteName' },//20
        { data: 'Available', visible: false },//21
        { data: null },//22
        { data: 'comments_count' },//23
        { data: 'last_uuser' },//24
        { data: null }//25
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
        targets: [10, 11, 12, 13, 14, 15, 16]
    },
    {
        data: null,
        width: "1%",
        targets: 22,
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
        data: null,
        width: "1%",
        targets: 25,
        render: function (data, type, full, meta) {
            if (full.Uuid) {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="GetAllComments('` + full.Uuid + `')"> <i class="fa fa-commenting"></i> Commentar </button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
    }],
});
var detailRowsLastComments = [];
$('#TableLastComments tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tblLastComments.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
    }
    else {
        if (tblLastComments.row('.details').length) {
            $('.details-control', tblLastComments.row('.details').node()).click();
        }
        row.child(FormatCommon(row.data())).show();
        tr.addClass('details');
    }
});

tblLastComments.on('draw', function () {
    $.each(detailRowsLastComments, function (i, id) {
        $('#' + id + ' td.details-control').trigger('click');
    });
});


var tblMyComments = $('#TableMyComments').DataTable({
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
            "defaultContent": "",
        },//0
        { data: 'Uuid' },//1
        { data: 'Supplier_name' },//2
        { data: 'Invoice_date' },//3
        { data: 'Invoice_status_sat', visible: false },//4
        { data: 'Invoice_xml', visible: false },//5
        { data: 'Serie' },//6
        { data: 'Folio' },//7
        { data: 'UsoCFDI', visible: false },//8
        { data: 'Currency' },//9
        { data: 'ItemAmount', visible: false },//10
        { data: 'ItemIVA', visible: false },//11
        { data: 'ItemIEPS', visible: false },//12
        { data: 'ItemDiscount', visible: false },//13
        { data: 'ItemISRRET', visible: false },//14
        { data: 'ItemIVARET', visible: false },//15
        { data: 'ItemTotalAmount' },//16
        { data: 'ContadorDetalle', visible: false },//17
        { data: 'ContadorRelacionados' },//18
        { data: 'SiteCode', visible: false },//19
        { data: 'SiteName' },//20
        { data: 'Available', visible: false },//21
        { data: null },//22
        { data: 'comments_count' },//23
        { data: 'last_uuser' },//24
        { data: null }//25
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
        targets: [10, 11, 12, 13, 14, 15, 16]
    },
    {
        data: null,
        width: "1%",
        targets: 22,
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
        data: null,
        width: "1%",
        targets: 25,
        render: function (data, type, full, meta) {
            if (full.Uuid) {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="GetAllComments('` + full.Uuid + `')"> <i class="fa fa-commenting"></i> Commentar </button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
    }],
});
var detailRowsMyComments = [];
$('#TableMyComments tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tblMyComments.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
    }
    else {
        if (tblMyComments.row('.details').length) {
            $('.details-control', tblMyComments.row('.details').node()).click();
        }
        row.child(FormatCommon(row.data())).show();
        tr.addClass('details');
    }
});

tblMyComments.on('draw', function () {
    $.each(detailRowsMyComments, function (i, id) {
        $('#' + id + ' td.details-control').trigger('click');
    });
});


var tblCNDetail = $('#TableCreditNoteDetail').DataTable({
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
            "defaultContent": "",
        },//0
        { data: 'Uuid' },//1
        { data: 'Supplier_name' },//2
        { data: 'Invoice_date' },//3
        { data: 'Invoice_status_sat' },//4
        { data: 'Invoice_xml' },//5
        { data: 'Serie' },//6
        { data: 'Folio' },//7
        { data: 'UsoCFDI', visible: false },//8
        { data: 'Currency' },//9
        { data: 'ItemAmount' },//10
        { data: 'ItemIVA' },//11
        { data: 'ItemIEPS' },//12
        { data: 'ItemDiscount' },//13
        { data: 'ItemISRRET' },//14
        { data: 'ItemIVARET' },//15
        { data: 'ItemTotalAmount' },//16
        { data: 'ContadorDetalle', visible: false },//17
        { data: 'ContadorRelacionados' },//18
        { data: 'SiteCode', visible: false },//19
        { data: 'SiteName' },//20
        { data: 'Available', visible: false },//21
        { data: null },//22
        { data: 'comments_count', visible: false },//23
        { data: null, visible: false }//24
    ],
    columnDefs: [{
        targets: [0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
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
        targets: [10, 11, 12, 13, 14, 15, 16]
    },
    {
        data: null,
        width: "1%",
        targets: 22,
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
        data: null,
        width: "1%",
        targets: 24,
        render: function (data, type, full, meta) {
            if (full.Uuid) {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="GetAllComments('` + full.Uuid + `')"> <i class="fa fa-commenting"></i> Commentar </button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
    }],
});
var detailRowsCNDetail = [];
$('#TableCreditNoteDetail tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tblCNDetail.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
    }
    else {
        if (tblCNDetail.row('.details').length) {
            $('.details-control', tblCNDetail.row('.details').node()).click();
        }
        row.child(FormatCommon(row.data())).show();
        tr.addClass('details');
    }
});

tblCNDetail.on('draw', function () {
    $.each(detailRowsCNDetail, function (i, id) {
        $('#' + id + ' td.details-control').trigger('click');
    });
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
if (!$.isEmptyObject(model.myComments))
    ClearTable(tblMyComments, model.myComments);
else
    ClearTable(tblMyComments, []);
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

function ShowMain() {
    $('#DivSearch').removeClass("hide");
    $('#DivTables').removeClass("hide");
    $('#DivTables').animatePanel();
    $('#itemComments').addClass('hide');
    $('#DivComments').addClass('hide');
    $('#itemComments').animatePanel();
    $('#itemCommentsPagination').addClass('hide');
    $('#itemCommentsPagination').animatePanel();
    $('#itemAddComment').addClass("hide");
    $('#itemAddComment').animatePanel();
    $('#DivCreditNoteExtra').addClass('hide');
    $('#DivCreditNoteExtra ').animatePanel();
    $('#itemCommentsNull').addClass("hide");
    $('#itemCommentsNull').animatePanel();

    projectIdLabel = "";
    projectItemDesc = "";
    projectItem = "";
    varnameLabel = "";
    projectIdCategory = 0;
    ClearComment();
    projectLeader = "";
}

var table = $('#TableAttached').DataTable({
    "autoWidth": true,
    "paging": true,
    "ordering": false,
    "info": false,
    "searching": false,
    oLanguage: {
        "sProcessing": "Procesando...", "sLengthMenu": "Mostrar _MENU_ registros", "sZeroRecords": "No se encontraron resultados", "sEmptyTable": "Ningún dato disponible en esta tabla", "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros", "sInfoFiltered": "(filtrado de un total de _MAX_ registros)", "sInfoPostFix": "", "sSearch": "Buscar:", "sUrl": "", "sInfoThousands": ",", "sLoadingRecords": "Cargando...", "oPaginate": { "sFirst": "Primero", "sLast": "Último", "sNext": "Siguiente", "sPrevious": "Anterior" }, "oAria": { "sSortAscending": ": Activar para ordenar la columna de manera ascendente", "sSortDescending": ": Activar para ordenar la columna de manera descendente" }
    },
    lengthMenu: [[3], [3]],
    columns: [
        { targets: 0, data: 'file_name' },
        { targets: 1, data: 'file_type' },
        { targets: 2, data: 'file_base64' },
        { targets: 3, data: null }
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3],
        width: "1%"
    },
    {
        data: null,
        width: "1%",
        defaultContent: '<button class="btn btn-xs btn-danger" id="remove-button" ><i class="fa fa-times"></i></button> ',
        targets: [3]
    }]
});

//Ocultar el Ids
table.column(2).visible(false);
table.clear().draw();

function ClearComment() {
    $("#commentMain").val("");
    commentFiles = [];
    table.clear().draw();
    table.rows.add($(commentFiles));
    table.columns.adjust().draw();
}

//Eliminar archivo de la lista
$('#TableAttached tbody').on('click', '#remove-button', function () {
    var index = table.row($(this).parents('tr')).index();
    commentFiles.splice(index, 1);
    table.clear().draw();
    table.rows.add($(commentFiles));
    table.columns.adjust().draw();
});

function OpenModelPdf(id_history_detail) {
    StartLoading();
    $.ajax({
        type: "POST",
        url: "/Accounting/ActionGetAttachedPDFByHistory/",
        data: { "id_hitosry_detail": id_history_detail },
        success: function (response) {
            EndLoading();
            if (response == "SF") {
                SessionFalse("Su sesión a terminado.")
            } else {
                $("#modalReferenceBody").html(`<iframe width='100%' height='550px' src='${response}'></iframe>`);
                $("#modalReference").modal('show');
            }
        },
        error: function () {
            toastr.error("ERROR DESCONOCIDO, CONTACTA A SISTEMAS.");
            EndLoading();
        }
    });
}


function GetAllComments(uuid) {
    projectItem = uuid;
    var creditNoteCurrent = tblMainCreditNote.data().toArray().filter(f => f.Uuid == uuid);
    ClearTable(tblCNDetail, creditNoteCurrent);
    StartLoading();
    $.ajax({
        url: '/Accounting/ActionGetAllCommentsByUUID/',
        type: "GET",
        data: {
            "uuid": uuid
        },
        success: function (returndata) {
            if (returndata == "SF") {
                SessionFalse("Su sesión a terminado.")
            }
            if (returndata.item.length > 0) {
                //var leaderLabelUserName = returndata.labelInfo['description'];
                //var leaderLabelFullName = returndata.labelInfo['label_emp_no_user_name'];
                //varnameLabel = returndata.labelInfo['label_name'];
                //$('#labelDesc').html(returndata.labelInfo['label_name']);
                //$('#labelUserLeader').html(`<span class="text-muted font-bold" data-toggle="tooltip" data-placement="bottom" title="${leaderLabelFullName}"> ${isUser(leaderLabelUserName)}</span>`);
                //$('#labelEstimateCost').html(formatter.format(returndata.labelInfo['estimate']));
                //$('#labelTotalCost').html(formatter.format(returndata.labelInfo['total_cost']));

                //projectItemDesc = returndata.item[0]['item_description']
                //varprojectIdLabel = returndata.item[0]['id_label']
                //projectItem = 1;
                //$('#itemDesc').html('<i class="pe-7s-ribbon"></i> ' + returndata.item[0]['item_description']);
                //$('#itemStartDate').html(IsDate(returndata.item[0]['start_date']));
                //$('#itemEndDate').html(IsDate(returndata.item[0]['end_date']));
                //$('#itemRealStartDate').html(IsDate(returndata.item[0]['real_start_date']));
                //$('#itemRealEndDate').html(IsDate(returndata.item[0]['real_end_date']));
                //$('#itemEstimateCost').html(formatter.format(returndata.item[0]['estimate']));
                //$('#itemTotalCost').html(formatter.format(returndata.item[0]['total_cost']));
                //var status = returndata.item[0]['item_status'];
                //if (status == 1) {
                //    $('#projectItemLabel').removeClass("label-warning");
                //    $('#projectItemLabel').removeClass("label-danger");
                //    $('#projectItemLabel').removeClass("label-success");
                //    $('#projectItemLabel').html('Iniciado');
                //    $('#projectItemLabel').addClass("label-info");
                //    $('#itemStatus').html('Iniciado');
                //}
                //else if (status == 2) {
                //    $('#projectItemLabel').removeClass("label-danger");
                //    $('#projectItemLabel').removeClass("label-info");
                //    $('#projectItemLabel').removeClass("label-success");
                //    $('#projectItemLabel').html('En proceso');
                //    $('#projectItemLabel').addClass("label-warning");
                //    $('#itemStatus').html('En proceso');
                //}
                //else if (status == 8) {
                //    $('#projectItemLabel').removeClass("label-warning");
                //    $('#projectItemLabel').removeClass("label-info");
                //    $('#projectItemLabel').removeClass("label-success");
                //    $('#projectItemLabel').html('Cancelado');
                //    $('#projectItemLabel').addClass("label-danger");
                //    $('#itemStatus').html('Cancelado');
                //}
                //else if (status == 9) {
                //    $('#projectItemLabel').removeClass("label-info");
                //    $('#projectItemLabel').removeClass("label-warning");
                //    $('#projectItemLabel').removeClass("label-danger");
                //    $('#projectItemLabel').removeClass("label-success");
                //    $('#projectItemLabel').html('Terminado');
                //    $('#projectItemLabel').addClass("label-success");
                //    $('#itemStatus').html('Terminado');
                //}
                //else {
                //    $('#projectItemLabel').removeClass("label-warning");
                //    $('#projectItemLabel').removeClass("label-info");
                //    $('#projectItemLabel').removeClass("label-success");
                //    $('#projectItemLabel').html('ERROR');
                //    $('#projectItemLabel').addClass("label-danger");
                //    $('#itemStatus').html('ERROR');
                //}

                $('#pagination-container-label-detail').pagination({
                    dataSource: returndata.item,
                    pageSize: 10,
                    className: 'paginationjs-theme-blue',
                    callback: function (returndata, pagination) {
                        var html = ForumTemplateDetail(returndata);
                        if (html.length <= 0) {
                            $('#itemComments').addClass('hide');
                            $('#itemComments').animatePanel();
                            $('#itemCommentsPagination').addClass('hide');
                            $('#itemCommentsPagination').animatePanel();

                            $('#itemCommentsNull').removeClass("hide");
                            $('#itemCommentsNull').animatePanel();
                        }
                        else {
                            $('#itemComments').removeClass('hide');
                            $('#itemComments').animatePanel();
                            $('#itemCommentsPagination').removeClass('hide');
                            $('#itemCommentsPagination').animatePanel();
                            $('#itemCommentsNull').addClass("hide");
                            $('#itemCommentsNull').animatePanel();
                        }

                        $('#data-label-detail').html(html);
                    }
                });

                console.log("Todo000");
                $('#DivSearch').addClass('hide');
                $('#DivTables').addClass('hide');
                $('#DivComments').removeClass('hide');
                $('#projectItemDescription').removeClass('hide');
                $('#projectItemDescription').animatePanel();
                $('#itemAddComment').removeClass('hide');
                $('#itemAddComment').animatePanel();
                //$('#DivCreditNoteExtra').removeClass('hide');
                //$('#DivCreditNoteExtra ').animatePanel();

            } else {
                //$('#DivCreditNoteExtra').removeClass('hide');
                //$('#DivCreditNoteExtra ').animatePanel();
                $('#DivSearch').addClass('hide');
                $('#DivTables').addClass('hide');
                $('#DivComments').removeClass('hide');
                $('#projectItemDescription').removeClass('hide');
                $('#projectItemDescription').animatePanel();
                $('#itemAddComment').removeClass('hide');
                $('#itemAddComment').animatePanel();
                $('#itemCommentsNull').removeClass("hide");
                $('#itemCommentsNull').animatePanel();

            }
            EndLoading();
        },
        error: function () {
            toastr.error('Error inesperado contactar a sistemas.');
            EndLoading();
        }
    });
}



function ForumTemplateDetail(data) {
    var totalItemTempleateHtml = [];
    var dataItems = [];
    var template = "";
    $('#itemProyectTitle').html(projectTitle);
    $('#itemProyectTitle2').html(projectTitle);
    $.each(data, function (index, value) {
        template = "";
        dataItems = [];
        dataItems = value.table_attached;
        if (value.user_comment != null) {
            template += `        <div class="panel-body">
                                                                <div class="media">
                                                                    <div class="media-image pull-left">
                                                                        <img src="${IsImage(value.ImageBase64)}" alt="profile-picture">
                                                                        <div class="author-info">
                                                                            <strong data-toggle="tooltip" data-placement="bottom" title="${value.user_full_name}"><i class="fa fa-user"></i> ${value.user_name}</strong><br>
                                                                            <div class="text-info" data-toggle="tooltip" data-placement="bottom" title="${IsDateFull(value.post_date)}"><i class="fa fa-calendar"></i> ${IsDate(value.post_date)}</div>
                                                                         </div>
                                                                     </div>
                                                                     <div class="media-body">
                                                                        ${value.user_comment}
                                                                     </div>`;
            if (dataItems.length > 0) {
                template += `<div class="pull-left" style='margin-top:30px;'><code>Archivos Adjuntos:</code><br /><br />  `;
                $.each(dataItems, function (index, valueAttached) {
                    template += `${isPDF(valueAttached.document_pdf, valueAttached.id_history_detail)}
                                                             ${isImage(valueAttached.document_image)}`;
                });
                template += `</div>`;
            }
            template += `             </div>
                                                              </div>`;

            if (index == data.length - 1) {
                $('#dateLastUpdateOne').html(IsDateFull(data[0].post_date));
                $('#dateLastUpdateTwo').html(IsDateFull(data[0].post_date));
            }
            totalItemTempleateHtml.push(template);
        }

    });

    return totalItemTempleateHtml;
}

function UpdateSourceImage() {
    if (commentFiles.length < 10) {
        //Read File
        var selectedFile = document.getElementById("file_source_image").files;
        //Check File is not Empty
        if (selectedFile.length > 0) {
            var idxDot = selectedFile[0].name.lastIndexOf(".") + 1;
            var extFile = selectedFile[0].name.substr(idxDot, selectedFile[0].name.length).toLowerCase();
            //check type file
            if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "gif") {
                //Check file
                if (selectedFile[0].size < 10085760) {
                    //check same file
                    if (!commentFiles.find(f => f.file_name === selectedFile[0].name)) {
                        // Select the very first file from list
                        var fileToLoad = selectedFile[0];
                        // FileReader function for read the file.
                        var fileReader = new FileReader();
                        var base64;
                        // Onload of file read the file content
                        fileReader.onload = function (fileLoadedEvent) {
                            base64 = fileLoadedEvent.target.result;
                            var fileTable =
                            {
                                file_name: selectedFile[0].name,
                                file_type: "Imagen",
                                file_base64: base64
                            };
                            commentFiles.push(fileTable);
                            document.getElementById("file_source_image").value = "";
                            table.clear().draw();
                            table.rows.add($(commentFiles));
                            table.columns.adjust().draw();
                        };
                        fileReader.readAsDataURL(fileToLoad);
                    } else {
                        toastr.error("No se puede subir el mismo archivo dos veces.");
                    }
                } else {
                    toastr.error("El peso del archivo debe ser menor a 10MB. Intente reducir el peso del archivo con un software.");
                }
            } else {
                toastr.error("Seleccione un archivo de fotografia correcto: jpg, jpeg, png, gif.");
            }
        } else {
            toastr.error("Seleccione un archivo de imagen correctamente.");
        }
    } else {
        toastr.error("Solo se permiten 10 archivos por comentario.");
    }
}

function UpdateSourcePdf() {
    if (commentFiles.length < 10) {
        //Read File
        var selectedFile = document.getElementById("file_source_pdf").files;
        //Check File is not Empty
        if (selectedFile.length > 0) {
            var idxDot = selectedFile[0].name.lastIndexOf(".") + 1;
            var extFile = selectedFile[0].name.substr(idxDot, selectedFile[0].name.length).toLowerCase();
            //check type file
            if (extFile == "pdf") {
                //Check size
                if (selectedFile[0].size < 5242880/*10085760*/) {
                    if (!commentFiles.find(f => f.file_name === selectedFile[0].name)) {
                        // Select the very first file from list
                        var fileToLoad = selectedFile[0];
                        // FileReader function for read the file.
                        var fileReader = new FileReader();
                        var base64;
                        // Onload of file read the file content
                        fileReader.onload = function (fileLoadedEvent) {
                            base64 = fileLoadedEvent.target.result;
                            var fileTable =
                            {
                                file_name: selectedFile[0].name,
                                file_type: "PDF",
                                file_base64: base64
                            };
                            commentFiles.push(fileTable);
                            document.getElementById("file_source_pdf").value = "";
                            table.clear().draw();
                            table.rows.add($(commentFiles));
                            table.columns.adjust().draw();
                        };
                        fileReader.readAsDataURL(fileToLoad);
                    } else {
                        toastr.error("No se puede subir el mismo archivo dos veces.");
                    }
                } else {
                    toastr.error("El peso del archivo debe ser menor a 5MB.");
                }
            } else {
                toastr.error("Seleccione solo archivos PDF.");
            }
        } else {
            toastr.error("Ingrese un archivo pdf correctamente.");
        }
    } else {
        toastr.error("Solo se permiten 10 archivos por comentario.");
    }
}


function OpenModalImage(element) {
    var modal = document.getElementById("myModalImage");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = element.src;
    var span = document.getElementsByClassName("close-image")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }
}

$('#commentSend').on('click', function () {
    console.log(projectItem);
    console.log("projectItem");
    var comment = $("#commentMain").val();
    if (comment.trim().length <= 8) {
        toastr.error("Ingresa un comentario con más de ocho caracteres.");
        $("#commentMain").focus();
    }
    else {
        swal({
            title: "¿Esta seguro que desea enviar el mensaje?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }, function (isConfirm) {
            if (isConfirm) {
                StartLoading();
                $.ajax({
                    type: "POST",
                    url: "/Accounting/ActionInsertCommentCreditNote/",
                    data: { "uuid_Current": projectItem, "comment": comment.trim(), "attached": commentFiles },
                    success: function (response) {
                        EndLoading();
                        if (response == "SF") {
                            setTimeout(function () { SessionFalse("Su sesión a terminado."); }, 600);
                        }
                        if (response.status == true) {
                            ClearComment();
                            toastr.success("Mensaje enviado.");
                            GetAllComments(projectItem);
                        }
                    },
                    error: function () {
                        EndLoading();
                        toastr.error("ERROR DESCONOCIDO, CONTACTA A SISTEMAS.");
                    }
                });
            }
        });
    }
});