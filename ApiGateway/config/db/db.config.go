package config

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"time"
)

func SetUpDb() (*sql.DB, error) {

	dsn := "root:995528@tcp(127.0.0.1:3306)/staylio_apigateway_service?parseTime=true"

	// 2. Open the database handle
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error parsing DSN: %v", err)
		return nil, err
	}
	

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

