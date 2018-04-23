const GenerateResponse = (status, msg, data)=> {
    data = data || {};
    const res = {
        status: status,
        msg: msg,
        data: data
    };
    return res;
}

module.exports = {GenerateResponse};