import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { Buffer } from 'buffer'
import 'bootstrap/js/dist/collapse'
import store from './state'

import Web3Provider from './components/Web3Provider'
import { LanguageProvider } from './i18n'
import { BlockNumberProvider } from './lib/hooks/useBlockNumber'


import { FeatureFlagsProvider } from './featureFlags'

import { MulticallUpdater } from './lib/state/multicall'
import ApplicationUpdater from './state/application/updater'
import TransactionUpdater from './state/transactions/updater'
import LogsUpdater from './state/logs/updater'

import App from './pages/App'

import './custom.scss'
import './index.css'

window.Buffer = window.Buffer || Buffer;

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <LogsUpdater />
    </>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <FeatureFlagsProvider>
        <HashRouter>
          <LanguageProvider>
            <Web3Provider>
              <BlockNumberProvider>
                <Updaters />
                <App />
              </BlockNumberProvider>
            </Web3Provider>
          </LanguageProvider>
        </HashRouter>
      </FeatureFlagsProvider>
    </Provider>
  </React.StrictMode>
);
