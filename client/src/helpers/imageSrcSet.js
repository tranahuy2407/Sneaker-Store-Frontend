export function getImageUrl(img) {
  return img.startsWith("http") ? img.replace("/upload/", "/upload/f_auto,q_auto/") : img;
}


export function getSrcSet(img) {
  if (!img.startsWith("http")) return undefined; 

  const base = img.replace("/upload/", "/upload/f_auto,q_auto/");
  return `
    ${base.replace("/upload/", "/upload/w_200/")} 200w,
    ${base.replace("/upload/", "/upload/w_400/")} 400w,
    ${base.replace("/upload/", "/upload/w_800/")} 800w
  `;
}
