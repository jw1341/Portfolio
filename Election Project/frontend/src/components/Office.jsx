import CandidateCard from "./CandidateCard";
import "./Office.css";
import MUITextField from "./MUITextField";
import BallotBtn from "./BallotBtn.jsx";
import { useState } from "react";
import {getValueFromPath, removeValueAtPath, setStateByPath, createFormItem, syncState} from "../services/data.js";

export default function Office({mode, fData, setFData, path, callback, votes, setVotes}){
    const [candidates, setCandidates] = useState(
        getValueFromPath(fData, path + '.candidates') ?
        [...syncState(fData, path + ".candidates")]
        :
        []
    );



    const testCandidates = [
        {
          "name": "Alice Johnson",
          "university": "Stanford University",
          "image": "unknown.png",
          "description": "Computer Science major with a passion for full-stack development and AI."
        },
        {
          "name": "Bob Smith",
          "university": "MIT",
          "image": "unknown.png",
          "description": "Software engineering enthusiast specializing in machine learning and cloud computing."
        },
        {
          "name": "Charlie Lee",
          "university": "Harvard University",
          "image": "unknown.png",
          "description": "Aspiring data scientist with experience in big data and analytics."
        }
    ]

    if(mode === "edit"){
        return(
            <div className="edit-office">
                <MUITextField label="Office Name" fData={fData} setFData={setFData}  path={path + ".name"} ></MUITextField>
                <MUITextField label="Number of Votes Allowed" fData={fData} setFData={setFData} path={path + ".numVotes"} ></MUITextField>
                <div id="candidates">
                    {candidates.map((o) => 
                        <CandidateCard mode={mode} fData={fData} setFData={setFData} path={path +".candidates."+ o} callback={() => {setCandidates(syncState(fData, path + ".candidates"));
                            console.log(candidates);
                        }}/>
                    )}
                </div>
                <BallotBtn clickFunc={() => {createFormItem(candidates, setCandidates, "candidate", setFData, path +".candidates.")}} innerText={"Add Candidate"} />
                <BallotBtn clickFunc={() => {
                    removeValueAtPath(fData, path);
                    callback();
                }} innerText={"Remove Office"}/>
            </div>
        )
    }


    return(
        <div className="office">
            {/* <CandidateCard data={testCandidates[0]} type="candidate" />
            <CandidateCard data={testCandidates[1]} type="candidate" />
            <CandidateCard data={testCandidates[2]} type="candidate" /> */}
            <h2>
                {getValueFromPath(fData, path + ".name")}
            </h2>
            <h3>
                Num Votes: {getValueFromPath(fData, path + ".numVotes")}
            </h3>
            <div className="candidates">
                {candidates.map((o) => 
                    <CandidateCard mode={mode} fData={getValueFromPath(fData, path + ".candidates." + o)} votes={votes} setVotes={setVotes} maxVotes={getValueFromPath(fData, path + ".numVotes")} office_id={getValueFromPath(fData, path + ".office_id")}/>
                )}
                {/* <CandidateCard mode={mode} type="write-in" fData={getValueFromPath(fData, path + ".candidates." + 'write-in')} votes={votes} setVotes={setVotes} maxVotes={getValueFromPath(fData, path + ".numVotes")} office_id={getValueFromPath(fData, path + ".office_id")}/> */}
            </div>
        </div>
    )
}