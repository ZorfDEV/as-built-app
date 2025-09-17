import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CardAuth = ({ footerContent,  children, title = '',logoItem, className = ''}) => {

     const navigate = useNavigate();
    

    return (
        <div className={`min-h-screen flex items-center bg-login justify-center dark:from-gray-900 dark:to-gray-800 p-6${className}`}>
      <div className="max-w-md w-full">
        {/* Card with translucent backdrop */}
        <div className="backdrop-blur-sm bg-white dark:bg-gray-900/60 border border-white/30 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* Header: logo + title */}
            <div className="flex flex-col items-center gap-4 ">
                {/* Replace inline SVG or <img> with your logo */}
                {logoItem }
            
              <div>
                <h1 className="text-xl font-semibold text-[#25335c] dark:text-gray-100">{title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 hidden"></p>
              </div>
            </div>
             {children}
          
            {/* Footer / small help */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              
                <button onClick={() => navigate('/dashboard/resetpassword')} className="text-[#25335c] hover:underline">
                  Mot de passe oublié ?
                </button>
              
            </div>
          </div>
        </div>

        {/* subtle legal / copyright */}
        <div className="mt-4 text-center text-xs text-gray-500">
          {footerContent }
        </div>
      </div>
    </div>
    );
}
 
CardAuth.propTypes = {
  footerContent: PropTypes.node,
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  logoItem: PropTypes.node,
  noPadding: PropTypes.bool
};
export default CardAuth;