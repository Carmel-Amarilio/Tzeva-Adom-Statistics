import { useEffect, useRef, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { useNavigate } from 'react-router-dom'

import { googleMapApiKey } from '../../keys'
import { CityData, Filter, ThreatMap, TzevaAdom } from '../models/models'
import { tzofarService } from '../services/tzofar.service'

import { Loader } from './Loader'
import { CityChart } from './CityChart'


interface prop {
    cityAlertsMap: { name: string, alertsAmounts: number }[]
    onFilterToday: () => void
    filterBy: Filter
}

declare global {
    interface Window {
        google: any;
    }
}

export function TzevaAdomMap({ cityAlertsMap, onFilterToday, filterBy }: prop) {
    const [cityAlertsMapLoc, setCtyAlertsMapLoc] = useState(null)
    const [cityChartData, setCityChartData] = useState<{ cityName: string, cityData: CityData[] }>(null)
    const [threatMap, setThreatMap] = useState<ThreatMap>(null)

    useEffect(() => {
        if (cityChartData) onCity(cityChartData.cityName)
    }, [filterBy])

    const latestCallId = useRef(0)

    // useEffect(() => {
    //     onFilterToday()
    // }, [])

    useEffect(() => {
        if (window.google && window.google.maps) {
            addLoc()
        }
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
            setTimeout(addLoc, 1000)
        }
    }

    async function searchLoc(name: string): Promise<{ lat: number; lng: number } | null> {
        if (!window.google || !window.google.maps) {
            console.error("Google Maps API not loaded");
            return null;
        }

        const geocoder = new window.google.maps.Geocoder();
        return new Promise<{ lat: number, lng: number } | null>((resolve) => {
            geocoder.geocode({ address: name }, (results, status) => {
                if (status === "OK" && results && results.length > 0) {
                    const { lat, lng } = results[0].geometry.location;
                    resolve({ lat: lat(), lng: lng() });
                } else {
                    console.error("Place not found or Geocode was unsuccessful");
                    resolve(null);
                }
            });
        });
    }

    function onCity(cityName: string) {
        const { threatMapTep, cityData } = tzofarService.getByCityName(cityName, filterBy)
        setThreatMap(threatMapTep)
        setCityChartData({ cityName, cityData })
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
                {cityAlertsMapLoc && cityAlertsMapLoc.map(({ name, alertsAmounts, lat, lng }) =>
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