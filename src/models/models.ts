
export interface TzevaAdom {
    id: number;
    description: any;
    alerts: Alert[];

}
export interface Alert {
    time: number
    cities: string[]
    threat: number,
    isDrill: boolean
}
export interface CityAlert {
    name: string,
    alertsAmounts: number
    lng: number
    lat: number
    area: number
    areasPolygon: number[][]
}
export interface CityData {
    date: string;
    alerts: number;

}
export interface ThreatMap {
    0?: number
    2?: number
    3?: number
    5?: number

}
export interface Filter {
    cityName: string
    alertsAmounts: number
    startDate: string
    endDate: string
    threatSelect: string[]
    areaSelect: string[]
}