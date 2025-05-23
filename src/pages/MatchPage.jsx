import React from "react";
import { useLocation, useNavigate} from "react-router-dom";

function MatchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { match } = location.state || {};

    if(!match){
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
                <div className='bg-white p-6 rounded shadow text-center'>
                <p className='text-lg text-gray-700 mb-4'>No match data. Please try again. </p>
                <button onClick={() => navigate('/search')} className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition'>Back to search</button>
                </div>
                </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4'>
            <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full'>
            <h1 className='text-3x1 font-bold text-green-700 mb-6'>Your Match</h1>
            <img src={match.img} alt={match.name} className='w-32 h-32 object-cover rounded-full mx-auto mb-4' />
            <h2 className='text-x1 font-semibold mb-1'>{match.name}</h2>
            <p className='text-gray-600'>Breed: {match.breed}</p>
            <p className='text-sm text-gray-500'>Age: {match.age}</p>
            <p className='text-sm text-gray-500 mb-6'>Zip Code: {match.zip_code}</p>

            <button onClick={() => navigate('/search')} className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition'>Back to Search</button>
            </div>
        </div>

    );
}

export default MatchPage;