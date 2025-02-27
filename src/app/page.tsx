"use client";

import Editor from "@/components/Editor";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import dayjs from "dayjs";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(dayjs().startOf("day"));
  return (
    <>
      <Navbar date={date} setDate={setDate} />
      <Editor date={date} />
      <Footer />
    </>
  );
}
