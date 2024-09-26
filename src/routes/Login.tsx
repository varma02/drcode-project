import { Button, Card, CardBody, CardHeader, Checkbox, Divider, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
	const modalState = useDisclosure();
	const [isLoading, setLoading] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	function formSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrors([]);

		const form = new FormData(event.currentTarget);
		const email = form.get("email") as string;
		const password = form.get("password") as string;
		const remember = form.get("remember") as string;
		console.log(email, password, remember);

		const _errors: string[] = [];
		if (!email) _errors.push("no_email");
		if (!password) _errors.push("no_password");
		if (_errors.length) {
			setErrors(_errors);
			return;
		}

		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setErrors([...errors, "wrong_credentials"]);
			modalState.onOpen();
		}, 2000);
	}

	return (
		<>
		<Modal isOpen={modalState.isOpen} onOpenChange={modalState.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
								Sikertelen bejelentkezés
							</ModalHeader>
              <ModalBody>
                {errors.includes("wrong_credentials") && "Hibás email címet vagy jelszót adtál meg!"}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={onClose}>
                  Ok
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

		<div className="min-h-screen flex items-center justify-center">
			<Card className="p-4 max-w-sm">
				<CardHeader>
					<Image width={"100%"} classNames={{img:"rounded-none"}} alt="Dr. Code" src="/logo.png" />
				</CardHeader>
				<form onSubmit={formSubmit}>
					<CardBody className="gap-4">
						<Input isInvalid={errors.includes("no_email")} errorMessage="Az email cím megadása kötelező!" onFocus={()=>setErrors(errors.filter(e=>e!="no_email"))}
						 name="email" type="email" label="Email cím"  />
						<Input isInvalid={errors.includes("no_password")} errorMessage="A jelszó megadása kötelező!" onFocus={()=>setErrors(errors.filter(e=>e!="no_password"))}
						 name="password" type="password" label="Jelszó"  />
						<div className="flex justify-between">
							<Checkbox name="remember">Emlékezzen rám</Checkbox>
							<Link to={'/login/forgot-password'} className="text-primary">Elfelejtett jelszó</Link>
						</div>
						<Button type="submit" color="primary" isLoading={isLoading}>Bejelentkezés</Button>
					</CardBody>
				</form>
				<div className="relative py-4">
					<Divider />
					<span className="bg-background px-4 small-caps font-semibold absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">vagy</span>
				</div>
				<CardBody>
					<Button color="secondary"><img src="google_logo.svg" alt="Google logo" /> Folytatás Google-el</Button>
				</CardBody>
			</Card>
		</div>
		</>
	)
}