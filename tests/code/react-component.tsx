import React from 'react';
import { Panel } from '@xingternal/winery/lib/Panel';
import { Button } from '@xingternal/winery/lib/Button';
import { Box, Flex } from '@xingternal/winery/lib/UI';

type SubHeaderProps = {
  title: string;
  subTitle: string;
};

const a = useParams<{ briefingId: string }>();

const greeting: string = 'Hello'

export const foo = function () {
  const username = 'John'
  console.log(`${greeting} ${username}`)
}

export const MyComponent = () => <div>Hello from React</div>
