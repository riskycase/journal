import dayjs, { Dayjs } from "dayjs";
import { Dispatch, SetStateAction, useState } from "react";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "./ui/popover";
import {
  Button,
  Flex,
  Icon,
  IconButton,
  PopoverBody,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { MdCalendarToday, MdChevronLeft, MdChevronRight } from "react-icons/md";

enum DatePickerStates {
  YEAR,
  MONTH,
  DATE,
}

type DatePickerElement = {
  display: string;
  date: Dayjs;
  style: "default" | "active" | "blur";
};

export default function DatePicker({
  date,
  setDate,
}: {
  date: Dayjs;
  setDate: Dispatch<SetStateAction<Dayjs>>;
}) {
  const [currentDate, setCurrentDate] = useState(date);
  const [currentState, setCurrentState] = useState(DatePickerStates.DATE);

  let startDate: Dayjs;

  switch (currentState) {
    case DatePickerStates.DATE:
      startDate = currentDate.startOf("month");
      break;
    case DatePickerStates.MONTH:
      startDate = currentDate.startOf("year");
      break;
    case DatePickerStates.YEAR:
      let startYear = currentDate.year() - (currentDate.year() % 12) - 4;
      if (currentDate.year() - startYear > 11) startYear += 12;
      startDate = currentDate.startOf("year").year(startYear);
      break;
  }

  function prevButton() {
    switch (currentState) {
      case DatePickerStates.DATE:
        setCurrentDate(currentDate.subtract(1, "month"));
        break;
      case DatePickerStates.MONTH:
        setCurrentDate(currentDate.subtract(1, "year"));
        break;
      case DatePickerStates.YEAR:
        setCurrentDate(currentDate.subtract(12, "years"));
        break;
    }
  }

  function nextButton() {
    switch (currentState) {
      case DatePickerStates.DATE:
        setCurrentDate(currentDate.add(1, "month"));
        break;
      case DatePickerStates.MONTH:
        setCurrentDate(currentDate.add(1, "year"));
        break;
      case DatePickerStates.YEAR:
        setCurrentDate(currentDate.add(12, "years"));
        break;
    }
  }

  function getTitle() {
    switch (currentState) {
      case DatePickerStates.DATE:
        return currentDate.format("MMM YYYY");
      case DatePickerStates.MONTH:
        return currentDate.format("YYYY");
      case DatePickerStates.YEAR:
        let startYear = currentDate.year() - (currentDate.year() % 12) - 4;
        if (currentDate.year() - startYear > 11) startYear += 12;
        return `${startYear} - ${startYear + 11}`;
    }
  }

  function getElements(): Array<DatePickerElement> {
    switch (currentState) {
      case DatePickerStates.DATE:
        const startDate = currentDate.startOf("month").startOf("week");
        const endDate = currentDate.endOf("month").endOf("week");
        return Array(endDate.diff(startDate, "days") + 1)
          .fill(1)
          .map((_value, index) => {
            const date = startDate.add(index, "days");
            return {
              display: date.date().toString(),
              date,
              style: date.isSame(currentDate)
                ? "active"
                : date.month() === currentDate.month()
                ? "default"
                : "blur",
            };
          });
      case DatePickerStates.MONTH:
        return Array(12)
          .fill(1)
          .map((_value, index) => {
            const date = currentDate.month(index);
            return {
              display: date.format("MMM"),
              date,
              style: currentDate.month() === index ? "active" : "default",
            };
          });
      case DatePickerStates.YEAR:
        let startYear = currentDate.year() - (currentDate.year() % 12) - 4;
        if (currentDate.year() - startYear > 11) startYear += 12;
        return Array(12)
          .fill(1)
          .map((_value, index) => {
            const date = currentDate.year(startYear + index);
            return {
              display: date.format("YYYY"),
              date,
              style:
                currentDate.year() === startYear + index ? "active" : "default",
            };
          });
    }
  }

  return (
    <PopoverRoot
      onPointerDownOutside={() => {
        setCurrentState(DatePickerStates.DATE);
        setCurrentDate(date);
      }}
    >
      <PopoverTrigger>
        <Flex
          direction="row"
          alignItems="center"
          borderColor="gray.50"
          borderWidth="thin"
          borderRadius={2}
          padding={2}
          gap={2}
        >
          <Text>{currentDate.format("DD/MM/YYYY")}</Text>
          <Icon aria-label="Open calendar UI">
            <MdCalendarToday />
          </Icon>
        </Flex>
      </PopoverTrigger>
      <PopoverContent width="20rem">
        <PopoverTitle>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            padding={2}
          >
            <IconButton
              variant="ghost"
              onClick={prevButton}
              disabled={startDate.isSame(dayjs("01/01/2000"))}
            >
              <MdChevronLeft />
            </IconButton>
            <Button
              fontSize="larger"
              onClick={() => {
                if (currentState === DatePickerStates.DATE) {
                  setCurrentState(DatePickerStates.MONTH);
                } else if (currentState === DatePickerStates.MONTH) {
                  setCurrentState(DatePickerStates.YEAR);
                }
              }}
              variant="subtle"
              disabled={currentState === DatePickerStates.YEAR}
            >
              {getTitle()}
            </Button>
            <IconButton variant="ghost" onClick={nextButton}>
              <MdChevronRight />
            </IconButton>
          </Flex>
        </PopoverTitle>
        <PopoverBody>
          <SimpleGrid
            columns={currentState === DatePickerStates.DATE ? 7 : 3}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            {currentState === DatePickerStates.DATE &&
              ["S", "M", "T", "W", "T", "F", "S"].map((value, index) => (
                <Text key={`D${index}`}>{value}</Text>
              ))}
            {getElements().map((dateData, index) => (
              <Button
                variant={dateData.style === "active" ? "solid" : "ghost"}
                color={
                  dateData.style === "blur"
                    ? "gray.500"
                    : dateData.style === "active"
                    ? "gray.700"
                    : "gray.50"
                }
                disabled={dateData.date.year() < 2000}
                key={index}
                onClick={() => {
                  setCurrentDate(dateData.date);
                  if (currentState === DatePickerStates.DATE) {
                    setDate(dateData.date);
                  } else if (currentState === DatePickerStates.MONTH) {
                    setCurrentState(DatePickerStates.DATE);
                  } else if (currentState === DatePickerStates.YEAR) {
                    setCurrentState(DatePickerStates.MONTH);
                  }
                }}
              >
                {dateData.display}
              </Button>
            ))}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
