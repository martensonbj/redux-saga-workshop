import { connect } from 'react-redux';

const mapStateToProps = ({ image }) => ({
  image,
});

export default connect(mapStateToProps, null);
