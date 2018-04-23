//Imports
const math = require('mathjs');
const LifeJourneyInfoSchema = require('./lifejourneyinfo.schema');
const LifeJourneyInfoModel = require('./lifejourneyinfo.model');
const {assumptions, FormulaeCalc} = require('./algo.util');

//Functions
const createLifeJourney = async ({age, income})=> {
    console.log(age + ' : ' + income);
    let lifeJobject = {
        age: '',
        income: '',
        age_band: '',
        scheme: '',
        annual_expense: '',
        annual_saving: '',
        retirement_time_horizon: '',
        annual_expense_at_retirement: '',
        retirment_req_corpus: '',
        est_education_cost: '',
        est_asset_purchase: '',
        goals: {
            retirement: {
                retirement_scheme: '',
                retirement_time_horizon: '',
                retirement_corpus_required: '',
                retirement_inv_req: {
                    weighted_returns: '',
                    annual_inv: '',
                    monthly_inv: ''
                },
                scheme_monthly_proportion: '',
                scheme_monthly_total: ''
            },
            child: [
                /*{
                    child_age: '',
                    child_scheme: '',
                    child_time_horizon: '',
                    child_corpus_required: '',
                    child_inv_req: {
                        weighted_returns: '',
                        annual_inv: '',
                        monthly_inv: ''
                    },
                    scheme_monthly_proportion: '',
                    scheme_monthly_total: ''
                }*/
            ],
            asset: {
                asset_scheme: '',
                asset_time_horizon: '',
                asset_corpus_required: '',
                asset_inv_req: {
                    weighted_returns: '',
                    annual_inv: '',
                    monthly_inv: ''
                },
                scheme_monthly_proportion: '',
                scheme_monthly_total: ''
            }
        },
        total_monthly_inv_amount: '',
        total_yearly_inv_amount: '',
    };
    
    //assignments
    lifeJobject.age = age;
    lifeJobject.income = income;
    lifeJobject.age_band = await getAgeBand(lifeJobject.age);
    lifeJobject.annual_expense = await FormulaeCalc.getAnnualExpense(assumptions.annual_expense_per , lifeJobject.income);
    lifeJobject.annual_saving = await FormulaeCalc.getAnnualSaving(lifeJobject.income, assumptions.annual_saving_per);
    lifeJobject.retirement_time_horizon = await FormulaeCalc.getAgeTimeHorizon(assumptions.retirement_age, lifeJobject.age);
    lifeJobject.annual_expense_at_retirement = await FormulaeCalc.getAnnualExpenseAtRetirement(assumptions.estimated_inflation_per, lifeJobject.retirement_time_horizon, lifeJobject.annual_expense);

    //retirement
    lifeJobject.retirment_req_corpus = await FormulaeCalc.getRetirementReqCorpus(lifeJobject.annual_expense_at_retirement, assumptions.post_tax_yield_at_retirement_per);
    lifeJobject.goals.retirement.retirement_time_horizon = lifeJobject.retirement_time_horizon;
    lifeJobject.goals.retirement.retirement_corpus_required = lifeJobject.retirment_req_corpus;

    lifeJobject.goals.retirement.retirement_scheme = await FormulaeCalc.getScheme(lifeJobject.age_band, lifeJobject.goals.retirement.retirement_time_horizon); 
    lifeJobject.goals.retirement.retirement_inv_req = await FormulaeCalc.getRequiredInvestment(lifeJobject.goals.retirement.retirement_scheme, 
                                                                                                assumptions.returns_estimate_per, 
                                                                                                lifeJobject.goals.retirement.retirement_time_horizon,
                                                                                                lifeJobject.goals.retirement.retirement_corpus_required);
    lifeJobject.goals.retirement.scheme_monthly_proportion = await FormulaeCalc.getMonthySchemeInvestProportion(lifeJobject.goals.retirement.retirement_scheme, lifeJobject.goals.retirement.retirement_inv_req.monthly_inv);
    lifeJobject.goals.retirement.scheme_monthly_total = await FormulaeCalc.getSchemeMonthlyTotal(lifeJobject.goals.retirement.scheme_monthly_proportion);

    //child
    for(let i = 0; i < assumptions.childs.length; i++) {
        let child_age = await FormulaeCalc.getAgeTimeHorizon(lifeJobject.age, assumptions.childs[i].child_at_age);
        if(child_age > 0) {        
            let child_time_horizon = await FormulaeCalc.getAgeTimeHorizon(assumptions.child_edu_age, child_age);
            let child_corpus_required = await FormulaeCalc.getEducationReqCorpus(assumptions.avg_cost_of_education, assumptions.estimated_inflation_per, child_time_horizon);
            let child_scheme = await FormulaeCalc.getScheme(lifeJobject.age_band, child_time_horizon);
            let child_inv_req = await FormulaeCalc.getRequiredInvestment(child_scheme, assumptions.returns_estimate_per, child_time_horizon, child_corpus_required);
            let scheme_monthly_proportion = await FormulaeCalc.getMonthySchemeInvestProportion(child_scheme, child_inv_req.monthly_inv);
            let scheme_monthly_total = await FormulaeCalc.getSchemeMonthlyTotal(scheme_monthly_proportion);
            let obj = {
                child_age,
                child_time_horizon,
                child_scheme,
                child_corpus_required,
                child_inv_req,
                scheme_monthly_proportion,
                scheme_monthly_total
            };        
            lifeJobject.goals.child.push(obj);
        }
    }

    //asset
    lifeJobject.goals.asset.asset_time_horizon = assumptions.asset_time_horizon;
    lifeJobject.goals.asset.asset_scheme = await FormulaeCalc.getScheme(lifeJobject.age_band, lifeJobject.goals.asset.asset_time_horizon);
    lifeJobject.goals.asset.asset_corpus_required = await FormulaeCalc.getAssetPurchaseReqCorpus(assumptions.avg_cost_of_asset_purchase, assumptions.estimated_inflation_per, lifeJobject.goals.asset.asset_time_horizon);
    lifeJobject.goals.asset.asset_inv_req = await FormulaeCalc.getRequiredInvestment(lifeJobject.goals.asset.asset_scheme, assumptions.returns_estimate_per, lifeJobject.goals.asset.asset_time_horizon, lifeJobject.goals.asset.asset_corpus_required);
    lifeJobject.goals.asset.scheme_monthly_proportion = await FormulaeCalc.getMonthySchemeInvestProportion(lifeJobject.goals.asset.asset_scheme, lifeJobject.goals.asset.asset_inv_req.monthly_inv);
    lifeJobject.goals.asset.scheme_monthly_total = await FormulaeCalc.getSchemeMonthlyTotal(lifeJobject.goals.asset.scheme_monthly_proportion);

    //total
    lifeJobject.total_monthly_inv_amount = await FormulaeCalc.getTotalMonthlySchemeInvestment(lifeJobject.goals.retirement, lifeJobject.goals.child, lifeJobject.goals.asset);
    lifeJobject.total_yearly_inv_amount = await FormulaeCalc.getTotalYearlyInvestmentRequired(lifeJobject.goals.retirement, lifeJobject.goals.child, lifeJobject.goals.asset);

    return lifeJobject;
};

const calculateLifeJourney = async (age, income)=> {
    let assumption_values = await getAssumptionValues();
    let age_band = getAgeBand(age);

    console.log(age_band);
    return;
}
const getAgeBand = async (age)=> {
    let age_band = (age >= 18 && age <=25) ? 'band_1' : 
                   (age >= 26 && age <= 35) ? 'band_2' :
                   (age >= 36 && age <= 45) ? 'band_3' :
                   (age >= 46 && age <= 55) ? 'band_4' :
                   (age >= 56 && age <= 65) ? 'band_5' : 'band_6' ;
    return await age_band;
}
const getAssumptionValues = async ()=> {
    return assumptions;
};

/*
const getLifeJourneyInfo = async (age)=> {
    let params = {
        "age_band.lower_age" : { $gt: age},
        "age_band.upper_age" : { $lt: age}
    };
    return await LifeJourneyInfoSchema.findOne(params);
};
const insertLifeJourneyInfo = async ()=> {
    let data = {
        age_band: {
            lower_age: "18",
            upper_age: "25"
        },
        inv_time_horizon: "<3",
        scheme: {
            liquid: 100,
            short_term: 0,
            income: 0,
            balance: 0,
            equity_mod: 0,
            equity_aggr: 0
        }
    };
    let ljmod = new LifeJourneyInfoModel(data);
    let ljSchema = new LifeJourneyInfoSchema(ljmod);
    return await ljSchema.save();
};
*/
//Exports
module.exports = createLifeJourney;