import { jwtDecode } from "jwt-decode";
import type {JwtPayload} from "../Models/JwtPayload.ts";

const api = "https://localhost:7069/api/";

export const getJwtPayloadFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return jwtDecode<JwtPayload>(token);
}

export const loginApi = async (userName: string, password: string) => {

    const response = await fetch(api + "account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userName: userName,
            password: password
        })
    })

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to login");
    }

    const data = await response.json();

    if (!data.token) {
        throw new Error("Unable to parse token from Server response!");
    }

    localStorage.setItem("token", data.token);
    return getJwtPayloadFromToken();

}