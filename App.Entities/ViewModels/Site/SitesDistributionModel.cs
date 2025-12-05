using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entities.ViewModels.Site
{
    [Table("DFLPOS_SITES")]
    public class SitesDistributionModel
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [Column("ip")]
        [StringLength(100)]
        public string Ip { get; set; }

        [Column("ftp_user")]
        [StringLength(100)]
        public string FtpUser { get; set; }

        [Column("ftp_password")]
        [StringLength(100)]
        public string FtpPassword { get; set; }

        [Column("destination_route")]
        [StringLength(200)]
        public string DestinationRoute { get; set; }

        // Navigation property
        public virtual ICollection<DFLPOS_DISTRIBUTION> Distributions { get; set; }
    }
}
