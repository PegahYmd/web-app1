import 'dayjs';

import { Table, Form, Button, Image } from 'react-bootstrap/'
import { Link, useLocation } from 'react-router-dom';
function saman(){
  // let div = document.createElement("div");
  let string1= "<Image src='../src/images/1.jpg' className='block-image' />";
  string1= string1.trim();
  // const parser = new DOMParser();
  // const html = parser.parseFromString(string1,"text/html");
  return string1;
}
// function saman() {
//   var images = [];
//   for (let i = 0; i < 2; i++) {
//     images.push(
//       <Image
//         key={i}
//         src="../src/images/1.jpg"
//         className="block-image"
//       />
//     );
//   }
//   return images;
// }
function PageTable(props) {

  const filteredPages = props.Pages;
  
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Creation Date</th>
          <th>Publication Date</th>
          <th>Header</th>
          <th>Paragraph</th>
          <th>Image</th>
        </tr>
      </thead>
      
      <tbody>
        { 
          filteredPages.map((page) =>
            <PageRow J={page.id} pageData={page} deletePage={props.deletePage} updatePage={props.updatePage} editable={props.editable} />
          )
        }
      </tbody>
    </Table>
  );
}
 
function PageRow(props) {

  const formatDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }
  //console.log(showImage); 
  // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
  const location = useLocation();


  if(props.editable){
    return(
      <tr>
        <td>
          <p>
            {props.pageData.title}
          </p>
        </td>
        <td>
          <p>
            {props.pageData.author}
          </p>
        </td>
        <td>
          <small>{formatDate(props.pageData.creation_date, 'MMMM D, YYYY')}</small>
        </td>
        <td>
          <small>{formatDate(props.pageData.publication_date, 'MMMM D, YYYY')}</small>
        </td>
        <td>
          <p>
            {props.pageData.header}
          </p>
        </td>
        <td>
          <p>
            {props.pageData.paragraph}
          </p>
        </td>

        <td>
        {saman()}
          {/* {Array.isArray(props.pageData.images) && props.pageData.images.map((image, index) => (
            <Image key={index} src={separateImages} className='block-image' />
          ))} */}
          {/* {props.pageData.image.map(img => <img src={img.url} alt="ssa" />)} */}

          {/* if(props.pageData.image.length > 1){
              for(let i=0; i < props.pageData.image.length; i++){
                <Row>
        <Col><Image src={props.pageData.image} className='block-image'/></Col>
        <Col>2 of 2</Col>
      </Row>
                
              }
          } */}
           
          {/* <Image src={props.pageData.image} className='block-image'/> */}
        </td>

        <td>
          <Link className="btn btn-primary" to={"/edit/" + props.pageData.id} state={{nextpage: location.pathname}}>
            <i className="bi bi-pencil-square"/>
          </Link>
          &nbsp;
          <Button variant='danger' onClick={() => props.deletePage(props.pageData.id)}>
            <i className="bi bi-trash"/>
          </Button>
        </td>

      </tr>
    );
  }
  else{
    return(
      <tr>
        <td>
          <p>
            {props.pageData.title}
          </p>
        </td>
        <td>
          <p>
            {props.pageData.author}
          </p>
        </td>
        <td>
          <small>{formatDate(props.pageData.creation_date, 'MMMM D, YYYY')}</small>
        </td>
        <td>
          <small>{formatDate(props.pageData.publication_date, 'MMMM D, YYYY')}</small>
        </td>
        <td>
          <p>
            {props.pageData.header}
          </p>
        </td>
        <td>
          <p>
            {props.pageData.paragraph}
          </p>
        </td>
        <td>
        {Array.from({ length: props.image }, (i) => i).map((i) => (
            <Image className="block-image" src={props.pageData.image} />
          ))}
          {/* <Image src={props.pageData.image} className='block-image'/> */}
        </td>
      </tr>
    );
  }

}

export default PageTable;
