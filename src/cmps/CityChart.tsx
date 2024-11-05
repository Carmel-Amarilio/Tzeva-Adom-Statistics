import { useState } from "react";
import { CityData, ThreatMap } from "../models/models";
import { BrushBarChart } from "./Charts/BrushBarChart";
import Switch from '@mui/material/Switch';


interface prop {
    cityChartData: { cityName: string, cityData: CityData[] }
    closeModal: () => void
    threatMap: ThreatMap
}

export function CityChart({ cityChartData, closeModal, threatMap }: prop) {
    const { cityName, cityData } = cityChartData
    const [isAllDays, setIsAllDays] = useState<boolean>(false)

    function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = ev.target;
        setIsAllDays(checked)
    }

    function maxAlertDay(data: { date: string, alerts: number }[]): string {
        let max = { alerts: 0, date: '' }
        data.forEach(({ date, alerts }) => { if (alerts > max.alerts) max = { date, alerts } })
        return `${max.alerts} at ${max.date}`
    }

    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    return (
        <article className="city-chart flex column gap10">
            <button className="exit-btn" onClick={closeModal}> X </button>

            <h1 className="justify-end">ישוב: {cityName}</h1>

            <div>
                <label htmlFor="">Filter days without alerts</label>
                <Switch {...label} name="switch" onChange={handleChange} />
            </div>

            <BrushBarChart data={!isAllDays ? cityData : cityData.filter(({ alerts }) => alerts > 0)} />

            <div className="statistical">
                <h4>Total alerts: {cityData.reduce((sum, { alerts }) => sum + alerts, 0)} </h4>
                <h4>Total days: {cityData.length} </h4>
                <h4>Max day: {maxAlertDay(cityData)} </h4>
                {threatMap[0] && <h4>Missiles: {threatMap[0]} </h4>}
                {threatMap[5] && <h4>Aircraft intrusion: {threatMap[5]} </h4>}
                {threatMap[2] && <h4>Terrorist infiltration: {threatMap[2]} </h4>}
                {threatMap[3] && <h4>Earthquake: {threatMap[3]} </h4>}
            </div>
        </article>
    )
}