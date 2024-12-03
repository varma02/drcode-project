# API documentation

## Data models
TODO: rewrite this section

## REST API `/api`
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

### Authentication & Profile management `/user`

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
##### Error codes
- `fields_required`: one or more of the required fields was not found in the body
- `invalid_credentials`: the user does not exist or the password is incorrect

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
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `bad_request`: an unexpected error has occurred

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
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no user with the provided ID

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
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `password_required`: the user's current password is required to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `invalid_password`:  the password must contain at least one lowercase letter, uppercase letter, number, special character, and be at least 8 characters long
- `bad_request`: an unexpected error has occurred