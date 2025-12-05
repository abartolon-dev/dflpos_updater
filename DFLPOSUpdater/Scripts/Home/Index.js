/* Plan (pseudocódigo detallado):
1. Leer el JSON desde el elemento #model.
2. Mapear cada elemento a un objeto con propiedades: SiteCode, SiteName, Message, CreatedDate, Estate.
3. Calcular totalSites como la longitud del array resultante.
4. Calcular successCount usando filter para seleccionar solo los elementos cuyo Estate === 'success' y obtener su longitud.
   - No usar map para contar (map devuelve un array con booleanos, su .length será siempre totalSites).
5. Mostrar en el div 'div_quantity_success' el texto "Instalada en {successCount} de {totalSites} sucursales."
6. Actualizar la tabla DataTable con los datos de currentVersion.
7. Mantener logs mínimos para depuración.
*/

var currentVersion = [];
$(document).ready(function () {
    $("#divIndex").focus();
    window.setTimeout(function () {
        $("#fa").click();
    }, 5000);

    const originalData = JSON.parse($("#model").val());
    console.log(originalData);
    currentVersion = originalData.map(item => ({
        SiteCode: item.Site.Id,
        SiteName: item.Site.Name,
        Message: item.Message,
        CreatedDate: item.CreatedDate,
        Estate: item.Estate
    }));

    const totalSites = currentVersion.length;
    const successCount = currentVersion.filter(m => m.Estate === "success").length;

    console.log("Total sucursales:", totalSites);
    console.log("Instaladas (success):", successCount);
    document.getElementById("div_quantity_success").innerHTML = `Instalada en ${successCount} de ${totalSites} sucursales.`;

    table.clear();
    table.rows.add(currentVersion);
    table.columns.adjust().draw();
});

var table = $('#table_current_distribution').DataTable({
    oLanguage: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
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
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    },
    dom: "<'row'<'col-sm-4'l><'col-sm-4 text-left'B><'col-sm-4'f>t<'col-sm-6'i><'col-sm-6'p>>",
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    buttons: [],
    columns: [
        { data: 'SiteCode', title: 'Codigo Sucursal', visible: false },
        { data: 'SiteName', title: 'Sucursal' },
        { data: 'Message', title: 'Mensaje' },
        { data: 'CreatedDate', title: 'Fecha de Creación' },
        {
            data: 'Estate',
            title: 'Estado',
            render: function (data, type, row) {
                if (data === 'success') {
                    return '<i class="fa fa-check text-success"></i>'
                } else if (data === 'danger') {
                    return '<i class="fa fa-exclamation-triangle text-danger"></i>'
                } else if (data === 'earring') {
                    return '<i class="fa fa-clock-o"></i>'
                }
                return data;
            }
        },
    ],
    order: [[0, 'asc']],
    columnDefs: [
        {
            targets: 3,
            render: function (data, type, full, row) {
                if (!data) return "";
                var m = moment(data);
                if (m.isValid() && full.Estate != "earring") {
                    return m.format('DD/MM/YYYY HH:mm:ss');
                }
                return "";
            }
        }
    ]
});
