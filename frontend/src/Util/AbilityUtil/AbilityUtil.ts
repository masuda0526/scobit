export const getMeetAlp = (avr:number): string => {
    if (avr < 0.15) return "G";
    if (avr < 0.20) return "F";
    if (avr < 0.23) return "E";
    if (avr < 0.26) return "D";
    if (avr < 0.29) return "C";
    if (avr < 0.32) return "B";
    if (avr < 0.35) return "A";
    return "S";
}

export const getPowerAlp = (hrPerGame:number): string => {
    if (hrPerGame < 0.02) return "G";
    if (hrPerGame < 0.05) return "F";
    if (hrPerGame < 0.10) return "E";
    if (hrPerGame < 0.20) return "D";
    if (hrPerGame < 0.35) return "C";
    if (hrPerGame < 0.50) return "B";
    if (hrPerGame < 0.70) return "A";
    return "S";
}

export const getSpeedAlp = (stealPerGame:number): string => {
    if (stealPerGame < 0.05) return "G";
    if (stealPerGame < 0.10) return "F";
    if (stealPerGame < 0.20) return "E";
    if (stealPerGame < 0.30) return "D";
    if (stealPerGame < 0.50) return "C";
    if (stealPerGame < 0.70) return "B";
    if (stealPerGame < 1.00) return "A";
    return "S";
}

export const getLongThrowAlp = (outPerGame:number): string => {
    if (outPerGame < 40) return "G";
    if (outPerGame < 50) return "F";
    if (outPerGame < 60) return "E";
    if (outPerGame < 70) return "D";
    if (outPerGame < 80) return "C";
    if (outPerGame < 90) return "B";
    if (outPerGame < 100) return "A";
    return "S";
}

export const getDefenseAlp = (errPerGame:number): string => {
    if (errPerGame < 0.05) return "S";
    if (errPerGame < 0.10) return "A";
    if (errPerGame < 0.20) return "B";
    if (errPerGame < 0.30) return "C";
    if (errPerGame < 0.40) return "D";
    if (errPerGame < 0.60) return "E";
    if (errPerGame < 0.80) return "F";
    return "G";
}

export const getAbilityClassName = (alp: string): string => {
    switch (alp) {
        case "S":
            return "ability_s";
        case "A":
            return "ability_a";
        case "B":
            return "ability_b";
        case "C":
            return "ability_c";
        case "D":
            return "ability_d";
        case "E":
            return "ability_e";
        case "F":
            return "ability_f";
        case "G":
            return "ability_g";
        default:
            return "";
    }
}