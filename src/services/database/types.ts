export type UserData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    createdAt?: Date;
}

export type MeasureClockData = {
    title: string;
    clockNumber: number;
    clockAddress: string;
    email: string
    createdAt?: Date;
}