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

### Update profile `POST /update`
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
		employees: { ... }
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

### Remove an employee `POST /remove`
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

### Update an employee `POST /update`
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
	message: "Employee updated",
	data: {
		employee: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_invalid`: One or more fields are invalid
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no employee with the provided ID

## Group management `/group`

### Get a list of all groups `GET /all`
Gets a list of all groups (without details).
##### Response on success
```
{
	code: "success",
	message: "All groups retrieved",
	data: {
		groups: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action

### Get a specific group `GET /:id`
Retrives a group's data, including the specified details.
##### Query parameters
- `include`: Get more details on fields (list separated by commas, ex: field1,field2)
	- `teachers`: expand the teachers field to include employee data
	- `students`: a list of students enroled to the group
	- `subjects`: the subjects that students are enroled to
	- `lessons`: all lessons assigned to the selected group
##### Response on success
```
{
	code: "success",
	message: "Group retrieved",
	data: {
		group: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no group with the provided ID

### Create a group `POST /create`
Creates a group optionally with lessons. Admin only!
##### Request body
```
{
	name: "Arany Hétfő 17:10",
	location: "location:123",
	teachers: ["teacher:123", "teacher:321"],
	
	// the last two are optional
	
	notes: "",
	lessons: [
		{start:"2025-01-03T17:10:00+01:00", end: "2025-01-03T18:10:00+01:00"},
		...
	]
}
```
##### Response on success
```
{
	code: "success",
	message: "Group created",
	data: {
		group: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid

### Update a group `POST /update`
Updates a group. Admin only!
##### Request body
```
{
	id: "group:123"
	
	// the following are optional
	
	name: "Kodály Hétfő 17:10",
	location: "location:123",
	teachers: ["teacher:123", "teacher:321"],
	notes: "Lorem ipsum dolor...",
	archived: false
}
```
##### Response on success
```
{
	code: "success",
	message: "Group updated",
	data: {
		group: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid

### Remove a group `POST /remove`
Removes a group. Admin only.
##### Request body
```
{
	id: "group:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Group removed"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no group with the provided ID

## Location management `/location`

### Get a list of all locations `GET /all`
Gets a list of all locations.
##### Response on success
```
{
	code: "success",
	message: "All locations retrieved",
	data: {
		locations: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action

### Get a specific location `GET /:id`
Retrives a location's data.
##### Response on success
```
{
	code: "success",
	message: "Location retrieved",
	data: {
		location: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no location with the provided ID

### Create a location `POST /create`
Creates a location. Admin only!
##### Request body
```
{
	name: "Országház",
	address: "Budapest, Kossuth Lajos tér 1-3, 1055",
	contact_email: "info@parlament.hu",
	contact_phone: "+3614414000",
	
	//the last one is optional
	
	notes: "Lorem ipsum dolor..."
}
```
##### Response on success
```
{
	code: "success",
	message: "Location created",
	data: {
		group: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid

### Update a location `POST /update`
Updates a location. Admin only!
##### Request body
```
{
	id: "location:123"
	
	// the following are optional
	
	name: "Országház",
	address: "Budapest, Kossuth Lajos tér 1-3, 1055",
	contact_email: "info@parlament.hu",
	contact_phone: "+3614414000",
	notes: "Lorem ipsum dolor..."
}
```
##### Response on success
```
{
	code: "success",
	message: "Location updated",
	data: {
		group: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid

### Remove a location `POST /remove`
Removes a location. Admin only.
##### Request body
```
{
	id: "location:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Location removed"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no location with the provided ID

## Lesson management `/lesson`

### Get a list of all lessons `GET /all`
Gets a list of all lessons (without details).
##### Response on success
```
{
	code: "success",
	message: "All lessons retrieved",
	data: {
		lessons: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action

### Get all lessons between two dates `GET /between_detes`
Retrives all lessons between the two dates provided (without details).
##### Query parameters
- `start`: Start ISO8601 datetime
- `end`: End ISO8601 datetime
##### Response on success
```
{
	code: "success",
	message: "Lessons retrieved",
	data: {
		lessons: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: At least one query parameter is required

### Get a specific lesson `GET /:id`
Retrives a lesson's data, including the specified details.
##### Query parameters
- `include`: Get more details on fields (list separated by commas, ex: field1,field2)
	- `teachers`: expand the teachers field to include employee data
	- `students_attended`: a list of students who attended the lesson
	- `students_replaced`: a list of students who replaced another lesson with this one
##### Response on success
```
{
	code: "success",
	message: "Lesson retrieved",
	data: {
		lesson: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no lesson with the provided ID

### Create a lesson `POST /create`
Creates a lesson. Admin only!
##### Request body
```
{
	start: "2025-01-01T15:10:00Z",
	end: "2025-01-01T16:10:00Z",
	
	// the following are optional
	
	name: "Arany Hétfő 17:10",
	location: "location:123",
	teachers: ["teacher:123", "teacher:321"],
	notes: "",
	group: "group:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Group created",
	data: {
		group: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid

### Update a lesson `POST /update`
Updates a lesson. Admin only!
##### Request body
```
{
	id: "lesson:123"
	
	// the following are optional
	
	start: "2025-01-01T15:10:00Z",
	end: "2025-01-01T16:10:00Z",
	name: "Arany Hétfő 17:10",
	location: "location:123",
	teachers: ["teacher:123", "teacher:321"],
	notes: "",
	group: "group:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Lesson updated",
	data: {
		lesson: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid
- `not_found`: there is no lesson with the provided ID

### Remove a lesson `POST /remove`
Removes a lesson. Admin only.
##### Request body
```
{
	id: "lesson:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Lesson removed"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no lesson with the provided ID
