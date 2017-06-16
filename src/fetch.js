const handleErrors = (json) => {
    if (json.error) {
      throw { message: json.error.message, code: json.error.code}
    }
    return json;
}

export const fetchImage = () => (
  fetch('https://api.nasa.gov/planetary/apod?api_key=EFZIxlP9Ry5aV1KIjYZilvSLqziN5RBOJicPD8W9')
  .then(response =>  response.json())
  .then(json => handleErrors(json))
  .catch(error => error)
);
