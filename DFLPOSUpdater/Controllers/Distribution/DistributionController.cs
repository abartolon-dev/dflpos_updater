using App.BLL.Distribution;
using DFLPOSUpdater.ViewModels.Distributions;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace DFLPOSUpdater.Controllers.Distribution
{
    public class DistributionController : Controller
    {
        //private readonly ApplicationDbContext _db = new ApplicationDbContext();
        private readonly DistributionBusiness _distributionBusiness = new DistributionBusiness();
        public ActionResult History(int versionId)
        {
            var distribution = _distributionBusiness.GetHistoryByVersionId(versionId);
            var list = distribution.Select(d => new DistributionViewModel
            {
               DistributionId = d.Id,
                State = d.Estate,
                Message = d.Message,
                CreatedDate = d.CreatedDate,
                VersionId = d.Version.Id,
                VersionName = d.Version.Name,
                VersionNumber = d.Version.VersionNumber,
                VersionDescription = d.Version.VersionDescription,
                FileName = d.Version.VersionFiles,
                UploadDate = d.Version.VersionUploadDate,
                SiteId = d.Site.Id,
                SiteName = d.Site.Name,
                SiteIp = d.Site.Ip,
                DestinationRoute = d.Site.DestinationRoute,
            }).ToList();
            
            return View(list);
        }
        //[HttpPost]
        //public async Task<ActionResult> Enviar(int versionId)
        //{
        //    var version = _db.Versiones.Find(versionId);
        //    if (version == null)
        //        return HttpNotFound();

        //    string uploadsPath = Server.MapPath("~/Uploads/");
        //    string originalFile = Path.Combine(uploadsPath, version.Archivo);
        //    string zipPath = Path.ChangeExtension(originalFile, ".zip");

        //    // 🔹 1. Comprimir archivo antes de enviar
        //    using (var zip = ZipFile.Open(zipPath, ZipArchiveMode.Create))
        //    {
        //        zip.CreateEntryFromFile(originalFile, Path.GetFileName(originalFile));
        //    }

        //    var sucursales = _db.Sucursales.ToList();
        //    var resultados = new ConcurrentBag<Distribucion>();

        //    // 🔹 2. Subir en paralelo a todas las sucursales
        //    await Task.WhenAll(sucursales.Select(suc => Task.Run(() =>
        //    {
        //        string resultado;
        //        string ftpUrl = $"ftp://{suc.Ip}/{suc.RutaDestino}/{Path.GetFileName(zipPath)}";
        //        var watch = System.Diagnostics.Stopwatch.StartNew();

        //        try
        //        {
        //            var request = (FtpWebRequest)WebRequest.Create(ftpUrl);
        //            request.Method = WebRequestMethods.Ftp.UploadFile;
        //            request.Credentials = new NetworkCredential(suc.UsuarioFtp, suc.ContrasenaFtp);
        //            request.UsePassive = true;
        //            request.UseBinary = true;
        //            request.KeepAlive = false;

        //            byte[] bytes = System.IO.File.ReadAllBytes(zipPath);
        //            using (var reqStream = request.GetRequestStream())
        //            {
        //                reqStream.Write(bytes, 0, bytes.Length);
        //            }

        //            using (var response = (FtpWebResponse)request.GetResponse())
        //            {
        //                resultado = $"OK - {response.StatusDescription.Trim()}";
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            resultado = $"Error - {ex.Message}";
        //        }

        //        watch.Stop();
        //        resultados.Add(new Distribucion
        //        {
        //            VersionId = versionId,
        //            SucursalId = suc.Id,
        //            Estado = resultado.StartsWith("OK") ? "OK" : "Error",
        //            Mensaje = $"{resultado} (Duración: {watch.Elapsed.TotalSeconds:F2}s)"
        //        });
        //    })));

        //    // 🔹 3. Guardar resultados en base de datos
        //    _db.Distribuciones.AddRange(resultados);
        //    await _db.SaveChangesAsync();

        //    TempData["Message"] = "✅ Distribución completada correctamente.";
        //    return RedirectToAction("Index", "Versiones");
        //}
    }
}
