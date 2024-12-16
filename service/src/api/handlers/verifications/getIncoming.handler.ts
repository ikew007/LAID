import { getAllVerificationRequests, getPersonalDataToConfirm } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";

export async function getIncoming(login: string): Promise<BaseResponseModel<any>> {
    const verificationRequests = await getAllVerificationRequests();

    if(!verificationRequests) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to get verification requests"
        }
    }

    const incoming = [];

    for (let i = 0; i < verificationRequests.length; i++) {
        if (verificationRequests[i].verifierLogin === login) {
            const personalData = await getPersonalDataToConfirm(verificationRequests[i].requesterLogin, login);
            personalData.username = verificationRequests[i].requesterLogin;
            incoming.push(personalData);
        }
    }

    const res = {
        data: incoming,
        isSuccess: true,
        message: null
    }

    return res;
}