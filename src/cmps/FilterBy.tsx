import { useState } from "react";
import { Filter } from "../models/models";

import { utilService } from "../services/util.service";
import areasData from '../../src/data/areasData.json';

interface prop {
    filterBy: Filter
    setFilterBy: (filter: Filter) => void
    setNav: (string: string) => void
    nav: string
}

export function FilterBy({ filterBy, setFilterBy, setNav, nav }: prop) {
    const { cityName, alertsAmounts, startDate, endDate, threatSelect, areaSelect } = filterBy
    const [isSideBar, setIsSideBar] = useState<boolean>(true)

    function handleChange(ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        let val = ev.target.value
        const { name } = ev.target

        if ('selectedOptions' in ev.target) val = Array.from(ev.target.selectedOptions, option => option.value);
        setFilterBy(prev => ({ ...prev, [name]: val }));

    }


    return (
        <section className={`filter-by flex column gap30 ${isSideBar ? 'show' : ''}`}>
            <button onClick={() => setIsSideBar(!isSideBar)} className="close-btn"><i className={`fa-solid fa-angle-${isSideBar ? 'left' : 'right'}`}></i></button>
            <article className="nav-sec flex justify-center column gap10">
                <button onClick={() => { setNav('table'); setIsSideBar(false) }}>Table</button>
                <button onClick={() => { setNav('map'); setIsSideBar(false) }}>Map</button>
                <button onClick={() => { setNav('chart'); setIsSideBar(false) }}>Chart</button>
            </article>

            <article className="filter-sec flex column justify-center  gap20">
                {nav != 'chart' && <div className="flex column gap5">
                    <label className="slider-label" >Search city:</label>
                    <input type="text" name='cityName' className="input-field" value={cityName} onChange={handleChange} placeholder="Search city" />
                </div>}

                <div className="flex column gap5">
                    <label className="slider-label">Minimum alerts:</label>
                    <div className="flex align-center gap5">
                        <input type="number" min={0} max={600} value={alertsAmounts} name="alertsAmounts" onChange={handleChange} className="num-input input-field" />
                        <input type="range" min={0} max={600} value={alertsAmounts} name="alertsAmounts" onChange={handleChange} className="slider-input" />
                    </div>
                </div>

                <div className="flex column gap10">
                    <label>Dates:</label>
                    <div className="flex align-center gap10">
                        <label htmlFor="startDate">from:</label>
                        <input type="date" id="startDate" name='startDate' min="2023-10-07" max={utilService.getFormattedDate()} value={startDate} className="date-input" onChange={handleChange} />
                        <label htmlFor="endDate">to:</label>
                        <input type="date" id="endDate" name='endDate' min="2023-10-07" max={utilService.getFormattedDate()} value={endDate} className="date-input" onChange={handleChange} />
                    </div>
                </div>
                <article className="flex gap5">

                    <div className="flex column gap5">
                        <label htmlFor="multiSelect-area">Select threats:</label>
                        <select id="multiSelect-area" name="areaSelect" multiple value={areaSelect} onChange={handleChange} className="multi-select area">
                            {Object.keys(areasData).map((key) =>
                                <option key={key} value={key}>
                                    {areasData[key].he}
                                </option>
                            )}
                        </select>
                    </div>

                    <div className="flex column gap5">
                        <label htmlFor="multiSelect-threats">Select threats:</label>
                        <select id="multiSelect-threats" name="threatSelect" multiple value={threatSelect} onChange={handleChange} className="multi-select threat">
                            <option value="0">Missiles</option>
                            <option value="5">Aircraft intrusion</option>
                            <option value="2">Terrorist infiltration</option>
                            <option value="3">Earthquake</option>
                        </select>
                    </div>
                </article>
            </article>

        </section>
    )
}