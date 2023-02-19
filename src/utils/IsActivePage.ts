import { useLocation } from "react-router-dom"

export function IsActivePage(page:string) {
    const { pathname } = useLocation()
    if(pathname === '/'+page){
      return " active "
    }else{
      return ""
    }
  }