import {has, get} from 'lodash';

import ResponsiveMasonry from "./components/ResponsiveMasonry";
import Masonry from "./components/Masonary";
import {useCallback, useEffect, useState} from "react";
import ImageCard from "./components/ImageCard";


export default function App() {

    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const images = useImagesApiHandler(page, searchText);
    const scrollPosition = useScrollPosition(setPage);

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            setSearchText(event.target.value);
            setPage(1);
        }
    }

    const getNextPage = useCallback(() => {
        setPage(prev => {
            return prev + 1;
        })
    }, []);

    // Calls getNextPage when bottom of the view port is reached
    useOnReachViewportBottom(scrollPosition, getNextPage);

    return (
        <div className="main">
            <input className='search-box' placeholder='Search' onKeyUp={handleSearch}/>
            <div className="image-list">
                <ResponsiveMasonry columnsCountBreakPoints={{400: 1, 800: 2, 1200: 3}}>
                    <Masonry>
                        {images.map((image, index) => {
                            return <ImageCard key={image.id + index} image={image}/>;
                        })}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
            <button className='button' onClick={getNextPage}>Show more</button>
        </div>
    );
}

const useImagesApiHandler = (page, searchText) => {

    const [images, setImages] = useState([]);

    const apiUrl = useBuildApiUrl(page, searchText);
    const fetchedImages = useFetchImages(apiUrl)

    // When user searches for a new name, clear all old images fetches from array
    useEffect(() => {
        setImages([])
    }, [searchText])

    // When new images fetched append to the existing array
    useEffect(() => {
        setImages((prev) => {
            return [...prev, ...fetchedImages]
        })
    }, [fetchedImages, setImages])

    return images;
}

const useBuildApiUrl = (page, searchText, perPage = 20) => {

    const [apiUrl, seApiUrl] = useState("");

    useEffect(() => {

        const authQueryParams = "client_id=eXZJk7ov2lWxpiKvfH3e90W85ycxZCtdTh54ahJsJro";

        const baseUrl = `https://api.unsplash.com/`;

        const listPhotosUrl = `${baseUrl}/photos?`;
        const searchPhotosUrl = `${baseUrl}/search/photos?`;

        let finalApiUrl = listPhotosUrl;

        if (searchText.length > 0) {
            finalApiUrl = `${searchPhotosUrl}&query=${searchText}`;
        }

        seApiUrl(`${finalApiUrl}&${authQueryParams}&page=${page}&per_page=${perPage}`);

    }, [page, searchText, perPage])

    return apiUrl;
}

const useFetchImages = (apiUrl) => {

    const [fetchedImages, setFetchedImages] = useState([]);

    const getFormattedJsonFromApiResponse = (jsonResponse) => {
        return has(jsonResponse, 'results')
            ? get(jsonResponse, 'results', [])
            : jsonResponse;
    }

    useEffect(() => {
        (async () => {
            const apiResponse = await fetch(apiUrl);
            const jsonFromApi = await apiResponse.json()
            setFetchedImages(getFormattedJsonFromApiResponse(jsonFromApi));
        })();
    }, [apiUrl]);

    return fetchedImages;
}

const useScrollPosition = () => {

    let [scrollPosition, setScrollPosition] = useState('');

    const onScroll = () => {

        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;
        let modifier = 1000;

        if (currentScroll + modifier > documentHeight) {
            setScrollPosition("bottom");
            return;
        }

        setScrollPosition("not_bottom");
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [])

    return scrollPosition;
}

const useOnReachViewportBottom = (scrollPosition, callbackToRun) => {
    useEffect(() => {
        if (scrollPosition === "bottom") {
            callbackToRun();
        }
    }, [scrollPosition, callbackToRun]);
}


//
// OLD implementation. Keeping for reference, will delete in next few iterations
// import {useEffect, useState} from 'react';
// import './App.css';
// import Card from './components/Card';
// import ImageCard from './components/ImageCard';
// import Masonry from './components/Masonary';
// import ResponsiveMasonry from './components/ResponsiveMasonry';
//
// const useScrollPosition = () => {
//
//     let [scrollPosition, setScrollPosition] = useState('');
//
//     const onScroll = () => {
//
//         let documentHeight = document.body.scrollHeight;
//         let currentScroll = window.scrollY + window.innerHeight;
//         let modifier = 1000;
//
//         if (currentScroll + modifier > documentHeight) {
//             console.log('You are at the bottom!')
//             setScrollPosition("bottom");
//             return;
//         }
//
//         setScrollPosition("not_bottom");
//     }
//
//     useEffect(() => {
//         window.addEventListener('scroll', onScroll);
//         return () => window.removeEventListener('scroll', onScroll);
//     }, [])
//
//     return scrollPosition;
//
// }
//
//
// const useFetchImages = async (page = 1, searchText = "", perPage = 20) => {
//
//     const [fetchedImages, setFetchedImages] = useState([]);
//
//     const buildApiUrl = (page, perPage, searchText) => {
//
//         const authQueryParams = "client_id=eXZJk7ov2lWxpiKvfH3e90W85ycxZCtdTh54ahJsJro";
//
//         const baseUrl = `https://api.unsplash.com/`;
//
//         const listPhotosUrl = `${baseUrl}/photos?`;
//         const searchPhotosUrl = `${baseUrl}/search/photos?`;
//
//         let finalApiUrl = listPhotosUrl;
//
//         if (searchText.length > 0) {
//             finalApiUrl = `${searchPhotosUrl}&query=${searchText}`;
//         }
//
//         return `${finalApiUrl}&${authQueryParams}&per_page=${perPage}`;
//     }
//
//     useEffect(() => {
//
//         (async function fetchImages() {
//
//             const apiUrl = buildApiUrl(page, perPage, searchText)
//
//             const response = await fetch(`${apiUrl}&page=${page}`);
//
//             const imageList = await response.json();
//
//             let images;
//
//             if (imageList.length > 0) {
//                 images = imageList;
//             } else if (imageList && imageList.results && imageList.results.length > 0) {
//                 images = imageList.results;
//             }
//
//             setFetchedImages(images);
//
//         })();
//
//     }, [page, searchText, perPage])
//
//     return fetchedImages;
// };
//
// function App() {
//
//     const authUri = "client_id=eXZJk7ov2lWxpiKvfH3e90W85ycxZCtdTh54ahJsJro";
//
//     const perPage = 20;
//     const listBaseUrl = `https://api.unsplash.com/photos?${authUri}&per_page=${perPage}`;
//     const searchBaseUrl = `https://api.unsplash.com/search/photos?${authUri}&per_page=${perPage}`;
//
//     const buildApiUrl = () => {
//
//         let url = listBaseUrl;
//
//         if (searchText.length > 0) {
//             url = `${searchBaseUrl}&query=${searchText}`;
//         }
//
//         return url;
//     }
//
//     const fetchAndSetImages = async () => {
//
//         const response = await fetch(`${buildApiUrl()}&page=${page}`);
//
//         const imageList = await response.json();
//
//         let images = [];
//
//         if (imageList.length > 0) {
//             images = imageList;
//         } else if (imageList && imageList.results && imageList.results.length > 0) {
//             images = imageList.results;
//         }
//
//         if (images.length > 0) {
//             setImages(prev => {
//                 return [...prev, ...images];
//             })
//         }
//     }
//
//
//     const [searchText, setSearchText] = useState("");
//     const [images, setImages] = useState([]);
//     const [page, setPage] = useState(1);
//     const scrollPosition = useScrollPosition();
//
//
//     const handleSearch = (event) => {
//         if (event.key === 'Enter') {
//             setImages([]);
//             setSearchText(event.target.value);
//             setPage(1);
//         }
//     }
//
//     useEffect(() => {
//
//         fetchAndSetImages();
//
//     }, [page, searchText, setImages]);
//
//     useEffect(() => {
//         if (scrollPosition === "bottom") {
//             showMoreImages();
//         }
//     }, [scrollPosition])
//
//     const showMoreImages = () => {
//         setPage(prev => {
//             console.log(prev);
//             return prev + 1;
//         })
//     }
//
//
//     return (
//         <div className="main">
//
//             <input className='search-box' placeholder='Search' onKeyUp={handleSearch}/>
//
//             <div className="image-list">
//
//                 <ResponsiveMasonry columnsCountBreakPoints={{
//                     400: 1,
//                     800: 2,
//                     1200: 3
//                 }}>
//                     <Masonry>
//                         {
//                             images.map((image, index) => {
//                                 return (
//                                     <ImageCard key={image.id} image={image}/>
//                                 );
//                             })
//                         }
//                     </Masonry>
//                 </ResponsiveMasonry>
//
//
//             </div>
//
//             <button className='button' onClick={showMoreImages}>Show more</button>
//         </div>
//     );
//
// }
//
// export default App;
