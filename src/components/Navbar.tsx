"use client";

import { Box, Flex, Input, Text } from "@chakra-ui/react";
import DatePicker from "./DatePicker";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

export default function Navbar({
  date,
  setDate,
}: {
  date: Dayjs;
  setDate: Dispatch<SetStateAction<Dayjs>>;
}) {
  return (
    <header className="w-full sticky top-0 z-10">
      <Box width="100%" padding={4} backgroundColor="gray.700" color="gray.50">
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Text fontWeight="bold">Journal</Text>
          <DatePicker date={date} setDate={setDate} />
        </Flex>
      </Box>
    </header>
  );
}
