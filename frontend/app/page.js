
import Image from "next/image";
import styles from "./page.module.css";
import TaskManager from "@/app/components/TaskManager";
import Reminder from "@/app/components/Reminder";
import "@/app/components/Reminder.module.scss";

export default function Home() {
  return (
    <>
      <Reminder />
      <TaskManager />
    </>
  );
}
