import { Box, Stack, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

const siblingsCount = 2;

interface PaginationProps {
    totalOfRegisters: number
    perPage?: number
    currentPage?: number
    onPageChange: (page: number) => void
}

function generatePagesArray(from: number, to: number) {
    return [... new Array(to - from)]
        .map((_,index) => from + index +1)
        .filter(page => page > 0);
}

export function Pagination({ totalOfRegisters, perPage = 10, currentPage = 1, onPageChange }: PaginationProps) {
    const lastPage = Math.ceil(totalOfRegisters / perPage);
    const previuosPages = currentPage > 1 
        ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
        : [];

    const nextsPages = currentPage < lastPage 
        ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount,lastPage))
        : [];

    return (
        <Stack
            direction={["column","row"]}
            spacing="6"
            mt="8"
            justifyContent="space-between"
            align="center"
        >
            <Box>
                <strong>{perPage * (currentPage - 1) + 1}</strong> - <strong>{perPage * (currentPage - 1) + perPage}</strong> de <strong>{totalOfRegisters}</strong>
                <br />
                <strong>{lastPage}</strong>
            </Box>
            <Stack direction="row" spacing="2">
                {currentPage > (1 + siblingsCount) && (
                    <>
                        <PaginationItem onPageChange={onPageChange} page={1} />
                        {currentPage > (2 + siblingsCount) && (
                            <Text color="gray.300" w="8" textAlign="center">...</Text>
                        )}
                    </>
                )}
                {previuosPages.length > 0 && previuosPages.map(page => (
                    <PaginationItem onPageChange={onPageChange} key={page} page={page} />
                ))}

                <PaginationItem onPageChange={onPageChange} page={currentPage} isCurrent />

                {nextsPages.length > 0 && nextsPages.map(page => (
                    <PaginationItem onPageChange={onPageChange} key={page} page={page} />
                ))}
                {(currentPage + siblingsCount) < lastPage && (
                    <>
                        {(currentPage + siblingsCount + 1) < lastPage && (
                            <Text color="gray.300" w="8" textAlign="center">...</Text>
                        )}
                        <PaginationItem onPageChange={onPageChange} page={lastPage} />
                    </>
                )}
            </Stack>
        </Stack>
    )
}