export interface Applicant {
    id: string;
    name: string;
    role: string;
    location: string;
    experience: string;
    email: string;
    technicalProfile: string;
    resuméText?: string;
}
export interface CreateApplicantDto {
    name: string;
    role: string;
    email: string;
    technicalProfile: string;
}
