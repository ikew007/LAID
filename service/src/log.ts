import c from "chalk";

function log(msg: string | null | undefined, color: string = 'w') {
    const date = getDate();
    const dateString = `[${date.day}.${date.month}.${date.year}]`;
    const timeString = `[${date.hour}:${date.minute}:${date.second}]`;

    let coloredMsg = msg;

    switch (color) {
        case 'c': coloredMsg = c.cyanBright(msg); break;
        case 'g': coloredMsg = c.greenBright(msg); break;
        case 'm': coloredMsg = c.magentaBright(msg); break;
        case 'y': coloredMsg = c.yellowBright(msg); break;
        case 'r': coloredMsg = c.redBright(msg); break;
        default: coloredMsg = msg; break;
    }

    const logMsg = `${c.yellowBright('>')} ${c.cyan(dateString)} ${c.cyan(timeString)}: ${coloredMsg}`;
    console.log(logMsg);
}

function getDate() {
    const date = new Date();

    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    let second = date.getSeconds().toString();

    if(day.toString().length == 1)
        day = `0${day}`;
    if(month.toString().length == 1)
        month = `0${month}`;
    if(hour.toString().length == 1)
        hour = `0${hour}`;
    if(minute.toString().length == 1)
        minute = `0${minute}`;
    if(second.toString().length == 1)
        second = `0${second}`;

    return {
        day: day,
        month: month,
        year: year,
        hour: hour,
        minute: minute,
        second: second
    }
}

export default log;