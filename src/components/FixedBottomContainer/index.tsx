import { useIsMobile } from "../../hooks/useIsMobile"
import LatestBlock from "../LatestBlock"
import MobileNav from "../MobileNav"
import Popups from "../Popups"
import "./index.css"

export default function FixedBottomContainer() {
  const isMobile = useIsMobile()
      return (
        <div className="fixed-bottom fx-btn" style={isMobile?{}:{width: "fit-content", left:"auto"}}>
          <Popups />
          <LatestBlock />
          <MobileNav />
        </div>
      )
  }