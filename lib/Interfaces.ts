
interface IUser  {
  userName: string;
  email: string;
  password: string;
  createdAt: {
    type: Date,
    required: false
  }, 
  modifiedAt: {
    type: Date,
    required: false
  }
  streaks?: IStreak[];
  profilePicture?: {
    type: String
  },
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
