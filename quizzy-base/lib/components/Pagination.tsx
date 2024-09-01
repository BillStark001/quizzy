import React, { useState } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  HTMLChakraProps,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export type PaginationProps = HTMLChakraProps<'div'> & {
  currentPage: number;
  totalPages: number;
  nearPages?: number;
  setPage: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    currentPage: currentPageRaw,
    totalPages,
    nearPages: _nearPages,
    setPage,
    ...divProps
  } = props;

  const nearPages = Math.max(_nearPages || 4, 0);
  const [gotoPage, setGotoPage] = useState('');
  let pageOutRange = 0;
  let currentPage = currentPageRaw;
  if (currentPage < 1) {
    currentPage = 1;
    pageOutRange = -1;
  }
  if (currentPage > totalPages) {
    currentPage = totalPages;
    pageOutRange = 1;
  }

  const handlePageChange = (page: number) => {
    if (page < 1) {
      page = 1;
    }
    if (page > totalPages) {
      page = totalPages;
    }
    if (page !== currentPageRaw) {
      setPage(page);
    }
  };

  const _btn = (i: number, selected: boolean) => <Button
    key={i}
    onClick={() => handlePageChange(i)}
    colorScheme={selected ? "blue" : "gray"}
  >
    {i}
  </Button>

  const renderPageNumbers = () => {
    const startPageRaw = currentPage - nearPages;
    const endPageRaw = currentPage + nearPages;
    const startPageEllipsis = startPageRaw - 1 > 0;
    const endPageEllipsis = totalPages - endPageRaw > 0;

    const startPage = startPageEllipsis ? startPageRaw : 1;
    const endPage = endPageEllipsis ? endPageRaw : totalPages;


    const pages: JSX.Element[] = [];
    if (pageOutRange == -1) {
      pages.push(_btn(currentPageRaw, currentPageRaw == currentPageRaw));
    }
    if (startPageEllipsis) {
      pages.push(_btn(1, currentPageRaw == 1));
      pages.push(<Box>...</Box>);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(_btn(i, currentPageRaw == i));
    }
    if (endPageEllipsis) {
      pages.push(_btn(totalPages, currentPageRaw == totalPages));
      pages.push(<Box>...</Box>);
    }
    if (pageOutRange == 1) {
      pages.push(_btn(currentPageRaw, currentPageRaw == currentPageRaw));
    }
    return pages;
  };

  return (
    <HStack spacing={2} {...divProps}>
      <IconButton
        aria-label="first"
        icon={<ArrowLeftIcon />}
        onClick={() => handlePageChange(1)} 
        isDisabled={currentPageRaw <= 1}
      />
      <IconButton
        aria-label="prev"
        icon={<ChevronLeftIcon />}
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPageRaw <= 1}
      />
      {renderPageNumbers()}
      <IconButton
        aria-label="next"
        icon={<ChevronRightIcon />}
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPageRaw >= totalPages}
      />
      <IconButton
        aria-label="last"
        icon={<ArrowRightIcon />}
        onClick={() => handlePageChange(totalPages)}
        isDisabled={currentPageRaw >= totalPages}
      />
      <Box>
        <NumberInput
          size="sm"
          maxW={16}
          defaultValue={currentPage}
          min={1}
          max={totalPages}
          value={gotoPage}
          onChange={(valueString) => setGotoPage(valueString)}
        >
          <NumberInputField />
        </NumberInput>
      </Box>
      <IconButton
        aria-label="goto"
        icon={<CheckIcon />}
        onClick={() => {
          const p = Number(gotoPage);
          if (!Number.isNaN(p)) {
            handlePageChange(p);
          }
        }}
      />
    </HStack>
  );
};

export default Pagination;