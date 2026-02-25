import { CURRENCY } from '../constants.js';

export const player = {

    currency: Object.fromEntries(
        Object.values(CURRENCY).map(currency => [
            currency.id,
            {
                amount: new Decimal(0),
                perSecond: new Decimal(0),
            }
        ])
    ),
    
    upgrades: {},

    lastUpdate: Date.now()

};