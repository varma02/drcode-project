import { Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";

export default function AreYouSureAlert({ 
  title, description, trigger, cancelText, confirmText, onConfirm, onCancel, disabled
}) {
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || <Button variant="outline" className="hover:bg-destructive" disabled={disabled}>
          <Trash /> Törlés
        </Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Biztosan törölni szeretnéd?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || "A kiválasztott elemek és a velük kapcsolatos minden adat törlődik. Ezt a műveletet nem lehet visszavonni!"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText || "Mégse"}
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {confirmText || "Törlés"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}