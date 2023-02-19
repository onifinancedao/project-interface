import { Trans } from "@lingui/macro";
import JSBI from "jsbi";
import { useEffect, useState } from "react";
import { useStartMinting } from "../../state/mint/hooks";
import { useUserLocale, useUserTheme } from "../../state/user/hooks";

import "./index.css"

interface Countdown{
    days?: string
    hours?: string
    minutes?: string
    seconds?: string
}

export const MintCountdown = () => {
    const theme = useUserTheme()
    const lang = useUserLocale()
    const startMinting = useStartMinting()
    const [countdown, setCountdown] = useState<Countdown>({});

    useEffect(() => {
        if(startMinting){
            let now = new Date();
        var date_target = new Date(JSBI.toNumber(startMinting) * 1000);
        const BigNow = JSBI.BigInt((new Date().getTime()/1000).toFixed(0))
          // Milliseconds for the calculations
          const MILLISECONDS_OF_A_SECOND = 1000;
          const MILLISECONDS_OF_A_MINUTE = MILLISECONDS_OF_A_SECOND * 60;
          const MILLISECONDS_OF_A_HOUR = MILLISECONDS_OF_A_MINUTE * 60;
          const MILLISECONDS_OF_A_DAY = MILLISECONDS_OF_A_HOUR * 24;

          
          const interval = setInterval(async () => {
            if(JSBI.GT(startMinting, BigNow)){
              const DURATION = date_target.valueOf() - now.valueOf();
              const day = Math.floor(DURATION / MILLISECONDS_OF_A_DAY);
              const hours = Math.floor((DURATION % MILLISECONDS_OF_A_DAY) / MILLISECONDS_OF_A_HOUR);
              const minutes = Math.floor((DURATION % MILLISECONDS_OF_A_HOUR) / MILLISECONDS_OF_A_MINUTE);
              const seconds = Math.floor((DURATION % MILLISECONDS_OF_A_MINUTE) / MILLISECONDS_OF_A_SECOND);
              
              setCountdown({
                days:day > 0?day.toString():undefined,
                hours:hours > 0 || day > 0?hours.toString():undefined,
                minutes:minutes > 0 || hours > 0 || day > 0?minutes.toString():undefined,
                seconds:seconds > 0 || minutes > 0 || hours > 0 || day > 0?seconds.toString():undefined,
              })
            
            now = new Date(now.getTime() + 1000);
            if(day === 0 && hours === 0 && minutes === 0 && seconds === 0){
              clearInterval(interval);
            }
          }
          }, 1000);
          return () => {
  
            clearInterval(interval);
  
          };
        }
          
        }, [startMinting]);
        
        return(
    
    <div className={"p-2 countdown-container " + theme} role="alert">
        <h6 className=""><Trans>There are only</Trans></h6>
        <h6>
            {countdown.days && <Trans>{countdown.days} Days</Trans>}
            {countdown.hours && <Trans>{countdown.days && ","} {countdown.hours} Hours</Trans>}
            {countdown.minutes && <Trans>{countdown.hours && ","} {countdown.minutes} Minutes</Trans>}
            {countdown.seconds && <Trans>{countdown.minutes && ","} {countdown.seconds} Seconds</Trans>}
        </h6>
        <h6><Trans>until start minting!</Trans></h6>
        <hr/>
        { startMinting && <p><Trans>Start of minting:</Trans> { new Date(JSBI.toNumber(startMinting) * 1000).toLocaleDateString(lang??"en-EN", { year: 'numeric',month: 'long',day: 'numeric',hour: 'numeric',minute: 'numeric',timeZoneName: 'short'}) + " " + Intl.DateTimeFormat().resolvedOptions().timeZone} </p>}
    </div>
    
    );
  }