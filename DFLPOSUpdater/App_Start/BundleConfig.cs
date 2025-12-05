using System.Collections.Generic;
using System.Web;
using System.Web.Optimization;

namespace DFLPOSUpdater
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        //public static void RegisterBundles(BundleCollection bundles)
        //{
        //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
        //            "~/Scripts/jquery-{version}.js"));

        //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
        //            "~/Scripts/jquery.validate*"));

        //// Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información sobre los formularios.  De esta manera estará
        //// para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
        //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
        //            "~/Scripts/modernizr-*"));

        //bundles.Add(new Bundle("~/bundles/bootstrap").Include(
        //          "~/Scripts/bootstrap.js"));

        //bundles.Add(new StyleBundle("~/Content/css").Include(
        //          "~/Content/bootstrap.css",
        //          "~/Content/site.css"));
        //}
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;

            // Homer style
            bundles.Add(new StyleBundle("~/bundles/homer/css")
                .Include("~/Content/style.css", new CssRewriteUrlTransform())
                .Include("~/styles/simple_check.css"));

            // Animate.css
            bundles.Add(new StyleBundle("~/bundles/animate/css").Include(
                      "~/Vendor/animate.css/animate.min.css",
                      "~/vendor/toastr/build/toastr.min.css",
                       "~/fonts/pe-icon-7-stroke/css/helper.css",
                       "~/styles/static_custom.css",
                      "~/Vendor/sweetalert/lib/sweet-alert.css"));

            // fullcalendar style
            bundles.Add(new StyleBundle("~/bundles/fullcalendar/css").Include("~/Vendor/fullcalendar/dist/fullcalendar.min.css", new CssRewriteUrlTransform()));

            // fullcalendar style
            bundles.Add(new StyleBundle("~/bundles/fullcalendar-media/css").Include("~/Vendor/fullcalendar/dist/fullcalendar.print.css", new CssRewriteUrlTransform()));

            // metisMenu style
            bundles.Add(new StyleBundle("~/bundles/metisMenu/css").Include("~/Vendor/metisMenu/dist/metisMenu.css", new CssRewriteUrlTransform()));

            // style
            bundles.Add(new StyleBundle("~/bundles/style/css").Include("~/styles/style.css", new CssRewriteUrlTransform()));


            // style
            bundles.Add(new StyleBundle("~/bundles/Generic_Methods_SiteList/css").Include("~/styles/Generic_Methods_SiteList.css", new CssRewriteUrlTransform()));

            // bootstrap-tour style
            bundles.Add(new StyleBundle("~/bundles/bootstrap-tour/css").Include("~/Vendor/bootstrap-tour/build/css/bootstrap-tour.min.css", new CssRewriteUrlTransform()));

            // Datepicker style
            bundles.Add(new StyleBundle("~/bundles/datepicker/css").Include("~/Vendor/bootstrap-datepicker-master/dist/css/bootstrap-datepicker3.min.css", new CssRewriteUrlTransform()));

            // Pe-icon-7-stroke
            bundles.Add(new StyleBundle("~/bundles/peicon7stroke/css").Include("~/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css", new CssRewriteUrlTransform()));

            // Font Awesome icons style
            bundles.Add(new StyleBundle("~/bundles/font-awesome/css").Include("~/Vendor/fontawesome/css/font-awesome.min.css", new CssRewriteUrlTransform()));

            // Bootstrap style
            bundles.Add(new StyleBundle("~/bundles/bootstrap/css").Include("~/Vendor/bootstrap/dist/css/bootstrap.min.css", new CssRewriteUrlTransform()));

            // Datatables style
            bundles.Add(new StyleBundle("~/bundles/datatables/css").Include("~/Vendor/datatables.net-bs/css/dataTables.bootstrap.min.css"));

            // table editable style
            bundles.Add(new StyleBundle("~/bundles/edit/css").Include("~/Vendor/xeditable/bootstrap3-editable/css/bootstrap-editable.css"));

            // touchspin style
            bundles.Add(new StyleBundle("~/bundles/touchspin/css").Include("~/Vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css"));

            // pagination style
            bundles.Add(new StyleBundle("~/bundles/pagination/css").Include("~/styles/pagination.css"));

            // cards style
            bundles.Add(new StyleBundle("~/bundles/cards/css").Include("~/styles/Cards.css"));

            // Calculator Style
            bundles.Add(new StyleBundle("~/bundles/calculator/css").Include("~/styles/Calculator.css", new CssRewriteUrlTransform()));

            // Select 2 style
            var bundle = new Bundle("~/bundles/select2/css")
            {
                Orderer = new AsIsBundleOrderer()
            };
            bundle.Include("~/Vendor/select2-3.5.2/select2.css", new CssRewriteUrlTransform())
                .Include("~/Vendor/select2-bootstrap/select2-bootstrap.css", new CssRewriteUrlTransform());
            bundles.Add(bundle);

            // simple_toggle
            bundles.Add(new StyleBundle("~/bundles/simple_toggle/css").Include("~/styles/simple_toggle.css"));
            // iCheck_color
            bundles.Add(new StyleBundle("~/bundles/icheck_colors/css").Include("~/Vendor/iCheck/skins/all.css", new CssRewriteUrlTransform()));
            // iCheck_color script 
            bundles.Add(new ScriptBundle("~/bundles/icheck_colors/js").Include("~/Vendor/iCheck/icheck.js"));
            // Homer script
            bundles.Add(new ScriptBundle("~/bundles/homer/js").Include(
                      "~/Vendor/metisMenu/dist/metisMenu.min.js",
                      "~/Vendor/iCheck/icheck.min.js",
                      "~/Vendor/peity/jquery.peity.min.js",
                      "~/Vendor/sparkline/index.js",
                      "~/Scripts/homer.js",
                      "~/Scripts/charts.js",
                      "~/Vendor/toastr/build/toastr.min.js",
                      "~/Vendor/sweetalert/lib/sweet-alert.js"));

            // Bootstrap
            bundles.Add(new ScriptBundle("~/bundles/bootstrap/js").Include("~/Vendor/bootstrap/dist/js/bootstrap.min.js"));

            // jQuery
            bundles.Add(new ScriptBundle("~/bundles/jquery/js").Include("~/Vendor/jquery/dist/jquery.min.js"));

            // jQuery UI
            bundles.Add(new ScriptBundle("~/bundles/jqueryui/js").Include("~/Vendor/jquery-ui/jquery-ui.min.js"));

            // jQuery Validation
            //bundles.Add(new ScriptBundle("~/bundles/validation/js").Include("~/Vendor/jquery-validation/jquery.validate.min.js"));
            bundles.Add(new ScriptBundle("~/bundles/validation/js").Include("~/Scripts/jquery.validate.js"));

            bundles.Add(new ScriptBundle("~/bundles/rowsGroup/js").Include("~/Scripts/dataTables.rowsGroup.js"));


            // Datatables
            bundles.Add(new ScriptBundle("~/bundles/datatables/js").Include("~/Scripts/Datatable.js"));

            // Datatables bootstrap
            bundles.Add(new ScriptBundle("~/bundles/datatablesBootstrap/js").Include("~/Vendor/datatables.net-bs/js/dataTables.bootstrap.min.js"));

            // Datatables plugins
            bundles.Add(new ScriptBundle("~/bundles/datatablesPlugins/js").Include(
                      "~/Vendor/pdfmake/build/pdfmake.min.js",
                      "~/Vendor/pdfmake/build/vfs_fonts.js",
                      "~/Vendor/datatables.net-buttons/js/buttons.html5.min.js",
                      "~/Vendor/datatables.net-buttons/js/buttons.print.min.js",
                      "~/Vendor/datatables.net-buttons/js/dataTables.buttons.min.js",
                      "~/Vendor/datatables.net-buttons-bs/js/buttons.bootstrap.min.js"));

            // Datatable Sum
            bundles.Add(new ScriptBundle("~/bundles/sum/js").Include("~/Vendor/datatables_plugins/api/sum().js"));

            //table editable js
            bundles.Add(new ScriptBundle("~/bundles/edit/js").Include(
                "~/Vendor/xeditable/bootstrap3-editable/js/bootstrap-editable.js",
                "~/Vendor/moment/moment.js"));

            bundles.Add(new ScriptBundle("~/bundles/datepicker/js").Include(
                "~/Vendor/bootstrap-datepicker-master/dist/js/bootstrap-datepicker.min.js",
                "~/Vendor/bootstrap-datepicker-master/dist/locales/bootstrap-datepicker.es.min.js"));

            // axios js
            bundles.Add(new ScriptBundle("~/bundles/axios/js").Include("~/Scripts/axios.min.js"));

            // fullcalendar
            bundles.Add(new ScriptBundle("~/bundles/fullcalendar/js").Include(
                "~/Vendor/fullcalendar/dist/fullcalendar.min.js",
                "~/Vendor/fullcalendar/dist/locale/es-us.js"));

            // bootstrap-tour
            bundles.Add(new ScriptBundle("~/bundles/bootstrap-tour/js").Include("~/Vendor/bootstrap-tour/build/js/bootstrap-tour.min.js"));

            // Scripts
            bundle = new Bundle("~/bundles/select2/js")
            {
                Orderer = new AsIsBundleOrderer()
            };
            bundle.Include("~/Vendor/select2-3.5.2/select2.min.js")
                .Include("~/Vendor/select2-3.5.2/select2_locale_es.js");
            bundles.Add(bundle);

            // Knockout scripts
            bundles.Add(new ScriptBundle("~/bundles/MRO002/js").Include(
                "~/Scripts/knockout-min.js",
                "~/Scripts/MRO/MRO002.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include("~/Scripts/knockout-min.js"));

            // Datepicker scripts
            bundle = new Bundle("~/bundles/datepicker/js")
            {
                Orderer = new AsIsBundleOrderer()
            };
            bundle.Include("~/Vendor/bootstrap-datepicker-master/dist/js/bootstrap-datepicker.min.js")
                .Include("~/Vendor/bootstrap-datepicker-master/dist/locales/bootstrap-datepicker.es.min.js")
                .Include("~/Vendor/moment/moment.js")
                .Include("~/Vendor/clockpicker/dist/bootstrap-clockpicker.min.js");
            bundles.Add(bundle);

            // slimscroll
            bundles.Add(new ScriptBundle("~/bundles/slimscroll/js").Include("~/Vendor/slimScroll/jquery.slimscroll.js"));

            // touchspin
            bundles.Add(new ScriptBundle("~/bundles/touchspin/js").Include("~/Vendor/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js"));

            // pagination
            bundles.Add(new ScriptBundle("~/bundles/pagination/js").Include("~/Scripts/pagination.js"));


            // scripts
            bundles.Add(new ScriptBundle("~/bundles/GenericCallPartViews/js").Include("~/Scripts/GenericComponents/Generic_Call_Part_Views.js"));
            bundles.Add(new ScriptBundle("~/bundles/GenericMethodsSiteList/js").Include("~/Scripts/GenericComponents/Generic_Methods_SiteList.js"));
            bundles.Add(new ScriptBundle("~/bundles/GenericInputCurrency/js").Include("~/Scripts/GenericComponents/generic_input_money.js"));

            // scripts
            bundles.Add(new ScriptBundle("~/bundles/LocalValidation/js").Include("~/Scripts/Validations.js"));
            bundles.Add(new ScriptBundle("~/bundles/Layout/js").Include("~/Scripts/Shared/Layout.js"));
            bundles.Add(new ScriptBundle("~/bundles/Calculator/js").Include("~/Scripts/Shared/Calculator.js"));
            bundles.Add(new ScriptBundle("~/bundles/Register/js").Include("~/Scripts/Home/Register.js"));
            bundles.Add(new ScriptBundle("~/bundles/RecoveryPassword/js").Include("~/Scripts/Home/RecoveryPassword.js"));
            bundles.Add(new ScriptBundle("~/bundles/Unlocking/js").Include("~/Scripts/Home/Unlocking.js"));
            bundles.Add(new ScriptBundle("~/bundles/Login/js").Include("~/Scripts/Home/Login.js"));
            bundles.Add(new ScriptBundle("~/bundles/ADMS001/js").Include("~/Scripts/Configuration/ADMS001.js"));
            bundles.Add(new ScriptBundle("~/bundles/ADMS002/js").Include("~/Scripts/Configuration/ADMS002.js"));
            bundles.Add(new ScriptBundle("~/bundles/ADMS003/js").Include("~/Scripts/Configuration/ADMS003.js"));
            bundles.Add(new ScriptBundle("~/bundles/ADMS004/js").Include("~/Scripts/Configuration/ADMS004.js"));
            bundles.Add(new ScriptBundle("~/bundles/ADMS006/js").Include("~/Scripts/Configuration/ADMS006.js"));

            bundles.Add(new ScriptBundle("~/bundles/Index/js").Include("~/Scripts/Home/Index.js"));

            bundles.Add(new ScriptBundle("~/bundles/CustomValidation/js").Include("~/Scripts/Validations.js"));

            bundles.Add(new ScriptBundle("~/bundles/chartjs/js").Include("~/Vendor/chartjs/Chart.js"));
        }

        public class BundlesFormats
        {
            public const string Print = @"<link href=""{0}"" rel=""stylesheet"" type=""text/css"" media=""print"" />";
        }

        public class AsIsBundleOrderer : IBundleOrderer
        {
            public virtual IEnumerable<BundleFile> OrderFiles(BundleContext context, IEnumerable<BundleFile> files)
            {
                return files;
            }
        }
    }
}
