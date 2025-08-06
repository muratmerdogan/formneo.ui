import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Divider,
  Tooltip,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import { ProjectTasksApi, UserAppDto } from "api/generated";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import TaskOfMemberDialog from "../taskOfMemberDialog/taskOfMemberDialog";
import getConfiguration from "confiuration";
import BackIcon from "@mui/icons-material/ArrowBack";
import ForwardIcon from "@mui/icons-material/ArrowForward";

interface TeamDialogProps {
  open: boolean;
  onClose: () => void;
  teamMembers: UserAppDto[];
  selectedProjectId: string;
  handlePageChange: (page: number) => void;
}

function TeamDialog({ open, onClose, teamMembers, selectedProjectId, handlePageChange }: TeamDialogProps) {
  const [openTaskOfMemberDialog, setOpenTaskOfMemberDialog] = useState(false);
  const [taskOfMember, setTaskOfMember] = useState<string[]>([]);
  const [selectedMemberName, setSelectedMemberName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  

  const handleOpenTaskOfMemberDialog = async (memberId: string) => {
    try {
      const config = getConfiguration();
      const projectApi = new ProjectTasksApi(config);
      const response = await projectApi.apiProjectTasksGetTasksByUserGet(
        memberId,
        selectedProjectId
      );
      setTaskOfMember(response.data);

      const member = teamMembers.find((m) => m.id === memberId);
      if (member) {
        setSelectedMemberName(`${member.firstName || ""} ${member.lastName || ""}`);
      } else {
        setSelectedMemberName("");
      }

      setOpenTaskOfMemberDialog(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="team-members-dialog-title"
    >
      <DialogTitle id="team-members-dialog-title">
        <MDTypography variant="h5" fontWeight="medium">
          Ekip Üyeleri
        </MDTypography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          tabIndex={0}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: "650px",
          overflowY: "auto",
        }}
      >
        <MDBox mb={2}>
          <MDTypography variant="body2" color="text">
            Projede çalışan ekip üyeleri listesi
          </MDTypography>
        </MDBox>

        <Grid container spacing={2}>
          {teamMembers.length > 0 ? (
            teamMembers.map((member, index) => (
              <Grid item xs={12} key={member.id || index}>
                <MDBox
                  p={2}
                  sx={{
                    borderRadius: "10px",
                    boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
                    backgroundColor: "white",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <MDBox display="flex" alignItems="center">
                        <ListItemAvatar>
                          <Avatar
                            src={
                              member.photo ? `data:image/jpeg;base64,${member.photo}` : undefined
                            }
                            alt={`${member.firstName || ""} ${member.lastName || ""}`}
                            sx={{ width: 56, height: 56 }}
                          >
                            {member.firstName?.charAt(0)}
                            {member.lastName?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <MDBox ml={2}>
                          <Stack direction="row" spacing={1}>
                            <MDTypography variant="h6" fontWeight="medium">
                              {member.firstName} {member.lastName}
                            </MDTypography>
                            <InfoIcon
                              onClick={() => handleOpenTaskOfMemberDialog(member.id)}
                              color="action"
                              style={{
                                marginTop: "5px",
                                cursor: "pointer",
                              }}
                            />
                          </Stack>
                          <Stack mt={0.2} direction="row" spacing={1}>
                            <EmailIcon color="action" />
                            <MDTypography
                              style={{
                                marginTop: "1px",
                              }}
                              variant="caption"
                              color="text"
                            >
                              {member.userName}
                            </MDTypography>
                          </Stack>
                        </MDBox>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <MDBox>
                        {/* {member.title && (
                          <MDBox display="flex" alignItems="center" mb={1}>
                            <WorkIcon fontSize="small" color="action" />
                            <MDTypography variant="body2" ml={1}>
                              {member.title}
                            </MDTypography>
                          </MDBox>
                        )} */}

                        {/* {member.email && (
                          <MDBox display="flex" alignItems="center" mb={1}>
                            <EmailIcon fontSize="small" color="action" />
                            <MDTypography variant="body2" ml={1}>
                              {member.email}
                            </MDTypography>
                          </MDBox>
                        )} */}

                        {/* {member.phoneNumber && (
                          <MDBox display="flex" alignItems="center" mb={1}>
                            <PhoneIcon fontSize="small" color="action" />
                            <MDTypography variant="body2" ml={1}>
                              {member.phoneNumber}
                            </MDTypography>
                          </MDBox>
                        )} */}

                        {/* {member.location && (
                          <MDBox display="flex" alignItems="center">
                            <LocationOnIcon fontSize="small" color="action" />
                            <MDTypography variant="body2" ml={1}>
                              {member.location}
                            </MDTypography>
                          </MDBox>
                        )} */}
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <MDBox display="flex" flexDirection="column">
                        <MDBox mb={1}>
                          {member.sapDepartmentText && (
                            <Chip
                              label={member.sapDepartmentText}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          )}
                          {member.sapPositionText && (
                            <Chip
                              label={member.sapPositionText}
                              color="secondary"
                              size="small"
                              sx={{
                                mr: 1,
                                mb: 1,
                                maxWidth: "100%",
                                "& .MuiChip-label": {
                                  overflow: "visible",
                                  whiteSpace: "normal",
                                  textOverflow: "clip",
                                },
                              }}
                            />
                          )}
                          {/* {member.isSystemAdmin && (
                            <Chip
                              label="Sistem Yöneticisi"
                              color="info"
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          )} */}
                        </MDBox>

                        {/* <MDBox display="flex" alignItems="center">
                          {member.linkedinUrl && (
                            <Tooltip title="LinkedIn">
                              <IconButton
                                size="small"
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                tabIndex={0}
                                aria-label="LinkedIn profili"
                              >
                                <LinkedInIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {member.twitterUrl && (
                            <Tooltip title="Twitter">
                              <IconButton
                                size="small"
                                href={member.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                tabIndex={0}
                                aria-label="Twitter profili"
                              >
                                <TwitterIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {member.facebookUrl && (
                            <Tooltip title="Facebook">
                              <IconButton
                                size="small"
                                href={member.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                tabIndex={0}
                                aria-label="Facebook profili"
                              >
                                <FacebookIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {member.instagramUrl && (
                            <Tooltip title="Instagram">
                              <IconButton
                                size="small"
                                href={member.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                tabIndex={0}
                                aria-label="Instagram profili"
                              >
                                <InstagramIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </MDBox> */}
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <MDBox textAlign="center" py={3}>
                <MDTypography variant="body1" color="text">
                  Bu projede henüz ekip üyesi bulunmamaktadır.
                </MDTypography>
              </MDBox>
            </Grid>
          )}
        </Grid>
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={2} gap={4}>
          <IconButton disabled={currentPage === 1} onClick={() => {handlePageChange(currentPage - 1); setCurrentPage(currentPage - 1)}}>
            <BackIcon />
          </IconButton>
          <IconButton disabled={teamMembers.length < 5} onClick={() => {handlePageChange(currentPage + 1); setCurrentPage(currentPage + 1)}}>
            <ForwardIcon />
            </IconButton>
        </MDBox>
      </DialogContent>
      <TaskOfMemberDialog
        open={openTaskOfMemberDialog}
        onClose={() => setOpenTaskOfMemberDialog(false)}
        task={taskOfMember}
        memberName={selectedMemberName}
      />
    </Dialog>
  );
}

export default TeamDialog;
