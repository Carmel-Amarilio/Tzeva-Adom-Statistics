import { useEffect, useState } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { useTranslation } from 'react-i18next'

import './services/i18n.service';

import { store } from './store/store'

import { TzevaAdomIndex } from './views/TzevaAdomIndex'
import { Home } from './views/Home'

import './assets/styles/main.scss'


export function App(): React.ReactElement {
  const { i18n } = useTranslation();
  const langsRTL = ['he']

  return (
    <Provider store={store}>
      <Router>
        <section className={`app ${langsRTL.includes(i18n.language) ? 'rtl' : ''}`}>
          <main>
            <Routes>
              <Route element={<TzevaAdomIndex />} path="/*" />
              <Route element={<Home />} path="/home" />
            </Routes>
          </main>
        </section>
      </Router >
    </Provider>
  )
}

export default App
