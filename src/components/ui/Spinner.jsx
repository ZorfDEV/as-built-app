import { InfinitySpin } from 'react-loader-spinner';

function LoadingInfinitySpinner() {
    return (
     <div className='translate-all p-4 flex-1'>
        <InfinitySpin
  visible={true}
  width="200"
  color="#00EDA6"
  ariaLabel="infinity-spin-loading"
  />
  </div>
  )
}
export default LoadingInfinitySpinner
