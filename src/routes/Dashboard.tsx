import { Tab, Tabs } from "@nextui-org/react";
import Sidebar from "../components/Sidebar";
import MessageGroup from "../components/MessageGroup";
import Message from "../components/Message";
import { Student } from "../components/Student";

export default function Dashboard() {
  return (
    <div className="h-screen flex dark:bg-[#18181b] gap-4">
      <Sidebar />
      <div className="p-2 w-full">
        <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
          <div className="rounded-xl p-2 px-4 shadow-lg shadow-black/25 dark:bg-[#1b1b1f] col-span-1">
            <h2 className="text-center text-3xl font-bold mb-4">Következő óra</h2>
            <div className="flex justify-evenly">
              <div className="flex flex-col items-center gap-y-2">
                <p className="text-2xl font-bold text-center">Információ</p>
                <div className="flex gap-2 border-2 border-primary p-1 px-2 rounded-xl justify-between items-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#99cc33"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                  <p className="pb-1">16:00-17-00</p>
                </div>
                <div className="flex gap-2 border-2 border-primary p-1 px-2 rounded-xl justify-between items-center w-full">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#99cc33"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                  <p className="pb-1">Scratch</p>
                </div>
                <div className="flex gap-2 border-2 border-primary p-1 px-2 rounded-xl justify-between items-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#99cc33"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                  <p className="pb-1">Arany</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-y-2">
                <p className="text-2xl font-bold text-center">Diákok</p>
                <div className="flex flex-col gap-2">
                  <Student name="Student Name"/>
                  <Student name="Student Name2"/>
                  <Student name="Student Name22222"/>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-2 px-4 shadow-lg shadow-black/25 dark:bg-[#1b1b1f] col-span-1">
            <h2 className="text-center text-3xl font-bold mb-4">Következő óra</h2>
            <div className="flex justify-evenly">
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-bold text-center">Információ</p>
                <div className="grid grid-cols-2 items-center gap-y-2">
                  <p className="font-bold text-2xl bg-primary p-1 pl-2 rounded-l-xl">Idő</p>
                  <p className="p-1.5 pr-2 border-2 font-bold border-primary rounded-r-xl">16:00-17:00</p>
                  <p className="font-bold text-2xl bg-primary p-1 pl-2 rounded-l-xl">Kurzus</p>
                  <p className="p-1.5 pr-2 border-2 font-bold border-primary rounded-r-xl">Scratch</p>
                  <p className="font-bold text-2xl bg-primary p-1 pl-2 rounded-l-xl">Helyszín</p>
                  <p className="p-1.5 pr-2 border-2 font-bold border-primary rounded-r-xl">Arany</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-bold text-center">Diákok</p>
                <div className="flex flex-col gap-2">
                  <Student name="Student Name"/>
                  <Student name="Student Name2"/>
                  <Student name="Student Name22222"/>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-2 shadow-lg shadow-black/25 dark:bg-[#1b1b1f] col-span-1 row-span-2 font-bold overflow-y-auto">
            <h2 className="text-center text-3xl font-bold mb-4">Üzenetek</h2>
            <Tabs className="flex justify-center" color="primary">
              <Tab title={"Mind"} key={"Mind"}>
                <div className="flex flex-col gap-4">
                  <MessageGroup date="2024/09/27">
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                  </MessageGroup>
                  <MessageGroup date="2024/09/28">
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                  </MessageGroup>
                  <MessageGroup date="2024/09/29">
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                    <Message name="Szülő" message="lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum lorem Ipsum" />
                  </MessageGroup>
                </div>
              </Tab>
              <Tab title={"Szülők"} key={"Szülők"}>Szülők</Tab>
              <Tab title={"Központ"} key={"Központ"}>Központ</Tab>
              <Tab title={"Küldés"} key={"Küldés"}>Küldés</Tab>
            </Tabs>
          </div>
          <div className="rounded-xl p-2 shadow-lg shadow-black/25 dark:bg-[#1b1b1f] col-span-2 flex flex-col justify-center items-center">
            <p className="text-2xl font-bold">Segédletek</p>
            <div className="flex select-none">
              <div className="relative cursor-pointer hover:scale-[1.025] active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" height="12rem" viewBox="0 -960 960 960" width="12rem" fill="#99cc33"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>
                <p className="absolute top-0 left-0 w-full h-full flex justify-center items-center font-bold">Scratch</p>
              </div>
              <div className="relative cursor-pointer hover:scale-[1.025] active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" height="12rem" viewBox="0 -960 960 960" width="12rem" fill="#99cc33"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>
                <p className="absolute top-0 left-0 w-full h-full flex justify-center items-center font-bold">Webfejlesztés</p>
              </div>
              <div className="relative cursor-pointer hover:scale-[1.025] active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" height="12rem" viewBox="0 -960 960 960" width="12rem" fill="#99cc33"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>
                <p className="absolute top-0 left-0 w-full h-full flex justify-center items-center font-bold">WeDo 2.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}