import { rejectVerification } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";

export async function reject(requesterLogin: string, verifierLogin: string): Promise<BaseResponseModel<any>> {
    const isSuccess = await rejectVerification(requesterLogin, verifierLogin);
    if(!isSuccess) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to reject verification"
        }
    }

    const res = {
        data: null,
        isSuccess: true,
        message: null
    }

    return res;
}