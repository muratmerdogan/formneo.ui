import React from "react";
import DraggablePanel from "components/ui/DraggablePanel";

type Props = {
    id: string;
    title: string;
    children: React.ReactNode;
    headerColorClass?: string;
    defaultMinimized?: boolean;
    defaultFullscreen?: boolean;
};

export default function DraggableSection({ id, title, children, headerColorClass, defaultMinimized, defaultFullscreen }: Props): JSX.Element {
    return (
        <DraggablePanel
            id={id}
            title={title}
            headerColorClass={headerColorClass}
            defaultMinimized={defaultMinimized}
            defaultFullscreen={defaultFullscreen}
            showColorPicker
            persist
            persistKey={`customer-section:${id}`}
            storage="local"
        >
            {children}
        </DraggablePanel>
    );
}


