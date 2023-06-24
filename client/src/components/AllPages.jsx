import { Link, useLocation, useNavigate } from "react-router-dom";
import getPublicationStatus from "../getPublicationStatus.js";
import { Button, Col, Container, Row } from "react-bootstrap";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import API from "../API.js";

function AllPages() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [user, setUser] = useState(null);

  const getData = async () => {
    let user;
    try {
      user = await API.getUserInfo();
    } catch {
      user = null;
    }
    setUser(user);
    try {
      const _pages = await API.getPages();
      if (user) {
        if (user.type === "admin") setPages(_pages);
        else
          setPages([
            ..._pages.filter((p) => p.user === user.id),
            ..._pages.filter(
              (p) => p.user !== user.id && p.publicationStatus === "Published"
            ),
          ]);
      } else
        setPages(_pages.filter((p) => p.publicationStatus === "Published"));
    } catch {
      setError(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error ...</p>;
  return (
    <Container fluid style={{ marginTop: "7rem" }}>
      <Row>
        {pages.map((page) => (
          <>
            <Col lg={3}>
              <div className="page-boxes">
                <p className="page-title">{page.title}</p>
                <p>Author: {page.author}</p>
                <p>
                  Created at: {dayjs(page.creation_date).format("MMMM D, YYYY")}
                </p>
                <p>Status: {page.publicationStatus}</p>
                <Row className="btns-area">
                  <Col lg={6}></Col>
                  <Col lg={6}>
                    {user &&
                    (user.type === "admin" || user.id === page.user) ? (
                      <>
                        <Link
                          className="btn btn-primary action-btns"
                          to={"/form/" + page.id}
                        >
                          <i className="bi bi-pencil-square" />
                        </Link>
                        <Button
                          className="action-btns"
                          variant="danger"
                          onClick={() => {
                            API.deletePage(page.id).then(() => {
                              setPages((pages) =>
                                pages.filter((p) => p.id !== page.id)
                              );
                            });
                          }}
                          //onClick={() => props.deletePage(id.id)}
                        >
                          <i className="bi bi-trash" />
                        </Button>
                      </>
                    ) : null}

                    <Button
                      className="detail-btn"
                      onClick={() => navigate(`/page/details/${page.id}`)}
                    >
                      More
                      <i className="bi bi-arrow-right" />
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </>
        ))}
      </Row>
    </Container>
  );
}

export default AllPages;
