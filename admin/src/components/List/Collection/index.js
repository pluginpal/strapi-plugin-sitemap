import React from 'react';

import AddIcon from '@strapi/icons/AddIcon';
import { Box } from '@strapi/parts/Box';
import { VisuallyHidden } from '@strapi/parts/VisuallyHidden';
import { Table, Thead, Tbody, Tr, Th, TFooter } from '@strapi/parts/Table';
import { TableLabel } from '@strapi/parts/Text';

import CustomRow from './Row';

const ListComponent = (props) => {
  const { items, openModal, onDelete } = props;
  const formattedItems = [];

  if (!items) {
    return null;
  }

  items.map((item, key) => {
    item.get('languages').map((langItem, langKey) => {
      if (langKey === 'excluded') return;

      const formattedItem = {};
      formattedItem.name = key;
      formattedItem.langcode = langKey;
      formattedItem.pattern = langItem.get('pattern');
      formattedItem.onDelete = onDelete;

      formattedItems.push(formattedItem);
    });
  });

  return (
    <Box padding={8} background="neutral100">
      <Table colCount={4} rowCount={formattedItems.length + 1} footer={<TFooter onClick={() => openModal()} icon={<AddIcon />}>Add another field to this collection type</TFooter>}>
        <Thead>
          <Tr>
            <Th>
              <TableLabel>Type</TableLabel>
            </Th>
            <Th>
              <TableLabel>Langcode</TableLabel>
            </Th>
            <Th>
              <TableLabel>Pattern</TableLabel>
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
