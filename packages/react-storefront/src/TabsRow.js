/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import classnames from 'classnames'
import Image from './Image'
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { PropTypes as MobxPropTypes, inject, observer } from 'mobx-react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import withStyles from '@material-ui/core/styles/withStyles'
import Link from './Link'

export const styles = theme => ({
  indicator: {
    height: '3px',
    transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
  },
  noSelection: {
    visibility: 'hidden'
  },
  root: {
    '& a': {
      textDecoration: 'none',
      color: 'inherit'
    }
  },
  tab: {
    fontWeight: 300,
    height: '100%',
    minWidth: '20px',
    position: 'relative'
  },
  selectedTab: {
    fontWeight: 500,
    opacity: 1
  },
  verticalSelected: {
    border: `2px solid ${theme.palette.grey[500]}`
  },
  scroller: {
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  link: {
    display: 'block',
    height: '100%',
    fontSize: theme.typography.body1.fontSize
  },
  centered: {
    '&::before,&::after': {
      display: 'block',
      content: "''",
      flex: 1
    }
  },
  vertical: {
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'column'
    }
  }
})

/**
 * A set of tabs.  Tabs are built from an array of model instances provided via the `items` prop.
 */
@withStyles(styles, { name: 'RSFTabsRow' })
@inject('app')
@observer
export default class TabsRow extends Component {
  static propTypes = {
    /**
     * Index of tab that should be selected by default
     */
    initialSelectedIdx: PropTypes.number,

    /**
     * Overridable classes object to allow customization of component
     */
    classes: PropTypes.objectOf(PropTypes.string),

    /**
     * Array of items that should be rendered
     */
    items: MobxPropTypes.arrayOrObservableArrayOf(
      PropTypes.shape({
        imageUrl: PropTypes.string,
        alt: PropTypes.string,
        text: PropTypes.string
      })
    ).isRequired,

    /**
     * Props for displayed images. See <Image /> component for details
     */
    imageProps: PropTypes.object,

    /**
     * Material-UI setting to control horizontal scrolling for tabs
     */
    scrollable: PropTypes.bool,

    /**
     * Callback function for tab change
     */
    onTabChange: PropTypes.func,

    /**
     * Set to true to center the tabs
     */
    centered: PropTypes.bool,

    /**
     * Determines whether to show the tabs horizontally or vertically
     */
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),

    /**
     * A function to override the default rendering of each tab's label.  The function is passed the MenuItem model
     * corresponding to the item to be rendered.
     */
    tabRenderer: PropTypes.func
  }

  static defaultProps = {
    items: [],
    variant: 'scrollable',
    orientation: 'horizontal',
    centered: false
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedIdx: props.initialSelectedIdx
    }
  }

  handleChange = (event, newValue) => {
    this.setState(
      {
        selectedIdx: newValue
      },
      () => {
        if (this.props.onTabChange) {
          this.props.onTabChange(event, newValue)
        }
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialSelectedIdx !== this.initialSelectedIdx) {
      this.setState({
        selectedIdx: nextProps.initialSelectedIdx
      })
    }
  }

  render() {
    const {
      app,
      tabRenderer,
      centered,
      items,
      classes,
      imageProps,
      scrollable,
      initialSelectedIdx,
      onTabChange,
      elevation,
      orientation,
      ...tabsProps
    } = this.props
    const { selectedIdx } = this.state

    return (
      <Tabs
        value={selectedIdx == null ? false : selectedIdx}
        onChange={this.handleChange}
        indicatorColor="secondary"
        variant={scrollable ? 'scrollable' : null}
        className={classes.root}
        classes={{
          root: classes.root,
          indicator: classnames(classes.indicator, {
            [classes.noSelection]: selectedIdx == null || orientation === 'vertical'
          }),
          flexContainer: classnames({
            [classes.centered]: centered,
            [classes.vertical]: orientation === 'vertical'
          }),
          scroller: classes.scroller
        }}
        {...tabsProps}
      >
        {items.map((item, i) => {
          let icon
          if (item.imageUrl) {
            icon = <Image src={item.imageUrl} alt={item.alt} {...imageProps} />

            if (app.amp && item.url) {
              icon = <Link to={item.url}>{icon}</Link>
            }
          }

          if (tabRenderer) {
            const itemWithClasses = {
              ...item,
              classes: {
                root: classes.tab
              }
            }
            return tabRenderer(itemWithClasses, i)
          } else {
            return (
              <Tab
                key={i}
                label={this.renderLabel(item)}
                icon={icon}
                classes={{
                  root: classes.tab,
                  selected: classes.selectedTab
                }}
              />
            )
          }
        })}
      </Tabs>
    )
  }

  renderLabel = item => {
    const { classes } = this.props

    return item.url ? (
      <Link
        className={classes.link}
        to={item.url}
        prefetch={item.prefetch}
        onClick={this.onLinkClick}
      >
        {item.text}
      </Link>
    ) : (
      item.text
    )
  }

  onLinkClick = e => {
    e.preventDefault()
  }
}
