using System;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;

namespace DFLPOSUpdater
{
    public static class HMTLHelperExtensions
    {
        public static string IsSelected(this HtmlHelper html, string controller = null, string action = null, string submenu = null, string cssClass = "active")
        {
            ViewContext viewContext = html.ViewContext;
            bool isChildAction = viewContext.Controller.ControllerContext.IsChildAction;

            if (isChildAction)
                viewContext = html.ViewContext.ParentActionViewContext;

            RouteValueDictionary routeValues = viewContext.RouteData.Values;
            string currentAction = routeValues["action"].ToString();
            string currentController = routeValues["controller"].ToString();

            if (String.IsNullOrEmpty(action))
                action = currentAction;

            if (String.IsNullOrEmpty(controller))
                controller = currentController;

            string[] acceptedActions = action.Trim().Split(',').Distinct().ToArray();
            string[] acceptedControllers = controller.Trim().Split(',').Distinct().ToArray();

            //return acceptedActions.Contains(currentAction) && acceptedControllers.Contains(currentController) ?
            //    cssClass : String.Empty;


            /******************************/
            if (acceptedActions.Contains(currentAction) && acceptedControllers.Contains(currentController))
            {
                cssClass = "active";
            }
            else
            {
                cssClass = String.Empty;
            }
            /******************************/

            return cssClass;
        }
        public static string PageClass(this HtmlHelper html)
        {
            string currentAction = (string)html.ViewContext.RouteData.Values["action"];
            return currentAction;
        }

        public static string DaevEsVegano(this HtmlHelper Html, DataView Sub = null, DataTable Model = null)
        {
            string[] url;
            string cssClass = "";
            foreach (DataRowView rowViewsub in Sub)
            {
                DataRow rowSubMenu = rowViewsub.Row;

                if (rowSubMenu["url"].ToString().Contains("/") == true)
                {
                    DataView level3 = new DataView(Model);
                    level3.RowFilter = "ISNULL(level_3_menu, '') = '" + rowSubMenu["page_id"] + "'and type='page'";
                    url = (rowSubMenu["url"].ToString()).Split('/');

                    foreach (DataRowView rowViewlevel3 in level3)
                    {
                        DataRow rowLevel3 = rowViewlevel3.Row;
                        url = (rowLevel3["url"].ToString()).Split('/');

                        if (IsSelected(html: Html, action: "" + url[2] + "", controller: "" + url[1] + "").Equals("active"))
                            cssClass = "active";
                    }
                }
            }

            return cssClass;
        }
    }
}
