const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
const BASE_URL = `${API_URL}/address`;

const mapToOption = (item) => ({
  value: item.id,
  label: item.name,
});

// ===== PROVINCES =====
export const fetchProvinces = async () => {
  const res = await fetch(`${BASE_URL}/provinces`);
  const json = await res.json();
  return (json.data || []).map(mapToOption);
};

// ===== DISTRICTS =====
export const fetchDistricts = async (provinceId) => {
  if (!provinceId) return [];
  const res = await fetch(`${BASE_URL}/districts/${provinceId}`);
  const json = await res.json();
  return (json.data || []).map(mapToOption);
};

// ===== WARDS =====  
export const fetchWards = async (districtId) => {
  if (!districtId) return [];
  const res = await fetch(`${BASE_URL}/wards/${districtId}`);
  const json = await res.json();
  return (json.data || []).map(mapToOption);
};
