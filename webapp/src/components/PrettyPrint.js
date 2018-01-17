import './PrettyPrint.css'
import React from 'react'

export default class DebugPrint extends React.PureComponent {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      show: true,
    }
  }

  toggle() {
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    return (
        <div className="prettyprint">
          <div className="header">
          </div>
          <pre className="prettyprint">
            {JSON.stringify({
              "display": {
                "title": "dcl-app",
                "favicon": "favicon_asset"
              },
              "owner": "",
              "contact": {
                "name": "",
                "email": ""
              },
              "main": "scene",
              "tags": [],
              "scene": {
                "base": "",
                "parcels": []
              },
              "communications": {
                "type": "webrtc",
                "signalling": "https://signalling-01.decentraland.org"
              },
              "policy": {
                "contentRating": "E",
                "fly": "yes",
                "voiceEnabled": "yes",
                "blacklist": [],
                "teleportPosition": ""
              }
            }, null, 2) }
          </pre>

        </div>
        )
  }
}
