import React, { ReactNode } from 'react';
import ReactQuill, { ReactQuillProps, UnprivilegedEditor } from 'react-quill';
// @mui
import { styled } from '@mui/material/styles';
import { Box, BoxProps, Typography } from '@mui/material';
//
import EditorToolbar, { formats, redoChange, undoChange } from './EditorToolbar';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }: any) => ({
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
  '& .ql-container.ql-snow': {
    borderColor: 'transparent',
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  '& .ql-editor': {
    minHeight: 172,
    '&.ql-blank::before': {
      fontStyle: 'normal',
      color: theme.palette.text.disabled,
    },
    '& pre.ql-syntax': {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
}));

// ----------------------------------------------------------------------

export interface Props extends ReactQuillProps {
  id?: string;
  error?: boolean;
  simple?: boolean;
  helperText?: ReactNode;
  sx?: BoxProps;
  maxLength?: number
}

export default function Editor({
  id = 'minimal-quill',
  error,
  value,
  onChange,
  simple = false,
  helperText,
  sx,
  ...other
}: Props) {
  const modules = {
    toolbar: {
      container: `#${id}`,
      handlers: {
        undo: undoChange,
        redo: redoChange,
      },
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  const maxCharCount = 275;
  let [ count, setCount ] = React.useState(0);
  let [ editorCount, setEditorCount ] = React.useState(11);
  const checkCharacterCount = (event: any) => {
    let charLength = (value != undefined) ? value?.length : 0;
    //console.log('check editor data', value, value?.length);
    if (charLength > 275 && event.key !== 'Backspace') {
      // event.preventDefault();
    } else {
      if(value == '<p><br></p>') {
        setCount(0);
      } else {
        setCount(charLength);
      } 
    }
  }
  return (
    <Box className='new-messages-rhf-editor'>
      <RootStyle
        sx={{
          ...(error && {
            border: (theme:any) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
        
        <ReactQuill
          value={value}
          style={{resize:'none'}}
          onKeyDown={checkCharacterCount}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder=""
          {...other}
        />
        {/* <Typography variant="subtitle2" className='count-text' textAlign='center'>{count}/275</Typography> */}
        <EditorToolbar id={id} isSimple={simple} />
        
      </RootStyle>

      {helperText && helperText}
    </Box>
  );
}
