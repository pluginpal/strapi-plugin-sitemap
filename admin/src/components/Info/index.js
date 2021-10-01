import React from 'react';

import { isEmpty } from 'lodash';
import { Map } from 'immutable';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';

import { Text } from '@strapi/parts/Text';
import { Box } from '@strapi/parts/Box';
import { Button } from '@strapi/parts/Button';
import styled from 'styled-components';

import { generateSitemap } from '../../state/actions/Sitemap';

const Info = () => {
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));
  const sitemapPresence = useSelector((state) => state.getIn(['sitemap', 'sitemapPresence'], Map()));
  const dispatch = useDispatch();

  const settingsComplete = settings.get('hostname') && !isEmpty(settings.get('contentTypes'))
    || settings.get('hostname') && !isEmpty(settings.get('customEntries'))
    || settings.get('hostname') && settings.get('includeHomepage');

  const { formatMessage } = useIntl();

  const StatusWrapper = styled(Box)`
    ${Text} {
      color: ${({ theme, textColor }) => theme.colors[textColor]};
    }
  `;

  return (
    <Box padding={8}>
      <StatusWrapper
        borderColor="secondary200"
        background="secondary100"
        hasRadius
        paddingTop={4}
        paddingBottom={4}
        paddingLeft={5}
        paddingRight={5}
      >
        {sitemapPresence ? (
          <Text>
            A sitemap has previously been generated, see the info below.
          </Text>
        ) : (
          <Text>
            You have yet to generate your first sitemap. Finish the settings below to do a one-time generate.
          </Text>
        )}
        <Button
          onClick={() => dispatch(generateSitemap())}
          variant="tertiary"
          disabled={!settingsComplete}
        >
          {formatMessage({ id: 'sitemap.Header.Button.Generate' })}
        </Button>
      </StatusWrapper>
    </Box>
  );
};

export default Info;
