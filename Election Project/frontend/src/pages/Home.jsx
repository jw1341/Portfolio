import { useState, useEffect } from 'react';
import { getAllBallotsBySociety } from '../services/ballotService';
import { getAllSocieties, getSociety} from '../services/societyService';
import { filterBallotsByActive } from '../utils/data';
import { getEmployeeSocieties } from '../services/userService';
import DashboardCard from '../components/DashboardCard';

export default function Home() {
    const [societies, setSocieties] = useState(() => {
        const stored = localStorage.getItem('societies');
        return stored ? JSON.parse(stored) : [];
    });
    const [ballots, setBallots] = useState(() => {
        const stored = localStorage.getItem('ballots');
        return stored ? JSON.parse(stored) : [];
    });
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const filteredBallots = showActiveOnly ? filterBallotsByActive(ballots) : ballots;
    const [society, setSociety] = useState(-1);
    const [society_id, setSocietyID] = useState(-1);
    const [role, setRole] = useState("member");
    
    useEffect(() => {
        async function getData(){
            setSocietyID(localStorage.getItem("society_id"));
            setRole(localStorage.getItem("role"));
            if(role === "admin"){
                console.log("You're an admin!");
                setSocieties(await getAllSocieties());
                setBallots([]);
            }else if(role === "employee"){
                console.log("You're an employee!");
                setSocieties(await getEmployeeSocieties(localStorage.getItem("user_id")));
                setBallots([]);
            }else{
                console.log("You're a member!");
                setSocieties([]);
                setBallots(await getAllBallotsBySociety(society_id));
            }
        }

        getData();
        
    }, [role, society_id]);

    // console.log(ballots);
    return (
        <div>
            {(society !== -1 && societies.length > 0) &&
            <button style={{ padding: '10px', fontSize: '20px' }}
            onClick={() => {
                localStorage.setItem("society_id", "");
                setBallots([]);
                setSociety(-1);
            }}
            >
                ← Back
            </button>}
            <h1>Welcome {localStorage.getItem("username")}!</h1>
            <h3>You are a {localStorage.getItem("role")} in society number: {localStorage.getItem("society_id")}!</h3>

            <button id='nav-create-user' onClick={() => {
                window.location.href="/create-user";
            }}>Manage Users</button>

            <button id='nav-create-society' onClick={() => {
                window.location.href="/create-society";
            }}>Manage Societies</button>

            {/* <button id='nav-create-society' onClick={async () => {
                if(role === "admin"){
                    setSocieties(await getAllSocieties().societies);
                }else{
                    setSocieties(await getEmployeeSocieties(localStorage.getItem("user_id")));
                }
            }}>Refresh Societies</button> */}
            
            {(ballots.length > 0 && societies.length > 0) &&
            <button
                onClick={() => setShowActiveOnly(prev => !prev)}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                {showActiveOnly ? 'Show All Ballots' : 'Show Active Ballots Only'}
            </button>}
            
            {localStorage.getItem("society_id") &&
            <button id='new-ballot-btn' onClick={() => {
                localStorage.setItem("currentBallot", "");
                window.location.href = 'edit-election';
            }}>Create New Ballot</button>}

            {
                (societies.length > 0) ?
                    (society !== -1) ?
                        (ballots.length === 0) ?
                            <p>Your society has no active ballots</p>
                        :
                            filteredBallots.map(b => 
                                <DashboardCard 
                                electionName={b.title}
                                startDate={b.startDate}
                                endDate={b.endDate}
                                numOffices={Object.keys(b.offices).length}
                                ballot={b}
                                />
                            )
                    :
                    societies.map(s => 
                        (s.society_name) ?
                            <DashboardCard 
                            electionName={s.society_name}
                            description={s.description}
                            startDate={s.creation_date}
                            setBallots={setBallots}
                            society={s}
                            setSociety={setSociety}
                            />
                        :
                            <DashboardCard 
                            electionName={s.society.society_name}
                            description={s.society.description}
                            startDate={s.society.creation_date}
                            setBallots={setBallots}
                            society={s.society}
                            />
                        )
                :
                    (ballots.length === 0) ?
                        <p>Your society has no active ballots</p>
                    :
                        filteredBallots.map(b => 
                            <DashboardCard 
                            electionName={b.title}
                            startDate={b.startDate}
                            endDate={b.endDate}
                            numOffices={Object.keys(b.offices).length}
                            ballot={b}
                            />
                        )
        }


        </div>
    )
}
