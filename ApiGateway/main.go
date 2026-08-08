package main

import (
	"ApiGateway/app"
	dbConfig "ApiGateway/config/db"
	config "ApiGateway/config/env"
)

func main() {
	config.Load()
	dbConfig.SetUpDb()
	cfg := app.New_Config()
	server := app.New_Application(cfg)
	(*server).Run()
}
