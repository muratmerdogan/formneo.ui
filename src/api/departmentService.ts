// src/api/departmentService.ts
import { v4 as uuidv4 } from "uuid";

export interface Department {
  id: string;
  name: string;
  code?: string;
  parentDepartmentId?: string;
  isActive: boolean;
}

// Mock data for demonstration
let departments: Department[] = [
  { id: uuidv4(), name: "Yönetim", code: "YON", isActive: true },
  { id: uuidv4(), name: "İK", code: "IK", isActive: true },
  { id: uuidv4(), name: "Muhasebe", code: "MUH", isActive: false },
];

export const getDepartments = (filter: { search?: string; isActive?: boolean | null } = {}) => {
  let result = [...departments];
  if (filter.search) {
    const s = filter.search.toLowerCase();
    result = result.filter(
      (d) => d.name.toLowerCase().includes(s) || (d.code && d.code.toLowerCase().includes(s))
    );
  }
  if (filter.isActive !== undefined && filter.isActive !== null) {
    result = result.filter((d) => d.isActive === filter.isActive);
  }
  return Promise.resolve(result);
};

export const addDepartment = (dep: Omit<Department, "id">) => {
  const newDep = { ...dep, id: uuidv4() };
  departments.push(newDep);
  return Promise.resolve(newDep);
};

export const updateDepartment = (id: string, dep: Partial<Department>) => {
  departments = departments.map((d) => (d.id === id ? { ...d, ...dep } : d));
  return Promise.resolve();
};

export const softDeleteDepartment = (id: string) => {
  departments = departments.map((d) => (d.id === id ? { ...d, isActive: false } : d));
  return Promise.resolve();
};
