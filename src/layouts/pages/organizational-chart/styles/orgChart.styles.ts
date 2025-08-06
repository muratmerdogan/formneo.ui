import styled from "@emotion/styled";
import { IconButton } from "@mui/material";

export const StyledNode = styled.div`
  padding: 0;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease-in-out;
`;

export const PersonNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: visible;
  position: relative;
  margin: 0 auto;
  width: 220px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &.ceo-node {
    border-left: 4px solid #5b6aff;
    background-color: #fafbff;
  }

  &.executive-node {
    border-left: 4px solid #6c8aff;
    background-color: #fafbff;
  }

  &.manager-node {
    border-left: 4px solid #7d9eff;
  }

  &.employee-node {
    width: 220px;
  }
`;

export const ImageContainer = styled.div`
  width: 44px;
  height: 44px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f3f9;
  border-radius: 50%;
  margin-right: 12px;
  margin-top: 4px;
  margin-bottom: 4px;
  flex-shrink: 0;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const NodeContent = styled.div`
  padding: 0;
  flex-grow: 1;
  text-align: left;
  min-width: 0;
`;

export const NodeName = styled.div`
  font-weight: 600;
  color: #2c2c2c;
  font-size: 14px;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  letter-spacing: -0.2px;

  .ceo-node & {
    color: #4856e8;
    font-size: 15px;
  }
`;

export const NodeTitle = styled.div`
  color: #6e6e6e;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  letter-spacing: -0.1px;
`;

export const DepartmentNode = styled.div`
  background-color: #f8f9fb;
  border: 1px solid #e8eaef;
  border-radius: 10px;
  padding: 10px 16px;
  min-width: 120px;
  margin: 0 auto;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.07);
    transform: translateY(-2px);
  }
`;

export const DepartmentName = styled.div`
  font-weight: 600;
  color: #3a3a3a;
  font-size: 13px;
  text-align: center;
  letter-spacing: -0.2px;
`;

export const ToggleButton = styled(IconButton)`
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  background-color: white;
  border: 1px solid #e5e5e5;
  z-index: 10;
  padding: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f5f7ff;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  }

  & .material-icons {
    font-size: 16px;
    color: #5b6aff;
  }
`;

export const chartContainerStyle = {
  width: "100%",
  height: "75vh",
  overflow: "auto",
  position: "relative" as const,
  backgroundColor: "#fbfbfd",
  borderRadius: "12px",
};

export const getChartContentStyle = (zoom: number, x: number, y: number) => ({
  transform: `scale(${zoom / 100})`,
  transformOrigin: "0 0",
  position: "absolute" as const,
  left: `${x}px`,
  top: `${y}px`,
  padding: "30px",
  willChange: "transform, left, top",
});
