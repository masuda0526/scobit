type DateFormat = 'jp' | 'yyyymmdd' | 'slash' | 'dot' | 'haifun';

export const dispDate = (dtText: string, format: DateFormat = 'dot') => {
    if (format === 'dot') {
        return `${dtText.slice(0, 4)}.${Number(dtText.slice(4, 6)).valueOf()}.${Number(dtText.slice(6, 8)).valueOf()}`
    }
    if (format === 'jp') {
        return `${dtText.slice(0, 4)}年 ${Number(dtText.slice(4, 6)).valueOf()}月 ${Number(dtText.slice(6, 8)).valueOf()}日`
    }
    if (format === 'slash') {
        return `${dtText.slice(0, 4)}/${Number(dtText.slice(4, 6)).valueOf()}/${Number(dtText.slice(6, 8)).valueOf()}`
    }
    if (format == 'haifun') {
        return `${dtText.slice(0, 4)}-${Number(dtText.slice(4, 6)).valueOf()}-${Number(dtText.slice(6, 8)).valueOf()}`
    }

    return dtText
}

export const dispDateFromDate = (date: Date, format: DateFormat = 'dot') => {
    const y = date.getFullYear().toString().padStart(4, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return dispDate(`${y}${m}${d}`, format)
}

export const parseStringFromDate = (date: Date) => {
    const y = date.getFullYear().toString().padStart(4, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`
}

export const parseDateFromString = (date:string) => {
    console.log(date);
    const dateUnits = date.split('-');
    const y = Number.parseInt(dateUnits[0]);
    const m = Number.parseInt(dateUnits[1]) - 1;
    const d = Number.parseInt(dateUnits[2]);
    return new Date(y, m, d);
}

export const getDateString = () => {
    const now = new Date();
    const y = now.getFullYear().toString().padStart(4, '0');
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`
}