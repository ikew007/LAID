export interface ProfileData {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    gender: string;
    citizenship: string;
    placeOfBirth: string;
}

export interface ProfileDataDto {
    personalData: ProfileData;
}

export interface ProfileDataRequest {
    username: string;
}