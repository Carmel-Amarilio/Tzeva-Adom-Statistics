
import { useEffect, useState } from 'react';
import { Filter, TzevaAdom } from '../models/models';
import { utilService } from '../services/util.service';
import { BrushBarChart } from './Charts/BrushBarChart';

interface props {
    allTzevaAdom: TzevaAdom[]
    filterBy: Filter
}

export function TzevaAdomChart({ allTzevaAdom, filterBy }: props) {
    const [formTzevaAdom, setFormTzevaAdom] = useState<{ date: string, alerts: number }[]>(formData())

    useEffect(() => {
        setFormTzevaAdom(formData())
    }, [allTzevaAdom])

    function formData(): { date: string, alerts: number }[] {
        const dataMap = {}
        const { startDate, endDate } = filterBy

        utilService.getDateRange(startDate, endDate).forEach(date => {
            if (!dataMap[date]) dataMap[date] = 0
        })

        allTzevaAdom.forEach(alert => {
            if (alert.alerts[0]) {
                const date = utilService.getFormDate(alert.alerts[0].time * 1000)
                if (dataMap[date]) dataMap[date]++
                else dataMap[date] = 1
            }
        })

        const data = []
        for (const key in dataMap) {
            data.push({
                date: key,
                alerts: dataMap[key]
            })
        }

        return data.filter(({ alerts }) => alerts >= filterBy.alertsAmounts)
    }

    function maxAlertDay(data: { date: string, alerts: number }[]): string {
        let max = { alerts: 0, date: '' }
        data.forEach(({ date, alerts }) => { if (alerts > max.alerts) max = { date, alerts } })
        return `${max.alerts} at ${max.date}`
    }

    function checkAveBreak() {
        let aveBreak = 0

        allTzevaAdom.forEach((alert, i) => {
            if (!allTzevaAdom[i + 1]) return
            aveBreak += allTzevaAdom[i + 1].alerts[0].time - alert.alerts[0].time

        })
        aveBreak /= allTzevaAdom.length
        console.log(aveBreak);


        const diffMs = Math.abs(aveBreak * 1000);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        return (`${diffDays ? `${diffDays} days ,` : ''} ${diffHours ? `${diffHours} hours ,` : ''} ${diffMinutes ? `${diffMinutes} minutes and` : ''} ${diffSeconds} seconds`)
        return 1
    }


    return (
        <section className='tzeva-adom-chart flex column gap10'>
            <BrushBarChart data={formTzevaAdom} />

            <article className='statistical'>
                <h3>Total alerts: {formTzevaAdom.reduce((sum, { alerts }) => sum + alerts, 0)} </h3>
                <h3>Total days: {formTzevaAdom.length} </h3>
                <h3>Total days without alerts: {formTzevaAdom.filter(({ alerts }) => alerts <= 0).length} </h3>
                <h3>Max day: {maxAlertDay(formTzevaAdom)} </h3>
                <h3>Average break: {checkAveBreak()} </h3>
            </article>
        </section>
    )
}