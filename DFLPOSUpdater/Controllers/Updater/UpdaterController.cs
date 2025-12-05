using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DFLPOSUpdater.Controllers.Updater
{
    public class UpdaterController : Controller
    {
        // GET: Updater
        public ActionResult Index()
        {
            return View();
        }

        // GET: Updater/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Updater/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Updater/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Updater/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Updater/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Updater/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Updater/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
