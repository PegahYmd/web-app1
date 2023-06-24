
import { useEffect, useState } from "react";
import "dayjs";

import { Table, Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useLocation, Navigate } from "react-router-dom";



function DetailPage(props) {
    const filteredPages = props.Pages;
  
    // return (
  
    //   <Container>
    //     <Row>
    //       {filteredPages.map((page) => (
    //           <PageInfo
    //             J={page.id}
    //             pageData={page}
    //             deletePage={props.deletePage}
    //             updatePage={props.updatePage}
    //             editable={props.editable}
    //           />
    //         ))}
          
    //     </Row>
    //     </Container>
    // );
  }
  
  function PageInfo(props) {
    const formatDate = (dayJsDate, format) => {
      return dayJsDate ? dayJsDate.format(format) : "";
    };
  
    // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
    const location = useLocation();

      return (
        <Container>
            <Row>
              <Col lg={3} onClick={()=> navigate('/DetailPage/:pageId?')}>
                    <p className="page-title">{props.pageData.title}</p>
                    <p>Created by: {props.pageData.author}</p>
                    <p>Created at: {formatDate(props.pageData.creation_date, "MMMM D, YYYY")}</p>
                    <p>TODO: published/draft/scheduled</p>

                    {/* TODO */}
                    {/* Blocks in the pages */}




                    <Nav.Link href="#">
                        <Link to={"/admin"} state={{nextpage: location.pathname}}>
                            <p>Back to all pages</p>
                        </Link>
                    </Nav.Link>
             </Col>
            </Row>
        </Container>
      );
  }

  export default DetailPage;