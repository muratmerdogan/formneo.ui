// Customer lifecycle stage mapping
export const CUSTOMER_LIFECYCLE_STAGES = [
  "lead",
  "mql", 
  "sql",
  "opportunity",
  "customer"
] as const;

export type CustomerLifecycleStage = typeof CUSTOMER_LIFECYCLE_STAGES[number];

// Status mapping
export const CUSTOMER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;

export type CustomerStatus = typeof CUSTOMER_STATUS[keyof typeof CUSTOMER_STATUS];

// Form status enum
export const FORM_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FormStatus = typeof FORM_STATUS[keyof typeof FORM_STATUS];

// Status conversion helpers
export const convertFormStatusToApi = (status: FormStatus): CustomerStatus => {
  return status === FORM_STATUS.ACTIVE ? CUSTOMER_STATUS.ACTIVE : CUSTOMER_STATUS.INACTIVE;
};

export const convertApiStatusToForm = (status: CustomerStatus): FormStatus => {
  return status === CUSTOMER_STATUS.ACTIVE ? FORM_STATUS.ACTIVE : FORM_STATUS.INACTIVE;
};

// Lifecycle stage conversion helpers
export const convertLifecycleStageToApi = (stage: CustomerLifecycleStage): number => {
  return CUSTOMER_LIFECYCLE_STAGES.indexOf(stage);
};

export const convertApiLifecycleStageToForm = (stage: number): CustomerLifecycleStage | undefined => {
  return CUSTOMER_LIFECYCLE_STAGES[stage];
};
