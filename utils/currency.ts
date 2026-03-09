export const formatCurrency = (value: number): string => (
    new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "DOP",
    }).format(value)
);