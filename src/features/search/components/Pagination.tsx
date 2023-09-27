import React from 'react';
import { Button, Select } from '@chakra-ui/react'; // Adjust imports as needed.
import { calculatePageEndIndex } from '../utils/calculatePageEndIndex';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pagination: {
    totalResults: number;
    pageSize: number;
    totalPage: number;
  };
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, pagination }) => {
  return (
    <>
      {(pagination.totalResults && (
        <div className='flex flex-col sm:flex-row gap-3 justify-center md:justify-between items-center w-100 [&>*]:flex-1'>
          <div className=''>
            Showing {pagination.pageSize * currentPage + 1} -{' '}
            {calculatePageEndIndex(currentPage, pagination.pageSize, pagination.totalResults)} of {pagination.totalResults}{' '}
            available dogs
          </div>
          <div className='flex gap-4 justify-center'>
            <Button onClick={() => currentPage > 0 && setCurrentPage((page) => page - 1)}>Prev</Button>
            <Select
              maxW={'100px'}
              value={currentPage + 1}
              onChange={(e) => {
                const selectedPage = parseInt(e.target.value);
                if (!isNaN(selectedPage)) {
                  setCurrentPage(selectedPage - 1);
                }
              }}
            >
              {Array.from({ length: pagination.totalPage }, (_, index) => index + 1).map((pageNum) => (
                <option key={pageNum} value={pageNum}>
                  {pageNum}
                </option>
              ))}
            </Select>
            <Button onClick={() => currentPage + 1 < pagination.totalPage && setCurrentPage((page) => page + 1)}>
              Next
            </Button>
          </div>
          <div className='hidden sm:block px-2 text-right'>
            Page: {currentPage + 1}/{pagination.totalPage}
          </div>
        </div>
      )) ||
        ''}
    </>
  );
};

export default Pagination;
