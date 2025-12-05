using App.Entities.ViewModels.Site;
using App.Entities.ViewModels.Versions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entities.ViewModels.Distribution
{

    [Table("DFLPOS_DISTRIBUTION")]
    public class DistributionModel
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("version_id")]
        public int VersionId { get; set; }

        [Required]
        [Column("site_id")]
        public int SiteId { get; set; }

        [Column("estate")]
        [StringLength(20)]
        public string Estate { get; set; }  // OK / Error

        [Column("message", TypeName = "nvarchar(max)")]
        public string Message { get; set; }

        [Column("cdate")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Navigation properties
        public VersionDto Version { get; set; }
        public SiteDto Site { get; set; }
    }
    public class VersionDto {
        public int Id;
        public string Name;
        public string VersionNumber;
        public string VersionDescription;
        public string VersionFiles;
        public DateTime VersionUploadDate;
    }
    public class SiteDto { 
        public int Id;
        public string Name;
        public string Ip;
        public string DestinationRoute;
    }

}
