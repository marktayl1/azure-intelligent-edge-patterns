import React, { useState, useEffect } from 'react';
import { Flex, Dropdown, Text, DropdownItemProps } from '@fluentui/react-northstar';
import { Link, useParams, Prompt } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useCameras } from '../../hooks/useCameras';
import { State } from '../../store/State';
import { Camera } from '../../store/camera/cameraTypes';
import LabelingPageDialog from '../LabelingPageDialog';
import LabelDisplayImage from '../LabelDisplayImage';
import { RTSPVideo } from '../RTSPVideo';
import { getLabelImages } from '../../store/image/imageActions';
import { LabelImage } from '../../store/image/imageTypes';
import { getFilteredImages } from '../../util/getFilteredImages';

export const CapturePhotos: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera>(null);
  const { partId } = useParams();

  return (
    <>
      <CameraSelector setSelectedCamera={setSelectedCamera} />
      <RTSPVideo selectedCamera={selectedCamera} partId={partId} canCapture={true} />
      <CapturedImagesContainer partId={parseInt(partId, 10)} />
    </>
  );
};

const CameraSelector = ({ setSelectedCamera }): JSX.Element => {
  const availableCameras = useCameras();

  const items: DropdownItemProps[] = availableCameras.map((ele) => ({
    header: ele.name,
    content: {
      key: ele.id,
    },
  }));

  const onDropdownChange = (_, data): void => {
    const { key } = data.value.content;
    const selectedCamera = availableCameras.find((ele) => ele.id === key);
    if (selectedCamera) setSelectedCamera(selectedCamera);
  };

  return (
    <Flex gap="gap.small" vAlign="center">
      <Text>Select Camera</Text>
      <Dropdown items={items} onChange={onDropdownChange} />
      <Link to="/addCamera">Add Camera</Link>
    </Flex>
  );
};

const CapturedImagesContainer = ({ partId }): JSX.Element => {
  const dispatch = useDispatch();
  const images = useSelector<State, LabelImage[]>((state) => state.images).filter((image) => !image.is_relabel);
  const filteredImages = getFilteredImages(images, { partId, isRelabel: false });
  const isValid = filteredImages.filter((image) => image.labels).length >= 15;

  useEffect(() => {
    dispatch(getLabelImages());
  }, [dispatch]);

  const imageCount = filteredImages.length;

  return (
    <>
      <Text>Total: {imageCount}</Text>
      {!isValid && <Text error>*Please capture and label more then 15 images</Text>}
      <Flex
        styles={{
          overflow: 'scroll',
          border: '1px solid grey',
          height: '150px',
          borderColor: isValid ? '' : 'red',
        }}
        gap="gap.small"
        vAlign="center"
      >
        {filteredImages.map((image, i) => (
          <div key={image.id}>
            <span>{i + 1}</span>
            <LabelingPageDialog
              key={i}
              imageIndex={i}
              partId={partId}
              trigger={<LabelDisplayImage labelImage={image} pointerCursor width={200} height={150} />}
              isRelabel={false}
            />
          </div>
        ))}
      </Flex>
      <Prompt
        when={imageCount < 15}
        message="The count of images is less than 15, which may cause error when configure part identification. Sure you want to leave?"
      />
    </>
  );
};
