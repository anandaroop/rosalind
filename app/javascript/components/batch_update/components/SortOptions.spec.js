import React from 'react'
import { mount } from 'enzyme'
import { SortOptions } from './SortOptions'

it('defaults to the current sort', () => {
  const wrapper = mount(<SortOptions sort="HIGHEST_PRICE" />)
  const select = wrapper.find('select')
  expect(select.prop('value')).toEqual('HIGHEST_PRICE')
})

it("updates the app's sort state when a new value is selected", () => {
  const updater = jest.fn()
  const wrapper = mount(<SortOptions updateState={updater} />)
  const select = wrapper.find('select')
  const option = wrapper.find('option').last()
  select.simulate('change', { target: option })
  expect(updater).toHaveBeenCalled()
})
