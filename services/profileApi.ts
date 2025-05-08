import { axios } from "./config/axios";

export const getCodeChangeCharacteristicsApi = (data: any) => axios.post('/profile/change-characteristics',data);
export const changecharaCteristicsApi = (data: any) => axios.put('/profile/change-characteristics',data);

export const postTicket_user = (data: any) => axios.postFile(`/profile/tickets`,data);
export const editTicket_user = (id: string,data: any) => axios.putFile(`/profile/tickets/${id}`,data);
export const deleteTicket_user = (id: string) => axios.delete(`/profile/tickets/${id}`);

export const postAnswerTicket_user = (id: string, data: any) => axios.postFile(`/profile/tickets/answer/${id}`,data);
export const deleteAnswerTicket_user = (ticketID: string,answerID: string) => axios.delete(`/profile/tickets/answer/${ticketID}/${answerID}`);
export const editAnswerTicket_user = (ticketID: string,answerID: string,data: any) => axios.putFile(`/profile/tickets/answer/${ticketID}/${answerID}`,data);

export const ticketSeen_user = (tiketID: string) => axios.post(`/profile/tickets/seen?tiketID=${tiketID}`);


export const forCertificate = (id: string, body: any) => axios.postFile(`/profile/my-purchases/${id}`, body);
