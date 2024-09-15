import React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Checkbox } from "./checkbox"
import { Label } from "./label"
import { SearchIcon, FilterIcon, CameraIcon } from 'lucide-react'

export default function RestaurantSearch({
    filters,
    onFilterChange,
    distance,
    setDistance,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    searchTerm,
    setSearchTerm,
    onSearch,
    onImageUpload // New prop to handle image upload in the homepage
}) {
    const [showFilters, setShowFilters] = React.useState(false);

    const handleNumberInput = (value, setter) => {
        if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
            setter(value);
        }
    };

    const handleCheckboxChange = (filterKey) => {
        onFilterChange(filterKey);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImageUpload(file);
        }
    };

    return (
        <div className="bg-muted py-4">
            <div className="container mx-auto flex flex-col items-center space-y-4">
                <div className="flex justify-center items-center space-x-4 w-full max-w-2xl">
                    <Input
                        type="text"
                        placeholder="Search restaurants, cuisines..."
                        className="flex-grow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        variant="secondary"
                        className="w-12 h-12 p-0 flex items-center justify-center rounded-md"
                        onClick={onSearch}
                    >
                        <SearchIcon className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="outline"
                        className="w-12 h-12 p-0 flex items-center justify-center rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FilterIcon className="h-5 w-5" />
                    </Button>
                    <label className="flex items-center">
                        <Button
                            variant="outline"
                            className="w-12 h-12 p-0 flex items-center justify-center rounded-md"
                            onClick={() => {
                                const fileInput = document.getElementById("fileInput") as HTMLInputElement | null;
                                if (fileInput) {
                                    fileInput.click();
                                }
                            }}
                        >
                            <CameraIcon className="h-5 w-5" />
                        </Button>
                        <Input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept=".jpeg, .png, .jpg"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {showFilters && (
                    <div className="bg-background p-4 rounded-md shadow-md w-full max-w-2xl">
                        <div className="flex flex-wrap -mx-2">
                            <div className="w-1/2 px-2 mb-4">
                                <h3 className="font-semibold mb-2">Search by</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="byName"
                                            checked={filters.byName}
                                            onCheckedChange={() => handleCheckboxChange('byName')}
                                        />
                                        <Label htmlFor="byName" className="cursor-pointer">By Name</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="byCuisine"
                                            checked={filters.byCuisine}
                                            onCheckedChange={() => handleCheckboxChange('byCuisine')}
                                        />
                                        <Label htmlFor="byCuisine" className="cursor-pointer">By Cuisine</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="byCountry"
                                            checked={filters.byCountry}
                                            onCheckedChange={() => handleCheckboxChange('byCountry')}
                                        />
                                        <Label htmlFor="byCountry" className="cursor-pointer">By Country</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="w-1/2 px-2 mb-4">
                                <h3 className="font-semibold mb-2">Distance and Location</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="text"
                                            value={distance}
                                            onChange={(e) => setDistance(e.target.value)}
                                            placeholder="Distance"
                                            className="w-24"
                                        />
                                        <span>km</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => handleNumberInput(e.target.value, setLatitude)}
                                            placeholder="Latitude"
                                            className="w-1/2"
                                        />
                                        <Input
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => handleNumberInput(e.target.value, setLongitude)}
                                            placeholder="Longitude"
                                            className="w-1/2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-1/2 px-2">
                                <h3 className="font-semibold mb-2">Price range</h3>
                                <div className="flex space-x-2">
                                    <Input
                                        type="text"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min"
                                    />
                                    <Input
                                        type="text"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
