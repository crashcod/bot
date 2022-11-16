export type IWalletLoginParams = {
    type: "wallet";
    wallet: string;
    privateKey: string;
    token?: string;
    rede?: string;
};

export type IUserLoginParams = {
    type: "user";
    username: string;
    password: string;
    token?: string;
    wallet?: string;
    rede?: string;
};

export type ILoginParams = IWalletLoginParams | IUserLoginParams;

export interface IVerifyTokenResponse {
    statusCode: number;
    message: {
        id: number;
        nickname: string;
        username: string;
        email: string;
        address: string;
        isDeleted: boolean;
        isFiAccount: boolean;
        hasPasscode: boolean;
        createAt: number;
    };
}
export interface IJwtLoginResponse {
    statusCode: number;
    message: { token: string };
}
