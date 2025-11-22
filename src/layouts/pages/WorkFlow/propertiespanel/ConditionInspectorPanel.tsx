import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Divider,
  Paper,
  Chip,
  Alert,
  Tabs,
  Tab,
  Stack,
  Card,
  CardContent,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { ConditionGroup, ConditionRule, ConditionOperator, ConditionDataSource } from "../types/condition.types";
import { evaluateCondition, getConditionSummary } from "../utils/conditionEvaluator";

interface ConditionInspectorPanelProps {
  node: any;
  nodes?: any[];
  edges?: any[];
  onSave: (data: any) => void;
}

const ConditionInspectorPanel: React.FC<ConditionInspectorPanelProps> = ({
  node,
  nodes = [],
  edges = [],
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [nodeName, setNodeName] = useState(node?.data?.name || "Condition");
  const [dataSource, setDataSource] = useState<ConditionDataSource>(
    node?.data?.dataSource || "previousNode"
  );
  const [previousNodeId, setPreviousNodeId] = useState(node?.data?.previousNodeId || "");
  const [condition, setCondition] = useState<ConditionGroup>(
    node?.data?.condition || {
      id: "group-1",
      logic: "AND",
      rules: [],
    }
  );
  const [testData, setTestData] = useState<string>("{}");
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["group-1"]));

  // Available previous nodes
  const previousNodes = useMemo(() => {
    if (!node?.id || !edges || edges.length === 0) return [];
    const incomingEdges = edges.filter((edge: any) => edge.target === node.id);
    return incomingEdges
      .map((edge: any) => nodes.find((n: any) => n.id === edge.source))
      .filter((n: any) => n && n.type !== "startNode");
  }, [node?.id, edges, nodes]);

  // Available fields based on data source
  const availableFields = useMemo(() => {
    if (dataSource === "previousNode" && previousNodeId) {
      const prevNode = nodes.find((n: any) => n.id === previousNodeId);
      if (prevNode?.type === "formNode") {
        return [
          { name: "action", label: "Action", type: "string" },
          { name: "formData", label: "Form Data", type: "object" },
        ];
      }
    }
    return [];
  }, [dataSource, previousNodeId, nodes]);

  // Generate unique ID
  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add rule to group
  const addRule = useCallback((groupId: string) => {
    const newRule: ConditionRule = {
      id: generateId(),
      field: availableFields[0]?.name || "",
      operator: "==",
      value: "",
    };

    const addRuleToGroup = (group: ConditionGroup): ConditionGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: [...group.rules, newRule],
        };
      }
      return {
        ...group,
        rules: group.rules.map((r) =>
          "logic" in r ? addRuleToGroup(r as ConditionGroup) : r
        ),
      };
    };

    setCondition(addRuleToGroup(condition));
  }, [condition, availableFields]);

  // Add nested group
  const addGroup = useCallback((groupId: string) => {
    const newGroup: ConditionGroup = {
      id: generateId(),
      logic: "AND",
      rules: [],
    };

    const addGroupToGroup = (group: ConditionGroup): ConditionGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: [...group.rules, newGroup],
        };
      }
      return {
        ...group,
        rules: group.rules.map((r) =>
          "logic" in r ? addGroupToGroup(r as ConditionGroup) : r
        ),
      };
    };

    setCondition(addGroupToGroup(condition));
    setExpandedGroups(new Set([...expandedGroups, newGroup.id]));
  }, [condition, expandedGroups]);

  // Delete rule or group
  const deleteItem = useCallback((groupId: string, itemId: string) => {
    const deleteFromGroup = (group: ConditionGroup): ConditionGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.filter((r) => r.id !== itemId),
        };
      }
      return {
        ...group,
        rules: group.rules.map((r) =>
          "logic" in r ? deleteFromGroup(r as ConditionGroup) : r
        ),
      };
    };

    setCondition(deleteFromGroup(condition));
  }, [condition]);

  // Update rule
  const updateRule = useCallback((groupId: string, ruleId: string, updates: Partial<ConditionRule>) => {
    const updateInGroup = (group: ConditionGroup): ConditionGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.map((r) =>
            r.id === ruleId ? { ...(r as ConditionRule), ...updates } : r
          ),
        };
      }
      return {
        ...group,
        rules: group.rules.map((r) =>
          "logic" in r ? updateInGroup(r as ConditionGroup) : r
        ),
      };
    };

    setCondition(updateInGroup(condition));
  }, [condition]);

  // Update group logic
  const updateGroupLogic = useCallback((groupId: string, logic: "AND" | "OR") => {
    const updateLogic = (group: ConditionGroup): ConditionGroup => {
      if (group.id === groupId) {
        return { ...group, logic };
      }
      return {
        ...group,
        rules: group.rules.map((r) =>
          "logic" in r ? updateLogic(r as ConditionGroup) : r
        ),
      };
    };

    setCondition(updateLogic(condition));
  }, [condition]);

  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Test condition
  const handleTest = () => {
    try {
      const data = JSON.parse(testData);
      const result = evaluateCondition(condition, data);
      setTestResult(result);
    } catch (e) {
      alert("Invalid JSON data");
    }
  };

  // Save
  const handleSave = () => {
    onSave({
      name: nodeName,
      dataSource,
      previousNodeId,
      condition,
      outputs: {
        true: null,
        false: null,
      },
    });
  };

  // Render rule
  const renderRule = (rule: ConditionRule, groupId: string) => (
    <Paper key={rule.id} sx={{ p: 2, mb: 1, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Field</InputLabel>
          <Select
            value={rule.field}
            label="Field"
            onChange={(e) => updateRule(groupId, rule.id, { field: e.target.value })}
          >
            {availableFields.map((field) => (
              <MenuItem key={field.name} value={field.name}>
                {field.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Operator</InputLabel>
          <Select
            value={rule.operator}
            label="Operator"
            onChange={(e) => updateRule(groupId, rule.id, { operator: e.target.value as ConditionOperator })}
          >
            <MenuItem value="==">Equals</MenuItem>
            <MenuItem value="!=">Not Equals</MenuItem>
            <MenuItem value=">">Greater Than</MenuItem>
            <MenuItem value="<">Less Than</MenuItem>
            <MenuItem value=">=">Greater or Equal</MenuItem>
            <MenuItem value="<=">Less or Equal</MenuItem>
            <MenuItem value="contains">Contains</MenuItem>
            <MenuItem value="startsWith">Starts With</MenuItem>
            <MenuItem value="endsWith">Ends With</MenuItem>
            <MenuItem value="in">In</MenuItem>
            <MenuItem value="isEmpty">Is Empty</MenuItem>
            <MenuItem value="isNotEmpty">Is Not Empty</MenuItem>
          </Select>
        </FormControl>

        {!["isEmpty", "isNotEmpty"].includes(rule.operator) && (
          <TextField
            size="small"
            label="Value"
            value={rule.value}
            onChange={(e) => updateRule(groupId, rule.id, { value: e.target.value })}
            sx={{ flex: 1 }}
          />
        )}

        <IconButton
          size="small"
          color="error"
          onClick={() => deleteItem(groupId, rule.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  );

  // Render group
  const renderGroup = (group: ConditionGroup, level: number = 0) => {
    const isExpanded = expandedGroups.has(group.id);
    const indent = level * 24;

    return (
      <Card
        key={group.id}
        sx={{
          mb: 2,
          border: "1px solid #e5e7eb",
          bgcolor: level > 0 ? "#f9fafb" : "white",
          ml: `${indent}px`,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <IconButton size="small" onClick={() => toggleGroup(group.id)}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={group.logic}
                onChange={(e) => updateGroupLogic(group.id, e.target.value as "AND" | "OR")}
              >
                <MenuItem value="AND">AND</MenuItem>
                <MenuItem value="OR">OR</MenuItem>
              </Select>
            </FormControl>

            <Chip label={`${group.rules.length} items`} size="small" />

            <Box sx={{ flex: 1 }} />

            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => addRule(group.id)}
              variant="outlined"
            >
              Add Rule
            </Button>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => addGroup(group.id)}
              variant="outlined"
            >
              Add Group
            </Button>
            {level > 0 && (
              <IconButton
                size="small"
                color="error"
                onClick={() => deleteItem("", group.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>

          <Collapse in={isExpanded}>
            <Box>
              {group.rules.map((item) =>
                "logic" in item ? renderGroup(item as ConditionGroup, level + 1) : renderRule(item as ConditionRule, group.id)
              )}
              {group.rules.length === 0 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  No rules in this group. Add a rule or nested group.
                </Alert>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<SettingsIcon />} iconPosition="start" label="General" />
        <Tab icon={<CodeIcon />} iconPosition="start" label="Conditions" />
        <Tab icon={<PlayIcon />} iconPosition="start" label="Test" />
      </Tabs>

      {/* General Tab */}
      {activeTab === 0 && (
        <Stack spacing={3}>
          <TextField
            label="Node Name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Data Source</InputLabel>
            <Select
              value={dataSource}
              label="Data Source"
              onChange={(e) => setDataSource(e.target.value as ConditionDataSource)}
            >
              <MenuItem value="previousNode">Previous Node</MenuItem>
              <MenuItem value="formData">Form Data</MenuItem>
              <MenuItem value="taskResult">Task Result</MenuItem>
              <MenuItem value="apiResponse">API Response</MenuItem>
              <MenuItem value="scriptOutput">Script Output</MenuItem>
            </Select>
          </FormControl>

          {dataSource === "previousNode" && (
            <FormControl fullWidth>
              <InputLabel>Previous Node</InputLabel>
              <Select
                value={previousNodeId}
                label="Previous Node"
                onChange={(e) => setPreviousNodeId(e.target.value)}
              >
                {previousNodes.map((n: any) => (
                  <MenuItem key={n.id} value={n.id}>
                    {n.data?.name || n.type || n.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
      )}

      {/* Conditions Tab */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Condition Rules</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => addRule(condition.id)}
            >
              Add Rule
            </Button>
          </Box>

          {renderGroup(condition)}

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" gutterBottom>
            JSON Preview
          </Typography>
          <Paper sx={{ p: 2, bgcolor: "#1e1e1e", color: "#d4d4d4", borderRadius: "8px" }}>
            <pre style={{ margin: 0, fontSize: "12px", overflow: "auto" }}>
              {JSON.stringify(condition, null, 2)}
            </pre>
          </Paper>
        </Box>
      )}

      {/* Test Tab */}
      {activeTab === 2 && (
        <Stack spacing={3}>
          <Typography variant="h6">Test Condition</Typography>

          <TextField
            label="Test Data (JSON)"
            multiline
            rows={8}
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "monospace",
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={handleTest}
            fullWidth
          >
            Evaluate Condition
          </Button>

          {testResult !== null && (
            <Alert severity={testResult ? "success" : "error"}>
              Result: <strong>{testResult ? "TRUE" : "FALSE"}</strong>
            </Alert>
          )}

          <Alert severity="info">
            <Typography variant="caption">
              Enter JSON data to test the condition. Example: {"{"}&quot;action&quot;: &quot;APPROVE&quot;, &quot;amount&quot;: 1000{"}"}
            </Typography>
          </Alert>
        </Stack>
      )}

      <Divider sx={{ my: 3 }} />

      <Button variant="contained" fullWidth onClick={handleSave} sx={{ mt: 2 }}>
        Save Condition Node
      </Button>
    </Box>
  );
};

export default ConditionInspectorPanel;

