import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField, CircularProgress, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import getConfiguration from "confiuration";
import { LookupApi, LookupCategoryDto, LookupItemDto } from "api/generated";

type LookupSelectProps = {
    categoryKey: string;
    moduleKey?: string;
    value?: string | null; // ID değeri
    onChange: (id: string | null, item?: LookupItemDto | null) => void;
    label?: string;
    placeholder?: string;
    includeInactive?: boolean;
    allowCreate?: boolean; // show create in combobox
    manualFetch?: boolean; // true ise otomatik fetch yapmaz, açılınca yükler
    disabled?: boolean;
    className?: string;
    inlineLabel?: boolean; // true => label solda, select sağda (SelectInput uyumu)
    labelWidth?: number; // inlineLabel olduğunda px
};

type CreateState = {
    open: boolean;
    code: string;
    name: string;
    isSubmitting: boolean;
    error: string | null;
};

const LookupSelect: React.FC<LookupSelectProps> = ({
    categoryKey,
    moduleKey,
    value,
    onChange,
    label,
    placeholder,
    includeInactive = false,
    allowCreate = false,
    manualFetch = false,
    disabled = false,
    className,
    inlineLabel,
    labelWidth,
}) => {
    const api = useMemo(() => new LookupApi(getConfiguration()), []);

    const [items, setItems] = useState<LookupItemDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [create, setCreate] = useState<CreateState>({ open: false, code: "", name: "", isSubmitting: false, error: null });

    const selectedOption = useMemo(() => items.find(i => (i.id || null) === (value || null)) || null, [items, value]);

    const filteredItems = useMemo(() => {
        const base = includeInactive ? items : items.filter(i => i.isActive !== false);
        const q = inputValue.trim().toLowerCase();
        if (!q) return base;
        return base.filter(i => (i.code || "").toLowerCase().includes(q) || (i.name || "").toLowerCase().includes(q));
    }, [items, includeInactive, inputValue]);


    const fetchItems = async (): Promise<LookupItemDto[]> => {
        setLoading(true);
        try {
            const res: any = await api.apiLookupItemsKeyGet(categoryKey);
            const data = (res?.data || []) as LookupItemDto[];
            setItems(data);
            return data;
        } catch (error) {
            console.error("Error fetching items:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (manualFetch) {
            // kategori değişince önceki seçenekleri sıfırla, çağrı yapma
            setItems([]);
        } else {
            fetchItems();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryKey, manualFetch]);

    const shouldOfferCreate = useMemo(() => {
        if (!allowCreate) return false;
        const q = inputValue.trim();
        if (!q) return true; // metin yoksa da ekleme yapılabilsin
        const exists = items.some(i => (i.code || "").toLowerCase() === q.toLowerCase() || (i.name || "").toLowerCase() === q.toLowerCase());
        return !exists;
    }, [allowCreate, inputValue, items]);

    const ensureCategoryForCreate = async (): Promise<LookupCategoryDto | null> => {
        // Try to find category by key (optionally narrowed by moduleKey). If not found, search globally.
        const resScoped: any = await api.apiLookupCategoriesGet(moduleKey);
        const scoped = (resScoped?.data || []) as LookupCategoryDto[];
        let found = scoped.find(c => (c.key || "").toLowerCase() === categoryKey.toLowerCase()) || null;
        if (found) return found;
        const resAll: any = await api.apiLookupCategoriesGet();
        const all = (resAll?.data || []) as LookupCategoryDto[];
        return all.find(c => (c.key || "").toLowerCase() === categoryKey.toLowerCase()) || null;
    };

    const openCreateModal = () => {
        setCreate({ open: true, code: inputValue.trim(), name: inputValue.trim(), isSubmitting: false, error: null });
    };

    const closeCreateModal = () => {
        setCreate({ open: false, code: "", name: "", isSubmitting: false, error: null });
    };

    const submitCreate = async () => {
        if (!create.code.trim() || !create.name.trim()) {
            setCreate(s => ({ ...s, error: "Kod ve Ad zorunludur" }));
            return;
        }
        setCreate(s => ({ ...s, isSubmitting: true, error: null }));
        try {
            const cat = await ensureCategoryForCreate();
            if (!cat?.id) throw new Error("Kategori bulunamadı veya yetkiniz yok");
            if (cat.isReadOnly) throw new Error("Bu kategori salt okunur. Öğe eklenemez");
            await api.apiLookupItemsPost({
                categoryId: cat.id,
                code: create.code.trim(),
                name: create.name.trim(),
                isActive: true,
            });
            // Sunucudan güncel listeyi çek ve eklenen öğeyi seç
            const latest = await fetchItems();
            const created = (latest || []).find(i => (i.code || "") === create.code.trim()) || null;
            onChange(created?.id || null, created || null);
            closeCreateModal();
        } catch (err: any) {
            setCreate(s => ({ ...s, error: err?.message || "Öğe eklenemedi" }));
        } finally {
            setCreate(s => ({ ...s, isSubmitting: false }));
        }
    };

    const Control = (
        <Autocomplete
            options={filteredItems}
            getOptionLabel={(o) => o?.name || o?.code || ""}
            value={selectedOption}
            onChange={(_, opt) => {
                onChange(opt?.id || null, opt || null);
            }}
            onInputChange={(_, v) => setInputValue(v)}
            loading={loading}
            disabled={disabled}
            size="small"
            openOnFocus
            disablePortal
            onOpen={() => { 
                if (manualFetch && items.length === 0) { 
                    void fetchItems(); 
                }
            }}
            renderOption={(props, option) => {
                return (
                    <li {...props} style={{ display: "flex", alignItems: "center", padding: "6px 12px" }}>
                        <div>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>{option.name}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>{option.code}</div>
                        </div>
                    </li>
                );
            }}
            componentsProps={{
                paper: { sx: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", mt: 1 } } as any,
                popper: { sx: { zIndex: 1400 } } as any,
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={undefined}
                    placeholder={placeholder}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '0.375rem',
                            backgroundColor: '#ffffff',
                            height: '40px',
                            '& fieldset': { borderColor: '#e5e7eb' },
                            '&:hover fieldset': { borderColor: '#cbd5e1' },
                            '&.Mui-focused fieldset': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.1)' },
                        },
                        '& .MuiInputBase-input': {
                            padding: '8px 12px',
                        },
                    }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                                {allowCreate && shouldOfferCreate && (
                                    <IconButton size="small" onClick={openCreateModal} title="Yeni öğe ekle">
                                        <AddCircleOutlineIcon fontSize="small" />
                                    </IconButton>
                                )}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            isOptionEqualToValue={(a, b) => a?.id === b?.id}
            clearOnBlur={false}
            blurOnSelect={false}
            noOptionsText={loading ? "Yükleniyor…" : "Kayıt bulunamadı - Yeni ekleyin"}
        />
    );

    return (
        <div className={className}>
            <div>
                {label && <label className="block text-sm font-medium mb-1">{label}</label>}
                {Control}
            </div>

            {create.open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={closeCreateModal} />
                    <div className="relative bg-white rounded-lg shadow-lg w-[92vw] max-w-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">Yeni Öğe</div>
                            <button onClick={closeCreateModal} className="h-8 px-2 rounded-md border">Kapat</button>
                        </div>
                        {create.error && (
                            <div className="mb-2 p-2 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm">{create.error}</div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Kod</div>
                                <input value={create.code} onChange={(e) => setCreate(s => ({ ...s, code: e.target.value }))} className="w-full h-9 px-3 rounded-md border" placeholder="Kod" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-600 mb-1">Ad</div>
                                <input value={create.name} onChange={(e) => setCreate(s => ({ ...s, name: e.target.value }))} className="w-full h-9 px-3 rounded-md border" placeholder="Ad" />
                            </div>
                            <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
                                <button type="button" onClick={closeCreateModal} className="h-9 px-3 rounded-md border bg-white">İptal</button>
                                <button type="button" onClick={submitCreate} disabled={create.isSubmitting} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Kaydet</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LookupSelect;


