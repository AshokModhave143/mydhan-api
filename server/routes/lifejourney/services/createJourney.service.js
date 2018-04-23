//Import libs
const HttpStatus = require('http-status-codes');
const createLifeJourney = require('./../lifejourney.util');

//Functions
const createJourney = async (req, res)=> {
    let age = req.body.age;
    let income = req.body.income;

    if(age < 18) {
        res.status(HttpStatus.BAD_REQUEST).send({msg: "Person must be above 18"});
    }
    try {
        const lifej = await createLifeJourney({age: age, income: income});
        res.status(HttpStatus.OK).send({msg: lifej});
    } catch(e) {
        console.log(e);
        logger.info(e);
        res.status(HttpStatus.BAD_REQUEST).send({msg: e});
    }
};

//Exports
module.exports = createJourney;
