import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip,
  alpha,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import TaskIcon from "@mui/icons-material/Assignment";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MDButton from "components/MDButton";

interface TaskOfMemberDialogProps {
  open: boolean;
  onClose: () => void;
  task: string[];
  memberName?: string;
}

function TaskOfMemberDialog({ open, onClose, task, memberName = "" }: TaskOfMemberDialogProps) {



  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="task-of-member-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        id="task-of-member-dialog-title"
        sx={{
          pb: 1,
          pt: 2,
        }}
      >
        <MDTypography variant="h5" fontWeight="medium">
          {memberName ? `${memberName} - Tasks` : "Tasks"}
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
          px: 3,
          py: 2,
          borderColor: (theme) => alpha(theme.palette.divider, 0.5),
        }}
      >
        <MDBox mb={2.5}>
          <MDTypography variant="body2" color="text">
            {task.length > 0
              ? `Seçili projede için kullanıcıya atanan görevlerin listesi (${task.length} task)`
              : "Bu kullanıcıya atanmış görev bulunmamaktadır."}
          </MDTypography>
        </MDBox>

        {task.length > 0 ? (
          <Box sx={{ borderRadius: "10px", bgcolor: "background.paper" }}>
            <List
              sx={{
                width: "100%",
                p: 0,
              }}
            >
              {task.map((taskItem, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider component="li" sx={{ opacity: 0.6 }} />}
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      py: 1.5,
                      px: 1,
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.04)",
                        borderRadius: "8px",
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "48px",
                      }}
                    >
                      <Box
                        sx={{
                          mt: -0.5,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: (theme) => theme.palette.primary.main + "15",
                        }}
                      >
                        <TaskIcon color="primary" fontSize="small" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <MDTypography variant="body2" fontWeight="medium">
                          {taskItem}
                        </MDTypography>
                      }
                    />
                    <Chip 
                      icon={<CheckCircleIcon style={{marginLeft: "5px"}}  />} 
                      label="Atandı" 
                      color="success" 
                      size="small" 
                      sx={{ 
                        ml: 1,
                        fontWeight: 500,
                        height: '24px',
                        '& .MuiChip-label': {
                          color: "#ffffff",
                        },
                        "& .MuiChip-icon": {
                          color: "#ffffff",
                        },
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Box>
        ) : (
          <MDBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
            textAlign="center"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
              borderRadius: "8px",
            }}
          >
            <TaskIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5, mb: 2 }} />
            <MDTypography variant="body1" color="text">
              Bu kullanıcıya atanmış görev bulunmamaktadır.
            </MDTypography>
            <MDTypography variant="caption" color="text" sx={{ mt: 1 }}>
              Kullanıcıya görev atamak için Gantt Chart sayfasını kullanabilirsiniz.
            </MDTypography>
          </MDBox>
        )}

        <MDBox display="flex" justifyContent="flex-end" mt={3}>
          <MDButton variant="contained" color="info" onClick={onClose} tabIndex={0} size="small">
            Kapat
          </MDButton>
        </MDBox>
      </DialogContent>
    </Dialog>
  );
}

export default TaskOfMemberDialog;
