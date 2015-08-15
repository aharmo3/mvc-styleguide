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
                        "~/Scripts/thirdParty/jquery-1.10.2.min.js"));


            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/thirdParty/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/vcom_basebundle").Include(
                      "~/Scripts/vcom_basebundle.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/thirdParty/bootstrap.css",
                      "~/Content/site.css"));

        }
    }
}
