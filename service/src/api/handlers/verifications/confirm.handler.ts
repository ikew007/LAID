import { confirmVerification } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";

export async function confirm(requesterLogin: string, verifierLogin: string): Promise<BaseResponseModel<any>> {
    const isSuccess = await confirmVerification(requesterLogin, verifierLogin);
    if(!isSuccess) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to confirm verification"
        }
    }

    const res = {
        data: null,
        isSuccess: true,
        message: null
    }

    return res;
}