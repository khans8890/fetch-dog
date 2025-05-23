import React, { useState, useEffect } from 'react';
import LoginPage from "./LoginPage.jsx";
import { useNavigate } from "react-router-dom";


function SearchPage() {
    const [dogs, setDogs] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [favorites, setFavorites] = useState(new Set());
    const [from, setFrom] = useState(0);
    const [totalResults, setTotalResults] = useState(0);

    // fetching breed list
    const fetchBreeds = async () => {
        const res = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
            credentials: 'include',
        });
        const data = await res.json();
        setBreeds(data);
    };

    const toggleFavorite = (dogId) => {
        setFavorites((prev) => {
            const updated = new Set(prev)
            if(updated.has(dogId)) {
                updated.delete(dogId);
            } else {
                updated.add(dogId);
            }
            return updated
        })
    };


    // fetching dogs
    const fetchDogs = async () => {
        const searchParams = new URLSearchParams({
            sort: `breed:${sortOrder}`,
            size: 25,
            from,
        });

        if(selectedBreed){
            searchParams.append('breeds', selectedBreed);
        }
        const searchRes = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${searchParams.toString()}`, {
            credentials: 'include'
         }
        );
        const searchData = await searchRes.json();
        setTotalResults(searchData.total);

        const dogRes = await  fetch('https://frontend-take-home-service.fetch.com/dogs', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchData.resultIds),
        });

        const dogData = await dogRes.json();
        setDogs(dogData);
    };
    useEffect(() => {
        fetchBreeds();
        fetchDogs();
    }, [selectedBreed, sortOrder, from]);

    const navigate = useNavigate();

    const generateMatch = async () => {
        const res = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Array.from(favorites)),
        });
        const matchData = await res.json();

        const dogRes = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([matchData.match]),
        });
        const [match] = await dogRes.json();
        navigate('/match', { state: { match } });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Search Dogs</h1>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Filter by Breed:</label>
                        <select
                            className="rounded border border-gray-300 px-3 py-1 shadow-sm focus:ring-2 focus:ring-indigo-400"
                            value={selectedBreed}
                            onChange={(e) => setSelectedBreed(e.target.value)}
                        >
                            <option value="">All</option>
                            {breeds.map((breed) => (
                                <option key={breed} value={breed}>{breed}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium transition"
                    >
                        Sort: {sortOrder.toUpperCase()}
                    </button>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {dogs.map((dog) => (
                        <div key={dog.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
                            <img src={dog.img} alt={dog.name} className="w-32 h-32 object-cover rounded-full mb-3" />
                            <h2 className="text-lg font-semibold">{dog.name}</h2>
                            <p className="text-gray-600 text-sm">{dog.breed}</p>
                            <p className="text-sm">Age: {dog.age}</p>
                            <p className="text-sm mb-3">Zip: {dog.zip_code}</p>
                            <button
                                onClick={() => toggleFavorite(dog.id)}
                                className={`text-sm px-3 py-1 rounded transition ${
                                    favorites.has(dog.id)
                                        ? 'bg-red-100 text-red-600 border border-red-400'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {favorites.has(dog.id) ? '★ Favorited' : '☆ Favorite'}
                            </button>
                        </div>
                    ))}
                </div>

                {favorites.size > 0 && (
                    <div className="mt-10 text-center">
                        <button
                            onClick={generateMatch}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                        >
                            Generate Match
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center mt-10">
                    <button
                        onClick={() => setFrom(from - 25)}
                        disabled={from === 0}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <p className="text-sm text-gray-600">
                        Showing {from + 1}–{Math.min(from + 25, totalResults)} of {totalResults}
                    </p>
                    <button
                        onClick={() => setFrom(from + 25)}
                        disabled={from + 25 >= totalResults}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    )
}

export default SearchPage;