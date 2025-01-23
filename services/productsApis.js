import { Fetch, axios } from './config/axios';

export const getComments = (id, option) => Fetch.get(`/products/comments?productID=${id}`, option);
export const createComment = (productID, data, token, userId) =>
    Fetch.post(`/products/comments?productID=${productID}`, data, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });
export const editComment = (id, data, token, userId) =>
    Fetch.put(`/products/comments/${id}`, data, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });
export const deleteComment = (id, token, userId) =>
    Fetch.delete(`/products/comments/${id}`, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });

export const showComment = (commentID, token, userId) =>
    Fetch.put(`/products/comments/show?commentID=${commentID}`, null, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });

export const sendAnswer = (id, data, token, userId) =>
    Fetch.post(`/products/comments/answer/${id}`, data, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });

export const editAnswer = (id, data, token, userId) =>
    Fetch.put(`/products/comments/answer/${id}`, data, {
        headers: {
            Cookie: `token=${token};userId=${userId}`,
        }
    });

    export const deleteAnswer = (id, token, userId) =>
        Fetch.delete(`/products/comments/answer/${id}`, {
            headers: {
                Cookie: `token=${token};userId=${userId}`,
            }
        });

    ///////////////////

    export const postQuestion = (productID, body) => axios.postFile(`/products/questions?productID=${productID}`, body);
    export const postAnswerQuestion = (questionID, body) => axios.postFile(`/products/questions/answer/${questionID}`, body);
    export const editAnswerQuestion = (answerID, body) => axios.putFile(`/products/questions/answer/${answerID}`, body);
    export const deleteAnswerQuestion = (answerID) => axios.delete(`/products/questions/answer/${answerID}`);
    export const seenQuestion = (questionID) => axios.put(`/products/questions/seen?questionID=${questionID}`);

    export const editQuestion = (answerID, body) => axios.putFile(`/products/questions/${answerID}`, body);
    export const deleteQuestion = (answerID) => axios.delete(`/products/questions/${answerID}`);
