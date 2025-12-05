
using App.DAL;
using App.Entities;
using App.Entities.ViewModels.SysInfo;
using App.Entities.ViewModels.User;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace App.BLL
{
    public class UserMasterBusiness
    {
        private UserMasterRepository _userMasterRepo;
        private UserPwdRepository _userPwdRepo;
        private SysRoleUserRepository _sysRoleUserRepository;

        //constructor
        public UserMasterBusiness()
        {
            _userMasterRepo = new UserMasterRepository();
            _userPwdRepo = new UserPwdRepository();
            _sysRoleUserRepository = new SysRoleUserRepository();
        }

        public int GetUserDepartment(string emp_no) => _userMasterRepo.GetUserDepartment(emp_no);
        public string GetUserDepartmentStr(int department_id) => _userMasterRepo.GetUserDepartmentStr(department_id);
        public List<UserDepartmentClass> GetAllUserDerpartmentInformation(int department_id) => _userMasterRepo.GetAllUserDerpartmentInformation(department_id);

        //functions
        public USER_MASTER GetUserMasterByEmployeeNumber(string employeeNumber)
        {
            return _userMasterRepo.GetUserMasterByEmployeeNumber(employeeNumber);
        }

        public USER_MASTER GetUserMasterByUsername(string username)
        {
            return _userMasterRepo.GetUserMasterByUsername(username);
        }

        public int GetUserMasterDeparment(string username)
        {
            var user = GetUserMasterByUsername(username);
            return (user.department_id ?? 0);
        }

        public USER_MASTER GetUserMasterByEmail(string email)
        {
            return _userMasterRepo.GetUserMasterByEmail(email);
        }

        public bool AddUserMaster(USER_MASTER user)
        {
            var check = false;
            var flag = _userMasterRepo.AddUserMaster(user);

            if (flag > 0) check = true;

            return check;
        }

        public bool IsPasswordCorrect(USER_MASTER user_master, string password)
        {
            bool check = false;
            string sha1Pass = Common.Common.SetPassword(password);

            if (user_master.USER_PWD.password.Equals(sha1Pass))
            {
                _userMasterRepo.ReloadCountUser(user_master);
                check = true;
            }

            return check;
        }

        public bool IsAccountBlocked(USER_MASTER user_master)
        {
            bool check = false;

            if (user_master.USER_PWD.status.Equals("B"))
            {
                check = true;
            }

            return check;
        }
        public bool IsAccountInactive(USER_MASTER user_master)
        {
            bool check = false;

            if (user_master.USER_PWD.status.Equals("I"))
                check = true;

            return check;
        }

        public bool IsAccountPending(USER_MASTER user_master)
        {
            bool check = false;

            if (user_master.USER_PWD.status.Equals("P"))
                check = true;

            return check;
        }

        public bool IsAccountUnsubscribed(USER_MASTER user_master)
        {
            bool check = false;

            if (user_master.USER_PWD.status.Equals("E"))
                check = true;

            return check;
        }

        public bool UpdateFailedAttempts(USER_MASTER user_master)
        {
            bool check = false;

            if (user_master.USER_PWD.failed_attempts < 5)
            {
                user_master.USER_PWD.failed_attempts += 1;
                user_master.USER_PWD.udate = DateTime.Now;
                UpdateUserMaster(user_master);
            }
            else if (user_master.USER_PWD.failed_attempts == 5 && user_master.USER_PWD.status != "B")
            {
                user_master.USER_PWD.status = "B";
                UpdateUserMaster(user_master);
                check = true;
            }
            else
            {
                check = true;
            }

            return check;
        }

        public bool EmployeeEmailExists(string email)
        {
            var check = false;
            var u = _userMasterRepo.GetUserMasterByEmail(email);
            if (u != null)
            {
                check = true;
            }

            return check;
        }

        public bool UpdateUserMaster(USER_MASTER user)
        {
            bool check = false;

            if (_userMasterRepo.UpdateUserMaster(user) > 0)
            {
                check = true;
            }

            return check;
        }

        public bool EmployeeUsernameExists(string username)
        {
            var check = false;
            var u = _userMasterRepo.GetUserMasterByUsername(username);
            if (u != null)
            {
                check = true;
            }

            return check;
        }

        public bool IsValidEmailAddress(string emailaddress)
        {
            try
            {
                Regex rx = new Regex(
                    @"^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@elflorido.com.mx$");
                var x = rx.IsMatch(emailaddress.ToLower());
                return x;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        public bool DeleteUserMaster(USER_MASTER user)
        {
            var check = false;
            if (_userMasterRepo.DeleteUserMaster(user) > 0) check = true;
            return check;
        }
       
        public bool IsRolonUser(string user_name, string role) => _userMasterRepo.IsRolonUser(user_name, role);
        public string IsRolConciliation(string user_name, string role) => _userMasterRepo.IsRolonConciliationUser(user_name, role);
                    
        public bool IsRolIDOnUser(string user_name, string role_id) => _userMasterRepo.IsRolIDOnUser(user_name, role_id);
        public string GetEmailsByRol(string role_id) => _userMasterRepo.GetEmailsByRol(role_id);
        public string EmailBossManager(int department_id) => _userMasterRepo.EmailBossManager(department_id);

        public USER_MASTER GetUserMasterByUsernameOrEmail(string usernameOrEmail)
        {
            return _userMasterRepo.GetUserMasterByUsernameOrEmail(usernameOrEmail);
        }
        public USER_MASTER GetUserMasterByUsernameOrEmpNo(string usernameOrNo)
        {
            return _userMasterRepo.GetUserMasterByUsernameOrEmpNo(usernameOrNo);
        }
        public USER_MASTER GetUserMasterByRecoveryPasswordCode(string code)
        {
            return _userMasterRepo.GetUserMasterByRecoveryPasswordCode(code);
        }

        public bool AddRecoveryCodePassword(USER_MASTER user)
        {
            string day = DateTime.Now.Day.ToString();
            string month = DateTime.Now.Month.ToString();
            string year = DateTime.Now.Year.ToString();
            string employeeNumber = user.emp_no;
            user.USER_PWD.pass_code = day + "" + month + "" + year + "" + employeeNumber;
            return UpdateUserMaster(user);
        }
        public List<USER_MASTER> GetAllUsers()
        {
            return _userMasterRepo.GetAllUsers();
        }
    
        public string getFirstLastName(string user_name)
        {
            return _userMasterRepo.getFirstLastName(user_name);
        }
        public bool DeletePicture(USER_MASTER model)
        {
            return _userMasterRepo.DeletePicture(model);
        }

        public List<SysPageMaster> GetPagesByUser(string emp_no)
        {
            return _sysRoleUserRepository.GetPagesByUser(emp_no);
        }

        public string GetBuyerDivision(string user_name)
        {
            return _sysRoleUserRepository.GetBuyerDivision(user_name);
        }

        public string GetEmailByUser(string user_name)
        {
            return _userMasterRepo.GetEmailByUser(user_name);
        }

        public string getCompleteName(string user_name)
        {
            return _userMasterRepo.getCompleteName(user_name);
        }
      
        public int UpdateDepartmentUser(string userNumber, int deparment, string uuser) => _userMasterRepo.UpdateDepartmentUser(userNumber, deparment, uuser);

        public bool IsInRole(string user_name, string role_id) => _userMasterRepo.IsInRole(user_name, role_id);
    }
}
