import { useEffect, useState } from "react"

import { Filter, TzevaAdom } from "../models/models"
import { tzofarService } from "../services/tzofar.service"

import { FilterBy } from "../cmps/FilterBy"
import { TzevaAdomTable } from "../cmps/TzevaAdomTable"
import { TzevaAdomChart } from "../cmps/TzevaAdomChart"
import { TzevaAdomMap } from "../cmps/TzevaAdomMap"
import { utilService } from "../services/util.service"
import { Loader } from "../cmps/Loader"

export function TzevaAdomIndex(): React.ReactElement {
    const [allTzevaAdom, setAllTzevaAdom] = useState<TzevaAdom[]>(null)
    const [cityAlertsMap, setCityAlertsMap] = useState<{ name: string, alertsAmounts: number }[]>(null)
    const [filterBy, setFilterBy] = useState<Filter>(tzofarService.getEmptyFilter())
    const [nav, setNav] = useState<string>('table')


    useEffect(() => {
        setAllTzevaAdom(tzofarService.query(filterBy))
    }, [filterBy])

    useEffect(() => {
        if (allTzevaAdom) setCityAlertsMap(cityMap())
    }, [filterBy, allTzevaAdom])

    function cityMap(): { name: string, alertsAmounts: number }[] {
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
                alertsAmounts: cityMap[key]
            })
        }

        return citiesAlerts
            .filter(({ name }) => name.includes(filterBy.cityName))
            .filter(({ alertsAmounts }) => alertsAmounts >= filterBy.alertsAmounts)

    }

    // onFilterToday()
    function onFilterToday() {
        const endDate = utilService.getFormattedDate()
        const startDate = utilService.getFormattedDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
        setFilterBy(prev => ({ ...prev, endDate, startDate }))
    }

    if (!allTzevaAdom || !cityAlertsMap) return <Loader isBG={true} />
    return (
        <section className="tzeva-adom-index">
            <FilterBy filterBy={filterBy} setFilterBy={setFilterBy} setNav={setNav} />
            {nav === 'map' && <TzevaAdomMap cityAlertsMap={cityAlertsMap} allTzevaAdom={allTzevaAdom} filterBy={filterBy} onFilterToday={onFilterToday} />}
            {nav === 'table' && <TzevaAdomTable cityAlertsMap={cityAlertsMap} allTzevaAdom={allTzevaAdom} filterBy={filterBy} />}
            {nav === 'chart' && <TzevaAdomChart allTzevaAdom={allTzevaAdom} filterBy={filterBy} />}
        </section>
    )
}