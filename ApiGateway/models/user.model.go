package models

import "time"

type User struct {
	Id        int64     `json:"id" db:"id"`
	Username  string    `json:"username" db:"username"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"-" db:"password"` // Hidden from JSON output
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}