import { useEffect } from "react";
import { useDarkModeManager } from "../../state/user/hooks"
import './index.css';
export default function ThemeButton() {
    const [darkMode, setDarkMode] = useDarkModeManager()

     // Fire off effect that add/removes dark mode class
  useEffect(
    () => {
      const element = window.document.body;
      if (darkMode) {
        element.classList.add('bg-dark');
        element.classList.add('text-white');
        element.classList.remove('bg-light');
        element.classList.remove('text-dark');
      } else {
        element.classList.remove('bg-dark');
        element.classList.remove('text-white');
        element.classList.add('bg-light');
        element.classList.add('text-dark');
      }
    },
    [darkMode] // Only re-call effect when value changes
  );
  function toggleDarkMode(){
    setDarkMode( !darkMode )
  }
    return (
        <>
        <input type="checkbox" id="toggle" checked={ darkMode } onClick={ () => { toggleDarkMode() }} onChange={()=>{}} className="toggle--checkbox"/>
        <label htmlFor="toggle" className="toggle--label  mx-lg-1 ms-1 me-1">
            <span className="toggle--label-background"></span>
        </label>
        </>
    )
}