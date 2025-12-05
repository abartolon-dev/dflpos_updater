using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entities.ViewModels.Versions
{
    [Table("DFLPOS_VERSIONS")]
    public class VersionModel   
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [Column("version")]
        [StringLength(20)]
        public string VersionNumber { get; set; }

        [Column("files")]
        [StringLength(200)]
        public string Files { get; set; }

        [Column("upload_date")]
        public DateTime UploadDate { get; set; } = DateTime.Now;

        [Column("description", TypeName = "nvarchar(max)")]
        public string Description { get; set; }

        // Navigation property
        public virtual ICollection<DFLPOS_DISTRIBUTION> Distributions { get; set; }
    }
}
