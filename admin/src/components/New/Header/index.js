import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { useIntl } from 'react-intl';

import { HeaderLayout } from '@strapi/parts/Layout';
import { Box } from '@strapi/parts/Box';
import CheckIcon from '@strapi/icons/CheckIcon';
import { Button } from '@strapi/parts/Button';

import { submit } from '../../../state/actions/Sitemap';

const Header = () => {
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));
  const initialData = useSelector((state) => state.getIn(['sitemap', 'initialData'], Map()));

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const disabled = JSON.stringify(settings) === JSON.stringify(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submit(settings.toJS()));
  };

  return (
    <Box background="neutral100">
      <HeaderLayout
        primaryAction={(
          <Button
            onClick={handleSubmit}
            disabled={disabled}
            type="submit"
            startIcon={<CheckIcon />}
            size="L"
          >
            {formatMessage({ id: 'sitemap.Button.Save' })}
          </Button>
        )}
        title={formatMessage({ id: 'sitemap.Header.Title' })}
        subtitle={formatMessage({ id: 'sitemap.Header.Description' })}
        as="h2"
      />
    </Box>
  );
};

export default Header;
