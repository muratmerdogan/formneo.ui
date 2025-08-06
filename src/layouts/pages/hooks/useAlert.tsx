import { Color } from '@mui/material';
import { MessageBox, MessageBoxPropTypes, MessageBoxType } from '@ui5/webcomponents-react';
import React, { createContext, useCallback, useContext, useState } from 'react'



export type AlertSeverity = Color;

export interface AlertDispatchArgs {
	//   severity: AlertSeverity,
	message: string,
	type: MessageBoxType;
}

export type AlertContextInterface = (args: AlertDispatchArgs) => void;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyState: AlertContextInterface = (args) => { return }

export const AlertContext = createContext<AlertContextInterface>(emptyState)

export const useAlert: () => AlertContextInterface = () => useContext(AlertContext)

interface AlertProviderProps {
	children: React.ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps): JSX.Element {
	const [hasAlert, setHasAlert] = useState(false)
	const [severity, setSeverity] = useState<AlertSeverity | undefined>()
	const [message, setMessage] = useState('')
	const [type, setTtype] = useState<MessageBoxType>()
	const handleCloseAlert = useCallback(() => setHasAlert(false), [])

	const dispatchAlert = useCallback(({ message, type }: AlertDispatchArgs) => {


		setSeverity(severity)
		setMessage(message)
		setTtype(type);
		setHasAlert(true)
	}, [])

	return (
		<AlertContext.Provider
			value={dispatchAlert}
		>
			<MessageBox type={type} onClose={handleCloseAlert} open={hasAlert}>
				{message} 
				</MessageBox>
			{children}
		</AlertContext.Provider>
	)
}