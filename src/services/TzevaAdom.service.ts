import { CityAlert, Filter, TzevaAdom } from "../models/models"

import { utilService } from "./util.service"

import jsonData from '../data/tzevaAdom.json';
import citiesData from '../data/citiesData.json';
import landmarksData from '../data/landmarksData.json';
import areaData from '../data/areaData.json';

export const TzevaAdomService = {
    query,
    get,
    getCitiesAlertsMap,
    getByCityName,
    getEmptyFilter
}

function query(filterBy: Filter): TzevaAdom[] {
    const { cityName, areaSelect, threatSelect } = filterBy
    const data: TzevaAdom[] = jsonData
    const allCitiesData = citiesData

    const startDate = new Date(filterBy.startDate).getTime() / 1000
    const endDate = new Date(filterBy.endDate).getTime() / 1000 + 86400

    const filterData = []
    data.map(tzevaAdom => {
        const { alerts } = tzevaAdom
        if (alerts[0].time >= startDate && alerts[0].time <= endDate) {
            const filterAlerts = []
            alerts.forEach(alert => {
                const { threat, cities } = alert
                if (threatSelect.includes(threat.toString())) {
                    const filterCities = cities.filter(city => {
                        const area = allCitiesData[city] ? allCitiesData[city].area : 35
                        return (city.includes(cityName) ||
                            (allCitiesData[city] &&
                                allCitiesData[city].en.toLowerCase().includes(cityName.toLowerCase())) ||
                            landmarksData[area].he.includes(cityName) ||
                            landmarksData[area].en.toLowerCase().includes(cityName.toLowerCase())
                        ) && (areaSelect.includes(area.toString()))
                    })
                    if (filterCities.length > 0) filterAlerts.push({ ...alert, cities: filterCities })
                }
            })
            if (filterAlerts.length > 0) filterData.push({ ...tzevaAdom, alerts: filterAlerts })
        }
    })

    return filterData
}

function get(TzevaAdomId: number): TzevaAdom {
    return jsonData.find(({ id }) => TzevaAdomId === id)
}

function getCitiesAlertsMap(filterBy: Filter): CityAlert[] {
    const allCitiesData = citiesData
    const allTzevaAdom: TzevaAdom[] = query(filterBy)
    console.log(123);


    const cityMap = {}
    allTzevaAdom.forEach(alert => {
        alert.alerts.forEach(({ cities }) => {
            cities.forEach(city => {
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
            area: allCitiesData[key] ? allCitiesData[key].area : 35,
            areasPolygon: allCitiesData[key] ? areaData[allCitiesData[key].id] : []
        })
    }

    return citiesAlerts.filter(({ alertsAmounts }) => alertsAmounts >= filterBy.alertsAmounts)
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


