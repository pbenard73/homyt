import { makeApi } from "react-axios-api";

const pool = {
  getCloudRadiosList: {
     path:"https://raw.githubusercontent.com/pbenard73/radiopool/master/radio.json" ,
     options: {
       withCredentials:false,
       crossdomain: true
     }
  },
};

export const {
  getCloudRadiosList, 
 } = makeApi(pool);
