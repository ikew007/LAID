import { logoutUser } from "../../../smart-contracts/smart-contract";

export async function logout(username: string): Promise<void> {
    await logoutUser(username);    
}