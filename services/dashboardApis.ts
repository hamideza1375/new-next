import { axios } from './config/axios';

// export const createCategory = (data) => axios.post('/dashboard/categories',data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const createCategory = (data: any) => axios.postFile('/dashboard/categories', data);
export const editCategory = (id: string, data: any) => axios.putFile(`/dashboard/categories/${id}`, data);
export const deleteCategory = (id: string) => axios.delete(`/dashboard/categories/${id}`);

export const createProduct = (id: string,data: any) => axios.postFile(`/dashboard/products?categoryId=${id}`, data);
export const editProduct = (id: string, data: any) => axios.putFile(`/dashboard/products/${id}`, data);
export const deleteProduct = (id: string) => axios.delete(`/dashboard/products/${id}`);

export const setOffer = (id: string, data: any) => axios.put(`/dashboard/products/offer?productID=${id}`, data)
export const setProgress = (id: string, data: any) => axios.put(`/dashboard/products/progress?productID=${id}`, data)
export const setPopular = (id: string) => axios.put(`/dashboard/products/popular?productID=${id}`)
export const setVersion = (id: string, data: any) => axios.put(`/dashboard/products/version?productID=${id}`,data)
export const setTimes = (id: string, data: any) => axios.put(`/dashboard/products/times?productID=${id}`,data)

export const createPart = (id: string,data: any) => axios.postFile(`/dashboard/parts/${id}`, data);
export const editPart = (productID: string, partID: string, data: any) => axios.putFile(`/dashboard/parts/${productID}/${partID}`, data);
export const deletePart = (productID: string, partID: string) => axios.delete(`/dashboard/parts/${productID}/${partID}`);

export const sendNotification = (data: any) => axios.post(`/dashboard/notification`,data);
export const deletNotification = () => axios.delete(`/dashboard/notification`);

export const addAdmin = (data: any) => axios.post(`/dashboard/admin`,data);
export const deleteAdmin = (data: any) => axios.put(`/dashboard/admin`,data);

export const addSeller = (data: any) => axios.post(`/dashboard/seller`, data);
export const deleteSeller = (data: any) => axios.put(`/dashboard/seller`, data);

export const postAnswerTicket = (id: string, data: any) => axios.postFile(`/dashboard/tickets/answer/${id}`,data);
export const deleteAnswerTicket = (ticketID: string,answerID: string) => axios.delete(`/dashboard/tickets/answer/${ticketID}/${answerID}`);
export const editAnswerTicket = (ticketID: string,answerID: string,data: any) => axios.putFile(`/dashboard/tickets/answer/${ticketID}/${answerID}`,data);

export const ticketSeen = (tiketID: string) => axios.post(`/dashboard/tickets/seen?tiketID=${tiketID}`);

export const setCertificate = (id:string, title:string, data: any) => axios.postFile(`/dashboard/certificate/${id}?title=${title}`, data);
