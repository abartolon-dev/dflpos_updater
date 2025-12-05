using App.Entities;

namespace App.DAL
{
    public class UserSitesRepository
    {
        private DFLPOS_UPDATEREntities _context;

        public UserSitesRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }
    }
}
