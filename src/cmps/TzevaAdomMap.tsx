import { useEffect, useRef, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { useTranslation } from 'react-i18next'

import { googleMapApiKey } from '../../keys'
import { CityAlert, CityData, Filter, ThreatMap, TzevaAdom } from '../models/models'
import { TzevaAdomService } from '../services/TzevaAdom.service'
import { utilService } from '../services/util.service'

import { Loader } from './Loader'
import { CityChart } from './CityChart'

import citiesData from '../../src/data/citiesData.json';
import { t } from 'i18next'


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
        const { threatMapTep, cityData } = TzevaAdomService.getByCityName(cityName, filterBy, isByMinute)
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

    function getPolygonColor(alertsAmounts: number) {
        const diffInDays = (new Date(filterBy.endDate).getTime() - new Date(filterBy.startDate).getTime()) / (1000 * 60 * 60 * 24)
        if (alertsAmounts < diffInDays / 16) return 'green';
        if (alertsAmounts > diffInDays / 16 && alertsAmounts <= diffInDays / 12) return 'yellow';
        if (alertsAmounts > diffInDays / 12 && alertsAmounts <= diffInDays / 8) return 'orange';
        return 'red';
    }

    // const AnyReactComponent = ({ alertsAmounts, name }) =>
    //     <div className='alerts-amounts' onClick={() => onCity(name)} title={citiesData[name] ? citiesData[name][lang] : name}>
    //         <p>{alertsAmounts}</p>
    //     </div>

    const yesterday = utilService.getFormattedDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))
    return (
        <section className='tzeva-adom-map'>
            <GoogleMapReact
                key={`${cityAlertsMap.length}`}
                bootstrapURLKeys={{
                    key: googleMapApiKey,
                    language: lang,
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => {
                    cityAlertsMap.forEach(({ name, areasPolygon, alertsAmounts }) => {
                        const polygonColor = getPolygonColor(alertsAmounts);
                        if (areasPolygon) {
                            const polygon = new maps.Polygon({
                                paths: areasPolygon.map(([lat, lng]) => ({ lat, lng })),
                                strokeColor: polygonColor,
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: polygonColor,
                                fillOpacity: 0.35,
                            });

                            polygon.setMap(map);
                            polygon.addListener('click', () => onCity(name));
                        }
                    });
                }}
            >
                {/* {cityAlertsMap && cityAlertsMap.map(({ name, alertsAmounts, lat, lng }) => {
                    if (lat && lng) {
                        return <AnyReactComponent
                            key={name}
                            lat={lat}
                            lng={lng}
                            alertsAmounts={alertsAmounts}
                            name={name}
                        />
                    }
                })} */}

            </GoogleMapReact>
            <article className='color-spectrum-sec flex justify-center align-center gap10 direction-sec'>
                <h4>{t('Alerts every')}:</h4>
                <div className='color-spectrum flex justify-center align-center space-between'>
                    <p>16 {t('days')}</p>
                    <p>12 {t('days')}</p>
                    <p>8 {t('days')}</p>
                    <p>4 {t('days')}</p>
                    <p>{t('every day')}</p>
                </div>
            </article>

            {!cityAlertsMap && <Loader />}
            {cityChartData && <CityChart cityChartData={cityChartData} closeModal={closeModal} threatMap={threatMap} handleChangeIsByMinute={handleChangeIsByMinute} isByMinute={isByMinute} />}

            <button onClick={onFilterToday} className={`last-day-btn`}>
                {yesterday === filterBy.startDate ? t('Since the oct 7') : t('Last 24h')}
            </button>
        </section>
    )
}