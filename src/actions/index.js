export const requestImage = () => ({
  type: 'REQUEST_IMAGE'
})

export const setImage = (data) => ({
  type: 'SET_IMAGE',
  data
})

export const catchError = (error) => ({
  type: 'ERROR',
  error
})

export const getImage = () => (
  dispatch => {
    dispatch(requestImage())
    fetch('https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY_HERE')
    .then(response =>  response.json())
    .then(json => dispatch(setImage(json)))
    .catch(error => dispatch(catchError(error)))
  }
);
