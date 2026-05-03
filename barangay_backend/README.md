# Barangay Issue Management Backend (Django)

## Implemented Core Features
- Issue reporting for infrastructure concerns with categories.
- Complaint/concern reporting module (noise, disturbance, safety, other).
- Photo upload and GPS/location fields.
- Status workflow: `pending`, `verified`, `in_progress`, `resolved`.
- Upvote system for prioritization.
- Worker assignment with due date and notes.
- Public dashboard summary endpoint.
- Complaints grouped by `purok` with aggregate counts.
- Comment and feedback system.
- Incident verification/public visibility fields.
- Role-based user model (`resident`, `staff`, `admin`, `purok_leader`).
- Emergency reporting endpoint.

## Project Structure
- `config/` Django settings and routing
- `apps/accounts/` user and role management
- `apps/reports/` issues, concerns, comments, upvotes, assignments, emergency

## Setup
1. Install Python 3.11+.
2. Create and activate virtual environment.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```
6. Run server:
   ```bash
   python manage.py runserver
   ```

## Main API Routes
- `/api/users/`
- `/api/puroks/`
- `/api/infrastructure-issues/`
- `/api/community-concerns/`
- `/api/upvotes/`
- `/api/assignments/`
- `/api/comments/`
- `/api/emergency-alerts/`
- `/api/dashboard/summary/`

## Notes
- Authentication is currently session/basic DRF defaults. You can add JWT next.
- Optional features (SMS notifications, map integration, gamification, maintenance scheduling) can be added as separate apps or services.