export const baseUrl = process.env.REACT_APP_API_BASE_URL || "https://localhost:7010/api/Products";
export const apiOrigin = new URL(baseUrl).origin;
