using App.Entities;
using System;
using System.Data.SqlClient;
using System.Linq;

namespace App.DAL
{
    public class SysLogConnectionRepository
    {
        private DFLPOS_UPDATEREntities _context;

        public SysLogConnectionRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }

        public SYS_LOG_CONNECTION GetConnectionByEmployeeNumber(string employeeNumber)
        {
            try
            {
                var user = _context.SYS_LOG_CONNECTION.FirstOrDefault(x => x.emp_no == employeeNumber);
                return user;
            }
            catch(Exception ex)
            {
                var message = ex.Message;
                return null;
            }
        }

        public int AddSysLogConnection(SYS_LOG_CONNECTION logConnection)
        {
            try
            {
                _context.SYS_LOG_CONNECTION.Add(logConnection);
                return _context.SaveChanges();

            }
            catch(Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }
            
        }
        public int UpdateSession(SYS_LOG_CONNECTION logConnection)
        {
            try
            {
                _context.Entry(logConnection).State = System.Data.Entity.EntityState.Modified;
                return _context.SaveChanges();
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }
        }
    }
}
