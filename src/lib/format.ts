export const currency = (v: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(v);

export const dateShort = (iso?: string) =>
    iso ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(iso)) : "-";
