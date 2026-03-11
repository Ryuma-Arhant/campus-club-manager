CREATE TABLE IF NOT EXISTS memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  club_id INT NOT NULL,
  role ENUM('member','president','vice_president','secretary','treasurer') DEFAULT 'member',
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_membership (user_id, club_id),
  INDEX idx_user_id (user_id),
  INDEX idx_club_id (club_id),
  INDEX idx_status (status)
);
