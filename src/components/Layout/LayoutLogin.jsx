import PropTypes from 'prop-types';
import iconeHumain from './../../assets/img/icone-humain.svg'; 

const LayoutLogin = ({ title, children }) => {
  return (
    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-login">
      <div className=" card-wrapper relative overflow-hidden rounded-3xl h-[400px] w-[400px] ">
        <div className=" flex justify-center items-center absolute left-[1px] top-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] rounded-3xl bg-white/10 border border-white shadow-2xl">
          <div className="flex flex-col absolute top-1 m-4">
            <div className="w-16 h-16 rounded-full bg-brandblue flex justify-center items-center">
              <img alt="Axione" src={iconeHumain} className="h-9 w-auto" />
            </div>
            <h1 className="text-center text-2xl font-bold text-brandblue mt-2">{title}</h1>
          </div>
    
            {children}
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