import { axios } from "./config/axios";

export const signApi = (data) => axios.post('/sign',data);

export const changePasswordApi = (data) => axios.put('/sign/change-password',data);
export const getCodeChangePasswordApi = (data) => axios.post('/sign/change-password',data);
