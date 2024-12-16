import { revertVerification } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";

export async function revert(requesterLogin: string, verifierLogin: string): Promise<BaseResponseModel<any>> {
    const isSuccess = await revertVerification(requesterLogin, verifierLogin);
    if(!isSuccess) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to revert verification"
        }
    }

    const res = {
        data: null,
        isSuccess: true,
        message: null
    }

    return res;
}