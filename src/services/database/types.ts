export type UserData = {
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
}

export type MeasurerData = {
    title: string;
    number: number;
    installationAddress: string;
    email: string[];
    createdAt?: Date;
}