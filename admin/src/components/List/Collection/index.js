import React from 'react';

import { NoContent } from '@strapi/helper-plugin';
import AddIcon from '@strapi/icons/AddIcon';
import { VisuallyHidden } from '@strapi/parts/VisuallyHidden';
import { Table, Thead, Tbody, Tr, Th, TFooter } from '@strapi/parts/Table';
import { TableLabel } from '@strapi/parts/Text';
import { Button } from '@strapi/parts/Button';

import CustomRow from './Row';

const ListComponent = (props) => {
  const { items, openModal, onDelete } = props;
  const formattedItems = [];

  if (!items) {
    return null;
  }

  items.map((item, key) => {
    item.get('languages').map((langItem, langKey) => {
      const formattedItem = {};
      formattedItem.name = key;
      formattedItem.langcode = langKey;
      formattedItem.pattern = langItem.get('pattern');
      formattedItem.onDelete = onDelete;

      formattedItems.push(formattedItem);
    });
  });

  if (items.size === 0) {
    return (
      <NoContent
        content={{
          id: 'emptyState',
          defaultMessage:
            'No URL bundles have been configured yet.',
        }}
        action={<Button onClick={() => openModal()}>Add the first URL bundle</Button>}
      />
    );
  }

  return (
    <Table colCount={4} rowCount={formattedItems.length + 1} footer={<TFooter onClick={() => openModal()} icon={<AddIcon />}>Add another URL bundle</TFooter>}>
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
  );
};

export default ListComponent;
