import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { t } from "i18next";

import { TzevaAdomService } from "../services/TzevaAdom.service"
import { CityAlert, CityData, Filter, TzevaAdom } from "../models/models"

import { CityChart } from "./CityChart"

import landmarksData from '../../src/data/landmarksData.json';
import citiesData from '../../src/data/citiesData.json';

interface prop {
    cityAlertsMap: CityAlert[]
    filterBy: Filter
}

export function TzevaAdomTable({ cityAlertsMap, filterBy }: prop) {
    const [cityAlertsMapDis, setCityAlertsMapDis] = useState<CityAlert[]>(cityAlertsMap)
    const [cityChartData, setCityChartData] = useState<{ cityName: string, cityData: CityData[] }>(null)
    const [threatMap, setThreatMap] = useState(null)
    const [isByMinute, setIsByMinute] = useState<boolean>(false)
    const [sortBy, setSortBy] = useState<string>('')

    const lang = useTranslation().i18n.language



    useEffect(() => {
        setCityAlertsMapDis(cityAlertsMap)
    }, [cityAlertsMap])

    useEffect(() => {
        if (cityChartData) onCity(cityChartData.cityName)
    }, [filterBy, isByMinute])

    function onSortBy(by: 'name' | 'alertsAmounts' | 'area', order: 'asc' | 'desc' = 'asc') {
        const cityAlertsMapSort = [...cityAlertsMap].sort((a, b) => {
            if (a[by] < b[by]) return order === 'asc' ? -1 : 1;
            if (a[by] > b[by]) return order === 'asc' ? 1 : -1;
            return 0;
        })
        setSortBy(by)
        setCityAlertsMapDis(cityAlertsMapSort)
    }

    function onCity(cityName: string) {
        const { threatMapTep, cityData } = TzevaAdomService.getByCityName(cityName, filterBy, isByMinute)
        setThreatMap(threatMapTep)
        setCityChartData({ cityName, cityData })
    }

    function handleChangeIsByMinute(ev: React.ChangeEvent<HTMLInputElement>) {
        setIsByMinute(ev.target.checked)
    }

    function closeModal() {
        setCityChartData(null)
        setIsByMinute(false)
    }


    return (
        <section className="tzeva-adom-table flex column gap20">
            <article className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div className="flex gap5 align-center justify-center" onClick={() => onSortBy('name')}>
                                    <div className="flex column gap5 align-center justify-center">
                                        <p>{t('City')}</p>
                                        <p>{t('Total')}: {cityAlertsMapDis.length}</p>
                                    </div>
                                    <i className={`fa-solid fa-angle-${sortBy === 'name' ? 'up' : 'down'}`}></i>
                                </div>
                            </th>
                            <th>
                                <div className="flex gap5 align-center justify-center" onClick={() => onSortBy('alertsAmounts', 'desc')}>

                                    <div className="flex column gap5 align-center justify-center">
                                        <p>{t('Alerts')}</p>
                                        <p>{t('Total')}: {cityAlertsMapDis.reduce((sum, { alertsAmounts }) => sum + alertsAmounts, 0)}</p>
                                    </div>
                                    <i className={`fa-solid fa-angle-${sortBy === 'alertsAmounts' ? 'up' : 'down'}`}></i>
                                </div>
                            </th>
                            <th>
                                <div className="flex gap5 align-center justify-center" onClick={() => onSortBy('area')}>
                                    <p>{t('Area')}</p>
                                    <i className={`fa-solid fa-angle-${sortBy === 'area' ? 'up' : 'down'}`}></i>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cityAlertsMapDis.map(({ name, alertsAmounts, area }) => <tr key={name} onClick={() => onCity(name)}>
                            <td>{citiesData[name] ? citiesData[name][lang] : name}</td>
                            <td>{alertsAmounts}</td>
                            <td>{area === 35 ? name : landmarksData[area][lang]}</td>
                        </tr>)}
                    </tbody>
                </table>
            </article>

            {cityChartData && <CityChart cityChartData={cityChartData} closeModal={closeModal} threatMap={threatMap} handleChangeIsByMinute={handleChangeIsByMinute} isByMinute={isByMinute} />}

        </section >
    )
}