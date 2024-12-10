import { getPersonalData } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";
import { PersonalDataSetResponseModel } from "../../models/response/personal-data-set-reponse.model";
import { PersonalDataGetRequestModel } from "../../models/request/personal-data-get-request.model copy";

export async function get(model: PersonalDataGetRequestModel): Promise<BaseResponseModel<PersonalDataSetResponseModel>> {
    const { personalData, verifiers } = await getPersonalData(model.username);
    if(!personalData) {
        return {
            data: null,
            isSuccess: false,
            message: "Failed to get personal data"
        }
    }

    const res = {
        data: {
            personalData: personalData,
            verifiers: verifiers
        },
        isSuccess: true,
        message: null
    }

    return res;
}