using App.DAL.Site;
using App.Entities.ViewModels.Site;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2010.Excel;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Security;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Xml;

namespace App.BLL.Site
{
    public class SiteConfigBusiness
    {
        private readonly SiteConfigRepository _siteConfigRepository;

        public SiteConfigBusiness()
        {
            _siteConfigRepository = new SiteConfigRepository();
        }

        public string GetSiteCode() => _siteConfigRepository.GetSiteCode();

        public string GetSiteCodeName() => _siteConfigRepository.GetSiteCodeName();

        public SiteConfigModel GetSiteCodeAddress() => _siteConfigRepository.GetSiteCodeAddress();

        public SiteConfigModel GetSiteConfigInfo() => _siteConfigRepository.GetSiteConfigInfo();

        public SiteConfigModel GetSiteConfig() => _siteConfigRepository.GetSiteConfig();

        public List<SiteModel> GetInfoSiteAutoUpdate(int number_process, List<SiteModel> sites)
        {
            string str_argument = "";
            if (number_process == 1)
                str_argument = "version";
            else if (number_process == 2)
                str_argument = "clients";
            string result = "";
            try
            {
                System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();
                startInfo.FileName = @"c:\Windows\System32\cmd.exe";
                startInfo.Verb = "runas";
                ///Path Local
                //startInfo.WorkingDirectory = @"E:\AngelPasillas\Repositorios\autoupdate_exe\autoupdate 2.0.publisher\autoupdate 2.0";

                ///Path Servidor//La carpeta hay que darle permisos compartiendo la carpeta a los usuarios: IIS_IUSRS, IUSR, NETWORK
                startInfo.WorkingDirectory = @"C:\inetpub\wwwroot\autoupdate 2.0";

                startInfo.Arguments = @"/c .\autoupdate.exe check " + str_argument;
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;
                System.Diagnostics.Process process = new System.Diagnostics.Process();
                process.StartInfo = startInfo;
                process.Start();

                while (!process.HasExited)
                {
                    result += process.StandardOutput.ReadToEnd();
                }

                List<string> id_list = result.Split(new[] { "\u001b" }, StringSplitOptions.None).ToList();
                string site_output = "";
                int StartIndex = 0;
                if (number_process == 1)
                {
                    foreach (var s in sites)
                    {
                        sites[sites.FindIndex(f => f.IpSite == s.IpSite)].SiteName += " (" + s.SiteCode + ")";
                        site_output = id_list.Where(x => x.Contains(s.IpSite)).FirstOrDefault();
                        if (site_output.Length > 28)
                        {
                            StartIndex = site_output.IndexOf("http://", 0);
                            site_output = site_output.Substring(0, StartIndex);
                            site_output = site_output.Replace("[0m", "");
                            site_output = site_output.Trim();
                            sites[sites.FindIndex(f => f.IpSite == s.IpSite)].SiteAutoUpdateLastDate = site_output;
                        }
                        site_output = "";
                    }
                }
                else if (number_process == 2)
                {
                    bool bit_service = false;
                    foreach (var s in sites)
                    {
                        site_output = id_list.Where(x => x.Contains(s.IpSite)).FirstOrDefault();
                        if (site_output.Length > 28)
                        {
                            if (site_output.Contains("Activo"))
                                bit_service = true;
                            else
                                bit_service = false;
                            sites[sites.FindIndex(f => f.IpSite == s.IpSite)].SiteAutoUpdateStatus = bit_service;
                        }
                        site_output = "";
                    }
                }
            }
            catch (Exception e)
            {
                result = e.Message;
            }
            return sites;
        }

        public List<SiteModel> GetInfoSiteAutoUpdateLastNew(List<SiteModel> sites)
        {
            string result = "";
            WebClient client = new WebClient();
            client.Encoding = Encoding.UTF8;

            string lastUpdate = "";
            string autoUpdate = "";
            string strPageCode = "";
            HtmlAgilityPack.HtmlDocument html = new HtmlAgilityPack.HtmlDocument();
            string query = "";
            string url = "";
            bool bit_service = false;

            try
            {
                query = $"//body/div/div/div/div[@id='DivTxtLastUpdate']";
                query = $"//body/div/div/div/div[@id='DivTxtAutoupdate']";
                foreach (var s in sites)
                {
                    sites[sites.FindIndex(f => f.IpSite == s.IpSite)].SiteName += " (" + s.SiteCode + ")";
                    url = "http://" + s.IpSite.Trim() + ":" + s.PortSite.Trim() + "/Home/Login";
                    lastUpdate = "";
                    autoUpdate = "";
                    strPageCode = "";
                    html = new HtmlAgilityPack.HtmlDocument();
                    try
                    {
                        strPageCode = client.DownloadString(url);
                        html.LoadHtml(strPageCode);

                        lastUpdate = html.GetElementbyId("DivTxtLastUpdate").GetAttributeValue("title", "");

                        autoUpdate = html.GetElementbyId("DivTxtAutoupdate").GetAttributeValue("title", "");
                    }
                    catch (Exception e)
                    {
                        result = e.Message;
                        continue;
                    }

                    if (lastUpdate != null)
                    {
                        if (lastUpdate.Length > 5)
                        {
                            sites[sites.FindIndex(f => f.IpSite == s.IpSite)].SiteAutoUpdateLastDate = GetLast(lastUpdate.Trim(), 21);
                        }
                    }
                    if (autoUpdate != null)
                    {
                        if (autoUpdate.Length > 5)
                        {
                            if (autoUpdate.Contains("RUNNING") || autoUpdate.Contains("CORRIENDO"))
                                bit_service = true;
                            else
                                bit_service = false;
                            sites[sites.FindIndex(f => f.IpSite == s.IpSite)].SiteAutoUpdateStatus = bit_service;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                result = e.Message;
            }
            return sites;
        }

        public class WebClientWithTimeout : WebClient
        {
            //10 secs default
            public int Timeout { get; set; } = 10000;

            //for sync requests
            protected override WebRequest GetWebRequest(Uri uri)
            {
                var w = base.GetWebRequest(uri);
                w.Timeout = Timeout; //10 seconds timeout
                return w;
            }

            //the above will not work for async requests :(
            //let's create a workaround by hiding the method
            //and creating our own version of DownloadStringTaskAsync
            public new async Task<string> DownloadStringTaskAsync(Uri address)
            {
                var t = base.DownloadStringTaskAsync(address);
                if (await Task.WhenAny(t, Task.Delay(Timeout)) != t) //time out!
                {
                    CancelAsync();
                }
                return await t;
            }
        }

        public string GetLast(string source, int tail_length)
        {
            try
            {
                if (tail_length >= source.Length)
                    return source;
                return source.Substring(source.Length - tail_length);
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return "";
            }
        }


        public string GetPathAutoUpdate(string Source)
        {
            string full_path = "";
            string orignal_path = "";
            try
            {
                string Start, End;
                if (Source.Contains("RUTA"))
                {
                    Start = "NOMBRE_RUTA_BINARIO";
                    End = "GRUPO_ORDEN_CARGA";
                }
                else
                {
                    Start = "BINARY_PATH_NAME";
                    End = "LOAD_ORDER_GROUP";
                }

                if (Source.Contains(Start) && Source.Contains(End))
                {
                    int StartIndex = Source.IndexOf(Start, 0) + Start.Length;
                    int EndIndex = Source.IndexOf(End, StartIndex);
                    full_path = Source.Substring(StartIndex, EndIndex - StartIndex);
                    full_path = full_path.Remove(0, 1);
                    EndIndex = full_path.IndexOf("exe", 0);
                    full_path = full_path.Substring(0, EndIndex + 3);
                    full_path = full_path.Replace("autoupdate.exe", "");//autoupdate.exe//svchost.exe
                    full_path = full_path.Trim();
                    if (full_path[0] == ':')
                        full_path = full_path.Remove(0, 1);
                    orignal_path = full_path + "logs";
                    full_path += "logs\\log.txt";
                    if (File.Exists(full_path))
                        return full_path;
                    else
                        full_path = "";
                    return full_path;
                }
            }
            catch (Exception e)
            {
                var msg = e.Message;
                full_path = msg;
            }
            full_path = "333";
            return full_path;
        }

    }
}