import { registerUser } from "../../../smart-contracts/smart-contract";
import { BaseResponseModel } from "../../models/base-response.model";
import { AuthRequestModel } from "../../models/request/auth-request.model";
import { AuthResponseModel } from "../../models/response/auth-reponse.model";


export async function register(model: AuthRequestModel): Promise<BaseResponseModel<AuthResponseModel>> {
    const authResult = await registerUser(model.username, model.password);
    if(!authResult){
        return {
            data: null,
            isSuccess: false,
            message: "Invalid login"
        }
    }

    const res =  {
        data: null,
        isSuccess: true,
        message: null
    }

    return res;
}
