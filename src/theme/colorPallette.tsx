
import { alpha } from '@mui/material/styles';
import { PaletteOptions } from "@mui/material";

const heritageGreen = '#1D472E';
const midGreen = '#005632';
const springGreen = '#007142';
const mintGreen = '#2EFFB4';

const sageGreenHalf = '#E2E7E1';
const sageGreenQuarter = '#FOF3F0';
const sand = '#EAE4E0';
const sandHalf = '#FAF1EF';
const sandQuarter = '#FAF8F7';
const gold = '#BD9A68';
const bruntOrange = '#C75227';
const skyBlue = '#C5D1E9';
const royalBlue = '#3139DA';

const darkGrey = '#161716';
const midGrey = '#626E80';
const lightGrey = '#BOBBAF';


// export interface PaletteOptions {
//     text?: any;
//     grey?: any;
//     mode?: string;
//     divider?: any;
//     chart?: any;
//     background?: any;
//     gradients: any;
//     primary: {
//         main: string;
//         light: string;
//         dark: string;
//         contrastText: string;
//     };
//     secondary: {
//       0: string,
//       100: string,
//       200: string,
//       300: string,
//       400: string,
//       500: string,
//       600: string,
//       700: string,
//       800: string,
//     },
//     neutral: {
//       main: string;
//       light: string;
//       dark: string;
//       contrastText: string;
//     };
// }

const colours = {
    primary:{
        main: heritageGreen,
        light: midGreen,
        dark: springGreen,
        contrastText: mintGreen,
        lighter: "",
        darker: ""
    },
    secondary:{
      main:"#FFFFFF",
      0: sageGreenHalf,
      100: sageGreenQuarter,
      200: sand,
      300: sandHalf,
      400: sandQuarter,
      500: gold,
      600: bruntOrange,
      700: skyBlue,
      800: royalBlue,
    },
    info:{
        main: '#FFFFFF', // white
        light: lightGrey,
        dark: darkGrey,
        contrastText: midGrey,
        lighter: "",
        darker: ""
    }
}
const CHART_COLORS = {
    violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
    blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
    green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
    yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
    red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
  };
  const GREY = {
    0: '#FFFFFF',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
    500_8: alpha('#919EAB', 0.08),
    500_12: alpha('#919EAB', 0.12),
    500_16: alpha('#919EAB', 0.16),
    500_24: alpha('#919EAB', 0.24),
    500_32: alpha('#919EAB', 0.32),
    500_48: alpha('#919EAB', 0.48),
    500_56: alpha('#919EAB', 0.56),
    500_80: alpha('#919EAB', 0.8),
  };
export const colorPalette: PaletteOptions | undefined = {
  primary: colours.primary,
  secondary: colours.secondary,
  info: colours.info,
  chart: CHART_COLORS,
  divider: GREY[50024],
  // background: string,
  // text: string,
  gradients: {
    primary: "",
  }
  //grey: undefined,
  // mode: ''
}
interface GradientsPaletteOptions {
    primary: string;
    info?: string;
    success?: string;
    warning?: string;
    error?: string;
  }
  
  interface ChartPaletteOptions {
    violet: string[];
    blue: string[];
    green: string[];
    yellow: string[];
    red: string[];
  }
declare module '@mui/material/styles/createPalette' {
    interface TypeBackground {
      neutral: string;
    }
    interface SimplePaletteColorOptions {
      lighter: string;
      darker: string;
    }
    interface PaletteColor {
      lighter: string;
      darker: string;
    }
    interface Palette {
      gradients: GradientsPaletteOptions;
      chart: ChartPaletteOptions;
    }
    interface PaletteOptions {
      gradients: GradientsPaletteOptions;
      chart: ChartPaletteOptions;
    }
  }
  