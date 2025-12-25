export const buildProductFilters = (options = {}) => {
  const {
    search,
    status,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 15,
  } = options;

  const params = { page, limit };

  if (search?.trim()) params.q = search.trim();
  if (status) params.status = status;
  if (categoryId) params.categoryId = categoryId;
  if (brandId) params.brandId = brandId;

  if (minPrice !== undefined && minPrice !== null && minPrice !== "")
    params.minPrice = Number(minPrice);

  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "")
    params.maxPrice = Number(maxPrice);

  if (sort) params.sort = sort;

  return params;
};


export const sortOptions = [
  { value: "", label: "Mặc định" },
  { value: "name_asc", label: "Tên A-Z" },
  { value: "name_desc", label: "Tên Z-A" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
];
