import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { send } from '@giantmachines/redux-websocket';
import {
  selectNumBells,
  selectBellsAtHandstroke,
  selectBellOne,
  selectBellTwo,
  ringBell,
} from './ringerSlice';
import styles from '../counter/Counter.module.css';

export function RingTable() {
  const dispatch = useDispatch();
  const numBells = useSelector(selectNumBells);
  const bellsAtHandstroke = useSelector(selectBellsAtHandstroke);
  const bellOne = useSelector(selectBellOne);
  const bellTwo = useSelector(selectBellTwo);

  const createTable = () => {
    let table = []

    let children = []
      children.push(<td key={'titleT'}></td>)
    for (let idx = 0; idx < numBells; idx++) {
      children.push(<td key={'title'+idx}>{idx+1}</td>)
    }
    table.push(<tr key={'title'}>{children}</tr>)

    children = []
    children.push(<td key={'titleB'}>Backstroke</td>)
    for (let idx = 0; idx < numBells; idx++) {
      children.push(<td key={'B'+idx}>{bellsAtHandstroke[idx] ? "" : "X"}</td>)
    }
    table.push(<tr key={'backstroke'}>{children}</tr>)

    children = []
    children.push(<td key={'titleH'}>Handstroke</td>)
    for (let idx = 0; idx < numBells; idx++) {
      children.push(<td key={'H'+idx}>{bellsAtHandstroke[idx] ? "X" : ""}</td>)
    }
    table.push(<tr key={'handstroke'}>{children}</tr>)

    return table
  }

  return (
    <div>
      <table>
        <tbody>
          {createTable()}
        </tbody>
      </table>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => {
            dispatch(ringBell(bellOne))
            dispatch(send({ type: "RingBellMessage", data: { bell: bellOne }})) 
          } }
        >
          Ring { bellOne }
        </button>
        <button
          className={styles.button}
          onClick={() => {
            dispatch(ringBell(bellTwo))
            dispatch(send({ type: "RingBellMessage", data: { bell: bellTwo }})) 
          } }
        >
          Ring { bellTwo }
        </button>
      </div>
    </div>
  )
}
