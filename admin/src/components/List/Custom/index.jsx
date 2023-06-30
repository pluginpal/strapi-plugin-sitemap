import React from 'react';

import { NoContent } from '@strapi/helper-plugin';
import { Plus } from '@strapi/icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TFooter,
  VisuallyHidden,
  Typography,
  Button,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';

import CustomRow from './Row';

const ListComponent = (props) => {
  const { items, openModal, onDelete } = props;
  const formattedItems = [];
  const { formatMessage } = useIntl();

  if (!items) {
    return null;
  }

  items.map((item, key) => {
    const formattedItem = {};
    formattedItem.name = key;
    formattedItem.priority = item.get('priority');
    formattedItem.changefreq = item.get('changefreq');
    formattedItem.onDelete = onDelete;

    formattedItems.push(formattedItem);
  });

  if (items.size === 0) {
    return (
      <NoContent
        content={{ id: 'sitemap.Empty.CustomURLs.Description', defaultMessage: 'No custom URLs have been configured yet.' }}
        action={<Button onClick={() => openModal()}>{formatMessage({ id: 'sitemap.Empty.CustomURLs.Button', defaultMessage: 'Add the first URL' })}</Button>}
      />
    );
  }

  return (
    <Table colCount={4} rowCount={formattedItems.length + 1} footer={<TFooter onClick={() => openModal()} icon={<Plus />}>{formatMessage({ id: 'sitemap.Button.AddCustomURL', defaultMessage: 'Add another URL' })}</TFooter>}>
      <Thead>
        <Tr>
          <Th>
            <Typography variant="sigma">URL</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">Priority</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">ChangeFreq</Typography>
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
