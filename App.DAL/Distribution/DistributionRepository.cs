using App.Entities;
using App.Entities.ViewModels.Distribution;
using App.Entities.ViewModels.Site;
using App.Entities.ViewModels.Versions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.DAL.Distribution
{
    public class DistributionRepository
    {
        private DFLPOS_UPDATEREntities _context;
        public DistributionRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }
        public List<DistributionModel> GetHistoryByVersionId(int versionId)
        {
            var distributions = (from dist in _context.DFLPOS_DISTRIBUTION
                                 join ver in _context.DFLPOS_VERSIONS on dist.version_id equals ver.id
                                 join suc in _context.DFLPOS_SITES on dist.site_id equals suc.id
                                 where dist.version_id == versionId
                                 orderby dist.cdate descending
                                    select new DistributionModel
                                    {
                                        Id = dist.id,
                                        VersionId = dist.version_id ?? 0,
                                        SiteId = dist.site_id ?? 0,
                                        Estate = dist.estate,
                                        Message = dist.message,
                                        CreatedDate = dist.cdate ?? DateTime.Now,
                                        Version = new VersionDto { Id = ver.id, Name = ver.name, VersionNumber = ver.version },
                                        Site = new SiteDto { Id = suc.id, Name = suc.name, Ip = suc.ip }
                                    }
                                ).ToList();
            return distributions;
        }
        public List<DistributionModel> GetHistoryVersions()
        {
            var distributions = (from dist in _context.DFLPOS_DISTRIBUTION
                                 join ver in _context.DFLPOS_VERSIONS on dist.version_id equals ver.id
                                 join suc in _context.DFLPOS_SITES on dist.site_id equals suc.id                                
                                 orderby dist.cdate descending
                                 select new DistributionModel
                                 {
                                     Id = dist.id,
                                     VersionId = dist.version_id ?? 0,                        
                                     SiteId = dist.site_id ?? 0,
                                     Estate = dist.estate,
                                     Message = dist.message,
                                     CreatedDate = dist.cdate ?? DateTime.Now,
                                     Version = new VersionDto { 
                                         Id = ver.id,
                                         Name = ver.name, 
                                         VersionNumber = ver.version,
                                         VersionDescription = ver.description,
                                         VersionUploadDate = ver.upload_date.Value,
                                         VersionFiles = ver.files
                                     },
                                     Site = new SiteDto { 
                                         Id = suc.id,
                                         Name = suc.name,
                                         Ip = suc.ip,
                                         DestinationRoute = suc.destination_route
                                     }
                                 }
                                ).ToList();
            return distributions;
        }
        public DistributionModel GetDistributionById(int distributionId)
        {
            var distribution = _context.DFLPOS_DISTRIBUTION
                .Where(d => d.id == distributionId)
                .Select(dist => new DistributionModel
                {
                    Id = dist.id,
                    VersionId = dist.version_id ?? 0,
                    SiteId = dist.site_id ?? 0,
                    Estate = dist.estate,
                    Message = dist.message,
                    CreatedDate = dist.cdate ?? DateTime.Now,
                    Version = dist.DFLPOS_VERSIONS == null
                        ? null
                        : new VersionDto
                        {
                            Id = dist.DFLPOS_VERSIONS.id,
                            Name = dist.DFLPOS_VERSIONS.name,
                            VersionNumber = dist.DFLPOS_VERSIONS.version,
                            VersionDescription = dist.DFLPOS_VERSIONS.description,
                            VersionUploadDate = dist.DFLPOS_VERSIONS.upload_date.Value,
                            VersionFiles = dist.DFLPOS_VERSIONS.files
                        },
                    Site = dist.DFLPOS_SITES == null
                        ? null
                        : new SiteDto
                        {
                            Id = dist.DFLPOS_SITES.id,
                            Name = dist.DFLPOS_SITES.name,
                            Ip = dist.DFLPOS_SITES.ip,
                            DestinationRoute = dist.DFLPOS_SITES.destination_route
                        }
                })
                .FirstOrDefault();
            return distribution;
        }
        public VersionModel GetVersionById(int versionId)
        {
            var version = _context.DFLPOS_VERSIONS
                .Where(v => v.id == versionId)
                .Select(ver => new VersionModel
                {
                    Id = ver.id,
                    Name = ver.name,
                    VersionNumber = ver.version,
                    Files = ver.files,
                    UploadDate = ver.upload_date ?? DateTime.Now
                })
                .FirstOrDefault();
            return version;
        }
        public SitesDistributionModel GetSiteById(int siteId)
        {
            var site = _context.DFLPOS_SITES
                .Where(s => s.id == siteId)
                .Select(suc => new SitesDistributionModel
                {
                    Id = suc.id,
                    Name = suc.name,
                    Ip = suc.ip,
                    DestinationRoute = suc.destination_route
                })
                .FirstOrDefault();
            return site;
        }

    }
}
