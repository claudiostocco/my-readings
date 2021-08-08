export type UserData = {
    id?: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
}

export type MeasurerData = {
    id?: string;
    title: string;
    number: number;
    installationAddress: string;
    email: string[];
    createdAt?: Date;
}