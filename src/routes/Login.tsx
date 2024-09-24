import { Button, Card, CardBody, CardHeader, Checkbox, Image, Input, Link } from "@nextui-org/react";
import { FormEvent } from "react";

export default function Login() {
	function formSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const email = form.get("email") as string;
		const password = form.get("password") as string;
		const remember = form.get("remember") as string;
		console.log(email, password, remember);
	}

	return (
	<div className="min-h-screen flex items-center justify-center">
			<Card className="p-4 max-w-sm">
				<CardHeader>
					<Image width={"100%"} classNames={{img:"rounded-none"}} alt="Dr. Code" src="/logo.png" />
				</CardHeader>
				<form onSubmit={formSubmit}>
					<CardBody className="gap-4">
						<Input required name="email" type="email" label="Email" placeholder="email@example.com" />
						<Input required name="password" type="password" label="Jelszó" placeholder="123456" />
						<div className="flex justify-between">
							<Checkbox name="remember">Emlékezzen rám</Checkbox>
							<Link href="/login/forgot_password">Elfelejtett jelszó</Link>
						</div>
						<Button type="submit" color="primary">Bejelentkezés</Button>
					</CardBody>
				</form>
			</Card>
	</div>
	)
}