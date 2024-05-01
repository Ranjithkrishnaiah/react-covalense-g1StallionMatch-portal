import { Typography } from '@mui/material'
import Popover from '@mui/material/Popover'

export function CustomPopover(props:any){
    const id = props.open ? 'simple-popover' : undefined;
    return(
        <Popover
            id={id}
            open={props.open}
            anchorEl={props.anchorEl}
            onClose={props.handleClose}
            anchorOrigin={ {
            vertical: 'top',
            horizontal: 'right',
            } }
            >
            <Typography sx={ { p: 2 } }>{props.body}</Typography>
            </Popover>
        )
}
