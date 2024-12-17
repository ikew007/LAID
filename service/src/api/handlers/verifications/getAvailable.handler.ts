import { getAllUserLogins, getAllVerificationRequests } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";

export async function getAvailable(login: string): Promise<BaseResponseModel<any>> {
    const userLogins = await getAllUserLogins();
    if(!userLogins) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to get user logins"
        }
    }

    const loginsExceptSelf = userLogins.filter((userLogin: string) => userLogin !== login);
    const verificationRequests = await getAllVerificationRequests();

    if(!verificationRequests) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to get verification requests"
        }
    }

    const available = loginsExceptSelf.filter((anotherLogin: string) => {
        return !verificationRequests.some(
          (request: any) =>
            request.verifierLogin === anotherLogin
            && request.requesterLogin === login
        );
    });

    const res = {
        data: available,
        isSuccess: true,
        message: null
    }

    return res;
}