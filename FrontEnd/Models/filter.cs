using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrontEnd.Models
{
    public class filter : Pager
    {
        public string searchText { get; set; }
    }


    public class Pager
    {
        public int Page { get; set; }
        public int Take { get; set; }
        public int Skip { get { return Page * Take; } }
        public int TotalRegisters { get; set; }
        public int TotalPages { get { return TotalRegisters > 0 ? ((TotalRegisters + Take - 1) / Take) : 0; } }
    }
}
