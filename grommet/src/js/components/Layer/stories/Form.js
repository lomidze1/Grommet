import React from 'react';

import { Add, Close } from 'grommet-icons';

import {
  Box,
  Button,
  FormField,
  Heading,
  Layer,
  Select,
  TextArea,
  TextInput,
} from 'grommet';

const suggestions = ['alpha', 'beta'];

export const FormLayer = () => {
  const [open, setOpen] = React.useState(false);
  const [select, setSelect] = React.useState('');

  const onOpen = () => setOpen(true);

  const onClose = () => setOpen(undefined);

  return (
    // Uncomment <Grommet> lines when using outside of storybook
    // <Grommet theme={...}>
    <Box fill align="center" justify="center">
      <Button icon={<Add />} label="Add" onClick={onOpen} />
      {open && (
        <Layer
          position="right"
          full="vertical"
          modal
          onClickOutside={onClose}
          onEsc={onClose}
        >
          <Box
            as="form"
            fill="vertical"
            overflow="auto"
            width="medium"
            pad="medium"
            onSubmit={onClose}
          >
            <Box flex={false} direction="row" justify="between">
              <Heading level={2} margin="none">
                Add
              </Heading>
              <Button icon={<Close />} onClick={onClose} />
            </Box>
            <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
              <FormField label="First">
                <TextInput suggestions={suggestions} />
              </FormField>
              <FormField label="Second">
                <Select
                  options={[
                    'one',
                    'two',
                    'three',
                    'four',
                    'five',
                    'six',
                    'seven',
                    'eight',
                  ]}
                  value={select}
                  onSearch={() => {}}
                  onChange={({ option }) => setSelect(option)}
                />
              </FormField>
              <FormField label="Third">
                <TextArea />
              </FormField>
            </Box>
            <Box flex={false} as="footer" align="start">
              <Button type="submit" label="Submit" onClick={onClose} primary />
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
    // </Grommet>
  );
};

FormLayer.storyName = 'Form';

FormLayer.parameters = {
  chromatic: { disable: true },
};

FormLayer.args = {
  full: true,
};

export default {
  title: 'Layout/Layer/Form',
};
