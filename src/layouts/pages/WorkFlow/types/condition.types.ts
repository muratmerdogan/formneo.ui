/**
 * Condition Node Type Definitions
 * n8n-style condition evaluation system
 */

export type ConditionOperator =
  | "=="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "contains"
  | "startsWith"
  | "endsWith"
  | "in"
  | "notIn"
  | "isEmpty"
  | "isNotEmpty";

export interface ConditionRule {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
}

export interface ConditionGroup {
  id: string;
  logic: "AND" | "OR";
  rules: Array<ConditionRule | ConditionGroup>;
}

export type ConditionDataSource = "formData" | "taskResult" | "apiResponse" | "scriptOutput" | "previousNode";

export interface ConditionNodeConfig {
  id: string;
  type: "condition";
  name?: string;
  dataSource: ConditionDataSource;
  previousNodeId?: string;
  condition: ConditionGroup;
  outputs: {
    true: string | null;
    false: string | null;
  };
}

