import React from 'react'

import './Footer.css'

class Link extends React.Component {
  render() {
    console.log(this.props);
    return <a href={this.props.to} className={this.props.className} target={this.props.target}>{this.props.children}</a>;
  }
}

export default function Footer() {
  return (
    <div className="Footer container-fluid">
      <h2 className="company-name">Decentraland Foundation</h2>
      <div className="row Footer-links">
        <Link
          className="link"
          to="https://blog.decentraland.org"
          target="_blank"
        >
          Blog
        </Link>

        <div className="link last-link hidden-xs">
          Get in touch: <br className="visible-xs" />
          <Link className="email-link" to="mailto:hello@decentraland.org">
            hello@decentraland.org
          </Link>
        </div>

        <div className="link last-link get-in-touch visible-xs">
          Get in touch: <br className="visible-xs" />
          <Link className="email-link" to="mailto:hello@decentraland.org">
            hello@decentraland.org
          </Link>
        </div>
      </div>
      <div className="contact-icons">
        <Link
          className="contact-icon contact-icon-twitter"
          to="https://twitter.com/decentraland"
          target="_blank"
        />
        <Link
          className="contact-icon contact-icon-slack"
          to="https://chat.decentraland.org"
          target="_blank"
        />
        <Link
          className="contact-icon contact-icon-github"
          to="https://github.com/decentraland"
          target="_blank"
        />
        <Link
          className="contact-icon contact-icon-reddit"
          to="https://reddit.com/r/decentraland"
          target="_blank"
        />
        <Link
          className="contact-icon contact-icon-facebook hidden-xs"
          to="https://www.facebook.com/decentraland/"
          target="_blank"
        />
      </div>

      <p className="copyright">
        Copyright © 2018 Decentraland. All right reserved
      </p>
    </div>
  )
}
