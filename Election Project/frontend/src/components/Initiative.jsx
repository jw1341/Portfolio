import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import BallotBtn from './BallotBtn.jsx';
import Typography from '@mui/material/Typography';

import MUITextField from './MUITextField';
import {getValueFromPath, removeValueAtPath, setStateByPath, createFormItem, syncState} from "../services/data.js";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { useState } from 'react';

export default function Initiative({data, mode, fData, setFData, path, callback, initVotes, setInitVotes}) {
  const [options, setOptions] = useState(
    getValueFromPath(fData, path + ".options") ?
    [...Object.keys(getValueFromPath(fData, path + ".options"))]
    :
    ["option1"]
  );

    if(mode === "edit"){
        return (
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                    <MUITextField label="Name" fData={fData} setFData={setFData} path={path + ".name"}/>
                    <MUITextField label="Description" fData={fData} setFData={setFData} path={path + ".description"}/>
                </Typography>
                <h2>Initiative Options</h2>
                <Typography variant="body2">
                    <div id="options">
                        {options.map((o) => 
                            <span>
                                <MUITextField label="Option1" fData={fData} setFData={setFData} path={path + ".options." + o}/>
                                <BallotBtn
                                clickFunc={() => {
                                  if(options.length > 1){
                                    removeValueAtPath(fData, path + ".options." + o);
                                    console.log(getValueFromPath(fData, path + ".options"));
                                    setOptions(syncState(fData, path + ".options"));
                                  }
                                }}
                                innerText={"Remove Option"}
                                />
                            </span>
                        )}
                        {/* <span>
                            <MUITextField label="Option2" fData={fData} setFData={setFData} path={path + ".options.option2"}/>
                            <BallotBtn>Remove Option</BallotBtn>
                        </span> */}
                        <BallotBtn clickFunc={() => {createFormItem(options, setOptions, "option", setFData, path + ".options.")}} innerText={"Add Option"}/>
                        <BallotBtn clickFunc={() => {
                            removeValueAtPath(fData, path);
                            callback();
                        }} 
                        innerText={"Remove Intitiative"}
                        />
                    </div>
                </Typography>
              </CardContent>
            </Card>
          );
    }




    const handleInitVoteChange = (event, initiativePath) => {
      // const selectedOption = event.target.value;
      const selectedIndex = parseInt(event.target.value, 10);
      setInitVotes(prevVotes => {
        const filtered = prevVotes.filter(vote => vote.initiative_id !== getValueFromPath(fData, path + ".initiative_id"));
        return [...filtered, { initiative_id: getValueFromPath(fData, path + ".initiative_id"), init_option_id: selectedIndex }];
      });
      console.log(initVotes);
    };
    

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
            {getValueFromPath(fData, path + ".name")}
        </Typography>
        <Typography variant="body2">
            {getValueFromPath(fData, path + ".description")}
        </Typography>
      </CardContent>
      <CardActions>
            <FormControl>
            <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={(e) => handleInitVoteChange(e, path)} // 👈 use onChange
                >
                  {options.map((o, i) => {
                    const value = getValueFromPath(fData, path + ".options." + o);
                    return (
                      <FormControlLabel
                        key={o}
                        value={i+1}
                        control={<Radio />}
                        label={value}
                      />
                    );
                  })}
                </RadioGroup>

            </FormControl>
      </CardActions>
    </Card>
  );
}
