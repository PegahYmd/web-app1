import "dayjs";

import { Table, Form, Button, Image, Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";


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






    // <Table striped>
    //   <thead>
    //     <tr>
    //       <th>Title</th>
    //       <th>Author</th>
    //       <th>Creation Date</th>
    //       <th>Publication Date</th>
    //     </tr>
    //   </thead>

    //   <tbody>
    //     {filteredPages.map((page) => (
    //       <PageRow
    //         J={page.id}
    //         pageData={page}
    //         deletePage={props.deletePage}
    //         updatePage={props.updatePage}
    //         editable={props.editable}
    //       />
    //     ))}
    //   </tbody>
    // </Table>
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
      <Col lg={3} className="page-boxes">
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
      </Col>

      // <tr>
      //   <td>
      //     <p>{props.pageData.title}</p>
      //   </td>
      //   <td>
      //     <p>{props.pageData.author}</p>
      //   </td>
      //   <td>
      //     <small>
      //       {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}
      //     </small>
      //   </td>
      //   <td>
      //     <small>
      //       {formatDate(props.pageData.publication_date, "MMMM D, YYYY")}
      //     </small>
      //   </td>
      //   <td>
      //     <Link
      //       className="btn btn-primary"
      //       to={"/edit/" + props.pageData.id}
      //       state={{ nextpage: location.pathname }}
      //     >
      //       <i className="bi bi-pencil-square" />
      //     </Link>
      //     &nbsp;
      //     <Button
      //       variant="danger"
      //       onClick={() => props.deletePage(props.pageData.id)}
      //     >
      //       <i className="bi bi-trash" />
      //     </Button>
      //   </td>
      // </tr>
    );
  } else {
    return (

      <Col lg={3} className="page-boxes">
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
      </Col>



      // <tr>
      //   <td>
      //     <p>{props.pageData.title}</p>
      //   </td>
      //   <td>
      //     <p>{props.pageData.author}</p>
      //   </td>
      //   <td>
      //     <small>
      //       {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}
      //     </small>
      //   </td>
      //   <td>
      //     <small>
      //       {formatDate(props.pageData.publication_date, "MMMM D, YYYY")}
      //     </small>
      //   </td>
      //   <td>
      //     <Link
      //       className="btn btn-primary"
      //       to={"page/test/:pageId?/edit/" + props.pageData.id}
      //       state={{ nextpage: location.pathname }}
      //     >
      //       <i className="bi bi-pencil-square" />
      //     </Link>
      //     &nbsp;
      //     <Button
      //       variant="danger"
      //       onClick={() => props.deletePage(props.pageData.id)}
      //     >
      //       <i className="bi bi-trash" />
      //     </Button>
      //   </td>
      // </tr>
    );
  }
}

export default PageTable;
