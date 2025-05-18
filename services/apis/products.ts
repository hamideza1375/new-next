import { Fetch, axios } from '../config/axios';

export const getComments = (id: string, option: any) => Fetch.get(`/products/comments?productID=${id}`, option);

export const createComment = (productID: string, data: any, token: string, userId: string) =>
    Fetch.post(`/products/comments?productID=${productID}`, data, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });
export const editComment = (id: string, data: any, token: string, userId: string) =>
    Fetch.put(`/products/comments/${id}`, data, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });
export const deleteComment = (id: string, token: string, userId: string) =>
    Fetch.delete(`/products/comments/${id}`, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });

export const showComment = (commentID: string, token: string, userId: string) =>
    Fetch.put(`/products/comments/show?commentID=${commentID}`, null, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });

export const sendAnswer = (id: string, data: any, token: string, userId: string) =>
    Fetch.post(`/products/comments/answer/${id}`, data, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });

export const editAnswer = (id: string, data: any, token: string, userId: string) =>
    Fetch.put(`/products/comments/answer/${id}`, data, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });

    export const deleteAnswer = (id: string, token: string, userId: string) =>
        Fetch.delete(`/products/comments/answer/${id}`, {
            headers: {
                Cookie: `token=${token};userId=${userId}`,
            }
        });

    ///////////////////

    export const postQuestion = (productID: string, body: any) => axios.postFile(`/products/questions?productID=${productID}`, body);
    export const postAnswerQuestion = (questionID: string, body: any) => axios.postFile(`/products/questions/answer/${questionID}`, body);
    export const editAnswerQuestion = (answerID: string, body: any) => axios.putFile(`/products/questions/answer/${answerID}`, body);
    export const deleteAnswerQuestion = (answerID: string) => axios.delete(`/products/questions/answer/${answerID}`);
    export const seenQuestion = (questionID: string) => axios.put(`/products/questions/seen?questionID=${questionID}`);

    export const editQuestion = (answerID: string, body: any) => axios.putFile(`/products/questions/${answerID}`, body);
    export const deleteQuestion = (answerID: string) => axios.delete(`/products/questions/${answerID}`);
