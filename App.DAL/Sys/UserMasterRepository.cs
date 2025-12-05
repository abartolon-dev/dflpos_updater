using App.Entities;
using App.Entities.ViewModels.User;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.Linq;

public class UserMasterRepository
{
    private DFLPOS_UPDATEREntities _context;
    private SqlConnection objConn = null;
    private static string sSql = "";
    private static SqlCommand SQLcmd = null;
    private string connSql = ConfigurationManager.ConnectionStrings["DFLSAIEntities"].ToString();
    //constructor
    public UserMasterRepository()
    {
        _context = new DFLPOS_UPDATEREntities();
    }

    //functions
    public USER_MASTER GetUserMasterByEmployeeNumber(string employeeNumber)
    {
        return _context.USER_MASTER.FirstOrDefault(x => x.emp_no == employeeNumber);
    }

    public USER_MASTER GetUserMasterByUserName(string username)
    {
        return _context.USER_MASTER.FirstOrDefault(x => x.user_name == username);
    }

    public int AddUserMaster(USER_MASTER user)
    {
        try
        {
            _context.USER_MASTER.Add(user);
            return _context.SaveChanges();

        }
        catch (Exception ex)
        {
            var msg = ex.Message;
            return 0;
        }

    }

    public USER_MASTER GetUserMasterByEmail(string email)
    {
        return _context.USER_MASTER.FirstOrDefault(x => x.email == email);
    }

    public USER_MASTER GetUserMasterByUsername(string username)
    {
        return _context.USER_MASTER.FirstOrDefault(x => x.user_name == username);
    }

    public int GetUserDepartment(string emp_no)
    {
        try
        {
            int department_id = _context.Database.SqlQuery<int>(@"
            SELECT TOP 1 ISNULL(ISNULL([sub_department],[department_id]),0) [department_id] FROM [DFLPOS_UPDATER].[DBO].[USER_MASTER] WHERE [user_name] = @user ",
                new SqlParameter("@user", emp_no)).FirstOrDefault();
            return department_id;
        }
        catch (Exception e)
        {
            var msg = e.Message;
            return 0;
        }
    }

    public string GetUserDepartmentStr(int department_id)
    {
        try
        {
            string department_str = _context.Database.SqlQuery<string>(@"
            SELECT ISNULL([class_name],'') [class_name] FROM [DFLPOS_UPDATER].[DBO].[MA_DEPARTMENT_CLASS] WHERE [class_department_id] =  @depart ",
                new SqlParameter("@depart", department_id)).FirstOrDefault();
            return department_str;
        }
        catch (Exception e)
        {
            var msg = e.Message;
            return "";
        }
    }
    public List<UserDepartmentClass> GetAllUserDerpartmentInformation(int department_id)
    {
        try
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            List<UserDepartmentClass> model = new List<UserDepartmentClass>();

            string query = @"SELECT [class_department_id] as [ClassDepartmentId]
              ,ISNULL([class_name],'') as [ClassName],ISNULL([description],'') as [Description]
              ,ISNULL([admin_oper],1) as [AdminOper] ,ISNULL([level_category],1) as [LevelCategory]
              ,ISNULL([parent_class],0) as [ParentClass],ISNULL([active_flag], CAST(0 AS BIT)) as [ActiveFlag]
              ,ISNULL([column_expense],0) as [ColumnExpense],ISNULL([column_advanced],0) as [ColumnAdvanced]
              ,ISNULL([cuser],'') as [Cuser] ,ISNULL([cdate],GETDATE()) as [Cdate]
              ,[uuser] as [Uuser] ,[udate] as [Udate] ,ISNULL([program_id],'') as [ProgramId]
                FROM [DFLPOS_UPDATER].[dbo].[MA_DEPARTMENT_CLASS] ";

            if (department_id > 0)
            {
                query += @" WHERE [class_department_id] = @depart ";

                parameters.Add(new SqlParameter("@depart", department_id));

                model = _context.Database.SqlQuery<UserDepartmentClass>(query, parameters).ToList();
            }
            else {
                model = _context.Database.SqlQuery<UserDepartmentClass>(query).ToList();
            }
            return model;
        }
        catch (Exception e)
        {
            var msg = e.Message;
            return new List<UserDepartmentClass>();
        }
    }


    public bool IsRolonUser(string user_name, string role)
    {
        if (user_name == "")
            return false;
        var count = _context.Database.SqlQuery<int>(@"
            select count(*) from SYS_ROLE_USER sru inner join SYS_ROLE_MASTER srm on srm.role_id = sru.role_id
            inner join USER_MASTER um on um.emp_no = sru.emp_no
            where role_name = @role_name and um.user_name = @user ", new SqlParameter("@role_name", role), new SqlParameter("@user", user_name)).SingleOrDefault();
        return count > 0;
    }
    public string IsRolonConciliationUser(string user_name, string role)
    {
        if (string.IsNullOrEmpty(user_name))
            return null;

        var roleId = _context.Database.SqlQuery<string>(@"
        select srm.role_id from SYS_ROLE_USER sru inner join SYS_ROLE_MASTER srm on srm.role_id = sru.role_id
        inner join USER_MASTER um on um.emp_no = sru.emp_no
        where srm.role_name = @role_name and um.user_name = @user",
            new SqlParameter("@role_name", role),
            new SqlParameter("@user", user_name)).SingleOrDefault();

        return roleId;
    }





    public string EmailBossManager(int department_id)
    {
        var email_manager = _context.Database.SqlQuery<string>(@"SELECT TOP 1 ISNULL(Email,'') Email FROM [vw_Email_Manager_Global_Provider] WHERE DepartmentId = @dep", new SqlParameter("@dep", department_id)).FirstOrDefault();
        if (string.IsNullOrWhiteSpace(email_manager))
            email_manager = "abartolon@elflorido.com.mx";
        else
            email_manager = email_manager.Replace(";", ",");
        return email_manager;
    }

    public bool IsRolIDOnUser(string user_name, string role_id)
    {
        if (user_name == "")
            return false;
        var count = _context.Database.SqlQuery<int>(@"
            select count(*) from SYS_ROLE_USER sru inner join SYS_ROLE_MASTER srm on srm.role_id = sru.role_id
            inner join USER_MASTER um on um.emp_no = sru.emp_no
            where srm.role_id  = @role_name and um.user_name = @user ", new SqlParameter("@role_name", role_id), new SqlParameter("@user", user_name)).SingleOrDefault();
        return count > 0;
    }

    public string GetEmailsByRol(string role_id)
    {
        var emails = _context.Database.SqlQuery<string>(@"
            SELECT ISNULL(STUFF((SELECT ',' + ISNULL(US.email,'') FROM SYS_ROLE_USER SRM JOIN USER_MASTER US ON US.emp_no = SRM.emp_no JOIN USER_PWD UP ON UP.emp_no = US.emp_no WHERE SRM.role_id = @role_name AND ISNULL(UP.status,'') <> 'E' FOR XML PATH('')),1,1,''),'') AS Email "
            , new SqlParameter("@role_name", role_id)).SingleOrDefault();
        return emails;
    }
    public USER_MASTER GetUserMasterByUsernameOrEmail(string usernameOrEmail)
    {
        try
        {
            return _context.USER_MASTER.FirstOrDefault(x => x.user_name == usernameOrEmail || x.email == usernameOrEmail);
        }
        //catch (EntityException ex)
        //{
        //    var msg = ex.Message;
        //    return null;
        //}
        catch (DbEntityValidationException e)
        {
            foreach (var eve in e.EntityValidationErrors)
            {
                Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                    eve.Entry.Entity.GetType().Name, eve.Entry.State);
                foreach (var ve in eve.ValidationErrors)
                {
                    Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                        ve.PropertyName, ve.ErrorMessage);
                }
            }
            throw;
        }
    }

    public USER_MASTER GetUserMasterByUsernameOrEmpNo(string usernameOrNo)
    {
        return _context.USER_MASTER
            .FirstOrDefault(x => x.user_name == usernameOrNo || x.emp_no == usernameOrNo);
    }

    public int DeleteUserMaster(USER_MASTER user)
    {
        _context.Entry(user).State = System.Data.Entity.EntityState.Deleted;
        return _context.SaveChanges();
    }

    public int UpdateUserMaster(USER_MASTER user)
    {
        _context.Entry(user).State = System.Data.Entity.EntityState.Modified;
        return _context.SaveChanges();
    }

    public USER_MASTER GetUserMasterByRecoveryPasswordCode(string code)
    {
        return _context.USER_MASTER.FirstOrDefault(x => x.USER_PWD.pass_code.Equals(code));
    }
    public List<USER_MASTER> GetAllUsers()
    {
        //return _context.USER_MASTER.Select(x => x).ToList();
        var count = _context.Database.SqlQuery<USER_MASTER>(@"select * from USER_MASTER").ToList();
        return count;
    }    
    public string getFirstLastName(string user_name)
    {
        var name = _context.USER_MASTER.Where(x => x.user_name == user_name).SingleOrDefault();
        if (name != null)
            return name.last_name + " " + name.first_name;
        else
            return "Error al buscar el nombre.";
    }

    public bool DeletePicture(USER_MASTER model)
    {
        try
        {
            model.photo = null;
            _context.SaveChanges();
            return true;
        }
        catch (Exception ex)
        {
            string msg = ex.Message;
            return false;
        }
    }

    public int ReloadCountUser(USER_MASTER user)
    {
        try
        {
            var User = _context.USER_PWD.Find(user.emp_no);
            User.failed_attempts = 0;
            return _context.SaveChanges();
        }
        catch (Exception ex)
        {
            var msg = ex.Message;
            return 0;
        }
    }

    public string GetEmailByUser(string user_name)
    {
        try
        {
            if (user_name != "")
            {
                var e = _context.USER_MASTER.Where(x => x.user_name == user_name).SingleOrDefault();
                return e.email;
            }
            else
                return "";
        }
        catch (Exception e )
        {
            return "";
        }
    }

    public string getCompleteName(string user_name)
    {
        var user = _context.USER_MASTER.Where(x => x.user_name == user_name).FirstOrDefault();
        if (user != null)
            return user.last_name + " " + user.first_name;
        else
            return user_name;
    }


    public int UpdateDepartmentUser(string userNumber, int deparment, string uuser)
    {
        try
        {
            var user = _context.USER_MASTER.FirstOrDefault(x => x.emp_no == userNumber);
            user.uuser = uuser;
            user.department_id = deparment;
            user.program_id = "ADMS0004";
            user.udate = DateTime.Now;
            _context.SaveChanges();
            return 1;
        }
        catch (Exception error)
        {
            var message = error.Message;
            return 0;
        }
    }    


    public bool IsInRole(string user_name, string role_id)
    {
        var any = (from ru in _context.SYS_ROLE_USER
                   join rm in _context.SYS_ROLE_MASTER on ru.role_id equals rm.role_id
                   join u in _context.USER_MASTER on ru.emp_no equals u.emp_no
                   where u.user_name == user_name
                         && rm.role_id == role_id
                   select u).Any();
        return any;
    }
}

