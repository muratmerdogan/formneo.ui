import React, { useState } from "react";
import { MenuList, MenuItem, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import {
  FaBookOpen,
  FaUsers,
  FaFile,
  FaFileWord,
  FaCode,
  FaVolumeUp,
  FaArrowRight,
  FaChevronRight,
  FaChevronDown,
  FaUserCheck,
  FaDatabase,
  FaSearch,
  FaGlobe,
  FaEnvelope,
  FaPlay,
  FaStop,
  FaPlug,
  FaWpforms,
} from "react-icons/fa";

const CustomMenuList = () => {
  const [open, setOpen] = useState({
    smartOptions: false,
    documentOptions: false,
    otherOptions: false,
  });

  const handleClick = (group) => {
    setOpen((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <MenuList>
      <MenuItem
        onClick={() => handleClick("smartOptions")}
        sx={{ bgcolor: "primary.main", color: "common.white" }}
      >
        <ListItemIcon>
          <FaBookOpen style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Karar Yapıları" />
        {open.smartOptions ? (
          <FaChevronDown style={{ color: "white" }} />
        ) : (
          <FaChevronRight style={{ color: "white" }} />
        )}
      </MenuItem>
      <Collapse in={open.smartOptions} timeout="auto" unmountOnExit>
        <MenuItem onDragStart={(event) => onDragStart(event, "approverNode")} draggable>
          <ListItemIcon>
            <FaUserCheck />
          </ListItemIcon>
          <ListItemText inset>Onaycı</ListItemText>
        </MenuItem>
      </Collapse>

      <Collapse in={open.smartOptions} timeout="auto" unmountOnExit>
        <MenuItem onDragStart={(event) => onDragStart(event, "sqlConditionNode")} draggable>
          <ListItemIcon>
            <FaDatabase />
          </ListItemIcon>
          <ListItemText inset>Sql Koşul</ListItemText>
        </MenuItem>
      </Collapse>
      <Collapse in={open.smartOptions} timeout="auto" unmountOnExit>
        <MenuItem onDragStart={(event) => onDragStart(event, "queryConditionNode")} draggable>
          <ListItemIcon>
            <FaSearch />
          </ListItemIcon>
          <ListItemText inset>Sorgu Kriteri</ListItemText>
        </MenuItem>
      </Collapse>
      <Collapse in={open.smartOptions} timeout="auto" unmountOnExit>
        <MenuItem onDragStart={(event) => onDragStart(event, "httpPostNode")} draggable>
          <ListItemIcon>
            <FaGlobe />
          </ListItemIcon>
          <ListItemText inset>Http Post</ListItemText>
        </MenuItem>
      </Collapse>
      <Collapse in={open.smartOptions} timeout="auto" unmountOnExit>
        <MenuItem onDragStart={(event) => onDragStart(event, "mailNode")} draggable>
          <ListItemIcon>
            <FaEnvelope />
          </ListItemIcon>
          <ListItemText inset>Mail Gönder</ListItemText>
        </MenuItem>
      </Collapse>

      <MenuItem
        onClick={() => handleClick("documentOptions")}
        sx={{ bgcolor: "secondary.main", color: "common.white" }}
      >
        <ListItemIcon>
          <FaFile style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Scripts" />
        {open.documentOptions ? (
          <FaChevronDown style={{ color: "white" }} />
        ) : (
          <FaChevronRight style={{ color: "white" }} />
        )}
      </MenuItem>
      <Collapse in={open.documentOptions} timeout="auto" unmountOnExit>
        <MenuItem onDragStart={(event) => onDragStart(event, "inputDataNode")} draggable>
          <ListItemIcon>
            <FaPlug />
          </ListItemIcon>
          <ListItemText inset>Api Call</ListItemText>
        </MenuItem>
      </Collapse>

      <MenuItem
        onClick={() => handleClick("otherOptions")}
        sx={{ bgcolor: "error.main", color: "common.white" }}
      >
        <ListItemIcon>
          <FaVolumeUp style={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Diğer" />
        {open.otherOptions ? (
          <FaChevronDown style={{ color: "white" }} />
        ) : (
          <FaChevronRight style={{ color: "white" }} />
        )}
      </MenuItem>
      <Collapse in={open.otherOptions} timeout="auto" unmountOnExit>
        <MenuItem onDragStart={(event) => onDragStart(event, "startNode")} draggable>
          <ListItemIcon>
            <FaPlay />
          </ListItemIcon>
          <ListItemText inset>Start</ListItemText>
        </MenuItem>

        <MenuItem onDragStart={(event) => onDragStart(event, "stopNode")} draggable>
          <ListItemIcon>
            <FaStop />
          </ListItemIcon>
          <ListItemText inset>Stop</ListItemText>
        </MenuItem>
        <MenuItem onDragStart={(event) => onDragStart(event, "formStopNode")} draggable>
          <ListItemIcon>
            <FaWpforms style={{ marginRight: "2px" }} />
            <FaStop />
          </ListItemIcon>
          <ListItemText inset>Stop (Form)</ListItemText>
        </MenuItem>
      </Collapse>
    </MenuList>
  );
};

export default CustomMenuList;
