import { makeApi } from "react-axios-api";

const pool = {
  search: { path: "/search/:query", method: "post" },
  download: { path: "/download", method: "post" },
  getConfig: { path: "/config" },
};

export const { getConfig, download, search } = makeApi(pool, process.env.REACT_APP_API);
