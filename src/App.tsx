import React, { useState } from 'react'
import { generateData, UserData } from './components/dataGenerator'
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { Table, TableHead, TableBody, TableRow, TableCell } from './components/ui/table'
import './App.css'

const PAGE_SIZE = 10;
const TOTAL_PAGES = 100; // Total number of pages

const fetchData = async (page: number): Promise<UserData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allData = generateData(1000);
      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      resolve(allData.slice(startIndex, endIndex));
    }, 1000);
  });
};


const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageRange, setPageRange] = useState({ start: 1, end: 10 });

  const { data, isLoading, error } = useQuery<UserData[]>({
    queryKey: ['userData', page],
    queryFn: () => fetchData(page),
  });

  const columns: ColumnDef<UserData>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'address', header: 'Address' },
  ];

  const tableInstance = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handlePageRangeChange = (direction: 'next' | 'previous') => {
    setPageRange((prevRange) => {
      const newStart = direction === 'next' ? prevRange.start + 10 : prevRange.start - 10;
      const newEnd = direction === 'next' ? prevRange.end + 10 : prevRange.end - 10;

      return {
        start: Math.max(newStart, 1),
        end: Math.min(newEnd, TOTAL_PAGES),
      };
    });
  };

  const showNextButton = pageRange.end < TOTAL_PAGES;
  const showPreviousButton = pageRange.start > 1;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {String(error)}</div>;
  }
  return (
    <main>
    <p>Data Loaded</p> {/* Add this line */}
    <div>
      <Table>
        <TableHead>
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {tableInstance.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="pagination">
        {showPreviousButton && (
          <button onClick={() => handlePageRangeChange('previous')}>
            Previous
          </button>
        )}
        {Array.from({ length: pageRange.end - pageRange.start + 1 }, (_, i) => i + pageRange.start).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className={page === pageNumber ? 'active' : ''}
          >
            {pageNumber}
          </button>
        ))}
        {showNextButton && (
          <button onClick={() => handlePageRangeChange('next')}>
            Next
          </button>
        )}
      </div>
    </div>
  </main>
  );
};

export default App;

