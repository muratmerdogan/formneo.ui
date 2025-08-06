import React, { useEffect } from "react";
import { TicketCommentDto } from "api/generated";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import GetAppIcon from "@mui/icons-material/GetApp";
import { decode as htmlEntitiesDecode } from "html-entities";
import htmr from "htmr";
import { Divider } from "@mui/material";
import { formatDate } from "@fullcalendar/core";

interface Props {
  ticketFormComment: TicketCommentDto[];
  handleDownload: (file: any) => void;
}

const ChatComponent = ({ ticketFormComment, handleDownload }: Props) => {
  useEffect(() => {
    console.log(ticketFormComment);
  }, [ticketFormComment]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Formatla: tarih ve saat, ancak saniye yok
    const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString() + " " + timeString;
  };

  const takeInnerBodyOnly = (htmlString: string) => {
    if (htmlString.includes("<html>")) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      return doc.body.innerHTML;
    }
    return htmlString

  }
  const sanitizeCommentHtml = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.innerHTML; // sadece <body> içeriğini al
  }
  return (
    <MDBox
      p={3}
      paddingTop={7}
      sx={{
        height: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(0,0,0,0.03)",
          borderRadius: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,0.12)",
          borderRadius: "6px",
          "&:hover": {
            background: "rgba(0,0,0,0.18)",
          },
        },
      }}
    >
      {ticketFormComment.map((comment: any, index: number) => {
        const isUserMessage = index % 2 === 0;
        const messageColor = isUserMessage ? "#f8fafc" : "#ebf5ff";
        const borderColor = isUserMessage ? "#e2e8f0" : "#bfdbfe";

        return (
          <MDBox
            key={`comment-${index}`}
            display="flex"
            justifyContent="center"
            mr={isUserMessage ? "3em" : "0"}
            ml={isUserMessage ? "0" : "3em"}
            mb={3}
            sx={{
              opacity: 0,
              animation: "fadeSlideIn 0.3s ease forwards",
              animationDelay: `${index * 0.1}s`,
              "@keyframes fadeSlideIn": {
                from: {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <MDBox maxWidth="100%" position="relative" width="80%">
              <MDBox
                sx={{
                  backgroundColor: messageColor,
                  borderRadius: "20px",
                  padding: "16px 20px",
                  border: "1px solid",
                  borderColor: borderColor,
                  position: "relative",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  },
                  // "&::before": {
                  //   content: '""',
                  //   position: "absolute",
                  //   top: "25px",
                  //   [isUserMessage ? "left" : "right"]: "-11px",
                  //   width: "20px",
                  //   height: "20px",
                  //   backgroundColor: messageColor,
                  //   border: "1px solid grey ",
                  //   borderColor: isUserMessage ? "#e2e8f0 !important" : "#bfdbfe !important",

                  //   transform: isUserMessage ? "rotate(-45deg)" : "rotate(-45deg)",
                  //   borderRight: isUserMessage ? "none" : "1px solid",
                  //   borderBottom: isUserMessage ? "none" : "1px solid",
                  //   borderLeft: isUserMessage ? "1px solid" : "none",
                  //   borderTop: isUserMessage ? "1px solid" : "none",
                  //   zIndex: 1,
                  // },
                }}
              >
                <MDBox display="flex" flexDirection="column" gap={1.5} sx={{ zIndex: 2 }}>
                  <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <MDTypography
                      variant="h6"
                      color="dark"
                      fontWeight="medium"

                      sx={{
                        fontSize: "0.875rem",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {comment.createdBy}
                    </MDTypography>
                    <MDTypography
                      variant="caption"
                      color="text"
                      sx={{
                        fontSize: "0.75rem",

                        opacity: 0.75,
                      }}
                    >
                      {formatDate(comment.createdDate)}
                    </MDTypography>
                  </MDBox>
                  <Divider sx={{ borderColor: "rgba(0,0,0,0.05)", marginTop: 0, marginBottom: 1, opacity: 0.6 }} />

                  {comment.body && (
                    <MDTypography
                      variant="body2"
                      sx={{
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                        fontSize: "0.875rem",
                        color: "text.primary",
                        overflowY: "auto",
                      }}
                    >
                      {/* {htmr(htmlEntitiesDecode(takeInnerBodyOnly(comment.body)))} */}
                      {htmr(sanitizeCommentHtml(comment.body))}
                    </MDTypography>
                  )}

                  {comment.files && comment.files.length > 0 && (
                    <MDBox mt={2}>
                      {comment.files.map((file: any, fileIndex: number) => (
                        <MDBox
                          key={`file-${fileIndex}`}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.65)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid",
                            borderColor: isUserMessage ? "#f1f5f9" : "#e2e8f0",
                            borderRadius: "12px",
                            padding: "10px 14px",
                            marginTop: fileIndex > 0 ? 1 : 0,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.85)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            },
                          }}
                        >
                          <MDBox display="flex" alignItems="center" gap={1}>
                            <AttachFileIcon
                              sx={{
                                fontSize: "18px",
                                color: "info.main",
                                transform: "rotate(45deg)",
                              }}
                            />
                            <MDTypography
                              variant="button"
                              sx={{
                                fontSize: "0.8125rem",
                                color: "text.primary",
                                fontWeight: 400,
                              }}
                            >
                              {file.fileName}
                            </MDTypography>
                            {/* <MDTypography variant="caption" color="text">
                            ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)
                          </MDTypography> */}
                          </MDBox>
                          <MDButton
                            variant="text"
                            color="info"
                            size="small"
                            onClick={() => handleDownload(file)}
                            startIcon={
                              <GetAppIcon
                                sx={{
                                  fontSize: "16px",
                                  transition: "transform 0.2s ease",
                                }}
                              />
                            }
                            sx={{
                              minWidth: "auto",
                              padding: "6px 12px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              transition: "all 0.2s ease",
                              opacity: 0.85,
                              "&:hover": {
                                opacity: 1,
                                backgroundColor: "rgba(0,0,0,0.04)",
                                "& .MuiSvgIcon-root": {
                                  transform: "translateY(2px)",
                                },
                              },
                            }}
                          >
                            İNDİR
                          </MDButton>
                        </MDBox>
                      ))}
                    </MDBox>
                  )}
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>
        );
      })}
    </MDBox>
  );
};

export default ChatComponent;
