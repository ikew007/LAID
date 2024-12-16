import { requestVerification } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";

export async function create(requesterLogin: string, verifierLogin: string): Promise<BaseResponseModel<any>> {
    const isSuccess = await requestVerification(requesterLogin, verifierLogin);
    if(!isSuccess) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to request verification"
        }
    }

    const res = {
        data: null,
        isSuccess: true,
        message: null
    }

    return res;
}