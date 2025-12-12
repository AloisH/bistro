# Project Feature

Project CRUD operations.

## Files

- `project-service.ts` - Business logic (slug validation)
- `project-repository.ts` - DB queries (user-scoped)

## Dependencies

- Core: `utils/db`
- Shared: `#shared/schemas/project`

## API Routes

- GET/POST `/api/projects` - List/create
- GET/PUT/DELETE `/api/projects/:id` - Single project ops

## Operations

- List user projects
- Create (with slug uniqueness check)
- Get/update/delete (with ownership validation)
