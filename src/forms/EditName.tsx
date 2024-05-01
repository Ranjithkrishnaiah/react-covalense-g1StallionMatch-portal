import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useEditNameMutation } from 'src/redux/splitEndpoints/editName';
import '../pages/profile/Profile.css';
import { toPascalCase } from 'src/utils/customFunctions';

function EditName() {
  const [editMode, setEditMode] = useState(false);
  const [sendEditedName, response] = useEditNameMutation();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{fullName : Sally Smith}') : {'fullName' : 'Sally Smith'};
  const [name, setName] = useState('');

  // Submit Form
  const handleNameSubmit = async () => {
    try {
      sendEditedName({ fullName: name });
      localStorage.setItem('user', JSON.stringify({ ...user, fullName: name }));
      setEditMode(false);
    } catch (err) {
    }
  };

  // Change name
  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  // Save the changed details to local storage on success
  useEffect(() => {
    if (response.isSuccess) {
      localStorage.setItem('user', JSON.stringify({ ...user, fullName: response.data.fullName }));
    }
    setName(user.fullName);
  }, [response]);

  return (
    <Box mt={3} pb={1}>
      {/* Display name */}
      <Stack direction="row">
        <Box flexGrow={1}>
          <Typography variant="h6">Full Name</Typography>
        </Box>
        <Box>
          <Stack direction="row">
            <Button
              className={`cancel ${editMode ? 'show' : 'hide'}`}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button
              className={`edit ${editMode ? 'hide' : 'show'}`}
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
            <Button className={`edit ${editMode ? 'show' : 'hide'}`} onClick={handleNameSubmit}>
              Save
            </Button>
          </Stack>
        </Box>
      </Stack>
      {/* Edit name form */}
      <Stack>
        <Box>
          <TextField
            id="filled-hidden-label-normal"
            disabled={!editMode}
            onChange={handleNameChange}
            value={toPascalCase(name) || user.fullName}
          />
        </Box>
      </Stack>
      <Divider orientation="horizontal" flexItem sx={ { borderColor: '#B0B6AF' } } />
    </Box>
  );
}

export default EditName;
