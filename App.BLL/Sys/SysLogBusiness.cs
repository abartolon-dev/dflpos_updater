using App.DAL.Sys;
using App.Entities;

namespace App.BLL.SysLog
{
    public class SysLogBusiness
    {
        private SysLogRepository _SysLogRepository;

        public SysLogBusiness()
        {
            _SysLogRepository = new SysLogRepository();
        }
        public bool CreateLogRecord(SYS_LOG Item) => _SysLogRepository.CreateLogStampDocuments(Item);
    }
}
