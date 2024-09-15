import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Button } from "../components/ui/button";
import Image, { ImageProps } from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import RestaurantSearch from "../components/ui/search";
import { FastForwardIcon } from 'lucide-react';
import styles from '../styles/customButton.module.css';

interface Restaurant {
    _id: string;
    restaurant_id: number;
    restaurant_name: string;
    cuisines: string;
    user_rating: {
        aggregate_rating: string;
        votes: string;
        rating_text: string;
        thumbnail: string;
    };
}

interface ApiResponse {
    page: number;
    totalRestaurants: number;
    totalPages: number;
    restaurants: Restaurant[];
}

export default function HomePage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5]);
    const [isLoading, setIsLoading] = useState(false);
    const [distance, setDistance] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchActive, setSearchActive] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [filters, setFilters] = useState({
        byName: true,
        byCuisine: false,
        byCountry: false,
    });

    const ImageWithFallback = ({ src, alt, ...props }: ImageProps) => {
        const [imgSrc, setImgSrc] = useState(src);
        const [useImage, setUseImage] = useState(true);

        useEffect(() => {
            setImgSrc(src);
            setUseImage(true);
        }, [src]);

        const onError = () => {
            if (imgSrc !== '/images/logo.png') {
                setImgSrc('/images/logo.png');
            } else {
                setUseImage(false);
            }
        };

        if (useImage) {
            return (
                <Image
                    {...props}
                    src={imgSrc}
                    alt={alt}
                    onError={onError}
                />
            );
        }

        return <img {...props} src={imgSrc as string} alt={alt} />;
    };

    // Filter logic for checkboxes (only one checkbox allowed at a time)
    const handleFilterChange = (filterKey: 'byName' | 'byCuisine' | 'byCountry') => {
        setFilters({
            byName: filterKey === 'byName',
            byCuisine: filterKey === 'byCuisine',
            byCountry: filterKey === 'byCountry',
        });
    };
    // Handle distance input
    const handleDistanceChange = (value: string) => {
        if (value === '' || (/^\d+(\.\d+)?$/.test(value) && parseFloat(value) >= 0)) {
            setDistance(value);
            if (value !== '') {
                // Clear other filters if distance is applied
                setFilters({ byName: false, byCuisine: false, byCountry: false });
                setMinPrice('');
                setMaxPrice('');
            }
        }
    };

    // Handle price range input
    const handlePriceChange = (min: string, max: string) => {
        setMinPrice(min);
        setMaxPrice(max);
        if (min !== '' || max !== '') {
            setFilters({ byName: false, byCuisine: false, byCountry: false });
            setDistance('');
        }
    };

    // Handle image input
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        setIsImageUploading(true);
        setHasError(false);
        setRestaurants([]);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getCuisinesByImage?page=1`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log(data);

            if (response.ok && data.restaurants && data.restaurants.length > 0) {
                setRestaurants(data.restaurants);
                setTotalPages(data.totalPages || 1);
                setVisiblePages(getVisiblePages(1, data.totalPages || 1));
                setCurrentPage(1);
            } else {
                setHasError(true);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setHasError(true);
        } finally {
            setIsImageUploading(false);
        }
    }

    useEffect(() => {
        fetchRestaurants(currentPage);
    }, [currentPage, distance, latitude, longitude, minPrice, maxPrice, searchTerm, filters, searchActive]);

    const fetchRestaurants = async (page: number) => {
        setIsLoading(true);
        setHasError(false);
        try {
            let response;
            if (searchActive) {
                const params = {
                    page,
                    limit: 20,
                    distance,
                    latitude,
                    longitude,
                    minPrice,
                    maxPrice,
                    name: filters.byName ? searchTerm : '',
                    cuisine: filters.byCuisine ? searchTerm : '',
                    countryName: filters.byCountry ? searchTerm : ''
                };
                response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getRestaurantsByFilter`, { params });
            } else {
                response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllRestaurants/${page}`);
            }

            if (response.status === 200 && response.data.restaurants && response.data.restaurants.length > 0) {
                setRestaurants(response.data.restaurants);
                setTotalPages(response.data.totalPages);
                setVisiblePages(getVisiblePages(page, response.data.totalPages));
            } else {
                setHasError(true);
                setRestaurants([]);
                setTotalPages(1);
                setVisiblePages([1]);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setHasError(true);
            setRestaurants([]);
            setTotalPages(1);
            setVisiblePages([1]);
        } finally {
            setIsLoading(false);
        }
    };

    const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
        const numPages = 5;
        const pages: number[] = [];

        const startPage = Math.max(1, currentPage - Math.floor(numPages / 2));
        const endPage = Math.min(totalPages, startPage + numPages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };


    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSearchActive(false);
        }
    };

    const handleFastForward = () => {
        const nextPage = Math.min(totalPages, visiblePages[visiblePages.length - 1] + 1);
        handlePageChange(nextPage);
    };

    const onSearch = () => {
        setSearchActive(true);
        setCurrentPage(1);
        fetchRestaurants(1);
    };

    return (
        <div className="flex flex-col min-h-screen mx-4 sm:mx-8 md:mx-16 lg:mx-24">
            <header className="flex justify-center items-center p-4 bg-white mt-4">
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={180}
                    height={180}
                    style={{ display: 'block' }}
                />
            </header>

            {/* Container for Search and Image */}
            <div className="flex items-start p-4">
                <div className="flex-1">
                    <RestaurantSearch
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        distance={distance}
                        setDistance={handleDistanceChange}
                        latitude={latitude}
                        setLatitude={setLatitude}
                        longitude={longitude}
                        setLongitude={setLongitude}
                        minPrice={minPrice}
                        setMinPrice={(value) => handlePriceChange(value, maxPrice)}
                        maxPrice={maxPrice}
                        setMaxPrice={(value) => handlePriceChange(minPrice, value)}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onSearch={onSearch}
                        onImageUpload={handleImageUpload}
                    />
                </div>
            </div>

            {/* Main content */}
            <main className="flex-grow container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Popular Restaurants</h1>
                {isLoading || isImageUploading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : hasError || restaurants.length === 0 ? (
                    <div className="text-center text-gray-500 text-xl">
                        No restaurants found. Please try a different search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {restaurants.map((restaurant) => (
                            <Card key={restaurant._id} className="flex flex-col">
                                <ImageWithFallback
                                    src={restaurant.user_rating.thumbnail || "/images/logo.png"}
                                    alt={restaurant.restaurant_name}
                                    width={400}
                                    height={300}
                                    className="w-full h-48 object-cover"
                                />
                                <CardHeader>
                                    <CardTitle className="text-lg">{restaurant.restaurant_name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">{restaurant.cuisines}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-yellow-500 mr-1">★</span>
                                        <span>{restaurant.user_rating.aggregate_rating}</span>
                                        <span className="text-gray-500 text-sm ml-2">({restaurant.user_rating.votes} votes)</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/restaurant/${restaurant.restaurant_id}`} passHref>
                                        <Button variant="outline" className="w-full">Details</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>


            {/* Pagination */}
            {!isLoading && !isImageUploading && !hasError && restaurants.length > 0 && (
                <div className="bg-muted py-4">
                    <div className="container mx-auto flex justify-center items-center space-x-2 flex-wrap">
                        {currentPage > 1 && (
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={isLoading}
                                className={styles.comicButton}
                            >
                                Previous
                            </button>
                        )}
                        {visiblePages.map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                disabled={isLoading}
                                className={`${styles.comicButton} ${currentPage === page ? styles.comicButtonActive : ''}`}
                            >
                                {page}
                            </button>
                        ))}
                        {currentPage < totalPages && (
                            <button
                                onClick={handleFastForward}
                                disabled={isLoading}
                                className={styles.comicButton}
                            >
                                <FastForwardIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
