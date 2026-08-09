package main

import (
	"ApiGateway/app"
	config "ApiGateway/config/env"
)

func main() {
	config.Load()
	cfg := app.New_Config()
	server := app.New_Application(cfg)
	(*server).Run()
}
