import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from '@giantmachines/redux-websocket';
import {
  selectConnected,
} from './ringerSlice';
import { RingTable } from './RingTable';
import styles from '../counter/Counter.module.css';

export function Ringer() {
  const dispatch = useDispatch();
  const [channelName, setChannelName] = useState("test");
  const host = window.location.host;

  return (
    <div>
      <div className={styles.row}>
        <input 
          className={styles.textbox} 
          aria-label="Set channel name"
          value={channelName}
          onChange={e => setChannelName(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(connect('ws://' + host + '/room/' + channelName))}
        >
          Join Channel
        </button>
      </div>
      <ConnectedBlock />
    </div>
  );
}

function ConnectedBlock() {
  const connected = useSelector(selectConnected);

  if (!connected) {
    return null;
  }

  return (
    <div>
      <div className={styles.row}>
        <span className={styles.value}>Connected</span>
      </div>
      <div className={styles.row}>
        <RingTable />
      </div>
    </div>
  );
}
