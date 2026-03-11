import {type Theme, ThemeContext} from "./ThemeContext.ts";
import {useEffect, useState} from "react";

interface Props {
    children: React.ReactNode;
}

const ThemeProvider = (props: Props) => {

    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme: string | null = localStorage.getItem("theme");
        if (savedTheme) return savedTheme as Theme;
        const prefersDark: boolean = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        return (prefersDark ? "dark" : "light") as Theme;
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme as string);
        localStorage.setItem("theme", theme as string);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )

}

export default ThemeProvider;