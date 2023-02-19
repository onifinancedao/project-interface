import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { Loader } from '../components/Loader'
import NavBar from '../components/NavBar'
import VerticalNav from '../components/VerticalNav'
import { useFeatureFlagsIsLoaded } from '../featureFlags'

import { useIsMobile } from '../hooks/useIsMobile'

import { RedirectPathToHomeOnly } from './Home/redirect'

import Home from './Home'
import Mint from './Mint'
import Exchange from './Exchange'
import Burn from './Burn'
import FixedBottomContainer from '../components/FixedBottomContainer'
import DisclaimerModal from '../components/DisclaimerModal'
import { useReducedVerticalMenuManager } from '../state/user/hooks'
import WithdrawClaimableBalanceModal from '../components/WithdrawClaimableBalanceModal'

const Roadmap = lazy(() => import('./Roadmap'))
const Raffle = lazy(() => import('./Raffle'))
const Governance = lazy(() => import('./Governance'))
const Faq = lazy(() => import('./Faq'))
const Team = lazy(() => import('./Team'))
const Dev = lazy(() => import('./Dev'))

function Loading(){
    return(
        <div 
        style={{width:"100%", height:"80vh"}} 
        className='d-flex justify-content-center align-items-center'
        >
            <Loader width={70} height={70}/>
        </div>
    )
}
function Pages(){
    const isLoaded = useFeatureFlagsIsLoaded()
    const isMobile = useIsMobile()
    const [isReduced, ] = useReducedVerticalMenuManager()
    return(
        <div style={{maxHeight: isMobile?"calc(100vh - 70px - 60px)":"calc(100vh - 70px)"}} className={isMobile?'col-12 scroll-up-on-load overflow-auto smooth-scroll pb-3':isReduced?'col-11 col-xl-11 col-md-11 scroll-up-on-load overflow-auto smooth-scroll':'col-xl-10 col-md-9 col-sm-8 scroll-up-on-load overflow-auto smooth-scroll'}>
            <Suspense fallback={<Loading/>}>
                {
                    isLoaded ? (
                        <Routes>
                            <Route path="home" element={<Home />} />
                            <Route path="mint" element={<Mint />} />
                            <Route path="exchange" element={<Exchange />} />
                            <Route path="burn" element={<Burn />} />
                            <Route path="roadmap" 
                                element={
                                    <Suspense fallback={<Loading/>}>
                                        <Roadmap />
                                    </Suspense>
                                } 
                            />
                            
                            <Route path="raffle/:id" 
                                element={
                                    <Suspense fallback={<Loading/>}>
                                        <Raffle />
                                    </Suspense>
                                } 
                            />
                            <Route path="raffle/*" 
                                element={
                                    <Suspense fallback={<Loading/>}>
                                        <Raffle />
                                    </Suspense>
                                } 
                            />
                            <Route path="governance/*" 
                                element={
                                    <Suspense fallback={<Loading/>}>
                                        <Governance />
                                    </Suspense>
                                } 
                            />
                            <Route path="faq" 
                                element={
                                    <Suspense fallback={<Loading/>}>
                                        <Faq />
                                    </Suspense>
                                } 
                            />
                            <Route path="team" 
                                element={
                                    <Suspense fallback={<Loading/>}>
                                        <Team />
                                    </Suspense>
                                } 
                            />
                            <Route path="dev" 
                                element={
                                    <Suspense fallback={<Loading/>}>
                                        <Dev />
                                    </Suspense>
                                } 
                            />
                            <Route path="*" element={<RedirectPathToHomeOnly />} />
                        </Routes>
                    ) : (
                        <Loading/>
                    )
                }
            </Suspense>
        </div>
    )
}
export default function App() {
    
    const { pathname } = useLocation()

    useEffect(() => {
        var elements = document.getElementsByClassName("scroll-up-on-load");
        for (let i = 0; i < elements.length; i++) {
            elements[i].scrollTo(0,0);
        }
        window.scrollTo(0, 0)
    }, [pathname])
    
    return (
        <div className="pb-0 mb-0">
            <DisclaimerModal/>
            <WithdrawClaimableBalanceModal/>
            <NavBar/>
            <div className='container-fluid'>
                <div className='row'>
                    <VerticalNav/>
                    <FixedBottomContainer/>
                    <Pages/>
                </div>
                
            </div>
            
        </div>
    )
}
