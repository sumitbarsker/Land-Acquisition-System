const developmentApiUrl = "http://127.0.0.1:8000";
const productionApiUrl = "https://landguard-ner-umlv.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? developmentApiUrl : productionApiUrl);