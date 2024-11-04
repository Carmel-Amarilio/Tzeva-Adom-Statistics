import { useState } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import './assets/styles/main.scss'

import { TzevaAdomIndex } from './views/TzevaAdomIndex'
import { Home } from './views/Home'
import { store } from './store/store'

export function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <Router>
        <main>
          <Routes>
            <Route element={<TzevaAdomIndex />} path="/" />
            <Route element={<Home />} path="/home" />
          </Routes>
        </main>
      </Router >
    </Provider>
  )
}

export default App
