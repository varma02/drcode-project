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
- [Data Models](#data-models)
- [Authentication & Profile management](#authentication--profile-management-auth)
- [Employee management](#employee-management-employee)
- [Group management](#group-management-group)
- [Location management](#location-management-location)
- [Lesson management](#lesson-management-lesson)
- [Event management](#event-management-event)
- [Subject management](#subject-management-subject)

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

### Get employees by ID `GET /get`
Retrieves employees' data, including the specified details.
##### Query parameters
- `ids`: the IDs of the employees to retrieve (list separated by commas, ex: field1,field2)
- `include`: Get more details on fields (list separated by commas, ex: field1,field2)
	- `unpaid_work`: all the logged work for the given employee that hasn't been paid
	- `groups`: all groups where the employee is the assigned teacher
##### Response on success
```
{
	code: "success",
	message: "Employee data retrieved",
	data: {
		employee: { ... },
		unpaid_work?: [ ... ],
		groups?: [ ... ]
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

### Get groups by ID `GET /get`
Retrieves groups' data, including the specified details.
##### Query parameters
- `ids`: the IDs of the groups to retrieve (list separated by commas, ex: field1,field2)
- `include`: Get more details on fields (list separated by commas, ex: field1,field2)
	- `enroled`: a list of enrolments to the group
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

### Get locations by ID `GET /get`
Retrieves locations' data.
##### Query parameters
- `ids`: the IDs of the locations to retrieve (list separated by commas, ex: field1,field2)
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

### Get all lessons between two dates `GET /between_dates`
Retrieves all lessons between the two dates provided (without details).
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

### Get lessons by ID `GET /get`
Retrieves lessons' data, including the specified details.
##### Query parameters
- `ids`: the IDs of the lessons to retrieve (list separated by commas, ex: field1,field2)
- `include`: Get more details on fields (list separated by commas, ex: field1,field2)
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

## Event management `/event`

### Get a list of all event `GET /all`
Gets a list of all event (without details).
##### Response on success
```
{
	code: "success",
	message: "All events retrieved",
	data: {
		events: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action

### Get all events between two dates `GET /between_dates`
Retrives all events between the two dates provided (without details).
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

### Get events by ID `GET /get`
Retrieves events' data, including the specified details.
##### Query parameters
- `ids`: the IDs of the events to retrieve (list separated by commas, ex: field1,field2)
##### Response on success
```
{
	code: "success",
	message: "Event retrieved",
	data: {
		Event: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no event with the provided ID

### Create an event `POST /create`
Creates a event. Admin only!
##### Request body
```
{
	name: "Nagykőrös toborzás",
	start: "2025-01-01T10:00:00Z",
	end: "2025-01-01T15:00:00Z",
	
	// the following are optional
	
	location: "location:123",
	signup_limit: 1,
	notes: "",
}
```
##### Response on success
```
{
	code: "success",
	message: "Event created",
	data: {
		event: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid

### Update a event `POST /update`
Updates a event. Admin only!
##### Request body
```
{
	id: "event:123"
	
	// the following are optional
	
	start: "2025-01-01T15:10:00Z",
	end: "2025-01-01T16:10:00Z",
	name: "Arany Hétfő 17:10",
	location: "location:123",
	signup_limit: 1,
	notes: "Lorem ipsum dolor..."
}
```
##### Response on success
```
{
	code: "success",
	message: "Event updated",
	data: {
		event: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid
- `not_found`: there is no event with the provided ID

### Remove a event `POST /remove`
Removes a event. Admin only.
##### Request body
```
{
	id: "event:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Event removed"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no event with the provided ID

## Subject management `/subject`

### Get a list of all subject `GET /all`
Gets a list of all subjects.
##### Response on success
```
{
	code: "success",
	message: "All subjects retrieved",
	data: {
		subjects: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action

### Get subjects by ID `GET /get`
Retrieves subjects' data.
##### Query parameters
- `ids`: the IDs of the subjects to retrieve (list separated by commas, ex: field1,field2)
##### Response on success
```
{
	code: "success",
	message: "Subject retrieved",
	data: {
		subject: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no subject with the provided ID

### Create an subject `POST /create`
Creates a subject. Admin only!
##### Request body
```
{
	name: "Scratch",

	// the following is optional

	notes: "",
}
```
##### Response on success
```
{
	code: "success",
	message: "Subject created",
	data: {
		subject: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid

### Update a subject `POST /update`
Updates a subject. Admin only!
##### Request body
```
{
	id: "subject:123"
	
	// the following are optional
	
	name: "Kodular",
	notes: "Lorem ipsum dolor..."
}
```
##### Response on success
```
{
	code: "success",
	message: "Subject updated",
	data: {
		subject: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid
- `not_found`: there is no subject with the provided ID

### Remove a subject `POST /remove`
Removes a subject. Admin only.
##### Request body
```
{
	id: "subject:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Subject removed"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no subject with the provided ID

## Student management `/student`

### Get a list of all student `GET /all`
Gets a list of all students.
##### Response on success
```
{
	code: "success",
	message: "All students retrieved",
	data: {
		students: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action

### Get students by ID `GET /get`
Retrieves students' data.
##### Query parameters
- `ids`: the IDs of the students to retrieve (list separated by commas, ex: field1,field2)
##### Response on success
```
{
	code: "success",
	message: "Student(s) retrieved",
	data: {
		students: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `not_found`: there is no student with the provided ID

### Create an student `POST /create`
Creates a student. Admin only!
##### Request body
```
{
	name: "Scratch",
	grade: 5,

	// the following is optional
	email: "gyerok@example.com",
	phone: "+3612345678",
	parent: {
		name: "Parent",
		email: "parent@example.com",
		phone: "+3612345678"
	},
	notes: ""
}
```
##### Response on success
```
{
	code: "success",
	message: "Student created",
	data: {
		student: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid

### Update a student `POST /update`
Updates a student. Admin only!
##### Request body
```
{
	id: "student:123",

	// the following is optional

	name: "Scratch",
	grade: 5,
	email: "gyerok@example.com",
	phone: "+3612345678",
	parent: {
		name: "Parent",
		email: "parent@example.com",
		phone: "+3612345678"
	},
	notes: ""
}
```
##### Response on success
```
{
	code: "success",
	message: "student updated",
	data: {
		student: { ... }
	}
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `bad_request`: One or more fields are invalid
- `not_found`: there is no student with the provided ID

### Remove a student `POST /remove`
Removes a student. Admin only.
##### Request body
```
{
	id: "student:123"
}
```
##### Response on success
```
{
	code: "success",
	message: "Student removed"
}
```
##### Error codes
- `unauthorized`: the user is not authorized to complete this action
- `fields_required`: one or more of the required fields was not found in the body
- `not_found`: there is no student with the provided ID