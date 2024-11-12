import { useState } from "react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

import { CityData, ThreatMap } from "../models/models";
import { utilService } from "../services/util.service";

import { BrushBarChart } from "./Charts/BrushBarChart";
import Switch from '@mui/material/Switch';

import citiesData from '../../src/data/citiesData.json';


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

    const lang = useTranslation().i18n.language

    function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = ev.target;
        setIsAllDays(checked)
    }

    function maxAlertDay(data: { date: string, alerts: number }[]): string {
        let max = { alerts: 0, date: '' }
        data.forEach(({ date, alerts }) => { if (alerts > max.alerts) max = { date, alerts } })
        return `${max.alerts} ${t('at')} ${max.date}`
    }

    return (
        <article className="city-chart flex column gap10">
            <button className="exit-btn" onClick={closeModal}> X </button>

            <h1 className="justify-end direction-sec">{t('Settlement')}: {citiesData[cityName] ? citiesData[cityName][lang] : cityName}</h1>



            <article className='flex align-center space-between direction-sec'>
                <div className='flex align-center'>
                    <label htmlFor="switch">{t('Filter days without alerts')}</label>
                    <Switch id="switch" onChange={handleChange} />
                </div>
                <div className='flex align-center '>
                    <label htmlFor="switch">{t('Date/Hours')}</label>
                    <Switch id="switch" onChange={handleChangeIsByMinute} />
                </div>
            </article>
            <BrushBarChart data={!isAllDays ? cityData : cityData.filter(({ alerts }) => alerts > 0)} />



            <div className="statistical">
                <h3>{t('Total alerts')}: {cityData.reduce((sum, { alerts }) => sum + alerts, 0)} </h3>
                {!isByMinute ? <h3>{t('Total days')}: {cityData.length} </h3> :
                    <h3>{t('longest period without alerts')}: {utilService.findLongestNoAlertPeriod(cityData)}</h3>}
                <h3>{t('Most alerts')}: {maxAlertDay(cityData)} </h3>
                {threatMap[0] && <h3>{t('Missiles')}: {threatMap[0]} </h3>}
                {threatMap[5] && <h3>{t('Aircraft intrusion')}: {threatMap[5]} </h3>}
                {threatMap[2] && <h3>{t('Terrorist infiltration')}: {threatMap[2]} </h3>}
                {threatMap[3] && <h3>{t('Earthquake')}: {threatMap[3]} </h3>}
            </div>
        </article>
    )
}