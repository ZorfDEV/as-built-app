import PropTypes from 'prop-types';
import iconeHumain from './../../assets/img/icone-humain.svg'; 

const LayoutLogin = ({ title, children }) => {
  return (
    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-login">
      <div className=" card-wrapper relative overflow-hidden rounded-3xl h-[400px] w-[400px] ">
        <div className=" flex justify-center items-center absolute left-[1px] top-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] rounded-3xl bg-white border border-white shadow-2xl">
          <div className="justify-center items-center absolute top-10 mb-6">
            <div className="w-16 h-16 mt-0 rounded-full bg-blue-950  justify-center flex items-center">
              <img alt="Axione" src={iconeHumain} className="h-9 w-auto" />
            </div>
          </div>
          <div className=" w-full justify-center items-center top-10 absolute px-3 py-2">
            <p className="text-center text-2xl text-blue-950 font-medium">
              {title}
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

LayoutLogin.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default LayoutLogin;