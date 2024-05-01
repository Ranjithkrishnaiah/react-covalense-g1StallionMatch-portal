import { SxProps, Theme } from '@mui/material/styles';

export const dataGridTableStyles = (tableIdentifier : string, index: number | undefined, lastColumn: number) => {
    const notLastRowCondition = typeof(index) === "number" && index < (lastColumn - 1)

    const indexzero:SxProps<Theme> | undefined = { display: 'flex', alignItems: 'center' }
    const lastIndex:SxProps<Theme> | undefined = { textAlign: 'center' }
    switch(tableIdentifier){
        case "DASHBOARD":
            return {
                lg: index===0?4:2,
                xs: index===0?4:2,
                sx: index===0? indexzero:
                index===(lastColumn-1)?lastIndex: undefined,
                className:"List-content",
                notLastColumn: notLastRowCondition
            }
            
        case "STALLION_PAGE":
            return {
                lg: 2,
                xs: 2,
                sx: index ===0? { paddingLeft: 2 }: undefined,
                className: index === (lastColumn -1)?"SPracerecordTotal": "SPracerecordCount",
                notLastColumn: true,
                columnRowClassName : "SPracerecord",
            }
        case "STAKES-PROGENY":
            return {
                lg: 2,
                xs: 2,
                sx: index ===0? { paddingLeft: 2 }: undefined,
                className: "SPracerecordCount",
                notLastColumn: true,
                columnRowClassName : "SPracerecord",
            }
        case "LIST":
            return{
                lg: index===0?4:2,
                xs: index===0?4:2,
                notLastColumn: notLastRowCondition,
                sx: index===0? indexzero:
                index===(lastColumn-1)?lastIndex: undefined,
            }
        
    }
}