export interface Customer {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface CustomerData {
  name: string;
  email: string;
  passcode: string;
}

export interface Activity {
  id: string;
  action: string;
  username: string;
  value: number;
  time: Date;
  timeid: string;
}

export interface ActivityData {
  action: string;
  username: string;
  value: number;
  time: Date;
}
