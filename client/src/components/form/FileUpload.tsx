import { Backdrop, Button, Stack } from '@mui/material';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop'; // we will create this function later
import MyImage from 'src/components/common/Image';
import { getLocalImage } from 'src/utils/imageUtils';

async function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob as Blob], 'newFile.jpeg', { type: 'image/jpeg' }));
    }, 'image/jpeg');
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

type CropType = {
  x: number;
  y: number;
};

type FileUploadProps = {
  onSelectComplete?: (file: File) => void;
};

const FileUpload = ({ onSelectComplete }: FileUploadProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImageSrc(reader.result as string)
      );
      reader.readAsDataURL(e.target.files[0]);
      setIsCropping(true);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const makeCroppedImage = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(URL.createObjectURL(croppedImage));
      setIsCropping(false);

      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Make sure to include the '.jpeg' extension in the filename
      const croppedFile = new File([blob], 'filename.jpeg', {
        type: 'image/jpeg',
      });

      onSelectComplete && onSelectComplete(croppedFile);
    }
  };

  return (
    <Stack gap="10px">
      {isCropping && imageSrc && (
        <Backdrop
          open
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Stack>
            <Stack
              sx={{
                position: 'relative',
                width: { xs: '90vw', sm: '600px' },
                height: { xs: '90vw', sm: '600px' },
              }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </Stack>
            <Button variant="contained" onClick={makeCroppedImage}>
              Seç
            </Button>
          </Stack>
        </Backdrop>
      )}
      <Stack justifyContent="center" alignItems="center" gap="20px">
        {croppedImage && (
          <MyImage
            src={croppedImage ?? getLocalImage('default-avatar.png')}
            alt="Cropped"
            width="150px"
            height="150px"
            sx={{
              borderRadius: '20px',
              boxShadow:
                'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
            }}
          />
        )}
        <Button variant="contained" component="label">
          Resim Yükle
          <input hidden type="file" name="file" onChange={onFileChange} />
        </Button>
      </Stack>
    </Stack>
  );
};

export default FileUpload;
