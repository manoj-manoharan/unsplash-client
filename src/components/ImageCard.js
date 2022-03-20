import { useState } from 'react';
import getWindowDimensions from '../lib/window-dimensions';

const ImageCard = ({ image }) => {
    return (
        <>
            <img src={image.urls.regular} />
        </>
    );
}

export default ImageCard;