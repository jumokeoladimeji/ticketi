## HTTP ENDPOINTS

## User
| **HTTP method** | **Service layer method** | **Actions** |
| --- | --- | --- |
| POST /api/v1/user/signup  | user.signup() | create new user|
| GET /api/v1/user/signin  | user.signin() | user sigin |
| GET /api/v1/user/1/changeRole  | user.updateUser() | update user by admin |

## Tickets
| **HTTP method** | **Service layer method** | **Actions** |
| --- | --- | --- |
| GET /api/v1/tickets   | tickets.list() | get all Tickets |
| GET /api/v1/tickets/ticketsClosedInPastMonth    | tickets.ticketsClosedInPastMonth() | get all Tickets closed in one Month |
| PUT /api/v1/tickets /1/assign   | tickets.update() | assign ticket to agent |
| POST /api/v1/users/1/tickets   | tickets.create() | create new Ticket|
| GET /api/v1/users/1/tickets   | tickets.listByUserId() | get all Tickets created by a user |
| GET /api/v1/users/1/tickets/assignedToTickets   | tickets.listAssignedToTickets() | get all Tickets assigned to an agent |
| GET /api/v1/users/1/tickets/assignedToTickets/1   | tickets.listAssignedToTickets() | get one ticket assigned to an agent |
| PUT /api/v1/users/1/tickets/assignedToTickets/1   | tickets.markAsClosed() | close a ticket |
| GET /api/v1/tickets/1    | tickets.update() |  get on ticket|
| PUT /api/v1/tickets/1  | tickets.update() | update ticket by id |

## Comments
| **HTTP method** | **Service layer method** | **Actions** |
| --- | --- | --- |
| POST /api/v1/users/1/tickets/1/comments   | comment.create() | create new ticket comment|
| GET /api/v1/users/1/tickets/comments   | comment.list() | get all ticket comments |
| GET /api/v1/users/1/tickets/comments/1  | comment.getOne() | get all ticket comments |