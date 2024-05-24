import PropTypes from 'prop-types';
import {  useState } from 'react';
import ThemeContext from './themecontext';



const ThemeProvider = ({children})=>{
const [theme, settheme] = useState('light');

const toggleTheme = ()=>{
    settheme((prevState)=>prevState==='light'?'dark':'light')
}

return(
    
    <ThemeContext.Provider value={{theme , toggleTheme}}>
        {children}
    </ThemeContext.Provider>
)

}

ThemeProvider.propTypes = {
    children: PropTypes.any,
  };

export default ThemeProvider;
  


