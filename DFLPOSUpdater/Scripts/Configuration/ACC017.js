const formatmoney = money => decimal => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", currencyDisplay: "symbol", maximumFractionDigits: decimal }).format(money);
var TableMainCFDIEmitidos = $('#TablMainCFDIEmitidos').DataTable({});
var TableMainCFDIEmitidosSimple = $('#TablMainCFDIEmitidosSimple').DataTable({});
var isFromCheck = false;
var totalRecords = 0;
var AllCheckIsActive = false;
var listCFDI = [];
var show_store_name = false;
var CHANGE_INPUT_WITH_SEARCH = true;

function ValidateDate(data) {
    var date = moment(data).format('DD/MM/YYYY');
    if (date != 'Invalid date')
        return date;
    else
        return "-";
}
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
    else if ("S01" == data)
        return data + " - Sin efectos fiscales";
    else if ("CP01" == data)
        return data + " - Pagos";
    else if ("CN01" == data)
        return data + " - Nómina";
    else
        return data;
}

function ChangeMyInput() { CHANGE_INPUT_WITH_SEARCH = true; }

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
    /*window.setTimeout(function () { $("#fa").click(); }, 1000);*/

    $("#TablMainCFDIEmitidosSimple").addClass('hide');
    window.setTimeout(function () {
        $("#fa").click();
        $(".hide-menu").click();
    }, 1000);
    $('#cbox_invoce_panamericano').iCheck({
        checkboxClass: 'icheckbox_square-green',
    }).on('ifClicked', function () {
        $(this).trigger("click");
    });
    $(".hide-menu").on("click", function () {
        window.setTimeout(function () {

            if ($(".ACC017").hasClass("hide-sidebar")) {
                $("#loaderContent").width($("#ContentDatatable").width() + 20)
            }
            else {
                $("#loaderContent").width($("#ContentDatatable").width() - 0)
            }
        }, 300);
    });
    SearchToolbox();
    $("#typeCurrency").select2();
    $("#typeStatus").select2();
    $("#typeSearch").select2();
    $("#typeCFDI").select2();
    $("#typeFormaPago").select2();
    $("#cbox_required_site_code").select2();
    $("#typeComprobante").select2();
    $("#typeIssuerReceiver").select2();
    SearchFunctionIssued(1, 0);
    OnChangeInvoiceType();
});

function CallLastUpdateMetadata() {
    var InvoiceType = $('#typeIssuerReceiver').val();
    var urlCtrl;

    if (InvoiceType == "emitidas") {
        urlCtrl = 'ActionGetLastUpdateMetadataIssued';
    } else {
        urlCtrl = 'ActionGetLastUpdateMetadata';
    }
    $.ajax({
        url: "/Accounting/" + urlCtrl,
        dataType: 'json',
        success: function (data) {
            $("#lastUpdateMetadata").text("Metadata: " + data.data);
        }
    });
}
function ReadyPV() {
    $("#typeCurrency").select2();
    $("#typeStatus").select2();
    $("#typeSearch").select2();
    $("#typeCFDI").select2();
    $("#typeFormaPago").select2();
    $("#cbox_required_site_code").select2();
    $("#typeComprobante").select2();
    $("#SuppliersDrop").select2({
        minimumInputLength: 3,
        allowClear: true,
        placeholder: "Seleccione un proveedor",
        initSelection: function (element, callback) {
            callback({ id: "0", text: "Seleccione un proveedor" });
        },
        ajax: {
            url: "/Supplier/ActionSearchSupplierVerificacionCFDI/",
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
}

$("#SuppliersDrop").select2({
    minimumInputLength: 3,
    allowClear: true,
    placeholder: "Seleccione un proveedor",
    initSelection: function (element, callback) {
        callback({ id: "0", text: "Seleccione un proveedor" });
    },
    ajax: {
        url: "/Supplier/ActionSearchSupplierVerificacionCFDI/",
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
var TableMainCFDI = $('#TablMainCFDI').DataTable({
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
    buttons: [{
        extend: 'csv', text: 'Excel', title: 'Metadata', className: 'btn-sm', exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,20],
            format: {
                body: function (data, column, row, node) {

                    if (column === 1) {
                        return data;
                    }
                    else if (column === 6 || column === 7)//tag P
                    {
                        if (data == "<i class='fa fa-check-circle fa-2x'></i>") {
                            return "1";
                        } else if (data == "<i class='fa fa-circle-thin fa-2x text-danger'></i>") {
                            return "0";
                        } else {
                            return data;
                        }
                    }
                    else {
                        return data;
                    }
                }
            }
        }
    }
    ],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        if (show_store_name) {
            if (aData.SiteName.length > 1) {
                $('td', nRow).addClass("success").addClass("BoldClass");
            }
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
        { data: 'Invoice_date_sat', visible: false },//4
        { data: 'Invoice_date_reception', visible: false },//5
        { data: 'Invoice_cancel_date', visible: false },//6
        { data: 'Invoice_status_sat' },//7
        { data: 'Invoice_xml' },//8
        { data: 'VersionXML' },//9
        { data: 'Serie' },//10
        { data: 'Folio' },//11
        { data: 'UsoCFDI' },//12
        { data: 'Currency' },//13
        { data: 'ItemAmount' },//14
        { data: 'ItemIVA' },//15
        { data: 'ItemIEPS' },//16
        { data: 'ItemDiscount' },//17
        { data: 'ItemISRRET' },//18
        { data: 'ItemIVARET' },//19
        { data: 'ItemTotalAmount' },//20
        { data: 'ContadorDetalle', visible: false },//21
        { data: 'ContadorRelacionados', visible: false },//22
        { data: 'SiteCode', visible: false },//23
        { data: 'SiteName', visible: show_store_name },//24
        { data: 'Available', visible: false },//25
        { data: null },//26
        { data: 'check_active' }//27
    ],
    columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
        width: "1%"
    },
    {
        targets: [3, 4, 5, 6],
        render: function (data, type, row) {
            return ValidateDate(data);
        },
    },
    {
        render: function (data, type, full, meta) {
            if (data)
                return `<i class='fa fa-check-circle fa-2x'></i>`;
            else
                return `<i class='fa fa-circle-thin fa-2x text-danger'></i>`;
        },
        targets: [7]
    },
    {
        render: function (data, type, full, meta) {
            if (data)
                return `<i class='fa fa-check-circle fa-2x'></i>`;
            else
                return `<i class='fa fa-circle-thin fa-2x text-danger'></i>`;
        },
        targets: [8]
    },
    {
        render: function (data, type, full, meta) {
            return UsoCFDIValidate(data);
        },
        targets: [12]
    },
    {
        type: 'numeric-comma',
        render: function (data, type, row) {
            return formatmoney(data)(4);
        },
        targets: [14, 15, 16, 17, 18, 19, 20]
    },
    {
        data: null,
        width: "1%",
        targets: 26,
        render: function (data, type, full, meta) {
            if (full.Uuid && full.Invoice_xml) {
                return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDF('` + full.Uuid + `')"> <i class="fa fa-info-circle"></i> PDF </button> <br/> <br/>
                                        <button class="btn btn-xs btn-outline btn-success" onclick="downloadXML('` + full.Uuid + `')"><i class="fa fa-download"></i> XML</button>`;
            } else {
                return `<p>No disponible</p>`;
            }
        },
    }, {
        ordering: false,
        targets: [27],
        render: function (data, type, full, meta) {
            if (full.Invoice_xml)
                return `<input type='checkbox' style='font-size: ${data ? '12' : '8'}px'  ${data ? 'checked' : ''}  onclick='SelectCheckCFDI(${meta.row}, ${data});' class='i-checks'>`;
            else
                return `<input type='checkbox' style='font-size: ${data ? '12' : '8'}px' disabled class='i-checks'>`;

        }
    },],
});
function SelectCheckCFDI(row, data) {
    if (data)
        TableMainCFDI.cell(row, 27).data(false).draw(false);
    else
        TableMainCFDI.cell(row, 27).data(true).draw(false);
    ValidatebtnXML();
}

function ValidatebtnXML() {
    if ((TableMainCFDI.data().toArray().length) == (TableMainCFDI.data().toArray().filter(f => f.check_active == true).length))
        $('#cbox_AllCheckCFDI').iCheck('check');
    else
        $('#cbox_AllCheckCFDI').iCheck('uncheck');
    if (TableMainCFDI.data().toArray().length > 0) {
        document.getElementById("btnDownloadXML").innerHTML = "<i class='fa fa-download'></i> Descargar XML (" + TableMainCFDI.data().toArray().filter(f => f.check_active == true).length + ")";
        document.getElementById("btnDownloadXML").disabled = false;
    } else {
        document.getElementById("btnDownloadXML").disabled = true;
        document.getElementById("btnDownloadXML").innerHTML = "<i class='fa fa-download'></i> Descargar XML";
    }
}

function AllCheckCFDI(type_loading) {
    StartLoading();
    $.each(TableMainCFDI.data().toArray(), function (index, value) {
        if ($('#cbox_AllCheckCFDI').is(':checked')) {
            if (value.Invoice_xml)
                value.check_active = true;
        } else {
            value.check_active = false;
        }
    });
    if (type_loading)
        EndLoading();
    ClearTable(TableMainCFDI, TableMainCFDI.data().toArray());
    if (TableMainCFDI.data().toArray().length > 0) {
        document.getElementById("btnDownloadXML").innerHTML = "<i class='fa fa-download'></i> Descargar XML (" + TableMainCFDI.data().toArray().filter(f => f.check_active == true).length + ")";
        document.getElementById("btnDownloadXML").disabled = false;
    } else {
        document.getElementById("btnDownloadXML").disabled = true;
        document.getElementById("btnDownloadXML").innerHTML = "<i class='fa fa-download'></i> Descargar XML";
    }
}

function DownloadZipXML(code_download) {
    var current_url = "/Accounting/ActionGetZipXMLNew/";
    if ($('#cbox_old_database').is(':checked')) {
        current_url = "/Accounting/ActionGetZipXML/";
    }
    var count_xml = TableMainCFDI.data().toArray().filter(f => f.check_active == true).map((value, i, array) => { return value.Uuid }).length;
    if (TableMainCFDI.data().toArray().filter(f => f.check_active == true).length > 0 || code_download != "") {
        if (TableMainCFDI.data().toArray().filter(f => f.check_active == true).length <= 50000 || code_download != "") {
            StartLoading();
            var list_cfdi = TableMainCFDI.data().toArray().filter(f => f.check_active == true).map((value, i, array) => { return value.Uuid });
            if (code_download == "") {

                if (!$('#cbox_xml_folder_sharing').is(':checked'))
                    document.getElementById("DivTextXML").innerText = "Espere hasta que se descarguen los " + count_xml + " XML";
                else {
                    toastr.success("Espere hasta que los XML se terminen de generar en la carpeta compartida.");
                    document.getElementById("DivTextXML").innerHTML = "Los " + count_xml + " XML en la CARPETA COMPARTIDA (<b>DiaDeHoy</b>)";
                }
            } else {
                document.getElementById("DivTextXML").innerText = "Espere hasta que se descarguen los XML pendientes...";
            }
            var str_exclude_invoice = "";
            if ($('#cbox_invoce_panamericano').is(':checked'))
                str_exclude_invoice = $("#txtInputPanamericano").val();

            $("#modalDownloadXML").modal("show");
            if ($('#cbox_AllCheckCFDI').is(':checked'))
                list_cfdi = "";
            if (!$('#cbox_xml_folder_sharing').is(':checked')) {
                var url = window.location.origin += current_url +"?list_cfdi=" + list_cfdi + "&is_all_request=" + $('#cbox_AllCheckCFDI').is(':checked') + "&current_rfc=" + $("#SuppliersDrop").val() +
                    "&start=" + $('#ValidDate1').val() + "&end=" + $('#ValidDate2').val() + "&currency=" + $("#typeCurrency").val() +
                    "&validity=" + $("#typeStatus").val() + "&typeVoucher=" + $("#typeComprobante").val() + "&searchingBy=" + $("#typeSearch").val() + "&usoCFDI=" + $("#typeCFDI").val() + "&split_folder=" + $('#cbox_xml_split_folder').is(':checked')
                    + "&sharing_folder=" + $('#cbox_xml_folder_sharing').is(':checked') + "&code_download=" + code_download + "&typeFormaPago=" + $("#typeFormaPago").val() +
                    "&validate_site_code=" + $("#cbox_required_site_code").val() + "&exclude_invoice=" + str_exclude_invoice; 
                window.location.href = url;
                EndLoading();
            } else {
                StartLoading();
                $.ajax({
                    url: current_url,
                    data: {
                        "list_cfdi": list_cfdi, "is_all_request": $('#cbox_AllCheckCFDI').is(':checked'), "current_rfc": $("#SuppliersDrop").val(), "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(),
                        "validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val(), "split_folder": $('#cbox_xml_split_folder').is(':checked'),
                        "sharing_folder": $('#cbox_xml_folder_sharing').is(':checked'), "code_download": code_download, "typeFormaPago": $("#typeFormaPago").val(), "validate_site_code": $("#cbox_required_site_code").val(), "exclude_invoice": str_exclude_invoice
                    },
                    type: "POST",
                    success: function (json) {
                        EndLoading();
                        if (json.success) {
                            if (json.data != "OK") {
                                toastr.error(json.data);
                                $('#modalDownloadXML').modal('toggle');
                            }
                        } else {
                            toastr.error("No se generó ningún XML.");
                            $('#modalDownloadXML').modal('toggle');
                        }
                    }
                });
            }
            $('#cbox_AllCheckCFDI').iCheck('uncheck');
            AllCheckCFDI(false);
        } else {
            toastr.warning("Solo se permiten descargar menos de 50,000. XML.");
        }
    } else {
        toastr.warning("Seleccione al menos un XML.");
    }
}

$('#TablMainCFDI').on('draw.dt', function () { //Imprimir los i-check del datatable
    PutClassICheckPV();
});
var detailRowsMainCreditNote = [];
$('#TablMainCFDI tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = TableMainCFDI.row(tr);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('details');
    }
    else {
        if (TableMainCFDI.row('.details').length) {
            $('.details-control', TableMainCFDI.row('.details').node()).click();
        }
        row.child(FormatCommon(row.data())).show();
        tr.addClass('details');
    }
});

TableMainCFDI.on('draw', function () {
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
function downloadXML(uuid) {
    StartLoading();
    $.ajax({
        url: "/AccountingPolicies/ActionDownloadXMLContpaq/",
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

function ClearTable(myTable, information) {
    myTable.clear().draw();
    myTable.rows.add(information);
    myTable.columns.adjust().draw(false);
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


function SearchFunction() {
    if ($('#ValidDate1').val() != "" || $('#ValidDate2').val() != "") {
        StartLoading();
        var current_url = "/Accounting/ActionGetAllMetadataReportNew";
        var current_url_charts = "/Accounting/ActionGetAllPanamericanoChartsNew";
        $('#cbox_AllCheckCFDI').iCheck('uncheck');
        var str_exclude_invoice = "";
        if ($('#cbox_invoce_panamericano').is(':checked'))
            str_exclude_invoice = $("#txtInputPanamericano").val();
        if ($('#cbox_old_database').is(':checked')) {
            current_url = "/Accounting/ActionGetAllMetadataReport";
            current_url_charts = "/Accounting/ActionGetAllPanamericanoCharts";
        }
        $.ajax({
            url: current_url,
            type: "GET",
            data: {
                "current_rfc": $("#SuppliersDrop").val(), "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(),
                "validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val(),
                "validate_site_code": $("#cbox_required_site_code").val(), "site_code": "", "typeFormaPago": $("#typeFormaPago").val(), "exclude_invoice": str_exclude_invoice
            },
            success: function (result) {
                if (result.success) {
                    if (!$.isEmptyObject(result.info_metadata)) {
                        ClearTable(TableMainCFDI, result.info_metadata);
                        if ("SPA810429PU2" == $("#SuppliersDrop").val())
                            $("#DivChartsInvoices").show();
                        else
                            $("#DivChartsInvoices").hide();
                        if ("SPA810429PU2" == $("#SuppliersDrop").val() && CHANGE_INPUT_WITH_SEARCH) {
                            $.ajax({
                                url: current_url_charts,
                                type: "GET",
                                data: {
                                    "current_rfc": $("#SuppliersDrop").val(), "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val(),
                                    "validity": $("#typeStatus").val(), "exclude_invoice": str_exclude_invoice
                                },
                                success: function (result) {
                                    CHANGE_INPUT_WITH_SEARCH = false;
                                    var my_labels = [];
                                    var dataset_total_invoices = [];
                                    var dataset_total_invoices_with_sites = [];
                                    if (result.info_metadata.length > 0) {
                                        result.info_metadata.forEach(function (value, index, array) {
                                            my_labels.push(value.ThisMonthStr);
                                            dataset_total_invoices.push(value.TotalInvoice);
                                            dataset_total_invoices_with_sites.push(value.SitesInvoice);
                                        });
                                        window.setTimeout(function () {
                                            var lineData = {
                                                labels: my_labels,
                                                datasets: [
                                                    {
                                                        label: "Example dataset",
                                                        fillColor: "rgba(220,220,220,0.5)",
                                                        strokeColor: "rgba(220,220,220,1)",
                                                        pointColor: "rgba(220,220,220,1)",
                                                        pointStrokeColor: "#fff",
                                                        pointHighlightFill: "#fff",
                                                        pointHighlightStroke: "rgba(220,220,220,1)",
                                                        data: dataset_total_invoices
                                                    },
                                                    {
                                                        label: "Example dataset",
                                                        fillColor: "rgba(98,203,49,0.5)",
                                                        strokeColor: "rgba(98,203,49,0.7)",
                                                        pointColor: "rgba(98,203,49,1)",
                                                        pointStrokeColor: "#fff",
                                                        pointHighlightFill: "#fff",
                                                        pointHighlightStroke: "rgba(26,179,148,1)",
                                                        data: dataset_total_invoices_with_sites
                                                    }
                                                ]
                                            };

                                            var lineOptions = {
                                                scaleShowGridLines: true,
                                                scaleGridLineColor: "rgba(0,0,0,.05)",
                                                scaleGridLineWidth: 1,
                                                bezierCurve: true,
                                                bezierCurveTension: 0.4,
                                                pointDot: true,
                                                pointDotRadius: 4,
                                                pointDotStrokeWidth: 1,
                                                pointHitDetectionRadius: 20,
                                                datasetStroke: true,
                                                datasetStrokeWidth: 1,
                                                datasetFill: true,
                                                responsive: true,
                                                maintainAspectRatio: true
                                            };

                                            var ctx = document.getElementById("lineOptions").getContext("2d");
                                            var myNewChart = new Chart(ctx).Line(lineData, lineOptions);


                                            var doughnutData = [
                                                {
                                                    value: result.info_metadata[(result.info_metadata.length-1)].InvoicesWithoutSites,
                                                    color: "#CFCFCF",
                                                    highlight: "#a9a9a9",
                                                    label: "Sin sucursal"
                                                },
                                                {
                                                    value: result.info_metadata[(result.info_metadata.length - 1)].SitesInvoice,
                                                    color: "#a3e186",
                                                    highlight: "#57b32c",
                                                    label: "Con sucursal"
                                                }
                                            ];

                                            var doughnutOptions = {
                                                segmentShowStroke: true,
                                                segmentStrokeColor: "#fff",
                                                segmentStrokeWidth: 2,
                                                percentageInnerCutout: 45, // This is 0 for Pie charts
                                                animationSteps: 100,
                                                animationEasing: "easeOutBounce",
                                                animateRotate: true,
                                                animateScale: false,
                                                responsive: true,
                                            };

                                            var ctx = document.getElementById("doughnutChart").getContext("2d");
                                            var myNewChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);

                                            $("#DivTxtThisSearch").html(`<i class="fa fa-clock-o"></i> Porcentaje de el rango de fechas seleccionado con un ${result.info_metadata[(result.info_metadata.length - 1)].PercentEfe.toString()} %:`);

                                            var supplier_rfc_container = $("#SuppliersDrop").select2('data').text.split('(');

                                            $("#DivSiteSupplierName").html(supplier_rfc_container[0]);
                                            if (str_exclude_invoice == "")
                                                $("#DivSiteContainerSerie").hide();
                                            else
                                                $("#DivSiteContainerSerie").show();
                                            $("#DivSiteSerie").html(str_exclude_invoice);
                                            $("#DivSiteTotalInvoice").html(result.info_metadata[(result.info_metadata.length - 1)].TotalInvoice);
                                            $("#DivSiteWithSite").html(result.info_metadata[(result.info_metadata.length - 1)].SitesInvoice);
                                            $("#DivSiteWithoutSite").html(result.info_metadata[(result.info_metadata.length - 1)].InvoicesWithoutSites);


                                            EndLoading();
                                        }, 800);
                                        
                                       

                                        $("#DivChartsInvoices").show();
                                    } else {
                                        $("#DivChartsInvoices").hide();
                                    }


                                },
                                error: function () {
                                    toastr.remove();
                                    toastr.error('Error inesperado contactar a sistemas.');
                                    EndLoading();
                                }
                            });


                        } else {
                            EndLoading();
                            EndLoading();
                            console.log("EndLoading()");
                        }
                    }
                    else {
                        ClearTable(TableMainCFDI, []);
                        EndLoading();
                    }
                    ValidatebtnXML();
                }
                else
                    SessionFalse("Se terminó su sesion.");
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


function SearchFunctionAdvancedExcel() {
    StartLoading();
    $('#cbox_AllCheckCFDI').iCheck('uncheck');
    var str_exclude_invoice = "";
    if ($('#cbox_invoce_panamericano').is(':checked'))
        str_exclude_invoice = $("#txtInputPanamericano").val();

    if ($("#SuppliersDrop").val() != "") {
        supplier_rfc_container = $("#SuppliersDrop").select2('data').text.split('(');
        supplier_rfc_container = supplier_rfc_container[0];
    } else {
        supplier_rfc_container = "TODOS";
    }

    var current_url = "/Accounting/ActionGetAllMetadataReceivedReportExcelNew";


    $.ajax({
        type: "POST",
        url: current_url,
        data: {
            "current_rfc": $("#SuppliersDrop").val(), "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(),
            "validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val(),
            "validate_site_code": $("#cbox_required_site_code").val(), "site_code": "", "typeFormaPago": $("#typeFormaPago").val(), "exclude_invoice": str_exclude_invoice,
            "all_dates": $('#cbox_show_dates').is(':checked')
        },
        success: function (report) {
            if (report != "SF") {
                var sampleArr = Base64ToArrayBuffer(report.data);
                var name = "";

                var start_date = new Date($('#ValidDate1').val());
                var end_date = new Date($('#ValidDate2').val());
                if (start_date == "Invalid Date" || end_date == "Invalid Date") {
                    var date = new Date();
                    start_date = new Date(date.getFullYear(), date.getMonth(), 1);
                    end_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                }
                var options_date = { year: 'numeric', month: 'long', day: 'numeric' };
                var str_date_start = start_date.toLocaleDateString("es-ES", options_date);
                var str_date_end = end_date.toLocaleDateString("es-ES", options_date);
                if ($("#SuppliersDrop").val() == "")
                    name = 'TODOS LOS PROV. - Facturas - Del ' + str_date_start + ' al ' + str_date_end + '.xlsx';
                else
                    name = supplier_rfc_container + ' - Facturas - Del ' + str_date_start + ' al ' + str_date_end + '.xlsx';

                SaveByteArray(name, sampleArr);
                EndLoading();
            } else {
                SessionFalse("Terminó su sesión.");
                EndLoading();
            }
        },
        error: function (returndates) {
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
            EndLoading();
        }
    });

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: current_url,
        data: {
            "current_rfc": $("#SuppliersDrop").val(), "start": $('#ValidDate1').val(), "end": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(),
            "validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val(),
            "validate_site_code": $("#cbox_required_site_code").val(), "site_code": "", "typeFormaPago": $("#typeFormaPago").val(), "exclude_invoice": str_exclude_invoice,
            "all_dates": $('#cbox_show_dates').is(':checked')
        },
        xhrFields: { responseType: 'blob' },
        success: function (data) {
            EndLoading();
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            var start_date = new Date($('#ValidDate1').val());
            var end_date = new Date($('#ValidDate2').val());
            if (start_date == "Invalid Date" || end_date == "Invalid Date") {
                var date = new Date();
                start_date = new Date(date.getFullYear(), date.getMonth(), 1);
                end_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            }
            var options_date = { year: 'numeric', month: 'long', day: 'numeric' };
            var str_date_start = start_date.toLocaleDateString("es-ES", options_date);
            var str_date_end = end_date.toLocaleDateString("es-ES", options_date);
            if ($("#SuppliersDrop").val() == "")
                link.setAttribute('download', 'TODOS LOS PROV. - Facturas - Del ' + str_date_start + ' al ' + str_date_end + '.xlsx');
            else
                link.setAttribute('download', supplier_rfc_container + ' - Facturas - Del ' + str_date_start + ' al ' + str_date_end + '.xlsx');
            document.body.appendChild(link);
            link.click();
        },
        error: function (req, status, error) {
            toastr.remove();
            toastr.error('Verifique su sesión.');
            EndLoading();
        }
    });
}


// Programacion para los XML Emitidos
function OnChangeInvoiceType() {
    var InvoiceType = $('#typeIssuerReceiver').val();
    $("#cbox_xml_split_folder").parent().css('margin-top','30%');
    StartLoading();
    if (InvoiceType !== "") {
        if (InvoiceType == "emitidas") {
            $("#SuppliersDropContainer").addClass('hidden');
            $("#idTituloGrid").text("Reporte de Facturas Emitidas");
            $("#TablMainCFDI").parent().addClass('hidden');
            $("#TablMainCFDIEmitidos").removeClass('hide');
            $("#Search").addClass('hidden');
            $("#SearchIssued").removeClass('hidden');
            $("#DivIssuedSimpleReport").removeClass('hidden');
            $("#NominaOption").removeClass('hidden');
            $("#NominaOption1").removeClass('hidden');
            $("#btnDownloadXML_Issued").removeClass('hidden');
            $("#btnDownloadXML").addClass('hidden');
            $("#btnSearchExcel").addClass('hidden');
            $("#btnDownloadExcel").removeClass('hidden');
            $("#btnDownloadCsv").removeClass('hidden');
            $("#DivContpaqExcel").addClass('hidden');
        }
        else {
            $("#SuppliersDropContainer").removeClass('hidden');
            $("#idTituloGrid").text("Reporte de Facturas Recibidas");
            $("#TablMainCFDI").parent().removeClass('hidden');
            $("#TablMainCFDIEmitidos").addClass('hide');
            $("#Search").removeClass('hidden');
            $("#SearchIssued").addClass('hidden');
            $("#DivIssuedSimpleReport").addClass('hidden');
            $("#NominaOption").addClass('hidden');
            $("#NominaOption1").addClass('hidden');
            $("#btnDownloadXML_Issued").addClass('hidden');
            $("#btnDownloadXML").removeClass('hidden');
            $("#btnSearchExcel").removeClass('hidden');
            $("#btnDownloadExcel").addClass('hidden');
            $("#btnDownloadCsv").addClass('hidden');
            $("#DivContpaqExcel").removeClass('hidden');
        }
        CallLastUpdateMetadata();
    }
    EndLoading();
}

//Muestra la Informacion del Listado Principal de los XML Emitidos desde el Lado del Servidor
function SearchFunctionIssued(fromMenu, fromButton) {
    if (fromMenu == 0) {
        if ($('#ValidDate1').val() == "" || $('#ValidDate2').val() == "") {
            toastr.warning("Seleccione un rango de fechas.");
            return;
        }
    }
    if (fromButton == 1) {
        $('#cbox_AllCheckCFDI_Issued').prop("checked", false);
        $('#cbox_AllCheckCFDI_Issued_Simple').prop("checked", false);
        $("#btnDownloadExcel").removeAttr("disabled");
        $("#btnDownloadCsv").removeAttr("disabled");
        document.getElementById("btnDownloadXML_Issued").disabled = true;
        document.getElementById("btnDownloadXML_Issued").innerHTML = "<i class='fa fa-download'></i> Descargar XML";
        listCFDI = [];
    }
    StartLoading();

    var current_url = "/Accounting/ActionGetAllMetadataIssuedReportNew";
    if ($('#cbox_old_database').is(':checked')) {
        current_url = "/Accounting/ActionGetAllMetadataIssuedReport";
    }

    if (!$('#cbox_issued_simple_report').is(':checked')) {
        //Datatable --> Side-Server 1
        $("#TablMainCFDIEmitidosSimple").addClass('hide');
        $("#TablMainCFDIEmitidos").removeClass('hide');
        var allSelected = $('#cbox_AllCheckCFDI_Issued').prop("checked");
        $('#TablMainCFDIEmitidos').DataTable().destroy();
        $('#TablMainCFDIEmitidosSimple').DataTable().destroy();
        TableMainCFDIEmitidos = $('#TablMainCFDIEmitidos').DataTable({
            processing: true,
            serverSide: true,
            bProcessing: true,
            ajax: {
                url: current_url,
                data: {
                    "current_rfc": $("#SuppliersDrop").val(), "startDate": $('#ValidDate1').val(), "endDate": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(),
                    "validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val(), "fromMenu": fromMenu, "allSelected": allSelected, "checkSimple": $('#cbox_issued_simple_report').is(':checked')
                },
                type: "POST",
                datatype: "json",
                beforeSend: function (before) {
                    console.log("beforeSend");
                    startDatatableLoader("TablMainCFDIEmitidos", "TableTab1");
                    if (isFromCheck) {
                        isFromCheck = false;
                        before.abort();
                        //console.log("Mision_Aborted");
                        endDatatableLoader("TablMainCFDIEmitidos");
                    }
                },
                dataSrc: function (json) {
                    console.log("dataSrc");
                    endDatatableLoader("TablMainCFDIEmitidos");
                    SearchToolbox();
                    if (json.success) {
                        totalRecords = json.recordsTotal;
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
                    return json.data;
                }
            },
            /*autoWidth: false,*/
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
                    visible: false
                },//0
                { data: 'cfdi_Version' }, //1
                { data: 'uuid', width: "12em" }, //2
                { data: 'status' }, //3
                { data: 'is_cancelable', visible: false }, //4
                { data: 'status_cancellation', visible: false }, //5
                { data: 'voucher_type' }, //6
                { data: 'year_Date' }, //7
                { data: 'month_Date' }, //8
                { data: 'day_Date' }, //9
                { data: 'issue_date' }, //10
                { data: 'stamped_date' }, //11
                { data: 'serie_folio' }, //12
                { data: 'serie' }, //13
                { data: 'folio' }, //14
                { data: 'expedition_place' }, //15
                { data: 'Confirmacion', visible: false }, //16
                { data: 'cfdi_relationated' }, //17
                { data: 'Way_to_pay' }, //18
                { data: 'method_of_payment' }, //19
                { data: 'payment_conditions' }, //20
                { data: 'exchange_currency' }, //21
                { data: 'currency' }, //22
                { data: 'subtotal' }, //23
                { data: 'discount' }, //24
                { data: 'base_IVA_rate_0' }, //25
                { data: 'base_IVA_exempt' }, //26
                { data: 'base_IVA_rate_16' }, //27
                { data: 'transferred_IVA_16' }, //28
                { data: 'base_IVA_rate_8' }, //29
                { data: 'transferred_IVA_8' }, //30
                { data: 'transferred_IEPS_rate' }, //31
                { data: 'transferred_IEPS_Cuota' }, //32
                { data: 'total_transferred_taxes' }, //33
                { data: 'total' }, //34
                { data: 'concepts' }, //35
                { data: 'export', visible: false }, //36
                { data: 'rfc_issuer' }, //37
                { data: 'name_issuer' }, //38
                { data: 'receiver_fiscal_address' }, //39
                { data: 'receiver_fiscal_regime' }, //40
                { data: 'use_cfdi_receiver' }, //41
                { data: 'zip_code_validation' }, //42
                { data: 'Invoice_xml', visible: false }, //43
                { data: null, "orderable": false, },//44
                { data: '0', "orderable": false }//45
            ],
            columnDefs: [{
                targets: [35],
                render: function (data, type, full, meta) {
                    var caracteres = data.length;

                    /*<abbr title="TEXTO EMERGENTE QUE SE MOSTRARÁ AL PASAR EL CURSOR">Texto a explicar</abbr>.*/
                    if (caracteres > 90) {
                        var newLength = data.substring(0, 90) + "...";
                        /*return newLength;*/
                        return `<abbr title="` + data + `">` + newLength + `</abbr>.`;
                    }
                    else {
                        return data;
                    }
                },
            },
            {
                targets: [10, 11],
                render: function (data, type, row) {
                    return ValidateDate(data);
                },
            },
            {
                render: function (data, type, full, meta) {
                    if (data) {
                        return `<i class='fa fa-check-circle fa-2x'></i>`;
                    }
                    else
                        return `<i class='fa fa-circle-thin fa-2x text-danger'></i>`;
                },
                targets: [3]
            },
            {
                render: function (data, type, full, meta) {
                    return `<i class='fa fa-check-circle fa-2x'></i>`;
                },
                targets: [43]
            },
            {
                render: function (data, type, full, meta) {
                    return UsoCFDIValidate(data);
                },
                targets: [41]
            },
            {
                type: 'numeric-comma',
                render: function (data, type, row) {
                    return formatmoney(data)(4);
                },
                targets: [21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]
            },
            {
                data: null,
                width: "1%",
                targets: 44,
                render: function (data, type, full, meta) {
                    if (full.voucher_type == "N" && full.uuid && full.Invoice_xml) {
                        return `<button class="btn btn-xs btn-outline btn-success" onclick="downloadXMLIssued('` + full.uuid + `')"><i class="fa fa-download"></i> XML</button>`;
                    }
                    else {
                        if (full.uuid && full.Invoice_xml) {
                            return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDFXMLIssued('` + full.uuid + `')"> <i class="fa fa-info-circle"></i> PDF </button> <br/> <br/>
                            <button class="btn btn-xs btn-outline btn-success" onclick="downloadXMLIssued('` + full.uuid + `')"><i class="fa fa-download"></i> XML</button>`;
                        } else {
                            return `<p>No disponible</p>`;
                        }
                    }
                },
            }, {
                ordering: false,
                targets: [45],
                render: function (data, type, full, meta) {
                    var folioFiscal = "\"" + full.uuid + "\"";

                    if (listCFDI.indexOf(full.uuid) !== -1)
                        data = true;
                    else
                        data = false;

                    if (full.Invoice_xml)
                        return `<input type='checkbox' style='font-size: ${data ? '12' : '8'}px'  ${data ? 'checked' : ''}  onclick='SelectCheckCFDI_Issued(${meta.row}, ${data}, ${folioFiscal});' class='i-checks'>`;
                    else
                        return `<input type='checkbox' style='font-size: ${data ? '12' : '8'}px' disabled class='i-checks'>`;
                }
            },],
        });
    } else {
        //Datatable --> Side-Server 1
        var allSelected = $('#cbox_AllCheckCFDI_Issued_Simple').prop("checked");

        $("#TablMainCFDIEmitidos").addClass('hide');
        $("#TablMainCFDIEmitidosSimple").removeClass('hide');
        $('#TablMainCFDIEmitidos').DataTable().destroy();
        $('#TablMainCFDIEmitidosSimple').DataTable().destroy();
        TableMainCFDIEmitidosSimple = $('#TablMainCFDIEmitidosSimple').DataTable({
            processing: true,
            serverSide: true,
            bProcessing: true,
            ajax: {
                url: current_url,
                data: {
                    "current_rfc": $("#SuppliersDrop").val(), "startDate": $('#ValidDate1').val(), "endDate": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(),
                    "validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val(), "fromMenu": fromMenu, "allSelected": allSelected, "checkSimple": $('#cbox_issued_simple_report').is(':checked')
                },
                type: "POST",
                datatype: "json",
                beforeSend: function (before) {
                    console.log("beforeSend");
                    startDatatableLoader("TablMainCFDIEmitidosSimple", "TableTab1");
                    if (isFromCheck) {
                        isFromCheck = false;
                        before.abort();
                        //console.log("Mision_Aborted");
                        endDatatableLoader("TablMainCFDIEmitidosSimple");
                    }
                },
                dataSrc: function (json) {
                    console.log("dataSrc");
                    endDatatableLoader("TablMainCFDIEmitidosSimple");
                    SearchToolbox();
                    if (json.success) {
                        totalRecords = json.recordsTotal;
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
                    return json.data;
                }
            },
            /*autoWidth: false,*/
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
                    visible: false
                },//0
                { data: 'cfdi_Version' }, //1
                { data: 'uuid', width: "12em" }, //2
                { data: 'status' }, //3
                { data: 'is_cancelable', visible: false }, //4
                { data: 'status_cancellation', visible: false }, //5
                { data: 'voucher_type' }, //6
                { data: 'year_Date' }, //7
                { data: 'month_Date' }, //8
                { data: 'day_Date' }, //9
                { data: 'issue_date' }, //10
                { data: 'stamped_date' }, //11
                { data: 'serie_folio' }, //12
                { data: 'serie' }, //13
                { data: 'folio' }, //14
                { data: 'expedition_place', visible: false }, //15
                { data: 'Confirmacion', visible: false }, //16
                { data: 'cfdi_relationated', visible: false }, //17
                { data: 'Way_to_pay' }, //18
                { data: 'method_of_payment' }, //19
                { data: 'payment_conditions', visible: false }, //20
                { data: 'exchange_currency', visible: false }, //21
                { data: 'currency' }, //22
                { data: 'subtotal', visible: false }, //23
                { data: 'discount', visible: false }, //24
                { data: 'base_IVA_rate_0', visible: false }, //25
                { data: 'base_IVA_exempt', visible: false }, //26
                { data: 'base_IVA_rate_16', visible: false }, //27
                { data: 'transferred_IVA_16', visible: false }, //28
                { data: 'base_IVA_rate_8', visible: false }, //29
                { data: 'transferred_IVA_8', visible: false }, //30
                { data: 'transferred_IEPS_rate', visible: false }, //31
                { data: 'transferred_IEPS_Cuota', visible: false }, //32
                { data: 'total_transferred_taxes', visible: false }, //33
                { data: 'total' }, //34
                { data: 'concepts', visible: false }, //35
                { data: 'export', visible: false }, //36
                { data: 'rfc_issuer', visible: false }, //37
                { data: 'name_issuer', visible: false }, //38
                { data: 'receiver_fiscal_address' }, //39
                { data: 'receiver_fiscal_regime' }, //40
                { data: 'use_cfdi_receiver' }, //41
                { data: 'zip_code_validation' }, //42
                { data: 'Invoice_xml', visible: false }, //43
                { data: null, "orderable": false, },//44
                { data: '0', "orderable": false }//45
            ],
            columnDefs: [{
                targets: [35],
                render: function (data, type, full, meta) {
                    var caracteres = data.length;

                    /*<abbr title="TEXTO EMERGENTE QUE SE MOSTRARÁ AL PASAR EL CURSOR">Texto a explicar</abbr>.*/
                    if (caracteres > 90) {
                        var newLength = data.substring(0, 90) + "...";
                        /*return newLength;*/
                        return `<abbr title="` + data + `">` + newLength + `</abbr>.`;
                    }
                    else {
                        return data;
                    }
                },
            },
            {
                targets: [10, 11],
                render: function (data, type, row) {
                    return ValidateDate(data);
                },
            },
            {
                render: function (data, type, full, meta) {
                    if (data) {
                        return `<i class='fa fa-check-circle fa-2x'></i>`;
                    }
                    else
                        return `<i class='fa fa-circle-thin fa-2x text-danger'></i>`;
                },
                targets: [3]
            },
            {
                render: function (data, type, full, meta) {
                    return `<i class='fa fa-check-circle fa-2x'></i>`;
                },
                targets: [43]
            },
            {
                render: function (data, type, full, meta) {
                    return UsoCFDIValidate(data);
                },
                targets: [41]
            },
            {
                type: 'numeric-comma',
                render: function (data, type, row) {
                    return formatmoney(data)(4);
                },
                targets: [21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]
            },
            {
                data: null,
                width: "1%",
                targets: 44,
                render: function (data, type, full, meta) {
                    if (full.voucher_type == "N" && full.uuid && full.Invoice_xml) {
                        return `<button class="btn btn-xs btn-outline btn-success" onclick="downloadXMLIssued('` + full.uuid + `')"><i class="fa fa-download"></i> XML</button>`;
                    }
                    else {
                        if (full.uuid && full.Invoice_xml) {
                            return `<button class="btn btn-xs btn-outline btn-info" onclick="showPDFXMLIssued('` + full.uuid + `')"> <i class="fa fa-info-circle"></i> PDF </button> <br/> <br/>
                            <button class="btn btn-xs btn-outline btn-success" onclick="downloadXMLIssued('` + full.uuid + `')"><i class="fa fa-download"></i> XML</button>`;
                        } else {
                            return `<p>No disponible</p>`;
                        }
                    }
                },
            }, {
                ordering: false,
                targets: [45],
                render: function (data, type, full, meta) {
                    var folioFiscal = "\"" + full.uuid + "\"";

                    if (listCFDI.indexOf(full.uuid) !== -1)
                        data = true;
                    else
                        data = false;

                    if (full.Invoice_xml)
                        return `<input type='checkbox' style='font-size: ${data ? '12' : '8'}px'  ${data ? 'checked' : ''}  onclick='SelectCheckCFDI_Issued(${meta.row}, ${data}, ${folioFiscal});' class='i-checks'>`;
                    else
                        return `<input type='checkbox' style='font-size: ${data ? '12' : '8'}px' disabled class='i-checks'>`;
                }
            },],
        });
    }
}


//Agrega Estilos a los Checks del Datatable
$('#TablMainCFDIEmitidos').on('draw.dt', function () { //Imprimir los i-check del datatable
    PutClassICheckPV();
});
$('#TablMainCFDIEmitidosSimple').on('draw.dt', function () { //Imprimir los i-check del datatable
    PutClassICheckPV();
});


//Funcion para Descargar 1 solo XML desde el boton del Datateble
function downloadXMLIssued(uuid) {
    StartLoading();
    $.ajax({
        url: "/Accounting/ActionDownloadXMLIssued/",
        data: { "uuid": uuid },
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

//Funcion para Mostrar el PDF desde el Boton del Datateble
function showPDFXMLIssued(uuid) {
    StartLoading();
    $.ajax({
        url: "/Accounting/ActionGetPurchaseXMLIssued",
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

//Funcion Para Seleccionar Registros tipo Check Individualmente.
function SelectCheckCFDI_Issued(row, data, uuid) {
    isFromCheck = true;

    if ($('#cbox_issued_simple_report').is(':checked')) {
        if (data) {
            listCFDI = listCFDI.filter((item) => item !== uuid);
            TableMainCFDIEmitidosSimpe.cell(row, 45).data(false).draw(false);
        }
        else {
            listCFDI.push(uuid);
            TableMainCFDIEmitidosSimple.cell(row, 45).data(true).draw(false);
        }
    } else {
        if (data) {
            listCFDI = listCFDI.filter((item) => item !== uuid);
            TableMainCFDIEmitidos.cell(row, 45).data(false).draw(false);
        }
        else {
            listCFDI.push(uuid);
            TableMainCFDIEmitidos.cell(row, 45).data(true).draw(false);
        }
    }

    PutClassICheckPV();
    ValidatebtnXMLIssued();
}

//Funcion para Cambiar nombre del boton y montrar numero de XML a descargar
function ValidatebtnXMLIssued() {
    var name_input_dinamic = "";
    if ("cbox_issued_simple_report") {
        name_input_dinamic = "#cbox_AllCheckCFDI_Issued_Simple";
    } else {
        name_input_dinamic = "#cbox_AllCheckCFDI_Issued";
    }

    if ((totalRecords) == (listCFDI.length))
        $(name_input_dinamic).iCheck('check');
    else
        $(name_input_dinamic).iCheck('uncheck');


    if (totalRecords > 0) {
        document.getElementById("btnDownloadXML_Issued").innerHTML = "<i class='fa fa-download'></i> Descargar XML(" + listCFDI.length + ")";
        document.getElementById("btnDownloadXML_Issued").disabled = false;
    } else {
        document.getElementById("btnDownloadXML_Issued").disabled = true;
        document.getElementById("btnDownloadXML_Issued").innerHTML = "<i class='fa fa-download'></i> Descargar XML";
    }
}

//Funcion para seleccionar todos o deseleccionar todos Side Server. --> [En Proceso]
function AllCheckCFDI_Issued() {
    var name_input_dinamic = "";
    if ("cbox_issued_simple_report") {
        name_input_dinamic = "#cbox_AllCheckCFDI_Issued_Simple";
    } else {
        name_input_dinamic = "#cbox_AllCheckCFDI_Issued";
    }
    $.ajax({
        url: "/Accounting/ActionGetAllMetadataIssuedCheck",
        type: "GET",
        data: {
            "current_rfc": $("#SuppliersDrop").val(), "startDate": $('#ValidDate1').val(), "endDate": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(),
            "validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val(), "fromMenu": 0, "allSelected": $(name_input_dinamic).prop("checked")
        },
        success: function (result) {
            var checkedAll = $(name_input_dinamic).is(':checked');
            if (checkedAll) {
                listCFDI = [];
                $.each(result.Json, function (index, value) {
                    listCFDI.push(value.Uuid);
                });
            }
            else {
                listCFDI = [];
            }
            if (listCFDI.length > 0) {
                totalRecords = totalRecords > 10000 ? 10000 : totalRecords;
                document.getElementById("btnDownloadXML_Issued").innerHTML = "<i class='fa fa-download'></i> Descargar XML(" + listCFDI.length + ")";
                document.getElementById("btnDownloadXML_Issued").disabled = false;
            } else {
                document.getElementById("btnDownloadXML_Issued").disabled = true;
                document.getElementById("btnDownloadXML_Issued").innerHTML = "<i class='fa fa-download'></i> Descargar XML";
            }
        },
        error: function () {
            toastr.remove();
            toastr.error('Error inesperado contactar a sistemas.');
            EndLoading();
        }
    });
    SearchFunctionIssued(0, 0);
}

//Funcion para Descargar los XML Emitidos
function DownloadZipXML_Issued() {
    var name_input_dinamic = "";
    if ("cbox_issued_simple_report") {
        name_input_dinamic = "#cbox_AllCheckCFDI_Issued_Simple";
    } else {
        name_input_dinamic = "#cbox_AllCheckCFDI_Issued";
    }
    var count_xml = listCFDI.length;
    if (listCFDI.length > 0) {
        if (listCFDI.length <= 50000) {
            StartLoading();
            document.getElementById("DivTextXML").innerText = "Espere hasta que se descarguen los " + count_xml + " XML";
            $("#modalDownloadXML").modal("show");
            if ($(name_input_dinamic).is(':checked'))
                listCFDI = "";
            var url = window.location.origin += "/Accounting/ActionGetZipXMLIssued/?list_cfdi=" + listCFDI + "&is_all_request=" + $(name_input_dinamic).is(':checked') + "&current_rfc=" + $("#SuppliersDrop").val() +
                "&start=" + $('#ValidDate1').val() + "&end=" + $('#ValidDate2').val() + "&currency=" + $("#typeCurrency").val() +
                "&validity=" + $("#typeStatus").val() + "&typeVoucher=" + $("#typeComprobante").val() + "&searchingBy=" + $("#typeSearch").val() + "&usoCFDI=" + $("#typeCFDI").val() + "&split_folder=" + $('#cbox_xml_split_folder').is(':checked');
            window.location.href = url;
            listCFDI = [];
            $(name_input_dinamic).prop("checked", false); //En Validacion parece Funcionar
            AllCheckCFDI_Issued();
            EndLoading();
        } else {
            toastr.warning("Solo se permiten descargar menos de 50,000 XML.");
        }
    } else {
        toastr.warning("Seleccione al menos un XML.");
    }
}

//Agrega loader datatable(Side Server)
function startDatatableLoader(idDatatable, contenedorDatatable) {
    $("#" + contenedorDatatable).append("<div class='col-lg-12' id='loaderContent'><div id='datatableLoader'></div></div>");
    $("#loaderContent").width($("#" + contenedorDatatable).width() + 12)
    $("#loaderContent").height($("#" + contenedorDatatable).height() + 42)
    $("#" + idDatatable).addClass("disabledDatatable");
    $("#" + idDatatable + "_paginate").addClass("disabledDatatable");
    $("[name='" + idDatatable + "_length']").prop('disabled', true);
    $("[aria-controls='" + idDatatable + "']").addClass("disabledDatatable");
    $(".paginate_button").addClass("disabled");
    /*addEfect(contenedorDatatable);*/
}

//Quita loader datatable(Side Server)
function endDatatableLoader(idDatatable) {
    $("#loaderContent").remove();
    $("#" + idDatatable).removeClass("disabledDatatable");
    $("#" + idDatatable + "_paginate").removeClass("disabledDatatable");
    $("#" + idDatatable + "_paginate .paginate_button").removeClass("disabled");
    //if ($($(".page-item.active").context.activeElement).data("dtIdx") == 1) {
    //    $("#" + idDatatable + "_paginate .previous").addClass("disabled");
    //}
    $("[name='" + idDatatable + "_length']").prop('disabled', false);
    $("[aria-controls='" + idDatatable + "']").removeClass("disabledDatatable");
}


function SearchToolbox() {
    $("#TablMainCFDIEmitidos_filter .input-sm").unbind();
    $("#TablMainCFDIEmitidos_filter .input-sm").keyup(function (e) {
        if (e.keyCode == 13) {
            TableMainCFDIEmitidos.search(this.value).draw();
        }
    });
}

function SearchToolbox() {
    $("#TablMainCFDIEmitidosSimple_filter .input-sm").unbind();
    $("#TablMainCFDIEmitidosSimple_filter .input-sm").keyup(function (e) {
        if (e.keyCode == 13) {
            TableMainCFDIEmitidosSimple.search(this.value).draw();
        }
    });
}

//Funcion para Exportar Reporte de Excel
function exportDataExcel() {
    StartLoading();
    var current_url = "/Accounting/ActionGetAllMetadataIssuedReportExcelNew";
    if ($('#cbox_old_database').is(':checked')) {
        current_url = "/Accounting/ActionGetAllMetadataIssuedReportExcel";
    }
    $.ajax({
        type: "POST",
        url: current_url,
        data: {
            "current_rfc": $("#SuppliersDrop").val(), "startDate": $('#ValidDate1').val(), "endDate": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(),"validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val()
        },
        success: function (report) {
            if (report != "SF") {
                var sampleArr = Base64ToArrayBuffer(report.data);
                var name = "Reporte Ingresos Mensuales[ " + moment().format('MM-DD-YY hh-mm-ss') + "].xlsx";
                SaveByteArray(name, sampleArr);
                EndLoading();
            } else {
                SessionFalse("Terminó su sesión.");
                EndLoading();
            }
        },
        error: function (returndates) {
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
            EndLoading();
        }
    });
}

//Funcion para Exportar Reporte de Excel
function exportDataCsv() {
    StartLoading();
    var current_url = "/Accounting/ActionGetAllMetadataIssuedReportCsvNew";
    if ($('#cbox_old_database').is(':checked')) {
        current_url = "/Accounting/ActionGetAllMetadataIssuedReportCsv";
    }
    $.ajax({
        type: "POST",
        url: current_url,
        data: {
            "current_rfc": $("#SuppliersDrop").val(), "startDate": $('#ValidDate1').val(), "endDate": $('#ValidDate2').val(), "currency": $("#typeCurrency").val(), "validity": $("#typeStatus").val(), "typeVoucher": $("#typeComprobante").val(), "searchingBy": $("#typeSearch").val(), "usoCFDI": $("#typeCFDI").val()
        },
        success: function (report) {
            if (report != "SF") {
                var sampleArr = Base64ToArrayBuffer(report.data);
                var name = "Reporte Ingresos Mensuales[ " + moment().format('MM-DD-YY hh-mm-ss') + "].csv";
                SaveByteArray(name, sampleArr);
                EndLoading();
            } else {
                SessionFalse("Terminó su sesión.");
                EndLoading();
            }
        },
        error: function (returndates) {
            toastr.error('Alerta - Error inesperado  contactar a sistemas.');
            EndLoading();
        }
    });
}


function Base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function SaveByteArray(reportName, byte) {
    var blob = new Blob([byte]);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([byte], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    var fileName = reportName;
    link.download = fileName;
    link.click();
}


function OnChangeSupplier() {
    if ($("#SuppliersDrop").val() == "SPA810429PU2") {
        show_store_name = true;
        TableMainCFDI.columns([24]).visible(true);
    }
    else {

        show_store_name = false;
        TableMainCFDI.columns([24]).visible(false);
    }
}

function GetZipByExcel() {
    var fileInput = document.getElementById('LoadExcelAndGetZip');
    if (fileInput.files.length == 0) {
        toastr.error("Seleccione un archivo de excel.");
    }
    else {
        var idxDot = fileInput.files[0].name.lastIndexOf(".") + 1;
        var extFile = fileInput.files[0].name.substr(idxDot, fileInput.files[0].name.length).toLowerCase();//Obtenemos extension de archivo
        if (extFile == "xlsx") {
            swal({
                title: "¿Esta seguro?",
                text: "Espere hasta que se busquen y descargue los XMLs pendientes.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar"
            },
                function (isConfirm) {
                    if (isConfirm) {
                        StartLoading();

                        var current_url = "/Accounting/ActionGetZipXMLByExcelNew";
                        if ($('#cbox_old_database').is(':checked')) {
                            current_url = "/Accounting/ActionGetZipXMLByExcel";
                        }
                        var selectedFile = ($("#LoadExcelAndGetZip"))[0].files[0];
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
                            if (selectedFile.size < 10485760)// Menor a 10MB (valor en BYTES)
                            {
                                var formdata = new FormData();
                                formdata.append(fileInput.files[0].name, fileInput.files[0]);
                                $.ajax({
                                    type: "POST",
                                    url: current_url,
                                    data: formdata,
                                    cache: false,
                                    dataType: 'json',
                                    processData: false,
                                    contentType: false,
                                    success: function (returnValue) {
                                        if (returnValue.response != "") {
                                            if (returnValue.response == "0") {
                                                toastr.success("Cuenta con TODOS los XMLs hasta al momento.");
                                            } else {
                                                DownloadZipXML(returnValue.response);
                                            }
                                        } else {
                                            toastr.error("Error al momento de leer el archivo Excel, compartalo a Sistemas.");
                                        }
                                        EndLoading();
                                    },
                                    error: function (retuValue) {
                                        EndLoading();
                                    }
                                });
                            }
                            else {
                                toastr.warning('El archivo debe ser menor a 10MB');
                            }
                        }
                    }
                });
        } else {
            toastr.warning('Solo se admiten archivos xlsx. Intentar con otro por favor.');
        }
    }
}

function ShowDatesInTable() {
    if (!$('#cbox_show_dates').is(':checked'))
        TableMainCFDI.columns([4, 5, 6]).visible(false);
    else
        TableMainCFDI.columns([4, 5, 6]).visible(true);
}
