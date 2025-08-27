import React, { useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useSettingsBundle, useSettingsCategories, useSaveSettings } from "lib/settings/hooks";
import { SettingsScope } from "lib/settings/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ParameterField from "components/settings/ParameterField";

const ParametersPage = (): JSX.Element => {
    const [scope] = useState<SettingsScope>({ type: "tenant", id: localStorage.getItem("selectedTenantId") || undefined });
    const { data: cats } = useSettingsCategories();
    const firstId = cats?.[0]?.id || "general";
    const [categoryId, setCategoryId] = useState<string>(firstId);
    const { data: bundle, isLoading } = useSettingsBundle(categoryId, scope);
    const { mutateAsync: save } = useSaveSettings(categoryId, scope);

    const schema = useMemo(() => z.object({}), []);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: any) => {
        await save(values);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div className="px-6 lg:px-10 py-6 space-y-4">
                <div className="flex gap-6">
                    <aside className="w-64 shrink-0">
                        <div className="text-sm font-medium text-slate-700 mb-2">Kategoriler</div>
                        <div className="space-y-1">
                            {(cats || []).map((c) => (
                                <button key={c.id} onClick={() => setCategoryId(c.id)} className={`w-full text-left px-3 py-2 rounded-md border ${categoryId === c.id ? "bg-slate-900 text-white" : "bg-white"}`}>
                                    <div className="text-sm font-medium">{c.name}</div>
                                    {c.description && <div className="text-xs opacity-70">{c.description}</div>}
                                </button>
                            ))}
                        </div>
                    </aside>
                    <main className="flex-1 space-y-4">
                        <header className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-semibold">{bundle?.category.name || "Parametreler"}</div>
                                <div className="text-sm text-slate-500">{bundle?.category.description || "Kategori parametreleri"}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="h-9 px-3 rounded-md border bg-slate-900 text-white">Kaydet</button>
                            </div>
                        </header>
                        {isLoading && <div>Yükleniyor…</div>}
                        {!isLoading && (
                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {(bundle?.parameters || []).map((p) => (
                                    <ParameterField key={p.id} id={p.id} type={p.type as any} name={p.name} description={p.description} required={p.required} options={p.options} register={register} errors={errors} />
                                ))}
                            </form>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </DashboardLayout>
    );
};

export default ParametersPage;


