export const requestImage = () => ({
  type: 'REQUEST_IMAGE'
})

export const setImage = (data) => ({
  type: 'SET_IMAGE',
  data: {
    explanation: data.explanation,
    hdurl: data.hdurl,
    title: data.title
  }
})

export const catchError = (error) => ({
  type: 'ERROR',
  error
})

export const getImage = () => ({
  type: 'INITIALIZE_IMAGE_SAGA',
});

// export const getImage = () => (
//   dispatch => {
//     dispatch(requestImage());
//     return fetch('https://api.nasa.gov/planetary/apod?api_key=YOUR-API-KEY-HERE')
//     .then(response => response.json())
//     .then(json => {
//       if (!json.error) {
//         dispatch(setImage(json))
//       } else {
//         throw {message: json.error.message, code: json.error.code}
//       }
//     })
//     .catch(error => dispatch(catchError(error)))
//   }
// );
