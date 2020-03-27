import React from 'react';
import {
  Card,
  CardContent,
  FormControl,
  TextField,
  FormGroup,
  FormControlLabel,
  Button,
  Checkbox,
} from '@material-ui/core';
import { database } from './index';

function EditItem(props) {
  const [editing, setEditing] = React.useState(false);
  const [video, setVideo] = React.useState(props.video);

  const handleChange = (event, video) => {
    const {name, checked, value, type} = event.target;
    if (type === 'checkbox') {
      video.details.setProps[name] = checked;
    } else {
      video.details.setProps[name] = value;
    }
    setVideo({...video, video});
  }

  const handleEdit = (event, video) => {
    editing && updateVideo(video);
    setEditing(!editing);
  }

  const updateVideo = (video) => {
    console.log('update key', video.id, 'with', video.details);
    let updateObj = {};
    updateObj[video.id] = video.details;
    database.ref().child('/videos/' + video.details.channelTitle).update(updateObj);
  }

  return (
    <Card>
      <CardContent>
      <span className="video-title">
        {video.details.title}
      </span>
      <br />
      <FormControl>
        <div>
          <TextField
            label="Set Name"
            name="setName"
            value={video.details.setProps.setName}
            disabled={!editing}
            onChange={(e) => handleChange(e, video)} />
        </div>
        <div>
          <TextField
            label="Festival"
            name="festival"
            value={video.details.setProps.festival}
            disabled={!editing}
            onChange={(e) => handleChange(e, video)} />
        </div>
        <div>
          <TextField
            label="Year"
            name="year"
            value={video.details.setProps.year}
            disabled={!editing}
            onChange={(e) => handleChange(e, video)} />
        </div>
        <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={video.details.setProps.isSet}
              onChange={(e) => handleChange(e, video)}
              name="isSet"
              disabled={!editing} />
          }
          label="Set?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={video.details.setProps.isLive}
              onChange={(e) => handleChange(e, video)}
              name="isLive"
              disabled={!editing} />
          }
          label="Live?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={video.details.setProps.isVerified}
              onChange={(e) => handleChange(e, video)}
              name="isVerified"
              disabled={!editing} />
          }
          label="Verified?"
        />
        </FormGroup>
      </FormControl>
      <div>
        <Button variant="outlined"
          onClick={(e) => handleEdit(e, video)}
          disabled={!(video.id === editing.id) && editing.enabled } >
          {editing.enabled
          ? 'Save'
          : 'Edit'
          }
        </Button>
      </div>
      </CardContent>
    </Card>
  )
}

export default EditItem;