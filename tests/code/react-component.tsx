import React from 'react';
import { Panel } from '@xingternal/winery/lib/Panel';
import { Box, Flex } from '@xingternal/winery/lib/UI';

type SubHeaderProps = {
  title: string;
  subTitle: string;
};

const greeting: string = 'Hello'

export const foo = function () {
  const username = 'John'
  console.log(`${greeting} ${username}`)
}

export const MyComponent = () => <div>Hello from React</div>
