import { Filter, TzevaAdom } from "../models/models"
import { utilService } from "./util.service"
import jsonData from '../../src/data/tzevaAdom.json';

export const tzofarService = {
    query,
    get,
    getByCityName,
    getEmptyFilter
}

function query(filterBy: Filter): TzevaAdom[] {
    const data: TzevaAdom[] = jsonData
    const startDate = new Date(filterBy.startDate).getTime() / 1000; // Convert to seconds
    const endDate = new Date(filterBy.endDate).getTime() / 1000 + 86400;
    const tzevaAdom = data
        .filter(({ alerts }) => alerts[0].time >= startDate && alerts[0].time <= endDate)
        .map((alert) => ({ ...alert, alerts: alert.alerts.filter(({ threat }) => filterBy.threatSelect.includes(threat.toString())) }))

    return tzevaAdom
}

function get(tzofarId: number): TzevaAdom {
    return jsonData.find(({ id }) => tzofarId === id)
}

function getByCityName(cityName: string, filterBy: Filter, isByMinute = false) {
    const allTzevaAdom: TzevaAdom[] = query(filterBy)
    const { startDate, endDate } = filterBy
    const dataMap = {}
    const threatMapTep = {}

    !isByMinute ?
        utilService.getDateRange(startDate, endDate).forEach(date => {
            if (!dataMap[date]) dataMap[date] = 0
        }) :
        utilService.getMinuteRange().forEach(date => {
            if (!dataMap[date]) dataMap[date] = 0
        })

    allTzevaAdom.forEach(alert => {
        alert.alerts.forEach(({ cities, time, threat }) => {
            if (cities.includes(cityName)) {
                const date = !isByMinute ?
                    utilService.getFormDate(time * 1000) :
                    utilService.getFormMinute(time * 1000)

                if (dataMap[date]) dataMap[date]++
                else dataMap[date] = 1

                if (threatMapTep[threat]) threatMapTep[threat]++
                else threatMapTep[threat] = 1
            }
        })
    })

    console.log(dataMap);


    let cityData = []
    for (const key in dataMap) {
        cityData.push({
            date: key,
            alerts: dataMap[key]
        })
    }

    return { threatMapTep, cityData }
}

function getEmptyFilter() {
    return {
        cityName: '',
        alertsAmounts: 0,
        startDate: '2023-10-07',
        endDate: utilService.getFormattedDate(),
        threatSelect: ['0', '2', '3', '5']
    }
}


