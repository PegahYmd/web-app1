import { useEffect, useState } from "react";

import { Table, Form, Button, Container, Row, Col, Nav } from "react-bootstrap";
import { Link, useLocation, Navigate, useParams } from "react-router-dom";
import API from "../API.js";
import dayjs from "dayjs";
import getPublicationStatus from "../getPublicationStatus.js";

function DetailPage() {
  const { pageId } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    API.getPage(pageId).then((page) => {
      setDetail(page);
    });
  }, []);

  const getBlocks = (blocks) => {
    if (typeof JSON.parse(blocks) === "string")
      return JSON.parse(JSON.parse(blocks));
    return JSON.parse(blocks);
  };

  console.log("page", detail);
  if (!detail) return "loading ...";
  return (
    <Container className="mt-4">
      <Row>
        <Col lg={3} onClick={() => {}}>
          <p className="page-title">{detail.title}</p>
          <p>Created by: {detail.author}</p>
          <p>
            Created at: {dayjs(detail.creation_date).format("MMMM D, YYYY")}
          </p>
          <p>Status: {getPublicationStatus(detail.publication_date)}</p>
          <p>Content:</p>
          {getBlocks(detail.blocks).map((block) => {
            console.log("block", block);
            if (block.type === "HEADER") return <h3>{block.value}</h3>;
            else if (block.type === "PARAGRAPH")
              return <pre>{block.value}</pre>;
            else if (block.type === "IMAGE")
              return (
                <img
                  src={block.value.src}
                  style={{ width: "100%", height: "100%" }}
                />
              );
          })}
          <Nav.Link href="#">
            <Link to={"/admin"} state={{ nextpage: location.pathname }}>
              <p>Back to all pages</p>
            </Link>
          </Nav.Link>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailPage;
