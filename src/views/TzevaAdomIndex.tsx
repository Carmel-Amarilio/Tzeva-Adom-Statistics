import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { CityAlert, Filter, TzevaAdom } from "../models/models"
import { tzofarService } from "../services/tzofar.service"
import { utilService } from "../services/util.service"

import { FilterBy } from "../cmps/FilterBy"
import { TzevaAdomTable } from "../cmps/TzevaAdomTable"
import { TzevaAdomChart } from "../cmps/TzevaAdomChart"
import { TzevaAdomMap } from "../cmps/TzevaAdomMap"
import { Loader } from "../cmps/Loader"

export function TzevaAdomIndex(): React.ReactElement {
    const [allTzevaAdom, setAllTzevaAdom] = useState<TzevaAdom[]>(null)
    const [cityAlertsMap, setCityAlertsMap] = useState<CityAlert[]>(null)
    const [filterBy, setFilterBy] = useState<Filter>(tzofarService.getEmptyFilter())
    const [nav, setNav] = useState<string>('table')

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const navigate = useNavigate();

    useEffect(() => {
        setAllTzevaAdom(tzofarService.query(filterBy))
        setCityAlertsMap(tzofarService.getCitiesAlertsMap(filterBy))
    }, [filterBy])

    useEffect(() => {
        const labelNav = searchParams.get('nav') || 'table';
        const cityName = searchParams.get('cityName') || '';
        const alertsAmounts = +searchParams.get('alertsAmounts') || 0;
        const startDate = searchParams.get('startDate') || '2023-10-07';
        const endDate = searchParams.get('endDate') || utilService.getFormattedDate();
        let threatSelect = searchParams.get('threatSelect') ? searchParams.get('threatSelect').split(',') : ['0', '2', '3', '5']
        let areaSelect = searchParams.get('areaSelect') ? searchParams.get('areaSelect').split(',') : ['1', '2', '3', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '32', '34', '35']
        setNav(labelNav)
        setFilterBy({ cityName, alertsAmounts, startDate, endDate, threatSelect, areaSelect });
    }, []);

    useEffect(() => {
        const { cityName, alertsAmounts, startDate, endDate, threatSelect, areaSelect } = filterBy;
        navigate(`/?nav=${nav}${cityName ? `&cityName=${cityName}` : ''}${alertsAmounts ? `&alertsAmounts=${alertsAmounts}` : ''}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}${threatSelect ? `&threatSelect=${threatSelect}` : ''}${threatSelect ? `&areaSelect=${areaSelect}` : ''}`);
    }, [filterBy, nav])

    function setFilter(key: string, val: string | number | string[]) {
        setFilterBy(prev => ({ ...prev, [key]: val }));
    }

    function onFilterToday() {
        const endDate = utilService.getFormattedDate()
        const yesterday = utilService.getFormattedDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
        const startDate = yesterday === filterBy.startDate ? '2023-10-07' : yesterday
        setFilterBy(prev => ({ ...prev, endDate, startDate }))
    }

    if (!allTzevaAdom || !cityAlertsMap) return <Loader isBG={true} />
    return (
        <section className="tzeva-adom-index">
            <FilterBy filterBy={filterBy} setFilter={setFilter} setNav={setNav} />
            {nav === 'table' && <TzevaAdomTable cityAlertsMap={cityAlertsMap} filterBy={filterBy} />}
            {nav === 'map' && <TzevaAdomMap cityAlertsMap={cityAlertsMap} onFilterToday={onFilterToday} filterBy={filterBy} />}
            {nav === 'chart' && <TzevaAdomChart allTzevaAdom={allTzevaAdom} filterBy={filterBy} />}
        </section>
    )
}