import React from 'react'
import { DateAutosuggest } from '.'
import { mount } from 'enzyme'

it('renders', () => {
  const wrapper = mount(<DateAutosuggest placeholder="Do it" />)
  const node = wrapper.find('input').getDOMNode()
  expect(node.placeholder).toEqual('Do it')
})
