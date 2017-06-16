const initialState = {
  loading: false,
  data: {
    explanation: '',
    hdurl: '',
    title: ''
  },
  error: null
}

const image = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_IMAGE' :
      return Object.assign({}, state, { loading: true })
    case 'SET_IMAGE' :
      return Object.assign({}, state, { data: action.data })
    case 'ERROR' :
      console.log(action.error);
      return Object.assign({}, state, { error: action.error })
    default :
      return state;
  }
}

export default image
