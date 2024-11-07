import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Filter, TzevaAdom } from "../models/models"
import { tzofarService } from "../services/tzofar.service"
import { utilService } from "../services/util.service"

import { FilterBy } from "../cmps/FilterBy"
import { TzevaAdomTable } from "../cmps/TzevaAdomTable"
import { TzevaAdomChart } from "../cmps/TzevaAdomChart"
import { TzevaAdomMap } from "../cmps/TzevaAdomMap"
import { Loader } from "../cmps/Loader"

export function TzevaAdomIndex(): React.ReactElement {
    const [allTzevaAdom, setAllTzevaAdom] = useState<TzevaAdom[]>(null)
    const [cityAlertsMap, setCityAlertsMap] = useState<{ name: string, alertsAmounts: number }[]>(null)
    const [filterBy, setFilterBy] = useState<Filter>(tzofarService.getEmptyFilter())
    const [nav, setNav] = useState<string>('table')

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const navigate = useNavigate();

    useEffect(() => {
        setAllTzevaAdom(tzofarService.query(filterBy))
    }, [filterBy])

    useEffect(() => {
        if (allTzevaAdom) setCityAlertsMap(cityMap())
    }, [filterBy, allTzevaAdom])

    useEffect(() => {
        const labelNav = searchParams.get('nav') || 'table';
        const cityName = searchParams.get('cityName') || '';
        const alertsAmounts = +searchParams.get('alertsAmounts') || 0;
        const startDate = searchParams.get('startDate') || '2023-10-07';
        const endDate = searchParams.get('endDate') || utilService.getFormattedDate();
        let threatSelect = searchParams.get('threatSelect') ? searchParams.get('threatSelect').split(',') : ['0', '2', '3', '5']
        setNav(labelNav)
        setFilterBy({ cityName, alertsAmounts, startDate, endDate, threatSelect });
    }, []);

    useEffect(() => {
        const { cityName, alertsAmounts, startDate, endDate, threatSelect } = filterBy;
        navigate(`/?nav=${nav}${cityName ? `&cityName=${cityName}` : ''}${alertsAmounts ? `&alertsAmounts=${alertsAmounts}` : ''}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}${threatSelect ? `&threatSelect=${threatSelect}` : ''}`);
    }, [filterBy, nav]);

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
            <FilterBy filterBy={filterBy} setFilterBy={setFilterBy} setNav={setNav} nav={nav} />
            {nav === 'table' && <TzevaAdomTable cityAlertsMap={cityAlertsMap} filterBy={filterBy} />}
            {/* {nav === 'map' && <TzevaAdomMap cityAlertsMap={cityAlertsMap} onFilterToday={onFilterToday} filterBy={filterBy} />} */}
            {nav === 'chart' && <TzevaAdomChart allTzevaAdom={allTzevaAdom} filterBy={filterBy} />}
        </section>
    )
}