/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { inject } from 'mobx-react'
import NoScript from '../NoScript'
import { absoluteURL } from '../utils/url'

@inject('app')
export default class SEOLinks extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const levels = this.props.app.menu.levels
    const root = levels.length && levels[0]

    if (!root) return null

    let links = [],
      key = 0

    const findLinks = ({ items }) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        if (item.url) {
          links.push(
            <a key={key++} href={absoluteURL(item.url)}>
              {item.text}
            </a>
          )
        }

        if (item.items) {
          findLinks(item)
        }
      }
    }

    findLinks(root)

    return (
      <Fragment>
        <NoScript>
          <nav
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '1px',
              width: '1px',
              overflow: 'hidden'
            }}
          >
            {links}
          </nav>
        </NoScript>
      </Fragment>
    )
  }
}
