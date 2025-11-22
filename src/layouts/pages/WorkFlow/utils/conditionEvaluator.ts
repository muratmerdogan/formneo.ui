/**
 * Condition Evaluation Logic
 * Recursively evaluates condition groups and rules
 */

import { ConditionGroup, ConditionRule } from "../types/condition.types";

/**
 * Get value from nested object using dot notation
 * Example: getNestedValue(data, "formData.amount") -> data.formData.amount
 */
function getNestedValue(obj: any, path: string): any {
  if (!path) return undefined;
  
  const parts = path.split(".");
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  
  return current;
}

/**
 * Evaluate a single condition rule
 */
function evaluateRule(rule: ConditionRule, sourceData: any): boolean {
  const fieldValue = getNestedValue(sourceData, rule.field);
  const ruleValue = rule.value;

  switch (rule.operator) {
    case "==":
      return fieldValue == ruleValue;
    
    case "!=":
      return fieldValue != ruleValue;
    
    case ">":
      return Number(fieldValue) > Number(ruleValue);
    
    case "<":
      return Number(fieldValue) < Number(ruleValue);
    
    case ">=":
      return Number(fieldValue) >= Number(ruleValue);
    
    case "<=":
      return Number(fieldValue) <= Number(ruleValue);
    
    case "contains":
      if (typeof fieldValue === "string" && typeof ruleValue === "string") {
        return fieldValue.toLowerCase().includes(ruleValue.toLowerCase());
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(ruleValue);
      }
      return false;
    
    case "startsWith":
      if (typeof fieldValue === "string" && typeof ruleValue === "string") {
        return fieldValue.toLowerCase().startsWith(ruleValue.toLowerCase());
      }
      return false;
    
    case "endsWith":
      if (typeof fieldValue === "string" && typeof ruleValue === "string") {
        return fieldValue.toLowerCase().endsWith(ruleValue.toLowerCase());
      }
      return false;
    
    case "in":
      if (Array.isArray(ruleValue)) {
        return ruleValue.includes(fieldValue);
      }
      return false;
    
    case "notIn":
      if (Array.isArray(ruleValue)) {
        return !ruleValue.includes(fieldValue);
      }
      return true;
    
    case "isEmpty":
      return fieldValue === null || fieldValue === undefined || fieldValue === "" || 
             (Array.isArray(fieldValue) && fieldValue.length === 0);
    
    case "isNotEmpty":
      return fieldValue !== null && fieldValue !== undefined && fieldValue !== "" && 
             !(Array.isArray(fieldValue) && fieldValue.length === 0);
    
    default:
      return false;
  }
}

/**
 * Recursively evaluate a condition group
 */
export function evaluateCondition(
  group: ConditionGroup,
  sourceData: any
): boolean {
  if (!group.rules || group.rules.length === 0) {
    return true; // Empty group is true
  }

  const results = group.rules.map((ruleOrGroup) => {
    if ("logic" in ruleOrGroup) {
      // It's a nested group
      return evaluateCondition(ruleOrGroup as ConditionGroup, sourceData);
    } else {
      // It's a rule
      return evaluateRule(ruleOrGroup as ConditionRule, sourceData);
    }
  });

  if (group.logic === "AND") {
    return results.every((result) => result === true);
  } else {
    // OR logic
    return results.some((result) => result === true);
  }
}

/**
 * Generate a human-readable summary of the condition
 */
export function getConditionSummary(group: ConditionGroup): string {
  if (!group.rules || group.rules.length === 0) {
    return "No conditions";
  }

  const ruleCount = group.rules.length;
  const logicLabel = group.logic === "AND" ? "AND" : "OR";
  
  if (ruleCount === 1) {
    const rule = group.rules[0];
    if ("logic" in rule) {
      return `1 group (${logicLabel})`;
    } else {
      const r = rule as ConditionRule;
      return `${r.field} ${r.operator} ${r.value}`;
    }
  }

  return `${ruleCount} rules • ${logicLabel}`;
}

/**
 * Count total rules (including nested)
 */
export function countTotalRules(group: ConditionGroup): number {
  let count = 0;
  
  for (const ruleOrGroup of group.rules) {
    if ("logic" in ruleOrGroup) {
      count += countTotalRules(ruleOrGroup as ConditionGroup);
    } else {
      count += 1;
    }
  }
  
  return count;
}

