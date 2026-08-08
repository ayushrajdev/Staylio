package config

import (
	"database/sql"
	"fmt"
	"log"
	"time"
	_ "github.com/go-sql-driver/mysql"
)

func SetUpDb() (*sql.DB, error) {

	dsn := "root:995528@tcp(127.0.0.1:3306)/staynest?parseTime=true"

	// 2. Open the database handle
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error parsing DSN: %v", err)
		return nil, err
	}
	defer db.Close() // Ensure pool closes when main exits

	// 3. Set connection pool configurations
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// 4. Force a connection test immediately via Ping
	if err := db.Ping(); err != nil {
		log.Fatalf("Database connection failed: %v", err)
		return nil, err
	}

	fmt.Println("Successfully connected to MySQL database!")
	return db, nil	
}