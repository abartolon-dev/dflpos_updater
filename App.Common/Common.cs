using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace App.Common
{
    public class Common
    {
        public static string CURRENCY_DEFAULT = "MXN";
        public static string USER = ConfigurationManager.AppSettings["userEmail"].ToString();
        public static string HOST = ConfigurationManager.AppSettings["hostEmail"].ToString();
        public static int PORT = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());

        public bool GetTimeOutFromDatabase()
        {
            try
            {
                DateTime DT1 = DateTime.Now;
                Stopwatch curren_watch = new Stopwatch();
                curren_watch.Start();
                if (DT1.Minute == 0)
                {
                    while (curren_watch.Elapsed < TimeSpan.FromSeconds(59))
                    {
                        DateTime DT2 = DateTime.Now;
                        if (DT1.Minute == 1)
                            break;
                    }
                    curren_watch.Stop();
                }
                return true;
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return false;
            }
        }
        public static string SetPassword(string password)
        {
            return string.Join("", (new SHA1Managed().ComputeHash(Encoding.UTF8.GetBytes(password))).Select(x => x.ToString("X2")).ToArray());
        }
        public string MailMessageExpensiveGeneric(SendMail information, Stream stream)
        {
            string Return;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var message = new MailMessage();
                var urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_expense_generic.html");
                string text = File.ReadAllText(urlFile);
                //string text = System.IO.File.ReadAllText("C:\\inetpub\\FloridoERPTX\\FloridoERPTX\\Emails\\email_inventory_close.html");

                text = text.Replace("{Body}", information.body);
                text = text.Replace("{Title}", information.subject);
                information.body = HttpUtility.HtmlDecode(text);

                message.To.Add(information.email);
                message.From = new MailAddress(user, information.from);
                message.Subject = information.subject;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;

                var htmlBody = AlternateView.CreateAlternateViewFromString(
                   information.body, Encoding.UTF8, "text/html");

                message.AlternateViews.Add(
                    AlternateView.CreateAlternateViewFromString(string.Empty, new ContentType("text/plain")));

                message.AlternateViews.Add(htmlBody);

                var ct = new ContentType
                {
                    MediaType = MediaTypeNames.Application.Pdf,
                    Name = "Gastos_" + information.folio + ".pdf"
                };
                if (stream != null)
                {
                    stream.Position = 0;
                    Attachment pdfb64 = new Attachment(stream, ct);
                    pdfb64.ContentType.MediaType = MediaTypeNames.Application.Pdf;
                    message.Attachments.Add(pdfb64);
                }

                using (var smtp = new SmtpClient())
                {
                    var credential = new System.Net.NetworkCredential();
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;
                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = false;
                    smtp.Send(message);
                    message.Dispose();
                }
                Return = "success";
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }


        public static string MailMessageHtml(SendMail information)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var urlFile = HttpContext.Current.Server.MapPath(@"\Emails\email_template.html");
                using (var message = new MailMessage())
                {
                    string text = File.ReadAllText(urlFile);

                    text = text.Replace("{Title}", information.title);
                    text = text.Replace("{Body}", information.body);
                    if (information.buttonText != "" && information.buttonLink != "")
                        text = text.Replace("<a href=>{Buton}</a>", "<a href=" + information.buttonLink + ">" + information.buttonText + "</a>");
                    else
                        text = text.Replace("<a href=>{Buton}</a>", "");

                    information.body = HttpUtility.HtmlDecode(text);

                    message.To.Add(information.email);
                    message.From = new MailAddress(user, information.from);
                    message.Subject = information.subject;
                    message.IsBodyHtml = true;
                    message.Priority = MailPriority.High;

                    var htmlBody = AlternateView.CreateAlternateViewFromString(
                       information.body, Encoding.UTF8, "text/html");

                    message.AlternateViews.Add(
                        AlternateView.CreateAlternateViewFromString(string.Empty, new ContentType("text/plain")));

                    message.AlternateViews.Add(htmlBody);

                    using (var smtp = new SmtpClient())
                    {
                        var credential = new System.Net.NetworkCredential();
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = credential;
                        smtp.Host = host;
                        smtp.Port = port;
                        smtp.EnableSsl = true;
                        smtp.Send(message);
                    }
                    Return = "success";
                }
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }

        public string MailMessageTransferFixedAsset(SendMail information, Stream stream, List<string> ccmails)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var message = new MailMessage();
                string urlFile = HttpContext.Current.Server.MapPath(@"\Emails\email_transfer_fixed_asset.html");
                var text = System.IO.File.ReadAllText(urlFile);
                text = text.Replace("{date}", information.date);
                information.body = HttpUtility.HtmlDecode(text);

                message.To.Add(new MailAddress(information.email));
                foreach (var item in ccmails)
                {
                    message.CC.Add(new MailAddress(item));
                }
                message.From = new MailAddress(user, information.from);
                message.Subject = information.subject;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;

                var htmlBody = AlternateView.CreateAlternateViewFromString(information.body, Encoding.UTF8, "text/html");
                message.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(string.Empty, new System.Net.Mime.ContentType("text/plain")));
                message.AlternateViews.Add(htmlBody);

                var ct = new ContentType();
                ct.MediaType = MediaTypeNames.Application.Pdf;
                ct.Name = "transfer_fixed_asset.pdf";
                stream.Position = 0;
                Attachment pdfb64 = new Attachment(stream, ct);
                pdfb64.ContentType.MediaType = System.Net.Mime.MediaTypeNames.Application.Pdf;
                message.Attachments.Add(pdfb64);

                using (var smtp = new SmtpClient())
                {
                    var credential = new System.Net.NetworkCredential();
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;
                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = true;
                    smtp.Send(message);
                    message.Dispose();
                }
                Return = "success";
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }
        public string MailMessageServicesCalendar(SendMail information, Stream stream)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var message = new MailMessage();
                string urlFile = HttpContext.Current.Server.MapPath(@"\Emails\email_services_calendar.html");
                var text = System.IO.File.ReadAllText(urlFile);
                text = text.Replace("{date}", information.date);
                information.body = HttpUtility.HtmlDecode(text);

                message.To.Add(new MailAddress(information.email));
                message.From = new MailAddress(user, information.from);
                message.Subject = information.subject;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;

                var htmlBody = AlternateView.CreateAlternateViewFromString(information.body, Encoding.UTF8, "text/html");
                message.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(string.Empty, new System.Net.Mime.ContentType("text/plain")));
                message.AlternateViews.Add(htmlBody);

                var ct = new ContentType();
                ct.MediaType = MediaTypeNames.Application.Pdf;
                ct.Name = "servicio_programado.pdf";
                stream.Position = 0;
                Attachment pdfb64 = new Attachment(stream, ct);
                pdfb64.ContentType.MediaType = System.Net.Mime.MediaTypeNames.Application.Pdf;
                message.Attachments.Add(pdfb64);

                using (var smtp = new SmtpClient())
                {
                    var credential = new System.Net.NetworkCredential();
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;
                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = true;
                    smtp.Send(message);
                    message.Dispose();
                }
                Return = "success";
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }

        public string MailMessageServicesCalendartoSupplier(SendMail information, Stream stream)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var message = new MailMessage();
                string urlFile = HttpContext.Current.Server.MapPath(@"\Emails\email_services_calendarToSupplier.html");
                var text = System.IO.File.ReadAllText(urlFile);
                text = text.Replace("{proveedor}", information.supplier);
                text = text.Replace("{date}", information.date);
                text = text.Replace("{store}", information.store);
                information.body = HttpUtility.HtmlDecode(text);

                message.To.Add(new MailAddress(information.email));
                message.From = new MailAddress(user, information.from);
                message.Subject = information.subject;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;

                var htmlBody = AlternateView.CreateAlternateViewFromString(information.body, Encoding.UTF8, "text/html");
                message.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(string.Empty, new System.Net.Mime.ContentType("text/plain")));
                message.AlternateViews.Add(htmlBody);

                var ct = new ContentType();
                ct.MediaType = MediaTypeNames.Application.Pdf;
                ct.Name = "servicio_programado.pdf";
                stream.Position = 0;
                Attachment pdfb64 = new Attachment(stream, ct);
                pdfb64.ContentType.MediaType = System.Net.Mime.MediaTypeNames.Application.Pdf;
                message.Attachments.Add(pdfb64);

                using (var smtp = new SmtpClient())
                {
                    var credential = new System.Net.NetworkCredential();
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;
                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = true;
                    smtp.Send(message);
                    message.Dispose();
                }
                Return = "success";
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }

       

       


        public string MailLabelAndItems(SendMail information, bool history, bool allUsers)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var message = new MailMessage();
                string urlFile = "";
                var text = "";
                if (history)
                {
                    urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_item_history.html");
                    text = System.IO.File.ReadAllText(urlFile);
                    text = text.Replace("{item}", information.item);
                    text = text.Replace("{project}", information.project);
                    text = text.Replace("{etiqueta}", information.label);
                }
                else if (allUsers)
                {
                    urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_new_project.html");
                    text = System.IO.File.ReadAllText(urlFile);
                }
                else
                {
                    urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_items.html");
                    text = System.IO.File.ReadAllText(urlFile);
                    text = text.Replace("{etiqueta}", information.label);
                }

                information.body = HttpUtility.HtmlDecode(text);

                message.To.Add(information.email);
                message.From = new MailAddress(user, information.from);
                message.Subject = information.subject;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;


                var htmlBody = AlternateView.CreateAlternateViewFromString(
                   information.body, Encoding.UTF8, "text/html");

                message.AlternateViews.Add(
                    AlternateView.CreateAlternateViewFromString(string.Empty, new System.Net.Mime.ContentType("text/plain")));

                message.AlternateViews.Add(htmlBody);

                using (var smtp = new SmtpClient())
                {
                    var credential = new System.Net.NetworkCredential();
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;
                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = false;
                    smtp.Send(message);
                    message.Dispose();
                }
                Return = "success";
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }

      
        public string MailAddItem(SendMail information)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var message = new MailMessage();
                string urlFile = "";
                var text = "";

                urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_items.html");
                text = System.IO.File.ReadAllText(urlFile);
                text = text.Replace("{etiqueta}", information.label);


                information.body = HttpUtility.HtmlDecode(text);

                message.To.Add(information.email);
                message.From = new MailAddress(user, information.from);
                message.Subject = information.subject;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;


                var htmlBody = AlternateView.CreateAlternateViewFromString(
                   information.body, Encoding.UTF8, "text/html");

                message.AlternateViews.Add(
                    AlternateView.CreateAlternateViewFromString(string.Empty, new System.Net.Mime.ContentType("text/plain")));

                message.AlternateViews.Add(htmlBody);

                using (var smtp = new SmtpClient())
                {
                    var credential = new System.Net.NetworkCredential();
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;
                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = false;
                    smtp.Send(message);
                    message.Dispose();
                }
                Return = "success";
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }
        public string MailMessageComboNew(SendMail information, string comboHead, string comboItems)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var message = new MailMessage();

                string urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_comboNew_items.html");
                var text = System.IO.File.ReadAllText(urlFile);
                text = text.Replace("{Body}", information.body);
                text = text.Replace("{Title}", information.subject);
                text = text.Replace("{ComboHead}", comboHead);
                text = text.Replace("{ComboDetail}", comboItems);

                information.body = HttpUtility.HtmlDecode(text);

                message.To.Add(information.email);
                message.From = new MailAddress(user, information.from);
                message.Subject = information.subject;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;


                var htmlBody = AlternateView.CreateAlternateViewFromString(
                   information.body, Encoding.UTF8, "text/html");

                message.AlternateViews.Add(
                    AlternateView.CreateAlternateViewFromString(string.Empty, new System.Net.Mime.ContentType("text/plain")));

                message.AlternateViews.Add(htmlBody);

                using (var smtp = new SmtpClient())
                {
                    var credential = new System.Net.NetworkCredential();
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;
                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = false;
                    smtp.Send(message);
                    message.Dispose();
                }
                Return = "success";
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }
        public string MailMessageGiftCardRequest(SendMail information, string typeCards, string infoGiftCardReq)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var message = new MailMessage();

                string urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_giftcard_request.html");
                var text = System.IO.File.ReadAllText(urlFile);
                text = text.Replace("{Body}", information.body);
                text = text.Replace("{Title}", information.subject);
                text = text.Replace("{TypeCard}", typeCards);
                text = text.Replace("{InfoRequest}", infoGiftCardReq);

                information.body = HttpUtility.HtmlDecode(text);

                message.To.Add(information.email);
                message.From = new MailAddress(user, information.from);
                message.Subject = information.subject;
                message.IsBodyHtml = true;
                message.Priority = MailPriority.High;


                var htmlBody = AlternateView.CreateAlternateViewFromString(
                   information.body, Encoding.UTF8, "text/html");

                message.AlternateViews.Add(
                    AlternateView.CreateAlternateViewFromString(string.Empty, new System.Net.Mime.ContentType("text/plain")));

                message.AlternateViews.Add(htmlBody);

                using (var smtp = new SmtpClient())
                {
                    var credential = new System.Net.NetworkCredential();
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = credential;
                    smtp.Host = host;
                    smtp.Port = port;
                    smtp.EnableSsl = false;
                    smtp.Send(message);
                    message.Dispose();
                }
                Return = "success";
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }
        public string MailMessageGiftCardDeletionRequest(SendMail information, string cardsList)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());                
                string urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_giftcard_deletion_request.html");
                using (var message = new MailMessage())
                {
                    string text = File.ReadAllText(urlFile);

                    text = text.Replace("{Title}", information.title);
                    text = text.Replace("{Body}", information.body);
                    text = text.Replace("{CardsList}", cardsList);
                    text = text.Replace("{Button}", information.buttonLink);
                    //if (information.buttonText != "" && information.buttonLink != "")
                    //    text = text.Replace("<a href=>{Buton}</a>", "<a href=" + information.buttonLink + ">" + information.buttonText + "</a>");
                    //else
                    //    text = text.Replace("<a href=>{Buton}</a>", "");

                    information.body = HttpUtility.HtmlDecode(text);

                    message.To.Add(information.email);
                    message.From = new MailAddress(user, information.from);
                    message.Subject = information.subject;
                    message.IsBodyHtml = true;
                    message.Priority = MailPriority.High;

                    var htmlBody = AlternateView.CreateAlternateViewFromString(
                       information.body, Encoding.UTF8, "text/html");

                    message.AlternateViews.Add(
                        AlternateView.CreateAlternateViewFromString(string.Empty, new ContentType("text/plain")));

                    message.AlternateViews.Add(htmlBody);

                    using (var smtp = new SmtpClient())
                    {
                        var credential = new System.Net.NetworkCredential();
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = credential;
                        smtp.Host = host;
                        smtp.Port = port;
                        smtp.EnableSsl = true;
                        smtp.Send(message);
                    }
                    Return = "success";
                }
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }
        static public string DecryptData(string key, string encrypted_cadena)
        {
            byte[] key_bytes = System.Text.ASCIIEncoding.ASCII.GetBytes(key);
            System.Security.Cryptography.DESCryptoServiceProvider DES = new System.Security.Cryptography.DESCryptoServiceProvider();
            DES.Key = key_bytes;
            DES.IV = key_bytes;
            System.IO.MemoryStream memoryStream = new System.IO.MemoryStream(Convert.FromBase64String(encrypted_cadena));
            System.Security.Cryptography.CryptoStream cryptoStream = new System.Security.Cryptography.CryptoStream(
                memoryStream, DES.CreateDecryptor(DES.Key, DES.IV), System.Security.Cryptography.CryptoStreamMode.Read);
            System.IO.StreamReader reader = new System.IO.StreamReader(cryptoStream);
            return reader.ReadToEnd();
        }
        static public string EncryptData(string key, string cadena)
        {
            byte[] key_bytes = System.Text.ASCIIEncoding.ASCII.GetBytes(key);
            System.Security.Cryptography.DESCryptoServiceProvider DES = new System.Security.Cryptography.DESCryptoServiceProvider();
            DES.Key = key_bytes;
            DES.IV = key_bytes;
            System.IO.MemoryStream memoryStream = new System.IO.MemoryStream();
            System.Security.Cryptography.CryptoStream cryptoStream = new System.Security.Cryptography.CryptoStream(
                            memoryStream, DES.CreateEncryptor(DES.Key, DES.IV), System.Security.Cryptography.CryptoStreamMode.Write);
            System.IO.StreamWriter writer = new System.IO.StreamWriter(cryptoStream);
            writer.Write(cadena);
            writer.Flush();
            cryptoStream.FlushFinalBlock();
            writer.Flush();
            return Convert.ToBase64String(memoryStream.GetBuffer(), 0, (int)memoryStream.Length);
        }


        public string MailUpdateBudget(SendMail information)
        {
            string Return = string.Empty;
            try
            {
                var user = ConfigurationManager.AppSettings["userEmail"].ToString();
                var host = ConfigurationManager.AppSettings["hostEmail"].ToString();
                var port = int.Parse(ConfigurationManager.AppSettings["portEmail"].ToString());
                var urlFile = System.Web.Hosting.HostingEnvironment.MapPath(@"\Emails\email_update_budget.html");

                using (var message = new MailMessage())
                {
                    string text = File.ReadAllText(urlFile);

                    text = text.Replace("{Title}", information.title);
                    text = text.Replace("{Body}", information.body);
                    if (information.buttonText != "" && information.buttonLink != "")
                        text = text.Replace("<a href=>{Buton}</a>", "<a href=" + information.buttonLink + ">" + information.buttonText + "</a>");
                    else
                        text = text.Replace("<a href=>{Buton}</a>", "");

                    information.body = HttpUtility.HtmlDecode(text);

                    message.To.Add(information.email);
                    message.From = new MailAddress(user, information.from);
                    message.Subject = information.subject;
                    message.IsBodyHtml = true;
                    message.Priority = MailPriority.High;

                    var htmlBody = AlternateView.CreateAlternateViewFromString(
                       information.body, Encoding.UTF8, "text/html");

                    message.AlternateViews.Add(
                        AlternateView.CreateAlternateViewFromString(string.Empty, new ContentType("text/plain")));

                    message.AlternateViews.Add(htmlBody);

                    using (var smtp = new SmtpClient())
                    {
                        var credential = new System.Net.NetworkCredential();
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = credential;
                        smtp.Host = host;
                        smtp.Port = port;
                        smtp.EnableSsl = true;
                        smtp.Send(message);
                    }
                    Return = "success";
                }
            }
            catch (Exception ex)
            {
                Return = ex.Message;
                return Return;
            }
            return Return;
        }

    }
}
