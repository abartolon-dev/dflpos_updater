using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entities.ViewModels.Site
{
    public class ListSitesAmountQuantity
    {
        public string site_code { get; set; }
        public decimal site_amount { get; set; }
        public decimal site_iva_amount { get; set; }
        public decimal site_ieps_amount { get; set; }
        public decimal site_ivar_amount { get; set; }
        public decimal site_isrr_amount { get; set; }
        public decimal site_percent { get; set; }
        public decimal site_deductible_amount { get; set; }
        public decimal c_iva_deductible_amount { get; set; }
        public int department_id { get; set; }
    }
}
