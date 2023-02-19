import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { networkConnection } from '../../connection'
import { getConnection, getConnectionName, getIsInjected, getIsMetaMask } from '../../connection/utils'
import { useCallback, useEffect, useState } from 'react'

import { updateConnectionError } from '../../state/connection/reducer'
import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { updateSelectedWallet } from '../../state/user/reducer'
import { useConnectedWallets } from '../../state/wallets/hooks'

import { useModalIsOpen, useToggleConnectWalletModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'

import Modal from '../Modal'
import { InjectedOption, InstallMetaMaskOption, MetaMaskOption } from './InjectedOption'
import { WalletConnectOption } from './WalletConnectOption'
import "./index.css"
import { useDarkModeManager, useUserTheme } from '../../state/user/hooks'
import { isMobile } from '../../utils/userAgent'
import CloseButton from '../CloseButton'
import ThemedContainer from '../ThemedContainer'
import { Loader } from '../Loader'
import { AlertTriangle, ArrowLeft } from 'react-feather'

export default function ConnectWalletModal() {
  const theme = useUserTheme()
  const [darkMode, ] = useDarkModeManager()
  const dispatch = useAppDispatch()
  const { connector, account, chainId } = useWeb3React()
  
  const [connectedWallets, addWalletToConnectedWallets] = useConnectedWallets()

  const [lastActiveWalletAddress, setLastActiveWalletAddress] = useState<string | undefined>(account)

  const [pendingConnector, setPendingConnector] = useState<Connector | undefined>()
  const pendingError = useAppSelector((state) =>
    pendingConnector ? state.connection.errorByConnectionType[getConnection(pendingConnector).type] : undefined
  )
  
  const connectWalletModalOpen = useModalIsOpen(ApplicationModal.CONNECT_WALLET)
  const toggleWalletModal = useToggleConnectWalletModal()


  // Keep the network connector in sync with any active user connector to prevent chain-switching on wallet disconnection.
  useEffect(() => {
    if (chainId && connector !== networkConnection.connector) {
      networkConnection.connector.activate(chainId)
    }
  }, [chainId, connector])

  // When new wallet is successfully
  useEffect(() => {
    if (account && account !== lastActiveWalletAddress) {
      const walletType = getConnectionName(getConnection(connector).type, getIsMetaMask())
      const isReconnect =
        connectedWallets.filter((wallet) => wallet.account === account && wallet.walletType === walletType).length > 0
      
      if (!isReconnect) addWalletToConnectedWallets({ account, walletType })
    }
    setLastActiveWalletAddress(account)
  }, [connectedWallets, addWalletToConnectedWallets, lastActiveWalletAddress, account, connector, chainId])

  const tryActivation = useCallback(
    async (connector: Connector) => {
      const connectionType = getConnection(connector).type

      try {
        setPendingConnector(connector)
        dispatch(updateConnectionError({ connectionType, error: undefined }))
        
        await connector.activate()
        
        dispatch(updateSelectedWallet({ wallet: connectionType }))
      } catch (error:any) {
        console.debug(`web3-react connection error: ${error}`)
        dispatch(updateConnectionError({ connectionType, error: error.message }))
      }
    },
    [dispatch]
  )

  function getOptions() {
    const isInjected = getIsInjected()
    const isMetaMask = getIsMetaMask()
    
    const isMetaMaskBrowser = isMobile && isMetaMask
    const isInjectedMobileBrowser = isMetaMaskBrowser

    let injectedOption
    if (!isInjected) {
      if (!isMobile) {
        injectedOption = <InstallMetaMaskOption />
      }
    } else if (isMetaMask) {
      injectedOption = <MetaMaskOption tryActivation={tryActivation} />
    } else {
      injectedOption = <InjectedOption tryActivation={tryActivation} />
    }

    const walletConnectionOption =
      (!isInjectedMobileBrowser && <WalletConnectOption tryActivation={tryActivation} />) ?? null

    return (
      <>
        {injectedOption}
        {walletConnectionOption}
      </>
    )
  }
  const onDismiss = () => {
    setPendingConnector(undefined)
    toggleWalletModal()
  }
  return (
    <Modal isOpen={connectWalletModalOpen} onDismiss={onDismiss} minHeight={false} maxHeight={90}>
      
      <div className={'container p-3 connect-wallet-container ' + theme}>
        <div className='row'>
          <div className='col-12 mb-2'>
            <div className='row align-items-center'>
              <div className='col-9 text-start'>
                {pendingConnector && <ArrowLeft onClick={()=>{setPendingConnector(undefined)}} style={{cursor:"pointer"}} color={darkMode?"#fff":"black"}/>}
                {!pendingConnector && <h6 className='mb-0 fw-semibold'><Trans>Connect a wallet</Trans></h6>}
              </div>
              <div className='col-3 text-end'>
                <CloseButton onClick={onDismiss} />
              </div>
            </div>
          </div>
          <div className='col-12'>
            {!pendingConnector && 
              <div className='row m-2'>
                {getOptions()}
              </div>
            }
            {pendingConnector && 
              <div className='row my-2'>
                <div className='col-12 my-4 py-4 text-center'>
                  {!pendingError && <Loader width="90px" height="90px"/>}
                  {pendingError && <AlertTriangle size={70} color="#ffc107" strokeWidth={1}/>}
                </div>
                <div className='col-12 mb-2 text-center fs-5'>
                  {!pendingError && <Trans>Waiting to connect</Trans>}
                  {pendingError && <Trans>Error connecting</Trans>}
                </div>
                <div className='col-12 text-center'>
                  {!pendingError && <Trans>Confirm this connection in your wallet.</Trans>}
                  {pendingError && <Trans>The connection attempt failed.</Trans>}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </Modal>
  )
}
