using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(mvc_styleguide.Startup))]
namespace mvc_styleguide
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
