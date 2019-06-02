import React from 'react'
import { DateAutosuggest } from '.'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

storiesOf('DateAutosuggest', module).add('default', () => {
  return (
    <DateAutosuggest
      placeholder="Start typing a date to see suggestions"
      onSelectDate={action(`Selected date`)}
    />
  )
})
