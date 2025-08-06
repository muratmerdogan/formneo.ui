import { Color } from "@mui/material";

import React, { createContext, useCallback, useContext, useState } from "react";
import ReactLoading from "react-loading";

export type BusySeverity = Color;

export interface BusyDispatchArgs {
  //   severity: BusySeverity,
  isBusy: boolean;
}

export type BusyContextInterface = (args: BusyDispatchArgs) => void;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyState: BusyContextInterface = (args) => {
  return;
};

export const BusyContext = createContext<BusyContextInterface>(emptyState);

export const useBusy: () => BusyContextInterface = () => useContext(BusyContext);

interface BusyProviderProps {
  children: React.ReactNode;
}

export function BusyProvider({ children }: BusyProviderProps): JSX.Element {
  const [isBusy, setisBusy] = useState(false);

  const dispatchBusy = useCallback(({ isBusy }: BusyDispatchArgs) => {
    setisBusy(isBusy);
  }, []);

  return (
    <BusyContext.Provider value={dispatchBusy}>
      {isBusy && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <ReactLoading type="spin" color="#1976d2" height={"50px"} width={"50px"} />
        </div>
      )}
      {children}
    </BusyContext.Provider>
  );
}
