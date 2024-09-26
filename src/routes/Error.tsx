import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError() as any;

  return (
  <div className="min-h-screen flex justify-center items-center">
    <Card className="max-w-96 p-4">
      {error.status == 404 ? (<>
        <CardHeader className="text-2xl font-bold justify-center">
          404 - Nem található
        </CardHeader>
        <CardBody className="text-xl">
          A keresett oldal nem található.
        </CardBody>
      </>): (<>
        <CardHeader className="text-2xl font-bold justify-center">
          {error.status && `${error.status} -`} Hiba
        </CardHeader>
        <CardBody className="text-xl">
          Váratlan hiba lépett fel.
        </CardBody>
      </>)}
      <CardFooter className="gap-4 flex">
        <Button fullWidth onPress={()=>window.location.reload()}>Újratöltés</Button>
        <Button fullWidth color="primary" onPress={()=>window.history.back()}>Vissza</Button>
      </CardFooter>
    </Card>
  </div>
  );
}