import { Button, Card, CardBody, CardHeader, Image, Input } from "@nextui-org/react";

export default function Login() {
	return (
	<div className="min-h-screen flex items-center justify-center">
			<Card className="p-4">
				<CardHeader>
					<Image height={"5rem"} classNames={{img:"rounded-none"}} alt="Dr. Code" src="/logo.png" />
				</CardHeader>
				<CardBody className="gap-4">
					<Input type="email" label="Email" />
					<Input type="password" label="Jelszó" />
					<Button color="primary">Bejelentkezés</Button>
				</CardBody>
			</Card>
	</div>
	)
}