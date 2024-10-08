import { Card, CardBody, Tab, Tabs, Image, ScrollShadow, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider, CardHeader, Button, CardFooter, Avatar, Popover, PopoverTrigger, PopoverContent, User, Link } from "@nextui-org/react";
import CheckButton from "../components/CheckButton";
import { HiOutlineCalendarDays } from "react-icons/hi2";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-5 h-screen w-full p-5">
    <Card>
      <CardBody className="flex flex-col gap-6">
        <div className="flex gap-6 md:gap-4 items-center justify-center">
          <Image
            alt="Album cover"
            className="object-cover"
            height={200}
            shadow="md"
            src="https://programozzvelunk.hu/wp-content/uploads/2019/02/scratch.png"
            width="100%"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground/90 text-2xl">Következő óra</h3>
            <p className="text-foreground/80 text-lg">Scratch kezdő</p>
            <Divider className="my-2" />
            <h4 className="font-semibold text-foreground/90 text-xl">
              <span className="pr-2 text-foreground/70 font-medium">Helyszín:</span>
              Kodály Iskola
            </h4>
            <h4 className="font-semibold text-foreground/90 text-xl">
              <span className="pr-2 text-foreground/70 font-medium">Időpont:</span>
              10.14. 16:10 -17:10
            </h4>
            <h4 className="font-semibold text-foreground/90 text-xl">
              <span className="pr-2 text-foreground/70 font-medium">Diákok száma:</span>
              7
            </h4>
          </div>
        </div>
        <Table 
        removeWrapper 
        aria-label="Tanulók táblázat"
        classNames={{base:"overflow-auto", td:"text-xl"}}
        isHeaderSticky
        color="primary"
        selectionMode="single" 
        defaultSelectedKeys={[]}>
          <TableHeader>
            <TableColumn>NÉV</TableColumn>
            <TableColumn>OSZTÁLY</TableColumn>
            <TableColumn>JELENLÉT</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Tony Reichert</TableCell>
              <TableCell>1/a</TableCell>
              <TableCell className=""><CheckButton onText="Jelen" offText="Hiányzik" width="w-24"/></TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Zoey Lang</TableCell>
              <TableCell>3/b</TableCell>
              <TableCell className="min-w-28"><CheckButton onText="Jelen" offText="Hiányzik" width="w-24"/></TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>Jane Fisher</TableCell>
              <TableCell>2/d</TableCell>
              <TableCell className="min-w-28"><CheckButton onText="Jelen" offText="Hiányzik" width="w-24"/></TableCell>
            </TableRow>
            <TableRow key="4">
              <TableCell>William Howard</TableCell>
              <TableCell>1/a</TableCell>
              <TableCell className="min-w-28"><CheckButton onText="Jelen" offText="Hiányzik" width="w-24"/></TableCell>
            </TableRow>
            <TableRow key="5">
              <TableCell>William Howard</TableCell>
              <TableCell>1/a</TableCell>
              <TableCell className="min-w-28"><CheckButton onText="Jelen" offText="Hiányzik" width="w-24"/></TableCell>
            </TableRow>
            <TableRow key="6">
              <TableCell>William Howard</TableCell>
              <TableCell>1/a</TableCell>
              <TableCell className="min-w-28"><CheckButton onText="Jelen" offText="Hiányzik" width="w-24"/></TableCell>
            </TableRow>
            <TableRow key="7">
              <TableCell>William Howard</TableCell>
              <TableCell>1/a</TableCell>
              <TableCell className="min-w-28"><CheckButton onText="Jelen" offText="Hiányzik" width="w-24"/></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
    </Card>
      <div className="rounded-xl p-2 shadow-lg shadow-black/25 dark:bg-content1 col-span-1 row-span-2 font-bold flex flex-col gap-4">
        <h2 className="text-center text-3xl font-bold">Üzenetek</h2>
        <Tabs className="self-center" color="primary">
          <Tab title={"Mind"} key={"Mind"}/>
          <Tab title={"Üzenet"} key={"Üzenet"}/>
          <Tab title={"Helyettesítés"} key={"Szülők"}/>
        </Tabs>
        <ScrollShadow className="h-full p-2 gap-4 flex flex-col">
        <Card shadow="none">
          <CardHeader className="justify-between">
            <div className="flex gap-2 items-center ">
              <HiOutlineCalendarDays size={"2rem"} />
              <h4 className="text-lg font-semibold leading-none text-default-600">Helyettesítés</h4>
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 text-normal overflow-visible">
            <p>
            <Popover showArrow placement="bottom">
              <PopoverTrigger className="text-blue-500 w-max inline pr-2 cursor-pointer">
                @Váradi Marcell
              </PopoverTrigger>
              <PopoverContent className="p-2">
              <User
                name="Váradi Marcell" 
                description="Tanár"
                avatarProps={{src: "https://avatars.githubusercontent.com/u/30373425?v=4"}}
              />
              </PopoverContent>
            </Popover>
             Hétfői Scratch/Wedo 2.0 órámra keresünk helyettesítőt, <br/>
             a Kodály Iskolában 10.14-én 16:10-től 17:10-ig.
            </p>
          </CardBody>
          <CardFooter className="gap-3 justify-between">
            <Button color="primary" className="font-bold">Elvállalom</Button>
            <p className="text-default-400 text-right">
              <Popover showArrow placement="bottom">
                <PopoverTrigger className="cursor-pointer">
                  @Ivett Virág
                </PopoverTrigger>
                <PopoverContent className="p-2">
                <User
                  name="Ivett Virág" 
                  description="Adminisztrátor"
                  avatarProps={{src: "https://avatars.githubusercontent.com/u/30373425?v=4"}}
                />
                </PopoverContent>
              </Popover>
              2024.10.09
            </p>
          </CardFooter>
        </Card>
        <Divider/>
        </ScrollShadow>
      </div>
      <div className="rounded-xl p-2 shadow-lg shadow-black/25 dark:bg-content1 flex flex-col justify-center items-center">
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
  );
}