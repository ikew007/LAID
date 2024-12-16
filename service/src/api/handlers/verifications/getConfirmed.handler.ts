import { getConfirmedVerifications } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";

export async function getConfirmed(login: string): Promise<BaseResponseModel<any>> {
    const verifications = await getConfirmedVerifications(login);

    if(!verifications) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to get verifications"
        }
    }

    const res = {
        data: verifications,
        isSuccess: true,
        message: null
    }

    return res;
}