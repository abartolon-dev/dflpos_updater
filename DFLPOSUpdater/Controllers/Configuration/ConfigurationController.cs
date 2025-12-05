using App.BLL;
using App.BLL.Configuration;
using App.BLL.MaCode;
using App.BLL.Site;
using App.Common;
using DFLPOSUpdater.ViewModels;
using DFLPOSUpdater.ViewModels.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DFLPOSUpdater.Controllers.Configuration
{
    public class ConfigurationController : Controller
    {
        // GET: Configuration
        // GET: Configuration
        private readonly SysPageMasterBusiness _PageMasterRepo;
        private readonly SysRoleMasterBusiness _RoleMasterRepo;
        private readonly SysRolePageBusiness _RolePageRepo;
        private readonly UserMasterBusiness _userMasterRepo;
        private readonly SysRoleUserBusiness _RoleUserRepo;
        private readonly UserPwdBusiness _sysUserPwdBusiness;
        private readonly MaCodeBusiness _maCodeBusiness;
        private readonly SiteBusiness _siteBusiness;
        private readonly UserMasterBusiness _userMasterBusiness;
        public ConfigurationController()
        {
            _PageMasterRepo = new SysPageMasterBusiness();
            _RoleMasterRepo = new SysRoleMasterBusiness();
            _RolePageRepo = new SysRolePageBusiness();
            _userMasterRepo = new UserMasterBusiness();
            _RoleUserRepo = new SysRoleUserBusiness();
            _sysUserPwdBusiness = new UserPwdBusiness();
            _maCodeBusiness = new MaCodeBusiness();           
            _siteBusiness = new SiteBusiness();            
            _userMasterBusiness = new UserMasterBusiness();
        }
        public ActionResult MENADMS000()
        {
            if (Session["User"] != null)
                return View();

            return RedirectToAction("Login", "Home");
        }
        public ActionResult ADMS001()
        {
            if (Session["User"] != null)
            {
                ConfigurationAddPages model = new ConfigurationAddPages
                {
                    Page = _PageMasterRepo.GetAllPagesAdmin()
                };
                return View(model);
            }
            return RedirectToAction("Login", "Home");
        }

        public ActionResult ADMS002()
        {
            if (Session["User"] != null)
            {
                ConfigurationAddRoles model = new ConfigurationAddRoles
                {
                    RolesCollection = _RoleMasterRepo.GetAllRolesAdmin(),
                    active_flag = true
                };
                return View(model);
            }
            return RedirectToAction("Login", "Home");
        }

        public ActionResult ADMS003()
        {
            if (Session["User"] != null)
            {
                ConfigurationAddRoles model = new ConfigurationAddRoles()
                {
                    RolesCollection = _RoleMasterRepo.GetAllRolesAdmin(),
                    active_flag = true
                };
                return View(model);
            }
            return RedirectToAction("Login", "Home");
        }

        public ActionResult ADMS004()
        {
            if (Session["User"] != null)
            {
                ConfigurationAddPagesUser model = new ConfigurationAddPagesUser
                {
                    Users = _userMasterRepo.GetAllUsers(),
                    ListDepartment = _maCodeBusiness.GetListByCode("DepartmentId")
                };
                return View(model);
            }
            return RedirectToAction("Login", "Home");
        }

        public ActionResult ADMS005()
        {
            if (Session["User"] != null)
                return View();

            return RedirectToAction("Login", "Home");
        }

        public ActionResult ADMS007()
        {
            if (Session["User"] != null)
                return View();

            return RedirectToAction("Login", "Home");
        }

        //Obetenemos informacion de usuario y retornamos modelo a la vista ADMS006
        public ActionResult ADMS006()
        {
            if (Session["User"] != null)
            {
                RegisterUserMaster model = new RegisterUserMaster();
                //Busca informacion por nombre de usuario HttpContext.User.Identity.Name
                var item = _userMasterRepo.GetUserMasterByUsername(HttpContext.User.Identity.Name);
                if (item != null)
                {
                    //Asignamos Valores al ViewModel RegisterUserMaster
                    model.EmployeeNumber = item.emp_no;
                    model.Username = item.user_name;
                    model.FirstName = item.first_name;
                    model.LastName = item.last_name;
                    model.Phone = item.office_tel;
                    model.Cellphone = item.mobile_tel;
                    model.DateOfBirth = item.birth_date.Value;
                    model.Email = item.email;
                    model.photo = item.photo;
                }
                return View(model);
            }
            return RedirectToAction("Login", "Home");
        }


        [HttpPost]
        public ActionResult ActionUpdateUser(RegisterUserMaster model)
        {
            if (ModelState.IsValid)
            {
                if (!_userMasterRepo.IsValidEmailAddress(model.Email))
                    return Json(new { success = false, responseText = "Dominio de correo incorrecto. Ejemplo: correo@elflorido.com.mx" }, JsonRequestBehavior.AllowGet);

                var employee = _userMasterRepo.GetUserMasterByEmployeeNumber(model.EmployeeNumber);
                if (_userMasterRepo.EmployeeUsernameExists(model.Username) & employee.user_name != model.Username)
                    return Json(new { success = false, responseText = "Este nombre de usuario ya se encuentra registrado" }, JsonRequestBehavior.AllowGet);

                if (model.Password != null)
                {
                    employee.USER_PWD.password = Common.SetPassword(model.Password);
                    employee.USER_PWD.status = "A";
                    employee.USER_PWD.failed_attempts = 0;
                    employee.USER_PWD.pass_code = "";
                }
                else
                {
                    employee.user_name = Session["User"].ToString();
                    employee.first_name = model.FirstName;
                    employee.last_name = model.LastName;
                    employee.office_tel = model.Phone;
                    employee.mobile_tel = model.Cellphone;
                    employee.birth_date = model.DateOfBirth;
                    employee.email = model.Email;
                }

                if (_userMasterRepo.UpdateUserMaster(employee))
                    return Json(new { success = true, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                else
                    return Json(new { success = false, responseText = "Error al editar usuario" }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Json(new { success = false, responseText = allErrors.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ActionUploadUserPhoto()
        {
            try
            {
                var EmployeeNumber = Request["EmployeeNumber"];
                var employee = _userMasterRepo.GetUserMasterByEmployeeNumber(EmployeeNumber);
                HttpPostedFileBase fs = Request.Files[0];
                BinaryReader br = new BinaryReader(Request.Files[0].InputStream);
                byte[] bytes = br.ReadBytes((Int32)fs.ContentLength);
                employee.photo = bytes;

                if (_userMasterRepo.UpdateUserMaster(employee))
                    return Json(new { success = true, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                else
                    return Json(new { success = false, responseText = "Error al editar usuario" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception df)
            {
                var k = df.Message;
                throw;
            }
        }

        public ActionResult ActionDeletePicture(string EmployeeNumber)
        {
            var employee = _userMasterRepo.GetUserMasterByEmployeeNumber(EmployeeNumber);

            if (_userMasterRepo.DeletePicture(employee))
                return Json(new { success = true, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false, responseText = "Error al editar usuario." }, JsonRequestBehavior.AllowGet);
        }

        //inserta paginas en el sistema.
        [HttpPost]
        public ActionResult ActionInsertPages(ConfigurationAddPages AddPages, bool type)
        {
            if (Session["User"] != null)
            {
                AddPages.cuser = Session["User"].ToString();
                AddPages.cdate = DateTime.Now;
                AddPages.active_flag = true;
                if (ModelState.IsValid)
                {
                    var page = (dynamic)null;
                    page = _PageMasterRepo.SearchPage(AddPages.page_id);
                    if (page == null)
                    {
                        var retu = (dynamic)null;
                        retu = _PageMasterRepo.AddPagesMaster(AddPages.PAGES);
                        if (retu)
                        {
                            List<ConfigurationPages> CostumModel = new List<ConfigurationPages>();
                            var list = (dynamic)null;
                            list = _PageMasterRepo.GetAllPagesAdmin();
                            foreach (var item in list)
                            {
                                ConfigurationPages ite = new ConfigurationPages
                                {
                                    page_id = item.page_id,
                                    page_name = item.page_name,
                                    description = item.description,
                                    url = item.url,
                                    active_flag = item.active_flag
                                };
                                CostumModel.Add(ite);
                            }
                            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
                            {
                                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                            });

                            return Json(new { success = true, Json = json, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                        }
                        else
                            return Json(new { success = false, responseText = "Ocurrió un error al registrar los datos.!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "El Page ID le pertenece a la pagina '" + page.page_name + "', ingresa otro Page ID." }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
                    return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas " + errors + "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }

        //Edita las paginas del sistema
        [HttpPost]
        public ActionResult ActionEditPages(ConfigurationAddPages upPages, bool type)
        {
            if (Session["User"] != null)
            {
                upPages.uuser = Session["User"].ToString();
                if (ModelState.IsValid)
                {
                    var Page = (dynamic)null;
                    Page = _PageMasterRepo.GetPageByID(upPages.page_id);
                    Page.page_name = upPages.page_name;
                    Page.description = upPages.description;
                    Page.url = upPages.url;
                    Page.active_flag = upPages.active_flag;
                    Page.uuser = Session["User"].ToString();
                    Page.udate = DateTime.Now;
                    var retuBool = (dynamic)null;
                    retuBool = _PageMasterRepo.UpdatePagesMaster(Page);
                    if (retuBool)
                    {
                        List<ConfigurationPages> CostumModel = new List<ConfigurationPages>();
                        var list = (dynamic)null;
                        list = _PageMasterRepo.GetAllPagesAdmin();
                        foreach (var item in list)
                        {
                            ConfigurationPages ite = new ConfigurationPages
                            {
                                page_id = item.page_id,
                                page_name = item.page_name,
                                description = item.description,
                                url = item.url,
                                active_flag = item.active_flag
                            };
                            CostumModel.Add(ite);
                        }

                        var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                        });

                        return Json(new { success = true, Json = json, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "Ocurrió un error al registrar los datos.!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
                    return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas " + errors + "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }

        //Inserta roles en el sistema
        [HttpPost]
        public ActionResult ActionInsertRoles(ConfigurationAddRoles AddRoles, bool type)
        {
            if (Session["User"] != null)
            {
                AddRoles.cuser = Session["User"].ToString();
                AddRoles.cdate = DateTime.Now;
                if (ModelState.IsValid)
                {
                    var role = (dynamic)null;
                    role = _RoleMasterRepo.SearchRole(AddRoles.role_id);
                    if (role == null)
                    {
                        var retu = (dynamic)null;
                        retu = _RoleMasterRepo.AddRolesMaster(AddRoles.ROLES);
                        if (retu)
                        {
                            var list = (dynamic)null;
                            List<ConfigurationRoles> CostumModel = new List<ConfigurationRoles>();
                            list = _RoleMasterRepo.GetAllRolesAdmin();
                            foreach (var item in list)
                            {
                                ConfigurationRoles ite = new ConfigurationRoles();
                                ite.role_id = item.role_id;
                                ite.role_name = item.role_name;
                                ite.role_description = item.role_description;
                                ite.active_flag = item.active_flag;
                                CostumModel.Add(ite);
                            }
                            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
                            {
                                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                            });
                            return Json(new { success = true, Json = json, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                        }
                        else
                            return Json(new { success = false, responseText = "Ocurrió un error al registrar los datos.!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "El Role ID que ingreso le pertenece al role de '" + role.role_name + "', intenta con otro Role ID." }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
                    return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas " + errors + "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }
 

        //Edita roles del sistema
        [HttpPost]
        public ActionResult ActionEditRol(ConfigurationAddRoles updateRol, bool type)
        {
            if (Session["User"] != null)
            {
                if (ModelState.IsValid)
                {
                    var Rol = (dynamic)null;
                    if (type)//Paginas de tienda
                    {
                       // Rol = _RoleMasterRepo.getRoleByIDStore(updateRol.role_id);
                    }
                    else // Paginas Global
                    {
                        Rol = _RoleMasterRepo.getRoleByID(updateRol.role_id);
                    }
                    Rol.role_name = updateRol.role_name;
                    Rol.role_description = updateRol.role_description;
                    Rol.active_flag = updateRol.active_flag;
                    Rol.uuser = Session["User"].ToString();
                    Rol.udate = DateTime.Now;
                    var retuBool = (dynamic)null;
                    retuBool = _RoleMasterRepo.updateRoleMaster(Rol);
                    if (retuBool)
                    {
                        var list = (dynamic)null;
                        List<ConfigurationRoles> CostumModel = new List<ConfigurationRoles>();
                        list = _RoleMasterRepo.GetAllRolesAdmin();
                        foreach (var item in list)
                        {
                            ConfigurationRoles ite = new ConfigurationRoles();
                            ite.role_id = item.role_id;
                            ite.role_name = item.role_name;
                            ite.role_description = item.role_description;
                            ite.active_flag = item.active_flag;
                            CostumModel.Add(ite);
                        }
                        var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                        });
                        return Json(new { success = true, Json = json, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "Ocurrió un error al registrar los datos.!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
                    return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas " + errors + "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }

        //Obtenemos todas las paginas del rol 
        [HttpGet]
        public JsonResult ActionGetAllPagesOfRole(ConfigurationAddRoles role, bool type)
        {
            List<ConfigurationPages> CostumModel = new List<ConfigurationPages>();
            var list = (dynamic)null;
            list = _PageMasterRepo.GetAllPagesOfRole(role.role_id);
            foreach (var item in list)
            {
                ConfigurationPages ite = new ConfigurationPages();
                ite.page_id = item.page_id;
                ite.page_name = item.page_name;
                ite.description = item.description;
                CostumModel.Add(ite);
            }
            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            });
            return Json(new { success = true, Json = json }, JsonRequestBehavior.AllowGet);
        }

        //Obtenemos todas las paginas disponibles que no tenga ese rol
        [HttpGet]
        public JsonResult ActionGetAllPagesAvailable(ConfigurationAddRoles role, bool type)
        {
            List<ConfigurationPages> CostumModel = new List<ConfigurationPages>();
            var list = (dynamic)null;
            list = _PageMasterRepo.GetAllPagesAvailable(role.role_id);

            foreach (var item in list)
            {
                ConfigurationPages ite = new ConfigurationPages();
                ite.page_id = item.page_id;
                ite.page_name = item.page_name;
                ite.description = item.description;
                CostumModel.Add(ite);
            }
            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            });
            return Json(new { success = true, Json = json }, JsonRequestBehavior.AllowGet);
        }

        //Asignamos paginas a el rol 
        [HttpPost]
        public JsonResult ActionAddPagesToRoles(string pages, string roles, bool type)
        {
            if (Session["User"] != null)
            {
                if (ModelState.IsValid)
                {
                    if (_RolePageRepo.AddPagesToRoles(pages, roles, Session["User"].ToString(), type))
                    {
                        List<ConfigurationPages> CostumModel = new List<ConfigurationPages>();
                        var list = (dynamic)null;
                        list = _PageMasterRepo.GetAllPagesOfRole(roles);
                        foreach (var item in list)
                        {
                            ConfigurationPages ite = new ConfigurationPages();
                            ite.page_id = item.page_id;
                            ite.page_name = item.page_name;
                            ite.description = item.description;
                            CostumModel.Add(ite);
                        }
                        var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                        });
                        return Json(new { success = true, Json = json, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "Ocurrió un error al registrar los datos.!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
                    return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas" + errors + "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }

        //Quitamos paginas a el rol 
        [HttpPost]
        public JsonResult ActionRemovePagesFromRoles(string pages, string roles, bool type)
        {
            if (Session["User"] != null)
            {
                if (ModelState.IsValid)
                {
                    if (_RolePageRepo.RemovePagesFromRoles(pages, roles, type))
                    {
                        List<ConfigurationPages> CostumModel = new List<ConfigurationPages>();
                        var list = (dynamic)null;
                        list = _PageMasterRepo.GetAllPagesOfRole(roles);
                        foreach (var item in list)
                        {
                            ConfigurationPages ite = new ConfigurationPages();
                            ite.page_id = item.page_id;
                            ite.page_name = item.page_name;
                            ite.description = item.description;
                            CostumModel.Add(ite);
                        }
                        var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                        });
                        return Json(new { success = true, Json = json, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "Ocurrió un error al registrar los datos.!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
                    return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas " + errors + "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }

        //Obtenemos todos los roles del usuario
        [HttpGet]
        public JsonResult ActionGetAllRolesOfUser(ConfigurationAddPagesUser User, String Site)
        {
            List<ConfigurationRoles> CostumModel = new List<ConfigurationRoles>();
            var list = (dynamic)null;
            list = _RoleUserRepo.GetAllRolesOfUser(User.EmployeeNumber);
            foreach (var item in list)
            {
                ConfigurationRoles ite = new ConfigurationRoles();
                ite.role_id = item.role_id;
                ite.role_name = item.role_name;
                ite.role_description = item.role_description;
                CostumModel.Add(ite);
            }
            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            });
            return Json(new { success = true, Json = json }, JsonRequestBehavior.AllowGet);
        }

        //Obtenemos todos los roles disponibles 
        [HttpGet]
        public JsonResult ActionGetAllRolesAvailable(ConfigurationAddPagesUser User, string Site)
        {
            List<ConfigurationRoles> CostumModel = new List<ConfigurationRoles>();
            var list = (dynamic)null;
            var status_user = (dynamic)null;
            list = _RoleUserRepo.GetAllRolesAvailable(User.EmployeeNumber);
            status_user = _sysUserPwdBusiness.GetUserPwdByEmployeeNumber(User.EmployeeNumber);
            var departmentId = (dynamic)null;
            var department = _userMasterRepo.GetUserMasterByEmployeeNumber(User.EmployeeNumber);
            if (department == null)
                departmentId = 0;
            else
                departmentId = department.department_id;

            foreach (var item in list)
            {
                ConfigurationRoles ite = new ConfigurationRoles();
                ite.role_id = item.role_id;
                ite.role_name = item.role_name;
                ite.role_description = item.role_description;
                CostumModel.Add(ite);
            }
            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            });
            return Json(new { success = true, Json = json, Status = status_user.status, department = departmentId }, JsonRequestBehavior.AllowGet);
        }

        //Actualizamos su estatus
        public JsonResult ActionUpdateStatus(string user, string statusUser, string Site)
        {
            if (Session["User"] != null)
                return Json(new { success = true, responseText = _sysUserPwdBusiness.UpdateStatusUser(user, statusUser, Site) }, JsonRequestBehavior.AllowGet);

            return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }
       
        //Actualizamos su departamento del usuario
        public JsonResult ActionUpdateDepartament(string user, int department)
        {
            if (Session["User"] != null)
                return Json(new { success = true, responseText = _userMasterRepo.UpdateDepartmentUser(user, department, Session["User"].ToString()) }, JsonRequestBehavior.AllowGet);

            return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }

        //Asignamos paginas a el rol 
        [HttpPost]
        public JsonResult ActionAddRolesToUser(string EmployeeNumber, string roles, string Site)
        {
            if (Session["User"] != null)
            {
                if (ModelState.IsValid)
                {
                    var list = (dynamic)null;
                    var returnStatus = (dynamic)null;
                    returnStatus = _RoleUserRepo.AddRolesToUser(EmployeeNumber, roles, Session["User"].ToString());
                    list = _RoleUserRepo.GetAllRolesAvailable(EmployeeNumber);
                    if (returnStatus)
                    {
                        List<ConfigurationRoles> CostumModel = new List<ConfigurationRoles>();
                        foreach (var item in list)
                        {
                            ConfigurationRoles ite = new ConfigurationRoles();
                            ite.role_id = item.role_id;
                            ite.role_name = item.role_name;
                            ite.role_description = item.role_description;
                            CostumModel.Add(ite);
                        }
                        var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                        });
                        return Json(new { success = true, Json = json, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "Ocurrió un error al registrar los datos.!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
                    return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas " + errors + "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }

        //Quitamos paginas a el rol 
        [HttpPost]
        public JsonResult ActionRemoveRolesFromUser(string EmployeeNumber, string roles, string Site)
        {
            if (Session["User"] != null)
            {
                if (ModelState.IsValid)
                {
                    var list = (dynamic)null;
                    var returnStatus = (dynamic)null;
                    returnStatus = _RoleUserRepo.RemoveRolesFromUser(EmployeeNumber, roles);
                    list = _RoleUserRepo.GetAllRolesAvailable(EmployeeNumber);
                    if (returnStatus)
                    {
                        List<ConfigurationRoles> CostumModel = new List<ConfigurationRoles>();

                        foreach (var item in list)
                        {
                            ConfigurationRoles ite = new ConfigurationRoles();
                            ite.role_id = item.role_id;
                            ite.role_name = item.role_name;
                            ite.role_description = item.role_description;
                            CostumModel.Add(ite);
                        }
                        var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                        });
                        return Json(new { success = true, Json = json, responseText = "Registro Exitoso!" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                        return Json(new { success = false, responseText = "Ocurrió un error al registrar los datos.!" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var errors = ModelState.Select(x => x.Value.Errors).Where(y => y.Count > 0).ToList();
                    return Json(new { success = false, responseText = "Error Desconocido, contacte a sistemas " + errors + "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, responseText = "Termino tu sesión.!" }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ActionGetAllPagesByType(bool type)
        {
            var list = (dynamic)null;
            List<ConfigurationPages> CostumModel = new List<ConfigurationPages>();
            list = _PageMasterRepo.GetAllPagesAdmin();
            foreach (var item in list)
            {
                ConfigurationPages ite = new ConfigurationPages
                {
                    page_id = item.page_id,
                    page_name = item.page_name,
                    description = item.description,
                    url = item.url,
                    active_flag = item.active_flag
                };
                CostumModel.Add(ite);
            }
            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            });
            return Json(new { success = true, Json = json }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ActionGetAllRolesByType(bool type)
        {
            var list = (dynamic)null;
            List<ConfigurationRoles> CostumModel = new List<ConfigurationRoles>();
            list = _RoleMasterRepo.GetAllRolesAdmin();
            foreach (var item in list)
            {
                ConfigurationRoles ite = new ConfigurationRoles
                {
                    role_id = item.role_id,
                    role_name = item.role_name,
                    role_description = item.role_description,
                    active_flag = item.active_flag
                };
                CostumModel.Add(ite);
            }
            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            });
            return Json(new { success = true, Json = json }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult ActionGetAllUsersFromStore(string Site)
        {
            var list = (dynamic)null;
            List<ConfigurationUsers> CostumModel = new List<ConfigurationUsers>();
            list = _userMasterRepo.GetAllUsers();
            foreach (var item in list)
            {
                ConfigurationUsers ite = new ConfigurationUsers
                {
                    EmployeeNumber = item.emp_no,
                    userName = item.user_name,
                    FullName = item.first_name + " " + item.last_name,

                };
                CostumModel.Add(ite);
            }

            var json = JsonConvert.SerializeObject(CostumModel, Formatting.Indented, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            });
            // return Json(new { success = true, Json = json }, JsonRequestBehavior = JsonRequestBehavior.AllowGet, MaxJsonLength = Int32.MaxValue };
            return new JsonResult() { Data = new { success = true, Json = json }, JsonRequestBehavior = JsonRequestBehavior.AllowGet, MaxJsonLength = Int32.MaxValue };
        }       
    }
}