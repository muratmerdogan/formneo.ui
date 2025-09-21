import { useState, useCallback } from 'react';
import { LookupItemDto } from 'api/generated/api';

interface CustomerReferences {
  customerTypeRefId: string | null;
  categoryRefId: string | null;
}

interface CustomerReferenceActions {
  setCustomerTypeRef: (item: LookupItemDto | null) => void;
  setCategoryRef: (item: LookupItemDto | null) => void;
  clearReferences: () => void;
  loadReferences: (customerTypeId?: string | null, categoryId?: string | null) => void;
}

export const useCustomerReferences = (): CustomerReferences & CustomerReferenceActions => {
  const [customerTypeRefId, setCustomerTypeRefId] = useState<string | null>(null);
  const [categoryRefId, setCategoryRefId] = useState<string | null>(null);

  const setCustomerTypeRef = useCallback((item: LookupItemDto | null) => {
    setCustomerTypeRefId(item?.id || null);
  }, []);

  const setCategoryRef = useCallback((item: LookupItemDto | null) => {
    setCategoryRefId(item?.id || null);
  }, []);

  const clearReferences = useCallback(() => {
    setCustomerTypeRefId(null);
    setCategoryRefId(null);
  }, []);

  const loadReferences = useCallback((customerTypeId?: string | null, categoryId?: string | null) => {
    setCustomerTypeRefId(customerTypeId || null);
    setCategoryRefId(categoryId || null);
  }, []);

  return {
    customerTypeRefId,
    categoryRefId,
    setCustomerTypeRef,
    setCategoryRef,
    clearReferences,
    loadReferences,
  };
};
