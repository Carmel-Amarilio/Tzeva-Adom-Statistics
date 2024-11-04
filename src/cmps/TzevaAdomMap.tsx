import { useEffect, useRef, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { googleMapApiKey } from '../../keys'
import { Filter, TzevaAdom } from '../models/models'
import { Loader } from './Loader'
import { CityChart } from './CityChart'
import { utilService } from '../services/util.service'


interface prop {
    cityAlertsMap: { name: string, alertsAmounts: number }[]
    allTzevaAdom: TzevaAdom[]
    filterBy: Filter
    onFilterToday: () => void
}

declare global {
    interface Window {
        google: any;
    }
}

export function TzevaAdomMap({ cityAlertsMap, allTzevaAdom, filterBy, onFilterToday }: prop) {
    const [cityAlertsMapLoc, setCtyAlertsMapLoc] = useState(null)
    const [cityChartData, setCityChartData] = useState<{ cityName: string, data: { date: string, alerts: number }[] }>(null)
    const [threatMap, setThreatMap] = useState(null)

    const latestCallId = useRef(0)

    useEffect(() => {
        onFilterToday()
    }, [])

    useEffect(() => {
        addLoc()
    }, [cityAlertsMap])

    const defaultProps = {
        center: {
            lat: 31.562989,
            lng: 34.908015
        },
        zoom: 8
    }

    async function addLoc() {
        const callId = Date.now()
        latestCallId.current = callId

        setCtyAlertsMapLoc(null)

        try {
            const data = await Promise.all(
                cityAlertsMap.map(async (city) => {
                    if (latestCallId.current !== callId) return null;

                    const loc = await searchLoc(city.name);
                    if (latestCallId.current !== callId) return null;

                    return loc ? { ...city, ...loc } : null;
                })
            )

            if (latestCallId.current === callId) {
                setCtyAlertsMapLoc(data.filter(Boolean));
            }
        } catch (error) {
            console.error("Error in addLoc:", error);
        }
    }


    async function searchLoc(name: string): Promise<{ lat: number; lng: number } | null> {
        if (!window.google || !window.google.maps) {
            console.error("Google Maps API not loaded");
            return null;
        }

        const geocoder = new window.google.maps.Geocoder();

        return new Promise((resolve, reject) => {
            geocoder.geocode({ address: name }, (results, status) => {
                if (status === 'OK' && results && results.length > 0) {
                    const location = results[0].geometry.location;
                    resolve({ lat: location.lat(), lng: location.lng() });
                } else {
                    console.error(`Geocode failed for ${name}: ${status}`)
                    resolve(null)
                }
            });
        });
    }

    function onCity(cityName: string) {
        const dataMap = {}
        const threatMapTep = {}

        allTzevaAdom.forEach(alert => {
            alert.alerts.forEach(({ cities, time, threat }) => {
                if (cities.includes(cityName)) {
                    const date = utilService.getFormDate(time * 1000)
                    if (dataMap[date]) dataMap[date]++
                    else dataMap[date] = 1

                    if (threatMapTep[threat]) threatMapTep[threat]++
                    else threatMapTep[threat] = 1
                }
            })
        })

        setThreatMap(threatMapTep)

        let data = []
        for (const key in dataMap) {
            data.push({
                date: key,
                alerts: dataMap[key]
            })
        }
        data = data.filter(({ alerts }) => alerts >= filterBy.alertsAmounts)
        setCityChartData({ cityName, data })

    }

    function closeModal() {
        setCityChartData(null)
    }


    const AnyReactComponent = ({ alertsAmounts, name }) =>
        <div className='alerts-amounts'>
            <p onClick={() => onCity(name)}>{alertsAmounts}</p>
        </div>


    return (
        <section className='tzeva-adom-map'>
            <GoogleMapReact
                bootstrapURLKeys={{ key: googleMapApiKey }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                {cityAlertsMapLoc &&
                    cityAlertsMapLoc.map(({ name, alertsAmounts, lat, lng }) =>
                        <AnyReactComponent
                            key={name}
                            lat={lat}
                            lng={lng}
                            alertsAmounts={alertsAmounts}
                            name={name}
                        />)
                }

            </GoogleMapReact>
            {!cityAlertsMapLoc && <Loader />}
            {cityChartData && <CityChart cityChartData={cityChartData} closeModal={closeModal} threatMap={threatMap} />}

            <button onClick={onFilterToday} className='last-day-btn'>Last 24h</button>
        </section>
    )
}