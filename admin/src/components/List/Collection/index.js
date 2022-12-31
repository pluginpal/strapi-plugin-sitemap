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
  Typography,
  Button,
  VisuallyHidden,
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
        content={{ id: 'sitemap.Empty.URLBundles.Description', defaultMessage: 'No URL bundles have been configured yet.' }}
        action={<Button onClick={() => openModal()}>{formatMessage({ id: 'sitemap.Empty.URLBundles.Button', defaultMessage: 'Add the first URL bundle' })}</Button>}
      />
    );
  }

  return (
    <Table colCount={4} rowCount={formattedItems.length + 1} footer={<TFooter onClick={() => openModal()} icon={<Plus />}>{formatMessage({ id: 'sitemap.Button.AddURLBundle', defaultMessage: 'Add another URL bundle' })}</TFooter>}>
      <Thead>
        <Tr>
          <Th>
            <Typography variant="sigma">Type</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">Langcode</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">Pattern</Typography>
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
