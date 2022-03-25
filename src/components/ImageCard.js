
const ImageCard = ({ image }) => {
    return (
        <>
            <img src={image.urls.small}  alt={image.urls.alt_description}/>
        </>
    );
}

export default ImageCard;