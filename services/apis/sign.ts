import { axios } from "../config/axios";

export const signApi = (data: any) => axios.post('/sign',data);

export const changePasswordApi = (data: any) => axios.put('/sign/change-password',data);
export const getCodeChangePasswordApi = (data: any) => axios.post('/sign/change-password',data);
