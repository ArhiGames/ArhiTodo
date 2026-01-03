import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../Models/JwtPayload.ts";
import type { UserLoginResponseDto } from "../Models/DTOs/UserLoginResponseDto.ts";
import {API_BASE_URL} from "../config/api.ts";

export const getJwtPayloadFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return jwtDecode<JwtPayload>(token);
}

export const registerApi = async (userName: string, email: string, password: string, invitationKey: string) => {

    const response = await fetch(`${API_BASE_URL}/account/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userName: userName,
            email: email,
            password: password,
            invitationKey: invitationKey,
        }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to register account");
    }

    const data: UserLoginResponseDto = await response.json();

    if (!data.token) {
        throw new Error("Unable to parse token from Server response!");
    }

    localStorage.setItem("token", data.token);
    return getJwtPayloadFromToken();
}

export const loginApi = async (userName: string, password: string) => {

    const response = await fetch(`${API_BASE_URL}/account/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userName: userName,
            password: password
        })
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to login");
    }

    const data: UserLoginResponseDto = await response.json();

    if (!data.token) {
        throw new Error("Unable to parse token from Server response!");
    }

    localStorage.setItem("token", data.token);
    return getJwtPayloadFromToken();

}