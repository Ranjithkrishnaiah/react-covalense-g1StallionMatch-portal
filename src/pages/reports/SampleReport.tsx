import { Box } from '@mui/material'
import React from 'react'
import Slider from 'src/components/customCarousel/Slider'
import { singleCardCaroselProps } from '../../constants/CaroselConstants'
function SampleReport() {
  return (
    <Box sx={ { height: '100vh', width: '100vw', backgroundColor: '#161716', zIndex:'1', position:'relative', opacity:0.25, display:'flex', justifyContent:'center' } }>
        <Slider {...singleCardCaroselProps}/>
    </Box>
  )
}

export default SampleReport