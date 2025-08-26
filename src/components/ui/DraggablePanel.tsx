import React, { useEffect, useMemo, useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

type DraggablePanelProps = {
    id: string;
    title: React.ReactNode;
    children: React.ReactNode;
    headerColorClass?: string; // sadece başlık rengi
    headerColor?: string; // hex/rgb/var(...) renk
    defaultMinimized?: boolean;
    defaultFullscreen?: boolean;
    onMinimizedChange?: (minimized: boolean) => void;
    onFullscreenChange?: (fullscreen: boolean) => void;
    onHeaderColorChange?: (color: string) => void;
    showColorPicker?: boolean;
    fullscreenTopOffsetPx?: number; // ShellBar/AppBar yüksekliği kadar offset
    // Kalıcı durum (persist) ayarları
    persist?: boolean;
    persistKey?: string; // varsayılan: id
    storage?: "local" | "session" | "cookie"; // varsayılan: local
    className?: string;
};

export default function DraggablePanel(props: DraggablePanelProps): JSX.Element {
    const {
        id,
        title,
        children,
        headerColorClass,
        headerColor,
        defaultMinimized,
        defaultFullscreen,
        onMinimizedChange,
        onFullscreenChange,
        onHeaderColorChange,
        showColorPicker,
        className,
        fullscreenTopOffsetPx = 64,
        persist = false,
        persistKey,
        storage = "local",
    } = props;

    const [minimized, setMinimized] = useState<boolean>(Boolean(defaultMinimized));
    const [fullscreen, setFullscreen] = useState<boolean>(Boolean(defaultFullscreen));

    const { setNodeRef: setDragRef, listeners, attributes, transform, isDragging } = useDraggable({ id, disabled: fullscreen });
    const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `drop-${id}` });

    const containerStyle: React.CSSProperties = useMemo(() => {
        if (!fullscreen) {
            return {
                transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                opacity: isDragging ? 0.95 : 1,
                boxShadow: isOver ? "0 0 0 2px rgba(59,130,246,0.5)" : undefined,
            } as React.CSSProperties;
        }
        return {
            position: "fixed",
            top: fullscreenTopOffsetPx,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
        } as React.CSSProperties;
    }, [transform, isDragging, isOver, fullscreen, fullscreenTopOffsetPx]);

    const [color, setColor] = useState<string | undefined>(headerColor);

    const headerClasses = `select-none px-4 py-2 border-b ${color ? "" : (headerColorClass || "bg-slate-50")} text-slate-700 font-medium rounded-t-2xl flex items-center justify-between`;
    const headerStyle: React.CSSProperties = color ? { background: color } : undefined;

    // Persist helpers
    type PanelState = { minimized: boolean; fullscreen: boolean; headerColor?: string };
    const key = `draggablePanel:${persistKey || id}`;

    const readState = (): PanelState | null => {
        try {
            if (!persist) return null;
            if (storage === "local") {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            }
            if (storage === "session") {
                const raw = sessionStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            }
            if (storage === "cookie") {
                const match = document.cookie.split("; ").find((c) => c.startsWith(`${key}=`));
                const val = match ? decodeURIComponent(match.split("=")[1]) : null;
                return val ? JSON.parse(val) : null;
            }
        } catch { }
        return null;
    };

    const writeState = (state: PanelState) => {
        try {
            if (!persist) return;
            const raw = JSON.stringify(state);
            if (storage === "local") {
                localStorage.setItem(key, raw);
                return;
            }
            if (storage === "session") {
                sessionStorage.setItem(key, raw);
                return;
            }
            if (storage === "cookie") {
                const maxAge = 60 * 60 * 24 * 365; // 1 yıl
                document.cookie = `${key}=${encodeURIComponent(raw)}; path=/; max-age=${maxAge}`;
            }
        } catch { }
    };

    // İlk yüklemede kalıcı durumu uygula
    useEffect(() => {
        const saved = readState();
        if (saved) {
            setMinimized(Boolean(saved.minimized));
            setFullscreen(Boolean(saved.fullscreen));
            if (saved.headerColor) setColor(saved.headerColor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Değişikliklerde kaydet
    useEffect(() => {
        if (!persist) return;
        writeState({ minimized, fullscreen, headerColor: color });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minimized, fullscreen, color]);

    const toggleMinimize = () => {
        setMinimized((m) => {
            const next = !m;
            onMinimizedChange?.(next);
            return next;
        });
    };

    const toggleFullscreen = () => {
        setFullscreen((f) => {
            const next = !f;
            onFullscreenChange?.(next);
            return next;
        });
    };

    const onClickMin = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); toggleMinimize(); };
    const onClickFull = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); toggleFullscreen(); };

    const containerClasses = `rounded-2xl border bg-white shadow-sm ${minimized && !fullscreen ? "self-start" : ""} ${className || ""}`;

    return (
        <section ref={setDropRef} style={containerStyle} className={containerClasses}>
            <header className={headerClasses} style={headerStyle}>
                <div ref={setDragRef} {...attributes} {...listeners} className="cursor-move -ml-1 mr-2 p-1 text-slate-500 hover:text-slate-700" title="Taşı">
                    <DragIndicatorIcon fontSize="small" />
                </div>
                <div className="truncate pr-2 flex-1">{title}</div>
                <div className="flex items-center gap-1">
                    {showColorPicker && (
                        <input
                            type="color"
                            value={color || "#eef2ff"}
                            onChange={(e) => { const c = e.target.value; setColor(c); onHeaderColorChange?.(c); }}
                            className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
                            aria-label="Başlık rengi"
                        />
                    )}
                    <IconButton size="small" onClick={onClickMin} aria-label={minimized ? "Genişlet" : "Daralt"}>
                        {minimized ? <AddIcon fontSize="small" /> : <RemoveIcon fontSize="small" />}
                    </IconButton>
                    <IconButton size="small" onClick={onClickFull} aria-label={fullscreen ? "Tam ekranı kapat" : "Tam ekran"}>
                        {fullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                    </IconButton>
                </div>
            </header>
            {!minimized && (
                <div className={fullscreen ? "p-4" : "p-4"} style={fullscreen ? { flex: 1, overflow: "auto" } : undefined}>
                    {children}
                </div>
            )}
        </section>
    );
}


