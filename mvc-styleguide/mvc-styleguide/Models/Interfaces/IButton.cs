using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mvc_styleguide.Models.Interfaces
{
    public interface IButton
    {
        string Title { get; }
        bool hasDeleteBtn { get;  }
    }
}
