using App.Entities;
using App.Entities.ViewModels.Site;
using System;
using System.Collections.Generic;
using System.Linq;

namespace App.DAL.MaCode
{
    public class MaCodeRepository
    {
        private DFLSAIEntities _context;
 

        public MaCodeRepository()
        {
            _context = new DFLSAIEntities();

        }

      
        public string GetDistrictCodeByEmpNo(string emp_no)
        {
            string distric_code_complete = "";
            try
            {
                var user_info = _context.MA_CODE.Where(w => w.cuser == emp_no && w.code == "DISTRICT_EMAIL").FirstOrDefault();
                if (user_info != null)
                    distric_code_complete = "'" + user_info.vkey + "'";

                var user_info_vacation = _context.MA_CODE.Where(w => w.cuser == emp_no && w.code == "DISTRICT_EMAIL_VACATION").ToList();
                if (user_info_vacation != null)
                {
                    if (user_info_vacation.Count() > 0)
                    {
                        foreach (var item in user_info_vacation)
                        {
                            if (distric_code_complete == "")
                            {
                                distric_code_complete += "'" + item.vkey + "'";
                            }
                            else
                            {
                                distric_code_complete += ",'" + item.vkey + "'";
                            }
                        }
                    }
                }

                return distric_code_complete;
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return "";
            }
        }

        

        public List<MA_CODE> GetListByCode(string code)
        {
            var model = _context.MA_CODE.Where(x => x.code == code).ToList();

            return model;
        }
        public List<MA_CODE> GetListGeneric(string Generic)
        {
            var typeLocation = _context.MA_CODE.Where(x => x.code == Generic && x.used == "1").OrderBy(x => x.vkey_seq).ToList();
            return typeLocation;
        }

        

        public List<MA_CODE> GetListGenericWithLike(string Generic)
        {
            var typeLocation = _context.MA_CODE.Where(x => x.code.Contains(Generic) && x.used == "1").OrderBy(x => x.vkey_seq).ToList();
            return typeLocation;
        }

   
        public int GetDaysDevolutionsAndNCs(string current_rfc, string rfc_import)
        {
            if (rfc_import != "")
                current_rfc = rfc_import;
            var value = _context.MA_CODE.Where(w => w.code == "ACC031_DAYS_INFO" && w.vkey == current_rfc && w.used == "1").FirstOrDefault();
            if (value == null)
                return -720;
            else
                return -value.vkey_seq ?? -720;
        }

        public string GetBuyerDivisionSistemas()
        {
            var p999 = _context.MA_CODE.Where(w => w.code == "BUYER_DIVISION" && w.description == "Sistemas").SingleOrDefault();
            return p999.vkey;
        }

       
        public string GetEmailsPriceChange()
        {
            var listEmails = _context.MA_CODE.Where(w => w.code == "CHANGE_PRICE_EMAIL" && w.used == "1").ToList();
            if (listEmails != null)
                return string.Join(",", listEmails.Select(s => s.vkey).ToArray());
            return "";
        }

        public string GetEmailsByCode(string code_str)
        {
            var listEmails = _context.MA_CODE.Where(w => w.code == code_str && w.used == "1").ToList();
            if (listEmails != null)
                return string.Join(",", listEmails.Select(s => s.vkey).ToArray());
            return "";
        }

        public int GetPermissonUpdateXML(string user)
        {
            var value = _context.MA_CODE.Where(w => w.code == "XML_AVOIDABLE_SUPPLIERS_BUYER" && w.vkey == user && w.used == "1").FirstOrDefault();
            if (value == null)
                return 0;
            else
                return 1;
        }

        public bool GetMaCodeValidate(string code)
        {
            var value = _context.MA_CODE.Where(w => w.code == code && w.used == "1").FirstOrDefault();
            if (value == null)
                return false;
            else
                return true;
        }

        public bool GetButtonApp()
        {
            var value = _context.MA_CODE.Where(w => w.code == "PRICE_BUTTON_APP" && w.used == "1").FirstOrDefault();
            if (value == null)
                return true;
            else
                return false;
        }


        public bool GetAndSetSupplierXML(string rfc, string business_name, int status, string uuser)
        {
            try
            {
                var statusOriginal = _context.MA_CODE.Where(w => w.code == "XML_AVOIDABLE_SUPPLIERS" && w.vkey == rfc).FirstOrDefault();
                if (statusOriginal == null)
                {
                    if (status == 0)
                        return true; //No hay nada que actualizar
                    MA_CODE new_supplier = new MA_CODE();
                    new_supplier.code = "XML_AVOIDABLE_SUPPLIERS";
                    new_supplier.vkey = rfc;
                    new_supplier.vkey_seq = 1;
                    new_supplier.description = business_name;
                    new_supplier.used = "1";
                    new_supplier.program_id = "PURCH003";
                    new_supplier.cuser = uuser;
                    new_supplier.cdate = DateTime.Now;
                    _context.MA_CODE.Add(new_supplier);
                    _context.SaveChanges();
                    return true;
                }
                else
                {
                    if (statusOriginal.used == "0" && status == 0 || statusOriginal.used == "1" && status == 1)
                        return true; //No hay nada que actualizar
                    statusOriginal.used = status.ToString();
                    statusOriginal.program_id = "PURCH003";
                    statusOriginal.udate = DateTime.Now;
                    statusOriginal.uuser = uuser;
                    _context.SaveChanges();
                    return true;
                }
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return false;
            }

        }

        public List<MA_CODE> GetListXMLSites()
        {
            return _context.MA_CODE.Where(w => w.code == "XML_REQUIRED" && w.used == "1").OrderBy(o => o.vkey).ToList();
        }

        public ListSitePosition GetPositionSites(int count_sites)
        {
            ListSitePosition listposition = new ListSitePosition();
            listposition.first_column_for_column_3 = _context.MA_CODE.Where(w => w.description == "1_COLUMN_3" && w.code == "POSITION_LIST_SITES").FirstOrDefault().vkey_seq ?? 0;
            listposition.second_column_forcolumn_3 = _context.MA_CODE.Where(w => w.description == "2_COLUMN_3" && w.code == "POSITION_LIST_SITES").FirstOrDefault().vkey_seq ?? 0;
            listposition.first_column_for_column_4 = _context.MA_CODE.Where(w => w.description == "1_COLUMN_4" && w.code == "POSITION_LIST_SITES").FirstOrDefault().vkey_seq ?? 0;
            listposition.second_column_for_column_4 = _context.MA_CODE.Where(w => w.description == "2_COLUMN_4" && w.code == "POSITION_LIST_SITES").FirstOrDefault().vkey_seq ?? 0;
            listposition.third_column_for_column_4 = _context.MA_CODE.Where(w => w.description == "3_COLUMN_4" && w.code == "POSITION_LIST_SITES").FirstOrDefault().vkey_seq ?? 0;
            listposition.first_column_for_column_2_with_inputs = count_sites / 2;
            listposition.all_sites_actives = count_sites;
            return listposition;
        }
      
        public int GetPermisionXML(string rfc_supplier)
        {
            string site_code = "0004";
            var sitePermission = _context.MA_CODE.Where(w => w.code == "XML_REQUIRED" && w.vkey == site_code && w.used == "1").FirstOrDefault();
            if (sitePermission != null)
            {
                var supplierPermision = _context.MA_CODE.Where(w => w.code == "XML_AVOIDABLE_SUPPLIERS" && w.vkey == rfc_supplier && w.used == "1").FirstOrDefault();
                if (supplierPermision != null)
                    return 0; //No es requerido XML especificamente con este proveedor 
                else
                    return 1; //ES OBLIGATORIO XML
            }
            return 0; //No es requerido XML (Permite entrad con remision y XML)
        }


        public List<MA_CODE> GetListFromMaCode(string code)
        {
            var model = _context.MA_CODE.Where(x => x.code == code && x.used == "1").ToList();
            return model;
        }
        public List<MA_CODE> GetListByCodeFilter(string code, string filter)
        {
            var model = _context.MA_CODE.Where(x => x.code == code && x.vkey.Contains(filter)).ToList();
            return model;
        }

        public List<MA_CODE> GetAllCodeByCode(string code)
        {
            return _context.MA_CODE.Select(x => x).Where(x => x.code == code).ToList();
        }
    }
}
