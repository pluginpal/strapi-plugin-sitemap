import React from 'react';

import EditIcon from '@strapi/icons/EditIcon';
import DeleteIcon from '@strapi/icons/DeleteIcon';
import { Box } from '@strapi/parts/Box';
import { Row } from '@strapi/parts/Row';
import { Tr, Td } from '@strapi/parts/Table';
import { Text } from '@strapi/parts/Text';
import { IconButton } from '@strapi/parts/IconButton';

const CustomRow = ({ openModal, entry }) => {
  const handleEditClick = (e) => {
    openModal(entry.name);
    e.stopPropagation();
  };

  const handleDeleteClick = (e) => {
    entry.onDelete(entry.name);
    e.stopPropagation();
  };

  return (
    <Tr key={entry.id}>
      <Td>
        <Text textColor="neutral800">{entry.name}</Text>
      </Td>
      <Td>
        <Text textColor="neutral800">{entry.priority}</Text>
      </Td>
      <Td>
        <Text textColor="neutral800">{entry.changefreq}</Text>
      </Td>
      <Td>
        <Row>
          <IconButton onClick={handleEditClick} label="Edit" noBorder icon={<EditIcon />} />
          <Box paddingLeft={1}>
            <IconButton onClick={handleDeleteClick} label="Delete" noBorder icon={<DeleteIcon />} />
          </Box>
        </Row>
      </Td>
    </Tr>
  );
};

export default CustomRow;
