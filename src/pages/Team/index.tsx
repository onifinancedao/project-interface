import { Trans } from '@lingui/macro'
import ThemedContainer from '../../components/ThemedContainer'

import Hacku from '../../assets/images/hacku.jpg'
import Uncle_Sam from '../../assets/images/uncle_sam.png'
import Twitter_Icon from "../../assets/svg/twitter-icon.svg"
import Github_Icon from "../../assets/svg/github-icon.svg"
import { useUserTheme } from '../../state/user/hooks'
export default function Team() {
    const theme = useUserTheme()
    return (
        <div className='row pb-4'>
            <div className='col-12'>
                <h4><Trans>Dev Team</Trans></h4>
            </div>
            <div className='col-12 col-md-6 col-lg-6 mt-2'>
                <ThemedContainer maxWidth='100%'>
                    <div className='row'>
                        <div className='col-12 col-lg-6 mb-2'>
                            <img src={Hacku} alt="" style={{width: '100%', borderRadius:'12px'}}/>
                        </div>
                        <div className='col-12 col-lg-6'>
                            <div className='col-12 text-center'>
                                <h5>hackuz98.eth</h5>
                            </div>
                            <div className='col-12'>
                                <Trans>Hacku is a software developer passionate about decentralized finance who made the decision to create and launch Onifinance.</Trans>
                            </div>
                            <div className='col-12 text-center mt-2 fst-italic'>
                                <Trans>"Don't trust, check the <a className='text-reset' href="https://github.com/OnifinanceDAO" target='_blank' rel='noopener noreferrer'>source code</a>"</Trans>
                            </div>
                            <div className='col-12 mt-4 d-flex justify-content-center'>
                                <a className='text-reset me-1' href="https://twitter.com/hackuz98" target='_blank' rel='noopener noreferrer'>
                                    <img className="vertical-nav-icon" alt="" src={Twitter_Icon} />
                                </a>
                                <a className={"nav-link"} href="https://github.com/hackuz98" target='_blank' rel='noopener noreferrer'>
                                    <img className={"vertical-nav-icon " + theme} alt="" src={Github_Icon} />
                                </a>
                            </div>
                        </div>
                    </div>
                </ThemedContainer>
            </div>
            <div className='col-12 col-md-6 col-lg-6 mt-2'>
                <ThemedContainer maxWidth='100%'>
                    <div className='row'>
                        <div className='col-12 col-lg-6 mb-2'>
                            <img src={Uncle_Sam} alt="" style={{width: '100%', borderRadius:'12px'}}/>
                        </div>
                        <div className='col-12 col-lg-6'>
                           <div className='row'>
                               <div className='col-12 text-center'>
                                    <h5><Trans>Onifinance needs you!</Trans></h5>
                               </div>
                               <div className='col-12'>
                                    <Trans>If you think you have what it takes for Onifinance to succeed, do not hesitate to send us an email at <a href="mailto:contact@onifinance.org" className='text-reset'>contact@onifinance.org</a>. We are always looking for talented professionals who want to join our team and contribute to the growth and success of the project. We look forward to reading your email and learning more about you!</Trans>
                               </div>
                           </div>
                        </div>
                    </div>
                </ThemedContainer>
            </div>
        </div>
    )
}