import { useState } from "react";
import Office from "../components/Office";
import Initiative from "../components/Initiative";
import MUITextField from "../components/MUITextField";
import BallotBtn from "../components/BallotBtn.jsx";
import "./Election.css";
import PropTypes from "prop-types";

import {
  handleEditBallotSubmit,
  createFormItem,
  syncState,
  castVote,
  castInitVote,
  deleteBallot
} from "../services/ballotService";

const testData = {
  ballot_id: 10002,
  society_id: 69,
  title: "Taco Tuesday",
  startDate: "02/26/2003",
  endDate: "02/29/2003",
  offices: {
    office1: {
      name: "Prezzy",
      numVotes: 1,
      candidates: {
        candidate1: {
          first_name: "Brian",
          last_name: "Burger",
          candidate_demographics: "Clown School",
          candidate_desc: "He's cool",
        },
      },
    },
    office2: {
      name: "Head Clown",
      numVotes: 1,
      candidates: {
        candidate1: {
          first_name: "Macy",
          last_name: "Meatball",
          candidate_demographics: "Clown School",
          candidate_desc: "He's cool",
        },
      },
    },
  },
  initiatives: {
    initiative1: {
      name: "Free Ice Cream from Dean",
      description: "I think we deserve it",
      options: {
        option1: "Yes",
        option2: "No",
      },
    },
  },
};

const role = localStorage.getItem("role");

const societyIdRaw = localStorage.getItem("society_id");

const newBallot = societyIdRaw
  ? {
      society_id: JSON.parse(societyIdRaw),
      offices: {
        office1: {
          candidates: {
            candidate1: {}
          }
        }
      },
      initiatives: {
        initiative1: {}
      }
    }
  : testData;

export default function Election({ mode }) {
Election.propTypes = {
  mode: PropTypes.string.isRequired,
};
  const [fData, setFData] = useState(
    localStorage.getItem("currentBallot")
      ? JSON.parse(localStorage.getItem("currentBallot"))
      : newBallot
  );
  const [votes, setVotes] = useState([]);
  const [initVotes, setInitVotes] = useState([]);
  const [offices, setOffices] = useState([...Object.keys(fData.offices)]);
  const [initiatives, setInitiatives] = useState([
    ...Object.keys(fData.initiatives),
  ]);

  if (mode === "edit") {
    return (
      <div id="election">
        <form
          onSubmit={(e) => {
            console.log("You clicked submit!");
            e.preventDefault();
            handleEditBallotSubmit(fData);
          }}
        >
          <h1 id="society-name">{`Society #${localStorage.getItem("society_id")}`}</h1>
          <h2 id="mode-title">Edit Ballot</h2>

          <BallotBtn clickFunc={() => console.log(fData)} innerText={"Print Data"} />
          <MUITextField label="Election Title" fData={fData} setFData={setFData} path="title" />
          <MUITextField label="Start Date" fData={fData} setFData={setFData} path="startDate" />
          <MUITextField label="End Date" fData={fData} setFData={setFData} path="endDate" />

          <div id="offices">
            <h2>Offices</h2>
            {offices.map((o) => (
              <Office
                key={o}
                mode={mode}
                fData={fData}
                setFData={setFData}
                path={`offices.${o}`}
                callback={() => setOffices(syncState(fData, "offices"))}
              />
            ))}
            <BallotBtn
              clickFunc={() => {
                createFormItem(offices, setOffices, "office", setFData, "offices.");
              }}
              innerText={"Add Office"}
            />
          </div>

          <div id="initiatives">
            <h2>Initiatives</h2>
            {initiatives.map((o) => (
              <Initiative
                key={o}
                mode={mode}
                fData={fData}
                setFData={setFData}
                path={`initiatives.${o}`}
                callback={() => setInitiatives(syncState(fData, "initiatives"))}
              />
            ))}
            <BallotBtn
              clickFunc={() => createFormItem(initiatives, setInitiatives, "initiative", setFData, "initiatives.")}
              innerText={"Add Initiative"}
            />
          </div>

          <BallotBtn type="submit" innerText={"Submit"} />
          <BallotBtn clickFunc={() => (window.location.href = "/home")} innerText={"Cancel"} />
        </form>
      </div>
    );
  }

  return (
    <div id="election">
      <h1 id="society-name">{`Society #${localStorage.getItem("society_id")}`}</h1>
      <h2 id="mode-title">View Ballot</h2>

      <div id="test-get">
        <button
          id="edit-ballot"
          onClick={() => {
            window.location.href = "/edit-election";
          }}
        >
          Edit Ballot
        </button>

        <button id="print-votes" onClick={() => {window.location.href = "/election-results"}}>
          View Results
        </button>
      </div>

      <div id="offices">
        {offices.map((o) => (
          <Office key={o} fData={fData} votes={votes} setVotes={setVotes} path={`offices.${o}`} />
        ))}
      </div>

      <div id="initiatives">
        {initiatives.map((o) => (
          <Initiative key={o} fData={fData} path={`initiatives.${o}`} initVotes={initVotes} setInitVotes={setInitVotes} />
        ))}
      </div>

      
      {(role === "member" || role === "officer") &&
      <button
        onClick={async (e) => {
          e.preventDefault();
          localStorage.setItem("votes", JSON.stringify(votes));
          for (const v of votes) {
            let rs = await castVote({
              ...v,
              ballot_id: fData.ballot_id,
              user_id: localStorage.getItem("user_id"),
            });
            console.log(rs);
          }

          for(const v of initVotes){
            let rs = await castInitVote({
              ...v,
              ballot_id: fData.ballot_id,
              user_id: localStorage.getItem("user_id"),
            });
            console.log(rs);
          }

          // Optionally redirect
          window.location.href = "/home";
        }}
      >
        Vote
      </button>}

      {role === "admin" &&
      <button
        onClick={async (e) => {
          console.log(fData.ballot_id);
          let result = await deleteBallot(fData.ballot_id);
          // Optionally redirect
          window.location.href = "/home";
        }}
      >
        Delete Ballot
      </button>}

      <button onClick={() => (window.location.href = "/home")}>Return Home</button>
    </div>
  );
}
