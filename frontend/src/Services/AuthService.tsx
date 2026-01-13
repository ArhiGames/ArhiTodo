import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../Models/JwtPayload.ts";
import type { UserLoginResponseDto } from "../Models/DTOs/UserLoginResponseDto.ts";
import { AUTH_BASE_URL } from "../config/api.ts";

export const getJwtPayloadFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
}

export const registerApi = async (username: string, email: string, password: string, invitationKey: string) => {

    const response = await fetch(`${AUTH_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
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

export const loginApi = async (username: string, password: string) => {

    const response = await fetch(`${AUTH_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
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

export const logoutApi = async () => {

    const response = await fetch(`${AUTH_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
    });

    localStorage.removeItem("token");

    if (!response.ok) {
        const message: string = await response.text();
        throw new Error(message || "Unable to logout");
    }

}

export const refreshApi = async () => {

    const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        const message: string = await response.text();
        throw new Error(message || "Unable to refresh");
    }

    const { token } = await response.json();

    localStorage.setItem("token", token);
    return getJwtPayloadFromToken();

}