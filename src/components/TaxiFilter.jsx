import React, { useState, useEffect } from "react";

const TaxiFilter = ({ vehicles, onFilterChange }) => {
  const minPrice = Math.min(...vehicles.map((v) => v.perKm));
  const maxPrice = Math.max(...vehicles.map((v) => v.perKm));
  const availableModels = [...new Set(vehicles.map((v) => v.model))];
  const availableFuelTypes = [...new Set(vehicles.map((v) => v.fuelType))];
  const availableCarTypes = [
    ...new Set(vehicles.map((v) => v.carType).filter(Boolean)),
  ];

  const [filters, setFilters] = useState({
    priceRange: { min: minPrice, max: maxPrice },
    selectedModels: [],
    selectedFuelTypes: [],
    selectedCarTypes: [],
  });

  // Initialize filters with actual min/max prices when component mounts
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min: minPrice, max: maxPrice },
    }));
  }, [minPrice, maxPrice]);

  const handlePriceChange = (e, type) => {
    const value = e.target.value;

    // Allow empty input while typing
    if (value === "") {
      setFilters((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [type]: type === "min" ? minPrice : maxPrice,
        },
      }));
      return;
    }

    const numValue = Number(value);

    // Update local state
    const newFilters = {
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: numValue,
      },
    };

    setFilters(newFilters);

    // Only trigger filter if the range is valid
    if (type === "min" && numValue <= newFilters.priceRange.max) {
      onFilterChange(newFilters);
    } else if (type === "max" && numValue >= newFilters.priceRange.min) {
      onFilterChange(newFilters);
    }
  };

  const handleCheckboxChange = (type, value) => {
    const newFilters = { ...filters };
    const selectedArray = newFilters[`selected${type}`];
    const index = selectedArray.indexOf(value);

    if (index === -1) {
      selectedArray.push(value);
    } else {
      selectedArray.splice(index, 1);
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="">
      <h1 className="text-black text-2xl font-semibold text-left">Filters</h1>
      <div className="w-[80%] h-[1px] bg-gray-300 mt-4"></div>

      {/*Price filter */}
      <div className="mt-6 mb-4">
        <h1 className="text-base font-semibold text-left text-gray-900">
          Price (LKR per km)
        </h1>
        <div className="text-[10px] text-gray-500  mb-3">
          Range: LKR {minPrice.toFixed(2)} - LKR {maxPrice.toFixed(2)}
        </div>
        <div className="flex gap-4 sm:gap-0">
          <div className="relative w-full">
            <input
              type="number"
              min={minPrice}
              max={filters.priceRange.max}
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange(e, "min")}
              className="w-full sm:w-2/3 p-2 border border-gray-300 rounded text-black"
              placeholder="Min"
            />
          </div>
          <div className="relative w-full">
            <input
              type="number"
              min={filters.priceRange.min}
              max={maxPrice}
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange(e, "max")}
              className="w-full sm:w-2/3 p-2 border border-gray-300 rounded text-black"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
      <div className="w-[80%] h-px bg-gray-300 mt-2"></div>

      {/* Model filter */}
      {availableModels.length > 0 && (
        <div className="my-6">
          <h3 className="font-semibold text-base mb-3 text-left text-gray-900">
            Model
          </h3>
          <div className="space-y-3">
            {availableModels.map((model) => (
              <div key={model} className="flex items-center">
                <input
                  type="checkbox"
                  id={`model-${model}`}
                  checked={filters.selectedModels.includes(model)}
                  onChange={() => handleCheckboxChange("Models", model)}
                  className="w-5 h-5 border-2 border-gray-300 rounded mr-3 cursor-pointer"
                />
                <label
                  htmlFor={`model-${model}`}
                  className="text-base font-semibold cursor-pointer text-gray-600"
                >
                  {model}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-[80%] h-[1px] bg-gray-300"></div>

      {/* Fuel type filter */}
      {availableFuelTypes.length > 0 && (
        <div className="my-6">
          <h3 className="font-semibold text-base mb-3 text-left">Fuel Type</h3>
          <div className="space-y-3">
            {availableFuelTypes.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`fuel-${type}`}
                  checked={filters.selectedFuelTypes.includes(type)}
                  onChange={() => handleCheckboxChange("FuelTypes", type)}
                  className="w-5 h-5 border-2 border-gray-300 rounded mr-3 cursor-pointer shadow-xl"
                />
                <label
                  htmlFor={`fuel-${type}`}
                  className="text-base font-semibold cursor-pointer text-gray-600"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Car type filter*/}
      {availableCarTypes.length > 0 && (
        <div className="my-6">
          <h3 className="font-semibold text-base mb-3 text-left">Car Type</h3>
          <div className="space-y-3">
            {availableCarTypes.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={filters.selectedCarTypes.includes(type)}
                  onChange={() => handleCheckboxChange("CarTypes", type)}
                  className="w-5 h-5 border-2 border-gray-300 rounded mr-3 cursor-pointer"
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-base font-semibold cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxiFilter;
