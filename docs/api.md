# API documentation

## Data models
...

## REST API
Handles most of the communication between client and server.
**All endpoints require authentication except Login and Registration!**
The response is always in JSON format with this structure:
```
{
	code: "hello_world",
	message: "Hello, World!",
	data?: {
		...
	}
}
```
### Authentication & Profile management
Base path: `/user`
#### Login `POST /login`
Creates a new token for the user to use for authenticating on other endpoints.
##### Request body
```
{
	email: "john.doe@example.com",
	password: "verysecure"
}
```
##### Response on success
```
{
	code: "login_success",
	message: 'Login successful',
	data: {
		token: "HS256 JWT",
		user: { ... }
	}
}
```
##### Example response on fail
```
{
	code: "invalid_credentials",
	message: 'The email or password is incorrect'
}
```
#### Clear sessions `POST /clear_sessions`
Resets the user's session key thus de-authorizing any previous tokens.
No request body required.
##### Response on success
```
{
	code: "sessions_cleared",
	message: "Logged out of all sessions"
}
```
##### Example response on fail
```
{
	code: "unauthorized",
	message: 'You are not authorized to perform this action'
}
```
#### Get user `GET /:id?`
Retrieves a user's data based on their ID. If the ID parameter is not provided then it returns the currently logged in user's data.
##### Response on success
```
{
	code: "user_data",
	message: "User data retrieved",
	data: {
		user: { ... }
	}
}
```
##### Example response on fail
```
{
	code: "not_found",
	message: "This user does not exist",
}
```
#### Update profile `PATCH /update`
Updates the authenticated user's data. A password re-prompt is always required.
##### Request body
```
{
	name?: "John Doe",
	email?: "john.doe@example.com",
	new_password?: "verysecure",
	old_password: "1234"
}
```
##### Response on success
```
{
	code: "user_updated",
	message: "User data updated",
	data: {
		user: { ... }
	}
}
```
##### Example response on fail
```
{
	code: "password_required",
	message: 'The current password is required to complete this action'
}
```