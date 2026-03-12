USE campus_club_manager;

-- Pre-hashed bcrypt values for "password" (10 rounds)
INSERT INTO users (name, email, password, role) VALUES
('Super Admin', 'admin@campus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin'),
('Alice Admin', 'alice@campus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'club_admin'),
('Bob Admin', 'bob@campus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'club_admin'),
('Charlie Student', 'charlie@campus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Diana Lee', 'diana@campus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Evan Park', 'evan@campus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Fiona Chen', 'fiona@campus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('George Kim', 'george@campus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

INSERT INTO clubs (name, description, category, status, admin_id, max_members) VALUES
('Tech Innovators', 'A club for tech enthusiasts to explore coding, AI, and emerging technologies.', 'Technology', 'approved', 2, 100),
('Art Society', 'Celebrating creativity through painting, sculpture, digital art, and exhibitions.', 'Arts', 'approved', 3, 60),
('Debate Club', 'Sharpen your public speaking and critical thinking skills through competitive debate.', 'Academic', 'pending', NULL, 40);

INSERT INTO memberships (user_id, club_id, role, status) VALUES
(2, 1, 'president', 'approved'),
(3, 2, 'president', 'approved'),
(4, 1, 'member', 'approved'),
(4, 2, 'member', 'approved'),
(5, 1, 'secretary', 'approved'),
(6, 1, 'member', 'pending'),
(7, 2, 'member', 'approved'),
(7, 3, 'member', 'pending'),
(8, 1, 'member', 'rejected'),
(8, 2, 'treasurer', 'approved');

INSERT INTO events (club_id, title, description, location, event_date, end_date, capacity, status, created_by) VALUES
(1, 'Hackathon 2026', 'A 24-hour coding competition to build innovative solutions.', 'Engineering Building A', '2026-04-15 09:00:00', '2026-04-16 09:00:00', 80, 'upcoming', 2),
(1, 'AI Workshop', 'Hands-on workshop exploring machine learning fundamentals.', 'Computer Lab 3', '2026-04-22 14:00:00', '2026-04-22 17:00:00', 30, 'upcoming', 2),
(2, 'Spring Art Exhibition', 'Annual showcase of student artwork and photography.', 'Campus Gallery', '2026-04-10 10:00:00', '2026-04-10 18:00:00', 200, 'upcoming', 3),
(2, 'Watercolor Workshop', 'Beginner-friendly watercolor painting session.', 'Art Studio B', '2026-03-15 13:00:00', '2026-03-15 16:00:00', 20, 'completed', 3);

INSERT INTO rsvps (event_id, user_id, status) VALUES
(1, 4, 'going'), (1, 5, 'going'), (1, 6, 'maybe'),
(2, 4, 'going'), (2, 7, 'going'),
(3, 4, 'going'), (3, 7, 'going'),
(4, 4, 'going');
