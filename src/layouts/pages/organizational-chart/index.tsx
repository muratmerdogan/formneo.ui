import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Card,
  Grid,
  Typography,
  Icon,
  CircularProgress,
  Modal,
  Box,
  LinearProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Tree } from "react-organizational-chart";
// import { mockData } from "./fakeData";
import "./orgchart-custom.css";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useZoom } from "./hooks/useZoom";
import { chartContainerStyle, getChartContentStyle } from "./styles/orgChart.styles";
import { NodeRenderer, RenderTreeNodes } from "./components/NodeRenderer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import getConfiguration from "confiuration";
import {
  OrganizationApi,
  OrganizationDto,
  WorkCompanyApi,
  WorkCompanyDto,
  TicketDepartmensListDto,
  TicketDepartmentsApi,
} from "api/generated";
import { useBusy } from "layouts/pages/hooks/useBusy";
import { useAlert } from "layouts/pages/hooks/useAlert";
import { MessageBoxType } from "@ui5/webcomponents-react";

const OrganizationalChartPage = () => {
  const dispatchBusy = useBusy();
  const dispatchAlert = useAlert();
  const [orgData, setOrgData] = useState<OrgNode | null>(null);
  const [workCompanyData, setWorkCompanyData] = useState<WorkCompanyDto[]>([]);
  const [selectedWorkCompany, setSelectedWorkCompany] = useState<WorkCompanyDto | null>(null);
  const [departmentData, setDepartmentData] = useState<TicketDepartmensListDto[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<TicketDepartmensListDto | null>(
    null
  );

  interface OrgNode {
    id: string;
    name: string;
    title?: string;
    email?: string;
    photo?: string;
    children?: OrgNode[];
    expanded?: boolean;
    type?: string;
    className?: string;
  }

  interface ExpandedState {
    [key: string]: boolean;
  }

  const mapToOrgNode = (item: OrganizationDto): OrgNode => {
    return {
      id: item.id || "",
      name: item.name || "Kullanıcı",
      title: item.title,
      email: item.email,
      photo: item.photo,
      expanded: item.expanded,
      type: item.type,
      className: item.className,
      children: item.children ? item.children.map(mapToOrgNode) : [],
    };
  };
  const [expandedNodes, setExpandedNodes] = useState<ExpandedState>({});
  useEffect(() => {
    if (!orgData) return;

    const initialState: ExpandedState = {};

    const initExpanded = (node: OrgNode) => {
      initialState[node.id] = true;
      if (node.children) {
        node.children.forEach(initExpanded);
      }
    };

    initExpanded(orgData);
    setExpandedNodes(initialState);
  }, [orgData]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId],
    }));
  };

  const isExpanded = (nodeId: string) => expandedNodes[nodeId];

  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStage, setExportStage] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { zoom, contentPosition, handleZoomButton, resetZoom } = useZoom({
    containerRef: chartContainerRef,
    contentRef: contentRef,
  });

  const filteredNodes = useMemo(() => {
    if (!orgData) return null;
    if (!searchQuery.trim()) return orgData;

    const searchTerm = searchQuery.toLowerCase();

    const searchNodes = (node: OrgNode): OrgNode | null => {
      const nodeMatches = node.name.toLowerCase().includes(searchTerm);

      let matchingChildren: OrgNode[] = [];
      if (node.children && node.children.length > 0) {
        matchingChildren = node.children
          .map(searchNodes)
          .filter((child): child is OrgNode => child !== null);
      }

      if (nodeMatches || matchingChildren.length > 0) {
        return {
          ...node,
          children: matchingChildren.length > 0 ? matchingChildren : undefined,
        };
      }

      return null;
    };

    return searchNodes(orgData);
  }, [searchQuery, orgData]);

  const handleExportToPDF = () => {
    // Prevent multiple export attempts
    if (isExporting) return;

    setIsExporting(true);
    setExportProgress(0);
    setExportStage("Hazırlanıyor...");
    setShowExportModal(true);

    const chartElement = contentRef.current;
    const containerElement = chartContainerRef.current;

    if (!chartElement || !containerElement) {
      console.error("Chart or container element not found for PDF export.");
      setIsExporting(false);
      setShowExportModal(false);
      return;
    }

    // Store original styles safely
    const originalChartTransform = chartElement.style.transform || "";
    const originalContainerOverflow = containerElement.style.overflow || "";
    const originalContainerHeight = containerElement.style.height || "";
    const originalContainerWidth = containerElement.style.width || "";

    // Capture current scroll position to restore later
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    try {
      // Prepare for capture
      setExportProgress(10);
      setExportStage("Görünüm düzenleniyor...");
      chartElement.style.transform = "translate(0px, 0px) scale(1)"; // Reset zoom/pan for capture
      containerElement.style.overflow = "visible"; // Ensure nothing is clipped

      // Give the element enough space
      const captureWidth = Math.max(chartElement.scrollWidth, chartElement.offsetWidth);
      const captureHeight = Math.max(chartElement.scrollHeight, chartElement.offsetHeight);

      containerElement.style.width = `${captureWidth}px`;
      containerElement.style.height = `${captureHeight}px`;

      // Allow browser brief moment to apply styles and re-render
      setTimeout(() => {
        setExportProgress(20);
        setExportStage("Şema görüntüsü alınıyor...");

        html2canvas(chartElement, {
          scale: 1.5, // Reduced scale for smaller file size
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false, // Disable logging for production
          allowTaint: false,
        })
          .then((canvas) => {
            try {
              setExportProgress(60);
              setExportStage("PDF oluşturuluyor...");

              // Lower quality to reduce file size significantly
              const imgData = canvas.toDataURL("image/jpeg", 0.7);

              // Set up PDF with metadata
              const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
                compress: true, // Enable compression
              });

              pdf.setProperties({
                title: "Organizasyon Şeması",
                subject: "Şirket organizasyon yapısı",
                creator: "Vesa Support UI",
                author: "Vesa System",
              });

              setExportProgress(80);
              setExportStage("PDF yerleştiriliyor...");

              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
              const canvasAspectRatio = canvas.width / canvas.height;

              // Calculate dimensions to fit while preserving aspect ratio
              let imageWidthInPdf = pdfWidth - 10; // 5mm margins on each side
              let imageHeightInPdf = imageWidthInPdf / canvasAspectRatio;

              // If height exceeds page height, scale based on height instead
              if (imageHeightInPdf > pdfHeight - 10) {
                imageHeightInPdf = pdfHeight - 10; // 5mm margins on top and bottom
                imageWidthInPdf = imageHeightInPdf * canvasAspectRatio;
              }

              // Center the image on the PDF page
              const xPos = (pdfWidth - imageWidthInPdf) / 2;
              const yPos = (pdfHeight - imageHeightInPdf) / 2;

              pdf.addImage(imgData, "JPEG", xPos, yPos, imageWidthInPdf, imageHeightInPdf);

              setExportProgress(95);
              setExportStage("İndirme hazırlanıyor...");

              // Small delay to show the final progress state
              setTimeout(() => {
                pdf.save("organizasyon-semasi.pdf");
                setExportProgress(100);
                setExportStage("İndirme tamamlandı!");

                // Close modal after a short delay
                setTimeout(() => {
                  setShowExportModal(false);
                }, 1800);

                // Clean up canvas memory
                canvas.width = 0;
                canvas.height = 0;
              }, 300);
            } catch (pdfError) {
              console.error("Error creating PDF:", pdfError);
              setExportStage("Hata oluştu!");
              setTimeout(() => {
                setShowExportModal(false);
              }, 1500);
            }
          })
          .catch((error) => {
            console.error("Error generating canvas:", error);
            setExportStage("Hata oluştu!");
            setTimeout(() => {
              setShowExportModal(false);
            }, 1500);
          })
          .finally(() => {
            // Always restore styles and clean up
            restoreStyles();
          });
      }, 200); // Increased delay for more reliable rendering
    } catch (error) {
      console.error("Unexpected error in export process:", error);
      setExportStage("Hata oluştu!");
      setTimeout(() => {
        setShowExportModal(false);
      }, 1500);
      restoreStyles();
    }

    // Function to restore all styles and clean up
    function restoreStyles() {
      try {
        if (chartElement) chartElement.style.transform = originalChartTransform;
        if (containerElement) {
          containerElement.style.overflow = originalContainerOverflow;
          containerElement.style.width = originalContainerWidth;
          containerElement.style.height = originalContainerHeight;
        }

        // Restore scroll position
        window.scrollTo(scrollX, scrollY);

        // Reset loading state
        setIsExporting(false);
      } catch (restoreError) {
        console.error("Error restoring styles:", restoreError);
        setIsExporting(false);
      }
    }
  };

  const handleCloseExportModal = () => {
    if (exportProgress < 100 && exportProgress > 0) {
      // If still processing, confirm before closing
      if (window.confirm("PDF indirme işlemi devam ediyor. İptal etmek istiyor musunuz?")) {
        setShowExportModal(false);
      }
    } else {
      setShowExportModal(false);
    }
  };
  const getData = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new OrganizationApi(conf);

      var res = await api.apiOrganizationGet();
      console.log("orgdata", res.data);
      const mappedData = mapToOrgNode(res.data);
      setOrgData(mappedData);
    } catch (error) {
      dispatchAlert({
        message: "Hata oluştu" + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
  const getDataByDepartment = async () => {
    try {
      dispatchBusy({ isBusy: true });
      const conf = getConfiguration();
      const api = new OrganizationApi(conf);

      var res = await api.apiOrganizationGetByDepartmentGet(selectedDepartment.id);
      console.log("orgdata", res.data);
      const mappedData = mapToOrgNode(res.data);
      setOrgData(mappedData);
    } catch (error) {
      dispatchAlert({
        message: "Hata oluştu" + error,
        type: MessageBoxType.Error,
      });
    } finally {
      dispatchBusy({ isBusy: false });
    }
  };
 useEffect(() => {
  const fetchInitialData = async () => {
    try {
      // 1. Şirket ve departman verileri için loading başlat
      dispatchBusy({ isBusy: true });

      const config = getConfiguration();
      const companyApi = new WorkCompanyApi(config);
      const departmentApi = new TicketDepartmentsApi(config);

      const companyRes = await companyApi.apiWorkCompanyGet();
      setWorkCompanyData(companyRes.data);

      const defaultCompany = companyRes.data.find(
        (c) => c.id === "2e5c2ba5-3eb8-414d-8bc7-08dd44716854"
      );
      setSelectedWorkCompany(defaultCompany);

      const departmentRes = await departmentApi.apiTicketDepartmentsAllFilteredCompanyGet(
        "2e5c2ba5-3eb8-414d-8bc7-08dd44716854"
      );
      setDepartmentData(departmentRes.data);
    } catch (error) {
      console.error("Initial data fetch error:", error);
      dispatchAlert({
        message: "Şirket ve departman verileri alınırken hata oluştu: " + error,
        type: MessageBoxType.Error,
      });
    } finally {
      // 2. İlk yükleme bittiğinde busy durumunu kapat
      dispatchBusy({ isBusy: false });
    }

    // 3. getData çağrılırken ayrı loading başlasın
    await getData();
  };

  fetchInitialData();
}, []);


  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (selectedDepartment) {
      console.log("selected departman değişti1");
      getDataByDepartment();
    } else {
      console.log("selected departman değişti2");
      getData();
    }
  }, [selectedDepartment]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* Export Progress Modal */}
      <Modal
        open={showExportModal}
        onClose={handleCloseExportModal}
        aria-labelledby="export-progress-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "450px",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "12px",
            p: 4,
            outline: "none",
          }}
        >
          <MDTypography variant="h6" component="h2" mb={2}>
            {exportProgress < 100 ? "PDF indiriliyor..." : "İndirme tamamlandı!"}
          </MDTypography>

          <LinearProgress
            variant="determinate"
            value={exportProgress}
            color={exportProgress < 100 ? "info" : "success"}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 2,
            }}
          />

          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {exportStage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {exportProgress}%
            </Typography>
          </MDBox>

          {exportProgress === 100 && (
            <MDBox display="flex" justifyContent="flex-end" mt={3}>
              <MDButton
                variant="contained"
                color="success"
                size="small"
                onClick={() => setShowExportModal(false)}
                sx={{ borderRadius: "8px" }}
              >
                Tamam
              </MDButton>
            </MDBox>
          )}
        </Box>
      </Modal>
      <MDBox p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h4" gutterBottom>
                  Organizasyon Şeması
                </MDTypography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Şirket organizasyon yapısını ve departman hiyerarşisini görüntüleyin
                </Typography>
                <MDBox display="flex" gap={2}>
                  {/* Şirket Seçimi (disabled) */}
                  <Box width="25%">
                    <Autocomplete
                      options={workCompanyData}
                      getOptionLabel={(option) => option.name}
                      value={selectedWorkCompany}
                      disabled
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Şirket Ara"
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <span
                                className="material-icons"
                                style={{ color: "#666", marginRight: 8 }}
                              >
                                business
                              </span>
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Departman Seçimi */}
                  <Box width="25%">
                    <Autocomplete
                      options={departmentData}
                      getOptionLabel={(option) => option.departmentText}
                      value={selectedDepartment}
                      onChange={(e, val) => setSelectedDepartment(val)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Departman Ara"
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <span
                                className="material-icons"
                                style={{ color: "#666", marginRight: 8 }}
                              >
                                apartment
                              </span>
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                  mt={2}
                  mb={2}
                >
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <MDButton
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => handleZoomButton(false)}
                      sx={{
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <Icon sx={{ mr: 0.5 }}>zoom_out</Icon> Küçült
                    </MDButton>
                    <MDTypography variant="button" color="text" fontWeight="medium">
                      %{zoom}
                    </MDTypography>
                    <MDButton
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => handleZoomButton(true)}
                      sx={{
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <Icon sx={{ mr: 0.5 }}>zoom_in</Icon> Büyüt
                    </MDButton>
                    <MDButton
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => resetZoom()}
                      sx={{
                        ml: 1,
                        borderRadius: "8px",
                        transition: "all 0.2s",
                        "&:hover": { transform: "translateY(-2px)" },
                      }}
                    >
                      Varsayılan
                    </MDButton>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" gap={2}>
                    <MDInput
                      placeholder="Arama yap..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      sx={{
                        minWidth: "220px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          overflow: "hidden",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                          transition: "all 0.2s",
                          "&:hover": { boxShadow: "0 4px 8px rgba(0,0,0,0.08)" },
                          "&.Mui-focused": { boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "10px 14px",
                        },
                      }}
                      InputProps={{
                        startAdornment: <Icon sx={{ color: "text.secondary", mr: 1 }}>search</Icon>,
                      }}
                    />
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={() => handleExportToPDF()}
                      disabled={isExporting}
                      sx={{
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
                        },
                        "&:disabled": { opacity: 0.7 },
                      }}
                    >
                      {isExporting ? (
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      ) : (
                        <Icon sx={{ mr: 0.5 }}>download</Icon>
                      )}
                      PDF olarak indir
                    </MDButton>
                  </MDBox>
                </MDBox>

                <MDBox
                  p={2}
                  mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    className="org-chart-container"
                    ref={chartContainerRef}
                    style={chartContainerStyle}
                  >
                    {filteredNodes ? (
                      <div
                        ref={contentRef}
                        style={getChartContentStyle(zoom, contentPosition.x, contentPosition.y)}
                      >
                        <Tree
                          lineWidth="2px"
                          lineColor="rgba(63, 81, 181, 0.6)"
                          lineBorderRadius="10px"
                          label={
                            <NodeRenderer
                              node={filteredNodes}
                              isExpanded={isExpanded}
                              toggleNode={toggleNode}
                            />
                          }
                          nodePadding="5px"
                        >
                          {filteredNodes.children && isExpanded(filteredNodes.id) && (
                            <RenderTreeNodes
                              nodes={filteredNodes.children}
                              isExpanded={isExpanded}
                              toggleNode={toggleNode}
                            />
                          )}
                        </Tree>
                      </div>
                    ) : (
                      <MDBox textAlign="center" py={4}>
                        <MDTypography variant="h6" color="text">
                          Arama sonucu bulunamadı
                        </MDTypography>
                      </MDBox>
                    )}
                  </div>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default OrganizationalChartPage;
