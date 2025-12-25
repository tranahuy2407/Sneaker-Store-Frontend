export const formatDate = (date) => {
  if (!date) return "-";

  let normalized = date;
  normalized = normalized.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");

  const d = new Date(normalized);

  return isNaN(d.getTime()) ? "-" : d.toLocaleString("vi-VN");
};
