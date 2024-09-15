'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ArrowLeft, MapPin, Globe, DollarSign, Star, Users, Truck, Clock } from 'lucide-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Label from '@radix-ui/react-label'
import { twMerge } from 'tailwind-merge'
import { GetServerSideProps } from 'next'
import axios from 'axios'

interface Restaurant {
    restaurant_id: number
    restaurant_name: string
    cuisines: string
    menu_url: string
    price_range: number
    average_cost_for_two: number
    currency: string
    has_online_delivery: number
    is_delivering_now: number
    location: {
        address: string
        locality: string
        city: string
        city_id: number
        zipcode: string
        country_name: string
        locality_verbose: string
        coordinates: [number, number]
    }
    user_rating: {
        aggregate_rating: string
        votes: string
        rating_text: string
        thumbnail: string
    }
}

export default function RestaurantDetails() {
    const router = useRouter()
    const { restaurant_id } = router.query
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push('/')
        }
    }

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getRestaurantByID/${restaurant_id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurant data')
                }
                const data = await response.json()
                setRestaurant(data)
            } catch (err) {
                setError('An error occurred while fetching restaurant data')
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurant()
    }, [restaurant_id])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    }

    if (!restaurant) {
        return <div className="flex justify-center items-center h-screen">Restaurant not found</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 p-4 text-gray-700 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
                <div className="bg-[#ff5252] text-white p-6">
                    <h1 className="text-3xl font-bold">{restaurant.restaurant_name}</h1>
                    <p className="text-lg mt-2">{restaurant.cuisines}</p>
                    {/* Add the restaurant's cover image */}
                    {restaurant.user_rating.thumbnail && (
                        <img
                            src={restaurant.user_rating.thumbnail}
                            alt={`${restaurant.restaurant_name} cover`}
                            className="mt-4 w-full h-64 object-cover rounded-lg"
                        />
                    )}
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center space-x-2">
                        <MapPin className="text-[#ff5252]" />
                        <p>{restaurant.location.address}, {restaurant.location.locality}, {restaurant.location.city}, {restaurant.location.country_name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Globe className="text-[#ff5252]" />
                        <a href={restaurant.menu_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            View Menu
                        </a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DollarSign className="text-[#ff5252]" />
                        <p>Price Range: {Array(restaurant.price_range).fill('$').join('')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="text-[#ff5252]" />
                        <p>Average Cost for Two: {restaurant.currency} {restaurant.average_cost_for_two}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Star className="text-[#ff5252]" />
                        <p>Rating: {restaurant.user_rating.aggregate_rating} ({restaurant.user_rating.votes} votes)</p>
                        <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                            {restaurant.user_rating.rating_text}
                        </span>
                    </div>
                    <div className="flex space-x-4">
                        <Label.Root className="flex items-center">
                            <Checkbox.Root
                                className={twMerge(
                                    "w-5 h-5 rounded border border-gray-300",
                                    restaurant.has_online_delivery === 1 && "bg-green-500"
                                )}
                                checked={restaurant.has_online_delivery === 1}
                                disabled
                            >
                                <Checkbox.Indicator>
                                    <Truck className="text-white w-4 h-4" />
                                </Checkbox.Indicator>
                            </Checkbox.Root>
                            <span className="ml-2 text-sm">Online Delivery Available</span>
                        </Label.Root>
                        <Label.Root className="flex items-center">
                            <Checkbox.Root
                                className={twMerge(
                                    "w-5 h-5 rounded border border-gray-300",
                                    restaurant.is_delivering_now === 1 && "bg-blue-500"
                                )}
                                checked={restaurant.is_delivering_now === 1}
                                disabled
                            >
                                <Checkbox.Indicator>
                                    <Clock className="text-white w-4 h-4" />
                                </Checkbox.Indicator>
                            </Checkbox.Root>
                            <span className="ml-2 text-sm">Delivering Now</span>
                        </Label.Root>
                    </div>
                </div>
            </div>
        </div>
    )
}
