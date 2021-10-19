import { Card, CardBody, Stack, StackItem, Button, FlexItem, Flex, SearchInput, Gallery, GalleryItem, CardHeader, CardActions, CardTitle, CardFooter, Modal, DropdownItem, Dropdown, KebabToggle, EmptyState, EmptyStateIcon, EmptyStateBody } from '@patternfly/react-core';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import CreateDBForm from './couchdb/CreateDBForm';
import Header from './Header';
import Loader from './Loader';
import { ReactComponent as StorageIcon } from '../assets/storage_black_24dp.svg';

function ConfigureCouchDB ( props: any ) {
  const { app, loading: appLoading, forceRefreshApp } = useContext( AppContext );
  const [ isCreateDBFormOpen, setIsCreateDBFormOpen ] = useState( false );
  const [ expandedMenuCardId, setExpandedMenuCardId ] = useState( '' );
  const [ searchTerm, setSearchTerm ] = useState( '' );

  const onCardMenuSelect = (event: any) => {
    setExpandedMenuCardId( '' );
  }
  const onCardMenuToggle = ( id: string ) => {
    setExpandedMenuCardId( id === expandedMenuCardId ? '' : id );
  }

  const dropdownItems = (db: any) =>  [
    <DropdownItem key="link">Configure</DropdownItem>
  ];

  /**
   * Escapes the string for special characters
   */
  const escapeString = (string: string) => {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  const filteredDBs = app.database.databases.filter( db => db.name.includes(escapeString( searchTerm.trim() )) );

  const openCreateDBForm = () => {
    setIsCreateDBFormOpen( true );
  }

  const handleModalClose = () => {
    setIsCreateDBFormOpen( false );
  }

  /**
   *
   * @param name This function will be uncommented once we have Fauxton UI is available

  const openFauxtonGUI = (name: string) => {
    window.open(`${process.env.REACT_APP_FAUXTON_URL}/${name}/_all_docs`, '_blank' );
  }*/

  const getEmptyState = () => {
    const noSearchResults = searchTerm && filteredDBs.length === 0;
    return (
      <Card>
        <CardBody className="couch-db--emptyStateBody">
          <EmptyState>
            <EmptyStateIcon icon={StorageIcon} />
            <EmptyStateBody>
              {
                noSearchResults
                ?
                    "No search results for the criteria."
                :
                  <p>Looks like you don't have any databases created. <br/>To create a database click on Create Database button.</p>
                }
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>)
  }

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Header title="Configure Couch DB" />
        </StackItem>

        { appLoading ?
          <Loader/>
          :
          <>
            <StackItem>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem>
                  <Button
                    onClick={openCreateDBForm}
                    >Create Database</Button>
                </FlexItem>
                <FlexItem>
                  <SearchInput
                    isDisabled={ app.database?.databases?.length === 0 }
                    value={ searchTerm }
                    onChange={ ( value: string ) => setSearchTerm(value) }
                    placeholder={ 'Search' }
                    />
                </FlexItem>
              </Flex>
            </StackItem>
            <StackItem>
              {
                app.database?.databases?.length === 0 || filteredDBs.length === 0
                ?
                  getEmptyState()
                :
                  <Gallery className="lighthouse-projectForm--marginTop"
                    hasGutter
                    minWidths={{
                      md: '100px',
                      lg: '150px',
                      xl: '200px',
                      '2xl': '300px'
                    } }>
                    {
                        filteredDBs
                          .map( db => {
                          return <GalleryItem key={ db.name }>
                            <Card className="couch-db--card">
                              <CardHeader>
                                <CardActions>
                                  <Dropdown
                                    onSelect={ onCardMenuSelect }
                                    toggle={ <KebabToggle onToggle={ () => { onCardMenuToggle( db.name ); } } /> }
                                    isOpen={ expandedMenuCardId ===  db.name }
                                    isPlain
                                    dropdownItems={ dropdownItems( db.name ) }
                                    position={'right'}
                                  />
                                </CardActions>
                                <CardTitle>
                                  { db }
                                </CardTitle>
                              </CardHeader>
                              <CardBody>{ 'No description' }</CardBody>
                              <CardFooter>
                                <Button
                                  variant="link"
                                  icon={ <ion-icon name="open-outline"></ion-icon> }
                                  iconPosition="right">
                                  Open Fauxton GUI
                                </Button>
                              </CardFooter>
                            </Card>
                          </GalleryItem>
                        } )
                      }
                  </Gallery>
              }
            </StackItem>
          </>
        }
      </Stack>
      {
        isCreateDBFormOpen &&
          <Modal
            variant="small"
            title="Create new Database"
            isOpen={ isCreateDBFormOpen }
            onClose={ handleModalClose }
            showClose={true}>
            <CreateDBForm
              isCreateDBFormOpen={ isCreateDBFormOpen }
              setIsCreateDBFormOpen={ setIsCreateDBFormOpen }
              appUniqueId={ app.id }
              appId={ app.appId }
              forceRefreshApp={ forceRefreshApp }
            />
          </Modal>
      }
    </>
  );
}

export default ConfigureCouchDB;
