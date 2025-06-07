import { Button } from "@mui/material";

export default function BallotBtn({clickFunc, innerText, type}){

    const styles = {
        margin: "20px",
        backgroundColor: "navy",
        color: "white"
    };

    return (
        <Button variant="container" onClick={clickFunc} sx={styles} type={type} >{innerText}</Button>
    )
}