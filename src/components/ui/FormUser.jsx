import PropTypes from 'prop-types';
import Card from './Card';
import userAxione from '../assets/img/light-axione-logo.svg';

const FormUser = ({ title, children }) => {
  return (
    <div className="flex mr-6 ml-6">
      <Card className="w-full">
        <div className="relative h-32 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: "url('https://assets.datamation.com/uploads/2023/12/dm_20231214-network-data-model-1024x658.png')" }}>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
            {/* Profile Picture */}
            <img
              src={userAxione}
              alt="Profile"
              className="h-20 w-20 rounded-full border-2 border-white"
            />
          </div>
        </div>
        <div className='line1 flex mt-20 justify-center items-center bg-white'>
          <h3 className='text-blue-primary'>{title}</h3>
        </div>
        <div className='line2 flex justify-center items-center mr-20 mb-10 ml-20 border border-gray-200'>
          {children}
        </div>
      </Card>
    </div>
  );
};

FormUser.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FormUser;