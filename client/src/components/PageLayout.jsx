import { React, useContext, useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import PageForm from './PageForm';
import PageTable from './PageLibrary';
import { LoginForm } from './Auth';
import { RouteFilters } from './Filters';
import MessageContext from '../messageCtx';
import API from '../API';

 

function DefaultLayout(props) {

  const location = useLocation();

  // const { filterLabel } = useParams();
  // const filterId = filterLabel || (location.pathname === "/" && 'filter-all');
  const filterId = 1;
  
  return (
    <Row className="vh-100">
      <Col className="below-nav">
        <Outlet/>
      </Col>
    </Row>
  );
}

function AdminLayout(props) {

  const dirty = props.dirty;
  const setDirty = props.setDirty;
  const location = useLocation();

  const {handleErrors} = useContext(MessageContext);

  // const { filterLabel } = useParams();
  // const filterName = props.filters[filterLabel] ?  props.filters[filterLabel].label : 'All';
  // const filterId = filterLabel || (location.pathname === "/" && 'filter-all');
  // const {filterId} = useParams();
  const filterId = 1;

  // Without this we do not pass the if(dirty) test in the [filterId, dirty] useEffect
  useEffect(() => {
    setDirty(true);
  }, [filterId])

  useEffect(() => {
    if (dirty) {
      API.getPages()
        .then(pages => {
          props.setPages(pages);
          setDirty(false);
        })
        .catch(e => { handleErrors(e); } ); 
    }
  }, [filterId, dirty]);

  const deletePage = (pageId) => {
    API.deletePage(pageId)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

    // update a film into the list
  const updatePage = (page) => {
    API.updatePage(page)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

  return (
    <>
      <h4 className="all-title">All Pages:</h4>
      <PageTable 
      Pages={props.Pages} 
      deletePage={deletePage} 
      updatePages={updatePage} 
      editable={true}/>

      <Link 
      className="btn btn-primary btn-lg fixed-right-bottom" 
      to="/form"
      state={{nextpage: location.pathname}}> Create New Page </Link>
    </>
  )
}

function BackOfficeLayout(props) {

  const dirty = props.dirty;
  const setDirty = props.setDirty;
  const location = useLocation();

  const {handleErrors} = useContext(MessageContext);

  // const { filterLabel } = useParams();
  // const filterName = props.filters[filterLabel] ?  props.filters[filterLabel].label : 'All';
  // const filterId = filterLabel || (location.pathname === "/" && 'filter-all');
  // const {filterId} = useParams();
  const {filterId} = useParams();

  // Without this we do not pass the if(dirty) test in the [filterId, dirty] useEffect
  useEffect(() => {
    setDirty(true);
  }, [filterId])

  useEffect(() => {
    if (dirty) {
      API.getPages()
        .then(pages => {
          props.setPages(pages);
          setDirty(false);
        })
        .catch(e => { handleErrors(e); } ); 
    }
  }, [filterId, dirty]);

  useEffect(() => {
    if (dirty) {
      API.getPagesFiltered(filterId)
        .then(pages => {
          props.setpagesFiltered(pages);
          setDirty(false);
        })
        .catch(e => { handleErrors(e); } ); 
    }
  }, [filterId, dirty]);

  const deletePage = (pageId) => {
    API.deletePage(pageId)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

    // update a film into the list
  const updatePage = (page) => {
    API.updatePage(page)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

  return (
    <>
      <h4 className="all-title">Authored Pages:</h4>
      <PageTable Pages={props.pagesFiltered} deletePage={deletePage} updatePages={updatePage} editable={true}/>

      <br/>
      <br/>
      <br/>

      <h4 className="all-title">Other Pages:</h4>
      <PageTable Pages={props.Pages} deletePage={deletePage} updatePages={updatePage} editable={false} />
      <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/form" state={{nextpage: location.pathname}}>Create New Page</Link>
    </>
  )
}

function FrontOfficeLayout(props) {

  const dirty = props.dirty;
  const setDirty = props.setDirty;

  const {handleErrors} = useContext(MessageContext);

  // const { filterLabel } = useParams();
  // const filterName = props.filters[filterLabel] ?  props.filters[filterLabel].label : 'All';
  // const filterId = filterLabel || (location.pathname === "/" && 'filter-all');
  const filterId = 1;

  // Without this we do not pass the if(dirty) test in the [filterId, dirty] useEffect
  useEffect(() => {
    setDirty(true);
  }, [filterId])

  useEffect(() => {
    if (dirty) {
      API.getPages()
        .then(pages => {
          props.setPages(pages);
          setDirty(false);
        })
        .catch(e => { handleErrors(e); } ); 
    }
  }, [filterId, dirty]);


  const deletePage = (pageId) => {
    API.deletePage(pageId)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

    // update a film into the list
  const updatePage = (page) => {
    API.updatePage(page)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

  // When an unpredicted filter is written, all the films are displayed.
  const filteredPages = props.Pages;

  return (
    <>
      <h4 className="all-title">All Pages:</h4>
      <PageTable Pages={props.Pages} deletePage={deletePage} updatePages={updatePage} editable={false}/>
    </>
  )
}

function AddLayout(props) {
  const {handleErrors} = useContext(MessageContext);
  const setDirty = props.setDirty;
  
  // add a film into the list
  const addPage = (page) => {
    API.addPage(page)
      .catch(e => handleErrors(e)); 
  }
  return (
    <PageForm addPage={addPage} />
  );
}

function EditLayout(props) {

  const setDirty = props.setDirty;
  const {handleErrors} = useContext(MessageContext);

  const { PageId } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    API.getPage(PageId)
      .then(page => {
        setPage(page);
      })
      .catch(e => {
        handleErrors(e); 
      }); 
  }, [PageId]);

  // update a film into the list
  const editPage = (page) => {
    API.updatePage(page)
      .then(() => { setDirty(true); })
      .catch(e => handleErrors(e)); 
  }

  return (
    page ? <PageForm page={page} editPage={editPage} /> : <></>
  );

}

function NotFoundLayout() {
    return(
        <>
          <h2>This is not the route you are looking for!</h2>
          <Link to="/">
            <Button variant="primary">Go Home!</Button>
          </Link>
        </>
    );
}

/**
 * This layout should be rendered while we are waiting a response from the server.
 */
function LoadingLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={4} bg="light" className="below-nav" id="left-sidebar">
      </Col>
      <Col md={8} className="below-nav">
        <h1>page Library ...</h1>
      </Col>
    </Row>
  )
}

function LoginLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={12} className="below-nav">
        <LoginForm login={props.login} />
      </Col>
    </Row>
  );
}

export { DefaultLayout, AddLayout, EditLayout, NotFoundLayout, FrontOfficeLayout ,BackOfficeLayout ,AdminLayout, LoadingLayout ,LoginLayout}; 
