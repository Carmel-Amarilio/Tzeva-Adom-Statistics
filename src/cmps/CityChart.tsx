import { useState } from "react";

import { CityData, ThreatMap } from "../models/models";

import { BrushBarChart } from "./Charts/BrushBarChart";
import Switch from '@mui/material/Switch';
import { utilService } from "../services/util.service";


interface prop {
    cityChartData: { cityName: string, cityData: CityData[] }
    closeModal: () => void
    threatMap: ThreatMap
    handleChangeIsByMinute,
    isByMinute: boolean
}

export function CityChart({ cityChartData, closeModal, threatMap, handleChangeIsByMinute, isByMinute }: prop) {
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

    console.log(cityData);
    return (
        <article className="city-chart flex column gap10">
            <button className="exit-btn" onClick={closeModal}> X </button>

            <h1 className="justify-end">ישוב: {cityName}</h1>



            <article className='flex align-center space-between'>
                <div className='flex align-center'>
                    <label htmlFor="switch">Filter days without alerts</label>
                    <Switch id="switch" onChange={handleChange} />
                </div>
                <div className='flex align-center '>
                    <label htmlFor="switch">Date/Hours</label>
                    <Switch id="switch" onChange={handleChangeIsByMinute} />
                </div>
            </article>
            <BrushBarChart data={!isAllDays ? cityData : cityData.filter(({ alerts }) => alerts > 0)} />



            <div className="statistical">
                <h3>Total alerts: {cityData.reduce((sum, { alerts }) => sum + alerts, 0)} </h3>
                {!isByMinute ? <h3>Total days: {cityData.length} </h3> :
                    <h3>longest period without alerts: {utilService.findLongestNoAlertPeriod(cityData)}</h3>}
                <h3>Most alerts: {maxAlertDay(cityData)} </h3>
                {threatMap[0] && <h3>Missiles: {threatMap[0]} </h3>}
                {threatMap[5] && <h3>Aircraft intrusion: {threatMap[5]} </h3>}
                {threatMap[2] && <h3>Terrorist infiltration: {threatMap[2]} </h3>}
                {threatMap[3] && <h3>Earthquake: {threatMap[3]} </h3>}
            </div>
        </article>
    )
}