//Import libs
const ExcelFormulaeUtil = require('./excelFormulae.util');

//constants
const assumptions = {
    retirement_age: 60,
    child_edu_age: 18,
    childs: [
        {child_at_age: 27},
        {child_at_age: 30}
    ],
    annual_expense_per: 70,
    annual_saving_per: 30,
    estimated_inflation_per: 5,
    post_tax_yield_at_retirement_per: 5,

    avg_cost_of_education: 750000,
    avg_cost_of_asset_purchase: 180000,

    returns_estimate_per: {
        equity_aggr: 15.00,
        equity_mod: 12.00,
        balance: 10.00,
        income: 8.00,
        short_term: 7.00,
        liquid: 6.00
    },
    asset_time_horizon: 5,
};

//Logic
const FormulaeCalc = {    
    getAgeTimeHorizon: async (retirement_age, age)=> {
        console.log('Horizon : ' + retirement_age + ', ' + age);
        return await Math.abs(retirement_age - age);
    },    
    getAnnualExpense: async (annual_expense_per, income)=> {
        /**
         * Annual_Expense = income * (assumed_annual_expense_per/100);
         */
        return await Math.round(income * (annual_expense_per / 100));
    },
    getAnnualSaving: async (income, annual_saving_per)=> {
        /**
         * Annual_saving = income * (annual_saving_per / 100);
         */
        return await Math.round(income * (annual_saving_per / 100));
    },
    getAnnualExpenseAtRetirement: async (estimated_inflation_per, retirement_time_horizon, annual_expense)=> {
        /**
         * AnnualExpenseAtRetirement = (1 + estimatedinflation_per/100)^retirement_time_horizon * annual_expense;
         */
        return await Math.round(Math.pow((1+ estimated_inflation_per /100), retirement_time_horizon) * annual_expense);
    },
    getRetirementReqCorpus: async (annual_expense_at_retirement, post_tax_yield_at_retirement_per)=> {
        /**
         * RetirementReqCorpus = annual_expense_at_retirement / (post_tax_yield_at_retirement_per / 100);
         */
        return await Math.round(annual_expense_at_retirement / (post_tax_yield_at_retirement_per / 100));
    },
    getEducationReqCorpus: async (avg_cost_of_education, estimated_inflation_per, child_edu_time_horizon)=> {
        /**
         * EstimatedTargetCostOfEducationWithRespectToInflation = avg_cost_of_education * (1 + (estimated_inflation_per / 100))^child_edu_time_horizon
         */
        return await Math.round(avg_cost_of_education * Math.pow((1 + estimated_inflation_per / 100), child_edu_time_horizon));
    },
    getAssetPurchaseReqCorpus: async (avg_cost_of_asset_purchase, estimated_inflation_per, asset_pur_time_horizon)=> {
        /**
         * EstimatedCostOfAssetPurchase = avg_cost_of_asset_purchase * (1 + estimated_inflation_per / 100)^asset_pur_time_horizon;
         */
        return await Math.round(avg_cost_of_asset_purchase * Math.pow((1 + estimated_inflation_per / 100), asset_pur_time_horizon));
    },
    getScheme: async (age_band, inv_time_horizon)=> {
        //Find the scheme from the DB using age_band and inv_time_horizon
        let default_scheme = {
            liquid: 0,
            short_term: 0,
            income: 0,
            balance: 0,
            equity_mod: 40,
            equity_aggr: 60,
        };
        switch(inv_time_horizon) {
            case 30:
                default_scheme = default_scheme;
            break;
            case 5:
                default_scheme = {
                    liquid: 0,
                    short_term: 0,
                    income: 0,
                    balance: 80,
                    equity_mod: 20,
                    equity_aggr: 0,
                };
            break;
            case 15:
                default_scheme = default_scheme;
            default:
                default_scheme = default_scheme;
            break;
        }
        return default_scheme;
    },
    calculateWeightedReturns: async (scheme, returns_estimate_per)=> {
        /**
         * 
         *   CalculateWeighedReturn = ((scheme.short_term * returns_estimate_per.short_term) +
         *                        (scheme.income * returns_estimate_per.income) +
         *                        (scheme.balance * returns_estimate_per.balance) +    
         *                        (scheme.equity_mod * returns_estimate_per.equity_mod) +
         *                        (scheme.equity_aggr * returns_estimate_per.equity_aggr))/100; 
         *
        */
       console.log('Scheme = ' + JSON.stringify(scheme) + ', retest = ' + JSON.stringify(returns_estimate_per));
       let liquid = scheme.liquid * returns_estimate_per.liquid;
       let short_term = scheme.short_term * returns_estimate_per.short_term;
       let income = scheme.income * returns_estimate_per.income;
       let balance = scheme.balance * returns_estimate_per.balance;
       let equity_mod = scheme.equity_mod * returns_estimate_per.equity_mod;
       let equity_aggr = scheme.equity_aggr * returns_estimate_per.equity_aggr;

       return await FormulaeCalc.calculatePrecisionRound(Math.fround((liquid + short_term + income + balance + equity_mod + equity_aggr)/100), 2);
    },
    calculateAnnualInvRequired : async (weighted_return_rate, inv_time_horizon, corpus_required)=> {
        /**
         * CalculateAnnualInvRequired = PMT (rate/100, nper, pv, fv, [type]);
         * Where,
         *  rate - The interest rate for the loan.
         *  nper - The total number of payments for the loan.
         *  pv - The present value, or total value of all loan payments now.
         *  fv - [optional] The future value, or a cash balance you want after the last payment is made. Defaults to 0 (zero).
         *  type - [optional] When payments are due. 0 = end of period. 1 = beginning of period. Default is 0.
         */
        let pmtc = ExcelFormulaeUtil.PMT(weighted_return_rate/100, inv_time_horizon, 0 , -corpus_required);
        return await Math.round(pmtc);
    },
    calculateMonthlyInvRequired:  async (annual_inv_required)=> {
        /**
         * CalculateMontlyInvRequired = AnnualInvestmentRequired / 12
         */
        console.log(annual_inv_required / 12);
        return await (annual_inv_required / 12);
    },
    getRequiredInvestment: async (scheme, returns_estimate_per, inv_time_horizon, corpus_required)=> {
        let weighted_returns = await FormulaeCalc.calculateWeightedReturns(scheme, returns_estimate_per);
        let annual_inv_required = await FormulaeCalc.calculateAnnualInvRequired(weighted_returns, inv_time_horizon, corpus_required);
        let monthly_inv_required = await FormulaeCalc.calculateMonthlyInvRequired(annual_inv_required);

        return await {
            weighted_returns: weighted_returns,
            annual_inv: annual_inv_required,
            monthly_inv: monthly_inv_required
        };
    },
    getTotalRequiredInvestment: async (req_inv_retirement, req_inv_child, req_inv_asset)=> {
        return await Math.round(req_inv_retirement + req_inv_child + req_inv_asset);
    },
    calculatePrecisionRound: async (number, precision)=> {
        /**
         * Calculates the ROUND function depending on precision
         */
        let factor = Math.pow(10, precision);
        return await Math.round(number * factor) / factor;
    },
    calculateSchemeInvestAmount: async (proportion, monthly_investment)=> {
        /**
         *  MonthySchemeInvestAmount = ROUND((proportion / 100) * monthly_investment);
         */
        let amount = (proportion/100) * monthly_investment ;
        return await FormulaeCalc.calculatePrecisionRound(amount, -2);
    },
    getMonthySchemeInvestProportion:  async (scheme, monthly_investment)=> {
        /**
         * 
         */
        let onthySchemeInvestProportion = {
            liquid: await FormulaeCalc.calculateSchemeInvestAmount(scheme.liquid, monthly_investment),
            short_term: await FormulaeCalc.calculateSchemeInvestAmount(scheme.short_term, monthly_investment),
            income: await FormulaeCalc.calculateSchemeInvestAmount(scheme.income, monthly_investment),
            balance: await FormulaeCalc.calculateSchemeInvestAmount(scheme.balance, monthly_investment),
            equity_mod: await FormulaeCalc.calculateSchemeInvestAmount(scheme.equity_mod, monthly_investment),
            equity_aggr: await FormulaeCalc.calculateSchemeInvestAmount(scheme.equity_aggr, monthly_investment)
        };
        return await onthySchemeInvestProportion;
    },
    getSchemeMonthlyTotal: async (scheme_monthly_inv)=> {
        return await Math.round(scheme_monthly_inv.liquid + scheme_monthly_inv.short_term + scheme_monthly_inv.income + scheme_monthly_inv.balance + scheme_monthly_inv.equity_mod + scheme_monthly_inv.equity_aggr);
    },
    getTotalMonthlySchemeInvestment: async (scheme_retirement, scheme_child, scheme_asset)=> {
        /**
         * Sum all the amount for monthly scheme investment
         */
        let scheme_child_inv_total = 0;
        for(let i=0; i<scheme_child.length; i++) {
            scheme_child_inv_total = scheme_child_inv_total + scheme_child[i].scheme_monthly_total;
        }
        return await Math.round(scheme_retirement.scheme_monthly_total + scheme_child_inv_total + scheme_asset.scheme_monthly_total);
    },
    getTotalYearlyInvestmentRequired: async (scheme_retirement, scheme_child, scheme_asset)=> {
        /**
         * Sum all the amount required to invest yearly
         */
        let child_yr_inv = 0;
        for(let i=0; i<scheme_child.length; i++) {
            child_yr_inv = child_yr_inv + scheme_child[i].child_inv_req.annual_inv;
        }
        return await Math.round(scheme_retirement.retirement_inv_req.annual_inv + child_yr_inv + scheme_asset.asset_inv_req.annual_inv);
    },
};

module.exports = {assumptions, FormulaeCalc};