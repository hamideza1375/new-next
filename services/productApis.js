import { axios } from './config/axios';

// export const createCategory = (data) => axios.post('/dashboard/categories',data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const createCategory = data => axios.postFile('/dashboard/categories', data);
export const editCategory = (id, data) => axios.putFile(`/dashboard/categories/${id}`, data);
export const deleteCategory = (id) => axios.delete(`/dashboard/categories/${id}`);

export const createProduct = (id,data) => axios.postFile(`/dashboard/products?categoryId=${id}`, data);
export const editProduct = (id, data) => axios.putFile(`/dashboard/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`/dashboard/products/${id}`);

export const setOffer = (id, body) => axios.put(`/dashboard/products/offer?productID=${id}`, body)
export const setProgress = (id, body) => axios.put(`/dashboard/products/progress?productID=${id}`, body)
export const setPopular = (id) => axios.put(`/dashboard/products/popular?productID=${id}`)
export const setVersion = (id, body) => axios.put(`/dashboard/products/version?productID=${id}`,body)
export const setTimes = (id, body) => axios.put(`/dashboard/products/times?productID=${id}`,body)

export const createPart = (id,data) => axios.postFile(`/dashboard/parts/${id}`, data);
export const editPart = (productID, partID, data) => axios.putFile(`/dashboard/parts/${productID}/${partID}`, data);
export const deletePart = (productID, partID) => axios.delete(`/dashboard/parts/${productID}/${partID}`);

export const sendNotification = (data) => axios.post(`/dashboard/notification`,data);
export const deletNotification = () => axios.delete(`/dashboard/notification`);

export const addAdmin = (data) => axios.post(`/dashboard/admin`,data);
export const deleteAdmin = (data) => axios.put(`/dashboard/admin`,data);

export const addSeller = (data) => axios.post(`/dashboard/seller`, data);
export const deleteSeller = (data) => axios.put(`/dashboard/seller`, data);

export const postAnswerTicket = (id, data) => axios.postFile(`/dashboard/tickets/answer/${id}`,data);
export const deleteAnswerTicket = (ticketID,answerID) => axios.delete(`/dashboard/tickets/answer/${ticketID}/${answerID}`);
export const editAnswerTicket = (ticketID,answerID,data) => axios.putFile(`/dashboard/tickets/answer/${ticketID}/${answerID}`,data);

export const ticketSeen = (tiketID) => axios.post(`/dashboard/tickets/seen?tiketID=${tiketID}`);

export const setCertificate = (id, title, body) => axios.postFile(`/dashboard/certificate/${id}?title=${title}`, body);
