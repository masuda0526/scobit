type DateFormat = 'jp' | 'yyyymmdd' | 'slash' | 'dot';

export const dispDate = (dtText: string, format:DateFormat = 'dot') => {
    if(format === 'dot'){
        return `${dtText.slice(0, 4)}.${Number(dtText.slice(4, 6)).valueOf()}.${Number(dtText.slice(6, 8)).valueOf()}`
    }
    if(format === 'jp'){
        return `${dtText.slice(0, 4)}年 ${Number(dtText.slice(4, 6)).valueOf()}月 ${Number(dtText.slice(6, 8)).valueOf()}日`
    }
    if(format === 'slash'){
        return `${dtText.slice(0, 4)}/${Number(dtText.slice(4, 6)).valueOf()}/${Number(dtText.slice(6, 8)).valueOf()}`
    }

    return dtText
}