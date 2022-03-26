import {get} from "lodash";

const ImageCard = ({ image }) => {
    return (
        <>
            <img
                src={get(image, 'urls.regular', "")}
                alt={get(image, 'urls.alt_description', "Image")}
            />
        </>
    );
}

export default ImageCard;