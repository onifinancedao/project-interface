import { Trans } from '@lingui/macro'

import SlideOutMenu  from './SlideOutMenu'

import Check_Icon from "../../assets/svg/check-icon.svg"
import { useUserIdenticon, useUserIdenticonManager, useUserTheme } from '../../state/user/hooks'
import IdentIcon from '../IdentIcon';
import { useWeb3React } from '@web3-react/core';
import { SUPPORTED_IDENTICON } from '../../constants/identicon';
import { PROJECT_TOKEN } from '../../constants/tokens';

function IdentIconMenuItem({ identIcon, isActive}: { identIcon: string; isActive: boolean }) {
  
const theme = useUserTheme()
const [userIdentIcon, setIdentIcon] = useUserIdenticonManager()
const { account } = useWeb3React()
  return (
  
    <div 
      className={"col-12 my-1 py-2 d-flex justify-content-between settings-menu-item " + theme}
      onClick={()=>{!isActive && setIdentIcon(identIcon) }}
    >
        <div className='d-flex'>
            <span className='me-2'>
                {identIcon}
            </span>
            <IdentIcon address={account??PROJECT_TOKEN.address} preferIdentIcon={identIcon}/>
        </div>
      {isActive && <img src={Check_Icon} />}
    </div>
  )
}

const IdentIconMenu = ({ onClose }: { onClose: () => void }) => {
  const userIdenticon = useUserIdenticon()
  return (
    <SlideOutMenu onClose={onClose} title={<Trans>Identicon</Trans>}>
      <div className='row'>
      {SUPPORTED_IDENTICON.map((identicon) => (
        <IdentIconMenuItem identIcon={identicon} isActive={userIdenticon === identicon} key={identicon} />
        ))}
          
      </div>
    </SlideOutMenu>
  )
}

export default IdentIconMenu