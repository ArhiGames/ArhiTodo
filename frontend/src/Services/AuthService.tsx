import { jwtDecode } from "jwt-decode";
import type {JwtPayload} from "../Models/JwtPayload.ts";

const api = "https://localhost:7069/api/";

export const getJwtPayloadFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return jwtDecode<JwtPayload>(token);
}

export const loginApi = async (userName: string, password: string) => {

    try {

        const response = await fetch(api + "account/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: userName,
                password: password
            })
        })

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Logged in with account name: " + getJwtPayloadFromToken()?.unique_name)
        }
    }
    catch (e) {
        console.error(e);
    }
}