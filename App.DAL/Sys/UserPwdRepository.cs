using App.Entities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;

public class UserPwdRepository
{
    private DFLPOS_UPDATEREntities _context;
    private SqlConnection objConn = null;
    private static string sSql = "";
    private static SqlCommand SQLcmd = null;
    private string connSql = ConfigurationManager.ConnectionStrings["DFLSAIEntities"].ToString();
    public UserPwdRepository()
    {
        _context = new DFLPOS_UPDATEREntities();
    }

    public USER_PWD GetUserPwdByEmployeeNumber(string employeeNumber)
    {
        return _context.USER_PWD.FirstOrDefault(x => x.emp_no == employeeNumber);
    }
    
    public int UpdateUserPwd(USER_PWD user)
    {
        _context.Entry(user).State = System.Data.Entity.EntityState.Modified;
        return _context.SaveChanges();
    }
    public string UpdateStatusUser(string userNumber, string statusUser, string Sitecode)
    {
        var itemReturn = (dynamic)null;
        try
        {
            var user = _context.USER_PWD.FirstOrDefault(x => x.emp_no == userNumber);
            user.status = statusUser;
            user.failed_attempts = 0;
            user.last_logon = DateTime.Now;
            _context.SaveChanges();
            return "1";

        }
        catch (Exception e)
        {
            return e.Message + "En tienda " + itemReturn;
        }

    }

}
