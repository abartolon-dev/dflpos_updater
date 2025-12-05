using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entities.ViewModels.User
{
    public class UserDepartmentClass
    {
        public int ClassDepartmentId { get; set; }
        public string ClassName { get; set; }
        public string Description { get; set; }
        public int AdminOper { get; set; }
        public int LevelCategory { get; set; }
        public int ParentClass { get; set; }
        public bool ActiveFlag { get; set; }
        public int ColumnExpense { get; set; }
        public int ColumnAdvanced { get; set; }
        public string Cuser { get; set; }
        public DateTime Cdate { get; set; }
        public string Uuser { get; set; }
        public DateTime? Udate { get; set; }
        public string ProgramId { get; set; }
    }
}
