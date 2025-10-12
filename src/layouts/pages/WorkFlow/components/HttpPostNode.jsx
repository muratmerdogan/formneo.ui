import React from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, Icon } from "@mui/material";

const HttpPostNode = ({ data }) => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "2px solid #ff6b6b",
        minWidth: "150px",
        boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Icon sx={{ fontSize: 20 }}>send</Icon>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          HTTP POST
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ opacity: 0.9 }}>
        {data?.url || "URL belirtilmedi"}
      </Typography>

      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default HttpPostNode;
