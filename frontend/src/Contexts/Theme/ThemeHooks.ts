import {useContext} from "react";
import {ThemeContext, type ThemeContextType} from "./ThemeContext.ts";

export function useTheme() { return useContext<ThemeContextType>(ThemeContext); }