import {useTheme} from "../../Contexts/Theme/ThemeHooks.ts";

const ThemeSwitcher = () => {

    const { theme, toggleTheme } = useTheme();

    function onClicked() {
        toggleTheme();
    }

    return (
        <img height="40px" src={theme === "light" ? "/darkmode-switcher.svg" : "/lightmode-switcher.svg" } alt={ theme === "light" ? "Dark mode" : "Light mode" }
             className="icon clickable theme-switcher" onClick={onClicked}/>
    )

}

export default ThemeSwitcher;