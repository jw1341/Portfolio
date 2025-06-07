import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import {getValueFromPath, removeValueAtPath, setStateByPath, createFormItem} from "../services/data.js";
import { useState } from 'react';

import MUITextField from './MUITextField';
import BallotBtn from './BallotBtn.jsx';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));


const style = {
  border: "1px solid black",
  maxWidth: 800,
};

function testPassDown(){
  console.log("On Change Pass Down worked!");
}

export default function CandidateCard({data, type, mode, fData, setFData, path, callback, office_id, votes, setVotes, maxVotes}) {
  const [expanded, setExpanded] = React.useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert("Please choose an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('Upload response:', data);
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    }
  };

  // EDIT ELECTION CARD
  if(mode === "edit"){
    return (
      <Card sx={style}>
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <MUITextField label="First Name" fData={fData} setFData={setFData} path={path + ".first_name"} />
            <MUITextField label="Last Name" fData={fData} setFData={setFData} path={path + ".last_name"} />
            <MUITextField label="Degree" fData={fData} setFData={setFData} path={path + ".candidate_demographics"} />
            <MUITextField label="Description" fData={fData} setFData={setFData} path={path + ".candidate_desc"} />
            {/* <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              /> */}
            <BallotBtn
            clickFunc={() => {
              removeValueAtPath(fData, path);
              callback();
            }}
            innerText={"Remove Candidate"}
            />
          </Typography>
        </CardContent>
      </Card>
    )
  }
  //VIEW / VOTE ELECTION CARD 
  const isSelected = votes.some(vote => vote.candidate_id === fData.candidate_id);
  const [writeIn, setWriteIn] = useState();

  const handleToggleVote = () => {
    const existingVotesForOffice = votes.filter(vote => vote.office_id === office_id);
    const isSelected = votes.some(vote => vote.candidate_id === fData.candidate_id);
  
    if (isSelected) {
      // Candidate already selected → deselect them
      setVotes(votes.filter(vote => vote.candidate_id !== fData.candidate_id));
    } else {
      if (existingVotesForOffice.length >= maxVotes) {
        // Max votes already reached → remove the oldest vote for that office
        const oldestVoteId = existingVotesForOffice[0].candidate_id;
        setVotes([
          ...votes.filter(vote => vote.candidate_id !== oldestVoteId),
          { "candidate_id": fData.candidate_id, "office_id": office_id }
        ]);
      } else {
        // Just add the new vote
        setVotes([
          ...votes,
          { "candidate_id": fData.candidate_id, "office_id": office_id }
        ]);
      }
    }
  };

  if(type === "write-in"){
    return (
      <div
        onClick={() => {handleToggleVote();}}
        className={`cursor-pointer border rounded-lg p-4 shadow-md transition-colors ${
          isSelected ? 'bg-indigo-100 border-indigo-400' : 'bg-white hover:bg-gray-100'
        }`}
        style={{ width: '300px', margin: '1rem auto' }}
      >
        <input
            type="text"
            placeholder="Write-In"
            value={writeIn}
            onChange={(e) => setWriteIn(e.target.value)}
            className="border p-2 rounded"
        />  
      </div>
    );
  }
  


  return (
    <div
      onClick={() => {handleToggleVote();}}
      className={`cursor-pointer border rounded-lg p-4 shadow-md transition-colors ${
        isSelected ? 'bg-indigo-100 border-indigo-400' : 'bg-white hover:bg-gray-100'
      }`}
      style={{ width: '300px', margin: '1rem auto' }}
    >
      <h3 className="text-lg font-bold mb-1">{fData.first_name} {fData.last_name}</h3>
      {fData.candidate_demographics &&
        <p className="text-sm text-gray-600 mb-2">{fData.candidate_demographics}</p>
      }
      {fData.candidate_desc &&
        <p className="text-gray-700">{fData.candidate_desc}</p>
      }
    </div>
  );
}
