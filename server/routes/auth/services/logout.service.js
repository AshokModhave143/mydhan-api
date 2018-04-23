const HttpStatus = require('http-status-codes');
const {GenerateResponse} = require('./../../../utils/response.util');

const logout = (req, res) => {
    //check session Id
    //Remove it from Session table
    //Response the code
    req.logout();
    req.session.destroy((err)=> {
        if(err) {
            res.status(HttpStatus.BAD_REQUEST).send(GenerateResponse(HttpStatus.BAD_REQUEST, err));
        }
        else {
            res.status(HttpStatus.OK).send(GenerateResponse(HttpStatus.OK, 'Logout successful'));
        }
    });
};

module.exports = logout;