// //--app/api//

import axios from "axios";

const BASE_URL = 'https://notehub-api.goit.study';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

