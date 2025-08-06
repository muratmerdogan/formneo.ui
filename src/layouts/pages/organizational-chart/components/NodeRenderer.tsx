import React, { memo, Fragment ,useRef} from "react";
import { TreeNode } from "react-organizational-chart";
import { Icon, Tooltip } from "@mui/material";
import { OrgNode } from "../fakeData";
import {
  StyledNode,
  PersonNode,
  ImageContainer,
  ProfileImage,
  NodeContent,
  NodeName,
  NodeTitle,
  DepartmentNode,
  DepartmentName,
  ToggleButton,
} from "../styles/orgChart.styles";
import { useZoom } from "../hooks/useZoom";

interface NodeRendererProps {
  node: OrgNode;
  isExpanded: (nodeId: string) => boolean;
  toggleNode: (nodeId: string) => void;
}

// Memo ile gereksiz render'ları önle
export const NodeRenderer = memo<NodeRendererProps>(({ node, isExpanded, toggleNode }) => {
   const chartContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { resetZoom } = useZoom({
    containerRef: chartContainerRef,
    contentRef: contentRef,
  });
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNode(node.id);
    resetZoom();
       console.log("resetlenmeli")
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleNode(node.id);
       
    }
  };

  if (node.type === "department") {
    return (
      <Tooltip title={`Department: ${node.name}`} arrow placement="top">
        <StyledNode className="chart-node" tabIndex={0}>
          <DepartmentNode>
            <DepartmentName>{node.name}</DepartmentName>
          </DepartmentNode>
          {node.children?.length > 0 && (
            <ToggleButton
              size="small"
              className="toggle-button"
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              aria-label={`${isExpanded(node.id) ? "Collapse" : "Expand"} ${node.name}`}
            >
              <Icon fontSize="small">{isExpanded(node.id) ? "expand_more" : "expand_less"}</Icon>
            </ToggleButton>
          )}
        </StyledNode>
      </Tooltip>
    );
  }

  const tooltipTitle = node.title ? `${node.name} - ${node.title}` : node.name;

  return (
    <Tooltip title={tooltipTitle} arrow placement="top">
      <StyledNode className="chart-node" tabIndex={0}>
        <PersonNode className={`person-node ${node.className || ""}`}>
          {node.photo && (
            <ImageContainer>
              <ProfileImage
                  src={`data:image/jpeg;base64,${node.photo.startsWith('data:image') ? node.photo.split(',')[1] : node.photo}`}
                alt={`${node.name}'s photo`}
                loading="lazy"
                width="80"
                height="80"
              />
            </ImageContainer>
          )}
          <NodeContent>
            <NodeName>{node.name}</NodeName>
            {node.title && <NodeTitle>{node.title}</NodeTitle>}
          </NodeContent>
        </PersonNode>
        {/* {node.children?.length > 0 && (
          <ToggleButton
            size="small"
            className="toggle-button"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            aria-label={`${isExpanded(node.id) ? "Collapse" : "Expand"} ${node.name}'s team`}
          >
            <Icon fontSize="small">{isExpanded(node.id) ? "expand_more" : "expand_less"}</Icon>
          </ToggleButton>
        )} */}
      </StyledNode>
    </Tooltip>
  );
});

NodeRenderer.displayName = "NodeRenderer";

// Düzgün bir React bileşeni olarak tanımla
interface RenderTreeNodesProps {
  nodes: OrgNode[];
  isExpanded: (nodeId: string) => boolean;
  toggleNode: (nodeId: string) => void;
}

export const RenderTreeNodes: React.FC<RenderTreeNodesProps> = memo(
  ({ nodes, isExpanded, toggleNode }) => {
    return (
      <Fragment>
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            label={<NodeRenderer node={node} isExpanded={isExpanded} toggleNode={toggleNode} />}
          >
            {node.children && isExpanded(node.id) && (
              <RenderTreeNodes
                nodes={node.children}
                isExpanded={isExpanded}
                toggleNode={toggleNode}
              />
            )}
          </TreeNode>
        ))}
      </Fragment>
    );
  }
);

RenderTreeNodes.displayName = "RenderTreeNodes";
