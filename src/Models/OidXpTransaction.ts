import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { OidXpTransaction } from '@streakoid/streakoid-models/lib/Models/OidXpTransaction';

export type OidXpTransactionModel = OidXpTransaction & mongoose.Document;

export const oidXpTransactionSchema = new mongoose.Schema(
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
        oidXp: {
            required: true,
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: Collections.OidXpTransactions,
    },
);

export const oidXpTransactionModel: mongoose.Model<OidXpTransactionModel> = mongoose.model<OidXpTransactionModel>(
    Models.OidXpTransaction,
    oidXpTransactionSchema,
);
