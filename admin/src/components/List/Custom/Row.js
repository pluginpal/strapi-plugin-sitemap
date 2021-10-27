import React from 'react';

import EditIcon from '@strapi/icons/EditIcon';
import DeleteIcon from '@strapi/icons/DeleteIcon';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Tr, Td } from '@strapi/design-system/Table';
import { Text } from '@strapi/design-system/Text';
import { IconButton } from '@strapi/design-system/IconButton';

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
        <Flex>
          <IconButton onClick={handleEditClick} label="Edit" noBorder icon={<EditIcon />} />
          <Box paddingLeft={1}>
            <IconButton onClick={handleDeleteClick} label="Delete" noBorder icon={<DeleteIcon />} />
          </Box>
        </Flex>
      </Td>
    </Tr>
  );
};

export default CustomRow;
