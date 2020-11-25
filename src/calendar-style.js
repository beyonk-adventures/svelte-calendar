'use strict'

class CalendarStyle {
  constructor (overrides = {}) {
    this.style = ''
    this.buttonBackgroundColor = '#fff'
    this.buttonBorderColor = '#eee'
    this.buttonTextColor = '#333'
    this.highlightColor = '#f7901e'
    this.passiveHighlightColor = '#FCD9B1'
    this.dayBackgroundColor = 'none'
    this.dayTextColor = '#4a4a4a'
    this.dayHighlightedBackgroundColor = '#efefef'
    this.dayHighlightedTextColor = '#4a4a4a'

    Object.entries(overrides).forEach(([ prop, value ]) => {
      this[prop] = value
    })
  }

  toWrapperStyle () {
    return `
      --button-background-color: ${this.buttonBackgroundColor};
      --button-border-color: ${this.buttonBorderColor};
      --button-text-color: ${this.buttonTextColor};
      --highlight-color: ${this.highlightColor};
      --passive-highlight-color: ${this.passiveHighlightColor};
      --day-background-color: ${this.dayBackgroundColor};
      --day-text-color: ${this.dayTextColor};
      --day-highlighted-background-color: ${this.dayHighlightedBackgroundColor};
      --day-highlighted-text-color: ${this.dayHighlightedTextColor};
      ${this.style}
    `
  }
}

export {
  CalendarStyle
}
