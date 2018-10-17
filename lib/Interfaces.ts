
interface IUser  {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  comparePassword: string;
  streaks?: object[];
}

interface IStreak {
  streakName: string;
  description: string;
  successCriteria: string;
  createdBy: string;
  participants: object[]
  startDate: Date;
  calendar?: object[];
}

interface IFixedTermStreak extends IStreak {
  endDate: Date;
  duration: Number;
}

interface ILastManStandingStreak extends IStreak {
  lastManStanding: boolean
}

export { IUser, IStreak, IFixedTermStreak, ILastManStandingStreak };
