import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";

interface VPNDetailProps {
  selectedServerId: string;
}

interface VPNData {
  id: string;
  vpnUygulamasi: string;
  vpnAddress: string;
  kurulumDosyaLinki: string;
  not: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  userVotes: Record<string, 'up' | 'down'>; // userId -> vote type
}

interface HistoryLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  oldValue: string;
  newValue: string;
  timestamp: Date;
}

function VPNDetail({ selectedServerId }: VPNDetailProps) {
  const [vpnData, setVpnData] = useState<VPNData | null>(null);
  const [userNote, setUserNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<VPNData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [currentUserId] = useState("user123"); // In real app, get from auth context
  const [currentUserName] = useState("Current User"); // In real app, get from auth context

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
    
  // Mock data - in a real app, this would come from an API
  const mockVPNData: Record<string, VPNData> = {
    "1": {
      id: "1",
      vpnUygulamasi: "Cisco AnyConnect",
      vpnAddress: "vpn.company1.com",
      kurulumDosyaLinki: "https://download.company1.com/cisco-anyconnect.exe",
      not: "Requires admin privileges to install",
    },
    "2": {
      id: "2",
      vpnUygulamasi: "OpenVPN",
      vpnAddress: "vpn.company2.com:1194",
      kurulumDosyaLinki: "https://download.company2.com/openvpn-setup.exe",
      not: "Use TCP protocol for connection",
    },
    "3": {
      id: "3",
      vpnUygulamasi: "FortiClient VPN",
      vpnAddress: "vpn.company3.com:443",
      kurulumDosyaLinki: "https://download.company3.com/forticlient.exe",
      not: "Compatible with Windows 11",
    },
    "4": {
      id: "4",
      vpnUygulamasi: "Pulse Secure",
      vpnAddress: "vpn.company4.com",
      kurulumDosyaLinki: "https://download.company4.com/pulse-secure.exe",
      not: "Requires Java Runtime Environment",
    },
  };

  // Mock comments data
  const mockCommentsData: Record<string, Comment[]> = {
    "1": [
      {
        id: "c1",
        userId: "user456",
        userName: "John Doe",
        comment: "Works perfectly on Windows 11. Installation was smooth and connection is stable.",
        timestamp: new Date("2024-01-15T10:30:00"),
        upvotes: 5,
        downvotes: 1,
        userVotes: { user789: 'up', user101: 'up', user102: 'down' }
      },
      {
        id: "c2",
        userId: "user789",
        userName: "Jane Smith",
        comment: "Had some issues with the initial setup. Make sure to run as administrator.",
        timestamp: new Date("2024-01-10T14:20:00"),
        upvotes: 3,
        downvotes: 0,
        userVotes: { user456: 'up', user101: 'up' }
      }
    ],
    "2": [
      {
        id: "c3",
        userId: "user101",
        userName: "Mike Johnson",
        comment: "OpenVPN is reliable but the interface could be better. Connection drops occasionally.",
        timestamp: new Date("2024-01-12T09:15:00"),
        upvotes: 2,
        downvotes: 1,
        userVotes: { user456: 'up', user789: 'down' }
      }
    ]
  };

  // Mock history logs data
  const mockHistoryLogsData: Record<string, HistoryLog[]> = {
    "1": [
      {
        id: "h1",
        userId: "user456",
        userName: "John Doe",
        action: "Şifre değiştirildi",
        oldValue: "5546",
        newValue: "5213",
        timestamp: new Date("2024-01-20T14:30:00")
      },
      {
        id: "h2",
        userId: "user789",
        userName: "Jane Smith",
        action: "VPN adresi güncellendi",
        oldValue: "vpn.company1.com",
        newValue: "vpn.company1.com:443",
        timestamp: new Date("2024-01-18T09:15:00")
      },
      {
        id: "h3",
        userId: "user101",
        userName: "Mike Johnson",
        action: "Kurulum dosyası linki değiştirildi",
        oldValue: "https://old-download.company1.com/cisco-anyconnect.exe",
        newValue: "https://download.company1.com/cisco-anyconnect.exe",
        timestamp: new Date("2024-01-15T16:45:00")
      }
    ],
    "2": [
      {
        id: "h4",
        userId: "user456",
        userName: "John Doe",
        action: "Şifre değiştirildi",
        oldValue: "8821",
        newValue: "9934",
        timestamp: new Date("2024-01-19T11:20:00")
      },
      {
        id: "h5",
        userId: "user789",
        userName: "Jane Smith",
        action: "Not güncellendi",
        oldValue: "Use UDP protocol for connection",
        newValue: "Use TCP protocol for connection",
        timestamp: new Date("2024-01-17T13:30:00")
      }
    ],
    "3": [
      {
        id: "h6",
        userId: "user101",
        userName: "Mike Johnson",
        action: "Şifre değiştirildi",
        oldValue: "7742",
        newValue: "3389",
        timestamp: new Date("2024-01-21T08:45:00")
      }
    ]
  };

  useEffect(() => {
    // Simulating API call with setTimeout
    const fetchVPNData = () => {
      setTimeout(() => {
        const data = mockVPNData[selectedServerId];
        const commentsData = mockCommentsData[selectedServerId] || [];
        const historyData = mockHistoryLogsData[selectedServerId] || [];
        if (data) {
          setVpnData(data);
          setEditedData(data);
          setComments(commentsData);
          setHistoryLogs(historyData);
        }
      }, 300);
    };

    fetchVPNData();
  }, [selectedServerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedData) {
      setEditedData({
        ...editedData,
        [name]: value,
      });
    }
  };

  const handleUserNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNote(e.target.value);
  };

  const handleSaveChanges = () => {
    if (editedData && vpnData) {
      // Create history logs for changed fields
      const newHistoryLogs: HistoryLog[] = [];

      Object.keys(editedData).forEach((key) => {
        const oldValue = vpnData[key as keyof VPNData];
        const newValue = editedData[key as keyof VPNData];

        if (oldValue !== newValue && key !== 'id') {
          const actionMap: Record<string, string> = {
            vpnUygulamasi: 'VPN uygulaması değiştirildi',
            vpnAddress: 'VPN adresi güncellendi',
            kurulumDosyaLinki: 'Kurulum dosyası linki değiştirildi',
            not: 'Not güncellendi'
          };

          newHistoryLogs.push({
            id: `h${Date.now()}_${key}`,
            userId: currentUserId,
            userName: currentUserName,
            action: actionMap[key] || `${key} güncellendi`,
            oldValue: oldValue,
            newValue: newValue,
            timestamp: new Date()
          });
        }
      });

      if (newHistoryLogs.length > 0) {
        setHistoryLogs(prev => [...newHistoryLogs, ...prev]);
      }

      setVpnData(editedData);
      setIsEditing(false);
      // In a real app, you would save the changes to the API here
      console.log("Saving changes:", editedData);
    }
  };

  const handleAddNote = () => {
    if (userNote.trim() && vpnData) {
      const updatedVPNData = {
        ...vpnData,
        not: vpnData.not ? `${vpnData.not}\n${userNote}` : userNote,
      };
      setVpnData(updatedVPNData);
      setEditedData(updatedVPNData);
      setUserNote("");
      // In a real app, you would save the note to the API here
      console.log("Adding note:", userNote);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `c${Date.now()}`,
        userId: currentUserId,
        userName: currentUserName,
        comment: newComment,
        timestamp: new Date(),
        upvotes: 0,
        downvotes: 0,
        userVotes: {}
      };
      setComments([comment, ...comments]);
      setNewComment("");
      // In a real app, you would save the comment to the API here
      console.log("Adding comment:", comment);
    }
  };

  const handleVote = (commentId: string, voteType: 'up' | 'down') => {
    setComments(prevComments =>
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const currentVote = comment.userVotes[currentUserId];
          const newUserVotes = { ...comment.userVotes };
          let newUpvotes = comment.upvotes;
          let newDownvotes = comment.downvotes;

          // Remove previous vote if exists
          if (currentVote === 'up') {
            newUpvotes--;
          } else if (currentVote === 'down') {
            newDownvotes--;
          }

          // Add new vote if different from current
          if (currentVote !== voteType) {
            newUserVotes[currentUserId] = voteType;
            if (voteType === 'up') {
              newUpvotes++;
            } else {
              newDownvotes++;
            }
          } else {
            // Remove vote if clicking same vote type
            delete newUserVotes[currentUserId];
          }

          return {
            ...comment,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVotes: newUserVotes
          };
        }
        return comment;
      })
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <MDBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              borderRadius: "16px",
              padding: "0 0 24px 0",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
              },
              border: "1px solid #e2e8f0",
            }}
          >
            <CardHeader
              title="VPN Detayları"
              action={
                isEditing ? (
                  <MDBox display="flex" gap={1}>
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(vpnData);
                      }}
                    >
                      İptal
                    </MDButton>
                    <MDButton
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={handleSaveChanges}
                    >
                      Kaydet
                    </MDButton>
                  </MDBox>
                ) : (
                  <MDButton
                    variant="outlined"
                    color="info"
                    size="small"
                    startIcon={<Icon>edit</Icon>}
                    onClick={() => setIsEditing(true)}
                  >
                    Düzenle
                  </MDButton>
                )
              }
            />
            <CardContent>
              {vpnData ? (
                <MDBox display="flex" flexDirection="column" gap={3}>
                  <MDInput
                    label="VPN Uygulaması"
                    fullWidth
                    value={isEditing ? editedData?.vpnUygulamasi : vpnData.vpnUygulamasi}
                    name="vpnUygulamasi"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <MDInput
                    label="VPN Adres"
                    fullWidth
                    value={isEditing ? editedData?.vpnAddress : vpnData.vpnAddress}
                    name="vpnAddress"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <MDInput
                    label="Kurulum Dosya Linki"
                    fullWidth
                    value={isEditing ? editedData?.kurulumDosyaLinki : vpnData.kurulumDosyaLinki}
                    name="kurulumDosyaLinki"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      endAdornment: (
                        <MDButton
                          variant="text"
                          color="info"
                          size="small"
                          onClick={() => window.open(vpnData.kurulumDosyaLinki, "_blank")}
                        >
                          <Icon>download</Icon>
                        </MDButton>
                      ),
                    }}
                  />
                  <MDBox>
                    <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                      Notlar
                    </MDTypography>
                    <MDInput
                      multiline
                      rows={4}
                      fullWidth
                      value={isEditing ? editedData?.not : vpnData.not}
                      name="not"
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </MDBox>
                </MDBox>
              ) : (
                <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
                  <MDTypography>Yükleniyor...</MDTypography>
                </MDBox>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {/* <Card
            sx={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              borderRadius: "16px",
              padding: "0 0 24px 0",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
              },
              border: "1px solid #e2e8f0",
            }}
          >
            <CardHeader title="Değişiklik Geçmişi" />
            <CardContent>
              {historyLogs.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e2e8f0" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                        <TableCell>
                          <MDTypography variant="subtitle2" fontWeight="medium">
                            Kullanıcı
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="subtitle2" fontWeight="medium">
                            İşlem
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="subtitle2" fontWeight="medium">
                            Eski Değer
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="subtitle2" fontWeight="medium">
                            Yeni Değer
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="subtitle2" fontWeight="medium">
                            Tarih
                          </MDTypography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyLogs
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map((log) => (
                          <TableRow key={log.id} sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}>
                            <TableCell>
                              <MDTypography variant="body2" fontWeight="medium">
                                {log.userName}
                              </MDTypography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={log.action}
                                size="small"
                                color="info"
                                variant="outlined"
                                sx={{ fontSize: "0.75rem" }}
                              />
                            </TableCell>
                            <TableCell>
                              <MDBox
                                sx={{
                                  backgroundColor: "#fef2f2",
                                  border: "1px solid #fecaca",
                                  borderRadius: "6px",
                                  padding: "4px 8px",
                                  display: "inline-block",
                                  maxWidth: "200px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                <MDTypography variant="caption" color="error">
                                  {log.oldValue}
                                </MDTypography>
                              </MDBox>
                            </TableCell>
                            <TableCell>
                              <MDBox
                                sx={{
                                  backgroundColor: "#f0fdf4",
                                  border: "1px solid #bbf7d0",
                                  borderRadius: "6px",
                                  padding: "4px 8px",
                                  display: "inline-block",
                                  maxWidth: "200px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                <MDTypography variant="caption" color="success">
                                  {log.newValue}
                                </MDTypography>
                              </MDBox>
                            </TableCell>
                            <TableCell>
                              <MDTypography variant="caption" color="text.secondary">
                                {formatTimestamp(log.timestamp)}
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
                  <MDTypography color="text.secondary">
                    Henüz değişiklik kaydı bulunmuyor.
                  </MDTypography>
                </MDBox>
              )}
            </CardContent>
          </Card> */}
        
          <Card
            sx={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              borderRadius: "16px",
              padding: "0 0 24px 0",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
              },
              border: "1px solid #e2e8f0",
            }}
          >
            <CardHeader title="Kullanıcı Yorumları" />
            <CardContent>
              <MDBox display="flex" flexDirection="column" gap={3}>
                {/* Add new comment section */}
                <MDBox display="flex" flexDirection="column" gap={2}>
                  <MDInput
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Bu VPN hakkında deneyiminizi paylaşın..."
                    value={newComment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                  />
                  <MDBox display="flex" justifyContent="flex-end">
                    <MDButton
                      variant="contained"
                      color="info"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Yorum Ekle
                    </MDButton>
                  </MDBox>
                </MDBox>

                {/* Comments list */}
                {comments.length > 0 ? (
                  <MDBox display="flex" flexDirection="column" gap={2}>
                    {comments
                      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
                      .map((comment) => (
                        <MDBox
                          key={comment.id}
                          sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "16px",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <MDBox>
                              <MDTypography variant="subtitle2" fontWeight="medium">
                                {comment.userName}
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                {formatTimestamp(comment.timestamp)}
                              </MDTypography>
                            </MDBox>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              <MDButton
                                variant="text"
                                color={comment.userVotes[currentUserId] === 'up' ? "success" : "secondary"}
                                size="small"
                                onClick={() => handleVote(comment.id, 'up')}
                                sx={{ minWidth: "auto", padding: "4px 8px" }}
                              >
                                <Icon>thumb_up</Icon>
                                <MDTypography variant="caption" ml={0.5}>
                                  {comment.upvotes}
                                </MDTypography>
                              </MDButton>
                              <MDButton
                                variant="text"
                                color={comment.userVotes[currentUserId] === 'down' ? "error" : "secondary"}
                                size="small"
                                onClick={() => handleVote(comment.id, 'down')}
                                sx={{ minWidth: "auto", padding: "4px 8px" }}
                              >
                                <Icon>thumb_down</Icon>
                                <MDTypography variant="caption" ml={0.5}>
                                  {comment.downvotes}
                                </MDTypography>
                              </MDButton>
                              <MDTypography variant="caption" color="text.secondary" ml={1}>
                                Skor: {comment.upvotes - comment.downvotes}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                          <MDTypography variant="body2">
                            {comment.comment}
                          </MDTypography>
                        </MDBox>
                      ))}
                  </MDBox>
                ) : (
                  <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
                    <MDTypography color="text.secondary">
                      Henüz yorum yapılmamış. İlk yorumu siz yapın!
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default VPNDetail;
