export interface PersonalData {
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  citizenship: string;
  placeOfBirth: string;
}

export interface VerifierDto {
  login: string;
  confirmationDate: string;
}

export interface IncomingVerificationRequestDto {
  verifierLogin: string;
}

export interface OutgoingVerificationRequestDto {
  requesterLogin: string;
}

