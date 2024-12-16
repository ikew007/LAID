import { getAllUserLogins, getAllVerificationRequests } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";

export async function getRequested(login: string): Promise<BaseResponseModel<any>> {
    const verificationRequests = await getAllVerificationRequests();

    if(!verificationRequests) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to get verification requests"
        }
    }

    const requested = [];

    for (let i = 0; i < verificationRequests.length; i++) {
        if (verificationRequests[i].requesterLogin === login) {
            requested.push(verificationRequests[i].verifierLogin);
        }
    }

    const res = {
        data: requested,
        isSuccess: true,
        message: null
    }

    return res;
}