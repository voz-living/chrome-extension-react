import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import PeerChatMessages from '../app/components/peerchat/PeerChatMessages';

test('has a .voz-living-message-list class name', t => {
  const wrapper = shallow(<PeerChatMessages />);
  t.true(wrapper.hasClass('voz-living-message-list'));
});
