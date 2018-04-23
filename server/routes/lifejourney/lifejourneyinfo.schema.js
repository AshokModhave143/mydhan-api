const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const age_limit = {
    lower_age: {
        type: Number
    },
    upper_age: {
        type: Number
    }
};
const scheme = {
    liquid: {
        type: Number
    },
    short_term: {
        type: Number
    },
    income: {
        type: Number
    },
    balanced: {
        type: Number
    },
    equity_mod: {
        type: Number
    },
    equity_agg: {
        type: Number
    },
};
const inv_asset_alloc = {
    time_horizon: {
        type: String
    },
    scheme: scheme
};
const band = {
    age_limit: age_limit,
    inv_asset_alloc: [inv_asset_alloc]
}
const lifeJourneyInfo = {
    band_1: band,
    band_2: band,
    band_3: band,
    band_4: band,
    band_5: band,
    band_6: band,
}

const LifeJourneyInfoSchema = new Schema(lifeJourneyInfo, { timestamps: true });
module.exports = mongoose.model('lifeJourneyInfo', LifeJourneyInfoSchema);
