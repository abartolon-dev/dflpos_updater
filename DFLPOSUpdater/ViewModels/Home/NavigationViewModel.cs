using System.Data;

namespace DFLPOSUpdater.ViewModels.Home
{
    public class NavigationViewModel
    {
        public DataSet menu_user_dataset { get; set; }
        public string user_name { get; set; }
        public byte[] photo { get; set; }
    }
}