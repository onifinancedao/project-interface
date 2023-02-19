import { useUserTheme } from "../../state/user/hooks"
import Chevron_Left from "../../assets/svg/chevron-left-icon.svg"
export default function SlideOutMenu({
  children,
  onClose,
  title,
  onClear,
}: {
  onClose: () => void
  title: React.ReactNode
  children: React.ReactNode
  onClear?: () => void
}) {
  const theme = useUserTheme()
  return(
    <div className="container">
      <div className="row">
        <div className="col-12 my-2 d-flex">
          <img 
            className={"settings-menu-icon " + theme} 
            onClick={onClose} 
            width={24}
            style={{cursor:"pointer"}}
            src={Chevron_Left} alt="" />
          <h6 className="" 
            style={
              {
                position: "absolute",
                left: "50%",
                top: "36px",
                transform: "translate(-50%, -50%)"
              }
            }
          >
            {title}
          </h6>
        </div>
        <div className="col-12">
          {children}
        </div>
      </div>
    </div>
  )
}
