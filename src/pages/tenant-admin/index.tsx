import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import TenantsManagementDashboard from "layouts/pages/tenants/tenantsmanagement/tenantsDashboard";

function TenantAdminPage() {
 
  const selectedTenant = { id: "1", name: "Demo Şirketi" };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TenantsManagementDashboard showDashboard={true} selectedTenant={selectedTenant} onReturn={() => {}} />
      <Footer />
    </DashboardLayout>
  );
}

export default TenantAdminPage;
