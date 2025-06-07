import React, { useEffect, useState } from 'react';
import { getVoterParticipation, getUsersByVoted, formatDateTime } from '../services/data.js';
import { getBallotResults, getInitiativeResults } from '../services/ballotService';

export default function ElectionResults() {

  const [activeTab, setActiveTab] = useState(1);

  const society_id = localStorage.getItem("society_id");
  const currentBallot = localStorage.getItem("currentBallot") ? JSON.parse(localStorage.getItem("currentBallot")) : null;
  const ballot_id = currentBallot ? currentBallot.ballot_id: null;
  
  const [vp, setVP] = useState(0);
  const [voted, setVoted]= useState(["joe"]);
  const [notVoted, setNotVoted] = useState(["mama"]);
  const [ballotResults, setBallotResults] = useState([]);
  const [initResults, setInitResults] = useState([]);

  

  useEffect(() => {
    async function fetchData() {
      let vp = await getVoterParticipation(ballot_id, society_id);
      setVP(vp * 100);
  
      let users = await getUsersByVoted(ballot_id, society_id);
      setVoted(users.hasVoted);
      setNotVoted(users.hasNotVoted);

      let br = await getBallotResults(ballot_id);
      setBallotResults(br);

      let ir = await getInitiativeResults(ballot_id);
      setInitResults(ir);
    }
    fetchData();
  }, [ballot_id, society_id])

    const data = {
        startDate: '12/15/2024 12:00am',
        endDate: '12/20/2024 11:59pm',
        participation: 67,
        offices: [
          {
            title: 'President Elect',
            candidates: [{ name: 'Gerald Ford', votes: 18, percent: 52 }]
          },
          {
            title: 'Vice President Elect',
            candidates: [{ name: 'Stevie Wonder', votes: 20, percent: 62 }]
          },
          {
            title: 'Co-Chairs Elect',
            candidates: [
              { name: 'Dana White', votes: 30, percent: 82 },
              { name: 'Gerome Powell', votes: 22, percent: 65 }
            ]
          }
        ],
        policies: [
          {
            title: 'Babies can buy cigarettes',
            result: 'Passed',
            votes: 18,
            percent: 52
          }
        ],
        haveVoted: ['Washington, Karen', 'Washington, Karen', 'Washington, Karen'],
        haveNotVoted: ['Smith, John', 'Doe, Jane']
      };
      


  return (
    <div className="p-6 text-sm sm:text-base max-w-4xl mx-auto">
      <button style={{ padding: '10px', fontSize: '20px' }}
            onClick={() => {
                localStorage.setItem("society_id", "");
                window.location.href = "/home";
            }}
            >
                ← Return Home
            </button>
      <h1 className="text-xl font-semibold mb-2">Election Results</h1>
      <p className="text-gray-600 flex items-center mb-4">
        <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
        {formatDateTime(currentBallot.startDate)} - {formatDateTime(currentBallot.endDate)}
      </p>

      <p className="font-semibold mb-6">
        Voter Participation: <span className="font-normal">{vp}%</span>
      </p>

      <h2 className="font-bold underline mb-2">Offices:</h2>
      <div className="mb-6 space-y-1">
      {ballotResults.map((office) => (
  <div key={office.office_id} className="mb-4">
    <h2 className="font-bold text-lg">{office.office_name}</h2>
              {office.officeResults
                .slice(0, office.numVotes) // 👈 Only take top N
                .map((result, index) => {
                  const { first_name, last_name } = result.candidate.candidate;
                  return (
                    <div key={index} className="ml-4">
                      <p>
                        {first_name} {last_name} — {result.count} votes (
                        {result.percentage}%)
                      </p>
                    </div>
                  );
                })}
            </div>
          ))}
      </div>

      {initResults.length > 0 &&    
      <h2 className="font-bold underline mb-2">Initiatives:</h2>}
      <div className="mb-6">
      {initResults.map((item, index) => (
          <p key={index}>
            <strong>{item.name}:</strong> {item.label} ({item.count} votes | {item.percentage}%)
          </p>
      ))}
      </div>

      <div className="max-w-md mx-auto rounded shadow border text-sm">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab(1)}
          className={`w-1/2 p-2 text-center ${activeTab === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Have Voted
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`w-1/2 p-2 text-center ${activeTab === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Have Not Voted
        </button>
      </div>

      <div className="p-3 bg-white">
        {activeTab === 1 ? 
          <div className="border-r">
          {voted.map((user, i) => (
            <div key={i} className="p-2 border-b">{user.username}</div>
          ))}
         </div>
        : 
          <div>
            {notVoted.map((user, i) => (
              <div key={i} className="p-2 border-b">{user.username}</div>
            ))}
          </div>
        }
      </div>
    </div>
      
      {/* <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-2 text-white font-semibold">
          <div className="bg-indigo-800 p-2">Have Voted ({data.haveVoted.length})</div>
          <div className="bg-gray-300 text-black p-2">Have Not Voted ({data.haveNotVoted.length})</div>
        </div>
        <div className="grid grid-cols-2 border-t">
          <div className="border-r">
            {data.haveVoted.map((name, i) => (
              <div key={i} className="p-2 border-b">{name}</div>
            ))}
          </div>
          <div>
            {data.haveNotVoted.map((name, i) => (
              <div key={i} className="p-2 border-b">{name}</div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}