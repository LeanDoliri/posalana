// Formato de fechas para mostrar en toda la web: siempre día, mes y año (DD/MM/YYYY).
// En la base y en las URLs las fechas siguen guardándose como YYYY-MM-DD.
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return String(dateStr);
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
}
