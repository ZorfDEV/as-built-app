import React from 'react'
//import { BsCloudUpload } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
const InputFile = ( 
    { name, label, onChange, accept, file }
) => {
  return (
    <div className="flex items-center justify-center w-full">
        <div>
                            <div className="mt-2 flex justify-center rounded-lg  border-dashed
                             border-gray-900/25 px-6 py-6 dark:border-darkborder border-2 hover:border-brandgreen hover:scale-105 hover:text-brandgreen duration-300 transition ease-in w-60 h-10">
                                <div className="flex justify-center items-center flex-row gap-2">
                            
                                    <div className="flex justify-center items-center text-sm/6 ">
                                      <label
                                        htmlFor="file-upload"
                                        className="flex justify-center items-center flex-row gap-2 cursor-pointer rounded-md  font-semibold"
                                      ><span className='flex gap-2'>
                                        <CiImageOn aria-hidden="true" className="h-5 w-5"/>{label}</span>
                                        <input id="file-upload" name={name}  accept={accept} onChange={onChange} type="file" className="sr-only" />
                                      </label>
                                    </div>
                                    <p className="text-xs/5 text-gray-600 dark:text-darktext-secondary">png, up to 10MB</p>
                                  </div>
                                </div>
        
                  {file && (
                    <p className="text-sm text-gray-600 mt-2">
                      Fichier sélectionné : {file.name}
                    </p>
                  )}
        </div>
    </div>
  )
}

export default InputFile    