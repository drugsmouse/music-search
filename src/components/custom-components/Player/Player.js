import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as playerActions from './../../../actions/player';

// components
import PlayerActions from '../Player/PlayerActions/PlayerActions';
import TrackBar from '../Player/TrackBar/TrackBar';
import Timer from '../Player/Timer/Timer';
import Volume from './Volume/Volume';
// Settings & Utils
import {CLIENT_ID} from '../../../settings';

// Style
import './Player.scss';

@connect(
  state => ({
    player: state.player
  }),
  dispatch => ({
    actions: bindActionCreators(playerActions, dispatch)
  })
)
class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      play: true,
      muted: false,
      timeValue: 0
    };

    this.audioEl = {
      el: document.createElement('audio'),
      duration: 0,
      step: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setSongData(nextProps.player.songData);
  }

  setSongData(songData) {
    const {audioEl, state} = this;

    if (!audioEl.el) {
      return;
    }

    audioEl.el.src = songData.stream_url + `?client_id=${CLIENT_ID}`;
    audioEl.el.volume = 0.7;
    audioEl.duration = songData.duration;
    audioEl.el.play().then(() => {
      //console.log('finish metadata loading');
    });

    if (!audioEl.el.onended) {
      audioEl.el.onended = this.onEndTrack;
    }

    if (!state.play) {
      this.setState({
        play: true
      });
    }
  }

  onEndTrack = () => {
    this.nextSong(this.props.player.soundIndex + 1);
  };

  nextSong(index) {
    if (!index || index < 0) {
      return;
    }
    this.props.actions.setNextSong(index);
  }

  onChangePlayerAction = (name) => {
    const {state, audioEl} = this;
    const {player} = this.props;

    switch (name) {
      case 'play':
        state.play ? audioEl.el.pause() : audioEl.el.play();
        this.setState({
          play: !state.play,
          timeValue: audioEl.el.currentTime
        });
        return;

      case 'next':
        this.nextSong(player.soundIndex + 1);
        return;

      case 'previous':
        this.nextSong(player.soundIndex - 1);
        break;
    }
  };

  onChangeTimeBar = (value) => {
    this.audioEl.el.currentTime = value;
    this.setState({
      timeValue: value
    });
  };

  render() {
    const {player} = this.props;
    const {play, timeValue} = this.state;
    const {audioEl} = this;

    if (!player.songData) {
      return false;
    }

    return (
      <div className="player-container">
        <div className="music-panel">
          <div className="img-container">
            <img src={player.songData.user.avatar_url}/>
          </div>
          <PlayerActions
            isPlaying={play}
            onChange={this.onChangePlayerAction}
          />
          <Timer
            value={timeValue * 1000}
            autoUpdate={true}
            audio={audioEl.el}
            isPlaying={play}
          />
          <TrackBar
            audioEl={audioEl.el}
            isPlaying={play}
            onChangeTimeBar={this.onChangeTimeBar}
          />
          <Timer value={player.songData.duration}/>
          <Volume audioEl={audioEl.el}/>
        </div>
      </div>
    );
  }
}

export default Player;
