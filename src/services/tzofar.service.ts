import { CityAlert, Filter, TzevaAdom } from "../models/models"

import { utilService } from "./util.service"

import jsonData from '../../src/data/tzevaAdom.json';
import citiesData from '../../src/data/citiesData.json';
import areasData from '../../src/data/areasData.json';

export const tzofarService = {
    query,
    get,
    getCitiesAlertsMap,
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

function getCitiesAlertsMap(filterBy: Filter): CityAlert[] {
    const { cityName, areaSelect } = filterBy
    const allCitiesData = citiesData
    const allTzevaAdom: TzevaAdom[] = query(filterBy)

    const cityMap = {}
    allTzevaAdom.forEach(alert => {
        alert.alerts.forEach(al => {
            al.cities.forEach(city => {
                if (cityMap[city]) cityMap[city]++
                else cityMap[city] = 1
            })
        })
    })

    const citiesAlerts = []
    for (const key in cityMap) {

        citiesAlerts.push({
            name: key,
            alertsAmounts: cityMap[key],
            lat: allCitiesData[key] ? allCitiesData[key].lat : null,
            lng: allCitiesData[key] ? allCitiesData[key].lng : null,
            area: allCitiesData[key] ? allCitiesData[key].area : 35
        })
    }

    return citiesAlerts
        .filter(({ name, alertsAmounts, area }) =>
            (name.includes(cityName) || areasData[area].he.includes(cityName)) &&
            alertsAmounts >= filterBy.alertsAmounts &&
            areaSelect.includes(area.toString()
            ))
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
        threatSelect: ['0', '2', '3', '5'],
        areaSelect: ['1', '2', '3', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '32', '34', '35']
    }
}


