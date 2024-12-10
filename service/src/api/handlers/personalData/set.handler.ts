import { setPersonalData } from "../../../smart-contracts/smart-contract";
import { PersonalDataSetRequestModel } from "../../models/request/personal-data-set-request.model";
import { PersonalDataSetResponseModel } from "../../models/response/personal-data-set-reponse.model";
import { BaseResponseModel } from "../../models/base-response.model";

export async function set(login: string, personalData: PersonalDataSetRequestModel): Promise<BaseResponseModel<PersonalDataSetResponseModel>> {
    const isSet = await setPersonalData(login, personalData);
    if(!isSet) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to set personal data"
        }
    }

    const res = {
        data: {
            personalData: personalData
        },
        isSuccess: true,
        message: null
    }

    return res;
}