import { axios } from "./config/axios";

export const getCodeChangeCharacteristicsApi = (data) => axios.post('/profile/change-characteristics',data);
export const changecharaCteristicsApi = (data) => axios.put('/profile/change-characteristics',data);

export const postTicket_user = (data) => axios.postFile(`/profile/tickets`,data);
export const editTicket_user = (id,data) => axios.putFile(`/profile/tickets/${id}`,data);
export const deleteTicket_user = (id) => axios.delete(`/profile/tickets/${id}`);

export const postAnswerTicket_user = (id, data) => axios.postFile(`/profile/tickets/answer/${id}`,data);
export const deleteAnswerTicket_user = (ticketID,answerID) => axios.delete(`/profile/tickets/answer/${ticketID}/${answerID}`);
export const editAnswerTicket_user = (ticketID,answerID,data) => axios.putFile(`/profile/tickets/answer/${ticketID}/${answerID}`,data);

export const ticketSeen_user = (tiketID) => axios.post(`/profile/tickets/seen?tiketID=${tiketID}`);


export const forCertificate = (id, body) => axios.postFile(`/profile/my-purchases/${id}`, body);
