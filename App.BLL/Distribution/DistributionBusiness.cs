using App.DAL.Distribution;
using App.Entities.ViewModels.Distribution;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace App.BLL.Distribution
{
    public class DistributionBusiness
    {
        private readonly DistributionRepository _distributionRepository;
        public DistributionBusiness()
        {
            _distributionRepository = new App.DAL.Distribution.DistributionRepository();
        }
        public List<DistributionModel> GetHistoryByVersionId(int versionId) => _distributionRepository.GetHistoryByVersionId(versionId);
        public List<DistributionModel> GetHistoryVersions() => _distributionRepository.GetHistoryVersions();      

    }
}
