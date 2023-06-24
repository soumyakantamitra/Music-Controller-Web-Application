import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio, Collapse } from "@mui/material";
import { Alert } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";

const CreateRoomPage = ({
    votesToSkip: defaultVotesToSkip = 2,
    guestCanPause: defaultGuestCanPause = true,
    update = false,
    roomCode = null,
    updateCallback = () => {},
    }) => {
    const navigate = useNavigate();
    const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotesToSkip);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === 'true');
    };

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => navigate('/room/' + data.code));
    };

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                setSuccessMsg("Room Updated Successfully");
            }
            else {
                setErrorMsg("Error Updating Room...");
            }
            updateCallback();
        });
    }

    const renderCreateButtons = () => {
        return(
            <Grid container spacing={1} align = "center">
                <Grid item xs={12}>
                    <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    const renderUpdateButtons = () => {
        return(
            <Grid item xs={12} align = "center">
                <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
        );
    }

    const title = update ? "Update Room" : "Create Room";

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Collapse in={errorMsg !== "" || successMsg !== ""}>
                    {successMsg != "" ? (
                    <Alert 
                        severity="success" 
                        onClose={() => {setSuccessMsg("");}}>{successMsg}
                    </Alert>
                    ) : (
                    <Alert 
                        severity="error" 
                        onClose={() => {setErrorMsg("");}}>{errorMsg}
                    </Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12}>
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormHelperText component="div">
                        <div>Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup 
                        row 
                        value={guestCanPause.toString()} 
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl>
                    <TextField
                        required
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={votesToSkip}
                        inputProps={{
                            min: 1, 
                            style: { textAlign: "center" } 
                        }}
                    />
                    <FormHelperText component="div">
                        <div align="center">Votes Required to Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
}

export default CreateRoomPage