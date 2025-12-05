using App.BLL;
using App.BLL.CommonBusiness;
using App.BLL.Configuration;
using App.BLL.Distribution;
using App.BLL.MaCode;
using App.BLL.Site;
using App.Common;
using DFLPOSUpdater.ViewModels;
using DFLPOSUpdater.ViewModels.Distributions;
using DFLPOSUpdater.ViewModels.Home;
using DFLPOSUpdater.ViewModels.Sites;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace DFLPOSUpdater.Controllers
{
    public class HomeController : Controller
    {
        private readonly SiteBusiness _siteBusiness;
        private readonly UserMasterBusiness _userMasterBusiness;
        private readonly UserPwdBusiness _userPwdBusiness;
        private readonly SysLogConnectionBusiness _sysLogConnection;
        private readonly SysPageMasterBusiness _PageMasterRepo;
        private readonly SysSiteBusiness _SiteBussines;
        private readonly SysMaCodeBusiness _maCodeBusiness;
        private readonly MaCodeBusiness _maCodeB;
        private readonly SiteConfigBusiness _siteConfigBusiness;
        private readonly DistributionBusiness _distributionBusiness;
        DFLPOSUpdater.App_Start.Authentication.Profile Perf = new DFLPOSUpdater.App_Start.Authentication.Profile();


        public HomeController()
        {
            _userMasterBusiness = new UserMasterBusiness();
            _userPwdBusiness = new UserPwdBusiness();
            _sysLogConnection = new SysLogConnectionBusiness();
            _PageMasterRepo = new SysPageMasterBusiness();
            _SiteBussines = new SysSiteBusiness();
            _maCodeBusiness = new SysMaCodeBusiness();

            _siteBusiness = new SiteBusiness();
            _maCodeB = new MaCodeBusiness();
            _siteConfigBusiness = new SiteConfigBusiness();
            _distributionBusiness = new DistributionBusiness();
        }

        [Authorize]
        public ActionResult Menu(NavigationViewModel Model)
        {
            if (HttpContext.User != null)
            {
                //Si el usuario esta Autenticado
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    if (HttpContext.User.Identity is FormsIdentity)
                    {
                        //desencriptar ticket de session y obtenemos las paginas del usuario y nombre de usuario
                        FormsIdentity _identity = (FormsIdentity)HttpContext.User.Identity;
                        FormsAuthenticationTicket ticket = _identity.Ticket;
                        string cookieName = System.Web.Security.FormsAuthentication.FormsCookieName;
                        string userData = System.Web.HttpContext.Current.Request.Cookies[cookieName].Value;
                        ticket = FormsAuthentication.Decrypt(userData);
                        Model.menu_user_dataset = _PageMasterRepo.GetAllPagesOfUser(ticket.UserData);
                        Model.user_name = ticket.Name;
                        Session["User"] = Model.user_name;
                        var employee = _userMasterBusiness.GetUserMasterByUsername(Model.user_name);
                        //if (Model.photo != null)
                        //{
                        //    Model.photo = employee.photo;
                        //}
                        Model.photo = employee.photo;
                        return PartialView("_Navigation", Model);
                    }
                }
                else
                {
                    var employee = _userMasterBusiness.GetUserMasterByUsernameOrEmail(Session["User"].ToString());
                    var sysLogConnection = _sysLogConnection.GetConnectionByEmployeeNumber(employee.emp_no);
                    if (sysLogConnection != null)
                    {
                        sysLogConnection.connlogout_date = System.DateTime.Now;
                        sysLogConnection.conn_status = false;
                        _sysLogConnection.UpdateSession(sysLogConnection);
                    }
                    FormsAuthentication.SignOut();
                    Session.Abandon();
                    Session.Contents.RemoveAll();
                    HttpContext.Response.Redirect("~/Home/Login");
                }
            }
            return PartialView("_Navigation", Model);
        }
        public ActionResult Logout()
        {
            if (Session["User"] != null)
            {
                var employee = _userMasterBusiness.GetUserMasterByUsernameOrEmail(Session["User"].ToString());
                var sysLogConnection = _sysLogConnection.GetConnectionByEmployeeNumber(employee.emp_no);
                if (sysLogConnection != null)
                {
                    sysLogConnection.connlogout_date = System.DateTime.Now;
                    sysLogConnection.conn_status = false;
                    _sysLogConnection.UpdateSession(sysLogConnection);
                }
            }

            FormsAuthentication.SignOut();
            Session.Abandon();
            Session.Contents.RemoveAll();
            HttpContext.Response.Redirect("~/Home/Login");
            return View();
        }
        public ActionResult NotAuthorized()
        {
            return View();
        }
        public ActionResult Contacts()
        {
            return View();
        }

        public ActionResult Login()
        {
            //Spire.Pdf.PdfDocument pdf = new Spire.Pdf.PdfDocument();
            ////pdf.LoadFromStream(@"E:\Descargas\01 CSF BQ 02-Ene-23.pdf");
            //pdf.LoadFromFile(@"E:\Descargas\01 CSF BQ 02-Ene-23.pdf");
            //int i = 1;

            //foreach (PdfPageBase page in pdf.Pages)
            //{
            //    //Extract images from each page and save them to a specified file path
            //    //foreach (Spire.Pdf.Image image in page.ExtractImages())
            //    foreach (Image image in page.ExtractImages())
            //    {
            //        Bitmap bitImage = (Bitmap)image;
            //        image.Save(@"C:/Users/Administrator/Desktop/Images/" + "image" + i + ".png", System.Drawing.Imaging.ImageFormat.Png);
            //        i++;
            //    }
            //}

            ViewBag.MyPathInServer = GetFolderServerAndTimeUpdate();
            return View();
        }
        // Plan (pseudocódigo detallado):
        // 1. Obtener todas las distribuciones desde _distributionBusiness.GetHistoryVersions().
        // 2. Si la colección es nula o vacía, devolver la vista con null.
        // 3. Ordenar las distribuciones por la fecha de la versión (Version.VersionUploadDate) descendente.
        //    - Si la versión o la fecha son nulas, usar DateTime.MinValue para no romper el orden.
        // 4. Proyectar el primer elemento (la distribución de la última versión) a DistributionViewModel.
        //    - Manejar posibles nulos en Version y Site usando el operador ?. y valores por defecto donde sea necesario.
        //    - Para DistributionCurrent, solicitar el historial por Version.Id solo si Version no es nulo.
        // 5. Devolver la vista con el modelo resultante.
        public ActionResult Index()
        {
            var distribution = _distributionBusiness.GetHistoryVersions();
            if (distribution == null || !distribution.Any())
            {
                return View();
            }

            var list = distribution
                .OrderByDescending(d => d.Version?.VersionUploadDate ?? DateTime.MinValue)
                .Select(d => new DistributionViewModel
                {
                    DistributionId = d.Id,
                    State = d.Estate,
                    Message = d.Message,
                    CreatedDate = d.CreatedDate,
                    VersionId = d.Version?.Id ?? 0,
                    VersionName = d.Version?.Name,
                    VersionNumber = d.Version?.VersionNumber,
                    VersionDescription = d.Version?.VersionDescription,
                    FileName = d.Version?.VersionFiles,
                    UploadDate = d.Version.VersionUploadDate,
                    SiteId = d.Site?.Id ?? 0,
                    SiteName = d.Site?.Name,
                    SiteIp = d.Site?.Ip,
                    DestinationRoute = d.Site?.DestinationRoute,
                    DistributionCurrent = d.Version != null ? _distributionBusiness.GetHistoryByVersionId(d.Version.Id).ToList() : null
                })
                .FirstOrDefault();

            return View(list);           
        }
        [HttpGet]
        public ActionResult Register()
        {
            return View();
        }
        public ActionResult Store()
        {
            return View();
        }
        [HttpPost]
        public ActionResult IsActive()
        {
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult LoginEnter(LoginViewModel loginVM)
        {
            var employee = _userMasterBusiness.GetUserMasterByUsernameOrEmail(loginVM.Username);
            if (employee != null)
            {
                if (String.IsNullOrEmpty(loginVM.UsernamePV))
                    loginVM.UsernamePV = "";
                if (loginVM.UsernamePV != "")
                    if (loginVM.Username != loginVM.UsernamePV)
                        return Json(new { success = false, responseText = "Usuario incorrecto para poder ingresar: (" + loginVM.Username + ") ." }, JsonRequestBehavior.AllowGet);
                if (!_userMasterBusiness.IsAccountPending(employee))
                {
                    if (!_userMasterBusiness.IsAccountBlocked(employee))
                    {
                        if (!_userMasterBusiness.IsAccountInactive(employee))
                        {
                            if (!_userMasterBusiness.IsAccountUnsubscribed(employee))
                            {
                                if (_userMasterBusiness.IsPasswordCorrect(employee, loginVM.Password))
                                {
                                    try
                                    {
                                        var user_log = _userPwdBusiness.GetUserPwdByEmployeeNumber(employee.emp_no);
                                        string ip = GetIPAddress();
                                        user_log.last_logon_ip = ip;
                                        user_log.last_logon = DateTime.Now;
                                        var status = _userPwdBusiness.UpdateUserPwd(user_log);
                                        var sysLogConnection = _sysLogConnection.GetConnectionByEmployeeNumber(employee.emp_no);
                                        if (sysLogConnection == null)
                                        {
                                            sysLogConnection = new App.Entities.SYS_LOG_CONNECTION();
                                            sysLogConnection.cdate = System.DateTime.Now;
                                            sysLogConnection.emp_no = employee.emp_no;
                                            sysLogConnection.connlog_date = System.DateTime.Now;
                                            sysLogConnection.conn_status = true;
                                            _sysLogConnection.AddSysLogConnection(sysLogConnection);
                                        }
                                        else
                                        {
                                            sysLogConnection.connlogout_date = null;
                                            sysLogConnection.connlog_date = System.DateTime.Now;
                                            sysLogConnection.conn_status = true;
                                            _sysLogConnection.UpdateSession(sysLogConnection);
                                        }

                                    }
                                    catch (Exception ex)
                                    {
                                        var msg = ex.Message;
                                    }
                                    Session["User"] = employee.user_name;

                                    DFLPOSUpdater.App_Start.Authentication.UserCache.AddPaginasToCache(employee.emp_no, _PageMasterRepo.GetAllPagesOfUser(employee.emp_no), System.Web.HttpContext.Current);
                                    FormsAuthenticationTicket authTicket = new FormsAuthenticationTicket(2, employee.user_name, DateTime.Now, DateTime.Now.AddMinutes(20), false, employee.emp_no, FormsAuthentication.FormsCookiePath);
                                    string crypTicket = FormsAuthentication.Encrypt(authTicket);
                                    HttpCookie authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, crypTicket);
                                    Session["Name"] = employee.first_name + " " + employee.last_name;
                                    Response.Cookies.Add(authCookie);
                                    return Json(new { success = true, responseText = "Bienvenido " + employee.first_name + " " + employee.last_name + " !" }, JsonRequestBehavior.AllowGet);
                                }
                                else
                                {
                                    _userMasterBusiness.UpdateFailedAttempts(employee);
                                    return Json(new { success = false, responseText = "Contraseña Incorrecta, intenta de nuevo." }, JsonRequestBehavior.AllowGet);
                                }
                            }
                            else
                                return Json(new { success = false, responseText = "Esta cuenta se encuentra DADA DE BAJA." }, JsonRequestBehavior.AllowGet);
                        }
                        else
                            return Json(new { success = false, responseText = "Esta cuenta se encuentra Inactiva, Contacta a sistemas." }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, responseText = "Esta cuenta se encuentra bloqueada." }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { success = false, responseText = "Esta cuenta aun no se activa, contacta a sistemas" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new { success = false, responseText = "Este usuario no existe" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UsernameAlreadyExists(string username)
        {
            return Json(new { success = _userMasterBusiness.EmployeeUsernameExists(username) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Register(RegisterUserMaster registerUserMasterVM)
        {
            if (ModelState.IsValid)
            {
                var employee = registerUserMasterVM.Employee;
                var employeePw = registerUserMasterVM.EmployeePwd;

                //
                //Comentado para permitir varios usuarios con un mismo correo
                //
                //if (_userMasterBusiness.EmployeeEmailExists(employee.email))
                //{
                //    return Json(new { success = false, responseText = "Este correo ya se encuentra registrado" }, JsonRequestBehavior.AllowGet);
                //}
                //else
                //{
                if (!_userMasterBusiness.IsValidEmailAddress(employee.email))
                {
                    return Json(new { success = false, responseText = "Dominio de correo incorrecto. Ejemplo: correo@elflorido.com.mx" }, JsonRequestBehavior.AllowGet);
                }
                if (_userMasterBusiness.EmployeeUsernameExists(employee.user_name))
                {
                    return Json(new { success = false, responseText = "Este nombre de usuario ya se encuentra registrado" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    employee.USER_PWD = employeePw;
                    if (_userMasterBusiness.AddUserMaster(employee))
                    {

                        return Json(new { success = true, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, responseText = "Hubo un error y no pudimos guardar este empleado!" }, JsonRequestBehavior.AllowGet);
                    }
                }
                //}
            }
            else
            {
                var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();

                return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult FindByEmployeeId(string employeeId)
        {
            var employee = _userMasterBusiness.GetUserMasterByEmployeeNumber(employeeId);
            if (employee != null)
            {
                return Json(new { success = true, responseText = "Este numero de empleado ya existe!", employeeId = employee.emp_no, username = employee.user_name }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, responseText = "Este numero de empleado actualmente esta disponible!" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult RecoveryPassword(string code)
        {
            RecoveryPasswordViewModel model = new RecoveryPasswordViewModel
            {
                code = code
            };
            ViewBag.codestring = code;
            TempData["Code"] = code;
            TempData.Keep("Code");
            return View(model);
        }
        [HttpGet]
        public ActionResult Unlocking(string code)
        {
            RecoveryPasswordViewModel model = new RecoveryPasswordViewModel
            {
                code = code
            };
            ViewBag.codestring = code;
            TempData["Code"] = code;
            TempData.Keep("Code");
            return View(model);
        }


        [HttpPost]
        public JsonResult RecoveryPassword(string empno, string code, string password)
        {
            var employee = _userMasterBusiness.GetUserMasterByRecoveryPasswordCode(code);
            if (employee != null)
            {
                if (empno == employee.emp_no)
                {
                    employee.USER_PWD.password = Common.SetPassword(password);
                    //employee.USER_PWD.status = "A";
                    employee.USER_PWD.failed_attempts = 0;
                    employee.USER_PWD.pass_code = "";
                    if (_userMasterBusiness.UpdateUserMaster(employee))
                    {
                        return Json(new { success = true, responseText = "Se actualizo tu nueva contraseña" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, responseText = "Ocurrió un error al intentar recuperar tu contraseña, contacta a sistemas." }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                    return Json(new { success = false, responseText = "El numero de empleado no corresponde." }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new { success = false, responseText = "Ocurrió un error al intentar recuperar tu contraseña, contacta a sistemas." }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        //1 = RecoveryPassword 0 = Unlocking User
        public JsonResult GetCodeRecoveryPassword(string employeeUsername, bool type)
        {
            var employee = _userMasterBusiness.GetUserMasterByUsernameOrEmpNo(employeeUsername);
            if (employee != null)
            {
                if (type)
                {

                    if (employee.USER_PWD.status == "E")
                        return Json(new { success = false, responseText = "Su usuario se encuentra DADO DE BAJA." }, JsonRequestBehavior.AllowGet);
                    if (employee.USER_PWD.status == "I")
                        return Json(new { success = false, responseText = "Su usuario se encuentra INACTIVO, contacte a sistemas." }, JsonRequestBehavior.AllowGet);
                    if (employee.USER_PWD.status == "B")
                        return Json(new { success = false, responseText = "Su usuario se encuentra BLOQUEADO, intente desbloquearlo primero." }, JsonRequestBehavior.AllowGet);
                    if (string.IsNullOrWhiteSpace(employee.USER_PWD.pass_code))
                        _userMasterBusiness.AddRecoveryCodePassword(employee);
                    var host = System.Web.HttpContext.Current?.Request.Url.GetLeftPart(UriPartial.Authority);
                    var information = new SendMail
                    {
                        body = "¿Olvidaste su contraseña? No hay problema, sólo presione el botón de abajo para restablecerla. Al ir a este enlace, podrá ingresar y confirmar su nueva contraseña.",
                        buttonLink = $"{host}/home/RecoveryPassword?Code={employee.USER_PWD.pass_code}",
                        buttonText = "Recuperar contraseña",
                        subject = "FLORIDO GLOBAL ERP -  Recuperación de contraseñas",
                        @from = "FLORIDO GLOBAL ERP",
                        email = employee.email
                    };
                    if (!string.IsNullOrWhiteSpace(employee.USER_PWD.pass_code))
                    {
                        string ReturnMessage = Common.MailMessageHtml(information);
                        if (ReturnMessage == "success")
                            return Json(new { success = true, responseText = "Se ha enviado un correo con las instrucciones para recuperar su contraseña.", email = employee.email }, JsonRequestBehavior.AllowGet);
                        else
                            return Json(new { success = false, responseText = ReturnMessage + ", contacta a sistemas." }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "Ocurrió un error, contacta a sistemas." }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var statusUser = (employee.USER_PWD.status == null) ? "P" : employee.USER_PWD.status.ToUpper();
                    int failed = employee.USER_PWD.failed_attempts ?? 0;
                    string failedstr = "";
                    if (statusUser == "B")
                    {
                        var host = System.Web.HttpContext.Current?.Request.Url.GetLeftPart(UriPartial.Authority);
                        var RolesValid = _maCodeBusiness.GetAllCodeByCode("USER_UNLOCKING");
                        bool hasMatch = RolesValid.Any(x => employee.SYS_ROLE_USER.Any(y => y.role_id == x.vkey));

                        if (hasMatch)
                        {

                            if (string.IsNullOrWhiteSpace(employee.USER_PWD.pass_code))
                                _userMasterBusiness.AddRecoveryCodePassword(employee);
                            if (failed > 4)
                                failedstr = " <b>Tiene 5 INTENTOS ERRONEOS al ingresar al sistema</b>, si no recuerda su contraseña intente cambiarla.";
                            host = System.Web.HttpContext.Current?.Request.Url.GetLeftPart(UriPartial.Authority);
                            var information = new SendMail
                            {
                                body = "¿Su usuario se encuentra bloqueado? No hay problema, sólo presione el botón de abajo para desbloquearlo." + failedstr,
                                buttonLink = $"{host}/home/Unlocking?Code={employee.USER_PWD.pass_code}",
                                buttonText = "Desbloquear Usuario",
                                subject = "FLORIDO GLOBAL ERP - Desbloquear Usuario",
                                @from = "FLORIDO GLOBAL ERP",
                                email = employee.email
                            };

                            if (!string.IsNullOrWhiteSpace(employee.USER_PWD.pass_code))
                            {
                                string ReturnMessage = Common.MailMessageHtml(information);
                                if (ReturnMessage == "success")
                                    return Json(new { success = true, responseText = "Se ha enviado un correo con el cual podrás desbloquear tu usuario.", email = employee.email }, JsonRequestBehavior.AllowGet);
                                else
                                    return Json(new { success = false, responseText = ReturnMessage + ", contacta a sistemas." }, JsonRequestBehavior.AllowGet);
                            }
                            else
                                return Json(new { success = false, responseText = "Ocurrió un error, contacta a sistemas." }, JsonRequestBehavior.AllowGet);
                        }
                        else
                            return Json(new { success = false, responseText = "Usuario sin permisos para desbloquear su propia cuenta, contacta a sistemas para poder entrar al sistema." }, JsonRequestBehavior.AllowGet);

                    }
                    else if (statusUser == "I")
                        return Json(new { success = false, responseText = "Su usuario se encuentra \"Inactivo\", contacta a sistemas para poder entrar al sistema." }, JsonRequestBehavior.AllowGet);
                    else if (statusUser == "P")
                        return Json(new { success = false, responseText = "Su usuario se encuentra \"Pendiente Por Activar\", contacta a sistemas para poder entrar al sistema." }, JsonRequestBehavior.AllowGet);
                    else if (statusUser == "A")
                        return Json(new { success = false, responseText = "Su usuario ya se encontraba \"ACTIVO\", inicie sesión correctamente." }, JsonRequestBehavior.AllowGet);
                    else if (statusUser == "E")
                        return Json(new { success = false, responseText = "Su usuario se encuentra \"DADO DE BAJA\", contacta a sistemas para poder entrar al sistema." }, JsonRequestBehavior.AllowGet);
                    else
                        return Json(new { success = false, responseText = "Su usuario no se encuentra bloqueado." }, JsonRequestBehavior.AllowGet);
                }

            }
            else
            {
                return Json(new { success = false, responseText = "Este Usuario o Email no se encuentra en nuestra base de datos" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult Unlocking(string empno, string code)
        {
            var employee = _userMasterBusiness.GetUserMasterByRecoveryPasswordCode(code);
            if (employee != null)
            {
                if (empno == employee.emp_no)
                {
                    employee.USER_PWD.status = "A";
                    employee.USER_PWD.failed_attempts = 0;
                    employee.USER_PWD.pass_code = "";
                    employee.USER_PWD.udate = DateTime.Now;
                    if (_userMasterBusiness.UpdateUserMaster(employee))
                    {
                        return Json(new { success = true, responseText = "Su usuario fue desbloqueado con existo." }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { success = false, responseText = "Ocurrió un error al intentar desbloquear." }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                    return Json(new { success = false, responseText = "El numero de empleado no corresponde." }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new { success = false, responseText = "Ocurrió un error al intentar debloquear su usuario, contacta a sistemas." }, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult GetPagesByUser()
        {
            if (Session["User"] != null)
            {
                var user = _userMasterBusiness.GetUserMasterByUsername(Session["User"].ToString());
                var pages = _userMasterBusiness.GetPagesByUser(user.emp_no);
                return Json(new { success = true, pages = pages }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json("SF", JsonRequestBehavior.AllowGet);
        }

        public ActionResult _Footer()
        {
            ViewBag.MyPathInServer = GetFolderServerAndTimeUpdate();
            return PartialView();
        }

        public string GetFolderServerAndTimeUpdate()
        {
            try
            {
                var host = System.Web.HttpContext.Current?.Request.Url.GetLeftPart(UriPartial.Authority);
                string fullPath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath;
                string[] pathSplit = fullPath.Split('\\');
                string myPath = pathSplit[pathSplit.Length - 2];
                fullPath = fullPath + "\\bin\\";
                var directory = new DirectoryInfo(fullPath);
                var myFile = (from f in directory.GetFiles()
                              orderby f.LastWriteTime descending
                              select f).First();
                var x = myPath + " - (" + myFile.LastWriteTime.DayOfWeek.ToString() + ") " + myFile.LastWriteTime.ToString();
                return x;
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return "";
            }
        }
        [Authorize]
        public ActionResult _Right_Sidebar(RightSidebarViewModel model)
        {
            try
            {
                var no = "";//_ExchangeCurrencyBusiness.getDateCurrency(DateTime.Now.Date, DateTime.Now.Date);
                foreach (var item in no)
                {
                    model.BanxicoCurrency = "$";
                    model.ComercialCurrency = "$";
                }

                return PartialView("_Right_Sidebar", model);
            }
            catch (Exception)
            {
                model.BanxicoCurrency = "$";
                model.ComercialCurrency = "$";
                return PartialView("_Right_Sidebar", model);
            }

        }

        public ActionResult ActionSite4Columns(int is_format) { return PartialView("_Sites4Columns", GetSiteModel(is_format)); }
        public ActionResult ActionSiteColumnsSelect(int is_format) { return PartialView("_SitesColumnsSelect", GetSiteModel(is_format)); }
        public ActionResult ActionSite4ColumnsPaginator(int is_format) { return PartialView("_Sites4ColumnsPaginator", GetSiteModel(is_format)); }
        public ActionResult ActionSiteColumnsSelectAutoupdate(int is_format) { return PartialView("_SitesColumnsSelectAutoupdate", GetSiteModel(is_format)); }
        public ActionResult ActionSite3Columns(int is_format) { return PartialView("_Sites3Columns", GetSiteModel(is_format)); }
        public ActionResult ActionSite3ColumnsPaginator(int is_format) { return PartialView("_Sites3ColumnsPaginator", GetSiteModel(is_format)); }
        public ActionResult ActionSites2ColumnsPercentage(int is_format) { return PartialView("_Sites2ColumnsPercentage", GetSiteModel(is_format)); }
        public ActionResult ActionSites2ColumnsPercentagePaginator(int is_format) { return PartialView("_Sites2ColumnsPercentagePaginator", GetSiteModel(is_format)); }
        public ActionResult ActionSites2ColumnsInputs(int is_format) { return PartialView("_Sites2ColumnsInputs", GetSiteModel(is_format)); }
        public ActionResult ActionSites2ColumnsInputsPaginator(int is_format) { return PartialView("_Sites2ColumnsInputsPaginator", GetSiteModel(is_format)); }
        public ActionResult ActionSites2ColumnsInputsShowAmount(int is_format) { return PartialView("_Sites2ColumnsInputsShowAmount", GetSiteModel(is_format)); }
        public ActionResult ActionSites2Columns2Inputs(int is_format) { return PartialView("_Sites2Columns2Inputs", GetSiteModel(is_format)); }
        public ActionResult ActionSites2Columns2InputsShowAmount(int is_format) { return PartialView("_Site2Columns2InputsShowAmount", GetSiteModel(is_format)); }
        public ActionResult _Calculator() { return PartialView("_Calculator"); }

        public SitesViewModel GetSiteModel(int is_format)
        {
            var array_sites = _siteBusiness.GetAllSitesModel();
            int count_sites = array_sites.Count();
            if (is_format == 1)
                array_sites = array_sites.OrderBy(site => site.SiteName).ThenBy(site => site.SiteName).ToList();
            else if (is_format == 2)
                array_sites = array_sites.OrderBy(site => site.SiteCode).ThenBy(site => site.SiteCode).ToList();
            else if (is_format == 3)
                array_sites = array_sites.Where(w => w.NewErp == true).OrderBy(site => site.SiteName).ThenBy(site => site.SiteName).ToList();
            else if (is_format == 4)
                array_sites = array_sites.Where(w => w.NewErp == true).OrderBy(site => site.SiteCode).ThenBy(site => site.SiteCode).ToList();
            else if (is_format == 5)
                array_sites = array_sites.Where(w => w.NewErp == true).OrderBy(site => site.SiteCode).ThenBy(site => site.SiteCode).ToList();

            SitesViewModel Model = new SitesViewModel
            {
                Site = _siteBusiness.GetAllSitesOferts(),
                ListCategory = _maCodeBusiness.GetAllCodeByCode("COST_SCHEDULING"),
                ListPosition = _maCodeB.GetPositionSites(count_sites),
                Districts = _siteBusiness.GetAllDistricts(),
                Sites = array_sites
            };

            if (is_format == 5)
            {
                array_sites = _siteConfigBusiness.GetInfoSiteAutoUpdateLastNew(array_sites);
            }

            if (is_format == 1)
            {
                Model.Sites.Insert(0, new App.Entities.ViewModels.Site.SiteModel { SiteCode = "0004", SiteName = "Administración", District = "C1" });
                Model.Sites.Insert(1, new App.Entities.ViewModels.Site.SiteModel { SiteCode = "0094", SiteName = "Cedis", District = "C1" });
                Model.Sites.Insert(2, new App.Entities.ViewModels.Site.SiteModel { SiteCode = "0093", SiteName = "Cedis Perecederos", District = "C1" });
                Model.Sites.Insert(3, new App.Entities.ViewModels.Site.SiteModel { SiteCode = "S001", SiteName = "Gastos Operativos", District = "C1" });
                Model.Sites.Insert(4, new App.Entities.ViewModels.Site.SiteModel { SiteCode = "S002", SiteName = "Taller Mecánico", District = "C1" });
                Model.ListPosition.first_column_for_column_2_with_inputs = Model.Sites.Count() / 2;

            }
            else if (is_format == 2)
            {
                count_sites = Model.Sites.Count();
                Model.Sites.Add(new App.Entities.ViewModels.Site.SiteModel { SiteCode = "0004", SiteName = "Administración", District = "C1" });
                Model.Sites.Add(new App.Entities.ViewModels.Site.SiteModel { SiteCode = "0094", SiteName = "Cedis", District = "C1" });
                Model.Sites.Add(new App.Entities.ViewModels.Site.SiteModel { SiteCode = "0093", SiteName = "Cedis Perecederos", District = "C1" });
                Model.Sites.Add(new App.Entities.ViewModels.Site.SiteModel { SiteCode = "S001", SiteName = "Gastos Operativos", District = "C1" });
                Model.Sites.Add(new App.Entities.ViewModels.Site.SiteModel { SiteCode = "S002", SiteName = "Taller Mecánico", District = "C1" });
                Model.ListPosition.first_column_for_column_2_with_inputs = Model.Sites.Count() / 2;
            }

            Model.ListPosition.all_sites_actives = Model.Sites.Count();
            return Model;
        }


        protected string GetIPAddress()
        {
            try
            {
                var context = System.Web.HttpContext.Current;
                var ip = context.Request.ServerVariables["REMOTE_ADDR"];
                if (IsInternal(ip))
                {
                    string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                    if (!string.IsNullOrEmpty(ipAddress))
                        ip = ipAddress.Split(',')[0];
                }
                return ip;
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return "::2";
            }
        }

        public bool IsInternal(string testIp)
        {
            if (testIp == "::1") return true; //::1 -  IPv6  loopback (localhost)
            byte[] ip = IPAddress.Parse(testIp).GetAddressBytes();
            switch (ip[0])
            {
                case 10:   //10.0.0.0     -   10.255.255.255  (10/8 prefix)
                case 127:  //127.0.0.0    -   127.255.255.255  (127/8 prefix)
                    return true;
                case 172: //172.16.0.0   -   172.31.255.255  (172.16/12 prefix)
                    return ip[1] >= 16 && ip[1] < 32;//
                case 192: //192.168.0.0  -   192.168.255.255 (192.168/16 prefix)
                    return ip[1] == 168;
                default:
                    return false;
            }
        }
    }
}