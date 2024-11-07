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
    const [isByMinute, setIsByMinute] = useState<boolean>(false)

    useEffect(() => {
        if (cityChartData) onCity(cityChartData.cityName)
    }, [filterBy, isByMinute])

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
        const callId = Date.now();
        latestCallId.current = callId;
        setCtyAlertsMapLoc(null);

        const batchSize = 100; // Process 10 cities at a time
        let data: Array<any> = [];


        for (let i = 0; i < cityAlertsMap.length; i += batchSize) {
            if (latestCallId.current !== callId) return;

            const batch = cityAlertsMap.slice(i, i + batchSize);

            try {
                const batchData = await Promise.all(
                    batch.map(async (city) => {
                        if (latestCallId.current !== callId) return null;

                        const loc = await searchLoc(city.name);
                        return loc ? { ...city, ...loc } : null;
                    })
                );

                // Filter out null entries from this batch
                data = [...data, ...batchData.filter(Boolean)];

                // Only update if this is still the latest call
                if (latestCallId.current === callId) {
                    setCtyAlertsMapLoc(data);
                }
            } catch (error) {
                console.error("Error in addLoc:", error);
                // Retry the current batch after a short delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                i -= batchSize; // Re-run the current batch
            }
        }

        // Final check to ensure all data is set at the end
        if (latestCallId.current === callId) {
            setCtyAlertsMapLoc(data);
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
        const { threatMapTep, cityData } = tzofarService.getByCityName(cityName, filterBy, isByMinute)
        setThreatMap(threatMapTep)
        setCityChartData({ cityName, cityData })
    }

    function handleChangeIsByMinute(ev: React.ChangeEvent<HTMLInputElement>) {
        setIsByMinute(ev.target.checked)
    }

    function closeModal() {
        setCityChartData(null)
        setIsByMinute(false)
    }


    const AnyReactComponent = ({ alertsAmounts, name }) =>
        <div className='alerts-amounts' onClick={() => onCity(name)} title={name}>
            <p>{alertsAmounts}</p>
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
            {cityChartData && <CityChart cityChartData={cityChartData} closeModal={closeModal} threatMap={threatMap} handleChangeIsByMinute={handleChangeIsByMinute} isByMinute={isByMinute} />}

            <button onClick={onFilterToday} className={`last-day-btn`}>Last 24h</button>
        </section>
    )
}