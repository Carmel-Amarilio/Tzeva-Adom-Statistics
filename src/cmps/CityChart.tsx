import { BrushBarChart } from "./Charts/BrushBarChart";

function maxAlertDay(data: { date: string, alerts: number }[]): string {
    let max = { alerts: 0, date: '' }
    data.forEach(({ date, alerts }) => { if (alerts > max.alerts) max = { date, alerts } })
    return `${max.alerts} at ${max.date}`
}

export function CityChart({ cityChartData, closeModal, threatMap }) {
    return (
        <article className="city-chart flex column gap10">
            <button className="exit-btn" onClick={closeModal}> X </button>
            <h1 className="justify-end">ישוב: {cityChartData.cityName}</h1>
            <BrushBarChart data={cityChartData.data} />
            <div className="statistical">
                <h4>Total alerts: {cityChartData.data.reduce((sum, { alerts }) => sum + alerts, 0)} </h4>
                <h4>Total days: {cityChartData.data.length} </h4>
                <h4>Max day: {maxAlertDay(cityChartData.data)} </h4>
                {threatMap[0] && <h4>Missiles: {threatMap[0]} </h4>}
                {threatMap[5] && <h4>Aircraft intrusion: {threatMap[5]} </h4>}
                {threatMap[2] && <h4>Terrorist infiltration: {threatMap[2]} </h4>}
                {threatMap[3] && <h4>Earthquake: {threatMap[3]} </h4>}

            </div>
        </article>
    )
}