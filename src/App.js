import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card';
import ImageCard from './components/ImageCard';
import Masonry from './components/Masonary';
import ResponsiveMasonry from './components/ResponsiveMasonry';

const useScrollPosition = () => {

  let [scrollPosition, setScrollPosition] = useState('');

  const onScroll = () => {

    let documentHeight = document.body.scrollHeight;
    let currentScroll = window.scrollY + window.innerHeight;
    let modifier = 500;

    if (currentScroll + modifier > documentHeight) {
      console.log('You are at the bottom!')
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

function App() {

  const authUri = "client_id=eXZJk7ov2lWxpiKvfH3e90W85ycxZCtdTh54ahJsJro";

  const perPage = 20;
  const listBaseUrl = `https://api.unsplash.com/photos?${authUri}&per_page=${perPage}`;
  const searchBaseUrl = `https://api.unsplash.com/search/photos?${authUri}&per_page=${perPage}`;

  const buildApiUrl = () => {

    let url = listBaseUrl;

    if (searchText.length > 0) {
      url = `${searchBaseUrl}&query=${searchText}`;
    }

    return url;
  }

  const fetchAndSetImages = async () => {

    const response = await fetch(`${buildApiUrl()}&page=${page}`);

    const imageList = await response.json();

    let images = [];

    if (imageList.length > 0) {
      images = imageList;
    } else if (imageList && imageList.results && imageList.results.length > 0) {
      images = imageList.results;
    }

    if (images.length > 0) {
      setImages(prev => {
        return [...prev, ...images];
      })
    }
  }


  
  const [searchText, setSearchText] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const scrollPosition = useScrollPosition();


  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setImages([]);
      setSearchText(event.target.value);
      setPage(1);
    }
  }

  useEffect(() => {

    fetchAndSetImages();

  }, [page, searchText, setImages]);

  useEffect(() => {
    if (scrollPosition === "bottom") {
      showMoreImages();
    }
  }, [scrollPosition])

  const showMoreImages = () => {
    setPage(prev => {
      console.log(prev);
      return prev + 1;
    })
  }


  return (
    <div className="main">

      <input className='search-box' placeholder='Search' onKeyUp={handleSearch} />

      <div className="image-list">

        <ResponsiveMasonry >
          <Masonry>
            {
              images.map((image, index) => {
                return (
                  <ImageCard key={image.id} image={image} />
                );
              })
            }
          </Masonry>
        </ResponsiveMasonry>


      </div>

      <button className='button' onClick={showMoreImages}>Show more</button>
    </div>
  );

}

export default App;
