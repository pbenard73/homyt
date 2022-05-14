import { makeApi } from "react-axios-api";

const pool = {
  getMetadata: { path:"/" },
  saveMetadata: { path:"/", method: 'put' }
};

export const { getMetadata, saveMetadata } = makeApi(pool, `${process.env.REACT_APP_API}/metadata`);
