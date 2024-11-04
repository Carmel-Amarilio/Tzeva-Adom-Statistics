
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
export interface Filter {
    cityName: string
    alertsAmounts: number
    startDate: string
    endDate: string
    threatSelect: string[]
}