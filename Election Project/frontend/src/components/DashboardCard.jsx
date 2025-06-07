import React from 'react';
import { getAllBallotsBySociety } from '../services/data';
import "./DashboardCard.css";

const DashboardCard = ({ electionName, startDate, endDate, numOffices, ballot, description, society, setBallots, setSociety }) => {

  return (
    <div
      style={{
        width: '80%',
        margin: '2rem auto',
        padding: '1.5rem',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        fontFamily: 'sans-serif',
      }}
      className='dash-card'
      onClick={
        (society) ?
        async () => {
          localStorage.setItem("society_id", society.society_id);
          setSociety(society);
          let b = await getAllBallotsBySociety(society.society_id);
          setBallots(b);
        }
        :
        () => {
        console.log("test");
        localStorage.setItem('currentBallot', JSON.stringify(ballot));
        console.log(localStorage.getItem('currentBallot'));
        window.location.href = '/election';
      }}
    >
      <h1 style={{ marginBottom: '1rem' }}>{electionName}</h1>
      {startDate &&
      <p><strong>Start Date:</strong> {startDate}</p>}
      {description &&
        <p>{description}</p>
      }
      {endDate &&
      <p><strong>End Date:</strong> {endDate}</p>
      }
      {numOffices &&
      <p><strong>Number of Offices:</strong> {numOffices}</p>
      }
    </div>
  );
};

export default DashboardCard;