import { useEffect, useRef, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { useTranslation } from 'react-i18next'

import { googleMapApiKey } from '../../keys'
import { CityAlert, CityData, Filter, ThreatMap, TzevaAdom } from '../models/models'
import { tzofarService } from '../services/tzofar.service'

import { Loader } from './Loader'
import { CityChart } from './CityChart'

import citiesData from '../../src/data/citiesData.json';


interface prop {
    cityAlertsMap: CityAlert[]
    onFilterToday: () => void
    filterBy: Filter
}

declare global {
    interface Window {
        google: any;
    }
}

export function TzevaAdomMap({ cityAlertsMap, onFilterToday, filterBy }: prop) {
    const [cityChartData, setCityChartData] = useState<{ cityName: string, cityData: CityData[] }>(null)
    const [threatMap, setThreatMap] = useState<ThreatMap>(null)
    const [isByMinute, setIsByMinute] = useState<boolean>(false)

    const lang = useTranslation().i18n.language
    console.log(lang);



    useEffect(() => {
        if (cityChartData) onCity(cityChartData.cityName)
    }, [filterBy, isByMinute])


    const defaultProps = {
        center: {
            lat: 31.562989,
            lng: 34.908015
        },
        zoom: 8
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
        <div className='alerts-amounts' onClick={() => onCity(name)} title={citiesData[name] ? citiesData[name][lang] : name}>
            <p>{alertsAmounts}</p>
        </div>


    return (
        <section className='tzeva-adom-map'>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: googleMapApiKey,
                    language: { lang },
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                {cityAlertsMap && cityAlertsMap.map(({ name, alertsAmounts, lat, lng }) => {
                    if (lat && lng) {
                        return <AnyReactComponent
                            key={name}
                            lat={lat}
                            lng={lng}
                            alertsAmounts={alertsAmounts}
                            name={name}
                        />
                    }
                })}

            </GoogleMapReact>
            {!cityAlertsMap && <Loader />}
            {cityChartData && <CityChart cityChartData={cityChartData} closeModal={closeModal} threatMap={threatMap} handleChangeIsByMinute={handleChangeIsByMinute} isByMinute={isByMinute} />}

            <button onClick={onFilterToday} className={`last-day-btn`}>Last 24h</button>
        </section>
    )
}