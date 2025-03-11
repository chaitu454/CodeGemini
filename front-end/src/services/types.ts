export type LoginReqType = {
    email: string;
    password: string
}

export type ResetPasswordReqType = {
    email: string;
    security_answer: string;
    new_password: string
}

export type RegisterUserReqType = {
    email: string;
    security_answer: string;
    password: string;
    security_question: string;
    first_name: string
    last_name: string
}

export type EditUserReqType = {
    email: string;
    first_name: string
    last_name: string
    user_role: string
}