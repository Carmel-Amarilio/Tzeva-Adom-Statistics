import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { t } from "i18next";

import { tzofarService } from "../services/tzofar.service"
import { CityAlert, CityData, Filter, TzevaAdom } from "../models/models"

import { CityChart } from "./CityChart"

import areasData from '../../src/data/areasData.json';
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

    const lang = useTranslation().i18n.language



    useEffect(() => {
        setCityAlertsMapDis(cityAlertsMap)
    }, [cityAlertsMap])

    useEffect(() => {
        if (cityChartData) onCity(cityChartData.cityName)
    }, [filterBy, isByMinute])

    function sortBy(by: 'name' | 'alertsAmounts' | 'area', order: 'asc' | 'desc' = 'asc') {
        const cityAlertsMapSort = [...cityAlertsMap].sort((a, b) => {
            if (a[by] < b[by]) return order === 'asc' ? -1 : 1;
            if (a[by] > b[by]) return order === 'asc' ? 1 : -1;
            return 0;
        })
        setCityAlertsMapDis(cityAlertsMapSort)
    }

    function onCity(cityName: string) {
        const { threatMapTep, cityData } = tzofarService.getByCityName(cityName, filterBy, isByMinute)
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
                                <div className="flex column gap5 align-center justify-center" onClick={() => sortBy('name')}>
                                    <p>{t('City')}</p>
                                    <p>{t('Total')}: {cityAlertsMapDis.length}</p>
                                </div>
                            </th>
                            <th>
                                <div className="flex column gap5 align-center justify-center" onClick={() => sortBy('alertsAmounts', 'desc')}>
                                    <p>{t('Alerts')}</p>
                                    <p>{t('Total')}: {cityAlertsMapDis.reduce((sum, { alertsAmounts }) => sum + alertsAmounts, 0)}</p>
                                </div>
                            </th>
                            <th>
                                <div className="flex column gap5 align-center justify-center" onClick={() => sortBy('area')}>
                                    <p>{t('Area')}</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cityAlertsMapDis.map(({ name, alertsAmounts, area }) => <tr key={name} onClick={() => onCity(name)}>
                            <td>{citiesData[name] ? citiesData[name][lang] : name}</td>
                            <td>{alertsAmounts}</td>
                            <td>{area === 35 ? name : areasData[area][lang]}</td>
                        </tr>)}
                    </tbody>
                </table>
            </article>

            {cityChartData && <CityChart cityChartData={cityChartData} closeModal={closeModal} threatMap={threatMap} handleChangeIsByMinute={handleChangeIsByMinute} isByMinute={isByMinute} />}

        </section>
    )
}