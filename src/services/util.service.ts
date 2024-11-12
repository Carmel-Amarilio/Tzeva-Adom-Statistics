import { t } from "i18next";
import { CityData, Filter, TzevaAdom } from "../models/models";


export const utilService = {
    debounce,
    getFormattedDate,
    getFormDate,
    getDateRange,
    getFormMinute,
    getMinuteRange,
    findSafestHour,
    findLongestNoAlertPeriod,
    checkAveBreak
}

function debounce<T extends (...args: any[]) => void>(func: T, timeout: number = 300): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function getFormattedDate(date = new Date()): string {
    const today = new Date(date);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getFormDate(date: number): string {
    const time = new Date(date);
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(time.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

function getFormMinute(date: number): string {
    const time = new Date(date);
    const hour = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hour}:${minutes}`;
}


function getDateRange(start, end) {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
        dateArray.push(utilService.getFormDate(currentDate.getTime())); // Format date as needed
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dateArray;
}

function getMinuteRange() {
    const hourArray = [];

    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
            const formattedHour = String(hour).padStart(2, '0');
            const formattedMinute = String(minute).padStart(2, '0');
            hourArray.push(`${formattedHour}:${formattedMinute}`);
        }
    }

    return hourArray;
}

function findSafestHour(data: CityData[]) {

    const hourlyAlerts = {};

    data.forEach(item => {
        const hour = item.date.split(":")[0]

        if (!hourlyAlerts[hour]) hourlyAlerts[hour] = 0;
        hourlyAlerts[hour] += item.alerts;
    })
    console.log(hourlyAlerts);

    let minAlerts = Infinity;
    let safestHour = null;

    for (const hour in hourlyAlerts) {
        if (+hour < 9 || +hour > 21) continue
        if (hourlyAlerts[hour] < minAlerts) {
            minAlerts = hourlyAlerts[hour]
            safestHour = hour
        }
    }
    return ` ${safestHour}:00`
    return ` ${safestHour > 12 ? `${safestHour - 12}:` : `${safestHour}:00AM`}`
}

function findLongestNoAlertPeriod(data: CityData[]) {
    let longestStart = null;
    let longestEnd = null;
    let currentStart = null;
    let currentCount = 0;
    let maxCount = 0;

    data.forEach((entry, index) => {
        if (entry.alerts === 0) {
            if (currentStart === null) currentStart = entry.date;
            currentCount++;
        } else {
            if (currentCount > maxCount) {
                maxCount = currentCount;
                longestStart = currentStart;
                longestEnd = data[index - 1].date;
            }
            currentStart = null;
            currentCount = 0;
        }
    });

    // Check at the end in case the longest no-alert period is at the end of the data
    if (currentCount > maxCount) {
        longestStart = currentStart;
        longestEnd = data[data.length - 1].date;
    }

    return `${longestStart}-${longestEnd}`

    // return {
    //     start: longestStart,
    //     end: longestEnd,
    //     duration: maxCount
    // };
}

function checkAveBreak(allTzevaAdom: TzevaAdom[], starDate: string, endDate: string) {
    const startTime = new Date(starDate).getTime() / 1000
    const endTime = new Date(endDate).getTime() / 1000 + 86400


    let aveBreak = 0

    const filTzevaAdom = allTzevaAdom.filter(({ alerts }) => alerts.length > 0)
    filTzevaAdom.forEach((alert, i) => {
        if (i === 0) return aveBreak += alert.alerts[0].time - startTime
        if (!filTzevaAdom[i + 1]) return aveBreak += endTime - filTzevaAdom[i].alerts[0].time
        aveBreak += filTzevaAdom[i + 1].alerts[0].time - alert.alerts[0].time
    })
    aveBreak = (aveBreak * 1000) / (filTzevaAdom.length)

    const diffMs = Math.abs(aveBreak);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return (`${diffDays ? `${diffDays}${t('d')} ,` : ''} ${diffHours ? `${diffHours}${t('h')} ,` : ''} ${diffMinutes ? `${diffMinutes}${t('m')} ${t('and')}` : ''} ${diffSeconds}${t('s')}`)
}