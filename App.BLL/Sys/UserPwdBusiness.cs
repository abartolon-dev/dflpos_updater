using App.Entities;

namespace App.BLL
{
    public class UserPwdBusiness
    {
        private UserPwdRepository _userPwdRepo;

        //constructor
        public UserPwdBusiness()
        {
            _userPwdRepo = new UserPwdRepository();
        }

        //functions
        public USER_PWD GetUserPwdByEmployeeNumber(string employeeNumber)
        {
            return _userPwdRepo.GetUserPwdByEmployeeNumber(employeeNumber);
        }
     
        public bool UpdateUserPwd(USER_PWD user)
        {
            var check = false;
            if (_userPwdRepo.UpdateUserPwd(user) > 0) check = true;
            return check;
        }
        public string UpdateStatusUser(string user, string status,string Sitecode)
        {
            return _userPwdRepo.UpdateStatusUser(user, status, Sitecode);
        }
    }
}