using System;
using App.DAL;
using App.Entities;

namespace App.BLL
{

    public class SysLogConnectionBusiness
    {
        private SysLogConnectionRepository _sysLogConnectionRepository;

        public SysLogConnectionBusiness()
        {
            _sysLogConnectionRepository = new SysLogConnectionRepository();
        }

        public SYS_LOG_CONNECTION GetConnectionByEmployeeNumber(string employeeNumber)
        {
            try
            {
                return _sysLogConnectionRepository.GetConnectionByEmployeeNumber(employeeNumber);
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                return null;
            }
        }

        public bool GetStatusSession(SYS_LOG_CONNECTION logConnection)
        {
            try
            {
                return Convert.ToBoolean(logConnection.conn_status);
            }
            catch(Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
        }

        public bool AddSysLogConnection(SYS_LOG_CONNECTION logConnection)
        {
            try
            {
                if (_sysLogConnectionRepository.AddSysLogConnection(logConnection) > 0) return true;
                else return false;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }

        }
        public bool UpdateSession(SYS_LOG_CONNECTION logConnection)
        {
            try
            {
                if (_sysLogConnectionRepository.UpdateSession(logConnection) > 0) return true;
                else return false;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
        }

    }

}