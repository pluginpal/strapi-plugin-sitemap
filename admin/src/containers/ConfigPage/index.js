/*
 *
 * ConfigPage
 *
 */

import React, { Component } from 'react';
import pluginId from '../../pluginId';
import { isEmpty } from 'lodash';

import { ContainerFluid } from 'strapi-helper-plugin';
import Header from '../../components/Header';

import List from '../../components/List';
import ModalForm from '../../components/ModalForm';
import { submit, getSettings, getContentTypes, onChangeContentTypes, submitModal, onChangeSettings, deleteContentType, generateSitemap, discardAllChanges, discardModifiedContentTypes } from './actions';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import selectConfigPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import SettingsForm from '../../components/SettingsForm';

class ConfigPage extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    this.props.getSettings();
    this.props.getContentTypes();
  }

  componentDidUpdate(prevProps) {
    // Get new settings on navigation change
    if (prevProps.match.params.env !== this.props.match.params.env) {
      this.props.getSettings();
    }
  }

  handleModalSubmit(e) {
    e.preventDefault();
    return this.props.submitModal();
  }

  handleSubmit(e) {
    e.preventDefault();
    return this.props.submit();
  }

  render() {
    if (isEmpty(this.props.contentTypes)) {
      return (<div />);
    }

    return (
      <div>
        <ContainerFluid>
          <Header 
            onSubmit={(e) => this.handleSubmit(e)}
            onCancel={(e) => this.props.discardAllChanges()}
            settings={this.props.settings}
            initialData={this.props.initialData}
            generateSitemap={this.props.generateSitemap}
          />
          <List 
            settings={this.props.settings}
            onDelete={this.props.deleteContentType}
          />
          <ModalForm 
            contentTypes={this.props.contentTypes}
            modifiedContentTypes={this.props.modifiedContentTypes}
            settings={this.props.settings}
            onSubmit={(e) => this.handleModalSubmit(e)}
            onCancel={this.props.discardModifiedContentTypes}
            onChange={this.props.onChangeContentTypes}
          />
          <SettingsForm 
            onChange={this.props.onChangeSettings} 
            settings={this.props.settings}
          />
        </ContainerFluid>
      </div>
    );
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSettings,
      getContentTypes,
      deleteContentType,
      discardAllChanges,
      discardModifiedContentTypes,
      onChangeContentTypes,
      onChangeSettings,
      submit,
      submitModal,
      generateSitemap
    },
    dispatch
  );
}

const mapStateToProps = selectConfigPage();

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = strapi.injectReducer({
  key: 'configPage',
  reducer,
  pluginId,
});
const withSaga = strapi.injectSaga({ key: 'configPage', saga, pluginId });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(ConfigPage);
