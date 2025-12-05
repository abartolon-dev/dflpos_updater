using App.Entities;
using System;

namespace App.DAL.Sys
{
    public class SysLogRepository
    {
        private DFLPOS_UPDATEREntities _context;

        public SysLogRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }

        public bool CreateLogStampDocuments(SYS_LOG Item)
        {
            try
            {
                _context.SYS_LOG.Add(Item);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
                return false;
            }
        }
    }
}
