import dayjs from 'dayjs';

import {useState } from 'react';
import {Form, Button, Image, Row, Col  } from 'react-bootstrap';
import {Link, useNavigate, useLocation } from 'react-router-dom';
import img1 from '../images/1.jpg'
import img2 from '../images/2.jpg'
import img3 from '../images/3.jpg'
import img4 from '../images/4.jpg'


const PageForm = (props) => {


  /*
   * Creating a state for each parameter of the page.
   * There are two possible cases: 
   * - if we are creating a new page, the page is initialized with the default values.
   * - if we are editing a page, the page is pre-filled with the previous values.
   */

  const [title, setTitle] = useState(props.page ? props.page.title : '');
  const [author, setAuthor] = useState(props.page ? props.page.author : '');

  // if exists page.watchDate is converted to string for the form control of type "date", otherwise it is set to empty string
  const [creation_date, setCreationDate] = useState((props.page && props.page.creation_date) ? props.page.creation_date.format('YYYY-MM-DD') : '');
  const [publication_date, setPublicationDate] = useState((props.page && props.page.publication_date) ? props.page.publication_date.format('YYYY-MM-DD') : '');


    // const [header, setHeader] = useState(props.page ? props.page.header : '');
    const [header, setHeader] = useState([{header : ""}]);
    let ReturnHeader = "";
     for(let i=0;i<header.length;i++){
        ReturnHeader += header[i].value;
        if(i != (header.length-1) )ReturnHeader +='*';
        // console.log(ReturnHeader);
      }
      // const separateHeaders= ReturnHeader.split("*");
      // console.log(separateHeaders[0]);
      // console.log(separateHeaders[1]);


    const [paragraph, setParagraph] = useState([{paragraph : ""}]);
    let ReturnParagraph = "";
    for(let i=0;i<paragraph.length;i++){
      ReturnParagraph += paragraph[i].value;
      if(i != (paragraph.length-1) )ReturnParagraph +='*';
    }
    // const separateParagraphs= ReturnParagraph.split("*");
    // console.log(separateParagraphs[0]);
    // console.log(separateParagraphs[1]);


  const [image, setImage] = useState([{image : ""}]);
  let ReturnImage = "";
  // console.log(image[0]);
   for(let i=0;i<image.length;i++){
    ReturnImage += image[i];
      if(i != (image.length-1) )ReturnImage +='*';
      // console.log(ReturnImage);
    }

    let showImage = "<Image src='../src/images/1.jpg' className='block-image' /><Image  src='../src/images/2.jpg' className='block-image' />"; 
    const separateImages = ReturnImage.split("*");
    // console.log(separateImages[0]);
    // console.log(separateImages[1]);
    // for(let i=0; i<2; i++){
    //   <Image src={props.pageData.image} className='block-image'/>
      
    // }
    
  
  // useNavigate hook is necessary to change page
  const navigate = useNavigate();
  const location = useLocation();

  // if the page is saved (eventually modified) we return to the list of all films, 
  // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
  const nextpage = location.state?.nextpage || '/';

  const handleSubmit = (event) => {
    event.preventDefault();

    // String.trim() method is used for removing leading and ending whitespaces from the title.
    const page = {"title": title.trim(), "author": author.trim(), "creation_date": creation_date, "publication_date": publication_date, "header":ReturnHeader, "paragraph":ReturnParagraph ,"image":ReturnImage,"multipleImages":showImage }
    
    /* In this solution validations are executed through HTML.
       If you prefer JavaScript validations, this is the right place for coding them. */

    if(props.page) {
      page.id = props.page.id;
      props.editPage(page);
    }
    else
      props.addPage(page);

    navigate('/');
  }
  //console.log(props.pageData.multipleImages); 
  // ******************** Header  ***********************************
  const handleAddHeader = () => {
    setHeader([...header, {header : ""}])
    
  }
  const handleRemoveHeader = (index) => {
    const headerList = [...header];
    headerList.splice(index,1);
    setHeader(headerList);
  }
  const handleHeaderChange = (event, index) => {
    const value = event.target;
    const headerList = [...header];
    headerList[index] = value;
    setHeader(headerList);
  }



// ************************  Paragraph  *********************************

  const handleAddParagraph = () => {
    setParagraph([...paragraph, {paragraph : ""}])
    
  }
  const handleRemoveParagraph = (index) => {
    const paragraphList = [...paragraph];
    paragraphList.splice(index,1);
    setParagraph(paragraphList);
  }
  const handleParagraphChange = (event, index) => {
    const value = event.target;
    const paragraphList = [...paragraph];
    paragraphList[index] = value;
    setParagraph(paragraphList);
  }



  // ************************  Image  *********************************

  const handleAddImage = () => {
    setImage([...image, {image : ""}])
  }
  const handleRemoveImage = (index) => {
    const imageList = [...image];
    imageList.splice(index,1);
    setImage(imageList);
  }
  const handleImageChange = (event, index) => {
    const src = event.target.src;
    const imageList = [...image];
    imageList[index] = src;
    setImage(imageList);
  }



 

  return (
    <Form className="block-example border border-primary rounded mb-0 form-padding" onSubmit={handleSubmit}>



      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control type="text" required={true} value={author} onChange={event => setAuthor(event.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Creation Date</Form.Label>
        { /* watchDate is an optional parameter. It have to be properly rendered only if available. */ }
        <Form.Control type="date" value={creation_date} onChange={event => setCreationDate(event.target.value) }/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Publication Date</Form.Label>
        { /* watchDate is an optional parameter. It have to be properly rendered only if available. */ }
        <Form.Control type="date" value={publication_date} onChange={event => setPublicationDate(event.target.value) }/>
      </Form.Group>

    {/* header */}
      <Form.Group className="mb-3">
      <Form.Label>Header</Form.Label>
            {header.map((singleHeader,index) =>(
              <Row key={index} className='header-adder'>
                <Col lg={10} md={3}>
                  <Form.Control type="text" required={true} placeholder='Write down your header' value={singleHeader.header} 
                  onChange={event => handleHeaderChange(event, index)}/>
                </Col>

                <Col lg={2} md={3}>
                  {header.length -1 === index && (
                    <Button className="header-plus" variant="primary" type="button" onClick={handleAddHeader}><i className="bi bi-plus"/></Button>
                  )}
                  {header.length !== 1  && (
                    <Button className="header-minues" variant='danger' type="button" onClick={() => handleRemoveHeader(index)}><i className="bi bi-trash"/></Button>
                  )}
                </Col>
              </Row>
            ))}
      </Form.Group>

       {/* paragraph */}
      <Form.Group className="mb-3">
      <Form.Label>Paragraph</Form.Label>
            {paragraph.map((singleParagraph,index) =>(
              <Row key={index} className='header-adder'>
                <Col lg={10} md={3}>
                  <Form.Control as="textarea" type="text" required={true} placeholder='Write down your paragraph' 
                  value={singleParagraph.paragraph} 
                  onChange={event => handleParagraphChange(event, index)}/>
                </Col>

                <Col lg={2} md={3}>
                  {paragraph.length -1 === index && (
                    <Button className="header-plus" variant="primary" type="button" onClick={handleAddParagraph}><i className="bi bi-plus"/></Button>
                  )}
                  {paragraph.length !== 1  && (
                    <Button className="header-minues" variant='danger' type="button" onClick={() => handleRemoveParagraph(index)}><i className="bi bi-trash"/></Button>
                  )}
                </Col>
              </Row>
            ))}
      </Form.Group>

      {/* <Form.Group className="mb-3">
        <Form.Label>Paragraph</Form.Label>
        <Form.Control type="text" required={true} value={paragraph} onChange={event => setParagraph(event.target.value)}/>
      </Form.Group> */}

      {/* <Form.Group className="mb-3 images-div">
        <Form.Label>Image (choose one of these):</Form.Label>
        <Row>
        <Col xs={6} md={3}>
          <Image src='../src/images/1.jpg' thumbnail value={image} onClick={event => setImage(event.target.src)}/>
        </Col>
        <Col xs={6} md={3}>
          <Image src='../src/images/2.jpg' thumbnail value={image} onClick={event => setImage(event.target.src)}/>
        </Col>
        <Col xs={6} md={3}>
          <Image src='../src/images/3.jpg' thumbnail value={image} onClick={event => setImage(event.target.src)}/>
        </Col>
        <Col xs={6} md={3}>
          <Image src='../src/images/4.jpg' thumbnail value={image} onClick={event => setImage(event.target.src)}/>
        </Col>
      </Row>
      </Form.Group> */}


      {/* image */}
      <Form.Group className="mb-3 images-div">
      <Form.Label>Image (choose one of these):</Form.Label>
            {image.map((singleImage,index) =>(
              <Row key={index} className='header-adder'>
                <Col lg={2}>
                <Image src='../src/images/1.jpg' thumbnail value={singleImage.image} 
                onClick={event => handleImageChange(event, index)}/>
                </Col>

                <Col lg={2}>
                <Image src='../src/images/2.jpg' thumbnail value={singleImage.image} 
                onClick={event => handleImageChange(event, index)}/>
                </Col>

                <Col lg={2}>
                <Image src='../src/images/3.jpg' thumbnail value={singleImage.image} 
                onClick={event => handleImageChange(event, index)}/>
                </Col>

                <Col lg={2}>
                <Image src='../src/images/4.jpg' thumbnail value={singleImage.image} 
                onClick={event => handleImageChange(event, index)}/>
                </Col>

                <Col lg={4}>
                  {image.length -1 === index && (
                    <Button className="header-plus" variant="primary" type="button" onClick={handleAddImage}><i className="bi bi-plus"/></Button>
                  )}
                  {image.length !== 1  && (
                    <Button className="header-minues" variant='danger' type="button" onClick={() => handleRemoveImage(index)}><i className="bi bi-trash"/></Button>
                  )}
                </Col>
              </Row>
            ))}
      </Form.Group>



      <Button className="mb-3" variant="primary" type="submit">Save</Button>
      &nbsp;
      <Link className="btn btn-danger mb-3" to={nextpage}> Cancel </Link>
    </Form>
  )

}

export default PageForm;
