import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { CoinTransaction } from '@streakoid/streakoid-models/lib/Models/CoinTransaction';

export type CoinTransactionModel = CoinTransaction & mongoose.Document;

export const coinTransactionSchema = new mongoose.Schema(
    {
        transactionType: {
            required: true,
            type: String,
        },
        source: {
            required: true,
            type: Object,
        },
        userId: {
            required: true,
            type: String,
        },
        coins: {
            required: true,
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: Collections.CoinTransactions,
    },
);

export const coinTransactionModel: mongoose.Model<CoinTransactionModel> = mongoose.model<CoinTransactionModel>(
    Models.CoinTransaction,
    coinTransactionSchema,
);
