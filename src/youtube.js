import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  Snackbar,
} from '@material-ui/core';
import { database } from './index';
import { channels } from './channel-details';
import Admin from './admin';
import Login from './login';
import VideoList from './video-list';

function Youtube() {
  const [dbVideos, setDbVideos] = useState([]);
  const [setAndVerifiedVideos, setSetAndVerifiedVideos] = useState([]);
  const [settings, setSettings] = useState({
    selectedChannel: 'b2s',
    showVids: true,
    snackbarIsOpen: false,
    snackbarMessage: '',
  });

  useEffect(() => {
    getVidsFromDB(settings.selectedChannel);
  }, []);

  const isLoggedIn = () => {
    return sessionStorage.getItem('user');
  }

  const getVidsFromDB = channel => {
    const channelName = channels[channel].title;
    var tempVideos = [];
    var tempSetAndVerified = [];

    database.ref().child('/videos/' + channelName).orderByChild('publishedAt').once('value', snapshot => {
      snapshot.forEach(video => {
        const tempVideo = {
          id: video.key,
          details: video.val(),
        };
        tempVideos.push(tempVideo);
        if (video.val().setProps.isSet && video.val().setProps.isVerified) {
          tempSetAndVerified.push(tempVideo);
        }
      });
      setDbVideos(tempVideos.reverse());
      setSetAndVerifiedVideos(tempSetAndVerified.reverse());
      showSnackbar(`Loaded ${tempVideos.length}, ${tempSetAndVerified.length} videos from DB for ${channels[channel].title}`);
    });
  }

  const handleSelectChange = event => {
    console.log(event.target.value);
    setSettings(settings => ({...settings, selectedChannel: event.target.value }));
    getVidsFromDB(event.target.value);
  }

  const toggleShowVids = () => {
    setAndVerifiedVideos.length > 0 && setSettings(settings => ({...settings, showVids: !settings.showVids }));
  }
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSettings(settings => ({...settings, snackbarIsOpen: false }));
  }

  const setVideos = (vids) => {
    setDbVideos(vids);
  }

  const showSnackbar = msg => {
    setSettings(settings => ({...settings, snackbarMessage: msg, snackbarIsOpen: true}));
  }

  return (
    <div>
      <div>
        <Box flexDirection="row" display="flex">
          <FormControl>
            <Select
              value={settings.selectedChannel}
              onChange={handleSelectChange}
            >
              {Object.keys(channels).map(key =>
                <MenuItem value={key} key={key}>{channels[key].title}</MenuItem>
              )}
            </Select>
          </FormControl>
          <Box flexGrow={1}></Box>
          <Box>
            <Login></Login>
          </Box>
        </Box>
        <Button
          className="user-button"
          variant="contained"
          color="secondary"
          onClick={() => toggleShowVids()}>{settings.showVids ? 'Hide' : 'Show'} Videos</Button>
        <VideoList videos={setAndVerifiedVideos} show={settings.showVids}></VideoList>
        {isLoggedIn () && <Admin
          settings={settings}
          setVideos={setVideos}
          showSnackbar={showSnackbar}
          dbVideos={dbVideos} >
        </Admin>}
        <Snackbar
          autoHideDuration={1000}
          message={settings.snackbarMessage}
          open={settings.snackbarIsOpen}
          onClose={handleSnackbarClose} />
      </div>
    </div>
  )
}

export default Youtube;