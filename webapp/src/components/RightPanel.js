import 'babel-polyfill'
import React from 'react';
import {Contract, eth} from 'decentraland-commons'
import { LANDRegistry } from 'decentraland-contracts'

async function sendTxx() {
  eth.getContract('LANDRegistry').ownerOf("5","5").then((e)=>{alert(e)})
}

export default class RightPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "ok":true
    }
  }

  componentDidMount() {
    eth.connect(null, [LANDRegistry])
  }

  render() {
    return (
      <div>
        {this.state.ok
          ? (
            <button onClick={sendTxx} type="button" className="btn btn-success btn-lg btn-block"> Push to blockchain</button>
          )
          : (
            <p>There is a problem!</p>
          )
        }
      </div>
    )
  }
}
