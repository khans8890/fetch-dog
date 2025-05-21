import React from "react";
import { useLocation, useNavigate} from "react-router-dom";

function MatchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { match } = location.state || {};

    if(!match){
        return (
            <div>
                <p>No match data. Go back and try again.</p>
                <button onClick={() => navigate('/search')}>Back to search</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Your Match</h1>
            <img src={match.img} alt={match.name} style={{ width:  '200px' }} />
            <p>Name:{match.name}</p>
            <p>Breed: {match.breed}</p>
            <p>Age: {match.age}</p>
            <p>Zip Code: {match.zip_code}</p>

            <button onClick={() => navigate('/search')}>Back to Search</button>
        </div>
    );
}

export default MatchPage;