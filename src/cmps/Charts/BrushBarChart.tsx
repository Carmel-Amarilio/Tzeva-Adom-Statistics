import React, { PureComponent } from 'react';
import {
    BarChart,
    Bar,
    Brush,
    ReferenceLine,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';



interface props {
    data: { date: string, alerts: number }[]
}
export function BrushBarChart({ data }: props) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
            >
                <CartesianGrid strokeDasharray="10 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                <ReferenceLine y={0} stroke="#000" />
                <Brush dataKey="date" height={30} stroke="#A52A2A" />
                <Bar dataKey="alerts" fill="#A52A2A" />
                {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
            </BarChart>
        </ResponsiveContainer>
    )
}