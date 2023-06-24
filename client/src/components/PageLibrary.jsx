import "dayjs";

import {
  Table,
  Form,
  Button,
  Image,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DetailPage from "./DetailPage";
import dayjs from "dayjs";
import getPublicationStatus from "../getPublicationStatus.js";

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
  const navigate = useNavigate();
  const formatDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : "";
  };
  let publish_Status = getPublicationStatus(
    props.pageData?.publication_date?.format?.("YYYY-MM-DD")
  );
  console.log("publish status", publish_Status);

  // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
  const location = useLocation();

  if (props.editable) {
    return (
      <Col lg={3}>
        <div className="page-boxes">
          <p className="page-title">{props.pageData.title}</p>
          <p>Author: {props.pageData.author}</p>
          <p>
            Created at:{" "}
            {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}
          </p>
          <p>Status: {publish_Status}</p>
          <Row className="btns-area">
            <Col lg={6}></Col>
            <Col lg={6}>
              <Link
                className="btn btn-primary action-btns"
                to={"/form/" + props.pageData.id}
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
              <Button
                className="detail-btn"
                onClick={() => navigate(`/page/details/${props.pageData.id}`)}
              >
                More
                <i className="bi bi-arrow-right" />
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    );
  } else {
    return (
      <Col lg={3}>
        <div className="page-boxes">
          <p className="page-title">{props.pageData.title}</p>
          <p>Author: {props.pageData.author}</p>
          <p>
            Created at:{" "}
            {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}
          </p>
          <p>Status: {publish_Status}</p>
          <Row className="btns-area">
            <Col lg={6}></Col>
            <Col lg={6}>
              <Link
                className="btn btn-primary action-btns"
                to={"form/" + props.pageData.id}
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
              <Button
                className="detail-btn"
                onClick={() => navigate(`/page/details/${props.pageData.id}`)}
              >
                More
                <i className="bi bi-arrow-right" />
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    );
  }
}

export default PageTable;
