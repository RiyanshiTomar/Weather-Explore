import React, { useState, useEffect, useRef } from "react";
import { cityService } from '../services/services';

function SearchEngine({ query, setQuery, search, fetchLocation }) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const suggestionRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedIndex(-1);

        if (value.length >= 2) {
            const results = await cityService.searchCities(value);
            setSuggestions(results);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else {
                    search(e);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.searchString);
        setShowSuggestions(false);
        // Trigger search with the selected city
        setTimeout(() => {
            search({ type: 'click', preventDefault: () => {} });
        }, 100);
    };

    return (
        <div className="SearchEngine" ref={suggestionRef}>
            <button onClick={fetchLocation} className="button-location">
                <i className="fa-solid fa-location-crosshairs location-icon"></i>
            </button>
            <div className="search-container">
                <input
                    ref={inputRef}
                    type="text"
                    className="city-search"
                    placeholder="Enter city name"
                    name="query"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                            >
                                {suggestion.searchString}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button onClick={search}>
                <i className="fas fa-search" style={{ fontSize: "18px" }}></i>
            </button>
        </div>
    );
}

export default SearchEngine;