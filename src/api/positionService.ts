// src/api/positionService.ts
import { v4 as uuidv4 } from "uuid";

export interface Position {
  id: string;
  name: string;
  code?: string;
  departmentId?: string;
  isActive: boolean;
}

// Mock data for demonstration
let positions: Position[] = [
  { id: uuidv4(), name: "Yönetici", code: "YON", departmentId: undefined, isActive: true },
  { id: uuidv4(), name: "İK Uzmanı", code: "IKU", departmentId: undefined, isActive: true },
  { id: uuidv4(), name: "Muhasebe Sorumlusu", code: "MUHS", departmentId: undefined, isActive: false },
];

export const getPositions = (filter: { search?: string; departmentId?: string; isActive?: boolean | null } = {}) => {
  let result = [...positions];
  if (filter.search) {
    const s = filter.search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(s) || (p.code && p.code.toLowerCase().includes(s))
    );
  }
  if (filter.departmentId) {
    result = result.filter((p) => p.departmentId === filter.departmentId);
  }
  if (filter.isActive !== undefined && filter.isActive !== null) {
    result = result.filter((p) => p.isActive === filter.isActive);
  }
  return Promise.resolve(result);
};

export const addPosition = (pos: Omit<Position, "id">) => {
  const newPos = { ...pos, id: uuidv4() };
  positions.push(newPos);
  return Promise.resolve(newPos);
};

export const updatePosition = (id: string, pos: Partial<Position>) => {
  positions = positions.map((p) => (p.id === id ? { ...p, ...pos } : p));
  return Promise.resolve();
};

export const softDeletePosition = (id: string) => {
  positions = positions.map((p) => (p.id === id ? { ...p, isActive: false } : p));
  return Promise.resolve();
};
