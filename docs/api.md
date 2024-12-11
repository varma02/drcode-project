# API documentation
Base URL: `/api`
**All endpoints require authentication except Login and Register!**
The response is always in JSON format, like this:
```
{
	code: "hello_world",
	message: "Hello, World!",
	data?: {
		...
	}
}
```

# Contents
[Data Models](#data-models)


## Data models
TODO: rewrite this section

## Authentication & Profile management `/auth`

### Login `POST /login`
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
	code: "success",
	message: 'Login successful',
	data: {
		token: "HS256 JWT",
		employee: { ... }
	}
}
```
##### Error codes
- `fields_required`: one or more of the required fields was not found in the body
- `invalid_credentials`: the user does not exist or the password is incorrect

### Register `POST /register`
Creates a new user when provided with a valid invite.
##### Request body
```
{
	invite_id: "invite:1234",
	name: "John Doe"
	email: "john.doe@example.com",
	password: "verysecure"
}
```
##### Response on success
```
{
	code: "success",
	message: 'Employee registered'
}
```
##### Error codes
- `fields_required`: one or more of the required fields was not found in the request body
- `invalid_password`: the password doesn't meet the requirements
- `invalid_invite`: the invite was not found or has already been used

### Clear sessions `POST /clear_sessions`
Resets the user's session key thus de-authorizing any previous tokens.
No request body required.
##### Response on success
```
{
	code: "success",
	message: "Logged out of all sessions"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to perform this action
- `bad_request`: an unexpected error has occurred

### Get logged in user `GET /me`
Gets the currently logged in user's data.
No request body required.
##### Response on success
```
{
	code: "success",
	message: "Employee data retrived",
	data: {
		employee: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to perform this action

### Update profile `PATCH /update`
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

## Employee management `/employee`

### Invite `POST /invite`
Administrators can Invite new users with this endpoint. Admin only.
##### Request body
```
{
	roles: [ ... ]   // a list of roles that the invited employee will have
}
```
##### Response on success
```
{
	code: "success",
	message: "Invite created",
	data: {
		invite: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body

### Get a list of all employees `GET /all`
Gets a list of all employees (without details). Admin only.
##### Response on success
```
{
	code: "success",
	message: "Employee data retrieved",
	data: {
		employee: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no employee with the provided ID

### Get a specific employee `GET /:id`
Retrives an employee's data, including the specified details.
##### Query parameters (Admin only)
- `include`: Get more details on fields (list separated by commas, ex: field1,field2)
	- `unpaid_work`: all the logged work for the given employee that hasn't been paid
	- `classes`: all classes where the employee is the assigned teacher
##### Response on success
```
{
	code: "success",
	message: "Employee data retrieved",
	data: {
		employee: { ... },
		unpaid_work?: [ ... ],
		classes?: [ ... ]
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no employee with the provided ID

### Remove an employee `DELETE /remove`
Removes an employee. Admin only.
##### Request body
```
{
	id: "employee:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Employee deleted"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no employee with the provided ID

### Update an employee `PATCH /update`
Updates an employee. Admin only!
##### Request body
```
{
	id: "employee:123",
	name: "John Doe",
	email: "john@example.com",
	roles: [ ... ]
}
```
##### Response on success
```
{
	code: "success",
	message: "Employee updated"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_invalid`: One or more fields are invalid
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no employee with the provided ID
