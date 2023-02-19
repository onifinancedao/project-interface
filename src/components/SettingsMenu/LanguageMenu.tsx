import { Trans } from '@lingui/macro'
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from '../../constants/locales'
import { useActiveLocale } from '../../hooks/useActiveLocale'

import SlideOutMenu  from './SlideOutMenu'

import Check_Icon from "../../assets/svg/check-icon.svg"
import { useUserLocaleManager, useUserTheme } from '../../state/user/hooks'

function LanguageMenuItem({ locale, isActive }: { locale: SupportedLocale; isActive: boolean }) {

const theme = useUserTheme()
const [userLocale, setUserLocale] = useUserLocaleManager()
  return (
  
    <div 
      className={"col-12 my-1 py-2 d-flex justify-content-between settings-menu-item " + theme}
      onClick={()=>{!isActive && setUserLocale(locale)}}
    >
      <span>
        {LOCALE_LABEL[locale]}
      </span>
      {isActive && <img src={Check_Icon} />}
    </div>
  )
}

const LanguageMenu = ({ onClose }: { onClose: () => void }) => {
  const activeLocale = useActiveLocale()

  return (
    <SlideOutMenu onClose={onClose} title={<Trans>Language</Trans>}>
      <div className='row'>
        {SUPPORTED_LOCALES.map((locale) => (
          <LanguageMenuItem locale={locale} isActive={activeLocale === locale} key={locale} />
        ))}
      </div>
    </SlideOutMenu>
  )
}

export default LanguageMenu
