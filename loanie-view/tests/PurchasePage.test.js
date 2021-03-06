import React from 'react';
import { shallow, configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import PurchasePage from '../src/Component/PurchasePage';

configure({ adapter: new Adapter() });
const wrapper = shallow(<PurchasePage />);

describe('<PurchasePage />', () => {
  it('should have a header which is the title of the page', () => {
    expect(wrapper.find('h1')).have.length(1);
  });
});
