using System.Security.Principal;

namespace DFLPOSUpdater.App_Start.Authentication
{
    public class MyAuthPage : IPrincipal, ISecurity
    {
        Profile Perf = new Profile();
        private IIdentity _identity;
        private string[] _roles;
        private string _Profile;
        public MyAuthPage(IIdentity identity, string[] roles)
        {
            _identity = identity;
            _roles = roles;
        }
        public MyAuthPage(IIdentity identity, string[] roles, string Profile)
        {
            _identity = identity;
            _roles = roles;
            _Profile = Profile;
        }
        public MyAuthPage(IIdentity identity, string Profile)
        {
            _identity = identity;
            _Profile = Profile;
        }
        //Propiedad que utilizaremos para saber si el usuario tiene o no habilitado
        //el acceso a una determinada pagina
        public bool IsPageEnabled(string pageName)
        {
            return Perf.IsPageEnabled(pageName, this._Profile);
        }
        /// <summary>
        /// Propiedad con el Perfil del Usuario
        /// </summary>
        public string Profile
        {
            get
            {
                return _Profile;
            }
            set
            {
                _Profile = value;
            }
        }
        #region IPrincipal Members

        public IIdentity Identity
        {
            get
            {
                return _identity;
            }
        }
        public bool IsInRole(string role)
        {
            // TODO:  Add FormsPrincipal.IsInRole implementation
            return false;
        }
        public bool IsActionEnabled(string actionName)
        {
            return Perf.IsActionEnabled(actionName, this._Profile);
        }
        #endregion
    } //class
} //namespace
