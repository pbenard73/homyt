import { makeApi } from "react-axios-api";

const pool = {
  login: { path:"/login", method: "post" },
  logout: { path:"/logout" },
  refreshSession: { path:"/refresh" },
  softwareInstall: {path:"/install", method: "post"},
};

export const { login, logout, refreshSession, softwareInstall } = makeApi(pool, `${process.env.REACT_APP_API}/auth`);
