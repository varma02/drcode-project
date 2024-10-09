import { Card, CardBody, Tab, Tabs, Image, ScrollShadow, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider, CardHeader, Button, CardFooter } from "@nextui-org/react";
import { HiOutlineCalendarDays, HiOutlineChatBubbleLeftRight, HiOutlineDocumentText, HiOutlineEnvelope, HiOutlineFolder } from "react-icons/hi2";
import CheckButton from "../components/CheckButton";
import UserPopover from "../components/UserPopover";

export default function Dashboard() {
  return (
  <div className="grid grid-cols-2 grid-rows-2 gap-5 h-screen w-full p-5">
    <Card className="p-4">
      <CardHeader className="flex gap-6 md:gap-4 items-center justify-between">
        <div className="flex flex-col pl-2">
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
        <Image
          alt="Album cover"
          className="object-cover"
          height={200}
          shadow="md"
          src="https://programozzvelunk.hu/wp-content/uploads/2019/02/scratch.png"
          width="100%"
        />
      </CardHeader>
      <CardBody className="flex flex-col gap-6">
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
    <Card className="row-span-2 p-4">
      <CardHeader className="flex-col px-6 pt-4 gap-4">
        <h2 className="text-center text-3xl font-bold">Üzenetek</h2>
        <Tabs className="self-center" color="primary">
          <Tab title={"Mind"} key={"Mind"}/>
          <Tab title={"Üzenet"} key={"Üzenet"}/>
          <Tab title={"Helyettesítés"} key={"Szülők"}/>
        </Tabs>
      </CardHeader>
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
            <UserPopover user={{name: "Váradi Marcell", role: {name: "Tanár"}, avatar: "https://avatars.githubusercontent.com/u/30373425?v=4"}} />
              Hétfői Scratch/Wedo 2.0 órámra keresünk helyettesítőt, <br/>
              a Kodály Iskolában 10.14-én 16:10-től 17:10-ig.
            </p>
          </CardBody>
          <CardFooter className="gap-3 justify-between">
            <Button color="primary" className="font-bold">Elvállalom</Button>
            <p className="text-default-400 text-right">
              <UserPopover user={{name: "Ivett Virág", role: {name: "Adminisztrátor"}, avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"}} className="pr-0 text-default-400" />
              <br/>
              2024.10.09.
            </p>
          </CardFooter>
        </Card>
        <Divider/>
        <Card shadow="none">
          <CardHeader className="justify-between">
            <div className="flex gap-2 items-center ">
              <HiOutlineEnvelope size={"2rem"} />
              <h4 className="text-lg font-semibold leading-none text-default-600">Üzenet</h4>
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 text-normal overflow-visible">
            <p>
              Sziasztok! A 9-est utoljára ki használta? Tegnap, vagy szombaton volt használatban?
            </p>
          </CardBody>
          <CardFooter className="gap-3 justify-between">
            <Button color="secondary" className="font-bold"><HiOutlineChatBubbleLeftRight size="1.5rem" /> 2 válasz</Button>
            <p className="text-default-400 text-right">
              <UserPopover user={{name: "András Palotai", role: {name: "Adminisztrátor"}, avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"}} className="pr-0 text-default-400" />
              <br/>
              2024.09.28.
            </p>
          </CardFooter>
        </Card>
        <Divider/>
      </ScrollShadow>
    </Card>
    <Card className="p-4">
      <CardHeader>
        <h3 className="font-semibold text-foreground/90 text-2xl">Segédletek</h3>
      </CardHeader>
      <CardBody>
        <div className="flex gap-4 flex-wrap">
          <Button variant="ghost" className="text-lg p-5 gap-4"><HiOutlineFolder size={"1.4rem"} /> Scratch</Button>
          <Button variant="ghost" className="text-lg p-5 gap-4"><HiOutlineFolder size={"1.4rem"} /> Lego WeDo 1.0</Button>
          <Button variant="ghost" className="text-lg p-5 gap-4"><HiOutlineFolder size={"1.4rem"} /> Lego WeDo 2.0</Button>
          <Button variant="ghost" className="text-lg p-5 gap-4"><HiOutlineFolder size={"1.4rem"} /> Webfejlesztés</Button>
          <Button variant="ghost" className="text-lg p-5 gap-4"><HiOutlineFolder size={"1.4rem"} /> Unity 3D</Button>
          <Button variant="ghost" className="text-lg p-5 gap-4"><HiOutlineFolder size={"1.4rem"} /> Kodular</Button>
          <Button variant="ghost" className="text-lg p-5 gap-4"><HiOutlineFolder size={"1.4rem"} /> Godot</Button>
        </div>
        <div className="pt-8 flex gap-4 flex-1">
          <Button variant="ghost" className="flex-1 h-max flex flex-col text-lg p-4">
            <div className="flex items-center w-full gap-2">
              <HiOutlineDocumentText size={"1.4rem"} />
              Módszertani segédlet
            </div>
            <Image src="temp-document-preview.png"/>
          </Button>
          <Button variant="ghost" className="flex-1 h-max flex flex-col text-lg p-4">
            <div className="flex items-center w-full gap-2">
              <HiOutlineDocumentText size={"1.4rem"} />
              Scratch 2.félév 12.óra
            </div>
            <Image src="temp-document-preview.png"/>
          </Button>
          <Button variant="ghost" className="flex-1 h-max flex flex-col text-lg p-4">
            <div className="flex items-center w-full gap-2">
              <HiOutlineDocumentText size={"1.4rem"} />
              WeDo 2.0 1.félév 5.óra
            </div>
            <Image src="temp-document-preview.png"/>
          </Button>
        </div>
      </CardBody>
    </Card>
  </div>
  );
}