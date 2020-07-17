import { CoinCharges } from '@streakoid/streakoid-models/lib/Types/CoinCharges';
import { CoinCredits } from '@streakoid/streakoid-models/lib/Types/CoinCredits';
import { coinCreditValues } from './coinCreditValues';

export const coinChargeValues = {
    [CoinCharges.incompleteSoloStreak]: coinCreditValues[CoinCredits.completeSoloStreak],
    [CoinCharges.incompleteChallengeStreak]: coinCreditValues[CoinCredits.completeChallengeStreak],
    [CoinCharges.incompleteTeamMemberStreak]: coinCreditValues[CoinCredits.completeTeamMemberStreak],
    [CoinCharges.recoverSoloStreak]: 1000,
    [CoinCharges.recoverChallengeStreak]: 1000,
    [CoinCharges.recoverTeamMemberStreak]: 1000,
};
