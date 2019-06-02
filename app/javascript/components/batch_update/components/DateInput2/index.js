import React from 'react'
import PropTypes from 'prop-types'
import GenericAutosuggest from '../Autosuggest/GenericAutosuggest.js'
import chrono from 'chrono-node'
import moment from 'moment'

const parseDate = str => {
  let results = []

  const date = chrono.parseDate(str)
  if (date) {
    results.push({
      input: str,
      value: date.toISOString(),
      formatted: moment(date).format('MMMM Do YYYY, h:mm:ss a'),
    })
  }

  return Promise.resolve(results)
}

export const DateAutosuggest = ({ placeholder, onSelectDate }) => {
  return (
    <GenericAutosuggest
      id="date-autosuggest"
      placeholder={placeholder}
      fetchSuggestions={parseDate}
      getSuggestionValue={date => date.value}
      renderSuggestion={date => {
        return <div>{date.formatted}</div>
      }}
      selectSuggestion={date => {
        onSelectDate(date)
      }}
    />
  )
}

DateAutosuggest.propTypes = {
  placeholder: PropTypes.string,
  onSelectDate: PropTypes.func,
}

DateAutosuggest.defaultProps = {
  placeholder: 'Enter a date',
}
