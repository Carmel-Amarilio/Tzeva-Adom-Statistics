import { useEffect, useState } from "react"

import { tzofarService } from "../services/tzofar.service"
import { CityData, Filter, TzevaAdom } from "../models/models"

import { CityChart } from "./CityChart"

interface prop {
    cityAlertsMap: { name: string, alertsAmounts: number }[]
    filterBy: Filter
}

export function TzevaAdomTable({ cityAlertsMap, filterBy }: prop) {
    const [cityAlertsMapDis, setCityAlertsMapDis] = useState<{ name: string, alertsAmounts: number }[]>(cityAlertsMap)
    const [cityChartData, setCityChartData] = useState<{ cityName: string, cityData: CityData[] }>(null)
    const [threatMap, setThreatMap] = useState(null)


    useEffect(() => {
        setCityAlertsMapDis(cityAlertsMap)
    }, [cityAlertsMap])

    useEffect(() => {
        if (cityChartData) onCity(cityChartData.cityName)
    }, [filterBy])

    function sortBy(by: 'name' | 'alertsAmounts', order: 'asc' | 'desc' = 'asc') {
        const cityAlertsMapSort = [...cityAlertsMap].sort((a, b) => {
            if (a[by] < b[by]) return order === 'asc' ? -1 : 1;
            if (a[by] > b[by]) return order === 'asc' ? 1 : -1;
            return 0;
        })
        setCityAlertsMapDis(cityAlertsMapSort)
    }

    function onCity(cityName: string) {
        const { threatMapTep, cityData } = tzofarService.getByCityName(cityName, filterBy)
        setThreatMap(threatMapTep)
        setCityChartData({ cityName, cityData })
    }

    function closeModal() {
        setCityChartData(null)
    }


    return (
        <section className="tzeva-adom-table flex column gap20">
            <article className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div className="flex column gap5 align-center justify-center" onClick={() => sortBy('name')}>
                                    <p>City</p>
                                    <p>Total: {cityAlertsMapDis.length}</p>
                                </div>
                            </th>
                            <th>
                                <div className="flex column gap5 align-center justify-center" onClick={() => sortBy('alertsAmounts', 'desc')}>
                                    <p>alerts</p>
                                    <p>Total: {cityAlertsMapDis.reduce((sum, { alertsAmounts }) => sum + alertsAmounts, 0)}</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cityAlertsMapDis.map(({ name, alertsAmounts }) => <tr key={name} onClick={() => onCity(name)}>
                            <td>{name}</td>
                            <td>{alertsAmounts}</td>
                        </tr>)}
                    </tbody>
                </table>
            </article>

            {cityChartData && <CityChart cityChartData={cityChartData} closeModal={closeModal} threatMap={threatMap} />}

        </section>
    )
}