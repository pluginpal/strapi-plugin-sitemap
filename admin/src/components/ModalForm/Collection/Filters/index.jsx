import * as React from 'react';

import {
  Grid,
  Typography,
  Flex,
  Button,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';

import SelectConditional from '../../../SelectConditional';

// eslint-disable-next-line arrow-body-style
const Filters = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { formatMessage } = useIntl();
  const [conditionCount, setConditionCount] = React.useState(0);
  const {
    modifiedState,
    uid,
    onChange,
    langcode,
    contentTypes,
  } = props;

  React.useEffect(() => {
    // get the initial condition count
    let count = 0;
    while (modifiedState.getIn([uid, 'languages', langcode, `condition${count}`], '') !== '') {
      count += 1;
    }
    setConditionCount(count);
  }, [uid, langcode]);

  const handleRemoveCondition = () => {
    onChange(uid, langcode, `condition${conditionCount - 1}`, '');
    onChange(uid, langcode, `conditionOperator${conditionCount - 1}`, '');
    onChange(uid, langcode, `conditionValue${conditionCount - 1}`, '');
    setConditionCount(conditionCount - 1);
  };
  return (
    <div>
      {conditionCount === 0 ? (
        <Flex direction="column" alignItems="stretch">
          <Flex direction="row" justifyContent="space-between">
            <Flex direction="column" justifyContent="center" alignItems="flex-start">
              <Typography variant="pi" fontWeight="bold">
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Label', defaultMessage: 'Conditional Filtering' })}
              </Typography>
              <Typography>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Description', defaultMessage: 'Only include URLs that match the following condition.' })}
              </Typography>
            </Flex>
            <Flex direction="row" alignItems="center" gap={2}>
              <Button onClick={() => setConditionCount(conditionCount + 1)}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Add', defaultMessage: 'Add' })}
              </Button>
              <Button variant="secondary" onClick={() => handleRemoveCondition()}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Remove', defaultMessage: 'Remove' })}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex direction="column" alignItems="stretch">
          <Flex direction="row" justifyContent="space-between" style={{ marginBottom: '2rem' }}>
            <Flex direction="column" justifyContent="center" alignItems="flex-start">
              <Typography variant="pi" fontWeight="bold">
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Label', defaultMessage: 'Conditional Filtering' })}
              </Typography>
              <Typography>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Description', defaultMessage: 'Only include URLs that match the following conditions.' })}
              </Typography>
            </Flex>
            <Flex direction="row" alignItems="center" gap={2}>
              <Button onClick={() => setConditionCount(conditionCount + 1)}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Add', defaultMessage: 'Add' })}
              </Button>
              <Button variant="secondary" onClick={() => handleRemoveCondition()}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Remove', defaultMessage: 'Remove' })}
              </Button>
            </Flex>
          </Flex>
          {Array.from(Array(conditionCount).keys()).map((i) => (
            <Grid gap={4} style={{ marginBottom: '1rem' }}>
              <SelectConditional
                disabled={!uid || (contentTypes[uid].locales && !langcode)}
                contentType={contentTypes[uid]}
                onConditionChange={(value) => onChange(uid, langcode, `condition${i}`, value)}
                onOperatorChange={(value) => onChange(uid, langcode, `conditionOperator${i}`, value)}
                onValueChange={(value) => onChange(uid, langcode, `conditionValue${i}`, value)}
                condition={modifiedState.getIn([uid, 'languages', langcode, `condition${i}`], '')}
                conditionOperator={modifiedState.getIn([uid, 'languages', langcode, `conditionOperator${i}`], '')}
                conditionValue={modifiedState.getIn([uid, 'languages', langcode, `conditionValue${i}`], '')}
              />
            </Grid>
          ))}
        </Flex>
      )}
    </div>
  );
};

export default Filters;
