import React from 'react';

import AddIcon from '@strapi/icons/AddIcon';
import { Box } from '@strapi/parts/Box';
import { VisuallyHidden } from '@strapi/parts/VisuallyHidden';
import { Table, Thead, Tbody, Tr, Th, TFooter } from '@strapi/parts/Table';
import { TableLabel } from '@strapi/parts/Text';

import CustomRow from './Row';

const ListComponent = (props) => {
  const { items, openModal } = props;
  const formattedItems = [];

  if (!items) {
    return null;
  }

  items.map((item, key) => {
    const formattedItem = {};
    formattedItem.name = key;
    formattedItem.priority = item.get('priority');
    formattedItem.changefreq = item.get('changefreq');
    formattedItem.onDelete = props.onDelete;

    formattedItems.push(formattedItem);
  });

  return (
    <Box padding={8} background="neutral100">
      <Table footer={<TFooter onClick={() => openModal()} icon={<AddIcon />}>Add another field to this collection type</TFooter>}>
        <Thead>
          <Tr>
            <Th>
              <TableLabel>URL</TableLabel>
            </Th>
            <Th>
              <TableLabel>Priority</TableLabel>
            </Th>
            <Th>
              <TableLabel>ChangeFreq</TableLabel>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {formattedItems.map((item) => (
            <CustomRow key={item.name} entry={item} openModal={openModal} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ListComponent;
