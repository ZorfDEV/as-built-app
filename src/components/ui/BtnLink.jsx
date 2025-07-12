import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const BtnLink =({to,actionName, icon,className})=>{

    return (
        <div>
        <Link to={to} className={className}>{icon}<span>{actionName}</span></Link>
        </div>
    )
}

BtnLink.propTypes = {
    to: PropTypes.string,
    actionName: PropTypes.string,
    className:PropTypes.string,
    icon: PropTypes.element,
};
  
export default BtnLink; 