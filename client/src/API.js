import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}

/**
 * Getting from the server side and returning the list of films.
 * The list of films could be filtered in the server-side through the optional parameter: filter.
 */
const getPages = async () => {
  // film.watchDate could be null or a string in the format YYYY-MM-DD
  return getJson(fetch(SERVER_URL + 'pages', { credentials: 'include' })
  ).then( json => {
    return json.map((page) => {
      const clientPage = {
        id: page.id,
        title: page.title,
        author: page.author,
        header: page.header,
        header2: page.header2,
        paragraph: page.paragraph,
        creation_date: page.creation_date,
        publication_date: page.publication_date,
        image: page.image,
        user: page.user
      }
      if (page.creation_date)
        clientPage.creation_date = dayjs(page.creation_date);
      if (page.publication_date)
      clientPage.publication_date = dayjs(page.publication_date);
      return clientPage;
    })
  })
}

const getPagesFiltered = async (filterId) => {
  // film.watchDate could be null or a string in the format YYYY-MM-DD
  return getJson(fetch(SERVER_URL + 'pages/filter/' + filterId, { credentials: 'include' })
  ).then( json => {
    return json.map((page) => {
      const clientPage = {
        id: page.id,
        title: page.title,
        author: page.author,
        paragraph: page.paragraph,
        header: page.header,
        header2: page.header2,
        creation_date: page.creation_date,
        publication_date: page.publication_date,
        image: page.image,
        user: page.user
      }
      if (page.creation_date)
        clientPage.creation_date = dayjs(page.creation_date);
      if (page.publication_date)
      clientPage.publication_date = dayjs(page.publication_date);
      return clientPage;
    })
  })
}

/**
 * Getting and returing a film, specifying its filmId.
 */
const getPage = async (pageId) => {
  return getJson( fetch(SERVER_URL + 'pages/' + pageId, { credentials: 'include' }))
    .then( page => {
      const clientPage = {
        id: page.id,
        title: page.title,
        author: page.author,
        paragraph: page.paragraph,
        header: page.header,
        header2: page.header2,
        creation_date: page.creation_date,
        publication_date: page.publication_date,
        image: page.image,
        user: page.user
      }
      if (page.creation_date)
        clientPage.creation_date = dayjs(page.creation_date);
      if (page.publication_date)
      clientPage.publication_date = dayjs(page.publication_date);
      return clientPage;
    } )
}

/**
 * This function wants a film object as parameter. If the filmId exists, it updates the film in the server side.
 */
function updatePage(page) {
  if (page && page.creation_date && (page.creation_date instanceof dayjs))
      page.creation_date = page.creation_date.format("YYYY-MM-DD");
  if (page && page.publication_date && (page.publication_date instanceof dayjs))
      page.publication_date = page.publication_date.format("YYYY-MM-DD");
  const clientPage = {
    id: page.id,
    title: page.title,
    author: page.author,
    paragraph: page.paragraph,
    header: page.header,
    // header2: page.header2,
    creation_date: page.creation_date,
    publication_date: page.publication_date,
    image: page.image,
    user: page.user
  }
  return getJson(
    fetch(SERVER_URL + "pages/" + clientPage.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(clientPage) // dayjs date is serialized correctly by the .toJSON method override
    })
  )
}

/**
 * This funciton adds a new film in the back-end library.
 */
function addPage(page) {
  page.user = 1;
  return getJson(
    fetch(SERVER_URL + "pages/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(page) 
    })
  )
}

/**
 * This function deletes a film from the back-end library.
 */
function deletePage(pageId) {
  return getJson(
    fetch(SERVER_URL + "pages/" + pageId, {
      method: 'DELETE',
      credentials: 'include'
    })
  )
}

const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(credentials),
  })
  )
};

const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    // this parameter specifies that authentication cookie must be forwared
    credentials: 'include'
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  })
  )
}

const API = { getPages, getPagesFiltered, getPage, addPage, deletePage, updatePage, logIn, getUserInfo, logOut};
export default API;
