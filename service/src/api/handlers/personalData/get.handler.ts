import { getPersonalData } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";
import { PersonalDataSetResponseModel } from "../../models/response/personal-data-set-reponse.model";

export async function get(login: string): Promise<BaseResponseModel<PersonalDataSetResponseModel>> {
    const { personalData, verifiers } = await getPersonalData(login);
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