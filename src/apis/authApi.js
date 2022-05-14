import { makeApi } from "react-axios-api";

const pool = {
  login: { path:"/login", method: "post" },
  logout: { path:"/logout" },
  refreshSession: { path:"/refresh" },
  softwareInstall: {path:"/install", method: "post"},
  updateUserSettings: {path:"/settings", method: "put"},
  getUsers: {path:"/users"},
  createUser: {path:"/user/create", method: "post"},
  editUser: {path: "/user/:id", method: "put"},
  deleteUser: {path: "/user/:id", method: "delete"},
};

export const {
  login, 
  logout, 
  refreshSession, 
  softwareInstall, 
  updateUserSettings,
  getUsers,
  createUser,
  editUser,
  deleteUser,
 } = makeApi(pool, `${process.env.REACT_APP_API}/auth`);
