using Microsoft.AspNet.Identity.EntityFramework;
using mvc_styleguide.Models.Interfaces;

namespace mvc_styleguide.Models
{
    public class MyModel : IButton {
        public string Body { get; set; }
        public string Title { get; set; }
    }


}