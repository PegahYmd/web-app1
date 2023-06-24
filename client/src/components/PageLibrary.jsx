import "dayjs";

import { Table, Form, Button, Image, Container, Row, Col } from "react-bootstrap";
import { Link, useLocation, Navigate } from "react-router-dom";
import DetailPage from "./DetailPage";


function PageTable(props) {
  const filteredPages = props.Pages;

  return (

    <Container fluid>
      <Row>
        {filteredPages.map((page) => (
            <PageRow
              J={page.id}
              pageData={page}
              deletePage={props.deletePage}
              updatePage={props.updatePage}
              editable={props.editable}
            />
          ))}
        
      </Row>
      </Container>
  );
}

function PageRow(props) {
  const formatDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : "";
  };

  // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
  const location = useLocation();

  if (props.editable) {
    return (
      <Col lg={3} onClick={()=> Navigate('/detail')}>
        <div className="page-boxes">
          <p className="page-title">{props.pageData.title}</p>
          <p>Created by: {props.pageData.author}</p>
          <p>Created at: {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}</p>
          <p>TODO: published/draft/scheduled</p>
          <Row className="btns-area">
            <Col lg={8}></Col>
            <Col lg={4}>
              <Link
                className="btn btn-primary action-btns"
                to={"/edit/" + props.pageData.id}
                state={{ nextpage: location.pathname }}
              >
                <i className="bi bi-pencil-square" />
              </Link>
              <Button
                className="action-btns"
                variant="danger"
                onClick={() => props.deletePage(props.pageData.id)}
              >
                <i className="bi bi-trash" />
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    );
  } else {
    return (

      <Col lg={3} onClick={()=> Navigate('/detail')}>
        <div className="page-boxes">
          <p className="page-title">{props.pageData.title}</p>
          <p>Created by: {props.pageData.author}</p>
          <p>Created at: {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}</p>
          <p>TODO: published/draft/scheduled</p>
          <Row className="btns-area">
            <Col lg={8}></Col>
            <Col lg={4}>
              <Link
                className="btn btn-primary action-btns"
                to={"page/test/:pageId?/edit/" + props.pageData.id}
                state={{ nextpage: location.pathname }}
              >
                <i className="bi bi-pencil-square" />
              </Link>
              <Button
                className="action-btns"
                variant="danger"
                onClick={() => props.deletePage(props.pageData.id)}
              >
                <i className="bi bi-trash" />
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    );
  }
}

export default PageTable;
