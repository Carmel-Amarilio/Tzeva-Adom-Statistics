import { Filter, TzevaAdom } from "../models/models"
import { utilService } from "./util.service"
import jsonData from '../../src/data/tzevaAdom.json';

export const tzofarService = {
    query,
    get,
    getEmptyFilter
}

function query(filterBy: Filter): TzevaAdom[] {
    const data: TzevaAdom[] = jsonData
    const startDate = new Date(filterBy.startDate).getTime() / 1000; // Convert to seconds
    const endDate = new Date(filterBy.endDate).getTime() / 1000;
    const tzevaAdom = data
        .filter(({ alerts }) => alerts[0].time >= startDate && alerts[0].time <= endDate)
        .map((alert) => ({ ...alert, alerts: alert.alerts.filter(({ threat }) => filterBy.threatSelect.includes(threat.toString())) }))

    return tzevaAdom
}

function get(tzofarId: number): TzevaAdom {
    return jsonData.find(({ id }) => tzofarId === id)
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


