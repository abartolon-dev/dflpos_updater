using App.Entities;
using System.Collections.Generic;
using System.Linq;
using App.Entities.ViewModels.MaCode;

namespace App.DAL.CommonAccess
{
    public class MaCodeRepository
    {
        private DFLSAIEntities _context;

        public MaCodeRepository()
        {
            _context = new DFLSAIEntities();
        }
        public List<MA_CODE> GetAllFixedAssetDepreciation()
        {
            return _context.MA_CODE.Where(x => x.code == "FIXED_ASSET_DEPRECIATION").ToList();
        }
        public List<MA_CODE> GetAllUM()
        {
            return _context.MA_CODE.Where(x => x.code == "UM").ToList();
        }
        public List<MA_CODE> GetAllCurrency()
        {
            return _context.MA_CODE.Where(x => x.code == "CURRENCY").ToList();
        }
        public List<MA_CODE> GetAllNegotiationDiscount()
        {
            return _context.MA_CODE.Where(x => x.code == "NEGOTIATON" && x.used =="2").ToList();
        }
        public List<MA_CODE> GetAllNegotiationPrice()
        {
            return _context.MA_CODE.Where(x => x.code == "NEGOTIATON" && x.used == "3").ToList();
        }
        public List<MA_CODE> GetAllNegotiationPoint()
        {
            return _context.MA_CODE.Where(x => x.code == "NEGOTIATON" && x.used == "1").ToList();
        }
        public List<MA_CODE> GetAllNegotiationPenalties()
        {
            return _context.MA_CODE.Where(x => x.code == "NEGOTIATON" && x.used == "4").ToList();
        }
        public List<MA_CODE> GetAllBuyerDivision()
        {
            return _context.MA_CODE.Where(x => x.code == "BUYER_DIVISION").ToList();
        }
        public List<MA_CODE> GetAllItemType()
        {
            return _context.MA_CODE.Where(x => x.code == "ITEM_TYPE").ToList();
        }
        public List<MA_CODE> GetAllCodeByCode(string code)
        {
            return _context.MA_CODE.Select(x => x).Where(x => x.code == code).ToList();
        }
        public List<MA_CODE> GetInternalCodeType()
        {
            return _context.MA_CODE.Select(x => x).Where(x => x.code == "INTERNAL_CODE_TYPE").ToList();
        }
        public List<MaCodeModel> GetAllCodeByCodeModel(string code)
        {
            return _context.MA_CODE.Select(x =>new MaCodeModel {
                VKey = x.vkey , code = x.code , description = x.description
            }).Where(x => x.code == code).ToList();
        }

        public List<MA_CODE> GetListCurrency()
        {
            var Currency = _context.MA_CODE.Where(x => x.code == "CURRENCY").ToList();

            return Currency;
        }

        public string GetEmailsByCode(string code_str)
        {
            var listEmails = _context.MA_CODE.Where(w => w.code == code_str && w.used == "1").ToList();
            if (listEmails != null)
                return string.Join(",", listEmails.Select(s => s.vkey).ToArray());
            return "";
        }

    }
}
