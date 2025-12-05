using App.Common;

namespace DFLPOSUpdater.ViewModels
{
    public class LoginViewModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FinalPassword { get { return Common.SetPassword(Password); } }
        public string UsernamePV { get; set; }
    }
}