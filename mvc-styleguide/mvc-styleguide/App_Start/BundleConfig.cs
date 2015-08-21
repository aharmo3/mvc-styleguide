using System.Web;
using System.Web.Optimization;

namespace mvc_styleguide
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/bower_components/jquery/dist/jquery.js"));


            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/bower_components/bootstrap/dist/js/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/vcom_basebundle").Include(
                      "~/Scripts/vcom_basebundle.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/bower_components/bootstrap/dist/css/bootstrap.css",
                      "~/Content/site.css"));

        }
    }
}
