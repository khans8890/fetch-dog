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
        <div>
            <h1>Search Dogs</h1>

            <label>
                Filter by breed:{' '}
                <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
                    <option value="">All</option>
                    {breeds.map((breed) => {
                        <option key={breed} value={breed}>{breed}</option>
                    })}
                </select>
            </label>

            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc': 'asc')}>
                Sort: {sortOrder.toUpperCase()}
            </button>

            <ul>
                {dogs.map((dog) => (
                    <li key={dog.id}>
                        <img src={dog.img} alt={dog.name} style={{ width: '100px' }} />
                            <p>{dog.name} - {dog.breed} -  Age: {dog.age} - Zip: {dog.zip_code}</p>
                        <button onClick={() => toggleFavorite(dog.id)}>
                            {favorites.has(dog.id) ? 'Unfavorite' : 'Favorite'}
                        </button>
                    </li>
                ))}
            </ul>

            <button onClick={() => setFrom(from - 25 )} disabled={from === 0}> Previous </button>

            <button onClick={() => setFrom(from + 25 )} disabled={from + 25 >= totalResults}> Next </button>

            <p>Showing {from + 1} to {Math.min(from + 25, totalResults)} of {totalResults} dogs</p>

            <p>Total favorites: {favorites.size}</p>
            {favorites.size > 0 && (
                <button onClick={generateMatch}>
                    Generate Match
                </button>
            )}
        </div>
    )
}

export default SearchPage;