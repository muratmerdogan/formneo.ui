import { Card, Grid, Icon, Typography } from "@mui/material";
import { ObjectPage, ObjectPageTitle } from "@ui5/webcomponents-react";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusy } from "layouts/pages/hooks/useBusy";
import getConfiguration from "confiuration";
import {
  WorkCompanyApi,
  WorkCompanyTicketMatrisApi,
  WorkCompanyTicketMatrisListDto,
  LookupApi,
  LookupModuleDto,
  LookupCategoryDto,
  LookupItemDto,
} from "api/generated/api";
import { MessageBoxType } from "@ui5/webcomponents-react";
import { useAlert } from "layouts/pages/hooks/useAlert";
import MessageBox from "layouts/pages/Components/MessageBox";

function CompanyRelation() {
  const navigate = useNavigate();

  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const [data, setData] = useState([]);
  const [isQuestionMessageBoxOpen, setIsQuestionMessageBoxOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  // İlişki Türü Modal durumu
  const [isRelTypeModalOpen, setIsRelTypeModalOpen] = useState(false);
  const [relTypeForm, setRelTypeForm] = useState<LookupItemDto>({ code: "", name: "", orderNo: 0, isActive: true, externalKey: "" });
  const [isSubmittingRelType, setIsSubmittingRelType] = useState(false);

  useEffect(() => {
    fetchTableData(); // Artık sadece tabloyu getiriyoruz
  }, []);

  // Statik (manuel) sütunlar
  const columns = [
    {
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>Şirket</div>,
      accessor: "company",
    },
    {
      Header: (
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>
          İlişkili Şirketler
        </div>
      ),
      accessor: "relations",
    },
    {
      Header: <div style={{ fontSize: "16px", fontWeight: "bold", color: "black" }}>İşlemler</div>,
      accessor: "actions",
      Cell: ({ row }: any) => (
        <MDBox display="flex" alignItems="center">
          <>
            <Icon
              onClick={() => navigate(`/companyRelation/detail/${row.original.id}`)}
              sx={{ cursor: "pointer", fontSize: "24px" }}
              style={{ marginRight: "8px" }}
            >
              edit
            </Icon>
            <Icon
              sx={{ cursor: "pointer", fontSize: "24px" }}
              onClick={() => handleOpenQuestionBox(row.original.id)}
            >
              delete
            </Icon>
          </>
        </MDBox>
      ),
    },
  ];

  const fetchTableData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new WorkCompanyTicketMatrisApi(conf);
      const response = await api.apiWorkCompanyTicketMatrisGet();

      const mappedData = response.data.map((item) => {
        // DTO'dan isim alınıyor
        const fromCompany = item.fromCompany?.name || "-";
        const toCompanyObjects = item.toCompanies || [];

        const toCompanyNames = toCompanyObjects.map((company) => company.name);

        let displayedRelations;

        if (toCompanyNames.length > 3) {
          const firstThree = toCompanyNames.slice(0, 3).join(", ");
          const remaining = toCompanyNames.slice(3).join(", ");

          displayedRelations = (
            <>
              {firstThree},{" "}
              <Tooltip
                title={
                  <React.Fragment>
                    {remaining.split(", ").map((name, index) => (
                      <div key={index}>{name}</div>
                    ))}
                  </React.Fragment>
                }
              >
                <Chip
                  label={`+${toCompanyNames.length - 3}`}
                  size="small"
                  sx={{ cursor: "pointer", backgroundColor: "#e0e0e0", fontWeight: 500 }}
                  variant="outlined"
                />
              </Tooltip>
            </>
          );
        } else {
          displayedRelations = toCompanyNames.join(", ");
        }

        return {
          id: item.id,
          company: fromCompany,
          relations: displayedRelations,
        };
      });

      setData(mappedData);
    } catch (error) {
      dispatchAlert({
        message: "Hata Oluştu",
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };


  const handleOpenQuestionBox = (id: string) => {
    setSelectedId(id);
    setIsQuestionMessageBoxOpen(true);
  };
  const handleCloseQuestionBox = (action: string) => {
    setIsQuestionMessageBoxOpen(false);
    if (action === "Yes") {
      handleDelete(selectedId);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      dispatchBusy({ isBusy: true });
      var conf = getConfiguration();
      var api = new WorkCompanyTicketMatrisApi(conf);
      await api.apiWorkCompanyTicketMatrisIdDelete(id);
      dispatchAlert({
        message: "Şirket ilişkisi silindi.",
        type: MessageBoxType.Success,
      });
      fetchTableData();
      dispatchBusy({ isBusy: false });
    } catch (error) {
      console.log(error);
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };

  // İlişki Türü eklemek için gerekli COMPANY/RELATION_TYPE varlıklarını garanti et
  const ensureCompanyModuleAndCategory = async (): Promise<{ module: LookupModuleDto; category: LookupCategoryDto } | null> => {
    try {
      const conf = getConfiguration();
      const api = new LookupApi(conf);
      // Modüller
      const modsRes: any = await api.apiLookupModulesGet();
      const modules: LookupModuleDto[] = (modsRes?.data || []) as any;
      let module = modules.find((m) => (m.key || "").toUpperCase() === "COMPANY");
      if (!module) {
        await api.apiLookupModulesPost({ key: "COMPANY", name: "Company", isTenantScoped: false, isReadOnly: false });
        const modsRes2: any = await api.apiLookupModulesGet();
        const modules2: LookupModuleDto[] = (modsRes2?.data || []) as any;
        module = modules2.find((m) => (m.key || "").toUpperCase() === "COMPANY");
      }
      if (!module?.id) return null;

      // Kategoriler (moduleKey ile)
      const catsRes: any = await api.apiLookupCategoriesGet(module.key || undefined);
      const cats: LookupCategoryDto[] = (catsRes?.data || []) as any;
      let category = cats.find((c) => (c.key || "").toUpperCase() === "RELATION_TYPE");
      if (!category) {
        await api.apiLookupCategoriesPost({ key: "RELATION_TYPE", description: "İlişki Türü", isTenantScoped: false, isReadOnly: false, moduleId: module.id });
        const catsRes2: any = await api.apiLookupCategoriesGet(module.key || undefined);
        const cats2: LookupCategoryDto[] = (catsRes2?.data || []) as any;
        category = cats2.find((c) => (c.key || "").toUpperCase() === "RELATION_TYPE");
      }
      if (!category?.id) return null;
      return { module, category };
    } catch (e) {
      return null;
    }
  };

  const handleSaveRelationType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relTypeForm.code || !relTypeForm.name || Number.isNaN(Number(relTypeForm.orderNo))) {
      dispatchAlert({ message: "Kod, Ad ve Sıra No zorunludur", type: MessageBoxType.Error });
      return;
    }
    setIsSubmittingRelType(true);
    try {
      const ensured = await ensureCompanyModuleAndCategory();
      if (!ensured?.category?.id) throw new Error("Kategori bulunamadı");
      const conf = getConfiguration();
      const api = new LookupApi(conf);
      await api.apiLookupItemsPost({
        categoryId: ensured.category.id,
        code: (relTypeForm.code || "").trim(),
        name: (relTypeForm.name || "").trim(),
        orderNo: Number(relTypeForm.orderNo) || 0,
        isActive: !!relTypeForm.isActive,
        externalKey: (relTypeForm.externalKey || "").trim() || null,
      });
      setIsRelTypeModalOpen(false);
      setRelTypeForm({ code: "", name: "", orderNo: 0, isActive: true, externalKey: "" });
      dispatchAlert({ message: "İlişki türü eklendi", type: MessageBoxType.Success });
    } catch (error) {
      dispatchAlert({ message: "İlişki türü eklenemedi", type: MessageBoxType.Error });
    } finally {
      setIsSubmittingRelType(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ObjectPage
        mode="Default"
        hidePinButton
        style={{
          height: "100%",
          marginTop: "-15px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
        }}
        titleArea={
          <ObjectPageTitle
            style={{
              paddingTop: "24px",
              paddingLeft: "24px",
              paddingRight: "24px",
              backgroundColor: "#ffffff",
              cursor: "default",
            }}
            actionsBar={
              <MDBox style={{ marginTop: "15px", marginRight: "15px" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => navigate(`/companyRelation/detail`)}
                  size="small"
                  startIcon={<Icon>add</Icon>}
                  sx={{
                    marginRight: "0.5rem",
                    bottom: "11px",
                    height: "2.25rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Yeni Şirket İlişkisi
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="info"
                  onClick={() => setIsRelTypeModalOpen(true)}
                  size="small"
                  startIcon={<Icon>category</Icon>}
                  sx={{
                    marginRight: "0.5rem",
                    bottom: "11px",
                    height: "2.25rem",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-1px)" },
                  }}
                >
                  İlişki Türü Ekle
                </MDButton>
              </MDBox>
            }
          >
            <MDBox>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: "#344767",
                  marginBottom: "4px",
                }}
              >
                Şirket İlişkileri
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7b809a",
                }}
              >
                Şirket İlişkileri
              </Typography>
            </MDBox>
          </ObjectPageTitle>
        }
      >
        <Grid xs={12} lg={6} sx={{ paddingLeft: "3px" }}>
          <Card style={{ height: "655px" }}>
            <MDBox>
              <MDBox>
                <MDBox height="565px">
                  <DataTable
                    canSearch={true}
                    table={{
                      columns: columns,
                      rows: data,
                    }}
                  ></DataTable>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
        <MessageBox
          isQuestionmessageBoxOpen={isQuestionMessageBoxOpen}
          handleCloseQuestionBox={handleCloseQuestionBox}
        />
      </ObjectPage>
      {/* İlişki Türü Ekle Modal */}
      {isRelTypeModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsRelTypeModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base font-semibold">İlişki Türü Ekle</div>
              <button onClick={() => setIsRelTypeModalOpen(false)} className="h-8 px-2 rounded-md border">Kapat</button>
            </div>
            <form onSubmit={handleSaveRelationType} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-600 mb-1">Kod</div>
                <input value={relTypeForm.code || ""} onChange={(e) => setRelTypeForm({ ...relTypeForm, code: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="REL_TYPE" />
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Ad</div>
                <input value={relTypeForm.name || ""} onChange={(e) => setRelTypeForm({ ...relTypeForm, name: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="İlişki türü adı" />
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Sıra No</div>
                <input type="number" value={relTypeForm.orderNo || 0} onChange={(e) => setRelTypeForm({ ...relTypeForm, orderNo: Number(e.target.value) || 0 })} className="w-full h-9 px-3 rounded-md border" placeholder="0" />
              </div>
              <div className="flex items-center gap-2">
                <input id="relTypeActive" type="checkbox" checked={!!relTypeForm.isActive} onChange={(e) => setRelTypeForm({ ...relTypeForm, isActive: e.target.checked })} />
                <label htmlFor="relTypeActive" className="text-sm">Aktif</label>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-slate-600 mb-1">External Key</div>
                <input value={relTypeForm.externalKey || ""} onChange={(e) => setRelTypeForm({ ...relTypeForm, externalKey: e.target.value })} className="w-full h-9 px-3 rounded-md border" placeholder="Opsiyonel" />
              </div>
              <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsRelTypeModalOpen(false)} className="h-9 px-3 rounded-md border bg-white">İptal</button>
                <button type="submit" disabled={isSubmittingRelType} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CompanyRelation;
