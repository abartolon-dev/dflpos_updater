using App.Entities;

namespace App.DAL
{
    public class UserLoggingRepository
    {
        private DFLPOS_UPDATEREntities _context;

        public UserLoggingRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }
    }
}
