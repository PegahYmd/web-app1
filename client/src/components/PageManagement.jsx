import { Button, Form, Image, NavDropdown, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import Image1 from "./../images/1.jpg";
import Image2 from "./../images/2.jpg";
import Image3 from "./../images/3.jpg";
import Image4 from "./../images/4.jpg";
import API from "../API.js";
import { useNavigate, useParams } from "react-router-dom";

function arrayMove(arr, fromIndex, toIndex) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
  return arr;
}
const images = [
  {
    title: "Image1",
    src: Image1,
  },
  {
    title: "Image2",
    src: Image2,
  },
  {
    title: "Image3",
    src: Image3,
  },
  {
    title: "Image4",
    src: Image4,
  },
];

const PageManagement = () => {
  const navigate = useNavigate();
  const { pageId } = useParams();

  const [user, setUser] = useState(null);
  const [userInquiryLoading, setUserInquiryLoading] = useState(true);
  const [userInquiryError, setUserInquiryError] = useState(false);

  const [users, setUsers] = useState([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(null);
  const [publicationDate, setPublicationDate] = useState("");

  const [selectedBlockType, setSelectedBlockType] = useState("");

  // {type: 'IMAGE|PARAGRAPH|HEADER', value: 'something'}

  const [blocks, setBlocks] = useState([]);

  const onBlockValueChangedHandler = (index, value) => {
    setBlocks((blocks) => {
      return blocks.map((b, i) => {
        if (i === index)
          return {
            ...b,
            value: value,
          };
        else return b;
      });
    });
  };

  const onAddHandler = () => {
    setBlocks((blocks) => [...blocks, { type: selectedBlockType, value: "" }]);
  };

  const onDeleteHandler = (index) => {
    const cloneBlocks = blocks.map((block) => ({ ...block }));
    cloneBlocks.splice(index, 1);
    setBlocks(cloneBlocks);
  };

  const onMoveUpHandler = (index) => {
    if (index !== 0) {
      const cloneBlocks = blocks.map((block) => ({ ...block }));
      setBlocks(arrayMove(cloneBlocks, index, index - 1));
    }
  };

  const onMoveDownHandler = (index) => {
    if (index !== blocks.length - 1) {
      const cloneBlocks = blocks.map((block) => ({ ...block }));
      setBlocks(arrayMove(cloneBlocks, index, index + 1));
    }
  };

  const getBlocks = (blocks) => {
    if (typeof JSON.parse(blocks) === "string")
      return JSON.parse(JSON.parse(blocks));
    return JSON.parse(blocks);
  };

  const onSubmitHandler = () => {
    if (
      // (props.title.value == '') ||
      !blocks.some((block) => block.type === "HEADER" && block.value) ||
      !blocks.some(
        (block) =>
          (block.type === "PARAGRAPH" || block.type === "IMAGE") && block.value
      )
    )
      alert(
        "A page must have a valid title and header and at least one of the other two types of blocks"
      );
    else {
      setSubmitLoading(true);

      const pageData = {
        title,
        user: author.id,
        author: author.name,
        publicationDate,
        blocks: JSON.stringify(blocks),
      };

      if (pageId) {
        //edit page
        API.updatePage({
          ...pageData,
          id: pageId,
        })
          .then(() => {
            alert("submitted :)");
            navigate("/");
          })
          .finally(() => setSubmitLoading(false));
      } else {
        //add page

        API.addPage(pageData)
          .then(() => {
            alert("submitted :)");
            navigate("/");
          })
          .finally(() => setSubmitLoading(false));
      }
    }
  };

  useEffect(() => {
    API.getUserInfo()
      .then((user) => {
        setUser(user);
        setAuthor(user);
        if (user.type === "admin") return API.getUsersList();
        else
          return new Promise((resolve) => {
            resolve([user]);
          });
      })
      .then((users) => {
        setUsers(users);
      })
      .catch(() => setUserInquiryError(true))
      .finally(() => setUserInquiryLoading(false));
  }, []);

  useEffect(() => {
    if (user && pageId) {
      API.getPage(pageId).then((page) => {
        setTitle(page.title);
        if (page.publication_date) setPublicationDate(page.publication_date);
        setAuthor({
          id: page.user,
          name: page.author,
        });
        setBlocks(getBlocks(page.blocks));
      });
    }
  }, [user, pageId]);

  if (userInquiryLoading) return <p>loading ...</p>;

  // go back
  if (userInquiryError) return navigate("/");

  return (
    <form className="container mb-3">
      <Row className="mb-5">
        <Form.Group className="col col-sm-4">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </Form.Group>
        <Form.Group className="col col-sm-4">
          <Form.Label>Author</Form.Label>
          <Form.Select
            className="form-control"
            value={author?.id}
            onChange={(e) =>
              setAuthor(users.find((user) => user.id == e.target.value))
            }
          >
            {users.map((user) => (
              <option value={user.id}>{user.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="col col-sm-4">
          <Form.Label>Publication Date</Form.Label>
          <Form.Control
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            className="form-control"
          />
        </Form.Group>
      </Row>

      {/* <hr /> */}
      <div className="block-adder d-flex pt-3 pb-3">
        <h4>Choose the block you want to add in the page </h4>

        <Form.Group controlId="formGridState">
          <Form.Select
            className="form-control"
            value={selectedBlockType}
            onChange={(e) => setSelectedBlockType(e.target.value)}
          >
            <option value="">Choose...</option>
            <option value="HEADER">Header</option>
            <option value="PARAGRAPH">Paragraph</option>
            <option value="IMAGE">Image</option>
          </Form.Select>
        </Form.Group>

        <Button
          className="add-block-btn"
          variant="success"
          disabled={!selectedBlockType}
          onClick={onAddHandler}
        >
          Add
        </Button>
      </div>

      <hr />

      {blocks.map((block, index) => {
        return (
          <Row key={block.type + index} className="mb-4 d-flex align-items-end">
            <Form.Group className="col col-sm-9">
              <Form.Label>{block.type}</Form.Label>
              {block.type === "HEADER" ? (
                <Form.Control
                  type="name"
                  value={block.value}
                  onChange={(e) =>
                    onBlockValueChangedHandler(index, e.target.value)
                  }
                  className="form-control"
                />
              ) : block.type === "PARAGRAPH" ? (
                <>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="form-control"
                    value={block.value}
                    onChange={(e) =>
                      onBlockValueChangedHandler(index, e.target.value)
                    }
                  />
                </>
              ) : (
                <div>
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    title={
                      block.value ? (
                        <Image src={block.value.src} style={{ width: 100 }} />
                      ) : (
                        <p className="image-selection">Select an image </p>
                      )
                    }
                  >
                    {images.map((image) => (
                      <Image
                        src={image.src}
                        style={{ width: "100px", margin: "5px" }}
                        alt={image.title}
                        onClick={() => onBlockValueChangedHandler(index, image)}
                      />
                    ))}
                  </NavDropdown>
                </div>
              )}
            </Form.Group>

            <div className="col-sm-3 d-flex justify-content-around">
              <Button variant="danger" onClick={() => onDeleteHandler(index)}>
                <i className="bi bi-trash" />
              </Button>

              <Button variant="light" onClick={() => onMoveUpHandler(index)}>
                <i className="bi bi-arrow-up" />
              </Button>

              <Button variant="light" onClick={() => onMoveDownHandler(index)}>
                <i className="bi bi-arrow-down" />
              </Button>
            </div>
          </Row>
        );
      })}

      <Button
        className="submit-form"
        onClick={onSubmitHandler}
        disabled={submitLoading}
      >
        {submitLoading ? "Please Wait ..." : "Submit"}
      </Button>
    </form>
  );
};

export default PageManagement;
