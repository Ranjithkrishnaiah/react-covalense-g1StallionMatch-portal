import { colorPalette } from './colorPallette'
import { PaletteOptions } from "@mui/material";

// import { typography, TypographyOptions } from "./typography";
import { createTheme } from '@mui/material/styles';
import { typography } from './typography';
import { breakpoints } from './breakpoints';


declare module '@mui/material/styles'{

    interface Theme{
        palette: PaletteOptions,     
    }
    // interface ThemeOptions{
    //     palette: PaletteOptions | undefined
    // }
}
export const theme = createTheme({
    palette: colorPalette,
    typography: typography,
    breakpoints: breakpoints,

})