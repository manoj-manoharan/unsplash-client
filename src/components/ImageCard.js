
const ImageCard = ({ image }) => {
    return (
        <>
            <img src={image.urls.regular}  alt={image.urls.alt_description}/>
        </>
    );
}

export default ImageCard;