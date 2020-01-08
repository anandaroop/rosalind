import React from 'react'
import { SelectSmall, Box } from '@artsy/palette'

export const SortOptions = props => {
  const { sort, updateState } = props

  return (
    <Box mt={2}>
      <SelectSmall
        title="Sort"
        options={[
          { text: 'Recently published', value: 'RECENTLY_PUBLISHED' },
          { text: 'Recently updated', value: 'RECENTLY_UPDATED' },
          {
            text: 'Recent acquireability change',
            value: 'RECENTLY_CHANGED_ACQUIREABILITY',
          },
          {
            text: 'Merchandisability',
            value: 'MERCHANDISABILITY',
          },
          { text: 'Highest price', value: 'HIGHEST_PRICE' },
          { text: 'Lowest price', value: 'LOWEST_PRICE' },
          { text: 'Largest dimensions', value: 'LARGEST' },
          { text: 'Smallest dimensions', value: 'SMALLEST' },
        ]}
        selected={sort}
        onSelect={value => {
          updateState('sort', value)
        }}
      />
    </Box>
  )
}
