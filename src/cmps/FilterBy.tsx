import { useState } from "react";
import { Filter } from "../models/models";

import { utilService } from "../services/util.service";
import i18n from "../services/i18n.service";
import { t } from "i18next";

import landmarksData from '../../src/data/landmarksData.json';
import { useTranslation } from "react-i18next";

interface prop {
    filterBy: Filter
    setFilter: (key: string, val: string | number | string[]) => void
    setNav: (string: string) => void
}

export function FilterBy({ filterBy, setFilter, setNav }: prop) {
    const { cityName, alertsAmounts, startDate, endDate, threatSelect, areaSelect } = filterBy
    const [isSideBar, setIsSideBar] = useState<boolean>(false)

    const lang = useTranslation().i18n.language

    function handleChange(ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name } = ev.target
        const val: string | number | string[] = 'selectedOptions' in ev.target ? Array.from(ev.target.selectedOptions, option => option.value) : ev.target.value
        setFilter(name, val)
    }

    function changeLanguage(lng: string) {
        i18n.changeLanguage(lng)
    }


    return (
        <section className={`filter-by flex column gap30 ${isSideBar ? 'show' : ''}`}>
            <button onClick={() => setIsSideBar(!isSideBar)} className="close-btn"><i className={`fa-solid fa-angle-${isSideBar ? 'left' : 'right'}`}></i></button>
            <article className="nav-sec flex justify-center column gap10">
                <button onClick={() => { setNav('table'); setIsSideBar(false) }}>{t('Table')}</button>
                <button onClick={() => { setNav('map'); setIsSideBar(false) }}>{t('Map')}</button>
                <button onClick={() => { setNav('chart'); setIsSideBar(false) }}>{t('Chart')}</button>
                <div className="lang-sec flex gap10">
                    <button onClick={() => changeLanguage('en')}>English</button>
                    <button onClick={() => changeLanguage('he')}>עברית</button>
                </div>
            </article>

            <article className="filter-sec flex column justify-center  gap20">
                <div className="flex column gap5">
                    <label className="slider-label">{t('City/Area')}:</label>
                    <input type="text" name='cityName' className="input-field" value={cityName} onChange={handleChange} placeholder={t("Search city")} />
                </div>

                <div className="flex column gap5">
                    <label className="slider-label">{t('Minimum alerts')}:</label>
                    <div className="flex align-center gap5">
                        <input type="number" min={0} max={600} value={alertsAmounts} name="alertsAmounts" onChange={handleChange} className="num-input input-field" />
                        <input type="range" min={0} max={600} value={alertsAmounts} name="alertsAmounts" onChange={handleChange} className="slider-input" />
                    </div>
                </div>

                <div className="flex column gap10">
                    <label>{t("Dates")}:</label>
                    <div className="flex align-center gap10">
                        <label htmlFor="startDate">{t('from')}:</label>
                        <input type="date" id="startDate" name='startDate' min="2023-10-07" max={utilService.getFormattedDate()} value={startDate} className="date-input" onChange={handleChange} />
                        <label htmlFor="endDate">{t('to')}:</label>
                        <input type="date" id="endDate" name='endDate' min="2023-10-07" max={utilService.getFormattedDate()} value={endDate} className="date-input" onChange={handleChange} />
                    </div>
                </div>
                <article className="flex gap5">

                    <div className="flex column gap5">
                        <label htmlFor="multiSelect-area">{t('Select area')}:</label>
                        <select id="multiSelect-area" name="areaSelect" multiple value={areaSelect} onChange={handleChange} className="multi-select area">
                            {Object.keys(landmarksData).map((key) =>
                                <option key={key} value={key}>
                                    {landmarksData[key][lang]}
                                </option>
                            )}
                        </select>
                    </div>

                    <div className="flex column gap5">
                        <label htmlFor="multiSelect-threats">{t('Select threats')}:</label>
                        <select id="multiSelect-threats" name="threatSelect" multiple value={threatSelect} onChange={handleChange} className="multi-select threat">
                            <option value="0">{t('Missiles')}</option>
                            <option value="5">{t('Aircraft intrusion')}</option>
                            <option value="2">{t('Terrorist infiltration')}</option>
                            <option value="3">{t('Earthquake')}</option>
                        </select>
                    </div>
                </article>
            </article>

        </section>
    )
}