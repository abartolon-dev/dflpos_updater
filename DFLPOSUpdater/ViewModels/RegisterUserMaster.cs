using App.Common;
using App.Entities;
using System;

namespace DFLPOSUpdater.ViewModels
{
    public class RegisterUserMaster
    {
        #region attributes
        public string EmployeeNumber { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Cellphone { get; set; }
        public string Password { get; set; }
        public string RepeatPassword { get; set; }
        public DateTime DateOfBirth { get; set; }
        public byte[] photo { get; set; }
        public string FinalPassword { get { return Common.SetPassword(Password); } }
        #endregion
        #region Object

        public USER_MASTER Employee { get { return new USER_MASTER { emp_no = EmployeeNumber, user_name = Username, first_name = FirstName, last_name = LastName, email = Email, office_tel = Phone, mobile_tel = Cellphone, birth_date = DateOfBirth, join_date = DateTime.Now, cdate = DateTime.Now, cuser = Username ,program_id="Register.cshtml" }; } }
        public USER_PWD EmployeePwd { get { return new USER_PWD { emp_no = EmployeeNumber, cdate = DateTime.Now, cuser = Username, status = "P", password = FinalPassword, valid_from = DateTime.Now, valid_to = DateTime.Now.AddMonths(6) }; } }
        public USER_MASTER EmployeeUpdate { get { return new USER_MASTER { emp_no = EmployeeNumber, user_name = Username, first_name = FirstName, last_name = LastName, email = Email, office_tel = Phone, mobile_tel = Cellphone, birth_date = DateOfBirth , photo = photo }; } }
        #endregion
    }
}