// API Base URL - automatically switches between localhost (dev) and Render (production)
// Falls back to Render URL if env variable is missing
export const API_URL = import.meta.env.VITE_API_URL || "https://stock-portfolio-m5cr.onrender.com";
