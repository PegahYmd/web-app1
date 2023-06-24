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
import { Link, useLocation, Navigate } from "react-router-dom";
import DetailPage from "./DetailPage";
import dayjs from "dayjs";

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

  console.log("pageData", props.pageData);
  // function publishStatus(){
  //let publish_Status = props.pageData.publication_date;
  //let publish_Status = formatDate(props.pageData.publication_date, "MMMM D, YYYY");
  let publish_Status = props.pageData.publication_date;
  console.log("publish_status", publish_Status);
  let today = dayjs();
  // console.log(today);
  // console.log(today.$y);
  // console.log(today.$D);
  // console.log(today.$M+1);
  // console.log(publish_Status);
  // console.log(publish_Status.$y);
  // console.log(publish_Status.$D);
  // console.log(publish_Status.$M+1);
  if (!publish_Status) {
    publish_Status = "Draft";
    // console.log("Draft");
  }
  if (publish_Status && publish_Status.$y == today.$y) {
    if (publish_Status.$M + 1 == today.$M + 1) {
      if (publish_Status.$D == today.$D) {
        // console.log("Day equal");
        // console.log("Published");
        publish_Status = "Published";
      } else if (publish_Status.$D < today.$D) {
        // console.log("Published");
        publish_Status = "Published";
      } else if (publish_Status.$D > today.$D) {
        // console.log("Scheduled");
        publish_Status = "Scheduled";
      }
    } else if (publish_Status.$M + 1 < today.$M + 1) {
      // console.log("Published");
      publish_Status = "Published";
    } else if (publish_Status.$M + 1 > today.$M + 1) {
      // console.log("Scheduled");
      publish_Status = "Scheduled";
    }
  } else if (publish_Status && publish_Status.$y < today.$y) {
    // console.log("Published");
    publish_Status = "Published";
  } else if (publish_Status && publish_Status.$y > today.$y) {
    // console.log("Scheduled");
    publish_Status = "Scheduled";
  }

  // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
  const location = useLocation();

  if (props.editable) {
    return (
      <Col lg={3} onClick={() => Navigate("/detail")}>
        <div className="page-boxes">
          <p className="page-title">{props.pageData.title}</p>
          <p>Author: {props.pageData.author}</p>
          <p>
            Created at:{" "}
            {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}
          </p>
          <p>Status: {publish_Status}</p>
          <Row className="btns-area">
            <Col lg={8}></Col>
            <Col lg={4}>
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
            </Col>
          </Row>
        </div>
      </Col>
    );
  } else {
    return (
      <Col lg={3} onClick={() => Navigate("/detail")}>
        <div className="page-boxes">
          <p className="page-title">{props.pageData.title}</p>
          <p>Author: {props.pageData.author}</p>
          <p>
            Created at:{" "}
            {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}
          </p>
          <p>Status: {publish_Status}</p>
          <Row className="btns-area">
            <Col lg={8}></Col>
            <Col lg={4}>
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
            </Col>
          </Row>
        </div>
      </Col>
    );
  }
}

export default PageTable;
