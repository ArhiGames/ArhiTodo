export function formatRemainingTime(diffMs: number): string {
    if (diffMs <= 0) return "Expired";

    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.floor(totalSeconds / 86400);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export type Rgb = {
    red: number;
    green: number;
    blue: number;
}

export function toRgb(color: number): Rgb {
    const blueNumber: number = color & 255;
    const greenNumber: number = (color >> 8) & 255;
    const redNumber: number = (color >> 16) & 255;
    return {
        red: redNumber,
        green: greenNumber,
        blue: blueNumber,
    }
}

export function toInteger(color: Rgb) {
    let rgbColor: number = color.red;
    rgbColor = (rgbColor << 8) + color.green;
    rgbColor = (rgbColor << 8) + color.blue;
    return rgbColor;
}