
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


    return (
        <section className='tzeva-adom-chart flex column gap10'>
            <BrushBarChart data={formTzevaAdom} />

            <article className='statistical'>
                <h3>Total alerts: {formTzevaAdom.reduce((sum, { alerts }) => sum + alerts, 0)} </h3>
                <h3>Total days: {formTzevaAdom.length} </h3>
                <h3>Max day: {maxAlertDay(formTzevaAdom)} </h3>

            </article>
        </section>
    )
}