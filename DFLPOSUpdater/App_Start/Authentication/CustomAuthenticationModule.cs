using System;
using System.Web;
using System.Web.Security;
namespace DFLPOSUpdater.App_Start.Authentication
{
    public class CustomAuthenticationModule : IHttpModule
    {
        public void Dispose()
        {
        }
        public void Init(HttpApplication oHttpApp)
        {
            // Se Registran los Manejadores de Evento que nos interesa
            oHttpApp.AuthorizeRequest += new EventHandler(this.AuthorizeRequest);
            oHttpApp.AuthenticateRequest += new EventHandler(this.AuthenticateRequest);
        }
        private void AuthorizeRequest(object sender, EventArgs e)
        {
            if (HttpContext.Current.Request.Path.ToLower().Contains("/home/") || HttpContext.Current.Request.Path.ToLower().Contains("/home/loginenter") || HttpContext.Current.Request.Path.ToLower().Contains("action") || HttpContext.Current.Request.Path.ToLower().Contains("bundles") || HttpContext.Current.Request.Path.ToLower().Contains("style") || HttpContext.Current.Request.Path.ToLower().Contains("fonts") || HttpContext.Current.Request.Path.ToLower().Contains("content") || HttpContext.Current.Request.Path.ToLower().Contains("signal"))
            {
                return;
            }
            if (HttpContext.Current.User != null)
            {
                //Si el usuario esta Autenticado
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (HttpContext.Current.User is MyAuthPage)
                    {
                        MyAuthPage principal = (MyAuthPage)HttpContext.Current.User;
                        //si el usuario no cuenta con esas paginas
                        if (!principal.IsPageEnabled(HttpContext.Current.Request.Path))
                        {
                            HttpContext.Current.Response.Redirect("~/Home/NotAuthorized");
                        }
                    }
                }
            }
        }

        private void AuthenticateRequest(object sender, EventArgs e)
        {

            if (HttpContext.Current.User != null)
            {
                //Si el usuario esta Autenticado
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (HttpContext.Current.User.Identity is FormsIdentity)
                    {
                        FormsIdentity _identity = (FormsIdentity)HttpContext.Current.User.Identity;
                        FormsAuthenticationTicket ticket = _identity.Ticket;
                        string cookieName = System.Web.Security.FormsAuthentication.FormsCookieName;
                        string userData = System.Web.HttpContext.Current.Request.Cookies[cookieName].Value;
                        ticket = FormsAuthentication.Decrypt(userData);

                        string perfil = "";
                        if (userData.Length > 0)
                            perfil = ticket.UserData;

                        //Se crea la clase y se asigna al CurrenUser del Contexto	SecERP_CEDIS.Perfiles.		
                        HttpContext.Current.User = new DFLPOSUpdater.App_Start.Authentication.MyAuthPage(_identity, perfil);
                    }
                }
            }
        }
    }
}