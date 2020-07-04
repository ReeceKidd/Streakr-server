import OidXpTransactionTypes from '@streakoid/streakoid-models/lib/Types/OidXpTransactionTypes';
import { oidXpTransactionModel } from '../Models/OidXpTransaction';
import { OidXpSources } from '@streakoid/streakoid-models/lib/Models/OidXpSources';
import { userModel } from '../Models/User';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const chargeUserOidXp = async ({
    userId,
    oidXp,
    source,
}: {
    userId: string;
    oidXp: number;
    source: OidXpSources;
}): Promise<User | null> => {
    const userWithOidXpChanges = await userModel.findByIdAndUpdate(userId, { $inc: { oidXp: -oidXp } }, { new: true });
    const newOidXpTransaction = new oidXpTransactionModel({
        userId,
        oidXp,
        transactionType: OidXpTransactionTypes.charge,
        source,
    });
    await newOidXpTransaction.save();
    return userWithOidXpChanges;
};

const creditUserOidXp = async ({
    userId,
    oidXp,
    source,
}: {
    userId: string;
    oidXp: number;
    source: OidXpSources;
}): Promise<User | null> => {
    const userWithOidXpChanges = await userModel.findByIdAndUpdate(userId, { $inc: { oidXp } }, { new: true });
    const newOidXpTransaction = new oidXpTransactionModel({
        userId,
        oidXp,
        transactionType: OidXpTransactionTypes.credit,
        source,
    });
    await newOidXpTransaction.save();
    return userWithOidXpChanges;
};

export const OidXpTransactionHelpers = {
    chargeUserOidXp,
    creditUserOidXp,
};
