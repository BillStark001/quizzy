// from https://github.com/mustaphaturhan/chakra-ui-markdown-renderer

/**
MIT License

Copyright (c) 2020 Mustafa Turhan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import * as React from 'react';
import deepmerge from 'deepmerge';
import { Components } from 'react-markdown';
import {
  Code,
  Divider,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';

type GetCoreProps = {
  children?: React.ReactNode;
  'data-sourcepos'?: any;
};

function getCoreProps(props: GetCoreProps): any {
  return props['data-sourcepos']
    ? { 'data-sourcepos': props['data-sourcepos'] }
    : {};
}

interface Defaults extends Components {
  /**
   * @deprecated Use `h1, h2, h3, h4, h5, h6` instead.
   */
  heading?: Components['h1'];
}

export const defaults: Defaults = {
  p: props => {
    const { children } = props;
    return <Text mb={2}>{children}</Text>;
  },
  em: props => {
    const { children } = props;
    return <Text as="em">{children}</Text>;
  },
  blockquote: props => {
    const { children } = props;
    return (
      <Code as="blockquote" p={2}>
        {children}
      </Code>
    );
  },
  code: props => {
    const { inline, children, className } = props;

    if (inline) {
      return <Code p={2} children={children} />;
    }

    return (
      <Code
        className={className}
        whiteSpace="break-spaces"
        display="block"
        w="full"
        p={2}
        children={children}
      />
    );
  },
  del: props => {
    const { children } = props;
    return <Text as="del">{children}</Text>;
  },
  hr: _ => {
    return <Divider />;
  },
  a: Link,
  img: Image,
  text: props => {
    const { children } = props;
    return <Text as="span">{children}</Text>;
  },
  ul: props => {
    const { ordered, children, depth } = props;
    const attrs = getCoreProps(props);
    let Element = UnorderedList;
    let styleType = 'disc';
    if (ordered) {
      Element = OrderedList;
      styleType = 'decimal';
    }
    if (depth === 1) styleType = 'circle';
    return (
      <Element
        spacing={2}
        as={ordered ? 'ol' : 'ul'}
        styleType={styleType}
        pl={4}
        {...attrs}
      >
        {children}
      </Element>
    );
  },
  ol: props => {
    const { ordered, children, depth } = props;
    const attrs = getCoreProps(props);
    let Element = UnorderedList;
    let styleType = 'disc';
    if (ordered) {
      Element = OrderedList;
      styleType = 'decimal';
    }
    if (depth === 1) styleType = 'circle';
    return (
      <Element
        spacing={2}
        as={ordered ? 'ol' : 'ul'}
        styleType={styleType}
        pl={4}
        {...attrs}
      >
        {children}
      </Element>
    );
  },
  li: props => {
    const { children, checked } = props;
    let checkbox = null;
    if (checked !== null && checked !== undefined) {
      checkbox = (
        <Checkbox isChecked={checked} isReadOnly>
          {children}
        </Checkbox>
      );
    }
    return (
      <ListItem
        {...getCoreProps(props)}
        listStyleType={checked !== null ? 'none' : 'inherit'}
      >
        {checkbox || children}
      </ListItem>
    );
  },
  heading: props => {
    const { level, children } = props;
    const sizes = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    return (
      <Heading
        my={4}
        as={`h${level}`}
        size={sizes[`${level - 1}`]}
        {...getCoreProps(props)}
      >
        {children}
      </Heading>
    );
  },
  pre: props => {
    const { children } = props;
    return <chakra.pre {...getCoreProps(props)}>{children}</chakra.pre>;
  },
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: props => <Tr>{props.children}</Tr>,
  td: props => <Td>{props.children}</Td>,
  th: props => <Th>{props.children}</Th>,
};

function ChakraUIRenderer(theme?: Defaults, merge = true): Components {
  const elements = {
    p: defaults.p,
    em: defaults.em,
    blockquote: defaults.blockquote,
    code: defaults.code,
    del: defaults.del,
    hr: defaults.hr,
    a: defaults.a,
    img: defaults.img,
    text: defaults.text,
    ul: defaults.ul,
    ol: defaults.ol,
    li: defaults.li,
    h1: defaults.heading,
    h2: defaults.heading,
    h3: defaults.heading,
    h4: defaults.heading,
    h5: defaults.heading,
    h6: defaults.heading,
    pre: defaults.pre,
    table: defaults.table,
    thead: defaults.thead,
    tbody: defaults.tbody,
    tr: defaults.tr,
    td: defaults.td,
    th: defaults.th,
  };

  if (theme && merge) {
    return deepmerge(elements, theme);
  }

  return elements;
}

export default ChakraUIRenderer;