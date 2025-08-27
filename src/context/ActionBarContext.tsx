import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ActionItem = {
    id: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    visible?: boolean;
    icon?: React.ReactNode;
};

type ActionBarContextValue = {
    actions: ActionItem[];
    setActions: (items: ActionItem[]) => void;
    clearActions: () => void;
};

const ActionBarContext = createContext<ActionBarContextValue | undefined>(undefined);

export function ActionBarProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [actions, setActionsState] = useState<ActionItem[]>([]);

    const setActions = useCallback((items: ActionItem[]) => {
        setActionsState(Array.isArray(items) ? items : []);
    }, []);

    const clearActions = useCallback(() => setActionsState([]), []);

    const value = useMemo(() => ({ actions, setActions, clearActions }), [actions, setActions, clearActions]);

    return <ActionBarContext.Provider value={value}>{children}</ActionBarContext.Provider>;
}

export function useActionBar(): ActionBarContextValue {
    const ctx = useContext(ActionBarContext);
    if (!ctx) throw new Error("useActionBar must be used within ActionBarProvider");
    return ctx;
}

// Helper hook: register actions from a page; clears on unmount
export function useRegisterActions(actions: ActionItem[], deps: React.DependencyList = []): void {
    const { setActions, clearActions } = useActionBar();
    useEffect(() => {
        setActions(actions.filter((a) => a && (a.visible ?? true)));
        return () => clearActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}


