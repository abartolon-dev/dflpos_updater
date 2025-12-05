using App.BLL.Configuration;
using System;
namespace DFLPOSUpdater.App_Start.Authentication
{
    public class Profile
    {
        private SysPageMasterBusiness _PageMasterRepo;
        public Profile()
        {
            _PageMasterRepo = new SysPageMasterBusiness();
        }
        public bool IsPageEnabled(string pageName, string Perfil)
        {
            CheckCache(Perfil);

            bool result = false;
            try
            {
                System.Data.DataSet ds = (System.Data.DataSet)System.Web.HttpContext.Current.Cache.Get(Perfil);
                System.Data.DataView dv = new System.Data.DataView(ds.Tables[0]);
                dv.RowFilter = "url = '" + pageName + "'";
                if (dv.Count > 0)
                    result = true;
            }
            catch (Exception)
            {
            }
            return result;
        }
        public bool IsActionEnabled(string actionName, string Perfil)
        {
            CheckCache(Perfil);

            bool result = false;
            try
            {
                System.Data.DataSet ds = (System.Data.DataSet)System.Web.HttpContext.Current.Cache.Get(Perfil);
                System.Data.DataView dv = new System.Data.DataView(ds.Tables[0]);
                dv.RowFilter = "page_id='" + actionName + "'";
                if (dv.Count > 0)
                    result = true;
            }
            catch (Exception)
            {
            }

            return result;
        }
        //Checa cache
        private void CheckCache(string Profile)
        {
            try
            {
                if (System.Web.HttpContext.Current.Cache.Get(Profile) == null)
                    DFLPOSUpdater.App_Start.Authentication.UserCache.AddPaginasToCache(Profile, _PageMasterRepo.GetAllPagesOfUser(Profile), System.Web.HttpContext.Current); //_PageMasterRepo.GetAllPagesOfUser(Perfil), System.Web.HttpContext.Current);
            }
            catch (Exception )
            {
            }

        }
    }
}