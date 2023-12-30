import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useState } from 'react';

const Landing = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleDrop = (acceptedFiles: File[] ) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
    setSelectedImages((prevImages) => [...prevImages, ...acceptedFiles]);
  };

  //handle image submission
  const handleUpload = async () => {

      try {
        //checks if no images were uploaded
        if(images.length < 1){
          return console.log('Please upload at least one image')
        }
        //limits users to 4 images at most
        if(images.length > 4){
          return console.log('Max four images for free account')
        }   

        const formData: FormData = new FormData();
        formData.append('imageName', 'ggh');
    
        for (let i = 0; i < images.length; i++) {
          formData.append(`images`, images[i]);
        }

        const formResponse = await axios.post('http://localhost:3300/api/uploadimages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJfaWQiOiI2NThiMmI3NDEzYmI5YTRhM2VjNGViZjkiLCJ1c2VybmFtZSI6ImdyZWciLCJlbWFpbCI6ImdyZWdAZ3JlZy5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRZbjNxVVhabEFjdkM1T1laQktKS3RlalpIQ0cwQ1ZJaEdFcmdoWXZuLmZhbGR4SzFhcG1CaSIsImRhdGUiOiIyMDIzLTEyLTI2VDE5OjM3OjI0LjgxNFoiLCJfX3YiOjB9LCJpYXQiOjE3MDM2Mjg2NDAsImV4cCI6MTcwNjIyMDY0MH0.D_XbdcLb5U0D8SFR14VK3UpsCEIMU4Xym5Sc7JMMrkk'
          },
        })

        if(formResponse.status){
            console.log(formResponse)
        }else{
            console.log('failed')
        }

      } catch (error) {
        console.log(error)
      }

  }

  return (
    <div>
      <Dropzone onDrop={handleDrop} accept="image/*" multiple>
          {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="relative max-w-[290px] h-[70px] border border-black rounded-md">
                  <input className='' {...getInputProps()} />
                  <p className='text-[18px] w-full text-center font-[550]'>Drag & Drop </p>
                  <p className='w-full text-center text-[15px]'>or select image files from device</p>
              </div>
          )}
      </Dropzone>

      {selectedImages.length > 0 && (
        <div className='relative flex justify-center items-center space-x-3'>
            <h4 className='text-black'>Selected Images:</h4>
            {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`${image}`}
                  className="relative w-[90px] h-[90px]"
                />
            ))}
        </div>
      )} 

      <button className='bg-[#1c1c1c] text-white border-[#1c1c1c] rounded-md flex justify-center items-center text-center w-full h-[40px] hover:cursor-pointer hover:bg-[#3c3c3c] hover:transition-all' onClick={handleUpload}>Upload</button>
    </div>
  )
}

export default Landing
