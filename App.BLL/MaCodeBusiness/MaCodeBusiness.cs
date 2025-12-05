using App.DAL.MaCode;
using App.Entities;
using App.Entities.ViewModels.Site;
using System.Collections.Generic;

namespace App.BLL.MaCode
{
    public class MaCodeBusiness
    {
        private MaCodeRepository _MaCodeRepository;


        public MaCodeBusiness()
        {
            _MaCodeRepository = new MaCodeRepository();
        }
        public string GetDistrictCodeByEmpNo(string emp_no) => _MaCodeRepository.GetDistrictCodeByEmpNo(emp_no);
    
        public List<MA_CODE> GetListByCode(string code)
        {
            return _MaCodeRepository.GetListByCode(code);
        }

        public List<MA_CODE> GetListGeneric(string Generic) => _MaCodeRepository.GetListGeneric(Generic);
     
        public List<MA_CODE> GetListGenericWithLike(string Generic) => _MaCodeRepository.GetListGenericWithLike(Generic);

        public int GetDaysDevolutionsAndNCs(string current_rfc, string rfc_import) => _MaCodeRepository.GetDaysDevolutionsAndNCs(current_rfc, rfc_import);

        public string GetBuyerDivisionSistemas()
        {
            return _MaCodeRepository.GetBuyerDivisionSistemas();
        }

    

        public string GetEmailsPriceChange()
        {
            return _MaCodeRepository.GetEmailsPriceChange();
        }
        public string GetEmailsByCode(string code_str) => _MaCodeRepository.GetEmailsByCode(code_str);
        public bool GetButtonApp() => _MaCodeRepository.GetButtonApp();

        public bool GetMaCodeValidate(string code) => _MaCodeRepository.GetMaCodeValidate(code);
        public int GetPermissonUpdateXML(string user) => _MaCodeRepository.GetPermissonUpdateXML(user);
        public bool GetAndSetSupplierXML(string rfc, string business_name, int status, string uuser) => _MaCodeRepository.GetAndSetSupplierXML(rfc, business_name, status, uuser);

        public List<MA_CODE> GetListXMLSites() => _MaCodeRepository.GetListXMLSites();

        public ListSitePosition GetPositionSites(int count_sites) => _MaCodeRepository.GetPositionSites(count_sites);

        public int GetPermisionXML(string rfc_supplier) => _MaCodeRepository.GetPermisionXML(rfc_supplier);
        public List<MA_CODE> GetListFromMaCode(string code) => _MaCodeRepository.GetListFromMaCode(code);
    
      
        public List<MA_CODE> GetListByCodeFilter(string code, string filter)
        {
            return _MaCodeRepository.GetListByCodeFilter(code, filter);
        }
    }
}
