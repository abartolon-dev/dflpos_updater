namespace DFLPOSUpdater.App_Start.Authentication
{
    public interface ISecurity
    {
        bool IsPageEnabled(string pageName);
        string Profile { get; set; }
    }
}