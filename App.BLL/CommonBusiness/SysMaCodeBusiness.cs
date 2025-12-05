using App.DAL.MaCode;
using App.Entities;
using System.Collections.Generic;
using System.Linq;

namespace App.BLL.CommonBusiness
{
    public class SysMaCodeBusiness
    {
        private MaCodeRepository _MaCodeRepo;

        //constructor
        public SysMaCodeBusiness()
        {
            _MaCodeRepo = new MaCodeRepository();
        }
       
        public string GetEmailsByCode(string code_str) => _MaCodeRepo.GetEmailsByCode(code_str);
        public List<MA_CODE> GetAllCodeByCode(string code)
        {
            return _MaCodeRepo.GetAllCodeByCode(code);
        }
    }
}
