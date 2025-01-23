const truncate = (text = '', length, more) => {
    if (!text && !text.length) return text;
    if (text.length <= length) return text;
    return text.substring(0, length) + (more ? more : ' ...');
};

export default truncate;
